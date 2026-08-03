---
type: prd
feature: F01
story: F01-S02
status: draft
created: 2026-08-03
priority: high
---

# F01-S02: Reconcile site copy with what actually sends

**Feature:** F01 — Email Delivery
**Priority:** Must-Have

## Summary

The live site describes an email product that is not what will ship. It promises two
emails a week and path-ordered delivery, both of which belong to the drip (F01-S03),
which is blocked on a paid plan. If the first Sunday newsletter goes out while the site
still makes those claims, every new subscriber's first experience is a broken promise
made before they even opened it. This story brings the copy in line with what actually
sends, and it must land at the same time as F01-S01 or before it.

This is the same class of defect as the survey privacy line corrected on 2026-08-03,
where `not-sure-it-took.md` told readers "nothing is submitted, nobody sees them" about
a form that posts their written reflections to a server. Cheap to fix now, expensive to
discover as a subscriber.

## Acceptance Criteria

- [ ] No page claims two emails a week unless two are actually sending
- [ ] No page claims path-ordered or "from week one of the path you chose" delivery
      while F01-S03 is unbuilt
- [ ] The `/walk` form's helper text describes what a signup actually produces
- [ ] The homepage rhythm section still reads as a rhythm, not as a hole where Wednesday was
- [ ] Both `/walk` and homepage meta descriptions match the visible copy
- [ ] The path selector stays on the form, so the `path` field keeps collecting and the
      site's premise survives, but the framing does not promise delivery it cannot make
- [ ] `npm run build` passes and the changed pages are eyeballed in dev

## Tasks

- [ ] Rewrite the homepage rhythm section. Currently three columns headed Wednesday /
      Sunday / Any day under "Two emails a week, and neither one asks you for anything"
- [ ] Remove or reword "In order, from week one of the path you chose" on the homepage
- [ ] Rewrite the `/walk` form helper text, currently "Pick a path and you get that path's
      turns in order, from week one, not whatever went out that Wednesday"
- [ ] Rewrite "One email Wednesday, one on Sunday" under the signup button in `WalkForm.astro`
- [ ] Update the `/walk` meta description, currently "One reading on Wednesday, one song on
      Sunday, in the order the path was built"
- [ ] Soften the path selector label from "Which walk?" toward "Where should we start?",
      and make sure "Riding along" reads as a first-class choice rather than a fallback
- [ ] Build, review in dev, deploy

## Technical Notes

Exact locations, verified against the live build on 2026-08-03:

| File | Current claim |
| --- | --- |
| `src/pages/index.astro` | "Two emails a week, and neither one asks you for anything" |
| `src/pages/index.astro` | Wednesday "The turn" / Sunday "The sit" / Any day "Reply" |
| `src/pages/index.astro` | "One reading. Ten to fifteen minutes. **In order, from week one of the path you chose.**" |
| `src/components/WalkForm.astro` | "Pick a path and you get that path's turns in order, from week one" |
| `src/components/WalkForm.astro` | "One email Wednesday, one on Sunday." |
| `src/pages/walk.astro` | meta: "One reading on Wednesday, one song on Sunday, in the order the path was built." |

The Sunday-only send is a reduction in promise, not in substance, and the copy should
not apologise for it. "One email, Sunday morning" is a cleaner commitment than two
emails delivered unreliably, and it is easier to keep during a hard month.

When F01-S03 ships, this copy changes again. That is expected. Describing the product
that exists this week is the standing rule, not a one-time correction.

Leave the per-week `sundaySits` data on path pages alone. That is what the path
suggests when read on the site, and it is unaffected by what the email sends.

## Blockers

None. Can be done immediately and independently of beehiiv access.
