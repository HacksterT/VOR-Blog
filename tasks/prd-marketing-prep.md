# PRD: Marketing Readiness Prep

**Created:** 2026-04-27
**Status:** Planning — awaiting decisions on analytics + email tooling before implementation begins
**Source:** Three-agent audit (SEO/meta, conversion funnel, technical/performance) run 2026-04-27 against `main` at commit `d595e0e`.

## Problem / Rationale

The site is technically solid (clean Astro build, correct canonicals, working sitemap, decent meta hygiene, strong individual conversion pages) but is not instrumented or wired for an aggressive marketing push. Three structural gaps will cap the return on any paid spend or content distribution effort:

1. **Nothing is measured.** No analytics of any kind. We cannot tell which channels convert, where the survey funnel leaks, or whether a post is read to the end. Every dollar of paid traffic is currently a black box.
2. **The funnel leaks at every junction.** Conversion pages are good in isolation but do not hand readers off to one another. Blog posts dead-end with related-post links and no CTA. The survey success state — the highest-intent moment on the site — offers no book or Selah handoff. The book page has an Amazon link but no email capture for waitlist or follow-on releases.
3. **No durable email list.** Every form submits to the custom Ezra `/api/vor/contact` backend. That captures the lead but gives no segmentation, no broadcast, no nurture sequences, no growth metric. Driving traffic to the site without a list to catch it is the most expensive way to learn nothing.

Several smaller issues compound the above (oversized images blowing LCP on mobile, no structured data, missing share buttons, gold-on-cream contrast failing WCAG AA), but the three structural gaps are the ones that actually gate marketing effectiveness.

This PRD captures the full readiness program. It is sequenced so the highest-leverage and lowest-uncertainty work happens first, and so the items requiring vendor decisions are isolated and called out.

## Decisions Required Before Implementation

Two decisions block Phase 1. Both should be made before any work begins on the technical side, because they shape what the technical work has to integrate with.

**Decision 1 — Analytics platform.** The choice is between:
- **Plausible** (privacy-aligned, lightweight, ~$9/mo, no cookie banner needed, simpler dashboard) — recommended default given the ministry context and the fact that EU/cookie-conscious visitors are a non-trivial share of any seeker audience.
- **Cloudflare Web Analytics** (free, already on the deploy platform, slightly less granular, no events) — viable if cost matters more than event tracking.
- **GA4** (free, deeper funnels and audience tools, requires cookie banner, heavier script) — overkill for current scale and adds compliance overhead.

**Decision 2 — Email list platform.** The choice is between:
- **Beehiiv** (newsletter-first, generous free tier, built-in monetization and referral tools, strong deliverability) — recommended default, especially if there is any future intent to publish a regular email cadence.
- **ConvertKit / Kit** (creator-focused, mature automation/sequences, excellent tagging) — strong alternative if automation flows are the priority over broadcast.
- **Buttondown** (indie, simple, Markdown-native, cheaper at small scale) — viable for a low-volume start.
- **Self-hosted on the Ezra backend** (no vendor cost, full control, but requires building segmentation, nurture, broadcast, deliverability handling) — not recommended; the engineering cost dwarfs the SaaS subscription for a non-trivial period.

The technical phases below assume Plausible + Beehiiv; if the decisions go elsewhere the integration shape changes but the sequencing does not.

## Phase 1 — Instrument and Capture (Critical)

This phase makes the rest of the work measurable and gives every visitor somewhere to land beyond the page they entered on.

### 1.1 Add analytics

Install the chosen analytics script in `src/layouts/BaseLayout.astro` inside the `<head>`. For Plausible, this is a single async script tag pointing at `plausible.io/js/script.js` with the data-domain attribute set to `voiceofrepentance.com`. Define custom events for the moments that matter: survey-question-answered, survey-submitted, book-amazon-clicked, selah-access-requested, contact-submitted, blog-post-read-to-end. The events are added with `plausible('event-name')` calls in the existing form-submit handlers and an IntersectionObserver tied to a sentinel near the bottom of `PostLayout.astro` for read-to-end.

Also add UTM-aware logic: the form-submit handlers should include `document.referrer` and any UTM query params in the payload sent to `/api/vor/contact`, so source attribution survives into the CRM.

### 1.2 Wire up the email list

Once Beehiiv (or chosen alternative) is set up, do three integrations:

1. **Survey post-submit.** When the user submits the email at the end of `/am-i-saved`, alongside the existing POST to `app.voiceofrepentance.com/api/vor/contact`, also subscribe them to the list with a `survey-taker` tag. The existing custom email assessment continues — Beehiiv is not the delivery mechanism for that, just the long-term list home.
2. **Footer / blog newsletter capture.** A small inline subscribe form ("get new posts and ministry notes by email") in the site footer, and optionally a less-intrusive variant at the bottom of `PostLayout.astro`. Submissions tagged `blog-subscriber`.
3. **Book waitlist.** Replace the current `/book` "Get Notified of New Releases" link to `/contact` with a dedicated inline form submitting to a `book-waitlist` tag. This is a meaningful change — the current setup loses the source signal in the general contact stream.

Everything should keep going through the Ezra backend as well; Beehiiv is additive, not a replacement. That preserves Telegram notifications and the CRM record.

### 1.3 Close the funnel handoffs

Three concrete edits, in priority order:

**Survey success state ([src/pages/am-i-saved.astro:184-223](src/pages/am-i-saved.astro#L184-L223)).** After "Your assessment is on its way," add a "Continue your journey" section with two cards: one to `/book` ("Read the deeper framework — Journey2Health") and one to `/selah` ("Talk to Selah, the pastoral assistant"). Replace the current "Take It Again" with these. Keep "Back to Voice of Repentance" as a tertiary link.

**Blog post CTAs ([src/layouts/PostLayout.astro:100](src/layouts/PostLayout.astro#L100)).** Insert a "Go deeper" block immediately before the related-posts grid. Two variants based on tag: posts tagged with theology/repentance/salvation topics get a survey CTA ("Take the eight-question assessment"); music-tagged posts already get filtered out, but story/narrative posts get a book CTA. Keep the block visually distinct from the related-posts grid so it reads as an action, not more content.

**Book page email capture ([src/pages/book.astro:286-293](src/pages/book.astro#L286-L293)).** Replace the "Get Notified" link-to-contact with an inline form (name + email, single submit), submitting to the book-waitlist tag. The Amazon CTA remains primary; the email capture is the secondary path for visitors not ready to buy.

## Phase 2 — Performance and Crawl Quality (High)

### 2.1 Image optimization sweep

Run a one-time conversion pass over `public/images/`. Roughly:

- Hero (`public/images/site/wheat-field-main-hero.png`, 2.1MB) → JPEG at quality ~82, target under 250KB.
- Music covers (`public/images/music/*.png`, 1.3-2.0MB each) → JPEG, target under 200KB each.
- Blog covers (`public/images/blog/*.png`, 1.6-2.4MB each) → JPEG, target under 250KB each.
- OG-only variants where useful: a 1200×630 crop for social previews on `/book`, `/selah`, `/survey`, `/about`, distinct from the page hero.

The single existing JPEG (`public/images/book/Cover4.jpg` at 332KB) shows the workflow already exists — this is just running it across the rest of the directory.

### 2.2 Migrate to Astro `<Image>` component

Replace the manual `<img>` tags in:
- [src/components/Hero.astro:18](src/components/Hero.astro#L18)
- [src/components/PostCard.astro:29](src/components/PostCard.astro#L29)
- [src/layouts/PostLayout.astro:87](src/layouts/PostLayout.astro#L87)

with `import { Image } from 'astro:assets'`. This automatically gives format conversion (AVIF/WebP fallbacks), explicit width/height (kills CLS), and lazy loading on below-fold images. Hero stays eager. This single change addresses the "missing dimensions" finding and the format-conversion finding together.

### 2.3 Secondary performance items

- Add `<link rel="preload">` for DM Sans 700 in [src/layouts/BaseLayout.astro:58-63](src/layouts/BaseLayout.astro#L58-L63) for faster LCP.
- Create [src/pages/404.astro](src/pages/404.astro) using the existing layout, with primary navigation and a survey/book CTA. Paid traffic and shared links produce dead links; a branded 404 recovers some.
- Tag pages [src/pages/blog/tags/[tag].astro:26](src/pages/blog/tags/%5Btag%5D.astro#L26) need a `description` prop passed to BaseLayout — something like "Posts on {tag} from Voice of Repentance" with the tag interpolated. This is a 5-minute fix that closes a meaningful crawl gap.

## Phase 3 — Discoverability and Social Mechanics (High)

### 3.1 JSON-LD structured data

Add JSON-LD blocks via BaseLayout (gated by an optional `schema` prop) so each page can supply its own structured data. Specifically:

- **Blog posts:** `BlogPosting` with headline, author (Person — Troy Sybert), datePublished, image, description.
- **Homepage:** `Person` schema for Troy with sameAs links to YouTube and Facebook.
- **`/book`:** `Book` schema with author, isbn (if available), publisher (self), bookFormat.
- **`/listen/[slug]`:** `MusicRecording` schema with name, byArtist, duration, url.
- **`/about`:** Same `Person` schema as homepage, can be reused.

The implementation is one shared partial (`src/components/SchemaJsonLd.astro`) that takes a schema object and emits a `<script type="application/ld+json">` block. Pages pass the relevant object.

### 3.2 Social sharing

Add a small share component (`src/components/ShareButtons.astro`) — Twitter/X, Facebook, copy-link, optionally LinkedIn. Render it in `PostLayout.astro` near the post header and again at the bottom. Render it on `/listen/[slug]` pages too. Keep the styling minimal — gold icon links, no third-party SDKs, just plain anchor tags with the canonical share URL patterns.

### 3.3 Differentiated OG images

Once the image sweep in 2.1 is done, generate dedicated 1200×630 OG variants for `/book`, `/survey` (`/am-i-saved`), `/selah`, `/about`, and the homepage. Each should have on-brand typography and a clear subject. The current shared wheat-field hero works as a fallback but undersells distinct landing pages on social.

### 3.4 Trust signals

Add a photo of Troy (single portrait, ideally outdoor / natural) to:
- The author bio block on `/book` (currently text-only at lines 223-243).
- The about page narrative.
- The Selah page near the origin story.

Trust signals on a ministry site are not optional under paid traffic. Visitors are evaluating whether to give email + attention to a stranger.

## Phase 4 — Polish (Medium)

### 4.1 Color contrast

Gold (`#A8863E`) on cream (`#FAF7F2`) measures ~3.5:1, failing WCAG AA. Two paths:

- **Darken the gold** to ~`#7A5C1F` for text/CTA use, keep the brighter gold for decorative accents only. Define `vor-gold-text` as a separate token in `tailwind.config.mjs` so the brand visual doesn't shift everywhere.
- **Lighten the cream** very slightly and accept that some gold-on-cream combinations remain decorative-only.

The first is cleaner. Tag chips, button text, and link colors are the high-traffic uses.

### 4.2 Skip-to-content link

Add a visually-hidden-until-focus skip link as the first child of `<body>` in BaseLayout, jumping to a `#main` id placed on the main content wrapper of each page. Standard a11y pattern, ~10 lines.

### 4.3 Twitter creator meta

Once any active Troy / VOR Twitter or X handle is determined, add `<meta name="twitter:creator" content="@handle">` to BaseLayout. Do not invent a handle.

### 4.4 Homepage CTA hierarchy

The homepage currently presents survey, blog carousel, music carousel, book teaser, story teaser, about teaser as roughly co-equal. For paid traffic, restructure the post-hero region into:

- **Primary action band** immediately under the hero: survey + book + Selah as three clear cards.
- **Content discovery** below: blog carousel, music carousel.
- **Identity** at the bottom: about teaser, story teaser.

This is content-only restructuring of [src/pages/index.astro](src/pages/index.astro); no new components needed.

### 4.5 Footer additions

If Twitter/X and Instagram accounts exist or get created, add them to the footer alongside Facebook and YouTube in `src/layouts/BaseLayout.astro` (or the dedicated Footer component if one exists).

## Sequencing and Rough Effort

Phase 1 is gated on the two vendor decisions but the work itself is small once decided — analytics is an afternoon, email list integration is a day across the three insertion points, funnel handoffs are a half-day. Total: ~2 days of focused work after decisions.

Phase 2 is the biggest single time investment because of the image sweep and Astro `<Image>` migration, but most of it is mechanical. ~1.5 days.

Phase 3 is structured-data design + share component + OG image creation. JSON-LD is ~half a day, share buttons a few hours, OG variants depend on whether you generate them in design software or commission them. ~1 day excluding OG image production.

Phase 4 is polish; ~half a day total spread across the items.

**Whole program in implementation time: ~5 working days, plus content/design time for OG images and the Troy portrait.**

## Success Metrics

Once Phase 1 is live, the following baselines should be captured in the first two weeks before any aggressive marketing begins:

- Survey funnel: visitors to `/am-i-saved` → Q1 answered → Q8 reached → email submitted. Target funnel completion ratio is unknown until baselined; the goal of instrumenting is to know.
- Blog read-through: percentage of visitors who hit the read-to-end sentinel on a post.
- Book page: visitors → Amazon click rate, visitors → waitlist email submissions.
- List growth: new subscribers per week, segmented by source tag.
- Page weight: LCP on mobile (Cloudflare Pages analytics or Plausible script if it exposes it). Target sub-2.5s on a fast 3G simulation.

After two weeks of baseline, the marketing push can start, and the same metrics become the dashboard for spend efficiency.

## Out of Scope for This PRD

- A blog post production cadence or editorial calendar (separate problem).
- Paid ad creative, copy, targeting (separate problem).
- Affiliate / referral program for the book.
- Membership or paid tier features.
- Multilingual support.
- A/B testing infrastructure (deferrable until there is enough traffic for tests to be meaningful).
- Replacing the Ezra `/api/vor/contact` backend. The new email-list integration is additive; the backend continues to handle Telegram notifications and CRM records.

## Open Questions

1. Are there existing Troy / VOR accounts on Twitter/X or Instagram that should be linked, or do new ones need to be created as part of this push?
2. Is there a preferred image source for the Troy portrait, or does this need a fresh photo session?
3. What is the rough budget ceiling per month for analytics + email tooling? (Plausible $9 + Beehiiv free-tier-then-$39 is roughly the assumed shape.)
4. Are there existing testimonials or endorsements for the book / Selah / ministry that can be surfaced as trust signals, or does that content need to be solicited?
5. Is the goal to publish a regular email cadence (weekly devotional, monthly update) or strictly transactional (book launches, survey follow-up)? This shapes how much automation work goes into the email setup.
