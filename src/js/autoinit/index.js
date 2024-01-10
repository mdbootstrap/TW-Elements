/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

import SelectorEngine from "../dom/selector-engine";
import jqueryInit from "./jqueryInit";
import {
  dropdownCallback,
  offcanvasCallback,
  tabCallback,
  buttonCallback,
  modalCallback,
  rippleCallback,
  collapseCallback,
  tooltipsCallback,
  popoverCallback,
  lightboxCallback,
} from "./autoinitCallbacks";

import { chartsCallback } from "./chartsInit";

// key => component NAME constant
// name => component exported by name
import InitRegister from "./Register";

const register = new InitRegister();

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
    selector: "[data-te-chips-input-init]",
    isToggler: false,
  },
  chip: {
    name: "Chip",
    selector: "[data-te-chip-init]",
    isToggler: false,
    onInit: "init",
  },
  datepicker: {
    name: "Datepicker",
    selector: "[data-te-datepicker-init]",
    isToggler: false,
  },
  datetimepicker: {
    name: "Datetimepicker",
    selector: "[data-te-date-timepicker-init]",
    isToggler: false,
  },
  input: {
    name: "Input",
    selector: "[data-te-input-wrapper-init]",
    isToggler: false,
  },
  perfectScrollbar: {
    name: "PerfectScrollbar",
    selector: "[data-te-perfect-scrollbar-init]",
    isToggler: false,
  },
  rating: {
    name: "Rating",
    selector: "[data-te-rating-init]",
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
  datatable: {
    name: "Datatable",
    selector: "[data-te-datatable-init]",
  },
  popconfirm: {
    name: "Popconfirm",
    selector: "[data-te-toggle='popconfirm']",
  },
  validation: {
    name: "Validation",
    selector: "[data-te-validation-init]",
  },
  smoothScroll: {
    name: "SmoothScroll",
    selector: "a[data-te-smooth-scroll-init]",
  },
  lazyLoad: {
    name: "LazyLoad",
    selector: "[data-te-lazy-load-init]",
  },
  clipboard: {
    name: "Clipboard",
    selector: "[data-te-clipboard-init]",
  },
  infiniteScroll: {
    name: "InfiniteScroll",
    selector: "[data-te-infinite-scroll-init]",
  },
  loadingManagement: {
    name: "LoadingManagement",
    selector: "[data-te-loading-management-init]",
  },
  sticky: {
    name: "Sticky",
    selector: "[data-te-sticky-init]",
  },
  multiRangeSlider: {
    name: "MultiRangeSlider",
    selector: "[data-te-multi-range-slider-init]",
  },

  // advancedInits
  chart: {
    name: "Chart",
    selector: "[data-te-chart]",
    isToggler: false,
    advanced: chartsCallback,
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
  tooltip: {
    name: "Tooltip",
    selector: "[data-te-toggle='tooltip']",
    isToggler: false,
    callback: tooltipsCallback,
  },
  popover: {
    name: "Popover",
    selector: "[data-te-toggle='popover']",
    isToggler: true,
    callback: popoverCallback,
  },
  lightbox: {
    name: "Lightbox",
    selector: "[data-te-lightbox-init]",
    isToggler: true,
    callback: lightboxCallback,
  },
  touch: {
    name: "Touch",
    selector: "[data-te-touch-init]",
  },
};

const getComponentData = (component) => {
  return defaultInitSelectors[component.NAME] || null;
};

const initComponent = (component, options) => {
  if (
    !component ||
    (!options.allowReinits && register.isInited(component.NAME))
  ) {
    return;
  }

  register.add(component.NAME);

  const thisComponent = getComponentData(component);
  const isToggler = thisComponent?.isToggler || false;

  jqueryInit(component);

  if (thisComponent?.advanced) {
    thisComponent?.advanced(component, thisComponent?.selector);
    return;
  }

  if (isToggler) {
    thisComponent?.callback(component, thisComponent?.selector);

    return;
  }

  SelectorEngine.find(thisComponent?.selector).forEach((element) => {
    let instance = component.getInstance(element);
    if (!instance) {
      instance = new component(element);
      if (thisComponent?.onInit) {
        instance[thisComponent.onInit]();
      }
    }
  });
};

const init = (components, options) => {
  components.forEach((component) => initComponent(component, options));
};

const defaultOptions = {
  allowReinits: false,
  checkOtherImports: false,
};

const initTE = (components, options = {}) => {
  options = { ...defaultOptions, ...options };

  const componentList = Object.keys(defaultInitSelectors).map((element) => {
    const requireAutoinit = Boolean(
      document.querySelector(defaultInitSelectors[element].selector)
    );
    if (requireAutoinit) {
      const component = components[defaultInitSelectors[element].name];
      if (
        !component &&
        !register.isInited(element) &&
        options.checkOtherImports
      ) {
        console.warn(
          `Please import ${defaultInitSelectors[element].name} from "tw-elements" package and add it to a object parameter inside "initTE" function`
        );
      }
      return component;
    }
  });

  init(componentList, options);
};

export default initTE;
