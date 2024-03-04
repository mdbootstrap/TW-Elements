import {
  dropdownCallback,
  offcanvasCallback,
  tabCallback,
  buttonCallback,
  rippleCallback,
  collapseCallback,
  tooltipsCallback,
  popoverCallback,
  modalCallback,
} from "../callbacks/free";

const defaultInitSelectors = {
  carousel: {
    name: "Carousel",
    selector: "[data-twe-carousel-init]",
    isToggler: false,
  },
  input: {
    name: "Input",
    selector: "[data-twe-input-wrapper-init]",
    isToggler: false,
  },
  scrollspy: {
    name: "ScrollSpy",
    selector: "[data-twe-spy='scroll']",
    isToggler: false,
  },

  // togglers
  button: {
    name: "Button",
    selector: "[data-twe-toggle='button']",
    isToggler: true,
    callback: buttonCallback,
  },
  collapse: {
    name: "Collapse",
    selector: "[data-twe-collapse-init]",
    isToggler: true,
    callback: collapseCallback,
  },
  dropdown: {
    name: "Dropdown",
    selector: "[data-twe-dropdown-toggle-ref]",
    isToggler: true,
    callback: dropdownCallback,
  },
  ripple: {
    name: "Ripple",
    selector: "[data-twe-ripple-init]",
    isToggler: true,
    callback: rippleCallback,
  },
  offcanvas: {
    name: "Offcanvas",
    selector: "[data-twe-offcanvas-toggle]",
    isToggler: true,
    callback: offcanvasCallback,
  },
  tab: {
    name: "Tab",
    selector:
      "[data-twe-toggle='tab'], [data-twe-toggle='pill'], [data-twe-toggle='list']",
    isToggler: true,
    callback: tabCallback,
  },
  tooltip: {
    name: "Tooltip",
    selector: "[data-twe-toggle='tooltip']",
    isToggler: false,
    callback: tooltipsCallback,
  },
  popover: {
    name: "Popover",
    selector: "[data-twe-toggle='popover']",
    isToggler: true,
    callback: popoverCallback,
  },
  modal: {
    name: "Modal",
    selector: "[data-twe-toggle='modal']",
    isToggler: true,
    callback: modalCallback,
  },
};

export default defaultInitSelectors;
