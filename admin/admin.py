"""
VOR Admin Upload Tool — local Streamlit app for managing Voice of Repentance content.
Launch: streamlit run admin/admin.py --server.port 8502
"""

import json
import re
import subprocess
from datetime import date
from pathlib import Path

import streamlit as st

# ── Paths ──────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).parent.parent
BLOG_DIR = REPO_ROOT / "src" / "content" / "blog"
STORY_DIR = REPO_ROOT / "src" / "content" / "story"
MUSIC_JSON = REPO_ROOT / "src" / "data" / "music.json"
IMAGES_DIR = REPO_ROOT / "public" / "images"

# ── Helpers ────────────────────────────────────────────────────────────────────


def generate_slug(title: str) -> str:
    """Lowercase, hyphenated slug with special chars stripped."""
    slug = title.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s-]+", "-", slug).strip("-")
    return slug


def extract_youtube_id(url: str) -> str | None:
    """Extract video ID from common YouTube URL formats."""
    patterns = [
        r"(?:youtube\.com/watch\?v=)([\w-]+)",
        r"(?:youtu\.be/)([\w-]+)",
        r"(?:youtube\.com/embed/)([\w-]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def youtube_desc_to_markdown(text: str) -> str:
    """Convert YouTube description newlines to Markdown-friendly double newlines.

    YouTube uses single newlines for line breaks, but Markdown collapses them.
    This ensures bullets, emoji lines, etc. each render on their own line.
    """
    return re.sub(r"(?<!\n)\n(?!\n)", "\n\n", text)


def save_image(uploaded_file, slug: str) -> str:
    """Save uploaded image to public/images/ and return the coverImage path."""
    ext = Path(uploaded_file.name).suffix.lower()
    filename = slug.replace("-", "_") + ext
    dest = IMAGES_DIR / filename
    dest.write_bytes(uploaded_file.getbuffer())
    return f"/images/{filename}"


def run_git(*args: str) -> tuple[int, str]:
    """Run a git command in the repo root and return (returncode, output)."""
    result = subprocess.run(
        ["git", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    return result.returncode, (result.stdout + result.stderr).strip()


# ── Page config ────────────────────────────────────────────────────────────────

st.set_page_config(page_title="VOR Admin", page_icon="✝️", layout="centered")
st.title("VOR Admin Upload Tool")

# ── Sidebar: Review & Push ─────────────────────────────────────────────────────

with st.sidebar:
    st.header("Review & Push")

    if st.button("Refresh git status"):
        st.cache_data.clear()

    rc, status_output = run_git("status", "--short")
    has_changes = bool(status_output.strip())

    if has_changes:
        st.code(status_output, language="bash")
    else:
        st.info("Working tree clean — nothing to commit.")

    commit_msg = st.text_input("Commit message", value="content: add new post")

    if st.button("Commit & Push", disabled=not has_changes):
        with st.spinner("Committing and pushing..."):
            # Stage content paths
            run_git("add", "src/content/", "src/data/music.json", "public/images/")
            rc, out = run_git("commit", "-m", commit_msg)
            if rc != 0:
                st.error(f"Commit failed:\n{out}")
            else:
                st.success(f"Committed!\n{out}")
                rc, out = run_git("push", "origin", "main")
                if rc != 0:
                    st.error(f"Push failed:\n{out}")
                else:
                    st.success(f"Pushed to origin/main!\n{out}")

# ── Tabs ───────────────────────────────────────────────────────────────────────

tab_music, tab_blog, tab_story = st.tabs(
    ["🎵 New Music Post", "📝 New Blog Post", "📖 New Story Chapter"]
)

# ── Tab 1: New Music Post ──────────────────────────────────────────────────────

with tab_music:
    st.subheader("Create a Music Post")

    with st.form("music_form"):
        m_title = st.text_input("Title")
        m_date = st.date_input("Date", value=date.today())
        m_subtitle = st.text_input("Subtitle (short one-liner for cards & post header)")
        m_desc = st.text_area("Description (full YouTube description — post body only)")
        m_tags = st.text_input("Tags (comma-separated)", value="music, worship")
        m_youtube = st.text_input("YouTube URL")
        m_image = st.file_uploader(
            "Album cover image", type=["png", "jpg", "jpeg", "webp"]
        )
        m_submit = st.form_submit_button("Create Music Post")

    if m_submit:
        # Validation
        errors = []
        if not m_title:
            errors.append("Title is required.")
        if not m_subtitle:
            errors.append("Subtitle is required.")
        if not m_desc:
            errors.append("Description is required.")
        if not m_youtube:
            errors.append("YouTube URL is required.")
        if not m_image:
            errors.append("Album cover image is required.")

        video_id = extract_youtube_id(m_youtube) if m_youtube else None
        if m_youtube and not video_id:
            errors.append("Could not extract YouTube video ID from that URL.")

        slug = generate_slug(m_title) if m_title else ""
        md_path = BLOG_DIR / f"{slug}.md"
        if slug and md_path.exists():
            errors.append(f"Blog post already exists: {md_path.name}")

        if errors:
            for e in errors:
                st.error(e)
        else:
            # Save image
            cover_path = save_image(m_image, slug)

            # Parse tags
            tags_list = [t.strip() for t in m_tags.split(",") if t.strip()]
            tags_yaml = ", ".join(f'"{t}"' for t in tags_list)

            # Write blog markdown
            front_matter = f"""---
title: "{m_title}"
date: {m_date.isoformat()}
description: "{m_subtitle}"
subtitle: "{m_subtitle}"
tags: [{tags_yaml}]
coverImage: "{cover_path}"
draft: false
---"""

            body = f"""{youtube_desc_to_markdown(m_desc)}

<div style="max-width: 720px; margin: 2rem auto;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
    <iframe
      src="https://www.youtube.com/embed/{video_id}"
      title="{m_title}"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</div>"""

            md_path.write_text(f"{front_matter}\n\n{body}\n", encoding="utf-8")

            # Update music.json
            music_data = json.loads(MUSIC_JSON.read_text(encoding="utf-8"))
            music_data.append(
                {
                    "id": video_id,
                    "title": m_title,
                    "type": "song",
                    "featured": False,
                    "description": m_subtitle,
                    "blogPost": f"/blog/{slug}",
                }
            )
            MUSIC_JSON.write_text(
                json.dumps(music_data, indent=2) + "\n", encoding="utf-8"
            )

            st.success("Music post created!")
            st.markdown(f"- Blog post: `{md_path.relative_to(REPO_ROOT)}`")
            st.markdown(f"- Cover image: `{cover_path}`")
            st.markdown(f"- music.json updated ({len(music_data)} entries)")

# ── Tab 2: New Blog Post ──────────────────────────────────────────────────────

with tab_blog:
    st.subheader("Create a Blog Post")

    with st.form("blog_form"):
        b_title = st.text_input("Title")
        b_date = st.date_input("Date", value=date.today())
        b_desc = st.text_input("Description (short summary for cards)")
        b_tags = st.text_input("Tags (comma-separated)")
        b_content = st.text_area("Content (full Markdown body)", height=300)
        b_image = st.file_uploader(
            "Cover image (optional)", type=["png", "jpg", "jpeg", "webp"]
        )
        b_submit = st.form_submit_button("Create Blog Post")

    if b_submit:
        errors = []
        if not b_title:
            errors.append("Title is required.")
        if not b_desc:
            errors.append("Description is required.")
        if not b_content:
            errors.append("Content is required.")

        slug = generate_slug(b_title) if b_title else ""
        md_path = BLOG_DIR / f"{slug}.md"
        if slug and md_path.exists():
            errors.append(f"Blog post already exists: {md_path.name}")

        if errors:
            for e in errors:
                st.error(e)
        else:
            # Optional image
            cover_path = ""
            if b_image:
                cover_path = save_image(b_image, slug)

            # Parse tags
            tags_list = [t.strip() for t in b_tags.split(",") if t.strip()]
            tags_yaml = ", ".join(f'"{t}"' for t in tags_list)

            # Build front matter
            fm_lines = [
                "---",
                f'title: "{b_title}"',
                f"date: {b_date.isoformat()}",
                f'description: "{b_desc}"',
                f"tags: [{tags_yaml}]",
            ]
            if cover_path:
                fm_lines.append(f'coverImage: "{cover_path}"')
            fm_lines.append("draft: false")
            fm_lines.append("---")

            md_path.write_text(
                "\n".join(fm_lines) + "\n\n" + b_content + "\n", encoding="utf-8"
            )

            st.success("Blog post created!")
            st.markdown(f"- Blog post: `{md_path.relative_to(REPO_ROOT)}`")
            if cover_path:
                st.markdown(f"- Cover image: `{cover_path}`")

# ── Tab 3: New Story Chapter ──────────────────────────────────────────────────

with tab_story:
    st.subheader("Create a Story Chapter")

    with st.form("story_form"):
        s_chapter = st.number_input("Chapter number", min_value=1, step=1)
        s_title = st.text_input("Title (chapter theme)")
        s_desc = st.text_input("Description (short summary)")
        s_content = st.text_area("Content (full chapter text)", height=300)
        s_submit = st.form_submit_button("Create Story Chapter")

    if s_submit:
        errors = []
        if not s_title:
            errors.append("Title is required.")
        if not s_desc:
            errors.append("Description is required.")
        if not s_content:
            errors.append("Content is required.")

        # Check for duplicate chapter number
        for existing in STORY_DIR.glob("*.md"):
            text = existing.read_text(encoding="utf-8")
            match = re.search(r"^chapter:\s*(\d+)", text, re.MULTILINE)
            if match and int(match.group(1)) == int(s_chapter):
                errors.append(
                    f"Chapter {int(s_chapter)} already exists: {existing.name}"
                )
                break

        if errors:
            for e in errors:
                st.error(e)
        else:
            slug = generate_slug(s_title)
            filename = f"chapter-{int(s_chapter)}-{slug}.md"
            md_path = STORY_DIR / filename

            front_matter = f"""---
title: "{s_title}"
date: {date.today().isoformat()}
description: "{s_desc}"
chapter: {int(s_chapter)}
draft: false
---"""

            md_path.write_text(
                front_matter + "\n\n" + s_content + "\n", encoding="utf-8"
            )

            st.success("Story chapter created!")
            st.markdown(f"- Story file: `{md_path.relative_to(REPO_ROOT)}`")
