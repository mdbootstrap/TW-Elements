/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/
import * as Popper from "@popperjs/core";

import {
  getElement,
  getElementFromSelector,
  getNextActiveElement,
  isDisabled,
  isElement,
  isRTL,
  isVisible,
  noop,
  typeCheckConfig,
} from "../util/index";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import BaseComponent from "../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "dropdown";
const DATA_KEY = "te.dropdown";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";

const ESCAPE_KEY = "Escape";
const SPACE_KEY = "Space";
const TAB_KEY = "Tab";
const ARROW_UP_KEY = "ArrowUp";
const ARROW_DOWN_KEY = "ArrowDown";
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const REGEXP_KEYDOWN = new RegExp(
  `${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY}`
);

const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_SHOW = "show";
const CLASS_NAME_DROPUP = "dropup";
const CLASS_NAME_DROPEND = "dropend";
const CLASS_NAME_DROPSTART = "dropstart";

const SELECTOR_NAVBAR = "[data-te-navbar-ref]";
const SELECTOR_DATA_TOGGLE = "[data-te-dropdown-toggle-ref]";
const SELECTOR_MENU = "[data-te-dropdown-menu-ref]";
const SELECTOR_NAVBAR_NAV = "[data-te-navbar-nav-ref]";
const SELECTOR_VISIBLE_ITEMS =
  "[data-te-dropdown-menu-ref] [data-te-dropdown-item-ref]:not(.disabled):not(:disabled)";

const PLACEMENT_TOP = isRTL() ? "top-end" : "top-start";
const PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end";
const PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start";
const PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end";
const PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start";
const PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start";

const ANIMATION_FADE_IN = [{ opacity: "0" }, { opacity: "1" }];
const ANIMATION_FADE_OUT = [{ opacity: "1" }, { opacity: "0" }];

const ANIMATION_TIMING = {
  duration: 550,
  iterations: 1,
  easing: "ease",
  fill: "both",
};

const Default = {
  offset: [0, 2],
  boundary: "clippingParents",
  reference: "toggle",
  display: "dynamic",
  popperConfig: null,
  autoClose: true,
  dropdownAnimation: "on",
};

const DefaultType = {
  offset: "(array|string|function)",
  boundary: "(string|element)",
  reference: "(string|element|object)",
  display: "string",
  popperConfig: "(null|object|function)",
  autoClose: "(boolean|string)",
  dropdownAnimation: "string",
};

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element);

    this._popper = null;
    this._config = this._getConfig(config);
    this._menu = this._getMenuElement();
    this._inNavbar = this._detectNavbar();
    this._fadeOutAnimate = null;

    //* prevents dropdown close issue when system animation is turned off
    const isPrefersReducedMotionSet = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    this._animationCanPlay =
      this._config.dropdownAnimation === "on" && !isPrefersReducedMotionSet;

    this._didInit = false;
    this._init();
  }

  // Getters

  static get Default() {
    return Default;
  }

  static get DefaultType() {
    return DefaultType;
  }

  static get NAME() {
    return NAME;
  }

  // Public

  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }

  show() {
    if (isDisabled(this._element) || this._isShown(this._menu)) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element,
    };

    const showEvent = EventHandler.trigger(
      this._element,
      EVENT_SHOW,
      relatedTarget
    );

    if (showEvent.defaultPrevented) {
      return;
    }

    const parent = Dropdown.getParentFromElement(this._element);
    // Totally disable Popper for Dropdowns in Navbar
    if (this._inNavbar) {
      Manipulator.setDataAttribute(this._menu, "popper", "none");
    } else {
      this._createPopper(parent);
    }

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if (
      "ontouchstart" in document.documentElement &&
      !parent.closest(SELECTOR_NAVBAR_NAV)
    ) {
      []
        .concat(...document.body.children)
        .forEach((elem) => EventHandler.on(elem, "mouseover", noop));
    }

    this._element.focus();
    this._element.setAttribute("aria-expanded", true);

    this._menu.setAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`, "");
    this._animationCanPlay &&
      this._menu.animate(ANIMATION_FADE_IN, ANIMATION_TIMING);
    this._element.setAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`, "");

    setTimeout(
      () => {
        EventHandler.trigger(this._element, EVENT_SHOWN, relatedTarget);
      },
      this._animationCanPlay ? ANIMATION_TIMING.duration : 0
    );
  }

  hide() {
    if (isDisabled(this._element) || !this._isShown(this._menu)) {
      return;
    }

    const relatedTarget = {
      relatedTarget: this._element,
    };

    this._completeHide(relatedTarget);
  }

  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }

    super.dispose();
  }

  update() {
    this._inNavbar = this._detectNavbar();
    if (this._popper) {
      this._popper.update();
    }
  }

  // Private
  _init() {
    if (this._didInit) {
      return;
    }

    EventHandler.on(
      document,
      EVENT_KEYDOWN_DATA_API,
      SELECTOR_DATA_TOGGLE,
      Dropdown.dataApiKeydownHandler
    );
    EventHandler.on(
      document,
      EVENT_KEYDOWN_DATA_API,
      SELECTOR_MENU,
      Dropdown.dataApiKeydownHandler
    );
    EventHandler.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
    EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);

    this._didInit = true;
  }

  _completeHide(relatedTarget) {
    if (this._fadeOutAnimate && this._fadeOutAnimate.playState === "running") {
      return;
    }

    const hideEvent = EventHandler.trigger(
      this._element,
      EVENT_HIDE,
      relatedTarget
    );
    if (hideEvent.defaultPrevented) {
      return;
    }

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ("ontouchstart" in document.documentElement) {
      []
        .concat(...document.body.children)
        .forEach((elem) => EventHandler.off(elem, "mouseover", noop));
    }

    if (this._animationCanPlay) {
      this._fadeOutAnimate = this._menu.animate(
        ANIMATION_FADE_OUT,
        ANIMATION_TIMING
      );
    }

    setTimeout(
      () => {
        if (this._popper) {
          this._popper.destroy();
        }

        this._menu.removeAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`);
        this._element.removeAttribute(`data-te-dropdown-${CLASS_NAME_SHOW}`);

        this._element.setAttribute("aria-expanded", "false");
        Manipulator.removeDataAttribute(this._menu, "popper");
        EventHandler.trigger(this._element, EVENT_HIDDEN, relatedTarget);
      },
      this._animationCanPlay ? ANIMATION_TIMING.duration : 0
    );
  }

  _getConfig(config) {
    config = {
      ...this.constructor.Default,
      ...Manipulator.getDataAttributes(this._element),
      ...config,
    };

    typeCheckConfig(NAME, config, this.constructor.DefaultType);

    if (
      typeof config.reference === "object" &&
      !isElement(config.reference) &&
      typeof config.reference.getBoundingClientRect !== "function"
    ) {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(
        `${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`
      );
    }

    return config;
  }

  _createPopper(parent) {
    if (typeof Popper === "undefined") {
      throw new TypeError(
        "Bootstrap's dropdowns require Popper (https://popper.js.org)"
      );
    }

    let referenceElement = this._element;

    if (this._config.reference === "parent") {
      referenceElement = parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === "object") {
      referenceElement = this._config.reference;
    }

    const popperConfig = this._getPopperConfig();
    const isDisplayStatic = popperConfig.modifiers.find(
      (modifier) =>
        modifier.name === "applyStyles" && modifier.enabled === false
    );

    this._popper = Popper.createPopper(
      referenceElement,
      this._menu,
      popperConfig
    );

    if (isDisplayStatic) {
      Manipulator.setDataAttribute(this._menu, "popper", "static");
    }
  }

  _isShown(element = this._element) {
    return (
      element.dataset[
        `teDropdown${
          CLASS_NAME_SHOW.charAt(0).toUpperCase() + CLASS_NAME_SHOW.slice(1)
        }`
      ] === ""
    );
  }

  _getMenuElement() {
    return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
  }

  _getPlacement() {
    const parentDropdown = this._element.parentNode;

    if (parentDropdown.dataset.teDropdownPosition === CLASS_NAME_DROPEND) {
      return PLACEMENT_RIGHT;
    }

    if (parentDropdown.dataset.teDropdownPosition === CLASS_NAME_DROPSTART) {
      return PLACEMENT_LEFT;
    }

    // We need to trim the value because custom properties can also include spaces
    const isEnd = parentDropdown.dataset.teDropdownAlignment === "end";

    if (parentDropdown.dataset.teDropdownPosition === CLASS_NAME_DROPUP) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }

    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }

  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }

  _getOffset() {
    const { offset } = this._config;

    if (typeof offset === "string") {
      return offset.split(",").map((val) => Number.parseInt(val, 10));
    }

    if (typeof offset === "function") {
      return (popperData) => offset(popperData, this._element);
    }

    return offset;
  }

  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary,
          },
        },
        {
          name: "offset",
          options: {
            offset: this._getOffset(),
          },
        },
      ],
    };

    // Disable Popper if we have a static display
    if (this._config.display === "static") {
      defaultBsPopperConfig.modifiers = [
        {
          name: "applyStyles",
          enabled: false,
        },
      ];
    }

    return {
      ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === "function"
        ? this._config.popperConfig(defaultBsPopperConfig)
        : this._config.popperConfig),
    };
  }

  _selectMenuItem({ key, target }) {
    const items = SelectorEngine.find(
      SELECTOR_VISIBLE_ITEMS,
      this._menu
    ).filter(isVisible);

    if (!items.length) {
      return;
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(
      items,
      target,
      key === ARROW_DOWN_KEY,
      !items.includes(target)
    ).focus();
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);

      if (typeof config !== "string") {
        return;
      }

      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }

  static clearMenus(event) {
    if (
      event &&
      (event.button === RIGHT_MOUSE_BUTTON ||
        (event.type === "keyup" && event.key !== TAB_KEY))
    ) {
      return;
    }

    const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE);

    for (let i = 0, len = toggles.length; i < len; i++) {
      const context = Dropdown.getInstance(toggles[i]);
      if (!context || context._config.autoClose === false) {
        continue;
      }

      if (!context._isShown()) {
        continue;
      }

      const relatedTarget = {
        relatedTarget: context._element,
      };

      if (event) {
        const composedPath = event.composedPath();
        const isMenuTarget = composedPath.includes(context._menu);
        if (
          composedPath.includes(context._element) ||
          (context._config.autoClose === "inside" && !isMenuTarget) ||
          (context._config.autoClose === "outside" && isMenuTarget)
        ) {
          continue;
        }

        // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
        if (
          context._menu.contains(event.target) &&
          ((event.type === "keyup" && event.key === TAB_KEY) ||
            /input|select|option|textarea|form/i.test(event.target.tagName))
        ) {
          continue;
        }

        if (event.type === "click") {
          relatedTarget.clickEvent = event;
        }
      }

      context._completeHide(relatedTarget);
    }
  }

  static getParentFromElement(element) {
    return getElementFromSelector(element) || element.parentNode;
  }

  static dataApiKeydownHandler(event) {
    // If not input/textarea:
    //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
    // If input/textarea:
    //  - If space key => not a dropdown command
    //  - If key is other than escape
    //    - If key is not up or down => not a dropdown command
    //    - If trigger inside the menu => not a dropdown command
    if (
      /input|textarea/i.test(event.target.tagName)
        ? event.key === SPACE_KEY ||
          (event.key !== ESCAPE_KEY &&
            ((event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY) ||
              event.target.closest(SELECTOR_MENU)))
        : !REGEXP_KEYDOWN.test(event.key)
    ) {
      return;
    }

    const isActive =
      this.dataset[
        `teDropdown${
          CLASS_NAME_SHOW.charAt(0).toUpperCase() + CLASS_NAME_SHOW.slice(1)
        }`
      ] === "";

    if (!isActive && event.key === ESCAPE_KEY) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isDisabled(this)) {
      return;
    }

    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE)
      ? this
      : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE)[0];
    const instance = Dropdown.getOrCreateInstance(getToggleButton);

    if (event.key === ESCAPE_KEY) {
      instance.hide();
      return;
    }

    if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
      if (!isActive) {
        instance.show();
      }

      instance._selectMenuItem(event);
      return;
    }

    if (!isActive || event.key === SPACE_KEY) {
      Dropdown.clearMenus();
    }
  }
}

export default Dropdown;
