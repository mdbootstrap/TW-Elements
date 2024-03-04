const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");
const { spacing, borderRadius } = defaultTheme;

module.exports = plugin(
  ({ addBase, theme }) => {
    addBase({
      [['input[type="range"]::-webkit-slider-thumb']]: {
        height: spacing[4],
        width: spacing[4],
        background: theme("colors.primary.DEFAULT"),
        "border-radius": borderRadius.full,
        border: 0,
        appearance: "none",
        "-moz-appearance": "none",
        "-webkit-appearance": "none",
        cursor: "pointer",
      },
      [['.dark input[type="range"]::-webkit-slider-thumb']]: {
        background: theme("colors.primary.400"),
      },
      [['input[type="range"]:disabled::-webkit-slider-thumb']]: {
        background: theme("colors.neutral.400"),
      },
      [['input[type="range"]:disabled:focus::-webkit-slider-thumb']]: {
        background: theme("colors.neutral.400"),
      },
      [['input[type="range"]:disabled:active::-webkit-slider-thumb']]: {
        background: theme("colors.neutral.400"),
      },
      [['.dark input[type="range"]:disabled::-webkit-slider-thumb']]: {
        background: theme("colors.neutral.500"),
      },
      [['.dark input[type="range"]:disabled:focus::-webkit-slider-thumb']]: {
        background: theme("colors.neutral.500"),
      },
      [['.dark input[type="range"]:disabled:active::-webkit-slider-thumb']]: {
        background: theme("colors.neutral.500"),
      },
      [['input[type="range"]::-moz-range-thumb']]: {
        height: spacing[4],
        width: spacing[4],
        background: theme("colors.primary.DEFAULT"),
        "border-radius": borderRadius.full,
        border: 0,
        appearance: "none",
        "-moz-appearance": "none",
        "-webkit-appearance": "none",
        cursor: "pointer",
      },
      [['.dark input[type="range"]::-moz-range-thumb']]: {
        background: theme("colors.primary.400"),
      },
      [['input[type="range"]:disabled::-moz-range-thumb']]: {
        background: theme("colors.neutral.400"),
      },
      [['.dark input[type="range"]:disabled::-moz-range-thumb']]: {
        background: theme("colors.neutral.500"),
      },
      [['input[type="range"]::-moz-range-progress']]: {
        background: theme("colors.primary.600"),
      },
      [['input[type="range"]::-ms-fill-lower']]: {
        background: theme("colors.primary.600"),
      },
      [['.dark input[type="range"]::-moz-range-progress']]: {
        background: theme("colors.primary.500"),
      },
      [['.dark input[type="range"]::-ms-fill-lower']]: {
        background: theme("colors.primary.500"),
      },
      [['input[type="range"]:focus']]: {
        outline: "none",
      },
      [['input[type="range"]:focus::-webkit-slider-thumb']]: {
        background: theme("colors.primary.600"),
      },
      [['input[type="range"]:active::-webkit-slider-thumb']]: {
        background: theme("colors.primary.700"),
      },
      [['.dark input[type="range"]:focus::-webkit-slider-thumb']]: {
        background: theme("colors.primary.500"),
      },
      [['.dark input[type="range"]:active::-webkit-slider-thumb']]: {
        background: theme("colors.primary.600"),
      },
    });
  },
  {
    theme: {
      screens: {
        xs: "320px",
        ...defaultTheme.screens,
      },
      extend: {
        fontFamily: {
          sans: ["Roboto", "sans-serif"],
          body: ["Roboto", "sans-serif"],
          mono: ["ui-monospace", "monospace"],
        },
        boxShadow: {
          "twe-primary": "0 0 0 1px rgb(59, 113, 202)",
          1: "0 0 2px 0 rgba(0,0,0,.07),0 1px 1px 0 rgba(0,0,0,.04)",
          "1-strong": "0 0 2px 0 rgba(0,0,0,.16),0 1px 1px 0 rgba(0,0,0,.1)",
          2: "0 0 3px 0 rgba(0,0,0,.07),0 2px 2px 0 rgba(0,0,0,.04)",
          "2-strong": "0 0 3px 0 rgba(0,0,0,.16),0 2px 2px 0 rgba(0,0,0,.1)",
          3: "0 2px 6px -1px rgba(0,0,0,.07),0 6px 18px -1px rgba(0,0,0,.04)",
          "3-strong":
            "0 2px 6px -1px rgba(0,0,0,.16),0 6px 18px -1px rgba(0,0,0,.1)",
          4: "0 2px 15px -3px rgba(0,0,0,.07),0 10px 20px -2px rgba(0,0,0,.04)",
          "4-strong":
            "0 2px 15px -3px rgba(0,0,0,.16),0 10px 20px -2px rgba(0,0,0,.1)",
          5: "0 2px 25px -5px rgba(0,0,0,.07),0 25px 21px -5px rgba(0,0,0,.04)",
          "5-strong":
            " 0 2px 25px -5px rgba(0,0,0,.16),0 25px 21px -5px rgba(0,0,0,.1)",
          "twe-inner": "inset 0 2px 4px 0 #0000000d",
          "primary-1":
            "0 8px 9px -4px rgba(59,113,202,0.2),0 4px 18px 0 rgba(59,113,202,0.1)",
          "primary-2":
            "0 8px 9px -4px rgba(59,113,202,0.3),0 4px 18px 0 rgba(59,113,202,0.2)",
          "primary-3": "0 4px 9px -4px #3b71ca",
          "success-1":
            "0 8px 9px -4px rgba(20,164,77,0.2),0 4px 18px 0 rgba(20,164,77,0.1)",
          "success-2":
            "0 8px 9px -4px rgba(20,164,77,0.3),0 4px 18px 0 rgba(20,164,77,0.2)",
          "success-3": "0 4px 9px -4px #14a44d",
          "danger-1":
            "0 8px 9px -4px rgba(220,76,100,0.1),0 4px 18px 0 rgba(220,76,100,0.2)",
          "danger-2":
            "0 8px 9px -4px rgba(220,76,100,0.2),0 4px 18px 0 rgba(220,76,100,0.3)",
          "danger-3": "0 4px 9px -4px #dc4c64",
          "warning-1":
            "0 8px 9px -4px rgba(228,161,27,0.1),0 4px 18px 0 rgba(228,161,27,0.2)",
          "warning-2":
            "0 8px 9px -4px rgba(228,161,27,0.2),0 4px 18px 0 rgba(228,161,27,0.3)",
          "warning-3": "0 4px 9px -4px #e4a11b",
          "info-1":
            "0 8px 9px -4px rgba(84,180,211,0.1),0 4px 18px 0 rgba(84,180,211,0.2)",
          "info-2":
            "0 8px 9px -4px rgba(84,180,211,0.2),0 4px 18px 0 rgba(84,180,211,0.3)",
          "info-3": "0 4px 9px -4px #54b4d3",
          "light-1":
            "0 8px 9px -4px rgba(251,251,251,0.05),0 4px 18px 0 rgba(251,251,251,0.1)",
          "light-2":
            "0 8px 9px -4px rgba(203,203,203,0.2),0 4px 18px 0 rgba(203,203,203,0.3)",
          "light-3": "0 4px 9px -4px #cbcbcb",
          "dark-1":
            "0 8px 9px -4px rgba( 0, 0, 0 , 0.15), 0 4px 18px 0 rgba( 0, 0, 0 , 0.1)",
          "dark-2":
            "0 8px 9px -4px rgba(51,45,45,0.1),0 4px 18px 0 rgba(51,45,45,0.2)",
          "dark-3": "0 4px 9px -4px rgba(51,45,45,0.7)",
          "dark-strong": "0 4px 18px -2px rgba(0,0,0,.7)",
          "dark-mild":
            "0 4px 12px 0 rgba(0,0,0,0.07),0 2px 4px rgba(0,0,0,0.05)",
          "secondary-1":
            "0 2px 15px -3px rgba(0,0,0,0.04),0 10px 20px -2px rgba(0,0,0,0.07)",
          "secondary-2":
            "0 8px 9px -4px rgba(227,235,247,0.2),0 4px 18px 0 rgba(227,235,247,0.3)",
          "secondary-3": "0 4px 9px -4px #e3ebf7",
          "primary-5": "0 4px 9px -4px rgba(59,113,202,0.5)",
          checkbox: "0 0 0 13px #3b71ca",
          inset: "inset 0 0 0 1px rgb(59,113,202)",
          select: "0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)",
          "switch-1":
            "0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)",
          "switch-2":
            "0 0px 3px 0 rgba(0,0,0,0.07), 0 2px 2px 0 rgba(0,0,0,0.04)",
          "switch-3": "3px -1px 0px 13px #3b71ca",
          "notch-1": "-1px 0 0 #3b71ca, 0 1px 0 0 #3b71ca, 0 -1px 0 0 #3b71ca",
          "notch-2": "0 1px 0 0 #3b71ca",
          "notch-3": "1px 0 0 #3b71ca, 0 -1px 0 0 #3b71ca, 0 1px 0 0 #3b71ca",
          "border-b": "inset 0 -1px 0 rgba(229,231,235)",
          autofill: "inset 0 0 0px 1000px rgb(62,62,62)",
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
          "show-up-clock": {
            "0%": {
              opacity: "0",
              transform: "scale(0.7)",
            },
            "100%": {
              opacity: "1",
              transform: "scale(1)",
            },
          },
          progress: {
            "0%": { transform: "translateX(-45%)" },
            "100%": { transform: "translateX(100%)" },
          },
          "drop-in": {
            "0%": {
              opacity: "0",
              transform: "scale(0)",
              animationTimingFunction: "cubic-bezier(0.34, 1.61, 0.7, 1)",
            },
            "100%": {
              opacity: "1",
              transform: "scale(1)",
            },
          },
          "drop-out": {
            "0%": {
              opacity: "1",
              transform: "scale(1)",
              animationTimingFunction: "cubic-bezier(0.34, 1.61, 0.7, 1)",
            },
            "100%": { opacity: "0", transform: "scale(0)" },
          },
          "fly-in": {
            "0%": {
              opacity: "0",
              transform: "scale3d(0.3, 0.3, 0.3)",
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "20%": { transform: "scale3d(1.1, 1.1, 1.1)" },
            "40%": { transform: "scale3d(0.9, 0.9, 0.9)" },
            "60%": { opacity: "1", transform: "scale3d(1.03, 1.03, 1.03)" },
            "80%": { transform: "scale3d(0.97, 0.97, 0.97)" },
            "100%": { opacity: "1", transform: "scale3d(1, 1, 1)" },
          },
          "fly-in-up": {
            "0%": {
              opacity: "0",
              transform: "translate3d(0, 1500px, 0)",
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "60%": { opacity: "1", transform: "translate3d(0, -20px, 0)" },
            "75%": { transform: "translate3d(0, 10px, 0)" },
            "90%": { transform: "translate3d(0, -5px, 0)" },
            "100%": { transform: "translate3d(0, 0, 0)" },
          },
          "fly-in-down": {
            "0%": {
              opacity: "0",
              transform: "translate3d(0, -1500px, 0)",
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "60%": { opacity: "1", transform: "translate3d(0, 25px, 0)" },
            "75%": { transform: "translate3d(0, -10px, 0)" },
            "90%": { transform: "translate3d(0, 5px, 0)" },
            "100%": { transform: "none" },
          },
          "fly-in-left": {
            "0%": {
              opacity: "0",
              transform: "translate3d(1500px, 0, 0)",
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "60%": { opacity: "1", transform: "translate3d(-25px, 0, 0)" },
            "75%": { transform: "translate3d(10px, 0, 0)" },
            "90%": { transform: "translate3d(-5px, 0, 0)" },
            "100%": { transform: "none" },
          },
          "fly-in-right": {
            "0%": {
              opacity: "0",
              transform: "translate3d(-1500px, 0, 0)",
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "60%": { opacity: "1", transform: "translate3d(25px, 0, 0)" },
            "75%": { transform: "translate3d(-10px, 0, 0)" },
            "90%": { transform: "translate3d(5px, 0, 0)" },
            "100%": { transform: "none" },
          },
          "fly-out": {
            "0%": {
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "20%": {
              transform: "scale3d(0.9, 0.9, 0.9)",
            },
            "50%, 55%": {
              opacity: "1",
              transform: "scale3d(1.1, 1.1, 1.1)",
            },
            "100%": {
              opacity: "0",
              transform: "scale3d(0.3, 0.3, 0.3)",
            },
          },
          "fly-out-up": {
            "0%": {
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "20%": {
              transform: "translate3d(0, 10px, 0)",
            },
            "40%, 45%": {
              opacity: "1",
              transform: "translate3d(0, -20px, 0)",
            },
            "100%": {
              opacity: "0",
              transform: "translate3d(0, 2000px, 0)",
            },
          },
          "fly-out-down": {
            "0%": {
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "20%": {
              transform: "translate3d(0, -10px, 0)",
            },
            "40%, 45%": {
              opacity: "1",
              transform: "translate3d(0, 20px, 0)",
            },
            "100%": {
              opacity: "0",
              transform: "translate3d(0, -2000px, 0)",
            },
          },
          "fly-out-left": {
            "0%": {
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "20%": {
              opacity: "1",
              transform: "translate3d(-20px, 0, 0)",
            },
            "100%": {
              opacity: "0",
              transform: "translate3d(2000px, 0, 0)",
            },
          },
          "fly-out-right": {
            "0%": {
              transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
            },
            "20%": {
              opacity: "1",
              transform: "translate3d(20px, 0, 0)",
            },
            "100%": {
              opacity: "0",
              transform: "translate3d(-2000px, 0, 0)",
            },
          },
          "browse-in": {
            "0%": { transform: "scale(0.8) translateZ(0px)", zIndex: "-1" },
            "10%": {
              transform: "scale(0.8) translateZ(0px)",
              zIndex: "-1",
              opacity: "0.7",
            },
            "80%": {
              transform: "scale(1.05) translateZ(0px)",
              zIndex: "999",
              opacity: "1",
            },
            "100%": { transform: "scale(1) translateZ(0px)", zIndex: "999" },
          },
          "browse-out": {
            "0%": {
              transform: "translateX(0%) rotateY(0deg) rotateX(0deg)",
              zIndex: "999",
            },
            "50%": {
              transform:
                "translateX(-105%) rotateY(35deg) rotateX(10deg) translateZ(-10px)",
              zIndex: "-1",
            },
            "80%": { opacity: "1" },
            "100%": {
              zIndex: "-1",
              opacity: "0",
              transform:
                "translateX(0%) rotateY(0deg) rotateX(0deg) translateZ(-10px)",
            },
          },
          "browse-out-left": {
            "0%": {
              transform: "translateX(0%) rotateY(0deg) rotateX(0deg)",
              zIndex: "999",
            },
            "50%": {
              transform:
                "translateX(-105%) rotateY(35deg) rotateX(10deg) translateZ(-10px)",
              zIndex: "-1",
            },
            "80%": { opacity: "1" },
            "100%": {
              zIndex: "-1",
              opacity: "0",
              transform:
                "translateX(0%) rotateY(0deg) rotateX(0deg) translateZ(-10px)",
            },
          },
          "browse-out-right": {
            "0%": {
              transform: "translateX(0%) rotateY(0deg) rotateX(0deg)",
              zIndex: "999",
            },
            "50%": {
              transform:
                "translateX(105%) rotateY(35deg) rotateX(10deg) translateZ(-10px)",
              zIndex: "1",
            },
            "80%": { opacity: "1" },
            "100%": {
              zIndex: "1",
              opacity: "0",
              transform:
                "translateX(0%) rotateY(0deg) rotateX(0deg) translateZ(-10px)",
            },
          },
          jiggle: {
            "0%": { transform: "scale3d(1, 1, 1)" },
            "30%": { transform: "scale3d(1.25, 0.75, 1)" },
            "40%": { transform: "scale3d(0.75, 1.25, 1)" },
            "50%": { transform: "scale3d(1.15, 0.85, 1)" },
            "65%": { transform: "scale3d(0.95, 1.05, 1)" },
            "75%": { transform: "scale3d(1.05, 0.95, 1)" },
            "100%": { transform: "scale3d(1, 1, 1)" },
          },
          flash: {
            "0%, 50%, 100%": { opacity: "1" },
            "25%, 75%": { opacity: "0" },
          },
          shake: {
            "0%, 100%": {
              transform: "translateX(0)",
            },
            "10%, 30%, 50%, 70%, 90%": {
              transform: "translateX(-10px)",
            },
            "20%, 40%, 60%, 80%": {
              transform: "translateX(10px)",
            },
          },
          glow: {
            "0%": { backgroundColor: "#fcfcfd" },
            "30%": { backgroundColor: "#fff6cd" },
            "100%": { backgroundColor: "#fcfcfd" },
          },
        },
        colors: {
          primary: {
            DEFAULT: "#3B71CA",
            50: "#F1F5FB",
            100: "#E3EBF7",
            200: "#C7D7F0",
            300: "#ABC2E8",
            400: "#8FAEE0",
            500: "#6590D5",
            600: "#3061AF",
            700: "#285192",
            800: "#204075",
            900: "#183058",
            "accent-100": "#d9e4f3",
            "accent-200": "#cedbee",
            "accent-300": "#386bc0",
          },
          secondary: {
            DEFAULT: "#9FA6B2",
            50: "#F8F9F9",
            100: "#F1F2F4",
            200: "#E4E6E9",
            300: "#D6D9DE",
            400: "#C8CCD3",
            500: "#B3B9C2",
            600: "#848D9C",
            700: "#6B7585",
            800: "#565D6B",
            900: "#404650",
            "accent-300": "#979ea9",
          },
          success: {
            DEFAULT: "#14A44D",
            50: "#EAFCF2",
            100: "#D6FAE4",
            200: "#ACF5C9",
            300: "#83F0AE",
            400: "#59EA93",
            500: "#1CE26B",
            600: "#118C42",
            700: "#0E7537",
            800: "#0C5D2C",
            900: "#094621",
            "accent-300": "#139c49",
          },
          danger: {
            DEFAULT: "#DC4C64",
            50: "#FCF2F4",
            100: "#FAE5E9",
            200: "#F5CCD3",
            300: "#F0B2BD",
            400: "#EB99A6",
            500: "#E37285",
            600: "#D42A46",
            700: "#B0233A",
            800: "#8D1C2F",
            900: "#6A1523",
            "accent-300": "#d1485f",
          },
          warning: {
            DEFAULT: "#E4A11B",
            50: "#FDF8EF",
            100: "#FBF2DE",
            200: "#F7E4BE",
            300: "#F4D79D",
            400: "#F0C97D",
            500: "#EAB54C",
            600: "#C48A17",
            700: "#A37313",
            800: "#825C0F",
            900: "#62450B",
            "accent-300": "#d9991a",
          },
          info: {
            DEFAULT: "#54B4D3",
            50: "#F3FAFC",
            100: "#E7F4F9",
            200: "#CEE9F2",
            300: "#B6DFEC",
            400: "#9ED4E6",
            500: "#79C4DC",
            600: "#34A4CA",
            700: "#2B89A8",
            800: "#236D86",
            900: "#1A5265",
            "accent-300": "#50abc8",
          },
          surface: {
            DEFAULT: "#4f4f4f",
            dark: "#424242",
          },
          body: {
            DEFAULT: "#fff",
            dark: "#303030",
          },
        },
      },
    },
  }
);
