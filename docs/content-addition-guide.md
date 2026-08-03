# Content Addition Guide

How to add each kind of content to Voice of Repentance without breaking the
build or quietly breaking a promise to a reader.

**Created:** 2026-08-03
**Companion to:** `tasks/strategy-ministry-2026.md` (why), `docs/redesign-paths.md` (structure)

---

## The two rules everything else serves

**1. The build is the only gate.** There are no tests and no linter. `npm run build`
is what stands between a mistake and production, so it is deliberately strict.
When it throws, it is telling you something is actually wrong. Fix the content,
never the check.

**2. Do not promise what the site cannot deliver.** Every guard in `src/lib/paths.ts`
exists because a previous version of this site told a reader something untrue: a
path that listed an unpublished post, a rhythm that promised a song every Sunday
with one song for four Sundays, a survey described as private that posted answers
to a server. The guards are cheap. Broken trust is not.

---

## Adding a song

**1. Publish on YouTube first.** The site links to the video, so it has to exist.

**2. Create `src/content/blog/<slug>.md`.**

```markdown
---
title: "Song Name | One segment of genre and theme"
date: 2026-08-05
description: "One or two sentences. Shown on cards and in the latest-release banner."
tags: ["music", "worship", "grace"]
coverImage: "/images/music/<slug>.jpg"
draft: false
---

A paragraph in your own words.

<div style="max-width: 720px; margin: 2rem auto;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px;">
    <iframe
      src="https://www.youtube.com/embed/VIDEO_ID"
      title="Song Name"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</div>

More paragraphs if you have them.
```

The `music` tag is what makes it a song. It is how every page tells songs from
essays, so without it the song lands in the wrong places.

Titles keep their keyword segments but stop at two, and drop any trailing
"Voice of Repentance". See `tasks/strategy-ministry-2026.md` §5b.

**3. Add the cover.**

```bash
curl -sL "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg" \
  -o public/images/music/<slug>.jpg
```

Fall back to `sddefault` or `hqdefault` if maxres 404s. Keep it under about
250KB. If a source image is large, re-encode rather than shipping it:

```bash
node -e 'const s=require("sharp"),f=process.argv[1];
s(f).resize({width:1400,withoutEnlargement:true})
 .jpeg({quality:82,mozjpeg:true}).toBuffer()
 .then(b=>require("fs").writeFileSync(f,b))' public/images/music/<slug>.jpg
```

**4. Add it to a collection** in `src/data/musicCollections.ts`, matching the
YouTube playlist it belongs to. A song in no collection still appears under
"All songs" but is unreachable by browsing.

**5. Build.**

Nothing else is needed. The latest-release banner on `/music` is computed from
the newest music post, and collection counts are computed from what is actually
published. Neither is hand-edited.

### Songs with a landing page

`/listen/*` pages are hand-authored, not generated. If you build one, add the
mapping to `LISTEN_PAGES` in `src/data/musicCollections.ts` so the banner and
cards point at the landing page instead of the blog post.

---

## Adding an essay

**1. Create `src/content/blog/<slug>.md`.** The slug is the URL and the id every
path uses to reference it, so choose it once and do not rename it.

```markdown
---
title: "The Title"
date: 2026-08-05
description: "Shown on cards, in search results, and in the path week list."
subtitle: "Optional. A second line under the title on the post page."
tags: ["repentance", "grace"]
coverImage: "/images/blog/<slug>.png"
draft: false
---
```

**2. Do not tag it `music`.** That tag is reserved and will route the essay to
`/music` and out of the paths.

**3. Publish by completed cycle.** Essays accumulate as drafts until a path's
four turns are done, then the path ships together. Do not drip a half-formed
turn to fill a Wednesday.

**4. An essay with no path is invisible.** There is no archive page and there
will not be one. A published essay that no path lists is reachable only by
direct link. Either add it to a path or leave it `draft: true` until a path
exists for it.

---

## Adding a path

**1. Create `src/content/paths/<slug>.md`.**

```markdown
---
title: "When the thing keeps happening"
number: "05"
order: 5
forWhom: "One sentence, first person, in the reader's own voice."
coverImage: "/images/site/path05-name.jpg"
turns:
  - first-essay-slug
  - second-essay-slug
  - third-essay-slug
  - fourth-essay-slug
sundaySits:
  - first-song-slug
  - second-song-slug
  - third-song-slug
  - fourth-song-slug
draft: false
---

Roughly 150 words of prose. What this path is, what it will cost to read,
and what it will not give you.
```

**2. `forWhom` is the most load-bearing sentence you will write.** It is quoted
on `/start-here`, it is how a visitor self-selects, and per §5b it is the basis
for the YouTube teaching title. Write it as the sentence the person would say
about themselves, not as a topic.

**3. `sundaySits` must have exactly one entry per week.** Weeks means turns plus
any `finalTurn`. The build fails on a mismatch, on purpose.

**4. Add it to `WALK_OPTIONS`** in `src/lib/paths.ts` so it appears in the signup
selector, and make sure the value matches the Beehiiv `path` custom field.

**5. Cover image.** Full-bleed art at 1400px wide, quality 82, real JPEG. Verify
the format rather than trusting the extension:

```bash
node -e 'require("sharp")(process.argv[1]).metadata().then(m=>console.log(m.format,m.width))' \
  public/images/site/path05-name.jpg
```

The four original path covers shipped as PNG data with a `.jpg` extension at
4 to 9MB each. Browsers sniff the content so nothing looked broken, which is
exactly why it went unnoticed.

---

## What the build will tell you

All three are deliberate. None should be worked around.

**A path lists an unpublished post**

```
Path "same-thing-again" lists turn "wired-to-fail", which is not a published
post in src/content/blog. Fix the id or unset draft on the post.
```

Turn ids are filenames without `.md`. Either the id is wrong or the post is
still a draft.

**A Sunday sit is missing or unknown**

```
Path "look-away" lists Sunday sit "no-such-song" for week 2, which is not a
published post in src/content/blog.

Path "look-away" has 3 weeks but 2 sundaySits.
```

**A schema violation** names the file and field directly. Usually a missing
`description` or a `date` that is not a date.

---

## Things that are computed, so leave them alone

| Thing | Where it comes from |
| --- | --- |
| `/this-week` | most recently dated turn across all paths |
| Latest release banner on `/music` | newest post tagged `music` |
| Reading time | word count of the real post body, 200wpm |
| Path length and total minutes | summed from the actual turns |
| Collection counts on `/music` | published posts, not the generated list |
| "Week N of M" on a post page | the path that lists it, lowest `order` wins |
| Prev/next turn | position within the path |
| Sitemap and RSS | every non-draft post |

If one of these is wrong, the content is wrong. Do not hand-correct the display.

---

## A post in two paths

Allowed and already happening. The lower `order` path is primary and supplies
the "Week N of M" kicker; the others render as an "Also here" note. Nothing to
configure.

Reuse is a cost, though. When it climbs the paths start to feel like the same
four essays reshuffled. Write essays before adding paths.

---

## Before you push

```bash
npm run build     # must pass
npm run dev       # look at what you changed
```

Worth a look after content changes:

- The path page, if you touched a path. Every week should show a Wednesday turn
  and a Sunday song.
- `/music`, if you added a song. It should be the latest release, and its
  collection chip count should have gone up by one.
- `/start-here`, if you added a path. Four quoted sentences become five.

Cloudflare Pages deploys `main` automatically. Production takes a minute or two,
and briefly serves the old build on some edge nodes while it propagates, so a
check that fails immediately after a push is usually propagation rather than a
broken deploy. Verify by content, not by status code: the site has a real 404
page now, but a stale edge node will happily return the previous version with a
`200`.

---

## Things that are settled

Recorded so they are not relitigated:

- **No archive page.** Content without a path is not browsable. This is a
  forcing function on the content strategy.
- **Nothing costs money, and the site does not say so.** The constraint holds.
  The copy asserting it was removed on 2026-08-03 because a site with no prices
  does not need to announce it. Keep the constraint, do not restore the claim.
- **Every content photograph goes through `.plate`.** The homepage hero is the
  only full-bleed image on the site.
- **Say what is true about the survey.** `/am-i-saved` posts name, email, and
  the written reflections when a visitor asks for the assessment by email.
  Copy must not imply otherwise.
