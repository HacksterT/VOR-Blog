---
type: parking-lot-item
feature: F03
status: draft
created: 2026-08-03
priority: should-have
---

# F03-S01: My Story needs additional chapters

**Feature:** F03 — Parking Lot
**Captured from:** retiring `tasks/roadmap-site-improvements.md` (was item 2.4)
**Priority:** Should-Have

## Summary

`/story` has exactly one chapter, `chapter-1-beginnings.md`, and has had since April
2026. The collection, layout, and listing page all work correctly, so this is purely
content. A single-chapter autobiography reads as abandoned rather than in progress,
which undercuts a section that is linked from the main nav. Two or three more chapters
would signal ongoing work; even one more changes the impression.

## Acceptance Criteria

- [ ] At least two more chapters exist and are published
- [ ] Each has a sequential `chapter` number so `/story` orders them correctly
- [ ] `/story` no longer reads as a single-entry stub

## Tasks

- [ ] Write chapter 2
- [ ] Write chapter 3
- [ ] Add each as `src/content/story/chapter-N-slug.md` with title, date, description,
      and `chapter` number

## Technical Notes

Infrastructure is complete and needs no changes. The `story` collection schema is
title, date, description, chapter (number), coverImage?, draft. Chapters order by the
`chapter` field, not by date.

Content only. No code.

## Blockers

None. This is writing time, which competes with the essay cadence committed to in
`tasks/strategy-ministry-2026.md` (2 to 4 essays per week). Expect it to sit until
that cadence is comfortable.

---

*Created: 2026-08-03*
