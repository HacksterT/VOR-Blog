---
type: prd
feature: F01
story: F01-S03
status: draft
created: 2026-08-03
priority: medium
---

# F01-S03: Path drip sequence, self-hosted

**Feature:** F01 — Email Delivery
**Priority:** Should-Have

## Summary

A finite, path-scoped email sequence: a subscriber who chooses a path receives that
path's turns one per week, in order, starting at week one whenever they arrive, and
when the path ends it ends. They then fall into the shared Sunday broadcast from
F01-S01. This is explicitly **not** a back-catalog dump. A subscriber gets the one path
they asked for and nothing else, because material nobody asked for is the failure mode
this design exists to avoid.

The value is insurance rather than sophistication. Path content is already written and
never changes, so a new subscriber gets a complete, coherent four weeks even in a week
when nothing new is produced. Only the broadcast depends on the writing cadence.

**Built on our own infrastructure, not on beehiiv.** Beehiiv automations are a paid
feature and we are not upgrading. More decisively, beehiiv cannot send the individual
emails a drip requires at any tier we would buy. So we own the scheduling, the state,
and the sending; beehiiv stays the broadcast tool and the list of record.

## Acceptance Criteria

- [ ] Choosing a path at `/walk` enrolls the subscriber in that path's sequence
- [ ] Turns arrive one per week, in path order, starting at week one regardless of join date
- [ ] The sequence terminates at the path's final turn. No repetition, no back catalog
- [ ] On completion the subscriber is marked complete and receives only the broadcast
- [ ] **No subscriber receives both a drip email and the Sunday broadcast in the same
      week.** This is the correctness requirement
- [ ] "Riding along" skips the drip entirely
- [ ] Every drip email carries a working unsubscribe link, honoured across both systems
- [ ] Unsubscribing from the drip does not silently leave them subscribed to the broadcast,
      or vice versa, without it being clear which they left
- [ ] Sending domain passes SPF, DKIM and DMARC, verified with a real inbox test
- [ ] A missed cron run does not double-send or skip a week when it recovers
- [ ] Each drip email links to its turn on the site rather than reproducing it whole

## Tasks

- [ ] Choose the sending path: Ezra's existing email capability, or Cloudflare Email
      Service. See Technical Notes; this is the decision the rest depends on
- [ ] Complete Stripe Identity Verification in beehiiv and generate an API key, so
      signups can sync to the list
- [ ] Add drip state to Ezra's CRM: subscriber, path, current week, status, last sent
- [ ] Build the weekly job that selects due subscribers and sends the next turn
- [ ] Make the job idempotent, keyed on (subscriber, path, week), so a retry or a late
      run cannot double-send
- [ ] Author the 16 turn emails, 4 paths at 4 turns, adapted from existing essays
- [ ] Implement unsubscribe handling that reconciles with beehiiv subscription state
- [ ] Set up SPF, DKIM and DMARC for the sending domain, then test to Gmail, Outlook
      and iCloud
- [ ] Test end to end with a real address through one full four-week path
- [ ] Update site copy again to describe the drip, reversing part of F01-S02

## Technical Notes

Verified in the account and beehiiv documentation on 2026-08-03:

| Constraint | Finding |
| --- | --- |
| Workspace plan | `launch` (free), cap 2,500 subscribers |
| Automations | "paid plans". Not upgrading, so unavailable |
| Send API (arbitrary sends) | **Enterprise only, currently beta.** Unavailable at any realistic tier |
| API keys | Require Stripe Identity Verification first |
| Existing automations | 0 |

The Send API finding is the one that drives the design. Beehiiv's normal model is
"publish a post, blast it to a list or segment". It is not built to send subscriber X
their week 3 email today and subscriber Y their week 1 email today. Since that is
exactly what a drip is, beehiiv cannot be the drip engine even if we paid for
automations, unless we used their automation builder, which is the paid feature we are
declining. Therefore our side owns sending.

**The real cost to name: we take on deliverability.** Beehiiv currently handles sending
reputation, DKIM and SPF, bounce and complaint processing, unsubscribe compliance, and
list hygiene. Sending drip mail ourselves means owning all of it, and it splits sending
reputation across two systems for the same list. For a ministry where the entire point
is that the email actually arrives in someone's inbox, that is a genuine cost, not a
formality. It is the strongest argument for keeping the drip deferred until the
broadcast has proven itself.

Two viable senders:

- **Ezra.** Already sends welcome email through its agent graph, already holds the CRM
  in SQLite, already runs under launchd on the Mac Mini with a scheduler available.
  Lowest new surface area. Risk is that it is a home-network dependency for something
  time-sensitive.
- **Cloudflare Email Service.** The site already runs on Cloudflare Pages, and a Worker
  with a cron trigger plus Email Sending gives proper managed deliverability without
  beehiiv's price. Higher setup cost, better reputation handling, no dependency on the
  Mac Mini being up on a Wednesday morning.

Recommendation is Cloudflare, on the grounds that a missed send is the failure this
whole feature is meant to prevent, and a home server is the least reliable link in
the chain.

**Sunday stays shared.** The drip carries only the weekly turns; the Sunday song remains
one broadcast to everyone through beehiiv. It halves the authoring from 32 emails to 16,
and everyone sitting with the same song on the same day is the first genuinely communal
thing on either property. Community is the north star, and a personalised Sunday is more
correct but less together.

## Blockers

- Sender decision (Ezra vs Cloudflare) blocks everything else
- Stripe Identity Verification blocks API key generation and therefore list sync
- F01-S01 should be sending reliably first. A drip that graduates subscribers into a
  broadcast that does not exist yet has nowhere to put them
