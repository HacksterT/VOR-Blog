---
type: parking-lot-item
feature: F03
status: draft
created: 2026-08-03
priority: nice-to-have
---

# F03-S04: Image carousels for photo-essay or gallery posts

**Feature:** F03 — Parking Lot
**Captured from:** retiring `tasks/roadmap-site-improvements.md` (was item 4.5)
**Priority:** Nice-to-Have

## Summary

A lightweight client-side carousel so a post can carry multiple images — a photo essay,
or a gallery for a music release. Speculative: no post currently needs it, and none is
planned. Captured so the idea is not lost, not because it is due.

## Acceptance Criteria

- [ ] A post can declare multiple images and they render as a navigable carousel
- [ ] Keyboard and touch navigation both work
- [ ] Images stay inside `.plate`, per the site's image convention
- [ ] No external library added

## Tasks

- [ ] Wait until a real post needs it. Do not build this speculatively
- [ ] Build a carousel component following the existing pattern
- [ ] Verify it honours `.plate` and does not become a second full-bleed surface

## Technical Notes

The redesign removed both homepage carousels, so the prior in-repo pattern this item
originally pointed at is gone. Any implementation starts fresh.

Two site conventions constrain it. **Every content photograph goes through `.plate`**,
and the homepage hero is the only full-bleed image on the site — a carousel must not
quietly become a second one. And images must stay compressed; an August 2026 pass took
`public/images` from 56MB to 9.9MB, and a gallery post is the most likely way to undo
that.

## Blockers

None, but genuinely blocked on need. Build it when a post exists that requires it.

---

*Created: 2026-08-03*
