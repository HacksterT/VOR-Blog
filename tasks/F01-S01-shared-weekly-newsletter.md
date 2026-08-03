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
so it works on the current free plan and cannot be blocked by the path drip
(F01-S03) which requires a paid upgrade.

## Acceptance Criteria

- [ ] A physical mailing address is set in the email footer. **Beehiiv currently has
      `footer.address: null`, which is a legal requirement for commercial email in the
      US and will block or damage the first send**
- [ ] A test send arrives, renders correctly on mobile and desktop, and every link resolves
- [ ] The first live send goes out Sunday 8:00am America/New_York
- [ ] The email contains a persistent route into `/paths` so a subscriber who arrives
      mid-stream has an on-ramp without the drip existing
- [ ] The email carries no donation ask, paid tier, sponsorship, or upsell
- [ ] Sender identity reads "Voice of Repentance", not "Troy Sybert"
- [ ] A `path` custom field exists on the publication with values matching `WALK_OPTIONS`
      exactly, populated on signup even though nothing consumes it yet
- [ ] `/walk` submissions create a beehiiv subscriber, and still hit the Ezra worker for
      the CRM record and Telegram alert
- [ ] The send still works in a week with no new essay

## Tasks

- [ ] Set the footer mailing address in beehiiv publication settings (blocker for any send)
- [ ] Create the `path` custom field, kind `string`, values matching `WALK_OPTIONS` in
      `src/lib/paths.ts`
- [ ] Decide double opt-in. Currently `false`. On a domain with no sending reputation and
      two subscribers, turning it on costs little and protects deliverability long-term
- [ ] Extend the Ezra worker to forward `source: 'walk'` submissions to the beehiiv API
      with email, first name, and `path`. Keep the existing CRM write and Telegram alert
- [ ] Build the recurring post structure: this week's turn, the Sunday song and its one
      question, and a standing link to `/paths`
- [ ] Schedule the recurring Sunday 8:00am send. Publication time zone is already Eastern
- [ ] Send a test to a real inbox and check rendering, links, and spam placement
- [ ] Send the first live issue

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
| Custom fields | `first_name`, `last_name` only. **No `path` field** |
| Automations | **0, and unavailable on this plan** |
| UTM tagging | automatic tagging on, which feeds the analytics work |
| Branding | logo and thumbnail already uploaded, matching `public/images/beehiiv/` |

The free plan is sufficient for everything in this story. Nothing here needs automations,
segments, or webhooks.

Keep beehiiv additive rather than a replacement. Every form on the site posts to
`/api/vor/contact` on the Ezra worker, which writes the SQLite CRM and fires Telegram.
That stays. Beehiiv becomes a second destination for the same submission, so no API key
ever ships to the browser.

The "thin week" structure matters more than it looks. The send is weekly whether or not
new work exists, so the template has to hold up with only a song, a question, and a link
to the paths. Design it for the worst week, not the best one.

## Blockers

- **Footer mailing address is unset.** Hard blocker for sending
- The Ezra worker change is the only code outside this repo
