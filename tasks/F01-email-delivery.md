---
type: prd
feature: F01
status: draft
created: 2026-08-03
priority: high
---

# F01: Email Delivery

## Overview

**Feature:** Email delivery for Voice of Repentance
**Problem:** The site has a signup form, a path structure, and a promised rhythm, but nothing has ever been sent. Meanwhile the live site already tells visitors what they will receive, and that description does not match what will actually ship first.
**Goal:** A weekly email going out reliably on Sunday morning, with the site telling the truth about it, and the more sophisticated path delivery scoped separately rather than blocking the simple thing.

## Context

`/walk` collects a name, an email, and a `path` choice, and posts them to the shared Cloudflare forms-worker, which writes a row to D1 and pings Telegram. Nothing consumes that yet. The strategy document (`tasks/strategy-ministry-2026.md`) calls the newsletter the forcing function for the entire ministry, because it is the only artifact with a deadline.

Two delivery models were considered and they solve different problems. A **shared broadcast** sends the same thing to everyone each week; it is simple, it has no per-subscriber state, and it is what makes new content land. A **path drip** delivers a fixed, finite sequence on each subscriber's own clock. It is a different workflow and a different newsletter, now scoped separately as F02 and deferred.

The decision is to ship the broadcast and defer the drip entirely. In the meantime every issue carries a standing link to `/paths`, so a subscriber who arrives mid-stream always has an on-ramp. That costs one line and removes most of the urgency behind F02.

## Stories

| ID | Title | Priority | Status |
|----|-------|----------|--------|
| F01-S01 | Shared weekly newsletter, Sunday 8:00am EST | Must-Have | Backlog |
| F01-S02 | Reconcile site copy with what actually sends | Must-Have | Backlog |
| F01-S03 | Sync `/walk` signups into beehiiv | Should-Have | Backlog |

The path drip moved out to **F02**, deferred. It is a separate newsletter with its own
delivery mechanism and its own obligations, not a variation of this one.

S02 must ship at the same time as S01 or before it. Sending the first newsletter while the site describes a different product is the one sequencing mistake that costs trust rather than time.

## Non-Goals

- Per-subscriber personalization beyond the `path` field already captured
- Any paid tier, donation ask, or sponsorship in the email. Unchanged constraint, see `docs/redesign-paths.md` §5.7
- Segmenting the `/ai-ministry` pastor audience onto this list. Explicitly out, see strategy §7
- Migrating away from the forms-worker. Beehiiv is additive; the D1 row and Telegram alert stay
- A second midweek send until the Sunday send has held for six consecutive weeks

## Dependencies

Verified in the live account on 2026-08-03.

- **Beehiiv MCP: connected.** Account and publication inspected directly
- **Workspace `Troy's Hiiv`, plan `launch` (free), 2,500 subscriber cap.** Sufficient for S01
- **Publication `The VOR Weekly`** (`pub_2591c0e5-…`), 2 active subscribers, sender name already `Voice of Repentance`, time zone already Eastern
- **Footer mailing address is `null`.** Hard blocker on any send. See S01
- **No `path` custom field.** Only `first_name` and `last_name` exist
- **API key: working.** Verified doing full read and write on the free plan (`GET` publications/subscriptions/custom_fields, `POST` custom_fields and subscriptions, `DELETE` subscriptions)
- **`path` custom field: created** 2026-08-03, and available as a `{{path}}` merge tag
- **Automations are a paid feature and Send API is Enterprise-only.** Both only matter for F02
- The forms-worker already accepts `source: 'walk'` with `metadata.path` (stored in the D1 `metadata` column). **Ezra is not in this path** — it was sunset and the forms cutover (`bb1b652`, 2026-07-03) removed it entirely
- Beehiiv `path` custom field must use the exact values in `WALK_OPTIONS` (`src/lib/paths.ts`)

## Success Metrics

- Six consecutive Sunday sends with none missed
- Every claim the site makes about the email is true on the day the first one goes out
- A subscriber who joins in any given week has an obvious route into a path from inside the email
- Every signup on the site reaches the list without manual intervention, once S03 ships

## Open Design Decisions

- **What goes in a thin week?** The send is weekly whether or not new work exists. A fixed structure that still works with no new essay (a song, one question, a link to the paths) makes the cadence survivable. Needs a decision before the first send.
- **Which mailing address?** Must not be the home address. A USPS PO Box or a CMRA street address both satisfy the FTC. Set at workspace level so future publications inherit it
- **Send identity confirmed:** Voice of Repentance, with Troy as its writer. Not "Troy Sybert's newsletter." Settled 2026-08-03.
- **Double opt-in, currently off.** Turning it on improves deliverability and list quality but loses some real signups. A tradeoff, not a best practice.

---

*Created: 2026-08-03*
