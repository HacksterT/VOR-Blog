# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Voice of Repentance (VOR) Blog — a Hugo static site for Dr. Troy Sybert's ministry. Uses the Gruvbox Hugo theme via Hugo Modules, styled with Tailwind CSS, deployed to Azure Static Web Apps.

## Commands

```bash
# Development server (includes drafts)
npm run dev          # or: hugo server -D

# Production build
npm run build        # or: hugo --minify

# Dev server without drafts
npm run start        # or: hugo server

# Create new blog post
hugo new content/posts/my-post-title.md

# Fetch/update Hugo module dependencies
hugo mod get

# Regenerate package.json from Hugo modules
hugo mod npm pack && npm install
```

There are no tests configured. Linting tools (eslint, stylelint, markdownlint-cli, prettier) are installed as devDependencies but have no npm scripts wired up.

## Architecture

### Hugo Module-Based Theme

The Gruvbox theme and JSON Resume module are pulled in via Go Modules (see `go.mod`), **not** git submodules. Theme configuration lives in `hugo.toml`. Do NOT override Gruvbox theme files unless explicitly approved — prefer using Hugo's template lookup order by placing overrides in `layouts/`.

`hugo.toml` is the primary config file. `config.toml` exists as a legacy/secondary config with menu definitions and taxonomy settings. Both are loaded by Hugo (hugo.toml takes precedence for overlapping keys).

### Module Mounts

`hugo.toml` maps node_modules into Hugo's asset pipeline:
- `prismjs` and `prism-themes` → `assets/` (syntax highlighting)
- `typeface-fira-code` and `typeface-roboto-slab` → `static/fonts`
- `@tabler/icons` → `assets/tabler-icons`
- `simple-icons` → `assets/simple-icons` (required by JSON Resume module)

### Content & Templates

- **Content**: `content/posts/*.md` for blog posts, `content/about/_index.md` for about page
- **Front matter**: title, date, draft, author, tags, description
- **Layouts**: `layouts/_default/baseof.html` is the base template; `layouts/partials/sidebar.html` renders author bio from JSON Resume data
- **Sidebar data**: `data/json_resume/en.json` contains Dr. Sybert's bio info displayed in the sidebar
- **Taxonomies**: categories, tags, series (defined in `config.toml`)

### CSS Pipeline

Tailwind CSS v3 → PostCSS (import, custom-media, nesting, autoprefixer) → Hugo pipes. Entry point is `assets/css/main.css`. Tailwind config scans `layouts/**/*.html`, `content/**/*.{html,md}`, and theme layouts.

### Deployment

GitHub Actions workflow (`.github/workflows/azure-static-web-apps-proud-dune-0f72d5f0f.yml`) triggers on push/PR to `main`:
1. Setup Hugo Extended + Node.js 18
2. `npm install` → `hugo --minify`
3. Upload `public/` directory to Azure Static Web Apps

### Search

Client-side FlexSearch. Hugo generates `search-index.json` at build time (configured via `[outputs]` and `[outputFormats]` in `hugo.toml`).

## Key Constraints

- Requires **Hugo Extended** (for Tailwind/PostCSS processing)
- Goldmark renders with `unsafe = true` to support Prism.js plugins
- The user is a junior developer — pause to explain when making multiple file changes
- Environment variables must be used for all sensitive configuration
- Python dependencies in `requirements.txt` are for planned future automation (no scripts exist yet)
