---
type: prd
feature: F01
story: F01-S01
status: draft
created: 2026-08-03
priority: high
---

# F01-S01: Shared weekly newsletter, Sunday 8:00am EST

**Feature:** F01 — Email Delivery
**Priority:** Must-Have

## Summary

One broadcast to the whole list every Sunday at 8:00am Eastern, the same content for
everyone, sent from the beehiiv publication "The VOR Weekly". This is the forcing
function for the entire ministry: it is the only artifact with a deadline, and the
strategy document treats it as the thing that must never be cut. It replaces nothing,
because nothing has ever been sent. Deliberately simple, with no per-subscriber state,
so it works on the current free plan. The path drip is a separate newsletter with its
own workflow, deferred to F02, and nothing here depends on it.

## Acceptance Criteria

- [ ] A physical mailing address is set. **Currently `null`**, which is required for
      commercial email in the US and will block or damage the first send. It does not
      have to be the home address
- [ ] A test send arrives, renders correctly on mobile and desktop, and every link resolves
- [ ] The first live send goes out Sunday 8:00am America/New_York
- [ ] The email contains a persistent route into `/paths` so a subscriber who arrives
      mid-stream has an on-ramp without the drip existing
- [ ] The email carries no donation ask, paid tier, sponsorship, or upsell
- [ ] Sender identity reads "Voice of Repentance", not "Troy Sybert"
- [ ] The send still works in a week with no new essay

## Tasks

- [ ] Obtain a mailing address that is not the home address. A USPS PO Box or a CMRA
      street address both satisfy the FTC requirement
- [ ] Set it as the workspace `default_address` so every publication inherits it
- [ ] Decide double opt-in. Currently `false`. On a domain with no sending reputation and
      two subscribers, turning it on costs little and protects deliverability long-term
- [ ] Build the repeatable issue structure: the turn, the sit and its one question, a
      `{{path}}`-personalised link back to their walk, and a standing link to `/paths`
- [ ] Draft the first issue from content already published on the site
- [ ] Schedule for Sunday 8:00am. Publication time zone is already Eastern
- [ ] Send a test to a real inbox and check rendering, links, and spam placement
- [ ] Publish the first live issue

## Technical Notes

Verified in the account on 2026-08-03:

| Item | State |
| --- | --- |
| Workspace | `Troy's Hiiv`, plan **`launch`** (free), cap 2,500 subscribers |
| Publication | `The VOR Weekly` (`pub_2591c0e5-…`), created 2026-08-02 |
| Active subscribers | **2** (1 website direct, 1 invitation import) |
| Sender name | `Voice of Repentance` — already correct |
| Time zone | Eastern Time — 8:00am EST needs no conversion |
| Footer address | **`null`** — must be set |
| Double opt-in | `false` |
| Custom fields | `first_name`, `last_name`, and `path` (created 2026-08-03) |
| Automations | **0, and unavailable on this plan** |
| UTM tagging | automatic tagging on, which feeds the analytics work |
| Branding | logo and thumbnail already uploaded, matching `public/images/beehiiv/` |

The free plan is sufficient for everything in this story. Nothing here needs automations,
segments, or webhooks, and the v2 API was verified doing full read and write on `launch`.

Signup sync moved to F01-S03, because it is independent and does not block a send. At two
subscribers, people can be added by hand.

**The address does not have to be a home address.** The FTC accepts a street address, a
USPS-registered PO Box, or a private mailbox at a commercial mail receiving agency. Set it
at workspace level rather than per publication so future publications inherit it.

Drafting is available through MCP: `save_post` builds a real formatted draft with beehiiv
blocks, and it creates a **draft only** — promotion stays a human action in the UI. So the
issue can be assembled for review without any risk of an accidental send.

The `{{path}}` merge tag means a single shared broadcast can still point each subscriber
back to their own walk. One send, everyone included, one personalised link. That recovers
part of what a drip would do at no cost.

The "thin week" structure matters more than it looks. The send is weekly whether or not
new work exists, so the template has to hold up with only a song, a question, and a link
to the paths. Design it for the worst week, not the best one.

## Blockers

- **No mailing address yet.** Hard blocker for sending. Needs a PO Box or CMRA address,
  not the home address
