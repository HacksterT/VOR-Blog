/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vor: {
          cream: '#FAF7F2',
          warm: '#F5F0E8',
          sand: '#E8E0D0',
          gold: '#C8A45E',
          'gold-dark': '#A8863E',
          charcoal: '#2C2C2C',
          'charcoal-light': '#4A4A4A',
          muted: '#7A7A7A',
        },
      },
      fontFamily: {
        heading: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: theme('colors.vor.charcoal'),
            a: {
              color: theme('colors.vor.gold-dark'),
              '&:hover': {
                color: theme('colors.vor.gold'),
              },
            },
            h1: { fontFamily: theme('fontFamily.heading').join(', ') },
            h2: { fontFamily: theme('fontFamily.heading').join(', ') },
            h3: { fontFamily: theme('fontFamily.heading').join(', ') },
            h4: { fontFamily: theme('fontFamily.heading').join(', ') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
