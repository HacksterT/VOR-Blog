---
project: vor-blog
updated: 2026-08-03
description: "Voice of Repentance — Troy Sybert's ministry site, restructured from a blog-with-archive into four guided paths walked one week at a time. Astro + Tailwind on Cloudflare Pages."
path: /Users/hackstert/Projects/web-sites/VOR-blog/CONTEXT.md
---

## Overview

Voice of Repentance (VOR) is Troy Sybert's personal ministry site at `www.voiceofrepentance.com`. As of the August 2026 redesign it is no longer a blog with an archive. The organizing unit is now the **path**: a named struggle ("When the rules feel like a cage", "Same thing, again") walked over three to five weekly readings called **turns**. Visitors self-select a path at `/start-here` by which sentence sounds like them, then walk it a week at a time.

The site also hosts a "My Story" autobiographical section, a Selah landing page for the Christian-trained AI assistant in private pilot, an "AI in Ministry" hub, an "Am I Saved?" survey lead magnet, music releases, and the book page. There is deliberately **no archive page** — content without a path is not reachable by browsing, which is a forcing function on content strategy, not an oversight.

## Architecture

- **Framework:** Astro 5, static output (`output: 'static'`)
- **Styling:** Tailwind CSS v3 + `@tailwindcss/typography`
- **Integrations:** `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/rss`
- **Content collections** (`src/content.config.ts`):
  - `blog` — `src/content/blog/*.md`: title, date, description, subtitle?, tags, coverImage?, draft, series?, seriesPart?
  - `story` — `src/content/story/*.md`: title, date, description, chapter, coverImage?, draft
  - `paths` — `src/content/paths/*.md`: title, number (string, preserves leading zero), order, forWhom, coverImage?, turns (array of blog post ids), finalTurn? (a page rather than a post), sundaySit? (music post id), draft. The markdown **body** is the ~150-word path intro.
- **`src/lib/paths.ts`** — the spine of the redesign. Resolves the `paths` collection against the `blog` collection, sums reading time from real post bodies, builds post-page furniture (`getPathNavIndex`), and computes the current turn (`getCurrentTurn`). Also exports `WALK_OPTIONS` for the signup form.
- **Layouts:** `BaseLayout.astro` (HTML shell, OG/Twitter meta, canonical, RSS autodiscovery); `PostLayout.astro` (post body, "Path NN · Week N of M" kicker above the title, "Next turn" link below, cross-path "Also here" note)
- **Components:** `PathCard.astro`, `WalkForm.astro`, `Header.astro`, `Footer.astro`, plus the pre-redesign `PostCard.astro`, `SectionHeading.astro`, `Hero.astro`, `YouTubeEmbed.astro`
- **Pages & routing:**
  - `/` — hero (with the "Am I Saved?" card at `lg` and up, an inline link below that), this week's turn, four path cards, the rhythm and its "Choose a path" CTA, the book, Troy. No carousels, no tag cloud.
  - `/start-here` — four quoted first-person sentences, each a matted photo linking to its path
  - `/paths`, `/paths/[slug]` — all paths; path intro + week list + Sunday sit
  - `/this-week` — permalink to the most recently dated turn across all paths
  - `/walk` — signup with the path selector
  - `/blog/[...slug]`, `/blog/tags/[tag]` — individual posts and tag pages. **`/blog/index.astro` is deleted**; `/blog` 301s to `/paths`.
  - `/404` — real 404 page routing visitors to the four paths
  - `/music`, `/listen/[slug]`, `/story`, `/story/[slug]`, `/ai-ministry`, `/am-i-saved`, `/selah`, `/about` (prose **plus** the `#contact` form), `/book`. **`/contact` is deleted** and 301s to `/about#contact`.
- **Header nav:** `Start Here · This Week · Paths · Music · The Book · Troy` plus a "Walk with me" button. **No dropdowns anywhere.** The old AI-in-Ministry dropdown is gone.
- **Contact pipeline:** all five forms (`/about#contact`, Selah, am-i-saved, `/ai-ministry`, `/walk`) POST through `src/lib/formSubmit.ts` to the shared Cloudflare forms-worker at `https://forms-worker.troysybert.workers.dev/submit`, which verifies Turnstile, derives `site` from the Origin, writes one row to Cloudflare D1 `forms-db`, and pings Telegram. That Worker lives in `/Users/hackstert/Projects/crm`, which owns the form backend for all three of Troy's sites. **Ezra is out of this path entirely** — sunset, with its `vor_crm.db` migrated to D1 on 2026-07-03. The Worker sends no VOR email, which is why the am-i-saved assessment is currently undelivered (see `tasks/F03-S05-am-i-saved-assessment-email.md`). `/walk` submits `source: 'walk'` with `metadata.path`. The `/about#contact` form routes by reason: leader reasons (speaking, leadership, partnership) tag `source: 'speaking'` and reveal optional organization/role fields; everything else tags `contact`. Beehiiv is intended to be wired **worker-side**, so no API key ever ships to the client.
- **Deployment:** Cloudflare Pages project **`vor-blog`** (not `voiceofrepentance` — previews are `<branch>.vor-blog.pages.dev`). Auto-deploys on push to `main`. Build `npm install && npm run build`, output `dist/`, Node 18.

## Key Conventions

- **Turn ids are blog filenames minus `.md`.** `src/lib/paths.ts` **throws at build time** when a path lists a turn that is not a published post. Never weaken this check or wrap it in try/catch — a broken path must not reach a preview quietly. Fix the id or unset `draft` on the post.
- **A post in two paths gets the lower-`order` path as primary.** The others render as an "Also here" note. `carrots-sticks-and-the-heart-of-stone` is the live example (Path 01 week 2, also in Path 02).
- **`/this-week` is computed, never configured.** It resolves to the most recently dated turn in any path. There is no weekly file to remember to edit.
- **Every content photograph goes through `.plate`.** The homepage hero is the only full-bleed image on the site.
- **Design tokens in `src/styles/global.css`:** `.plate`, `.kicker` / `.kicker-muted`, `.btn-line`, `.btn-quiet`, `.hairline`, `.measure` / `.measure-tight`, themed focus ring. Structure is carried by hairlines and matted plates rather than boxes.
- **No archive, ever.** If content has no path, the answer is to write a path, not to build a listing page.
- **The reader never pays, and the site no longer says so.** The constraint holds: never add a donate link, tip jar, paid tier, course, countdown, or exit-intent popup, and no booking calendar or Cal.com embed (email only). Scope matters: this governs what the *visitor* is asked for. It is not a ban on every funding model — reader-invisible funding is an open question Troy is deliberately not front-loading, not a closed one. See `docs/redesign-paths.md` §5.6, §5.7, §6. But as of 2026-08-03 the *copy* asserting it was removed everywhere it appeared — homepage block, footer, signup form, `/walk`'s "What this is not", and two meta descriptions — on the grounds that a site with no prices does not need to announce it. Do not reintroduce the claim as copy; just keep the constraint.
- **Say what is true about the survey.** `/am-i-saved` posts `name`, `email`, and `metadata: { reflections }` to the forms-worker when a visitor asks for the assessment by email, so the written reflections leave the device (now capped at 1200 characters each). Copy describing the survey must not imply otherwise. The `finalTurn.note` in `not-sure-it-took.md` claimed "Nothing is submitted… nobody sees them" and was corrected on 2026-08-03.
- **Music filtering:** posts tagged `music` are excluded from blog queries and surfaced on `/music` and as path Sunday Sits.
- **AI Ministry track tags:** `theological-series`, `practical-series`, `landscape-series` organize `/ai-ministry` independently of blog tag filtering.
- **Reading time:** `src/utils/readingTime.ts`, word count / 200 wpm, min 1. Summed from real post bodies in `paths.ts`, never hand-entered.
- **Images:** live in `public/images/`, referenced as `coverImage: "/images/…"`. Keep them compressed. An August 2026 pass took the directory from 56MB to 9.9MB; the four path covers had shipped as PNG data wearing a `.jpg` extension at 4-9MB each.
- **No tests or linting configured.** `npm run build` is the correctness gate.
- **Tasks:** PRDs in `tasks/` using the F##/S## convention; `tasks/completed/` is gitignored for *new* files, though existing tracked ones stay tracked through a `git mv`. Specs live in `docs/`: `redesign-paths.md` for structure, `content-addition-guide.md` for process.

## Dependencies

- **Runtime:** Node 18, Astro 5, Tailwind 3
- **Build-time:** `@astrojs/rss`, `@astrojs/sitemap`, `@astrojs/tailwind`, `@tailwindcss/typography`
- **Image tooling:** `sharp` (present transitively via Astro) used ad hoc for compression passes; not wired into the build
- **Hosting:** Cloudflare Pages, project `vor-blog`, custom domain `www.voiceofrepentance.com`
- **Sibling repos:**
  - `/Users/hackstert/Projects/crm` — **owns the form backend for all three sites.** The `worker/` directory is the deployed forms-worker; `worker/CONTRACT.md` is the canonical form contract; `docs/tech-guide.md` is the operator map. Contacts live in Cloudflare D1 `forms-db`.
  - `/Users/hackstert/Projects/ezra-assistant` — **no longer in any live path.** Sunset at the 2026-07-03 forms cutover; its `contact_handler` and `survey_email.py` still exist but nothing calls them. Status undecided, see `tasks/F03-S07-decide-ezra-status.md`.
  - `/Users/hackstert/Projects/Selah` — NGINX config at `deployment/mac-mini/nginx-selah.conf` proxying `/api/vor/` to Ezra port 8400; the live Mac Mini config is symlinked to it.
- **Infrastructure:** Mac Mini running NGINX (Homebrew), Ezra (launchd), and the AILS Cloudflare tunnel (launchd). `app.voiceofrepentance.com` → localhost:80 → NGINX → Ezra 8400.

## Active Work

Redesign spec: `docs/redesign-paths.md`. Steps 1-6 of §5.8 shipped to `main` on 2026-08-03. Strategy: `tasks/strategy-ministry-2026.md`. Active PRDs: `tasks/F01-email-delivery.md`, `tasks/prd-marketing-prep.md`. Deferred: `tasks/F02-path-drip-newsletter.md`. Smaller items: `tasks/F03-parking-lot.md`. `roadmap-site-improvements.md` was retired 2026-08-03 and moved to `completed/`.

- **§5.8 step 7 — Beehiiv swap and the `path` custom field.** Ships on `main` without touching layout. The `/walk` form already posts `source: 'walk'` and `metadata.path`; the worker side needs to forward to Beehiiv. `WALK_OPTIONS` values in `src/lib/paths.ts` must match the Beehiiv `path` custom field.
- **§5.8 step 8 — split the `speaking@` alias and wire the second contact form.**
- **`/ai-ministry` links three unpublished posts.** `getCollection('blog')` there does not filter drafts, and every `*-series` tagged post is `draft: true`, so the flagship cards and all three track sections point at pages that are never built. These now visibly 404 rather than silently landing on the homepage. Needs a decision: publish the three, or rework the page.
- **Marketing Readiness Prep** (`prd-marketing-prep.md`, Planning) — no analytics, no durable email list. Blocked on two vendor decisions: analytics (Plausible recommended) and email (Beehiiv, which step 7 now commits to).
- **Content backlog:** My Story still has one chapter (`F03-S01`). The About page is done.
