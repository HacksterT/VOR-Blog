# PRD: Voice of Repentance — Full Site Rebuild

## 1. Overview

**Feature Name:** VOR Blog Site Rebuild (Astro + Tailwind CSS)

Rebuild the Voice of Repentance blog from scratch using Astro and Tailwind CSS, replacing the current Hugo/Gruvbox stack. The new site will have a modern, light, clean aesthetic inspired by Squarespace blog templates. It will be deployed to Cloudflare Pages with the custom domain `www.voiceofrepentance.com`.

**Problem:** The current Hugo + Gruvbox theme stack is over-engineered for a personal blog — 30+ npm packages, dual config files, broken features (search, navigation), and a dark retro aesthetic that doesn't match the desired direction. Debugging theme internals is unproductive. A ground-up rebuild with a simpler stack will be faster to build, easier to maintain, and produce a better result.

**Context:** The site is a personal ministry blog for Troy Sybert. It has two content tracks: a main blog (spiritual/ministry posts) and a separate "My Story" section for autobiographical entries. It is not a professional/medical site. Future plans include YouTube integration, contact forms, image galleries, and carousels. The existing "What is Repentance?" post will be migrated as initial content.

**Design Direction:** Light and clean — white/cream backgrounds, generous whitespace, modern sans-serif typography, subtle warm accents, card-based layouts, image-forward. Think Squarespace, not Gruvbox.

---

## 2. Working Backlog

### Feature: Site Foundation & Design System

#### Phase 1: Project Setup & Core Layout

- [ ] **STORY-01**: As a site owner, I want a new Astro project with Tailwind CSS scaffolded and configured so that development can begin on a clean foundation
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] A new Astro project exists at the repo root (old Hugo files removed)
    - [ ] Tailwind CSS is installed and configured with the VOR color palette
    - [ ] The dev server starts without errors (`npm run dev`)
    - [ ] The production build completes without errors (`npm run build`)
    - [ ] Folder structure follows Astro conventions (`src/pages/`, `src/layouts/`, `src/components/`, `src/content/`, `src/styles/`)
    - [ ] A Cloudflare Pages adapter is configured for deployment
  - **Tasks**:
    - [ ] Delete all Hugo-specific files and directories: `hugo.toml`, `config.toml`, `archetypes/`, `layouts/`, `data/`, `static/`, `assets/`, `themes/`, `go.mod`, `go.sum`, `package.hugo.json`, `staticwebapp.config.json`, `tailwind.config.js`, `postcss.config.js`, `requirements.txt`, existing `package.json`, `node_modules/`
    - [ ] Keep: `.git/`, `.github/`, `content/posts/what-is-repentance.md` (set aside for later migration), `tasks/`, `CLAUDE.md`, `README.md`, `.windsurf/`
    - [ ] Scaffold new Astro project: `npm create astro@latest` with empty template
    - [ ] Install and configure Tailwind CSS integration: `npx astro add tailwind`
    - [ ] Install Cloudflare Pages adapter: `npx astro add cloudflare`
    - [ ] Create the VOR design tokens in `tailwind.config.mjs` — color palette (warm neutrals, cream/white backgrounds, gold/amber accent, dark charcoal text), font families (clean sans-serif for headings, readable serif or sans for body), spacing scale
    - [ ] Create `src/styles/global.css` with Tailwind directives and base typography styles
    - [ ] Create folder structure: `src/content/blog/`, `src/content/story/`, `src/components/`, `src/layouts/`, `src/pages/`
    - [ ] Local Testing: Run `npm run dev` and `npm run build` — both must complete with zero errors
    - [ ] Manual Testing: CHECKPOINT — Notify user to review project structure, color palette, and typography choices before proceeding
    - [ ] Git: Commit with message describing project scaffolding and Hugo removal
  - **Technical Notes**: Astro's Cloudflare adapter enables deployment to Cloudflare Pages with SSR capability if needed later (contact forms, etc.). For now the site will be fully static (`output: 'static'` in `astro.config.mjs`). The old Hugo `content/posts/what-is-repentance.md` should be copied to a temp location before deletion, then migrated into the Astro content collection format in a later story.
  - **Blockers**: None

- [ ] **STORY-02**: As a site visitor, I want a clean site layout with header navigation and footer so that I can navigate the site on any device
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] A base layout component wraps all pages with consistent header, main content area, and footer
    - [ ] Header includes: site name/logo ("Voice of Repentance"), navigation links (Home, Blog, My Story, About), and mobile hamburger menu
    - [ ] Navigation highlights the active page/section
    - [ ] Mobile menu opens/closes smoothly (CSS transition or minimal JS)
    - [ ] Footer includes: copyright line, minimal branding
    - [ ] Layout is fully responsive (mobile, tablet, desktop breakpoints)
    - [ ] Typography renders with the chosen font stack
  - **Tasks**:
    - [ ] Create `src/layouts/BaseLayout.astro` — HTML shell with `<head>` (meta, fonts, global CSS) and `<body>` (header, `<slot/>`, footer)
    - [ ] Create `src/components/Header.astro` — site name/logo on left, nav links on right, sticky or fixed top positioning, clean white/cream background with subtle bottom border
    - [ ] Create `src/components/MobileMenu.astro` — hamburger icon, slide-out or dropdown menu for mobile breakpoints, close on link click or outside tap
    - [ ] Create `src/components/Footer.astro` — copyright, site name, optional social link placeholder
    - [ ] Add Google Fonts or Fontsource for the chosen font families (loaded via `<link>` or `@fontsource` packages)
    - [ ] Style all components with Tailwind utility classes matching the light/clean aesthetic
    - [ ] Create a placeholder `src/pages/index.astro` that uses `BaseLayout` and displays "Voice of Repentance" as a heading
    - [ ] Local Testing: Run `npm run dev`, test at mobile (375px), tablet (768px), and desktop (1280px) widths — verify navigation, menu toggle, typography, and footer
    - [ ] Manual Testing: CHECKPOINT — Notify user to review the layout, navigation, and overall look and feel
    - [ ] Git: Commit with message describing site layout and navigation components
  - **Technical Notes**: Keep JavaScript minimal — mobile menu toggle can be done with a small inline `<script>` in the Astro component (no framework needed). Active nav link can use `Astro.url.pathname`. Font loading should use `font-display: swap` for performance.
  - **Blockers**: STORY-01 (project must be scaffolded)

- [ ] **STORY-03**: As a site visitor, I want a homepage that introduces the Voice of Repentance and showcases recent posts so that I know what the site is about and can discover content
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] Homepage has a hero section with a welcoming headline, short tagline/description, and an optional background image or subtle visual accent
    - [ ] A "Recent Posts" section displays the 3–6 most recent blog posts as cards with: title, date, excerpt/description, cover image (or placeholder), and a "Read more" link
    - [ ] An "About" teaser section with a brief intro about Troy and a "Read more" link to the About page
    - [ ] A "My Story" teaser section with a brief intro and link to the My Story section
    - [ ] Sections flow naturally with clear visual hierarchy and spacing
    - [ ] Page is fully responsive
  - **Tasks**:
    - [ ] Create `src/components/Hero.astro` — large headline ("Voice of Repentance"), tagline text, clean background (cream/white with optional subtle texture or gradient), generous vertical padding
    - [ ] Create `src/components/PostCard.astro` — card component with cover image (or placeholder), title, date, excerpt, "Read more" link. Rounded corners, subtle shadow or border, hover effect
    - [ ] Create `src/components/SectionHeading.astro` — reusable section title with optional subtitle and "View all" link
    - [ ] Build `src/pages/index.astro` — assemble hero, recent posts grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop), about teaser, my story teaser
    - [ ] Add temporary placeholder content for all sections (will be replaced with real content in later stories)
    - [ ] Style with generous whitespace, consistent spacing scale, warm accent color for links and CTAs
    - [ ] Local Testing: Run `npm run dev`, verify layout across breakpoints, check that cards render correctly with placeholder data
    - [ ] Manual Testing: CHECKPOINT — Notify user to review homepage design, card layout, hero section, and overall visual feel
    - [ ] Git: Commit with message describing homepage implementation
  - **Technical Notes**: Post cards will initially use hardcoded placeholder data. Once content collections are set up (STORY-04), the homepage will query the blog collection for recent posts via `getCollection('blog')`. The card component should be designed to accept props so it can be reused on listing pages.
  - **Blockers**: STORY-02 (layout must exist)

- [ ] **STORY-04**: As a site owner, I want Astro content collections configured for blog posts and my story entries so that I can write content in Markdown and have it rendered automatically
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] A `blog` content collection is defined with schema: title, date, description, tags (string array), coverImage (optional), draft (boolean, default false)
    - [ ] A `story` content collection is defined with schema: title, date, description, chapter (number for ordering), coverImage (optional), draft (boolean)
    - [ ] The "What is Repentance?" post is migrated into `src/content/blog/` and renders correctly
    - [ ] A sample "My Story" entry exists in `src/content/story/` as placeholder content
    - [ ] Blog listing page (`/blog`) displays all published posts as cards sorted by date (newest first)
    - [ ] Individual blog post page (`/blog/[slug]`) renders full Markdown content with clean typography
    - [ ] Blog posts display: title, date, author ("Troy Sybert"), tags, cover image, full content
    - [ ] Tags link to a tag listing page (`/blog/tags/[tag]`)
  - **Tasks**:
    - [ ] Create `src/content/config.ts` — define `blog` and `story` collection schemas using Zod
    - [ ] Migrate `what-is-repentance.md` into `src/content/blog/` — update front matter to match the new schema (add description, tags, remove any Hugo-specific fields)
    - [ ] Create 1–2 placeholder posts in `src/content/blog/` for layout testing
    - [ ] Create 1 placeholder entry in `src/content/story/` for layout testing
    - [ ] Create `src/pages/blog/index.astro` — query blog collection, sort by date, render as PostCard grid with pagination-ready structure
    - [ ] Create `src/pages/blog/[...slug].astro` — dynamic route for individual posts, render Markdown with Tailwind Typography plugin (`@tailwindcss/typography` prose classes)
    - [ ] Create `src/pages/blog/tags/[tag].astro` — list posts filtered by tag
    - [ ] Create `src/layouts/PostLayout.astro` — post page layout with title, date, author, tags, cover image, content area, back-to-blog link
    - [ ] Update homepage `index.astro` to query real blog collection for recent posts instead of placeholder data
    - [ ] Install and configure `@tailwindcss/typography` for prose styling of Markdown content
    - [ ] Local Testing: Run `npm run dev`, verify blog listing, individual post rendering, tag filtering, and homepage recent posts
    - [ ] Manual Testing: CHECKPOINT — Notify user to review blog functionality, post rendering, and tag system
    - [ ] Git: Commit with message describing content collections and blog implementation
  - **Technical Notes**: Astro content collections use file-based routing with `getCollection()` and `getEntry()` APIs. The `[...slug].astro` pattern generates static pages for each post at build time. Tailwind Typography plugin provides the `prose` class for styling rendered Markdown — configure it to match the VOR design (font sizes, link colors, heading styles). Tags should be normalized to lowercase for consistent URLs.
  - **Blockers**: STORY-03 (homepage and card components must exist)

### Unresolved Blockers

None — all information needed for Part 1 has been provided.

---

## 3. Non-Goals (This PRD)

- My Story section pages (Part 2)
- About page (Part 2)
- Contact form (future PRD)
- YouTube integration (future PRD)
- Image carousels or galleries (future PRD)
- Image upload/storage strategy with Cloudflare R2 (Part 2 or 3)
- Cloudflare Pages deployment and custom domain setup (Part 2)
- Search functionality (future PRD)
- RSS feed (Part 2)

## 4. Dependencies

- **Node.js 18+** installed locally
- **npm** for package management
- **Astro 5.x** (latest stable)
- **Tailwind CSS 4.x** via `@astrojs/tailwind` integration
- **Cloudflare account** (needed for Part 2 deployment, not for Part 1 development)

## 5. Success Metrics

- Dev server starts in under 2 seconds
- Production build completes in under 10 seconds
- Homepage Lighthouse score: 90+ on Performance, Accessibility, Best Practices, SEO
- All pages render correctly at mobile (375px), tablet (768px), desktop (1280px)
- Blog post Markdown renders with clean, readable typography

## 6. Open Questions

- Should the existing Hugo project files be archived in a branch before deletion, or is the git history sufficient?
- Does the user want a specific Google Font or should we select one that fits the light/clean aesthetic?
- Image storage: for Part 1, images will live in `src/assets/` or `public/images/`. Cloudflare R2 integration for scalable image storage will be addressed in a future PRD when image volume grows.

## 7. Future PRDs

- **prd-vor-site-rebuild-part2.md**: My Story section, About page, Cloudflare Pages deployment, custom domain setup, RSS feed
- **prd-vor-site-rebuild-part3.md**: Contact form, YouTube embed support, image carousel component, Cloudflare R2 image storage
- **prd-vor-site-rebuild-part4.md**: Search, archive page, social sharing, analytics
