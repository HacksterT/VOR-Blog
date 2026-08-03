---
type: parking-lot-item
feature: F03
status: draft
created: 2026-08-03
priority: should-have
---

# F03-S02: Migrate Ezra email to Google Workspace at voiceofrepentance.com

**Feature:** F03 — Parking Lot
**Captured from:** retiring `tasks/roadmap-site-improvements.md` (was item 4.2.1)
**Priority:** Should-Have

## Summary

Ezra currently sends mail through iCloud SMTP, so welcome emails and survey assessments
arrive from a personal address rather than a ministry one. Moving it to a dedicated
Google Workspace account under `voiceofrepentance.com` fixes the from-address and opens
Calendar, Drive, and other Google services for later Ezra work.

**The sequence matters and is easy to get wrong.** The Cortivus Workspace must not be
cancelled until mail for `troy.sybert@cortivus.com` is confirmed arriving via an iCloud
alias, or that address goes dark.

## Acceptance Criteria

- [ ] Mail to `troy.sybert@cortivus.com` arrives via the iCloud alias, verified with a
      real test message, **before** anything is cancelled
- [ ] A Google Workspace account exists for Ezra under `voiceofrepentance.com`
- [ ] Ezra sends from the ministry address, verified by a real welcome email
- [ ] The Cortivus Workspace is cancelled only after both of the above

## Tasks

- [ ] Add `troy.sybert@cortivus.com` as an iCloud email alias
- [ ] Send a test message to that address and confirm delivery
- [ ] Provision the Google Workspace account under `voiceofrepentance.com`
- [ ] Update Ezra's SMTP credentials in `ezra/config.py`
- [ ] Trigger a real welcome email and confirm the from-address and deliverability
- [ ] Cancel the Cortivus Workspace

## Technical Notes

The Ezra-side change is a one-line config edit; everything else is account
administration.

Ordering is the whole risk. Steps 3 through 6 cannot begin until step 2 passes. Do not
cancel Cortivus first, even if it looks like the tidy way to do it.

Worth checking against F01 while doing this: the beehiiv publication sends separately
and is unaffected, but if the ministry ever sends from both Ezra and beehiiv on the same
domain, SPF and DKIM need to cover both senders.

## Blockers

Step 1 blocks everything else. Lives outside this repo, in
`/Users/hackstert/Projects/ezra-assistant` and in account settings.

---

*Created: 2026-08-03*
