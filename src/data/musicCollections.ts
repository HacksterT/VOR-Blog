/**
 * Song collections, mirroring the playlists on the YouTube channel.
 * Generated from the channel on 2026-08-03. A song can sit in several.
 * `slugs` are blog post ids in src/content/blog.
 */
export interface MusicCollection {
  slug: string;
  title: string;
  blurb: string;
  playlistUrl: string;
  slugs: string[];
}

export const MUSIC_COLLECTIONS: MusicCollection[] = [
  {
    slug: 'grace-in-the-grit',
    title: "Grace in the Grit",
    blurb: "Country-soul songs forged in real trouble. The title track and the company it keeps.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4eLMwReLuDnpvf4C4kYuhM4',
    slugs: [
      'town-called-nowhere-gritty-acoustic-alt-country-song-about-redemption',
      'like-father-like-son',
      'i-need-you-still',
      'fighting-shadows',
      'the-kingdoms-alive',
      'outstretched-hands',
      'grace-in-the-grit',
      'it-aint-just-sunday',
      'kickin-dust-with-jesus',
    ],
  },
  {
    slug: 'hope-and-healing',
    title: "Hope & Healing",
    blurb: "The quieter end of the catalog. For a week that went badly.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4cha58xKwlM_2XtSCIbj6o7',
    slugs: [
      'town-called-nowhere-gritty-acoustic-alt-country-song-about-redemption',
      'break-me-remake-me',
      'youre-still-holding-on',
      'like-father-like-son',
      'the-king-is-here',
      'your-light-my-path',
      'boundless-love',
      'fighting-shadows',
      'outstretched-hands',
      'strings-for-the-soul',
      'grace-in-the-grit',
      'ode-to-psalms-146',
      'surrender-to-love',
    ],
  },
  {
    slug: 'worship-anthems',
    title: "Worship Anthems",
    blurb: "Written for a room singing together rather than for headphones.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4f5tye34otyBaJm4_gACQL9',
    slugs: [
      'break-me-remake-me-live',
      'break-me-remake-me',
      'youre-still-holding-on',
      'the-king-is-here',
      'his-grace-calls',
      'your-light-my-path',
      'boundless-love',
      'ode-to-psalms-146',
      'you-found-me',
      'jesus-forever',
      'ode-to-psalms-40',
    ],
  },
  {
    slug: 'echoes-of-psalms',
    title: "Echoes of Psalms",
    blurb: "The Psalms set to music, mostly straight, mostly unadorned.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4dyPfDHZDHn5dbT6f_QBu9R',
    slugs: [
      'break-me-remake-me',
      'your-light-my-path',
      'ode-to-psalms-146',
      'ode-to-psalms-91',
      'ode-to-psalms-40',
    ],
  },
  {
    slug: 'just-plain-fun',
    title: "Just Plain Fun",
    blurb: "High energy and no apology for it.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4coIP2qf62dpaM4lARcCINo',
    slugs: [
      'break-me-remake-me-live',
      'hes-my-champion',
      'guiding-light',
      'his-grace-calls',
      'love-found-me-first',
      'kickin-dust-with-jesus',
      'i-rise-again',
      'ode-to-psalms-91',
    ],
  },
  {
    slug: 'rock-of-ages',
    title: "Rock of Ages",
    blurb: "The loud ones.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4c0A4R4xwUwuIHwG0a4U3mE',
    slugs: [
      'hes-my-champion',
      'his-grace-calls',
    ],
  },
  {
    slug: 'stories-behind-the-song',
    title: "Stories Behind the Song",
    blurb: "The song, and the story that produced it, in one sitting.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4ffosCmsJpMnNOCMOuQWQzU',
    slugs: [
      'intro-i-need-you-still',
      'intro-fighting-shadows',
    ],
  },
  {
    slug: 'instrumentals',
    title: "Instrumentals for the Soul",
    blurb: "No words. Put it on and leave it on.",
    playlistUrl: 'https://www.youtube.com/playlist?list=PLtWPgg-tQT4e-5HL_58Sa5HAGIKG9nxiY',
    slugs: [
      'strings-for-the-soul',
    ],
  },
];

/** Collection slugs a given post belongs to. */
export function collectionsFor(postId: string): string[] {
  return MUSIC_COLLECTIONS.filter((c) => c.slugs.includes(postId)).map((c) => c.slug);
}

/**
 * Songs with a hand-authored landing page under src/pages/listen.
 * These are not generated from the content collection, so the mapping is
 * explicit. A song with no entry links to its blog post instead.
 */
export const LISTEN_PAGES: Record<string, string> = {
  'town-called-nowhere-gritty-acoustic-alt-country-song-about-redemption':
    '/listen/town-called-nowhere',
};

/** Where a song should link: its listen page if it has one, else its post. */
export function songHref(postId: string): string {
  return LISTEN_PAGES[postId] ?? '/blog/' + postId;
}

/**
 * The song's name without the trailing genre and theme keywords.
 * Titles are keyword-stacked for YouTube discovery, which is right there and
 * wrong in a headline. "Town Called Nowhere | Gritty Acoustic Alt-Country
 * Song About Redemption" becomes "Town Called Nowhere".
 */
export function songName(title: string): string {
  return title.split('|')[0].split('/')[0].trim();
}
