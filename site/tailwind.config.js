module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.html",
    "./static/**/*.js",
    "../src/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar"), require("./static/js/plugin")],
  darkMode: "class",
};
