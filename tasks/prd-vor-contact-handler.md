# PRD: VOR Contact Handler — CRM + Immediate Response

## 1. Overview

**Feature Name:** VOR Contact Handler (Phase 1 — Async Handler)

**Description:** Replace the current Selah access-request service (a standalone FastAPI process on port 3201 that writes to a flat JSON file with no notification) with a proper contact pipeline. A new endpoint on Ezra's FastAPI server receives form POSTs, writes to a SQLite CRM database, and triggers an async handler that immediately sends Troy a Telegram alert and sends the submitter a personalized welcome email via the existing iCloud SMTP skill.

**Problem:** The current `services/access-request/server.py` runs as a separate process that Troy does not monitor. Submissions land in a JSON file and go unnoticed. There is no response to the submitter. The service is also a second daemon to maintain with its own port, its own requirements, and no integration with the rest of the local infrastructure.

**Phase 1 scope:** Async handler — event-driven, immediate, no new agent runtime. The form POST hits Ezra, a coroutine wakes, does its work, and returns. This is intentionally simple and correct for current volume.

**Phase 2 vision (not in scope here):** A dedicated VOR agent — a standalone process built alongside Ezra, with its own agent ID, its own manifest, its own memory, and access to Ezra's two-tiered skill system. The VOR agent would handle CRM queries conversationally, manage follow-ups, drive ministry relationship workflows, and grow into a full ministry operations layer. The SQLite CRM schema defined in Phase 1 is designed to support this without migration.

---

## 2. Architecture

```
VOR /selah form (static Cloudflare Pages)
  └─ POST /api/vor/contact
       └─ NGINX on Mac Mini → Ezra :8400

Ezra FastAPI
  └─ POST /api/vor/contact
       ├─ writes to data/vor_crm.db (SQLite)
       └─ drops ContactEvent onto asyncio.Queue

Contact Handler (background coroutine, always running)
  └─ wakes on ContactEvent
       ├─ LLM call → drafts personalized welcome email
       ├─ send_email → submitter (iCloud SMTP)
       ├─ Telegram alert → Troy
       └─ marks contact as handled in CRM
```

**Why not a cron/poll loop:** The poll model introduces unnecessary latency (up to N minutes delay) and requires a cursor to track "last seen." An asyncio Queue is the correct primitive -- the handler wakes exactly when work arrives, costs nothing when idle, and runs in the same event loop as Ezra with no additional process or port.

**Why not inside Ezra's main agent thread:** Ezra's agent carries its own context and conversation memory. Contact handling is a distinct, bounded task that should not contribute to token overhead or conversation history. The handler runs as a background coroutine that uses Ezra's tools (email transport, Telegram) directly -- not through the agent LLM graph. The one LLM call for email personalization is a direct provider call, not a graph invocation.

---

## 3. CRM Schema

File: `data/vor_crm.db` (SQLite, local to Mac Mini, alongside other Ezra data files)

```sql
CREATE TABLE contacts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL,
    message         TEXT DEFAULT '',
    source          TEXT DEFAULT 'selah',   -- 'selah', 'blog', etc. for future forms
    timestamp       TEXT NOT NULL,          -- ISO 8601 UTC
    status          TEXT DEFAULT 'new',     -- 'new' | 'notified' | 'replied' | 'archived'
    response_sent_at TEXT,                  -- ISO 8601 UTC, null until email sent
    notes           TEXT DEFAULT ''         -- for future manual annotation
);
```

`source` is included now so future contact forms (blog general contact, music mailing list) can share the same database without a schema migration.

---

## 4. Working Backlog

### STORY-01: CRM Database + Ezra Endpoint

**Acceptance Criteria:**
- [ ] `data/vor_crm.db` is created on first startup if it does not exist
- [ ] `POST /api/vor/contact` accepts `{name, email, message}`, validates with Pydantic, writes a new row to the `contacts` table with `status = 'new'`
- [ ] Endpoint returns `{"status": "ok"}` on success, `422` on validation failure
- [ ] CORS header allows requests from `https://www.voiceofrepentance.com`
- [ ] Endpoint is registered in Ezra's FastAPI router (new file `src/ezra/routes/vor.py`)

**Tasks:**
- [ ] Create `src/ezra/routes/vor.py` with the POST endpoint and CRM initialization logic
- [ ] Add `aiosqlite` to Ezra's dependencies (async SQLite access within the FastAPI event loop)
- [ ] Register the router in `main.py`
- [ ] Manual test: `curl -X POST http://localhost:8400/api/vor/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","message":"hello"}'` returns `{"status":"ok"}` and a row appears in the DB

---

### STORY-02: Async Contact Handler

**Acceptance Criteria:**
- [ ] An asyncio Queue (`_contact_queue`) is created at startup
- [ ] The POST endpoint drops a contact dict onto the queue after writing to the CRM
- [ ] A background coroutine (`run_contact_handler`) wakes on each queue item
- [ ] On each item, the handler makes a direct LLM call (not through the agent graph) to draft a personalized welcome email based on the submitter's name and message
- [ ] The email is sent to the submitter via `EmailTransport` (existing iCloud SMTP)
- [ ] A Telegram message is sent to Troy with the submitter's name, email, and message
- [ ] The contact's `status` is updated to `'replied'` and `response_sent_at` is set in the CRM
- [ ] If the email or Telegram call fails, the error is logged and the contact status is set to `'notified'` (alert sent, email failed) or `'new'` (both failed) so no submission is silently lost
- [ ] The handler is registered as an `asyncio.create_task()` in Ezra's lifespan, consistent with the improvement scheduler and decay loop patterns
- [ ] Registered in the cron registry for visibility in `/api/cron` status endpoint

**Tasks:**
- [ ] Create `src/ezra/cron/contact_handler.py` with the queue, handler coroutine, and LLM prompt for email drafting
- [ ] Add handler startup in `main.py` lifespan alongside existing background tasks
- [ ] Register in cron registry with id `vor_contact_handler`
- [ ] Email prompt context: handler should know this is a Selah access request, the site is Voice of Repentance, Troy is the author, Selah is invite-only. Email should be warm, personal, not corporate. Mention the request was received and Troy will be in touch regarding access.
- [ ] Manual test: submit a contact via curl, verify Telegram message arrives, verify email is received by the test address, verify CRM row is updated

---

### STORY-03: NGINX Routing + Form Update

**Acceptance Criteria:**
- [ ] NGINX routes `POST voiceofrepentance.com/api/vor/contact` → `localhost:8400`
- [ ] VOR `/selah` page form action is updated to `/api/vor/contact`
- [ ] Old access-request service on port 3201 is no longer referenced by the frontend
- [ ] Existing `data/access-requests.json` entries are migrated into the new CRM (one-time script, existing entries marked `status = 'archived'`)

**Tasks:**
- [ ] Update `Selah/deployment/mac-mini/nginx-selah.conf` — add location block for `/api/vor/contact` proxying to `localhost:8400`
- [ ] Update `voiceofrepentance.com` frontend form action in the Selah page
- [ ] Write a one-time migration script (`scripts/migrate_access_requests.py`) that reads the existing JSON and inserts rows into the CRM
- [ ] Validate end-to-end: submit from the live site, confirm CRM row, Telegram, and email
- [ ] Retire `Selah/services/access-request/` — remove from launchd, archive or delete the service directory

---

## 5. Dependencies

- `aiosqlite` — async SQLite access (new dependency in Ezra)
- `httpx` — already used in Ezra for Telegram calls
- `EmailTransport` — already built at `src/ezra/skills/email/transport.py`
- Ezra's existing Telegram notification pattern (from `improvements/scheduler.py`)
- `TELEGRAM_BOT_TOKEN`, `ALLOWED_CHAT_ID`, `ICLOUD_FROM_EMAIL`, `ICLOUD_APP_PASSWORD` — all already in Ezra's environment

---

## 6. Non-Goals (Phase 1)

- No new agent runtime, no new process, no new port
- No CRM query interface (Troy cannot yet ask Ezra "who's asked for Selah access" — that's Phase 2)
- No follow-up scheduling or drip sequences
- No unsubscribe or preference management
- No web UI for CRM data

---

## 7. Phase 2 Note — VOR Agent

Phase 2 is a separate project: a standalone VOR agent built alongside Ezra with its own agent ID and manifest, using Ezra's two-tiered skill system. It would own the CRM conversationally (queryable via Telegram or its own interface), manage follow-ups, and grow into a ministry operations layer. The `source` column in the contacts schema and the status enum are designed to accommodate that without migration. Phase 2 will have its own PRD when the time comes.

---

## 8. Success Criteria

- Contact submitted on `/selah` → Telegram arrives within 5 seconds
- Welcome email arrives in submitter's inbox within 30 seconds
- CRM row reflects correct final status
- Zero silent failures — all error states are logged and reflected in CRM status
- Old access-request service is fully retired
- `npm run build` on VOR-blog completes without errors
