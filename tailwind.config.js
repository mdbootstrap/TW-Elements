module.exports = {
  content: ['./demo/**/*.{html,js}', './src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [require('./src/js/plugin')],
};
