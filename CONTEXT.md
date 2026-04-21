---
project: vor-blog
updated: 2026-04-19
description: "Voice of Repentance — a personal ministry blog and Selah landing site built with Astro and Tailwind, deployed on Cloudflare Pages."
path: /Users/hackstert/Projects/web-sites/VOR-blog/CONTEXT.md
---

## Overview

Voice of Repentance (VOR) is Troy Sybert's personal ministry site at `www.voiceofrepentance.com`. It hosts a main blog, a separate "My Story" autobiographical section, and a Selah landing page that introduces a Christian-trained AI assistant currently in private pilot. Music releases are published as blog posts tagged `music` and surfaced on a dedicated `/music` page and homepage carousel. The site is live and actively being developed — roadmap in `tasks/roadmap-site-improvements.md`.

## Architecture

- **Framework:** Astro 5 with static output (`output: 'static'`)
- **Styling:** Tailwind CSS v3 + `@tailwindcss/typography` for Markdown prose
- **Integrations:** `@astrojs/tailwind`, `@astrojs/sitemap` (generates `sitemap-index.xml`), `@astrojs/rss` (generates `rss.xml` at build time)
- **Content collections** (`src/content.config.ts`):
  - `blog` — `src/content/blog/*.md`, schema: title, date, description, subtitle?, tags, coverImage?, draft
  - `story` — `src/content/story/*.md`, schema: title, date, description, chapter (number), coverImage?, draft
- **Layouts:** `BaseLayout.astro` (HTML shell, OG/Twitter meta, canonical URL, RSS autodiscovery); `PostLayout.astro` (post body, related posts, prev/next nav)
- **Contact pipeline:** Selah request form and `/contact` page both POST to `https://app.voiceofrepentance.com/api/vor/contact` — a FastAPI endpoint on the Ezra assistant (Mac Mini, port 8400) proxied through NGINX and the AILS Cloudflare tunnel. Submissions write to a SQLite CRM, trigger a welcome email via Ezra's agent graph, and fire a Telegram notification to Troy.
- **Deployment:** Cloudflare Pages auto-deploys on push to `main`. Build: `npm install && npm run build`. Output: `dist/`. Node 18.
- **Static config:** `public/_headers` (security + cache), `public/_redirects` (apex → www), `public/robots.txt`, `public/images/` for image assets.

## Key Conventions

- **Music filtering:** Posts tagged `music` are systematically excluded from `/blog` listings via collection-level query filters, and surfaced only on `/music` and the homepage music carousel. There is no separate music collection.
- **Reading time:** `src/utils/readingTime.ts` — word count / 200 wpm, min 1. Called at build time in `[...slug].astro` and threaded through every PostCard render site.
- **Tag filtering:** `/blog` and `/music` use client-side JS with `data-tags` JSON attributes on PostCard. Filter state does not persist across navigation.
- **Listen pages:** Music releases with full landing content (streaming links, lyrics, devotional) live at `src/pages/listen/[slug].astro` and are hand-authored — not generated from the content collection.
- **Images:** Live in `public/images/` and referenced via `coverImage: "/images/filename.png"` in front matter. Committed to the repo at current volume.
- **No tests or linting configured.** Build is the correctness gate — CI runs `npm run build` on push.
- **Tasks folder:** Active roadmap and PRDs live in `tasks/`. `tasks/completed/` is gitignored (local-only archive of finished PRDs).

## Dependencies

- **Runtime:** Node 18, Astro 5, Tailwind 3
- **Build-time integrations:** `@astrojs/rss`, `@astrojs/sitemap`, `@astrojs/tailwind`, `@tailwindcss/typography`
- **Hosting:** Cloudflare Pages (`www.voiceofrepentance.com`)
- **Sibling repos:**
  - `/Users/hackstert/Projects/ezra-assistant` — hosts the `/api/vor/contact` FastAPI endpoint and the async contact handler that composes/sends welcome emails and Telegram alerts
  - `/Users/hackstert/Projects/Selah` — contains the NGINX config (`deployment/mac-mini/nginx-selah.conf`) that proxies `/api/vor/` → Ezra port 8400; the live config on the Mac Mini is now symlinked to this file
- **Infrastructure:** Mac Mini running NGINX (via Homebrew), Ezra (launchd-managed), and the AILS Cloudflare tunnel (launchd-managed); routes `app.voiceofrepentance.com` → `localhost:80` → NGINX

## Active Work

Roadmap source of truth: `tasks/roadmap-site-improvements.md`.

- **4.2.1 Ezra email — Google Workspace migration.** Transfer `troy.sybert@cortivus.com` to an iCloud alias first, then provision a new Workspace at `voiceofrepentance.com` for Ezra, then cancel the Cortivus Workspace. Sequence matters — do not cancel first.
- **1.2 About page content.** Weakest page; needs a substantive narrative comparable to the Selah page.
- **2.4 My Story — additional chapters.** Only chapter 1 exists. Infrastructure complete; content work only.
- **4.3 Image storage via Mac Mini + AILS-tunnel.** Deferred until repo image volume becomes a real friction point.
- **4.4 Admin upload tool — edit/draft management.** Streamlit admin currently creates posts only; extending to edit existing posts and toggle draft status is a natural next iteration.
