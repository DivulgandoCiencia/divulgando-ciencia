import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'server',
  integrations: [mdx()],

  markdown: {
    syntaxHighlight: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
  
  adapter: vercel(),
});