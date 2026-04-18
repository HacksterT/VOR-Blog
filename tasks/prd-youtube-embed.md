# PRD: YouTubeEmbed Component

## User Story

As Troy publishing music posts on voiceofrepentance.com, I want a dedicated `YouTubeEmbed` Astro component so that YouTube videos render consistently and responsively across all music posts — without me having to hand-code iframe HTML in every markdown file.

---

## Problem

Music posts currently embed YouTube videos as raw inline HTML inside markdown:

```html
<div style="max-width: 720px; margin: 2rem auto;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID"
      ...
    ></iframe>
  </div>
</div>
```

This works today but has three problems:

1. **Fragile authoring.** Copy-pasting raw iframe HTML into markdown is error-prone. One wrong attribute and the embed breaks silently.
2. **No consistency guarantee.** Sizing, border radius, and allow attributes depend on whoever wrote that particular post's HTML — there is no single source of truth.
3. **No graceful degradation.** If a video is removed from YouTube, the embed shows a generic YouTube error with no fallback message.

---

## Scope

Phase 1 only. No MDX migration, no lazy loading, no playlist support.

---

## Component: `YouTubeEmbed.astro`

**Location:** `src/components/YouTubeEmbed.astro`

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `videoId` | string | yes | YouTube video ID (the part after `?v=` or in `/embed/`) |
| `title` | string | yes | iframe title for accessibility |

**Behavior:**
- Renders a 16:9 responsive iframe wrapper using the same inline style pattern already in use (relative positioning + padding-bottom: 56.25%)
- Applies consistent border-radius (`rounded-xl`, matching cover images)
- Sets standard `allow` and `allowfullscreen` attributes
- Caps width at 720px, centered

**Does not:**
- Lazy load (not needed at current post volume)
- Handle playlist IDs
- Accept custom aspect ratios

---

## Usage

Because the content collection uses `.md` (not `.mdx`), the component cannot be imported directly inside post files. Two options:

**Option A — Dedicated listen page (already the pattern for Town Called Nowhere).**
Each music release gets its own page at `/listen/[slug].astro` that imports `YouTubeEmbed` directly. The music post itself links to that page rather than embedding inline.

**Option B — Convert music posts to MDX.**
Rename `src/content/blog/*.md` music posts to `.mdx`, update `content.config.ts` to accept `.mdx`, and import `YouTubeEmbed` at the top of each file.

**Recommendation: Option A for now.** The listen page pattern already exists (`town-called-nowhere.astro`) and keeps markdown simple. Option B is the right long-term answer if post volume grows or other components are needed inline, but it requires migrating the content schema and all existing `.md` files — overhead not justified today.

---

## Migration

The existing `town-called-nowhere.astro` listen page already uses a manually-coded responsive iframe. Once `YouTubeEmbed.astro` is built, replace the inline iframe in that file with the component. The markdown post body for "Town Called Nowhere" (`town-called-nowhere-gritty-acoustic-alt-country-song-about-redemption.md`) also contains inline iframe HTML — remove it and update the post to link to the listen page instead.

---

## Acceptance Criteria

- `YouTubeEmbed.astro` exists and renders a 16:9 responsive iframe
- `town-called-nowhere.astro` uses the component instead of raw iframe HTML
- The markdown post body no longer contains inline iframe HTML
- No visual regression on the listen page at mobile and desktop widths
