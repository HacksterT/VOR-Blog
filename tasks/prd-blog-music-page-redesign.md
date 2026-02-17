# PRD: Blog & Music Page Redesign — Content Separation and Consistent Layout

## 1. Overview

**Feature Name:** Blog & Music Page Redesign

**Description:** Redesign the `/blog` and `/music` pages so that blog content and music content are cleanly separated and both pages share a consistent layout pattern: a featured row of 3 static PostCards, followed by an infinity-scroll carousel row showing remaining entries in a 3-column grid. The music page will switch from its current single-player YouTube carousel (driven by `music.json`) to the same PostCard-based layout used on the blog page, pulling from the blog content collection filtered by the "music" tag. Tag filtering will be added to the music page.

**Problem:** Currently, the blog page shows all posts — blog AND music — mixed together, which is confusing. The music page uses a completely different layout (single YouTube player carousel driven by `music.json`) that is inconsistent with the rest of the site. Visitors cannot easily distinguish between blog content and music content, and the two pages feel like different sites.

**Context:** Music posts are already stored in the blog content collection (`src/content/blog/*.md`) with a "music" tag. Each music post already has a YouTube iframe embedded in its markdown body, so the player appears on the individual post page. The `music.json` file will no longer be needed for the music page after this redesign (though the admin upload tool still writes to it). The homepage carousels remain unchanged.

---

## 2. Working Backlog

### Feature: Blog & Music Page Redesign

#### Phase 1: Blog Page — Filter Out Music & Add Featured Row + Carousel

- [ ] **STORY-01**: As a site visitor, I want the blog page to show only non-music posts in a featured row and infinity carousel so that blog content is distinct from music content
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] The blog page (`/blog`) does NOT display any posts tagged "music"
    - [ ] The first row shows up to 3 most recent non-music posts as static PostCards in a 3-column grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
    - [ ] The second row is an infinity-scroll carousel displaying the remaining non-music posts in a 3-column grid, with prev/next navigation arrows and a page counter (e.g., "1 of 3")
    - [ ] The carousel wraps around (last page → next goes to first, first page → prev goes to last)
    - [ ] The carousel is responsive: 3 cards per page on desktop, 2 on tablet, 1 on mobile
    - [ ] If there are 3 or fewer total posts, only the featured row displays (no carousel row)
    - [ ] The tag filter system continues to work, filtering across both the featured row and the carousel
    - [ ] Tag counts in the filter buttons reflect only non-music posts
    - [ ] The "music" tag does not appear in the tag filter buttons
    - [ ] Page is fully responsive at mobile (375px), tablet (768px), and desktop (1280px)
  - **Tasks**:
    - [ ] Update `src/pages/blog/index.astro` — filter out posts where tags include "music" (case-insensitive) from the main query
    - [ ] Split the filtered posts into two groups: `featuredPosts` (first 3) and `carouselPosts` (the rest)
    - [ ] Render `featuredPosts` as a static 3-column PostCard grid (reuse existing grid markup)
    - [ ] Render `carouselPosts` in a carousel container with prev/next buttons and page counter, using the same carousel pattern from the homepage (`initCarousel` approach with `data-index` and show/hide logic)
    - [ ] Exclude the "music" tag from the `tagCounts` map so it doesn't appear in the filter buttons
    - [ ] Update the tag filter JavaScript to work across both the featured row and carousel cards (filter by `data-tags` attribute on all visible cards)
    - [ ] Local Testing: Run `npm run dev`, verify blog page shows only non-music posts, featured row displays correctly, carousel navigates, tag filtering works, responsive at all breakpoints
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify blog page layout, carousel behavior, tag filtering, and responsive design
    - [ ] Git: Commit with message describing blog page redesign
  - **Technical Notes**: The existing `initCarousel` function on the homepage handles responsive page sizes and wrap-around — adapt this pattern. The tag filter JS must account for cards in both the static featured row and the carousel section. When a tag filter is active, hidden cards should not count toward carousel pagination. The `SectionHeading` component can label the carousel section (e.g., "More Posts" or "All Posts").
  - **Blockers**: None

#### Phase 2: Music Page — PostCard Grid with Featured Row + Carousel + Tag Filters

- [ ] **STORY-02**: As a site visitor, I want the music page to display music posts as PostCards in a featured row and infinity carousel so that it matches the blog page layout
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] The music page (`/music`) displays posts from the blog collection filtered to only those tagged "music"
    - [ ] The page title is "My Music" with the YouTube subscribe link directly beneath it
    - [ ] The first row shows up to 3 most recent music posts as static PostCards in a 3-column grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
    - [ ] The second row is an infinity-scroll carousel displaying the remaining music posts in a 3-column grid, with prev/next navigation and page counter
    - [ ] The carousel wraps around and is responsive (same behavior as blog page carousel)
    - [ ] If there are 3 or fewer total music posts, only the featured row displays (no carousel row)
    - [ ] Clicking a PostCard navigates to the individual blog post page (`/blog/[slug]`) where the YouTube player is already embedded in the content
    - [ ] The old single-player YouTube carousel and `music.json`-driven layout are completely removed from this page
    - [ ] Page is fully responsive at mobile (375px), tablet (768px), and desktop (1280px)
  - **Tasks**:
    - [ ] Rewrite `src/pages/music.astro` — replace the `music.json` import and single-player carousel with a blog collection query filtered by "music" tag
    - [ ] Keep the "My Music" heading and YouTube subscribe link at the top (move subscribe link to directly below the title)
    - [ ] Split music posts into `featuredPosts` (first 3) and `carouselPosts` (the rest)
    - [ ] Render `featuredPosts` as a static 3-column PostCard grid
    - [ ] Render `carouselPosts` in a carousel container with prev/next buttons and page counter (same pattern as blog page)
    - [ ] Remove all old carousel JavaScript (the `define:vars={{ musicData }}` script block) and replace with the new carousel init script
    - [ ] Local Testing: Run `npm run dev`, verify music page shows only music-tagged posts as PostCards, featured row and carousel work, clicking a card goes to the correct post with YouTube player, responsive at all breakpoints
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify music page layout, card display, navigation to individual posts, and responsive design
    - [ ] Git: Commit with message describing music page redesign
  - **Technical Notes**: The music page no longer reads from `src/data/music.json` — it queries the blog collection with `getCollection('blog', ({ data }) => !data.draft && data.tags.some(t => t.toLowerCase() === 'music'))`. The `music.json` file is NOT deleted (the admin upload tool still writes to it), but it is no longer imported by `music.astro`. Individual music post pages already render the YouTube iframe from their markdown content, so no changes are needed to post pages.
  - **Blockers**: None

- [ ] **STORY-03**: As a site visitor, I want tag filtering on the music page so that I can browse music by topic
  - **Priority**: Must-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] A tag filter bar appears on the music page between the heading and the post grid, matching the blog page's filter style
    - [ ] An "All" button is present showing the total count of music posts
    - [ ] Tag buttons display each tag (excluding "music" itself since all posts on this page are music) with post counts
    - [ ] Clicking a tag filters both the featured row and carousel to show only matching posts
    - [ ] Multi-select works: clicking multiple tags shows posts matching ANY selected tag
    - [ ] Clicking "All" clears all tag selections and shows everything
    - [ ] Active tag buttons use the dark charcoal style; inactive use the warm/light style (matching blog page)
    - [ ] When filters reduce visible cards, the carousel pagination adjusts accordingly
    - [ ] A "No posts match the selected tags" message shows if no posts match
  - **Tasks**:
    - [ ] Add tag collection logic to `src/pages/music.astro` — gather tags from music posts, count occurrences, exclude the "music" tag, sort alphabetically
    - [ ] Render the tag filter bar with "All" button and individual tag buttons (same markup pattern as blog page)
    - [ ] Add `data-tags` attributes to all PostCard wrappers (both featured and carousel) so the filter JS can read them
    - [ ] Add tag filter JavaScript matching the blog page's multi-select filter logic, adapted to work with both the static featured row and the carousel
    - [ ] Add the "no results" message element (hidden by default)
    - [ ] Local Testing: Run `npm run dev`, verify tag filters appear, multi-select works, carousel updates, "no results" shows when appropriate
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify tag filtering on music page
    - [ ] Git: Commit with message describing music page tag filtering
  - **Technical Notes**: The filter JavaScript pattern from `src/pages/blog/index.astro` can be largely reused. The key difference is that the "music" tag should be excluded from the filter buttons (since every post on this page has it — it would be redundant). When tag filters change the visible set of cards, the carousel should re-paginate based on visible cards only.
  - **Blockers**: STORY-02 (music page must be converted to PostCard layout first)

#### Phase 3: Scale Navigation for Growing Content

- [ ] **STORY-04**: As a site visitor, I want a "Load More" button on the blog and music pages so that I can browse large numbers of posts without clicking through carousel pages
  - **Priority**: Should-Have
  - **Acceptance Criteria**: (verified at Manual Testing checkpoint)
    - [ ] On both the blog page and music page, the layout changes from featured row + infinity carousel to featured row + initial grid + "Load More" button
    - [ ] The featured row still shows the 3 most recent posts as static PostCards
    - [ ] Below the featured row, the next 6 posts display in a 3-column grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
    - [ ] A "Load More" button appears below the grid if there are additional posts beyond the visible set
    - [ ] Clicking "Load More" reveals the next batch of 6 posts with a smooth transition (no page reload)
    - [ ] The button text updates to reflect remaining count (e.g., "Load More (12 remaining)")
    - [ ] When all posts are visible, the "Load More" button disappears
    - [ ] Tag filtering works across all visible posts (featured row + all loaded batches)
    - [ ] When a tag filter is active, "Load More" operates on the filtered subset (only loads more posts matching the active tags)
    - [ ] The layout is fully responsive at mobile (375px), tablet (768px), and desktop (1280px)
    - [ ] The carousel (prev/next arrows, page counter) from STORY-01/02 is replaced by this pattern
  - **Tasks**:
    - [ ] Update `src/pages/blog/index.astro` — replace the carousel section with a grid that renders ALL non-music posts as PostCards (hidden beyond the initial batch via CSS/JS), plus a "Load More" button
    - [ ] Add `data-index` attributes to all post cards (beyond the featured row) for batch show/hide logic
    - [ ] Add JavaScript: track current batch index, on "Load More" click reveal the next 6 cards, update button text with remaining count, hide button when all cards are visible
    - [ ] Update tag filter JavaScript to integrate with Load More — when filtering, reset to first batch of matching posts and adjust "Load More" to only count/reveal filtered posts
    - [ ] Apply the same changes to `src/pages/music.astro` — replace carousel with Load More grid (same batch size and behavior)
    - [ ] Style the "Load More" button to match the site's design system (e.g., `border border-vor-sand text-vor-charcoal font-heading` style, centered below the grid)
    - [ ] Local Testing: Run `npm run dev`, verify Load More works on both pages with varying post counts, test with tag filters active, test responsive behavior
    - [ ] Manual Testing: CHECKPOINT — Notify user to manually verify Load More behavior on both pages, tag filter integration, and responsive design
    - [ ] Git: Commit with message describing Load More navigation
  - **Technical Notes**: All posts are rendered in the HTML at build time (Astro is static) — the "Load More" logic is purely client-side show/hide, not a server fetch. This keeps the implementation simple and works with the existing tag filter system. Batch size of 6 (two carousel "pages" worth) is a starting point — can be adjusted. The featured row (3 cards) is always visible and not affected by Load More. When this story is implemented, it replaces the infinity carousel from STORY-01 and STORY-02 — those carousel arrows and page counters are removed in favor of the Load More button.
  - **Blockers**: STORY-01 and STORY-02 (pages must be converted to PostCard layout first)

### Unresolved Blockers

None.

---

## 3. Non-Goals

- Changing the homepage layout or carousels (they remain as-is)
- Deleting `src/data/music.json` (admin upload tool still uses it)
- Modifying individual blog/music post pages (`/blog/[slug]`)
- Changing the PostCard component design
- Adding search functionality
- Modifying the My Story section

## 4. Dependencies

- Existing `PostCard` component (no changes needed)
- Existing `SectionHeading` component (no changes needed)
- Blog content collection with "music" tag convention already in place
- Homepage carousel JavaScript pattern (`initCarousel`) as reference implementation

## 5. Success Metrics

- Blog page shows zero music-tagged posts
- Music page shows only music-tagged posts
- Both pages have consistent layout: featured row + infinity carousel
- Tag filtering works on both pages
- All pages render correctly at mobile (375px), tablet (768px), desktop (1280px)
- `npm run build` completes without errors

## 6. Open Questions

- None — resolved during planning:
  - Homepage "Browse by Topic" keeps the "music" tag (confirmed by user — music shows in topic links, just not in the blog page's featured row)
  - Featured posts use the 3 most recent for now; a `featured` front matter field may be considered later when content volume grows significantly
