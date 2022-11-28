module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.html', './static/**/*.js'],
  theme: {
    extend: {
      animation:{
        'grow': 'spinnerGrow 0.75s linear infinite',
        'grow-slow':'spinnerGrow 1.5s linear infinite',
        'spin-slow':'spin 1.5s linear infinite',
      },
      keyframes:{
        spinnerGrow:{
          '0%':{transform: 'scale(0)'},
          '50%':{transform: 'none', opacity: '1'},
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar'), require('./static/js/plugin')],
};
