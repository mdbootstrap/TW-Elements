const plugin = require('tailwindcss/plugin');
const bsStyles = require('./bs-styles');

module.exports = plugin(({ addBase }) => {
  addBase(bsStyles);
}, {});
