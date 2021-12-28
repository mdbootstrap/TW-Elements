const plugin = require('tailwindcss/plugin');
const bsStyles = require('./bsStyles');

module.exports = plugin(({ addBase }) => {
  addBase(bsStyles);
}, {});
