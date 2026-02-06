# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Voice of Repentance (VOR) — a personal ministry blog for Troy Sybert. Built with Astro and Tailwind CSS, deployed to Cloudflare Pages at `www.voiceofrepentance.com`. This is a personal (not professional) site with two content tracks: a main blog and a "My Story" autobiographical section.

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
- **Config**: `astro.config.mjs` (Astro), `tailwind.config.mjs` (design tokens, colors, fonts)

### Content Collections

Two collections defined in `src/content.config.ts`:

- **`blog`** (`src/content/blog/*.md`): title, date, description, tags, coverImage, draft
- **`story`** (`src/content/story/*.md`): title, date, description, chapter (number for ordering), coverImage, draft

To create a new blog post, add a `.md` file in `src/content/blog/` with the schema above.

### Design System

- **Colors**: Custom `vor-` palette in Tailwind config — cream, warm, sand, gold, charcoal, muted
- **Fonts**: DM Sans (headings via `font-heading`), Source Serif 4 (body via `font-body`), loaded from Google Fonts
- **Aesthetic**: Light/clean — white and cream backgrounds, gold accents, generous whitespace

### Key Components

- `src/layouts/BaseLayout.astro` — HTML shell wrapping all pages (head, header, footer)
- `src/layouts/PostLayout.astro` — Blog post page layout with title, date, tags, prose content
- `src/components/Hero.astro` — Homepage hero with wheat field background image and gradient overlay
- `src/components/PostCard.astro` — Card with cover image, title, date, description, tags (has `data-tags` attribute for client-side filtering)
- `src/components/Header.astro` — Sticky nav with mobile hamburger menu

### Pages & Routing

- `/` — Homepage (hero, recent posts, browse by topic, story teaser, about teaser)
- `/blog` — Blog listing with interactive multi-select tag filtering (client-side JS)
- `/blog/[slug]` — Individual blog post
- `/blog/tags/[tag]` — Posts filtered by tag (static pages, also used from homepage links)
- `/story` — My Story chapter listing (ordered by chapter number)
- `/story/[slug]` — Individual story chapter
- `/about` — About page

### Images

- Static images go in `public/images/`, served at `/images/filename`
- Referenced in front matter via `coverImage: "/images/filename.png"`
- Hero background: `public/images/wheat-field-main-hero.png`

### Deployment

Cloudflare Pages builds and deploys automatically on push to `main`:
- **Build command**: `npm install && npm run build`
- **Output directory**: `dist`
- **Environment variable**: `NODE_VERSION=18`
- **Custom domain**: `www.voiceofrepentance.com` (DNS on Cloudflare)
- **Headers/redirects**: `public/_headers` (security headers, cache), `public/_redirects` (apex → www)

## Key Constraints

- The user is a junior developer — pause to explain when making multiple file changes
- Do NOT over-engineer; keep solutions simple
- Environment variables for all sensitive configuration
- Future plans: YouTube integration, contact form, image carousels, Cloudflare R2 for image storage
