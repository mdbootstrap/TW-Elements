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
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          fadeInDown: {
            '0%': {
              opacity: 0,
              transform: 'translate3d(0, -100%, 0)',
            },
            '100%': {
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            },
          },
          fadeInLeft: {
            '0%': {
              opacity: 0,
              transform: 'translate3d(-100%, 0, 0)',
            },
            '100%': {
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            },
          },
          fadeInRight: {
            '0%': {
              opacity: 0,
              transform: 'translate3d(100%, 0, 0)',
            },
            '100%': {
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            },
          },
          fadeInUp: {
            '0%': {
              opacity: 0,
              transform: 'translate3d(0, 100%, 0)',
            },
            '100%': {
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
            },
          },
          fadeOutDown: {
            '0%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0,
              transform: 'translate3d(0, 100%, 0)',
            },
          },
          fadeOutLeft: {
            '0%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0,
              transform: 'translate3d(-100%, 0, 0)',
            },
          },
          fadeOutRight: {
            '0%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0,
              transform: 'translate3d(100%, 0, 0)',
            },
          },
          fadeOutUp: {
            '0%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0,
              transform: 'translate3d(0, -100%, 0)',
            },
          },
          slideInDown: {
            '0%': {
              visibility: 'visible',
              transform: 'translate3d(0, -100%, 0)',
            },
            '100%': {
              transform: 'translate3d(0, 0, 0)',
            },
          },
          slideInLeft: {
            '0%': {
              visibility: 'visible',
              transform: 'translate3d(-100%, 0, 0)',
            },
            '100%': {
              transform: 'translate3d(0, 0, 0)',
            },
          },
          slideInRight: {
            '0%': {
              visibility: 'visible',
              transform: 'translate3d(100%, 0, 0)',
            },
            '100%': {
              transform: 'translate3d(0, 0, 0)',
            },
          },
          slideInUp: {
            '0%': {
              visibility: 'visible',
              transform: 'translate3d(0, 100%, 0)',
            },
            '100%': {
              transform: 'translate3d(0, 0, 0)',
            },
          },
          slideOutDown: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              visibility: 'hidden',
              transform: 'translate3d(0, 100%, 0)',
            },
          },
          slideOutLeft: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              visibility: 'hidden',
              transform: 'translate3d(-100%, 0, 0)',
            },
          },
          slideOutRight: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              visibility: 'hidden',
              transform: 'translate3d(100%, 0, 0)',
            },
          },
          slideOutUp: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              visibility: 'hidden',
              transform: 'translate3d(0, -100%, 0)',
            },
          },
          slideDown: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              transform: 'translate3d(0, 100%, 0)',
            },
          },
          slideLeft: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              transform: 'translate3d(-100%, 0, 0)',
            },
          },
          slideRight: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              transform: 'translate3d(100%, 0, 0)',
            },
          },
          slideUp: {
            '0%': {
              transform: 'translate3d(0, 0, 0)',
            },
            '100%': {
              transform: 'translate3d(0, -100%, 0)',
            },
          },
          zoomIn: {
            '0%': {
              opacity: 0,
              transform: 'scale3d(0.3, 0.3, 0.3)',
            },
            '50%': {
              opacity: 1,
            },
          },
          zoomOut: {
            '0%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0,
              transform: 'scale3d(0.3, 0.3, 0.3)',
            },
            '100%': {
              opacity: 0,
            },
          },
          tada: {
            '0%': {
              transform: 'scale3d(1, 1, 1)',
            },
            '10%, 20%': {
              transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)',
            },
            '30%, 50%, 70%, 90%': {
              transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',
            },
            '40%, 60%, 80%': {
              transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)',
            },
            '100%': {
              transform: 'scale3d(1, 1, 1)',
            },
          },
          pulse: {
            '0%': {
              transform: 'scale3d(1, 1, 1)',
            },
            '50%': {
              transform: 'scale3d(1.05, 1.05, 1.05)',
            },
            '100%': {
              transform: 'scale3d(1, 1, 1)',
            },
          },
        },
      },
    },
  }
);
