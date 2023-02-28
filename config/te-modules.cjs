const shell = require("shelljs");

const listOfModules = [
  {
    name: "chips",
    pathToFile: "./src/js/components/chips/index.js",
  },
  {
    name: "alert",
    pathToFile: "./src/js/components/alert.js",
  },
  {
    name: "button",
    pathToFile: "./src/js/components/button.js",
  },
  {
    name: "carousel",
    pathToFile: "./src/js/components/carousel.js",
  },
  {
    name: "collapse",
    pathToFile: "./src/js/components/collapse.js",
  },
  {
    name: "dropdown",
    pathToFile: "./src/js/components/dropdown.js",
  },
  {
    name: "modal",
    pathToFile: "./src/js/components/modal.js",
  },
  {
    name: "offcanvas",
    pathToFile: "./src/js/components/offcanvas.js",
  },
  {
    name: "popover",
    pathToFile: "./src/js/components/popover.js",
  },
  {
    name: "stepper",
    pathToFile: "./src/js/components/stepper.js",
  },
  {
    name: "toast",
    pathToFile: "./src/js/components/toast.js",
  },
  {
    name: "tooltip",
    pathToFile: "./src/js/components/tooltip.js",
  },
  {
    name: "animate",
    pathToFile: "./src/js/content-styles/animate.js",
  },
  {
    name: "datepicker",
    pathToFile: "./src/js/forms/datepicker/index.js",
  },
  {
    name: "select",
    pathToFile: "./src/js/forms/select/index.js",
  },
  {
    name: "timepicker",
    pathToFile: "./src/js/forms/timepicker/index.js",
  },
  {
    name: "input",
    pathToFile: "./src/js/forms/input.js",
  },
  {
    name: "ripple",
    pathToFile: "./src/js/methods/ripple.js",
  },
  {
    name: "scrollspy",
    pathToFile: "./src/js/navigation/scrollspy.js",
  },
  {
    name: "sidenav",
    pathToFile: "./src/js/navigation/sidenav.js",
  },
  {
    name: "tab",
    pathToFile: "./src/js/navigation/tab.js",
  },
];

listOfModules.forEach((moduleItem) => {
  shell.exec(
    `cross-env --env.buildFile=${moduleItem.pathToFile} --env.buildFileName=${moduleItem.name} vite build`
  );
});
