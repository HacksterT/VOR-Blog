---
type: parking-lot
feature: F03
status: active
created: 2026-08-03
---

# F03: Parking Lot

## Purpose

A catch-all for smaller chunks of work that surface mid-task — during a simplify pass,
a code review, or an open question — but don't warrant a full feature of their own
(yet). Each item below is a fully self-contained story file; this canvas exists only
to give them a shared home and an F## namespace to hang off of.

## How items enter here

- Manually: someone says "park this" / "add to the parking lot: ..."
- Automatically: another skill or command (e.g. a simplify pass) finishes its main
  task and writes any leftover minor items here as a matter of convention.

## How to check what's open

Do **not** read this file's contents to find out what's pending or done — the file
list *is* the status. From the project's `tasks/` directory:

    ls F03-S*.md              # open parking-lot items
    ls completed/F03-S*.md    # done

Open an individual `F03-S##-*.md` story only when you're about to triage or work it.

## Non-Goals

- This is not a substitute for scoping a real feature. If a parked item turns out to
  be bigger than a single self-contained story, promote it: run
  `next-id.sh feature` and give it its own canvas via prd-creator.
- No status table is maintained here. If you find yourself tempted to add one,
  don't — it will drift out of sync with the actual files and reintroduce the exact
  problem this canvas exists to avoid.

---

*Created: 2026-08-03*
