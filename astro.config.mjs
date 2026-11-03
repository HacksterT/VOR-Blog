import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.voiceofrepentance.com',
  output: 'static',
  // Astro 7 defaults compressHTML to "jsx", which drops whitespace differently.
  // true keeps the HTML-aware compression used through Astro 6.
  compressHTML: true,
  integrations: [sitemap()],
});
