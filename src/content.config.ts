import { reference, defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    email: z.email().optional(),
    social_media: z.object({
      x: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      tiktok: z.string().optional(),
      github: z.string().optional()
    }).optional(),
  })
});

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    altImage: z.string(),
    authors: z.array(reference('authors')).optional(),
    author: reference('authors').optional(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    readTime: z.number().optional(),
    references: z.array(z.object({
      title: z.string(),
      authors: z.string(),
      journal: z.string(),
      year: z.string(),
      doi: z.string(),
    })).optional(),
  }),
});

export const collections = { articles, authors };