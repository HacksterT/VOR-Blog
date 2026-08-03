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

`/walk` collects a name, an email, and a `path` choice, and posts them to the Ezra worker. Nothing consumes that yet. The strategy document (`tasks/strategy-ministry-2026.md`) calls the newsletter the forcing function for the entire ministry, because it is the only artifact with a deadline.

Two delivery models were considered and they solve different problems. A **shared broadcast** sends the same thing to everyone each week; it is simple, it has no per-subscriber state, and it is what makes new content land. A **path drip** delivers a fixed, finite sequence on each subscriber's own clock; its value is that it works in a week when nothing new is written. Beehiiv cannot provide it at a price we will pay, so it is scoped as self-hosted.

The decision is to ship the broadcast first and defer the drip. The drip is not abandoned, and it is deliberately *not* framed as "catch up on everything" — a subscriber gets one path, one email per week, and when the path ends it ends. Back catalog they did not ask for is the failure mode to avoid.

## Stories

| ID | Title | Priority | Status |
|----|-------|----------|--------|
| F01-S01 | Shared weekly newsletter, Sunday 8:00am EST | Must-Have | Backlog |
| F01-S02 | Reconcile site copy with what actually sends | Must-Have | Backlog |
| F01-S03 | Path drip sequence, self-hosted | Should-Have | Backlog |

S02 must ship at the same time as S01 or before it. Sending the first newsletter while the site describes a different product is the one sequencing mistake that costs trust rather than time.

## Non-Goals

- Per-subscriber personalization beyond the `path` field already captured
- Any paid tier, donation ask, or sponsorship in the email. Unchanged constraint, see `docs/redesign-paths.md` §5.7
- Segmenting the `/ai-ministry` pastor audience onto this list. Explicitly out, see strategy §7
- Migrating away from the Ezra worker. Beehiiv is additive; the CRM record and Telegram alert stay
- A second midweek send until the Sunday send has held for six consecutive weeks

## Dependencies

Verified in the live account on 2026-08-03.

- **Beehiiv MCP: connected.** Account and publication inspected directly
- **Workspace `Troy's Hiiv`, plan `launch` (free), 2,500 subscriber cap.** Sufficient for S01
- **Publication `The VOR Weekly`** (`pub_2591c0e5-…`), 2 active subscribers, sender name already `Voice of Repentance`, time zone already Eastern
- **Footer mailing address is `null`.** Hard blocker on any send. See S01
- **No `path` custom field.** Only `first_name` and `last_name` exist
- **Automations are a paid feature and we are not upgrading.** S03 is therefore self-hosted
- **Send API is Enterprise-only.** Beehiiv cannot send per-subscriber drip email at any tier we would buy, so our side must own sending, not just scheduling
- **API keys require Stripe Identity Verification** before they can be generated
- Ezra worker (`/api/vor/contact`) already accepts `source: 'walk'` with `metadata.path`
- Beehiiv `path` custom field must use the exact values in `WALK_OPTIONS` (`src/lib/paths.ts`)

## Success Metrics

- Six consecutive Sunday sends with none missed
- Every claim the site makes about the email is true on the day the first one goes out
- A subscriber who joins in any given week has an obvious route into a path from inside the email
- Zero subscribers receiving both a drip email and a broadcast in the same week, once S03 ships

## Open Design Decisions

- **What goes in a thin week?** The send is weekly whether or not new work exists. A fixed structure that still works with no new essay (a song, one question, a link to the paths) makes the cadence survivable. Needs a decision before the first send.
- **Which system sends the drip, Ezra or Cloudflare Email Service?** Recommendation is Cloudflare, because a missed send is exactly the failure the drip exists to prevent and the Mac Mini is the least reliable link. This decision blocks all of S03
- **Does the Sunday email stay shared once the drip exists?** Recommendation is yes. Everyone sitting with the same song on the same day is the first genuinely communal thing on either property, and community is the north star. This diverges from the site, where each path week has its own song, so it is a real trade rather than an oversight.
- **Send identity confirmed:** Voice of Repentance, with Troy as its writer. Not "Troy Sybert's newsletter." Settled 2026-08-03.
- **What happens when someone finishes a path?** They fall into the broadcast segment. Whether the final email also offers a second path is open.

---

*Created: 2026-08-03*
