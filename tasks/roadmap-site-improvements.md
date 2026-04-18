# VOR Site Improvement Roadmap

**Last updated:** 2026-04-18  
**Status:** Living document — items move to individual PRDs when work begins, to `completed/` when done.

---

## How to Use This

This roadmap captures everything worth doing, organized by priority tier. Items are assessed against the current state of the codebase as of April 2026. When you're ready to work on something, create a proper PRD from the relevant item and move work tracking there.

---

## Tier 1 — High Impact, Low Effort

### ~~1.1 Open Graph & Social Meta Tags~~ ✓ DONE (2026-04-18)

OG + Twitter card tags added to `BaseLayout.astro` with absolute URL construction via `Astro.site`. Cover images thread through `PostLayout.astro` as `og:image`; fallback is the wheat field hero. Blog posts get `article:author`, `article:published_time`, and `article:tag` properties. `town-called-nowhere.astro` migrated from manual Fragment to BaseLayout props. Facebook and YouTube social icon links added to footer.

---

### 1.2 About Page — Substantive Content

**What's there:** Three paragraphs and "More coming soon." This is the weakest page on the site and the one new visitors are most likely to read second after landing.

**What it should do:** Tell Troy's story in a way that grounds the ministry — who he is, what shaped his theology, why he built this site, what Voice of Repentance means to him. The Selah page has strong narrative content; the About page needs the same investment.

**Effort:** Content work, no code changes needed.

---

### ~~1.3 Hero Tagline~~ ✓ DONE (2026-04-18)

Updated `Hero.astro` default tagline to: *"Repentance isn't a moment. It's the life you're called to live."*

---

### ~~1.4 "New Music" Badge on PostCard~~ ✓ DONE (2026-04-18)

Added `isNew?: boolean` prop to `PostCard.astro`; badge only renders when `isNew={true}`. Updated `index.astro` and `music.astro` to pass `isNew={i === 0}` so only the most recent music post gets the badge.

---

### 1.5 Selah Contact — Notification & CRM

**Current state:** The Selah access request form POSTs to a local FastAPI service that writes to a flat JSON file with no notification. The service runs on the Mac Mini as a separate process on port 3201.

**Evolved approach:** This item has been superseded by a full contact handler PRD. See `tasks/prd-vor-contact-handler.md`. The plan: retire the standalone access-request service, add a `/api/vor/contact` endpoint to Ezra, write submissions to a SQLite CRM (`data/vor_crm.db`), and trigger an async handler that sends Troy a Telegram alert and the submitter a personalized welcome email via Ezra's existing iCloud SMTP skill. Phase 2 (future) is a standalone VOR agent with its own manifest and agent ID.

**Interim patch:** `Selah/services/access-request/server.py` was updated with a Telegram notification on submission as a stopgap. Not yet deployed — superseded by the PRD approach above.

---

## Tier 2 — Reader Experience

These improve the experience for someone who is actually reading and exploring the site. Not urgent with current content volume but become more important as posts accumulate.

### ~~2.1 In-Post Navigation — Previous / Next Links~~ ✓ DONE (2026-04-18)

Previous/Next links added to the bottom of `PostLayout.astro`. Posts sorted by date in `[...slug].astro`; adjacent posts passed as `prevPost`/`nextPost` props. Two-column nav renders below post content, hidden on oldest/newest where one side is absent.

---

### ~~2.2 Related Posts Section~~ ✓ DONE (2026-04-18)

"You might also like" section added above the prev/next nav in `PostLayout.astro`. Related posts computed at build time in `[...slug].astro` — ranked by tag overlap count, then recency, capped at 3. Rendered using `PostCard` in a responsive 1–3 column grid. Hidden when no tag matches exist.

---

### ~~2.3 Estimated Reading Time~~ ✓ DONE (2026-04-18)

`src/utils/readingTime.ts` utility added (word count / 200 wpm, min 1). Displayed as "X min read" next to the date in `PostCard` and `PostLayout`. Threaded through all five PostCard render sites (blog/index, blog/tags/[tag], music, homepage carousels) and through the relatedPosts data structure in `[...slug].astro`.

---

### 2.4 My Story — Additional Chapters

**What's there:** Chapter 1 exists. The infrastructure (collection, layout, listing page) is complete and working.

**What's needed:** Content. The story section reads as abandoned with a single chapter. Even two or three chapters would signal an active, ongoing work.

**Effort:** Content work — no code changes needed.

---

## Tier 3 — SEO & Discoverability

### ~~3.2 Canonical URLs~~ ✓ DONE (2026-04-18)

Added as part of 1.1 — `<link rel="canonical">` now rendered in `BaseLayout.astro` using `Astro.url` and `Astro.site`.

---

### ~~3.1 Sitemap & robots.txt~~ ✓ DONE (2026-04-18)

`@astrojs/sitemap` installed and added to `astro.config.mjs`. Sitemap generates at `sitemap-index.xml` on each build. `public/robots.txt` created with `Allow: /` and sitemap pointer.

---

### 3.3 RSS Feed

**What's missing:** No RSS/Atom feed. Useful for readers who use feed readers and signals to aggregators that this is an active publication. Astro has a first-party `@astrojs/rss` package for this.

**Effort:** Small — one new page (`/rss.xml.ts`) using the existing content collection.

---

## Tier 4 — Features (Planned)

Each will need its own PRD when the time comes.

### 4.1 YouTube Integration on Music Posts

**Context:** Currently the YouTube player is embedded directly in the markdown body of each music post as a raw iframe. This works but is fragile — no consistent sizing, no responsive wrapper, no error handling if the video is unavailable.

**Direction:** A dedicated `YouTubeEmbed.astro` component that takes a video ID, renders a responsive iframe with proper aspect ratio, and can be used either via an MDX component or as a standalone element on the listen page.

**PRD:** `tasks/prd-youtube-embed.md` — recommends Option A (component used in dedicated listen pages, not MDX migration) for now.

---

### 4.2 General Contact Form (Blog Visitors)

**Context:** A contact mechanism exists for Selah access requests (see 1.5 / `prd-vor-contact-handler.md`), but there is no general contact path for blog visitors — people who want to respond to a post, ask a question, or reach Troy about VOR independent of Selah.

**Direction:** A simple contact form on the About page or a dedicated `/contact` route, POSTing to the same Ezra endpoint pattern established in the contact handler PRD. The CRM schema already includes a `source` field to distinguish submission origins.

---

### 4.3 Cloudflare R2 for Image Storage

**Context:** Images currently live in `public/images/` and are committed to the repository. This is fine at low volume but will become unwieldy as the music catalog and blog grow.

**Direction:** Move images to R2, serve via Cloudflare's CDN. The admin upload tool already writes locally — it would need updating to upload to R2 instead.

---

### 4.4 Admin Upload Tool — Post Management

**Context:** The admin tool (Streamlit, local-only) creates new posts. It does not support editing existing posts, managing drafts, or deleting content.

**Direction:** Extend the admin tool with an "Edit Post" mode that reads existing front matter into the form fields. Draft management (toggle draft status) is a natural addition at the same time.

---

### 4.5 Image Carousels for Posts

**Context:** Noted as a future plan. Would allow photo-essay style posts or gallery views for music releases.

**Direction:** A lightweight client-side carousel component (no external library needed given the existing carousel pattern already in `index.astro`). Only relevant once there are posts with multiple images.

---

## Completed Work (Reference)

See `tasks/completed/` for PRDs covering:

- Full site rebuild (Astro + Tailwind, replacing Hugo/Gruvbox)
- Cloudflare Pages migration and custom domain setup
- Admin upload tool (Streamlit, local-only)
- Blog & Music page redesign (content separation, PostCard layout, tag filtering, Load More)

Session 2026-04-18:

- 1.1 Open Graph, Twitter card, canonical URL, social meta tags
- 1.3 Hero tagline updated
- 1.4 New Music badge made dynamic
- 3.2 Canonical URLs (completed as part of 1.1)
- `prd-vor-contact-handler.md` created for Ezra-based CRM contact pipeline
- Roadmap created
