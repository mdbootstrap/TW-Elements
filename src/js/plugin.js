const plugin = require("tailwindcss/plugin");

module.exports = plugin(() => {}, {
  theme: {
    extend: {
      screens: {
        xs: "320px",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        body: ["Roboto", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "fade-in-down": {
          "0%": {
            opacity: 0,
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: 0,
            transform: "translate3d(-100%, 0, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-in-right": {
          "0%": {
            opacity: 0,
            transform: "translate3d(100%, 0, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: 0,
            transform: "translate3d(0, 100%, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
        "fade-out-down": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
            transform: "translate3d(0, 100%, 0)",
          },
        },
        "fade-out-left": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
            transform: "translate3d(-100%, 0, 0)",
          },
        },
        "fade-out-right": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
            transform: "translate3d(100%, 0, 0)",
          },
        },
        "fade-out-up": {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
            transform: "translate3d(0, -100%, 0)",
          },
        },
        "slide-in-down": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(0, -100%, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "slide-in-left": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(-100%, 0, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "slide-in-right": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(100%, 0, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "slide-in-up": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(0, 100%, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "slide-out-down": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(0, 100%, 0)",
          },
        },
        "slide-out-left": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(-100%, 0, 0)",
          },
        },
        "slide-out-right": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(100%, 0, 0)",
          },
        },
        "slide-out-up": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            visibility: "hidden",
            transform: "translate3d(0, -100%, 0)",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            transform: "translate3d(0, 100%, 0)",
          },
        },
        "slide-left": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            transform: "translate3d(-100%, 0, 0)",
          },
        },
        "slide-right": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            transform: "translate3d(100%, 0, 0)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            transform: "translate3d(0, -100%, 0)",
          },
        },
        "zoom-in": {
          "0%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3)",
          },
          "50%": {
            opacity: 1,
          },
        },
        "zoom-out": {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0,
            transform: "scale3d(0.3, 0.3, 0.3)",
          },
          "100%": {
            opacity: 0,
          },
        },
        tada: {
          "0%": {
            transform: "scale3d(1, 1, 1)",
          },
          "10%, 20%": {
            transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)",
          },
          "30%, 50%, 70%, 90%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",
          },
          "40%, 60%, 80%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",
          },
          "100%": {
            transform: "scale3d(1, 1, 1)",
          },
        },
        "spinner-grow": {
          "0%": {
            transform: "scale(0)",
          },
          "50%": {
            transform: "none",
            opacity: "1",
          },
        },
        "placeholder-wave": {
          "100%": { maskPosition: "-200% 0%" },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#3B71CA",
          50: "#F1F5FB",
          100: "#E3EBF7",
          200: "#B9CCEC",
          300: "#9DB8E4",
          400: "#81A4DC",
          500: "#6590D5",
          600: "#3061AF",
          700: "#285192",
          800: "#204075",
          900: "#183058",
        },
        secondary: {
          DEFAULT: "#9FA6B2",
          50: "#F8F9F9",
          100: "#F1F2F4",
          200: "#DDDFE3",
          300: "#CFD2D8",
          400: "#C1C6CD",
          500: "#B3B9C2",
          600: "#848D9C",
          700: "#6B7585",
          800: "#565D6B",
          900: "#404650",
        },
        success: {
          DEFAULT: "#14A44D",
          50: "#EAFCF2",
          100: "#D6FAE4",
          200: "#97F2BC",
          300: "#6EEDA1",
          400: "#44E886",
          500: "#1CE26B",
          600: "#118C42",
          700: "#0E7537",
          800: "#0C5D2C",
          900: "#094621",
        },
        danger: {
          DEFAULT: "#DC4C64",
          50: "#FCF2F4",
          100: "#FAE5E9",
          200: "#F2BFC8",
          300: "#EDA6B2",
          400: "#E88C9B",
          500: "#E37285",
          600: "#D42A46",
          700: "#B0233A",
          800: "#8D1C2F",
          900: "#6A1523",
        },
        warning: {
          DEFAULT: "#E4A11B",
          50: "#FDF8EF",
          100: "#FBF2DE",
          200: "#F5DDAD",
          300: "#F2D08D",
          400: "#EEC36C",
          500: "#EAB54C",
          600: "#C48A17",
          700: "#A37313",
          800: "#825C0F",
          900: "#62450B",
        },
        info: {
          DEFAULT: "#54B4D3",
          50: "#F3FAFC",
          100: "#E7F4F9",
          200: "#C2E4EF",
          300: "#AAD9E9",
          400: "#92CEE3",
          500: "#79C4DC",
          600: "#34A4CA",
          700: "#2B89A8",
          800: "#236D86",
          900: "#1A5265",
        },
      },
    },
  },
});
