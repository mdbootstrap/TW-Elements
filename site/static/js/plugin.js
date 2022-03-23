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
      },
    },
  }
);
