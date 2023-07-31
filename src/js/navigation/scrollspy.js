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
  getElement,
  getSelectorFromElement,
  typeCheckConfig,
} from "../util/index";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import MDBManipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import BaseComponent from "../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "scrollspy";
const DATA_KEY = "te.scrollspy";
const EVENT_KEY = `.${DATA_KEY}`;

const Default = {
  offset: 10,
  method: "auto",
  target: "",
};

const DefaultType = {
  offset: "number",
  method: "string",
  target: "(string|element)",
};

const DefaultClasses = {
  active:
    "!text-primary dark:!text-primary-400 font-semibold border-l-[0.125rem] border-solid border-primary dark:border-primary-400",
};

const DefaultClassesType = {
  active: "string",
};

const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
const EVENT_SCROLL = `scroll${EVENT_KEY}`;

const LINK_ACTIVE = "data-te-nav-link-active";
const SELECTOR_DROPDOWN_ITEM = "[data-te-dropdown-item-ref]";
const SELECTOR_NAV_LIST_GROUP = "[data-te-nav-list-ref]";
const SELECTOR_NAV_LINKS = "[data-te-nav-link-ref]";
const SELECTOR_NAV_ITEMS = "[data-te-nav-item-ref]";
const SELECTOR_LIST_ITEMS = "[data-te-list-group-item-ref]";
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, ${SELECTOR_DROPDOWN_ITEM}`;
const SELECTOR_DROPDOWN = "[data-te-dropdown-ref]";
const SELECTOR_DROPDOWN_TOGGLE = "[data-te-dropdown-toggle-ref]";

const METHOD_OFFSET = "maxOffset";
const METHOD_POSITION = "position";

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class ScrollSpy extends BaseComponent {
  constructor(element, config, classes) {
    super(element);
    this._scrollElement =
      this._element.tagName === "BODY" ? window : this._element;
    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
    this._offsets = [];
    this._targets = [];
    this._activeTarget = null;
    this._scrollHeight = 0;

    EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());

    this.refresh();
    this._process();
  }

  // Getters

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  // Public

  refresh() {
    const autoMethod =
      this._scrollElement === this._scrollElement.window
        ? METHOD_OFFSET
        : METHOD_POSITION;

    const offsetMethod =
      this._config.method === "auto" ? autoMethod : this._config.method;

    const offsetBase =
      offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;

    this._offsets = [];
    this._targets = [];
    this._scrollHeight = this._getScrollHeight();

    const targets = SelectorEngine.find(
      SELECTOR_LINK_ITEMS,
      this._config.target
    );

    targets
      .map((element) => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector
          ? SelectorEngine.findOne(targetSelector)
          : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();
          if (targetBCR.width || targetBCR.height) {
            return [
              Manipulator[offsetMethod](target).top + offsetBase,
              targetSelector,
            ];
          }
        }

        return null;
      })
      .filter((item) => item)
      .sort((a, b) => a[0] - b[0])
      .forEach((item) => {
        this._offsets.push(item[0]);
        this._targets.push(item[1]);
      });
  }

  dispose() {
    EventHandler.off(this._scrollElement, EVENT_KEY);
    super.dispose();
  }

  // Private
  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === "object" && config ? config : {}),
    };

    config.target = getElement(config.target) || document.documentElement;

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }

  _getClasses(classes) {
    const dataAttributes = MDBManipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  _getScrollTop() {
    return this._scrollElement === window
      ? this._scrollElement.pageYOffset
      : this._scrollElement.scrollTop;
  }

  _getScrollHeight() {
    return (
      this._scrollElement.scrollHeight ||
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
    );
  }

  _getOffsetHeight() {
    return this._scrollElement === window
      ? window.innerHeight
      : this._scrollElement.getBoundingClientRect().height;
  }

  _process() {
    const scrollTop = this._getScrollTop() + this._config.offset;
    const scrollHeight = this._getScrollHeight();
    const maxScroll =
      this._config.offset + scrollHeight - this._getOffsetHeight();

    if (this._scrollHeight !== scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      const target = this._targets[this._targets.length - 1];

      if (this._activeTarget !== target) {
        this._activate(target);
      }

      return;
    }

    if (
      this._activeTarget &&
      scrollTop < this._offsets[0] &&
      this._offsets[0] > 0
    ) {
      this._activeTarget = null;
      this._clear();
      return;
    }

    for (let i = this._offsets.length; i--; ) {
      const isActiveTarget =
        this._activeTarget !== this._targets[i] &&
        scrollTop >= this._offsets[i] &&
        (typeof this._offsets[i + 1] === "undefined" ||
          scrollTop < this._offsets[i + 1]);

      if (isActiveTarget) {
        this._activate(this._targets[i]);
      }
    }
  }

  _activate(target) {
    this._activeTarget = target;

    this._clear();

    const queries = SELECTOR_LINK_ITEMS.split(",").map(
      (selector) =>
        `${selector}[data-te-target="${target}"],${selector}[href="${target}"]`
    );

    const link = SelectorEngine.findOne(queries.join(","), this._config.target);

    link.classList.add(...this._classes.active.split(" "));
    link.setAttribute(LINK_ACTIVE, "");

    if (link.getAttribute(SELECTOR_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(
        SELECTOR_DROPDOWN_TOGGLE,
        link.closest(SELECTOR_DROPDOWN)
      ).classList.add(...this._classes.active.split(" "));
    } else {
      SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP).forEach(
        (listGroup) => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(
            listGroup,
            `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`
          ).forEach((item) => {
            item.classList.add(...this._classes.active.split(" "));
            item.setAttribute(LINK_ACTIVE, "");
          });

          // Handle special case when .nav-link is inside .nav-item
          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(
            (navItem) => {
              SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(
                (item) => item.classList.add(...this._classes.active.split(" "))
              );
            }
          );
        }
      );
    }

    EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
      relatedTarget: target,
    });
  }

  _clear() {
    SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target)
      .filter((node) =>
        node.classList.contains(...this._classes.active.split(" "))
      )
      .forEach((node) => {
        node.classList.remove(...this._classes.active.split(" "));
        node.removeAttribute(LINK_ACTIVE);
      });
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);

      if (typeof config !== "string") {
        return;
      }

      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }
}

export default ScrollSpy;
