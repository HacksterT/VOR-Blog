/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './themes/gruvbox/layouts/**/*.html'
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            fontSize: '1.125rem',  // Increase base font size
            p: {
              fontSize: '1.125rem', // Ensure paragraphs use the larger size
            },
            a: {
              color: 'var(--color-primary)',
              '&:hover': {
                color: 'var(--color-secondary)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
