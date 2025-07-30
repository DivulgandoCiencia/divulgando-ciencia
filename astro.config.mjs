import { defineConfig } from 'astro/config';

import image from '@astrojs/image';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), mdx(), image()],

  markdown: {
    syntaxHighlight: false,
  },

  image: {
    service: image.sharpService(),
  },

  adapter: vercel(),
});