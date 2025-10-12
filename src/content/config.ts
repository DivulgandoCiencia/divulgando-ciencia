// 1. Import utilities from `astro:content`
import { z, reference, defineCollection } from 'astro:content';

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string().optional(),
    email: z.string().email().optional(),
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
  type: 'content',
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


// 3. Export a single `collections` object to register your collection(s)
export const collections = { articles, authors };