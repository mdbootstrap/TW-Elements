import SelectorEngine from "../dom/selector-engine";
import { element } from "../util";
import jqueryInit from "./jqueryInit";
import {
  dropdownCallback,
  offcanvasCallback,
  tabCallback,
  buttonCallback,
  modalCallback,
  rippleCallback,
  collapseCallback,
} from "./autoinitCallbacks";

const ATTR = "data-te-inited-componets-list";

const defaultInitSelectors = {
  alert: {
    name: "Alert",
    selector: "[data-te-alert-init]",
    isToggler: false,
  },
  animation: {
    name: "Animate",
    selector: "[data-te-animation-init]",
    isToggler: false,
  },
  carousel: {
    name: "Carousel",
    selector: "[data-te-carousel-init]",
    isToggler: false,
  },
  chips: {
    name: "ChipsInput",
    selector: "[data-te-chips-init]",
    isToggler: false,
  },
  datepicker: {
    name: "Datepicker",
    selector: "[data-te-datepicker-init]",
    isToggler: false,
  },
  input: {
    name: "Input",
    selector: "[data-te-input-wrapper-init]",
    isToggler: false,
  },
  scrollspy: {
    name: "ScrollSpy",
    selector: "[data-te-spy='scroll']",
    isToggler: false,
  },
  select: {
    name: "Select",
    selector: "[data-te-select-init]",
    isToggler: false,
  },
  sidenav: {
    name: "Sidenav",
    selector: "[data-te-sidenav-init]",
    isToggler: false,
  },
  stepper: {
    name: "Stepper",
    selector: "[data-te-stepper-init]",
    isToggler: false,
  },
  timepicker: {
    name: "Timepicker",
    selector: "[data-te-timepicker-init]",
    isToggler: false,
  },
  toast: {
    name: "Toast",
    selector: "[data-te-toast-init]",
    isToggler: false,
  },

  // togglers
  button: {
    name: "Button",
    selector: "[data-te-toggle='button']",
    isToggler: true,
    callback: buttonCallback,
  },
  collapse: {
    name: "Collapse",
    selector: "[data-te-collapse-init]",
    isToggler: true,
    callback: collapseCallback,
  },
  dropdown: {
    name: "Dropdown",
    selector: "[data-te-dropdown-toggle-ref]",
    isToggler: true,
    callback: dropdownCallback,
  },
  modal: {
    name: "Modal",
    selector: "[data-te-toggle='modal']",
    isToggler: true,
    callback: modalCallback,
  },
  ripple: {
    name: "Ripple",
    selector: "[data-te-ripple-init]",
    isToggler: true,
    callback: rippleCallback,
  },
  offcanvas: {
    name: "Offcanvas",
    selector: "[data-te-offcanvas-toggle]",
    isToggler: true,
    callback: offcanvasCallback,
  },
  tab: {
    name: "Tab",
    selector:
      "[data-te-toggle='tab'], [data-te-toggle='pill'], [data-te-toggle='list']",
    isToggler: true,
    callback: tabCallback,
  },
};

const getComponentData = (component) => {
  return defaultInitSelectors[component.NAME] || null;
};

const getInitContainer = (attr) => {
  return document.querySelector(`[${attr}]`) || null;
};

const initContainer = (attr) => {
  let container = getInitContainer(attr);
  if (container) {
    return;
  }
  container = element("div");
  container.setAttribute(attr, "");
  document.body.appendChild(container);
};

const getInitContainerList = () => {
  return getInitContainer(ATTR).dataset.teInitedComponetsList;
};

const setInitContainerValue = (componentName) => {
  const container = getInitContainer(ATTR);
  if (!container) {
    return;
  }
  const containerCurrentValue = getInitContainerList();

  container.setAttribute(ATTR, `${componentName} ${containerCurrentValue}`);
};

const initComponent = (component) => {
  if (!component || getInitContainerList().includes(component.NAME)) {
    return;
  }
  setInitContainerValue(component.NAME);

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

const init = (components) => {
  components.forEach((component) => initComponent(component));
};

const initTE = (components, checkOtherImports = true) => {
  const componentList = Object.keys(defaultInitSelectors).map((element) => {
    const requireAutoinit = Boolean(
      document.body.querySelector(defaultInitSelectors[element].selector)
    );
    if (requireAutoinit) {
      const component = components[defaultInitSelectors[element].name];
      if (!component && checkOtherImports) {
        console.warn(
          `Please import ${defaultInitSelectors[element].name} from "tw-elements" package and add it to a object parameter inside "initTE" function`
        );
      }
      return component;
    }
  });

  initContainer(ATTR);

  init(componentList);
};

export default initTE;
