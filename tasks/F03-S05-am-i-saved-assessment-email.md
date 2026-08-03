---
type: parking-lot-item
feature: F03
status: draft
created: 2026-08-03
priority: must-have
---

# F03-S05: Send the am-i-saved assessment email via the workshop pathway

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
unreachable code on infrastructure that is being sunset.

The chosen replacement is the **workshop `send_email` capability**, sending from
**info@voiceofrepentance.com** over iCloud SMTP, rather than Resend from the Worker.
This keeps ministry mail on Troy's own domain and identity instead of a Cortivus
sending domain, and reuses a capability that already exists and is already wired to
read the CRM.

This is the most visible broken promise on the site. It is a lead magnet whose entire
mechanic is the emailed response, and it is a pastoral flow where the person on the
other end has just written down private answers about their spiritual state and been
told something is coming. It should not sit in the parking lot long.

## Acceptance Criteria

- [ ] A live `/am-i-saved` submission delivers the full assessment to the submitter's inbox
- [ ] The message is sent from `info@voiceofrepentance.com`, not from an iCloud or
      Cortivus address
- [ ] The email content matches the assessment in `tasks/prd-am-i-saved-survey.md` verbatim
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

### Prerequisite: the sending identity

- [x] `info@voiceofrepentance.com` exists on iCloud (confirmed by Troy, 2026-08-03)
- [x] iCloud accepts it as `From` over SMTP with the existing `ICLOUD_APP_PASSWORD`,
      **provided the SMTP login is the primary Apple ID** (tested 2026-08-03, see
      Technical Notes)
- [x] Delivered `From` header confirmed to read `info@voiceofrepentance.com`, not
      rewritten (Troy verified in iCloud 2026-08-03; his VOR mail rule matched it,
      which is independent confirmation the header survived)
- [ ] Add `ICLOUD_SMTP_USER` to `shared/smtp.py`, defaulting to `ICLOUD_FROM_EMAIL`
      when unset, so login identity and sender identity can differ
- [ ] Confirm Apple's SPF/DKIM records for the custom domain are live in Cloudflare DNS
- [ ] Decide how the sender selects its `From`. The capability pins `From` to
      `ICLOUD_FROM_EMAIL` and forbids per-call override by design, so the clean route
      is a dedicated VOR sender process with its own env value, leaving
      `send_email` untouched. Do not weaken the `extra="forbid"` boundary.

### The delivery loop

- [ ] Build a poller that lists un-emailed VOR `am-i-saved` rows, renders the
      assessment, calls `send_email` with `html=True`, and records the send
- [ ] Add the send-state marker. Mirror the existing `notified_at` column rather than
      inventing a sidecar table: ADR-01 keeps *triage* state out of intake, but
      delivery state already lives on the intake row (`notified_at` is stamped by the
      Telegram path). Add `assessment_sent_at` plus a partial index modeled on
      `idx_submissions_unnotified`, so "needs sending" is a cheap indexed query.
- [ ] Schedule it via launchd alongside the existing crm jobs. Pick and record a poll
      interval (see the latency tradeoff below).
- [ ] Port the assessment body from `ezra-assistant/src/ezra/cron/templates/survey_email.py`,
      preserving the section structure
- [ ] Decide the banner: `send_email` has no inline-image support, so either extend
      the capability for CID attachments, host the image, or drop it. Do not
      reintroduce a CDN URL without rereading the cache-poisoning note in the PRD.
- [ ] Tests: rendering with and without reflections, escaping of hostile input,
      exactly-once behavior across repeated polls, and retry after a simulated
      SMTP failure

### Verification and cleanup

- [ ] Live submission from www.voiceofrepentance.com; confirm inbox render in Gmail
      and Apple Mail; remove the test row
- [ ] Confirm the message passes SPF/DKIM and does not land in spam
- [ ] Update `worker/CONTRACT.md` and `docs/tech-guide.md` in the crm repo
- [ ] Update the PRD's "Content changes" section to name the new template location
- [ ] Retire the orphaned Ezra survey-email code once the replacement is verified

## Technical Notes

**This must be a pull, not a push, and that is the load-bearing constraint.** The
Worker cannot call the workshop capability. Workers cannot speak SMTP; workshop's
`transports/http_api.py` is an unimplemented stub, so there is no HTTP surface to
call; and the crm repo's tunnel policy is explicitly "never use a tunnel where a
Worker suffices," so exposing workshop publicly to close the gap would violate a
standing decision. The only shape that works is a local process polling the CRM and
sending. Anyone picking this up who starts by trying to make the Worker call
workshop is going down a dead end.

The read half of that pull already exists. Workshop feature **F18 (`crm-leads-capability`)
is complete**: `F18-S01` provisioned `CRM_AGENT_TOKEN`, and `F18-S02` built a
`crm_leads_list` tool that reads D1 through the Worker's token-gated `GET /submissions`.
This story is largely the write half, and it should reuse `crm_leads_list` rather
than opening a second read path. Filter on `site == "vor"` and `source == "am-i-saved"`,
with reflections in `metadata`.

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

**Named tradeoffs.** Polling reintroduces the Mac Mini as a dependency for VOR
delivery, which the Cloudflare consolidation had removed, and it makes the email
arrive on the next tick rather than immediately. For someone who just submitted a
private spiritual inventory and was told the assessment is coming, that delay is
felt. A short interval narrows it but never reaches instant. The alternative,
Resend from the Worker, is instant and has no Mac Mini dependency, but it sends from
a Cortivus-verified domain until a VOR domain is added there, and it splits VOR's
outbound mail across a second provider. The workshop path was chosen for identity and
reuse; the cost is latency and a machine that has to be awake. Both are acceptable
here, but they are real and should not be rediscovered later as surprises.

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

**Open strategic question, deliberately not a blocker.** Troy is weighing collapsing
the Cortivus commercial effort toward CMU research work, and consolidating all
outbound email onto Resend. That would eventually make Resend the sender here too.
This story is written for the workshop pathway on purpose: it needs no new vendor
decision, adds no cost, and can ship while that question is still open. The bulk of
the work, porting and rendering the assessment template, is transport-agnostic and
survives a later move to Resend. Do not hold this behind the provider decision.

---

*Created: 2026-08-03*
