# VOR Redesign — Paths, Content Gaps, and Build Instructions

**Status:** Design approved (direction `2a` — Paths + The Weekly Turn)
**Last updated:** 2026-08-02
**Where this goes:** `docs/redesign-paths.md` in the VOR-blog repo, on the `redesign` branch.

---

## 1. The organizing idea

The site stops being a blog with an archive and becomes **a set of paths, walked one week at a time.**

- A **path** is an ordered sequence of 3–5 readings, named after a struggle a believer actually has.
- Each reading in a path is a **turn** (Week 1, Week 2…). "Turn" is both the repentance word and the unit of content.
- There is **no archive page.** Every published post lives inside at least one path. If a post doesn't belong to a path, that is a signal the post needs a path built around it — not a signal to build an archive.
- A visitor either **picks a path** (self-directed, reads at their own pace) or **rides along** (subscribes and gets one turn a week).

Why this matters: "archive" tells a visitor the site is a pile of old things. "Path, week 2 of 4" tells them they are somewhere, going somewhere.

### Vocabulary — use these words consistently

| Use | Don't use |
| --- | --- |
| Path | Series, category, collection |
| Turn / This Week's Turn | Post, article, entry |
| Walk with me | Subscribe, join the newsletter |
| Start Here | Home |
| Earlier turns *(within a path only)* | Archive, Blog, Older posts |

---

## 2. The four launch paths

These map every non-music, non-AI post currently in `src/content/blog/`. Overlap is intentional and allowed — a post can serve two paths.

### Path 01 — *When the rules feel like a cage*
**4 weeks · ~22 min · slug `rules-cage`**
For the believer exhausted by trying to be good. The standard hasn't moved; how we become holy has.

| Week | Post | Status |
| --- | --- | --- |
| 1 | When the Rules Feel Like a Cage | ✅ published |
| 2 | Carrots, Sticks, and the Heart of Stone | ✅ published |
| 3 | The Resume That Doesn't Matter | ✅ published |
| 4 | Turning, Not Arriving | ✅ published |

### Path 02 — *Same thing, again*
**3 weeks · ~15 min · slug `same-thing-again`**
For the one who keeps returning to the sin they thought they'd left.

| Week | Post | Status |
| --- | --- | --- |
| 1 | What is Repentance | ✅ published |
| 2 | Carrots, Sticks, and the Heart of Stone | ✅ published *(shared with Path 01)* |
| 3 | Turning, Not Arriving | ✅ published *(shared with Path 01)* |
| — | Closing song: *Fighting Shadows* | ✅ published |

> ⚠️ This path is currently 100% borrowed. It needs one original turn to stand on its own — see §4, Gap A.

### Path 03 — *When you're not sure it ever took*
**4 weeks · ~20 min · slug `not-sure-it-took`**
For the long-time churchgoer with a question they don't say out loud. Ends in the survey.

| Week | Post | Status |
| --- | --- | --- |
| 1 | All Ten Were Asleep | ✅ published |
| 2 | The Resume That Doesn't Matter | ✅ published *(shared with Path 01)* |
| 3 | What is Repentance | ✅ published *(shared with Path 02)* |
| 4 | Am I Saved? — eight questions | ✅ page exists (`/am-i-saved`) |

### Path 04 — *When the culture asks you to look away*
**3 weeks · ~18 min · slug `look-away`**
The Romans 1 trilogy, in order. Already written as a sequence — this path is purely a re-labeling.

| Week | Post | Status |
| --- | --- | --- |
| 1 | The Wrong Question | ✅ published |
| 2 | The Suppression Mechanism | ✅ published |
| 3 | The Pronouns of Pharaoh | ✅ published |

---

## 3. Content that sits outside the paths (and where it goes)

| Content | Placement |
| --- | --- |
| *Journey2Health: The Battle Within* | Book teaser section on the homepage; becomes Path 05 when chapters are excerpted (see Gap B) |
| *Fighting Shadows* | Sunday Sit for Path 02 |
| *Outstretched Hands* | Sunday Sit for Path 01 |
| *Town Called Nowhere* | Sunday Sit for Path 03 |
| The three AI-in-Ministry posts | `/ai-ministry` — one page, footer link only. Not a path. Different audience; do not mix it into the walk. |
| Selah | Footer only, labeled "in pilot," until it ships |
| My Story (Chapter 1) | Footer link. Not a path until there are 3+ chapters. |

---

## 4. Content gaps — what needs writing

Ordered by how much each unblocks. Nothing here is a code task.

### Gap A — Path 02 needs an original opening turn ⚑ highest priority
**Working title:** *The Sin That Knows Your Address*
Path 02 is the emotional center of the whole site (the struggling long-walker is the primary visitor) and every turn in it is currently borrowed from another path. It needs one turn that is only its own — the honest description of relapse, written without either shame or excuse. Roughly 1,200 words. Slot it as Week 1 and push the others back.

### Gap B — Path 05: the body path
**Working title:** *The Body Keeps a Ledger* · 4 weeks
You have a book on this and one overview post. Four excerpt-derived turns from *The Battle Within* would make the strongest path on the site, because it's the one nobody else is writing: a physician on Galatians 5 as physiology. Draft turns:
1. Flesh is not a metaphor
2. What twenty years of exam rooms taught me about the will
3. Fruit you can measure
4. Stewardship, not repayment

### Gap C — Every path needs a path-intro page
Each path needs ~150 words of its own front matter prose: who this is for, what it will cost you to read, what it won't do. This is the page the email drives to and the page that gets shared. Four of these (five with Path 05). Short, but they carry the invitation — worth writing carefully.

### Gap D — A "Start Here" page for people who don't know which path
One page, three or four plain diagnostic sentences ("If you're tired of trying to be good, start with Path 01"). Not a quiz. Not a funnel. Just a signpost.

### Gap E — Week 0 welcome email
The first email anyone gets. Says what the rhythm is (Wednesday read, Sunday sit, reply anytime), says clearly that nothing here costs money and nothing will be sold, and gives the calendar link. One screen long.

### Gap F — My Story, chapters 2 and 3
Unchanged from the existing roadmap, but the reason is sharper now: with a paths structure, a one-chapter story section reads as abandoned. Either add two chapters or fold Chapter 1 into the About page and drop the section.

---

## 5. Build instructions

### 5.1 Branch strategy

Keep the existing repo. Do not rebuild.

```bash
git checkout -b redesign
```

Cloudflare Pages builds every branch automatically and gives it a preview URL
(`redesign.<project>.pages.dev`). Review there. When it's right, merge to `main`
and the live site flips in one deploy. No infrastructure change required.

Set the preview URL to `noindex` so Google doesn't index the staging copy —
add to `public/_headers`:

```
https://redesign.*.pages.dev/*
  X-Robots-Tag: noindex
```

### 5.2 New content collection: `paths`

Add to `src/content.config.ts`:

```ts
const paths = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paths' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),            // display order on the homepage
    forWhom: z.string(),          // one sentence: who this path is for
    description: z.string(),      // ~150 words, the path-intro prose
    coverImage: z.string().optional(),
    turns: z.array(z.string()),   // blog post ids, in week order
    sundaySit: z.string().optional(), // music post id
    draft: z.boolean().default(false),
  }),
});
```

Each path is one markdown file: `src/content/paths/rules-cage.md`. Reading
time per path = sum of `readingTime()` over its turns, computed at build time —
reuse `src/utils/readingTime.ts`, don't hand-enter minutes.

### 5.3 Pages to add or change

| Route | Action |
| --- | --- |
| `/` | Rebuild to direction `2a`: hero → this week's turn → four paths → rhythm → book → Troy → footer. Delete both carousels and the tag cloud. |
| `/paths` | New. All paths, same card as the homepage. |
| `/paths/[slug]` | New. Path intro prose, then the week list with each turn linked. |
| `/blog/[...slug]` | Keep the route (don't break inbound links), but reframe the page furniture: show "Path 01 · Week 2 of 4" above the title and "Next turn →" below, instead of prev/next by date. |
| `/blog` | Redirect to `/paths`. |
| `/blog/tags/[tag]` | Keep — SEO value, no nav link. |
| `/this-week` | New. The current turn, permalinked, with a "start this path from week 1" link. |
| `/start-here` | New. Gap D. |
| `/about` | Merge `/contact` into it. Existing About prose is strong — keep it verbatim. Add the Cal.com embed and the write-to-Troy form below it. |
| `/contact` | Redirect to `/about#contact`. |
| `/am-i-saved` | Keep. Reframe as Week 4 of Path 03. |
| `/ai-ministry` | Keep as one page. Remove from the header nav; footer only. |
| `/selah` | Keep. Footer only, labeled "in pilot." |
| `/music` | Keep. Songs also surface as Sunday Sit inside paths. |

### 5.4 Nav

```
Start Here · This Week · Paths · Music · The Book · Troy     [Walk with me]
```

Footer carries: All paths, This week, Music, My Story · AI in Ministry, Selah (in pilot) · YouTube, Contact, RSS.

Drop the "AI in Ministry" dropdown from the header entirely — it's the only
dropdown in the nav and it serves the smallest audience.

### 5.5 Email — Beehiiv

Beehiiv's free tier covers this: unlimited subscribers to the send limit, custom
fields, and an API for programmatic subscribe.

- **Beehiiv becomes the list of record.** Retire the SQLite CRM. Don't port it —
  export what's there as CSV and import once.
- **Keep Ezra for notification only.** The Telegram ping on submission is
  genuinely useful and costs nothing to maintain. The welcome email moves to
  Beehiiv's automation so it isn't dependent on the Mac Mini being up.
- **Capture a `path` custom field** on every signup (`rules-cage`,
  `same-thing-again`, …, or `riding-along`). This is the whole reason to
  segment: someone on Path 02 should get Path 02's turns, in order, from week 1
  — not whatever the site published that Wednesday.
- **Am I Saved? survey** posts to Beehiiv with `path=not-sure-it-took` **and**
  fires the existing Ezra webhook for the Telegram alert. Two calls, both
  fire-and-forget; don't block the thank-you screen on either.

The `source` field the current CRM schema uses maps cleanly to a Beehiiv custom
field — keep the same values so nothing is lost in the migration.

### 5.6 Booking — deferred

**No Cal.com embed at launch.** All pastoral contact is email only: the form on
`/about`, and reply-to on every Beehiiv send. No booking link, no floating
button, nothing that implies a scheduled slot.

Reasoning: a calendar sets an expectation of availability that one person cannot
hold if the site does its job, and a booking widget on a devotional page reads
like a consultation. Email scales down gracefully — a slow reply is still a
reply; a missed calendar slot is a broken promise.

The `/about` page instead states plainly what to expect:

- Nothing costs anything, ever
- What you write is never quoted or published
- I'm a physician and a layman, not a licensed counselor — if you're in crisis,
  call someone who can be there tonight

**Separate channel for professional inquiries.** Speaking, pulpit supply,
retreats, conference sessions, and advisory work on technology in ministry go to
a *different address* — so a request for an honorarium-paying engagement never
lands in the same queue as someone writing about their soul. One button on
`/about`, clearly labeled, visually quieter than the pastoral form.

Suggested addressing:

| Purpose | Address |
| --- | --- |
| Pastoral / readers | `troy@voiceofrepentance.com` |
| Speaking & ministry services | `speaking@voiceofrepentance.com` |

Both are aliases on the same mailbox at first; split them only if volume
justifies it. The existing Ezra Telegram ping should fire for both, tagged by
`source` so you can tell them apart at a glance.

**If booking comes back later,** the troymd.com Cal account (`hackstert/…`)
already exists and the embed is a ten-minute change. Keep it inline on `/about`
rather than the sitewide floating button that troymd.com uses — a button that
follows you around a ministry site reads as sales.


### 5.7 Non-negotiables to encode

- **The reader never pays.** No donate link, no "support this ministry," no tip
  jar, no paid tier, no course, no ask pointed at the person reading — anywhere,
  including the email footer. This is a constraint on what the *visitor* is asked
  for, not a vow of poverty for the ministry: funding that never touches the
  reader is an open question, deliberately not front-loaded, and not forbidden
  here. Do not read this bullet as banning every future funding model.
- **No urgency marketing.** No countdowns, no "limited spots," no exit-intent
  popups. The tone is pastoral; the mechanics have to match it.
- **Every photograph goes through the plate treatment.** No full-bleed banner
  images except the hero.

### 5.8 Suggested sequence

1. `paths` collection + the four path markdown files *(code + Gap C prose)*
2. New homepage `2a`
3. `/paths` and `/paths/[slug]`
4. Post page reframed to "Week N of M" + "Next turn"
5. Redirects: `/blog` → `/paths`, `/contact` → `/about#contact`
6. Nav + footer
7. Beehiiv swap and the `path` custom field
8. Split `speaking@` alias and wire the second contact form
9. Merge to `main`

Steps 1–6 are the redesign. 7–8 can ship after, on `main`, without touching layout.

---

## 6. What is deliberately not being done

- **No ask pointed at the reader.** No donation link, no tip jar, no paid tier,
  no course. Stated in §5.7; repeated here so it survives a future contractor
  reading only this section. Note the scope: the rule is that the *visitor* is
  never charged or solicited. Reader-invisible funding is neither planned nor
  ruled out, and this line is not a mandate to strip one out if it ever arrives.
- **No Selah promotion** until it ships. A prominent "coming soon" for a product
  several months out costs credibility on every visit in between.
- **No archive page,** now or later. If content has no path, write a path.
- **No booking calendar.** Email only until volume proves it is needed. A
  calendar promises availability one person cannot hold.
- **No AI-in-Ministry expansion on the main site.** It's a different audience.
  When it outgrows one page, it gets its own domain — not more nav slots here.
