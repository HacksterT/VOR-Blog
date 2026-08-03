---
type: parking-lot-item
feature: F03
status: draft
created: 2026-08-03
priority: must-have
---

# F03-S05: Send the am-i-saved assessment email

**Feature:** F03 — Parking Lot
**Captured from:** Manual — surfaced 2026-08-03 while assessing `prd-am-i-saved-survey.md`
for completion. The frontend shipped, but the forms-worker cutover retired the email
path without replacing it, and nobody noticed because capture kept working.
**Priority:** Must-Have

## Summary

The `/am-i-saved` survey promises the visitor one thing: answer eight questions, give
your name and email, and receive the full assessment by email. Today they receive
nothing. Their submission is captured correctly in Cloudflare D1 and pings Troy's
Telegram, but no email is ever sent to the person who asked for it.

This broke during the forms cutover, not at launch. The original design had the VOR
site POST to Ezra on the Mac Mini, which rendered a deterministic HTML assessment and
sent it over iCloud SMTP. When all VOR forms were repointed at the shared forms-worker
(commit `bb1b652`, crm story `F03-S02-rewrite-submit-handlers`), Ezra left the path
entirely. The Worker stores the row and notifies Troy; it sends no VOR email. Ezra's
`_send_survey_assessment`, `survey_email.py`, and its CID-inlined banner are now
unreachable code on infrastructure whose own status is undecided (F03-S07).

**Settled:** send from **info@voiceofrepentance.com** over iCloud SMTP, not Resend
from the Worker. That keeps ministry mail on Troy's own domain and identity rather
than a Cortivus-verified sending domain, and needs no new vendor. The Worker triggers
it with `ctx.waitUntil` after the D1 insert, pushing through the existing
`hackstert-tunnel` with an Access service token, backed by a sweeper for anything the
push misses.

**Open:** what answers that push on the Mac Mini. Two options below; leaning Ezra.

This is the most visible broken promise on the site. It is a lead magnet whose entire
mechanic is the emailed response, and it is a pastoral flow where the person on the
other end has just written down private answers about their spiritual state and been
told something is coming. It should not sit in the parking lot long.

## Acceptance Criteria

- [ ] A live `/am-i-saved` submission delivers the full assessment to the submitter's inbox
- [ ] The message is sent from `info@voiceofrepentance.com`, not from an iCloud or
      Cortivus address
- [ ] The email content matches the assessment in `tasks/completed/prd-am-i-saved-survey.md` verbatim
- [ ] The submitter's own reflections are echoed back, under their question headings,
      and omitted cleanly when they wrote none
- [ ] The submitter's name and reflection text are escaped; untrusted input never
      reaches raw HTML
- [ ] Each submission is emailed exactly once: no duplicate sends across polls, no
      silent skips
- [ ] A send failure leaves the row eligible for retry rather than marking it done
- [ ] Delivery is independent of intake: the D1 row is still written, the Telegram ping
      still fires, and the visitor still sees the success state regardless
- [ ] Verified end to end from the real production domain in a real browser, not
      `wrangler dev` (Turnstile blocks scripted tokens)

## Tasks

### Decide the receiver first (everything below depends on it)

- [ ] **Choose: revive Ezra's endpoint, or build workshop's.** Leaning Ezra as of
      2026-08-03. See "Two ways to receive the push" in Technical Notes.

### Prerequisite: the sending identity

- [x] `info@voiceofrepentance.com` exists on iCloud (confirmed by Troy, 2026-08-03)
- [x] iCloud accepts it as `From` over SMTP with the existing `ICLOUD_APP_PASSWORD`,
      **provided the SMTP login is the primary Apple ID** (tested 2026-08-03, see
      Technical Notes)
- [x] Delivered `From` header confirmed to read `info@voiceofrepentance.com`, not
      rewritten (Troy verified in iCloud 2026-08-03; his VOR mail rule matched it,
      which is independent confirmation the header survived)
- [ ] Separate login identity from sender identity in whichever sender is chosen.
      Ezra: `src/skills/email/transport.py:89`. Workshop: `shared/smtp.py:154`, via a
      new `ICLOUD_SMTP_USER` defaulting to `ICLOUD_FROM_EMAIL`. Keep it configuration,
      not a per-call override, so workshop's `extra="forbid"` anti-spoofing boundary
      stays intact.
- [ ] Confirm Apple's SPF/DKIM records for the custom domain are live in Cloudflare DNS

### The Worker side (identical under either option)

- [ ] Add the gated branch after the D1 insert in `crm/worker/src/index.ts`, beside the
      existing Telegram and Cortivus blocks: on `site === "vor" && source ===
      "am-i-saved"`, `ctx.waitUntil` a `fetch()` to the tunnel hostname with the
      `CF-Access-Client-Id`/`Secret` service token, carrying `insertedId`, name, email,
      and reflections. `insertedId` is already in scope via `RETURNING id`.
- [ ] Fire-and-forget discipline: log and return on any failure, never throw, never
      affect the visitor's response
- [ ] Add `assessment_sent_at` to `submissions`, mirroring `notified_at`, plus a
      partial index modeled on `idx_submissions_unnotified`. ADR-01 keeps *triage*
      state out of intake, but delivery state already lives on the intake row.

### The receiving side (depends on the option chosen)

- [ ] Add one authenticated route that renders and sends. Under Option A this calls
      Ezra's existing `_send_survey_assessment`; under Option B it means building
      workshop's `http_api` transport, porting the assessment body from
      `survey_email.py`, and re-solving the banner, since workshop's `send_email` has
      no inline-image support. Do not reintroduce a CDN URL for the banner without
      rereading the cache-poisoning note in the PRD.
- [ ] Stamp `assessment_sent_at` on success, keyed by the row id, so the send is
      recorded exactly once
- [ ] Build the sweeper: find `am-i-saved` rows where `assessment_sent_at IS NULL` and
      send them. Schedule via launchd alongside the existing crm jobs. Low frequency is
      correct; it should normally find nothing.
- [ ] Tests: rendering with and without reflections, escaping of hostile input,
      exactly-once across a repeated push and a sweeper pass, and recovery after a
      simulated SMTP failure and an unreachable Mac Mini

### Verification and cleanup

- [ ] Live submission from www.voiceofrepentance.com; confirm inbox render in Gmail
      and Apple Mail; remove the test row
- [ ] Confirm the message passes SPF/DKIM and does not land in spam
- [ ] Update `worker/CONTRACT.md` and `docs/tech-guide.md` in the crm repo
- [ ] Update the PRD's "Content changes" section to name the new template location
- [ ] Retire the orphaned Ezra survey-email code once the replacement is verified

## Technical Notes

### Two ways to receive the push

The Worker side is identical either way: `ctx.waitUntil` firing a `fetch()` through
`hackstert-tunnel` with an Access service token, carrying the D1 row id, name, email,
and reflections. What differs is what answers on the Mac Mini.

**Option A — revive Ezra's endpoint. Recommended, and Troy's leaning as of 2026-08-03.**
Ezra already has every piece except a caller: a running FastAPI app, `survey_email.py`
rendering the assessment as HTML, the CID-inlined banner, and an `EmailTransport` that
already supports inline images. All of it worked in production from 2026-04-23 through
the cutover, and the emails were confirmed good in a real inbox on 2026-05-07. The work
collapses to adding one authenticated route that calls the existing
`_send_survey_assessment`, plus the `From` fix below. No template port, no banner
decision, no new HTTP surface.

**Option B — build workshop's `http_api` transport** and call `send_email`. Cleaner
long-term if Ezra is truly being retired, since it puts the capability where the rest
of the tooling lives. But `transports/http_api.py` is a `NotImplementedError` stub, so
this means designing workshop's first HTTP surface, porting the template, re-solving
the banner (workshop's `send_email` has no inline-image support), and re-verifying
rendering that Option A already has evidence for.

The honest comparison: A is roughly a day and reuses proven code; B is several days
and sets a precedent. A's cost is that it keeps Ezra alive, which cuts against sunsetting
it. That is a real tension and it is not this story's to resolve — see F03-S07.

**Both options need the same `From` fix.** Ezra's transport has the identical
login-equals-sender conflation as workshop's:
`src/skills/email/transport.py:89` calls `server.login(self._from, ...)`. Sending as
`info@voiceofrepentance.com` requires separating login identity from sender identity
in whichever one is used.

### Why push at all, and why a sweeper

A pull-only design was the first answer here, on the reasoning that a Worker cannot
speak SMTP, workshop exposes no HTTP surface, and the crm repo's tunnel policy says
"never use a tunnel where a Worker suffices." That last step was wrong. The policy
caps tunnel *sprawl* — the account carries exactly one tunnel and AILS must not come
back — and Troy already runs `hackstert-tunnel` with an allowed-API Access policy.
Adding a route to an existing tunnel is not provisioning a new one, and the
"where a Worker suffices" clause does not bind when a Worker provably cannot do the
job. Push through the existing tunnel is in bounds.

**The real constraint is availability, not reachability.** Access will happily
authenticate a request to a machine that is asleep or mid-restart, and the Worker gets
a timeout. So push alone is not sufficient: push is easy when the receiver has an
uptime SLA and hardest when the receiver sleeps, because durable retry means rebuilding
a queue. Hence push for latency plus a sweeper for correctness. The sweeper's query is
just "rows where `assessment_sent_at IS NULL`," and it should almost always find
nothing.

Ezra's own history is the argument for the sweeper. Its `asyncio.Queue` was memory-only,
so a restart between enqueue and send dropped the email silently, leaving the row at
status `new` with nothing to retry it. Row id 11 in `vor_crm.db` (2026-04-23) is a real
instance: stuck at `new` while every neighbor says `replied`, with a manual resubmit ten
minutes later. The push-plus-sweeper design is strictly better than what sent the
2026-05-07 email, not a workaround for having lost it.

If the sweeper reads D1 over HTTP rather than locally, workshop **F18
(`crm-leads-capability`) is complete** and already provides it: `F18-S01` provisioned
`CRM_AGENT_TOKEN`, `F18-S02` built `crm_leads_list` against the Worker's token-gated
`GET /submissions`. Reuse it rather than opening a second read path.

**Alias sending, tested live 2026-08-03.** iCloud will send as
`info@voiceofrepentance.com`, but only when the SMTP login is the primary Apple ID.
Logging in *as* the alias fails with `535 5.7.8 authentication failed`; logging in as
`emailitroy@icloud.com` with `From: info@voiceofrepentance.com` delivers. This is a
defect in the capability for this use case: `shared/smtp.py:154` calls
`server.login(cfg.from_address, ...)`, conflating login identity with sender identity.
That assumption holds when sending as your own iCloud address, which is why it went
unnoticed. The fix is an `ICLOUD_SMTP_USER` env var defaulting to `ICLOUD_FROM_EMAIL`,
which leaves every existing caller unchanged and keeps the `extra="forbid"`
anti-spoofing boundary on the input model intact, since it is configuration rather
than a per-call override.

`send_email` fits the payload. `html=True` sends the caller's body verbatim and
derives a plain-text alternative by stripping tags, so the long-form assessment goes
out intact. The manifest's note about escaped HTML applies only to the plain-text
path. Its one real gap is attachments: `smtp.send` takes only text and HTML bodies,
so the CID banner has no route today. The manifest also states the capability is
deliberately portable to headless and cron processes, which is exactly this use.

**Named tradeoffs.** Sending from the Mac Mini reintroduces it as a dependency for VOR
delivery, which the Cloudflare consolidation had removed. Push keeps the common case
instant, so the latency cost only shows up when the machine is unreachable and the
sweeper has to catch it. The alternative, Resend from the Worker, has no Mac Mini
dependency at all and would delete the tunnel, the sweeper, and the send-state
bookkeeping outright — the entire orchestration exists because iCloud is SMTP and a
Worker cannot speak it. Its costs are a Cortivus-verified sending domain until a VOR
one is added, a second outbound provider to operate, and a free-tier limit that caps
sends per month. iCloud was chosen for identity: ministry mail should come from
`info@voiceofrepentance.com`, not from a Cortivus domain. That is a defensible reason
to accept the machinery, but it is machinery bought with a preference, not a
constraint. If the Cortivus wind-down lands on consolidating everything to Resend
(see F03-S07 and the pending provider decision), revisit this before building.

**Home.** The assessment copy and the broken promise are VOR's, which is why this is
parked here, but the running code is not this repo's. The sender belongs in the
workshop or crm repo depending on how it is packaged. Move or mirror this story into
that repo's `tasks/` when work starts, and follow whichever project's F##/S##
sequence it lands in.

`F08-S01-worker-auto-reply` in `crm/tasks/completed/` remains a useful reference for
the gating and fire-and-forget discipline even though the transport differs.

Note that the gap was a recorded decision, not an oversight.
`crm/tasks/completed/site-infra/troy-to-review.md` line 167 raised it before cutover,
observed that for a pastoral flow an acknowledgement to the person is "arguably
expected, not optional," and left it as Troy's call. It shipped on the Telegram-only
default. This story reverses that default for am-i-saved specifically.

The related GDPR question raised in that same review, retention and purge for
special-category survey reflections, is deliberately out of scope here and still open.

## Blockers

None. `info@voiceofrepentance.com` exists on iCloud as of 2026-08-03, which was the
one hard prerequisite.

**One decision to make first, not a blocker:** which side receives the push, Ezra or
workshop. F03-S07 settles it. Everything under "The Worker side" is identical either
way and can be built before that lands.

**Open strategic question, deliberately not a blocker.** Troy is weighing collapsing
the Cortivus commercial effort toward CMU research work, and consolidating all outbound
email onto Resend. That would make Resend the sender here too, and would delete most of
this story rather than modify it: no tunnel, no sweeper, no send-state column, just a
gated `fetch` in the Worker. The iCloud route was chosen for sending identity, and it
can ship while the provider question is open. But if that question is close to
resolving, resolve it first — building the tunnel-and-sweeper machinery and then
discarding it a month later is the one genuinely wasteful sequence here. The template
copy is transport-agnostic and survives either way.

---

*Created: 2026-08-03*
