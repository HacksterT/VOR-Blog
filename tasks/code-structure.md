# Hugo Code Structure Documentation

## Overview

This Hugo site uses the Gruvbox theme with minimal customizations to maintain theme compatibility and simplicity.

## Directory Structure

### layouts/

- `_default/baseof.html` - Main HTML layout template
  - Uses theme's sidebar partial (sidebar.html)
  - Includes head, header, main content, sidebar, and footer partials

### partials/

- `sidebar.html` - Theme's sidebar displaying Dr. Sybert's information from JSON resume

### assets/

- `css/`
  - `main.css` - Main stylesheet (compiled from theme + custom styles)
  - `non-critical/` - Additional stylesheets loaded asynchronously

### config/

- `config.toml` - Basic site configuration (title, menu, taxonomies)
- `hugo.toml` - Advanced Hugo configuration (modules, theme settings, search)

### data/

- `json_resume/en.json` - Dr. Sybert's resume data for theme sidebar

### content/

- `_index.md` - Homepage content
- `about/` - About page
- `posts/` - Blog posts

## Theme Integration

- Uses Gruvbox Hugo theme via Hugo Modules
- Sidebar powered by JSON Resume format
- Search functionality uses theme's built-in flexsearch
- Minimal custom code to maintain theme compatibility

## Build Process

- Hugo Extended builds the site
- Node.js processes CSS with PostCSS/Tailwind
- Search index generated automatically
- Deployed via GitHub Actions to Azure Static Web Apps

## Key Design Decisions

- Single-author blog optimized for Dr. Troy E. Sybert
- Reverted to theme's sidebar system for simplicity
- JSON resume format for author information
- Minimal custom styling to preserve theme aesthetics
