module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.html', './static/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar'), require('./static/js/plugin')],
};
