/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import {
  defineJQueryPlugin,
  getElementFromSelector,
  isDisabled,
  reflow,
  typeCheckConfig,
} from "../util/index";
import Manipulator from "../dom/manipulator";
import EventHandler from "../dom/event-handler";
import SelectorEngine from "../dom/selector-engine";
import BaseComponent from "../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "tab";
const DATA_KEY = "te.tab";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";

const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const DATA_NAME_DROPDOWN_MENU = "data-te-dropdown-menu-ref";
const TAB_ACTIVE = "data-te-tab-active";
const NAV_ACTIVE = "data-te-nav-active";

const FADE = "opacity-0";

const SELECTOR_DROPDOWN = "[data-te-dropdown-ref]";
const SELECTOR_NAV = "[data-te-nav-ref]";
const SELECTOR_TAB_ACTIVE = `[${TAB_ACTIVE}]`;
const SELECTOR_NAV_ACTIVE = `[${NAV_ACTIVE}]`;
const SELECTOR_ACTIVE_UL = ":scope > li > .active";
const SELECTOR_DATA_TOGGLE =
  '[data-te-toggle="tab"], [data-te-toggle="pill"], [data-te-toggle="list"]';
const SELECTOR_DROPDOWN_TOGGLE = "[data-te-dropdown-toggle-ref]";
const SELECTOR_DROPDOWN_ACTIVE_CHILD =
  ":scope > [data-te-dropdown-menu-ref] [data-te-dropdown-show]";

const DefaultClasses = {
  show: "opacity-100",
};

const DefaultClassesType = {
  show: "string",
};

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Tab extends BaseComponent {
  constructor(element, classes) {
    super(element);
    this._classes = this._getClasses(classes);
  }
  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  show() {
    if (
      this._element.parentNode &&
      this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
      this._element.getAttribute(NAV_ACTIVE) === ""
    ) {
      return;
    }

    let previous;
    const target = getElementFromSelector(this._element);
    const listElement = this._element.closest(SELECTOR_NAV);
    const activeNavElement = SelectorEngine.findOne(
      SELECTOR_NAV_ACTIVE,
      listElement
    );

    if (listElement) {
      const itemSelector =
        listElement.nodeName === "UL" || listElement.nodeName === "OL"
          ? SELECTOR_ACTIVE_UL
          : SELECTOR_TAB_ACTIVE;
      previous = SelectorEngine.find(itemSelector, listElement);
      previous = previous[previous.length - 1];
    }

    const hideEvent = previous
      ? EventHandler.trigger(previous, EVENT_HIDE, {
          relatedTarget: this._element,
        })
      : null;

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget: previous,
    });

    if (
      showEvent.defaultPrevented ||
      (hideEvent !== null && hideEvent.defaultPrevented)
    ) {
      return;
    }

    this._activate(
      this._element,
      listElement,
      null,
      activeNavElement,
      this._element
    );

    const complete = () => {
      EventHandler.trigger(previous, EVENT_HIDDEN, {
        relatedTarget: this._element,
      });
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget: previous,
      });
    };

    if (target) {
      this._activate(
        target,
        target.parentNode,
        complete,
        activeNavElement,
        this._element
      );
    } else {
      complete();
    }
  }

  // Private

  _getClasses(classes) {
    const dataAttributes = Manipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  _activate(element, container, callback, activeNavElement, navElement) {
    const activeElements =
      container && (container.nodeName === "UL" || container.nodeName === "OL")
        ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container)
        : SelectorEngine.children(container, SELECTOR_TAB_ACTIVE);

    const active = activeElements[0];
    const isTransitioning =
      callback && active && active.classList.contains(FADE);

    const complete = () =>
      this._transitionComplete(
        element,
        active,
        callback,
        activeNavElement,
        navElement
      );

    if (active && isTransitioning) {
      Manipulator.removeClass(active, this._classes.show);
      this._queueCallback(complete, element, true);
    } else {
      complete();
    }
  }

  _transitionComplete(element, active, callback, activeNavElement, navElement) {
    if (active && activeNavElement) {
      active.removeAttribute(TAB_ACTIVE);
      activeNavElement.removeAttribute(NAV_ACTIVE);

      const dropdownChild = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_ACTIVE_CHILD,
        active.parentNode
      );

      if (dropdownChild) {
        dropdownChild.removeAttribute(TAB_ACTIVE);
      }

      if (active.getAttribute("role") === "tab") {
        active.setAttribute("aria-selected", false);
      }
    }

    element.setAttribute(TAB_ACTIVE, "");
    navElement.setAttribute(NAV_ACTIVE, "");

    if (element.getAttribute("role") === "tab") {
      element.setAttribute("aria-selected", true);
    }

    reflow(element);

    if (element.classList.contains(FADE)) {
      Manipulator.addClass(element, this._classes.show);
    }

    let parent = element.parentNode;
    if (parent && parent.nodeName === "LI") {
      parent = parent.parentNode;
    }

    if (parent && parent.hasAttribute(DATA_NAME_DROPDOWN_MENU)) {
      const dropdownElement = element.closest(SELECTOR_DROPDOWN);

      if (dropdownElement) {
        SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(
          (dropdown) => dropdown.setAttribute(TAB_ACTIVE, "")
        );
      }

      element.setAttribute("aria-expanded", true);
    }

    if (callback) {
      callback();
    }
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }
}

/*
------------------------------------------------------------------------
Data Api implementation
------------------------------------------------------------------------
*/

EventHandler.on(
  document,
  EVENT_CLICK_DATA_API,
  SELECTOR_DATA_TOGGLE,
  function (event) {
    if (["A", "AREA"].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const data = Tab.getOrCreateInstance(this);
    data.show();
  }
);

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Tab to jQuery only if jQuery is present
 */

defineJQueryPlugin(Tab);

export default Tab;
