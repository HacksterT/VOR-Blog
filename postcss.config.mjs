import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Tailwind 3 stays on the PostCSS plugin. @astrojs/tailwind@6 only peers Astro 3–5.
export default {
  plugins: [tailwindcss(), autoprefixer()],
};
