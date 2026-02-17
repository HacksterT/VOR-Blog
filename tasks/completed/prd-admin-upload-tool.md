# PRD: VOR Admin Upload Tool

## 1. Overview

**Feature Name:** VOR Admin Upload Tool (Streamlit)

**Description:** A local-only Streamlit admin app that allows Troy to create new music posts and blog posts for the VOR-Blog site without touching code or the command line. The tool provides two forms — one for music uploads (which creates both a blog post and a music.json entry) and one for standard blog posts. Each form captures the YAML front matter fields (title, date, description, tags) plus the post body content. The `coverImage` path is auto-generated from the title and uploaded image — no manual entry needed. After creating content, a "Review & Push" panel shows staged changes and lets Troy commit and push to GitHub with one click, triggering automatic Cloudflare Pages deployment.

**Problem it solves:** Currently, adding content requires manually creating `.md` files, editing `music.json`, placing images in `public/images/`, and running git commands. This tool reduces that to filling out a form and clicking a button.

**Context:** This is a single-user, local-only admin tool. It runs on Troy's machine via `streamlit run admin.py` and writes directly into the VOR-Blog repository. It is NOT deployed or exposed to the internet.

---

## 2. Working Backlog

### Feature: VOR Admin Upload Tool

#### Phase 1: Core Upload Forms

- [ ] **STORY-01**: As the site owner, I want to upload a new music post so that a blog post `.md` file, a `music.json` entry, and the cover image are all created from a single form
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] Form accepts: title, date (defaults to today, editable), description, tags (comma-separated, defaults to "music, worship"), YouTube URL, and album cover image (file upload)
    - [ ] The `coverImage` front matter field is auto-generated from the title slug and uploaded file extension (e.g., title "My New Song" + uploaded `.png` → `coverImage: "/images/my_new_song.png"`). It is NOT a manual input field.
    - [ ] Submitting the form creates a new `.md` file in `src/content/blog/` with complete YAML front matter (title, date, description, tags array, auto-generated coverImage path) and body content matching the pattern in `outstretched-hands.md` (description paragraphs + embedded YouTube iframe). No `draft` field is written.
    - [ ] Submitting the form saves the uploaded image to `public/images/` with a slugified filename (e.g., `my_song_title.png`)
    - [ ] Submitting the form appends a new entry to `src/data/music.json` with fields: `id` (extracted from YouTube URL), `title`, `type: "song"`, `featured: false`, `description`, and `blogPost` (link to the new blog post slug)
    - [ ] The YouTube video ID is correctly extracted from standard YouTube URL formats (`youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`)
    - [ ] The slug is auto-generated from the title (lowercased, spaces to hyphens, special characters stripped)
    - [ ] Success message is displayed after creation with the file paths that were written
    - [ ] If a blog post with the same slug already exists, display an error instead of overwriting
  - **Tasks**:
    - [ ] Create `admin.py` at the repo root with Streamlit app skeleton and page config
    - [ ] Create `requirements-admin.txt` with `streamlit` dependency
    - [ ] Build the "New Music Post" form with fields: title (text input), date (date picker, defaults to today), description (text area), tags (text input, comma-separated, defaults to "music, worship"), YouTube URL (text input), album cover image (file uploader)
    - [ ] Implement slug generation utility (title → slug)
    - [ ] Implement YouTube video ID extraction from URL
    - [ ] Implement file writing: generate blog post `.md` using the outstretched-hands pattern as template (front matter + description + YouTube iframe embed + companion link placeholder)
    - [ ] Implement image saving: write uploaded image to `public/images/{slug_with_underscores}.{ext}`
    - [ ] Implement `music.json` update: read existing JSON, append new entry, write back with consistent formatting
    - [ ] Add duplicate slug detection (check if `.md` file already exists)
    - [ ] Local Testing: Run `streamlit run admin.py`, create a test music post, verify all output files are correct
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify: form works, files are created correctly, site builds with `npm run build`
    - [ ] Git: Commit with message describing the new admin tool
  - **Technical Notes**:
    - Blog post `.md` template should match the existing pattern from `outstretched-hands.md`: front matter block, then description text, then `<div>` with responsive YouTube iframe embed, then a closing line
    - The `music.json` entry `id` field is just the YouTube video ID (e.g., `X7Ls7NPeQXs`), not the full URL
    - Image filename should use underscores (matching existing convention: `fighting_shadows_thumbnail.png`, `outstretched_hands.png`)
    - Date defaults to today's date in `YYYY-MM-DD` format but is editable via a date picker
    - Tags are user-entered (comma-separated), defaulting to `"music, worship"` for convenience — parsed into a YAML array in front matter
    - No `draft` field is written to front matter — all posts publish immediately
  - **Blockers**: None

- [ ] **STORY-02**: As the site owner, I want to upload a new blog post so that a blog `.md` file and cover image are created from a single form
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] Form accepts: title, date (defaults to today, editable), description (short summary for cards), tags (comma-separated text input), content (full markdown body), and cover image (file upload, optional)
    - [ ] If a cover image is uploaded, the `coverImage` front matter field is auto-generated from the title slug and uploaded file extension (same logic as music form). It is NOT a manual input field.
    - [ ] Submitting the form creates a new `.md` file in `src/content/blog/` with complete YAML front matter (title, date, description, tags array, auto-generated coverImage path if image provided) and the pasted markdown as the body. No `draft` field is written.
    - [ ] If a cover image is provided, it is saved to `public/images/` with a slugified filename
    - [ ] Tags input is parsed from comma-separated string into a proper YAML array in front matter
    - [ ] The slug is auto-generated from the title (same logic as STORY-01)
    - [ ] Success message is displayed after creation with the file paths that were written
    - [ ] If a blog post with the same slug already exists, display an error instead of overwriting
  - **Tasks**:
    - [ ] Build the "New Blog Post" form with fields: title (text input), date (date picker, defaults to today), description (text input), tags (text input, comma-separated), content (large text area), cover image (file uploader, optional)
    - [ ] Implement file writing: generate blog post `.md` with front matter + raw markdown content body
    - [ ] Implement optional image saving (reuse logic from STORY-01)
    - [ ] Add duplicate slug detection (reuse logic from STORY-01)
    - [ ] Local Testing: Run Streamlit app, create a test blog post with and without an image, verify output files
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify: form works, files are created correctly, site builds with `npm run build`
    - [ ] Git: Commit with message describing blog upload form
  - **Technical Notes**:
    - Content field should be a large text area — user will paste full markdown
    - Description is a separate short field used in front matter (shown on cards), NOT extracted from the content
    - If no image is uploaded, omit `coverImage` from front matter entirely (the PostCard component shows a gradient placeholder)
  - **Blockers**: None

#### Phase 2: Review & Push

- [ ] **STORY-03**: As the site owner, I want to review pending changes and push to GitHub from the admin tool so that I don't need to use the command line
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] A "Review & Push" section in the sidebar (or separate tab) shows the current `git status` output — modified files, new files, etc.
    - [ ] A "Refresh Status" button re-runs `git status` to show the latest state
    - [ ] A "Commit & Push" button commits all staged/untracked new content files and pushes to `origin/main`
    - [ ] The commit message is auto-generated (e.g., "content: add new post — {title}") but editable before pushing
    - [ ] Success/failure feedback is displayed after the push attempt
    - [ ] If there are no changes to commit, the push button is disabled with a message "Nothing to push"
    - [ ] Only files in `src/content/`, `src/data/`, and `public/images/` are staged — no other repo files are accidentally committed
  - **Tasks**:
    - [ ] Add a sidebar section or Streamlit tab for "Review & Push"
    - [ ] Implement `git status` display using `subprocess.run` (scoped to the repo directory)
    - [ ] Implement "Refresh Status" button
    - [ ] Implement commit logic: `git add` only content-related paths (`src/content/`, `src/data/music.json`, `public/images/`), then `git commit` with the editable message
    - [ ] Implement `git push origin main` with output capture
    - [ ] Display success/failure feedback (stdout/stderr from git commands)
    - [ ] Disable push button when `git status` shows no changes
    - [ ] Local Testing: Create a test post, verify status shows it, commit and push, verify status clears
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify: full workflow from upload → review → push → site deploys on Cloudflare
    - [ ] Git: Commit with message describing Review & Push feature
  - **Technical Notes**:
    - Use `subprocess.run` with `cwd` set to the VOR-Blog repo root
    - The repo path can be determined automatically since `admin.py` lives at the repo root (`Path(__file__).parent`)
    - Only stage specific paths to avoid accidentally committing unrelated files (like `.claude/` or temp files)
    - Capture both stdout and stderr from git commands for user feedback
  - **Blockers**: None

#### Phase 3: My Story

- [ ] **STORY-04**: As the site owner, I want to upload new story chapters from the admin tool so that I can publish my autobiography chapter by chapter without editing code
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] Form accepts: chapter number, title (the chapter's theme/name), description (short summary), and content (full markdown body)
    - [ ] Date defaults to today and is auto-set (not a manual field — story chapters are ordered by chapter number, not date)
    - [ ] Submitting the form creates a new `.md` file in `src/content/story/` with YAML front matter (title, date, description, chapter number) and the pasted markdown as the body. No `draft` field is written.
    - [ ] The filename is auto-generated as `chapter-{number}-{slug}.md` (e.g., `chapter-2-the-turning-point.md`)
    - [ ] If a story file with the same chapter number already exists, display an error instead of overwriting
    - [ ] Success message is displayed after creation
  - **Tasks**:
    - [ ] Build the "New Story Chapter" form with fields: chapter number (number input), title (text input), description (text input), content (large text area)
    - [ ] Implement file writing: generate story `.md` with front matter (title, date, description, chapter) + markdown body
    - [ ] Add duplicate chapter number detection (scan existing story files)
    - [ ] Local Testing: Run Streamlit app, create a test chapter, verify output file is correct
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify: form works, file is created correctly, site builds with `npm run build`
    - [ ] Git: Commit with message describing story chapter upload form
  - **Technical Notes**:
    - Story schema (from `content.config.ts`): title (string), date (date), description (string), chapter (number), coverImage (string, optional). No coverImage for now — omit from front matter.
    - No `draft` field — chapters publish immediately on push
    - Chapter number drives ordering on the My Story page, not the date
  - **Blockers**: None

- [ ] **STORY-05**: Redesign the My Story page to display all chapters on a single scrollable page with a hero image and accordion sections
  - **Priority**: Should-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] Page redesign is complete and visually consistent with the site's existing design system
  - **Tasks**:
    - [ ] Redesign `src/pages/story/index.astro`
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify the new page design
    - [ ] Git: Commit with message describing My Story page redesign
  - **Technical Notes**:
    The current My Story page (`src/pages/story/index.astro`) lists chapters as individual linked cards, each routing to a separate page (`src/pages/story/[...slug].astro`). The vision is to replace this with a single, long-scrollable page: a hero image at the top (similar to the homepage hero), followed by all published chapters rendered inline, ordered by chapter number. Each chapter would be in an accordion/collapsible section showing the chapter number, title, and theme — clicking expands to reveal the full chapter text. This keeps the reading experience on one page like a book, rather than navigating between separate pages. The individual chapter pages (`[...slug].astro`) can be kept for direct linking or removed — TBD. No images within chapters for now; the hero image is the only visual element.
  - **Blockers**: STORY-04 (need at least one real chapter to test the redesign against)

---

## 3. Non-Goals

- This tool is NOT deployed to the internet — local-only
- No user authentication or multi-user support
- No editing or deleting existing posts (manage those directly in the repo for now)
- No image cropping, resizing, or optimization
- No draft workflow — all posts publish immediately on push (no `draft` field in front matter)
- No image support for story chapters (text-only for now; images may be added later)

## 4. Dependencies

- **Python 3.9+** installed on Troy's machine
- **Streamlit** (`pip install streamlit`)
- **Git** configured with push access to the VOR-Blog GitHub repo (already set up)
- The VOR-Blog repo checked out locally at a known path

## 5. Success Metrics

- Troy can create and publish a new music post (blog + music page entry + image) in under 2 minutes without touching code
- Troy can create and publish a new blog post in under 2 minutes without touching code
- Troy can create and publish a new story chapter in under 2 minutes without touching code
- Zero manual git commands needed — the full workflow happens in the Streamlit UI

## 6. Open Questions

- None — all clarifications resolved during Phase 1

## 7. Appendix

### Existing File Patterns

**Music blog post template** (from `outstretched-hands.md`):
```markdown
---
title: "Song Title | Subtitle"
date: 2025-05-15
description: "Short description for cards."
tags: ["music", "worship", "redemption", "recovery", "mercy"]
coverImage: "/images/song_slug.png"
---

[Description paragraphs here]

<div style="max-width: 720px; margin: 2rem auto;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID"
      title="Song Title"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</div>

[Optional closing line]
```

**music.json entry**:
```json
{
  "id": "VIDEO_ID",
  "title": "Full Song Title",
  "type": "song",
  "featured": false,
  "description": "Short description.",
  "blogPost": "/blog/song-slug"
}
```
