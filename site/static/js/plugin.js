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
          sans: ['Inter', 'sans-serif'],
          body: ['Inter', 'sans-serif'],
          mono: ['ui-monospace', 'monospace'],
        },
        keyframes: {
          'spinner-grow': {
            '0%': {
              transform: 'scale(0)',
            },
            '50%': {
              transform: 'none',
              opacity: '1',
            },
          },
        },
      },
    },
  }
);
