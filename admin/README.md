# VOR Admin Upload Tool

Local-only Streamlit app for creating Voice of Repentance blog content. This directory is excluded from git via `.gitignore` and is **never deployed** to Cloudflare Pages.

## How It Works

The admin tool runs on your local machine and writes content files into the repo. Only those content files get committed and pushed.

**What the admin tool writes (tracked by git):**
- `src/content/blog/*.md` — blog post markdown files
- `src/content/story/*.md` — story chapter markdown files
- `src/data/music.json` — music catalog entries
- `public/images/*` — cover images

**What stays local (ignored by git):**
- `admin/` — this entire directory (the tool itself)

## Running the Admin Tool

```bash
uv run streamlit run admin/admin.py --server.port 8502
```

## Music Post Fields

- **Title**: Full post title (e.g., "Song Name | Subtitle")
- **Subtitle**: Short one-liner shown on blog cards and under the post title on the post page
- **Description**: Full YouTube description — goes only in the post body (not in frontmatter). Single newlines are automatically converted to double newlines for proper Markdown rendering.
- **Tags**: Comma-separated (defaults to "music, worship")
- **YouTube URL**: Any standard YouTube link — video ID is extracted automatically
- **Album cover image**: PNG/JPG/WEBP uploaded and saved to `public/images/`

## Blog Post Fields

- **Title**: Post title
- **Description**: Short summary shown on cards
- **Tags**: Comma-separated
- **Content**: Full Markdown body
- **Cover image**: Optional

## Story Chapter Fields

- **Chapter number**: Integer for ordering
- **Title**: Chapter theme
- **Description**: Short summary
- **Content**: Full chapter text

## Commit & Push

Use the sidebar "Commit & Push" button to stage content paths and push to `origin/main`. This only stages the content files listed above, not the admin tool itself.
