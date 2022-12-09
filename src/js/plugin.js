const plugin = require('tailwindcss/plugin');
const bsComponents = require('./bs-styles');

module.exports = plugin(
  ({ addComponents }) => {
    addComponents(bsComponents);
  },
  {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Roboto', 'sans-serif'],
          body: ['Roboto', 'sans-serif'],
          mono: ['ui-monospace', 'monospace'],
        },
        screens: {
          xs: '320px',
        },
        keyframes: {
          'fade-in-frame': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          'fade-out-frame': {
            '0%': { opacity: 1 },
            '100%': { opacity: 0 },
          },
        },
      },
    },
  }
);
