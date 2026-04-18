# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Voice of Repentance (VOR) — a personal ministry blog for Troy Sybert. Built with Astro and Tailwind CSS, deployed to Cloudflare Pages at `www.voiceofrepentance.com`. Two content tracks: a main blog and a "My Story" autobiographical section. Music posts are blog posts tagged `music` and are surfaced separately throughout the site.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

No tests are configured. No linting scripts are wired up.

## Architecture

### Astro Static Site

- **Framework**: Astro 5 with static output (`output: 'static'` in `astro.config.mjs`)
- **Styling**: Tailwind CSS v3 with `@tailwindcss/typography` for Markdown prose
- **Integrations**: `@astrojs/tailwind`, `@astrojs/sitemap` (generates `sitemap-index.xml` at build time)
- **Config**: `astro.config.mjs` (Astro), `tailwind.config.mjs` (design tokens, colors, fonts)

### Content Collections

Defined in `src/content.config.ts`:

- **`blog`** (`src/content/blog/*.md`): title, date, description, subtitle?, tags, coverImage?, draft
- **`story`** (`src/content/story/*.md`): title, date, description, chapter (number), coverImage?, draft

Posts tagged `music` are systematically excluded from blog listings and shown only on `/music` and the homepage music carousel. This filtering is done at the collection query level in each page — there is no separate collection for music.

### Design System

- **Colors**: Custom `vor-` palette in Tailwind config — cream, warm, sand, gold, charcoal, muted
- **Fonts**: DM Sans (`font-heading`), Source Serif 4 (`font-body`), loaded from Google Fonts
- **Aesthetic**: White/cream backgrounds, gold accents, generous whitespace

### Key Components & Layouts

**`src/layouts/BaseLayout.astro`** — HTML shell. Accepts `title`, `description`, `ogImage`, `ogType` props. Renders full Open Graph/Twitter card meta, canonical URL, and article meta tags via a `head` slot. Footer includes Facebook and YouTube social links.

**`src/layouts/PostLayout.astro`** — Blog post layout. Beyond the header/content, it renders three post-bottom sections in order:
1. **Related posts** (`relatedPosts` prop) — "You might also like" grid of up to 3 PostCards matched by tag overlap
2. **Prev/Next navigation** (`prevPost`/`nextPost` props) — date-ordered links to adjacent posts

**`src/components/PostCard.astro`** — Card component. Props: `title`, `date`, `description`, `slug`, `tags?`, `coverImage?`, `isNew?`, `readingMinutes?`. Has a `data-tags` attribute used by client-side tag filtering JS.

**`src/components/Header.astro`** — Sticky nav with mobile hamburger menu.

### Pages & Routing

- `/` — Homepage: blog carousel, music carousel, browse-by-topic, story/about teasers
- `/blog` — Blog listing (excludes `music` tag), multi-select tag filter + Load More
- `/blog/[...slug]` — Individual post; computes `prevPost`, `nextPost`, `relatedPosts`, and `readingMinutes` at build time in `getStaticPaths`
- `/blog/tags/[tag]` — Posts filtered by tag (static generation)
- `/music` — Music listing (only `music`-tagged posts), tag filter + Load More
- `/listen/[slug]` — Dedicated listen pages for individual music releases; these import components directly (not generated from the content collection)
- `/story` — Chapter listing ordered by `chapter` number
- `/story/[slug]` — Individual story chapter
- `/about`, `/selah` — Static pages

### Utilities

**`src/utils/readingTime.ts`** — `readingTime(body: string): number`. Word count divided by 200 wpm, minimum 1. Called in `getStaticPaths` of `[...slug].astro` and in every page that renders PostCards, using `post.body` from the content collection entry.

### Tag Filtering Architecture

`/blog` and `/music` pages use client-side JS for interactive tag filtering. PostCard renders a `data-tags` attribute with a JSON array of lowercased tags. The page script reads these attributes to show/hide cards without a server round-trip. Tag filter state does not persist across navigation.

### Images

- Static images in `public/images/`, served at `/images/filename`
- Referenced in front matter via `coverImage: "/images/filename.png"`

### Deployment

Cloudflare Pages deploys automatically on push to `main`:
- **Build command**: `npm install && npm run build`
- **Output directory**: `dist`
- **Environment variable**: `NODE_VERSION=18`
- **Custom domain**: `www.voiceofrepentance.com`
- **Headers/redirects**: `public/_headers` (security headers, cache), `public/_redirects` (apex → www), `public/robots.txt`

## Roadmap & PRDs

Active work is tracked in `tasks/roadmap-site-improvements.md`. Individual PRDs live in `tasks/prd-*.md`. Check the roadmap before suggesting features — several are already planned or in progress.
