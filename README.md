# Voice of Repentance

A personal ministry blog built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/), deployed to [Cloudflare Pages](https://pages.cloudflare.com/).

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

## Project Structure

```
src/
├── components/              # Reusable UI pieces
│   ├── Header.astro            # Nav bar + mobile menu
│   ├── Footer.astro            # Copyright footer
│   ├── Hero.astro              # Homepage hero with wheat field background
│   ├── PostCard.astro          # Blog post card (used in grids)
│   └── SectionHeading.astro    # Section title with optional "View all" link
│
├── content/                 # Markdown content (this is where you write)
│   ├── blog/                   # Blog posts — one .md file per post
│   │   └── what-is-repentance.md
│   └── story/                  # My Story chapters — one .md file per chapter
│       └── chapter-1-beginnings.md (draft)
│
├── layouts/                 # Page wrappers
│   ├── BaseLayout.astro        # Base HTML shell (head, header, footer) — wraps every page
│   └── PostLayout.astro        # Blog post layout (title, date, tags, prose styling)
│
├── pages/                   # Routes — each file becomes a URL
│   ├── index.astro             # Homepage (/)
│   ├── about.astro             # About page (/about)
│   ├── blog/
│   │   ├── index.astro         # Blog listing (/blog)
│   │   ├── [...slug].astro     # Individual posts (/blog/what-is-repentance)
│   │   └── tags/
│   │       └── [tag].astro     # Tag filter pages (/blog/tags/repentance)
│   └── story/
│       ├── index.astro         # My Story listing (/story)
│       └── [...slug].astro     # Individual chapters (/story/chapter-1-beginnings)
│
├── styles/
│   └── global.css              # Tailwind directives + base styles
│
└── content.config.ts        # Defines the blog & story schemas (front matter fields)

public/
└── images/                  # Static images served as-is at /images/filename

astro.config.mjs             # Astro settings (site URL, integrations)
tailwind.config.mjs          # Colors, fonts, typography config
```

## Writing Content

### New Blog Post

Create a `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Title"
date: 2026-02-05
description: "Short summary of the post"
tags: ["tag1", "tag2"]
coverImage: "/images/optional-cover.jpg"
draft: false
---

Your content here...
```

### New My Story Chapter

Create a `.md` file in `src/content/story/`:

```markdown
---
title: "Chapter Title"
date: 2026-02-05
description: "Short summary of the chapter"
chapter: 2
coverImage: "/images/optional-cover.jpg"
draft: false
---

Your content here...
```

### Images

Place images in `public/images/`. They are served at `/images/filename.jpg` and can be referenced in Markdown or front matter (`coverImage`).
