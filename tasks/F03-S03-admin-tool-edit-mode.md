---
type: parking-lot-item
feature: F03
status: draft
created: 2026-08-03
priority: nice-to-have
---

# F03-S03: Admin upload tool needs an Edit Post mode

**Feature:** F03 — Parking Lot
**Captured from:** retiring `tasks/roadmap-site-improvements.md` (was item 4.4)
**Priority:** Nice-to-Have

## Summary

The local Streamlit admin tool at `admin/admin.py` creates new posts but cannot edit
existing ones, toggle drafts, or delete. Any change to a published post means opening
the markdown by hand, which is fine for a developer and awkward for everything else.
An Edit Post mode that reads existing front matter back into the form, plus a draft
toggle, closes the gap.

Worth keeping honest about priority: the committed cadence is 2 to 4 essays a week
written directly as markdown, and the build now catches most content errors loudly.
This is convenience, not a gap in the workflow.

## Acceptance Criteria

- [ ] The tool can open an existing post and load its front matter into the form
- [ ] Saving writes back without corrupting fields it does not manage
- [ ] `draft: true|false` can be toggled from the tool
- [ ] Editing a post that a path lists does not break `npm run build`

## Tasks

- [ ] Add an Edit Post mode that lists existing posts and loads one
- [ ] Parse existing front matter into the form fields, preserving unknown keys
- [ ] Add a draft toggle
- [ ] Verify a round-trip edit leaves `npm run build` passing

## Technical Notes

`admin/admin.py`, Streamlit, local only, roughly 12KB. Not deployed and not part of the
site build.

The round-trip is the real risk. Front matter now carries fields the tool predates:
`series`, `seriesPart`, `subtitle`, and for paths `turns`, `sundaySits`, `finalTurn`,
`forWhom`. A naive rewrite that only knows about title/date/description/tags would
silently drop them, and for a path file that would fail the build — loudly, which is
the design, but only after the damage is written to disk.

Preserve unknown keys rather than enumerating known ones.

## Blockers

None.

---

*Created: 2026-08-03*
