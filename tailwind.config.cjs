/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./demo/**/*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("./src/js/plugin.cjs")],
  darkMode: "class",
};
