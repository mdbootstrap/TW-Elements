import SelectorEngine from "../dom/selector-engine";
import jqueryInit from "./jqueryInit";
import {
  dropdownCallback,
  offcanvasCallback,
  tabCallback,
  buttonCallback,
  modalCallback,
  rippleCallback,
} from "./autoinitCallbacks";

const defaultInitSelectors = {
  alert: {
    selector: "[data-te-alert-init]",
    isToggler: false,
  },
  animation: {
    selector: "[data-te-animation-init]",
    isToggler: false,
  },
  carousel: {
    selector: "[data-te-carousel-init]",
    isToggler: false,
  },
  chips: {
    selector: "[data-te-chips-init]",
    isToggler: false,
  },
  collapse: {
    selector: "[data-te-collapse-init]",
    isToggler: false,
  },
  datepicker: {
    selector: "[data-te-datepicker-init]",
    isToggler: false,
  },
  input: {
    selector: "[data-te-input-wrapper-init]",
    isToggler: false,
  },
  scrollspy: {
    selector: "[data-te-spy='scroll']",
    isToggler: false,
  },
  select: {
    selector: "[data-te-select-init]",
    isToggler: false,
  },
  sidenav: {
    selector: "[data-te-sidenav-init]",
    isToggler: false,
  },
  stepper: {
    selector: "[data-te-stepper-init]",
    isToggler: false,
  },

  timepicker: {
    selector: "[data-te-timepicker-init]",
    isToggler: false,
  },
  toast: {
    selector: "[data-te-toast-init]",
    isToggler: false,
  },

  // togglers
  button: {
    selector: "[data-te-toggle='button']",
    isToggler: true,
    callback: buttonCallback,
  },
  dropdown: {
    selector: "[data-te-dropdown-toggle-ref]",
    isToggler: true,
    callback: dropdownCallback,
  },
  modal: {
    selector: "[data-te-toggle='modal']",
    isToggler: true,
    callback: modalCallback,
  },
  ripple: {
    selector: "[data-te-ripple-init]",
    isToggler: true,
    callback: rippleCallback,
  },
  offcanvas: {
    selector: "[data-te-offcanvas-toggle]",
    isToggler: true,
    callback: offcanvasCallback,
  },
  tab: {
    selector:
      "[data-te-toggle='tab'], [data-te-toggle='pill'], [data-te-toggle='list']",
    isToggler: true,
    callback: tabCallback,
  },
};

const getComponentData = (component) => {
  return defaultInitSelectors[component.NAME] || null;
};

const initComponent = (component) => {
  const thisComponent = getComponentData(component);
  const isToggler = thisComponent?.isToggler || false;

  jqueryInit(component);

  if (isToggler) {
    thisComponent.callback(component, thisComponent?.selector);

    return;
  }

  SelectorEngine.find(thisComponent?.selector).forEach((element) => {
    let instance = component.getInstance(element);
    if (!instance) {
      instance = new component(element);
    }
  });
};

const init = (...components) => {
  components.forEach((component) => initComponent(component));
};

export default init;
