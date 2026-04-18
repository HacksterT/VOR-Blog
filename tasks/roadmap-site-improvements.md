# VOR Site Improvement Roadmap

**Last updated:** 2026-04-18 (added 1.5 access request notifications, corrected 4.2)  
**Status:** Living document — items move to individual PRDs when work begins, to `completed/` when done.

---

## How to Use This

This roadmap captures everything worth doing, organized by priority tier. Items are assessed against the current state of the codebase as of April 2026. When you're ready to work on something, create a proper PRD from the relevant item and move work tracking there.

---

## Tier 1 — High Impact, Low Effort

These are gaps or weaknesses that a visitor will notice immediately. Should be addressed before any significant promotion of the site.

### ~~1.1 Open Graph & Social Meta Tags~~ ✓ DONE (2026-04-18)

OG + Twitter card tags added to `BaseLayout.astro` with absolute URL construction via `Astro.site`. Cover images thread through `PostLayout.astro` as `og:image`; fallback is the wheat field hero. Blog posts get `article:author`, `article:published_time`, and `article:tag` properties. `town-called-nowhere.astro` migrated from manual Fragment to BaseLayout props. Canonical link added to all pages. Facebook and YouTube social links added to footer.

---

### 1.2 About Page — Substantive Content

**What's there:** Three paragraphs and "More coming soon." This is the weakest page on the site and the one new visitors are most likely to read second after landing.

**What it should do:** Tell Troy's story in a way that grounds the ministry — who he is, what shaped his theology, why he built this site, what Voice of Repentance means to him. The Selah page has strong narrative content; the About page needs the same investment.

**Effort:** Content work, no code changes needed.

---

### ~~1.3 Hero Tagline~~ ✓ DONE (2026-04-18)

Updated `Hero.astro` default tagline to: *"Repentance isn't a moment. It's the life you're called to live."*

---

### 1.5 Selah Access Request — Telegram Notification on Submission

**What's missing:** The Selah access request form on `/selah` POSTs to a local FastAPI service (`Selah/services/access-request/server.py`) which appends to `Selah/data/access-requests.json`. There is no notification mechanism. Troy must manually open the file to discover new submissions, which doesn't happen in practice.

**Current state:** The JSON has 9 entries as of April 2026 — all test submissions from initial setup. No real access requests have come in yet (Selah is invite-only), but when they do, they will go unnoticed.

**Recommended fix:** Add a Telegram notification directly to the `create_request` endpoint in `server.py`. When a POST is received and written to the JSON, fire an async HTTP call to the Telegram Bot API with the submitter's name, email, and message. Reuse `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from environment (same values Ezra already manages).

**Why not a cron job:** Polling a file daily introduces up to 24 hours of delay and requires a "last seen" cursor to track new entries. The inline notification fires at write time with no additional infrastructure. The only addition is `httpx` as a dependency in `server.py` (already available in the Python environment).

**Scope:** This is a change to `Selah/services/access-request/server.py`, not the VOR blog repo. Tracked here because the form lives on the VOR site and the gap was identified during VOR site review.

**Effort:** Very small — ~20 lines added to `server.py`.

---

### ~~1.4 "New Music" Badge on PostCard~~ ✓ DONE (2026-04-18)

Added `isNew?: boolean` prop to `PostCard.astro`; badge only renders when `isNew={true}`. Updated `index.astro` and `music.astro` to pass `isNew={i === 0}` so only the most recent music post gets the badge.

---

## Tier 2 — Reader Experience

These improve the experience for someone who is actually reading and exploring the site. Not urgent with current content volume but become more important as posts accumulate.

### 2.1 In-Post Navigation — Previous / Next Links

**What's missing:** No way to move between posts from within a post. Readers must return to `/blog` to find another post.

**What to add:** Previous and Next post links at the bottom of `PostLayout.astro`, ordered by date. Can be simple links with post title — no need for a card layout at this stage.

**Effort:** Moderate — requires passing adjacent post data into the layout from `[...slug].astro`.

---

### 2.2 Related Posts Section

**What's missing:** No content recommendations within a post. A reader engaged with a theological topic has no guided path to more of the same.

**What to add:** A "You might also like" section at the bottom of each post, showing 2–3 posts sharing at least one tag. Simple tag-overlap matching at build time, no ML needed.

**Effort:** Moderate — build-time computation in the post page, reuse PostCard component.

---

### 2.3 Estimated Reading Time

**What's missing:** No reading time indicator on post cards or post headers. Standard expectation for a content-focused blog.

**What to add:** Word count divided by 200 wpm, rounded to nearest minute, displayed near the date in both PostCard and PostLayout. Can be computed at build time from the post body.

**Effort:** Small — utility function plus display in two components.

---

### 2.4 My Story — Additional Chapters

**What's there:** Chapter 1 exists. The infrastructure (collection, layout, listing page) is complete and working.

**What's needed:** Content. The story section reads as abandoned with a single chapter. Even two or three chapters would signal an active, ongoing work.

**Effort:** Content work — no code changes needed.

---

## Tier 3 — SEO & Discoverability

These don't change what visitors see but affect whether they find the site in the first place. Low urgency while the site is in early growth, higher priority once content volume is meaningful.

### 3.1 Sitemap & robots.txt

**What's missing:** No `sitemap.xml`, no `robots.txt`. Astro has a first-party `@astrojs/sitemap` integration that generates this automatically from static routes.

**Effort:** Very small — one package install, one config line.

---

### 3.2 Canonical URLs

**What's missing:** No `<link rel="canonical">` tags. Minor risk now, but worth adding before content syndication or cross-posting begins.

**Effort:** Small — one line in `BaseLayout.astro` using `Astro.url`.

---

### 3.3 RSS Feed

**What's missing:** No RSS/Atom feed. Useful for readers who use feed readers and signals to aggregators that this is an active publication. Astro has a first-party `@astrojs/rss` package for this.

**Effort:** Small — one new page (`/rss.xml.ts`) using the existing content collection.

---

## Tier 4 — Features (Planned)

These are more involved features noted as future plans. Each will need its own PRD when the time comes.

### 4.1 YouTube Integration on Music Posts

**Context:** Currently the YouTube player is embedded directly in the markdown body of each music post as a raw iframe. This works but is fragile — no consistent sizing, no responsive wrapper, no error handling if the video is unavailable.

**Direction:** A dedicated `YouTubeEmbed.astro` component that takes a video ID, renders a responsive iframe with proper aspect ratio, and can be used either via an MDX component or as a standalone element on the listen page.

---

### 4.2 General Contact Form (Blog Visitors)

**Context:** A contact mechanism already exists for Selah access requests (see 1.5), but there is no general contact path for blog visitors — people who want to respond to a post, ask a question, or reach Troy about VOR independent of Selah.

**Direction:** A simple contact form on the About page or a dedicated `/contact` route. Since the site is static (Cloudflare Pages), form submission needs a backend. Two viable options: (1) Cloudflare Workers + Resend/Postmark for email forwarding, natural given the existing Cloudflare deployment; (2) POST to the same local FastAPI service pattern used by Selah, with a Telegram notification. Option 2 is lower cost to build given the existing pattern.

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
