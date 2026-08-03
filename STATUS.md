---
project: vor-blog
status: active
phase: Paths redesign shipped — §5.8 steps 7-8 next
next_step: "Decide what happens to /ai-ministry: publish the three draft *-series posts, or rework the page. It currently links to three pages that 404 in production."
blockers:
  - "Analytics platform decision (Plausible recommended) — blocks Phase 1 of prd-marketing-prep"
key_people:
  - "Troy Sybert (author, operator)"
updated: 2026-08-03
---

## Next Steps

*(No `- [ ]` items in active PRDs — to-dos derived from PRD phase sections and `docs/redesign-paths.md` §5.8)*

- [ ] Resolve `/ai-ministry` dead links: publish the three `*-series` drafts or rework the page *(source: live defect, see CONTEXT.md Active Work)*
- [ ] §5.8 step 7 — wire Beehiiv worker-side; `WALK_OPTIONS` values must match the Beehiiv `path` custom field *(source: docs/redesign-paths.md)*
- [ ] §5.8 step 8 — split the `speaking@` alias and wire the second contact form *(source: docs/redesign-paths.md)*
- [ ] Pass a `description` prop to BaseLayout from `blog/tags/[tag].astro` — 5-minute crawl-gap fix *(source: prd-marketing-prep.md §2.3)*
- [ ] Decide whether the footer's first column needs a line of text; it is the site name plus social icons since the cost line was removed *(source: 2026-08-03 copy pass)*
- [ ] Decide analytics platform and install the script in `BaseLayout.astro` with custom events *(source: prd-marketing-prep.md §1.1)*

## Notes

Contact pipeline (Selah + general `/contact`) is live as of 2026-04-19. Endpoint routes through AILS Cloudflare tunnel → NGINX → Ezra `/api/vor/contact`, writes SQLite CRM, composes/sends welcome email via Ezra's agent graph, fires Telegram alert. NGINX config on the Mac Mini is now symlinked to `Selah/deployment/mac-mini/nginx-selah.conf` — no more config drift.

Paths redesign merged to `main` and deployed 2026-08-03 (§5.8 steps 1-6). The site is now four paths walked a week at a time; `/blog` index is retired and 301s to `/paths`, post URLs unchanged. Same deploy closed `prd-marketing-prep` §2.1 (images 56MB → 9.9MB; the four path covers were PNG data carrying a `.jpg` extension) and §2.3's 404 page, which also fixed a site-wide soft-404 that had been returning the homepage with a `200` for every unknown URL. Cloudflare Pages project is `vor-blog`; previews are `<branch>.vor-blog.pages.dev`.

Homepage copy pass, same day, deployed after the redesign. The "Am I Saved?" CTA was restored to the hero (card at `lg` and up, inline link below that) after the redesign dropped it. Headline cut to "Repentance is a direction." The "Who writes this" section was rewritten off the About page, trading four opening disclaimers for the avoidance pattern Troy watched in exam rooms and then recognized in Scripture. Every statement that the site costs nothing was removed as copy; the constraint itself stands and is recorded in CONTEXT.md Key Conventions. The survey's length was given three different ways (5, 10, 5) and is now five everywhere. One correction worth remembering: `not-sure-it-took.md` had told visitors "Nothing is submitted, nothing is scored, nobody sees them" about `/am-i-saved`, which posts name, email and the full written reflections to the Ezra backend when the visitor asks for the assessment by email.
