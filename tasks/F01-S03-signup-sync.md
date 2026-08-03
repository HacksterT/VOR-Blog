---
type: prd
feature: F01
story: F01-S03
status: draft
created: 2026-08-03
priority: medium
---

# F01-S03: Sync `/walk` signups into beehiiv

**Feature:** F01 — Email Delivery
**Priority:** Should-Have

## Summary

Today someone who signs up on `/walk` lands in the Ezra CRM and your Telegram, and never
reaches beehiiv. They are not on the list, so when Sunday's issue sends they do not get
it. This closes that gap by having the existing Cloudflare forms-worker create the
beehiiv subscriber in the same request, carrying the path they chose.

Deliberately **not** a blocker for the first send. At two subscribers you can add people
by hand. It becomes urgent the moment a stranger signs up and silently receives nothing,
which is why it should land soon after F01-S01 rather than long after.

## Acceptance Criteria

- [ ] A `/walk` submission creates a beehiiv subscriber with email and first name
- [ ] The chosen path is stored on the subscriber in the `path` custom field
- [ ] "Riding along" stores as `riding-along`, not as empty
- [ ] The existing Ezra call still runs: CRM record written, Telegram alert fired
- [ ] A beehiiv failure does not fail the whole submission. The visitor still sees success
      and the CRM record still exists
- [ ] The beehiiv API key lives in Cloudflare Worker secrets and never reaches the browser
- [ ] A duplicate signup does not create a second subscriber or throw a visible error
- [ ] Verified end to end with a real signup through the live form

## Tasks

- [ ] Add the beehiiv API key as a Worker secret in `site-infra/forms-worker`
- [ ] On `source === 'walk'`, POST to `/v2/publications/{pub}/subscriptions` with email,
      First Name, and the `path` from `metadata.path`
- [ ] Make the beehiiv call non-fatal: log and continue on failure, never block the Ezra
      write or the visitor's success state
- [ ] Handle the duplicate-email response without surfacing an error
- [ ] Test through the live `/walk` form, then remove the test subscriber
- [ ] Confirm the subscriber shows the correct `path` value in beehiiv

## Technical Notes

**Correction to an earlier draft:** the integration point is the **Cloudflare
forms-worker**, not Ezra. `src/lib/formSubmit.ts` posts to
`https://forms-worker.troysybert.workers.dev/submit`, which verifies Turnstile, writes
one row to D1, and pings Telegram. It does **not** fan out to Ezra — verified
2026-08-03, its only outbound calls are Turnstile, Telegram, and Resend, and both
Resend paths are gated to `site === "cortivus"`. Ezra was sunset and left this path
entirely at the forms cutover (`bb1b652`, 2026-07-03). Adding the beehiiv call in the
Worker keeps the secret in Cloudflare and means a signup does not depend on the Mac
Mini being awake.

The exact call was verified against the live account on 2026-08-03 and returned `201`:

```
POST /v2/publications/{pub}/subscriptions
{ "email": "...",
  "send_welcome_email": false,
  "custom_fields": [ { "name": "path",       "value": "rules-cage" },
                     { "name": "First Name", "value": "..." } ] }
```

Confirmed along the way:

- The v2 API does full read and write on the free `launch` plan. No upgrade needed
- The `path` custom field now exists on the publication, created 2026-08-03
- Custom fields are set **at creation**, so this is one call, not create-then-update
- New subscribers land in status `validating` while beehiiv verifies them, not `active`
- `DELETE /subscriptions/{id}` works, which is how the test record was cleaned up

Path values must match `WALK_OPTIONS` in `src/lib/paths.ts` exactly: `rules-cage`,
`same-thing-again`, `not-sure-it-took`, `look-away`, `riding-along`.

Nothing consumes `path` yet. It is stored now because it costs nothing to capture and is
expensive to backfill, and because it is already available as a `{{path}}` merge tag for
personalising a line in the shared Sunday issue.

## Blockers

- `site-infra/forms-worker` is a separate repo and is not on this machine
