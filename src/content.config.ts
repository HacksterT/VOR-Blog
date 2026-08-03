import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    subtitle: z.string().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
    /** Shared label for multi-part series (e.g. "Pronouns"). Posts with the same value are linked in seriesPart order. */
    series: z.string().optional(),
    /** 1-based part number within the series. */
    seriesPart: z.number().int().positive().optional(),
  }),
});

const story = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/story' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    chapter: z.number(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * A path is an ordered walk of 3-5 turns, named after a struggle.
 * The file id IS the slug (rules-cage.md -> /paths/rules-cage).
 * The markdown BODY is the path-intro prose (~150 words) -- see docs/redesign-paths.md Gap C.
 */
const paths = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paths' }),
  schema: z.object({
    title: z.string(),
    /** Display numeral, kept as a string so the leading zero survives. */
    number: z.string(),
    /** Display order on the homepage and /paths. */
    order: z.number(),
    /** One sentence, first person, in the visitor's own voice. */
    forWhom: z.string(),
    coverImage: z.string().optional(),
    /** Blog post ids, in week order. A missing id fails the build on purpose. */
    turns: z.array(z.string()),
    /** A final turn that is a page rather than a post (e.g. /am-i-saved). */
    finalTurn: z
      .object({
        href: z.string(),
        title: z.string(),
        note: z.string().default(''),
        minutes: z.number().default(10),
      })
      .optional(),
    /**
     * Music post ids, one per week, in the same order as the weeks.
     * The rhythm is a turn on Wednesday and a sit on Sunday, so the length
     * must equal the number of weeks (turns plus any finalTurn). A short or
     * long list fails the build on purpose -- see src/lib/paths.ts.
     */
    sundaySits: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, story, paths };
