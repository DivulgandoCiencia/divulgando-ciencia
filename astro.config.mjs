import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel';
import node from '@astrojs/node'
import mdx from '@astrojs/mdx';

let adapter = vercel();

if (process.argv[3] === "--node" || process.argv[4] === "--node") {
  adapter = node({ mode: "standalone" });
}

export default defineConfig({
  output: 'server',
  integrations: [tailwind(), mdx()],

  markdown: {
    syntaxHighlight: false,
  },

  adapter: adapter,
});