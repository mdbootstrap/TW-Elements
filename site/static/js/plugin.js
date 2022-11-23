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
      },
    },
  }
);
