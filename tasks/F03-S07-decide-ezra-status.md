---
type: parking-lot-item
feature: F03
status: draft
created: 2026-08-03
priority: should-have
---

# F03-S07: Decide whether Ezra is retired or kept

**Feature:** F03 — Parking Lot
**Captured from:** Manual — surfaced 2026-08-03 tracing the broken am-i-saved
assessment email. Ezra's status turned out to be undecided rather than decided, and
three separate documents each assumed a different answer.
**Priority:** Should-Have

## Summary

Ezra is in limbo. It was not retired and it was not kept. It simply stopped being
called on 2026-07-03 when commit `bb1b652` repointed the VOR forms at the Cloudflare
forms-worker, and nothing has decided its fate since. The process still runs on the
Mac Mini, still serves `/api/vor/contact` behind NGINX, and still holds working code
that nothing invokes.

The ambiguity is not academic. It is already producing contradictory documents and one
falsely-closed story:

- crm `F01-S04` says "Ezra is being sunset" and is filed as **DONE**, claiming 17 rows
  were migrated to D1. They were not. D1's earliest row is the cutover test; all 17
  still live only in `ezra-assistant/data/vor_crm.db`.
- VOR `F01` described `/walk` as posting to "the Ezra worker" and listed migrating away
  from it as a non-goal. Corrected 2026-08-03, but it was authored months after Ezra
  left the path.
- `F03-S05` now proposes reviving an Ezra endpoint as the cheapest route to fixing the
  assessment email, which only makes sense if Ezra is kept.

Each document is internally reasonable and they cannot all be right. That is the cost
of an undecided dependency: every author assumes the answer that suits their story.

Troy's leaning as of 2026-08-03 is to keep Ezra. This story is to make that explicit
and write it down, not to relitigate it.

## Acceptance Criteria

- [ ] A single written decision exists: Ezra is kept, or Ezra is retired
- [ ] If kept: what it is responsible for is stated, and the dead VOR contact path
      (`vor_contact`, `contact_handler`, the LLM welcome composer) is either revived
      deliberately or deleted
- [ ] If retired: a decommission sequence exists covering the D1 backfill, the NGINX
      `/api/vor/` route, the launchd job, and what happens to `vor_crm.db`
- [ ] crm `F01-S04` is reopened or its DONE claim is corrected either way
- [ ] `CONTEXT.md` in both repos reflects the decision
- [ ] No remaining document describes Ezra as receiving VOR form submissions

## Tasks

- [ ] Decide, and record the reasoning, not just the outcome
- [ ] Inventory what Ezra still does that nothing else does. It is more than VOR
      contact: check its other routes, cron jobs, and the AILS contact handler before
      assuming the VOR path is all that matters
- [ ] Reopen crm `F01-S04` and either run the D1 load or restate the story honestly
- [ ] Reconcile `CONTEXT.md` in `ezra-assistant` and `crm` with the decision
- [ ] Sequence against `F03-S05`: if Ezra is kept, S05 gets much cheaper; if retired,
      S05 must take the workshop route and S05's Option A is dead

## Technical Notes

What Ezra still holds for VOR specifically, all currently unreachable: the
`/api/vor/contact` route with the `Reflection` model, the `contact_handler` consumer
with its `am-i-saved-survey` branch, `survey_email.py` with the assessment as HTML,
the CID-inlined `email-banner.jpg`, and an `EmailTransport` supporting inline images.
This code is proven, not speculative: it sent correctly-rendered assessments from
2026-04-23 to 2026-05-07.

The strongest argument for keeping it is that it makes `F03-S05` roughly a day of work
instead of several. The strongest argument against is that it reverses a consolidation
already substantially done, and keeps VOR's delivery dependent on a machine that sleeps.
Note those are not symmetric: keeping Ezra for one email is a much smaller commitment
than keeping Ezra as general infrastructure. "Kept, but only as the local SMTP sender
the Worker pushes to" is a coherent third answer and probably the real one.

Beware the sunk-cost read. The right question is not "this code already works, why
throw it away," it is "what do I want running on the Mac Mini a year from now."

## Blockers

None. This is a decision, not an implementation.

---

*Created: 2026-08-03*
