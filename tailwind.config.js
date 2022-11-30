module.exports = {
  content: ['./demo/**/*.{html,js}', './src/**/*.{html,js}'],
  theme: {
    extend: {
      keyframes: {
        placeholderGlow: {
          '50%': { opacity: '0.2' },
        },
        placeholderWave: {
          '100%': { maskPosition: '-200% 0%' },
        },
      },
    },
  },
  plugins: [require('./src/js/plugin')],
  // darkMode: 'class',
};
