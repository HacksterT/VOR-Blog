// Resolves the `paths` collection into the shape every page needs.
// Reading time is summed from the real post bodies at build time -- never hand-entered.
import { getCollection } from 'astro:content';
import { readingTime } from '../utils/readingTime';

export interface Turn {
  week: number;
  href: string;
  title: string;
  description: string;
  subtitle: string;
  coverImage: string;
  minutes: number;
  /** True when the turn is a page (e.g. /am-i-saved) rather than a blog post. */
  isPage: boolean;
  /** Post id, for cross-referencing. Empty for page turns. */
  postId: string;
  date: Date | null;
}

export interface SundaySit {
  href: string;
  title: string;
  coverImage: string;
}

export interface ResolvedPath {
  id: string;
  href: string;
  number: string;
  title: string;
  forWhom: string;
  coverImage: string;
  weeks: number;
  minutes: number;
  turns: Turn[];
  sundaySit: SundaySit | null;
}

export interface PathNav {
  number: string;
  title: string;
  href: string;
  week: number;
  total: number;
  next: { href: string; title: string; week: number } | null;
  /** Other paths this same turn appears in. */
  alsoIn: { number: string; title: string; href: string }[];
}

export async function getResolvedPaths(): Promise<ResolvedPath[]> {
  const pathEntries = await getCollection('paths', ({ data }) => !data.draft);
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const byId = new Map(posts.map((p) => [p.id, p]));

  return pathEntries
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => {
      const turns: Turn[] = entry.data.turns.map((postId, i) => {
        const post = byId.get(postId);
        if (!post) {
          throw new Error(
            'Path "' + entry.id + '" lists turn "' + postId +
            '", which is not a published post in src/content/blog. ' +
            'Fix the id or unset draft on the post.'
          );
        }
        return {
          week: i + 1,
          href: '/blog/' + post.id,
          title: post.data.title,
          description: post.data.description,
          subtitle: post.data.subtitle ?? '',
          coverImage: post.data.coverImage ?? '',
          minutes: readingTime(post.body ?? ''),
          isPage: false,
          postId: post.id,
          date: post.data.date,
        };
      });

      const final = entry.data.finalTurn;
      if (final) {
        turns.push({
          week: turns.length + 1,
          href: final.href,
          title: final.title,
          description: final.note,
          subtitle: '',
          coverImage: '',
          minutes: final.minutes,
          isPage: true,
          postId: '',
          date: null,
        });
      }

      let sit: SundaySit | null = null;
      if (entry.data.sundaySit) {
        const song = byId.get(entry.data.sundaySit);
        if (song) {
          sit = {
            href: '/blog/' + song.id,
            title: song.data.title,
            coverImage: song.data.coverImage ?? '',
          };
        }
      }

      return {
        id: entry.id,
        href: '/paths/' + entry.id,
        number: entry.data.number,
        title: entry.data.title,
        forWhom: entry.data.forWhom,
        coverImage: entry.data.coverImage ?? '',
        weeks: turns.length,
        minutes: turns.reduce((n, t) => n + t.minutes, 0),
        turns,
        sundaySit: sit,
      };
    });
}

/** Post id -> its furniture on the post page. A post in two paths gets the lower-numbered one. */
export async function getPathNavIndex(): Promise<Map<string, PathNav>> {
  const paths = await getResolvedPaths();
  const membership = new Map<string, { path: ResolvedPath; turn: Turn }[]>();

  for (const path of paths) {
    for (const turn of path.turns) {
      if (turn.isPage) continue;
      const list = membership.get(turn.postId) ?? [];
      list.push({ path, turn });
      membership.set(turn.postId, list);
    }
  }

  const index = new Map<string, PathNav>();
  for (const [postId, list] of membership) {
    const primary = list[0];
    const nextTurn = primary.path.turns[primary.turn.week] ?? null;
    index.set(postId, {
      number: primary.path.number,
      title: primary.path.title,
      href: primary.path.href,
      week: primary.turn.week,
      total: primary.path.weeks,
      next: nextTurn
        ? { href: nextTurn.href, title: nextTurn.title, week: nextTurn.week }
        : null,
      alsoIn: list.slice(1).map((m) => ({
        number: m.path.number,
        title: m.path.title,
        href: m.path.href,
      })),
    });
  }
  return index;
}

/** The most recently dated turn across all paths -- what /this-week points at. */
export async function getCurrentTurn(): Promise<{ turn: Turn; path: ResolvedPath } | null> {
  const paths = await getResolvedPaths();
  let best: { turn: Turn; path: ResolvedPath } | null = null;
  for (const path of paths) {
    for (const turn of path.turns) {
      if (!turn.date) continue;
      if (!best || turn.date.getTime() > (best.turn.date as Date).getTime()) {
        best = { turn, path };
      }
    }
  }
  return best;
}

/** The four choices offered on the signup form. Values match the Beehiiv `path` custom field. */
export const WALK_OPTIONS = [
  { value: 'rules-cage', label: 'Path 01 — When the rules feel like a cage' },
  { value: 'same-thing-again', label: 'Path 02 — Same thing, again' },
  { value: 'not-sure-it-took', label: "Path 03 — When you're not sure it ever took" },
  { value: 'look-away', label: 'Path 04 — When the culture asks you to look away' },
  { value: 'riding-along', label: 'Riding along — whatever comes out that week' },
];
