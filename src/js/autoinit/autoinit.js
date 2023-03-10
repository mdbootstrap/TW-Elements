import SelectorEngine from "../dom/selector-engine";

const defaultInitSelectors = {
  alert: {
    selector: "[data-te-alert-init]",
  },
  chips: {
    selector: "[data-te-chip-init]",
  },
  carousel: {
    selector: "[data-te-carousel-init]",
  },
  collapse: {
    selector: "[data-te-collapse-init]",
  },
  select: {
    selector: "[data-te-select-init]",
  },
  stepper: {
    selector: "[data-te-stepper-init]",
  },
  datepicker: {
    selector: "[data-te-datepicker-init]",
  },
  timepicker: {
    selector: "[data-te-timepicker-init]",
  },
  toast: {
    selector: "[data-te-toast-init]",
  },
  animation: {
    selector: "[data-te-animation-init]",
  },
  input: {
    selector: "[data-te-input-wrapper-init]",
  },
  ripple: {
    selector: "[data-te-ripple-init]",
  },
  scrollspy: {
    selector: "[data-te-spy='scroll']",
  },
  sidenav: {
    selector: "[data-te-sidenav-init]",
  },
};

const init = (component, autoinitSelector = null) => {
  const initSelector =
    autoinitSelector || defaultInitSelectors[component.NAME]?.selector;
  SelectorEngine.find(initSelector).forEach((element) => {
    let instance = component.getInstance(element);
    if (!instance) {
      instance = new component(element);
    }
  });
};

export default init;
