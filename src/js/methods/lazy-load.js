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

import { typeCheckConfig } from "../util/index";
import Data from "../dom/data";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import Animate from "../content-styles/animate";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "lazyLoad";
const DATA_KEY = "te.lazyLoad";

const SELECTOR_ATTR_LAZYLOAD = "[data-te-lazy-load-init]";
const ATTR_LAZYLOAD = "data-te-lazy-load";
const EVENT_LOAD = "onLoad.te.lazy";
const EVENT_ERROR = "onError.te.lazy";
const SELECTOR_ELEMENTS = ["img", "video"];

const DefaultType = {
  lazySrc: "(string|null)",
  lazyDelay: "number",
  lazyAnimation: "string",
  lazyOffset: "number",
  lazyPlaceholder: "(string|undefined)",
  lazyError: "(string|undefined)",
};

const Default = {
  lazySrc: null,
  lazyDelay: 500,
  lazyAnimation: "[fade-in_1s_ease-in-out]",
  lazyOffset: 0,
};

class LazyLoad {
  constructor(element, data) {
    this._element = element;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._options = this._getConfig(data);

    this.scrollHandler = this._scrollHandler.bind(this);

    this.errorHandler = this._setElementError.bind(this);

    this._childrenInstances = null;

    this._init();
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get offsetValues() {
    return this._element.getBoundingClientRect();
  }

  get inViewport() {
    if (this.parent) {
      const parentRect = this.parent.getBoundingClientRect();
      return (
        parentRect.y > 0 &&
        parentRect.y < window.innerHeight &&
        this.offsetValues.y >= parentRect.y &&
        this.offsetValues.y <= parentRect.y + parentRect.height &&
        this.offsetValues.y <= window.innerHeight
      );
    }

    return (
      this.offsetValues.top + this._options.lazyOffset <= window.innerHeight &&
      this.offsetValues.bottom >= 0
    );
  }

  get parent() {
    const [container] = SelectorEngine.parents(
      this._element,
      SELECTOR_ATTR_LAZYLOAD
    );
    return container;
  }

  get node() {
    return this._element.nodeName;
  }

  get isContainer() {
    return !SelectorEngine.matches(this._element, SELECTOR_ELEMENTS);
  }

  // Public

  dispose() {
    Data.removeData(this._element, DATA_KEY);
    if (this._animation) {
      this._animation.dispose();
      this._animation = null;
    }

    this._element = null;

    if (this._childrenInstances) {
      this._childrenInstances.forEach((child) => child.dispose());
    }
  }

  // Private

  _init() {
    this._element.setAttribute(ATTR_LAZYLOAD, "");

    if (this.isContainer) {
      this._setupContainer();
      return;
    }

    this._setupElement();
  }

  _setupElement() {
    EventHandler.one(this._element, "error", this.errorHandler);

    if (this._options.lazyPlaceholder) {
      this._setPlaceholder();
    }

    this._animation = new Animate(this._element, {
      animation: `${this._options.lazyAnimation}`,
      animationStart: "onLoad",
    });

    EventHandler.one(this._element, "load", () => this._scrollHandler());
    if (this.parent) {
      EventHandler.on(this.parent, "scroll", this.scrollHandler);
    }

    EventHandler.on(window, "scroll", this.scrollHandler);
  }

  _scrollHandler() {
    if (this.inViewport) {
      this._timeout = setTimeout(() => {
        this._setSrc();

        this._element.removeAttribute(ATTR_LAZYLOAD);

        this._removeAttrs();

        this._animation.init();
      }, this._options.lazyDelay);

      if (this.parent) {
        EventHandler.off(this.parent, "scroll", this.scrollHandler);
      }

      EventHandler.off(window, "scroll", this.scrollHandler);
    }
  }

  _setElementError() {
    if (
      !this._options.lazyError ||
      this._element.src === this._options.lazyError
    ) {
      this._element.alt = "404 not found";
    } else {
      this._element.setAttribute("src", this._options.lazyError);
    }
    EventHandler.trigger(this._element, EVENT_ERROR);
  }

  _setSrc() {
    this._element.setAttribute("src", this._options.lazySrc);

    EventHandler.trigger(this._element, EVENT_LOAD);
  }

  _setPlaceholder() {
    if (this.node === "IMG") {
      this._element.setAttribute("src", this._options.lazyPlaceholder);
    } else if (this.node === "VIDEO") {
      this._element.setAttribute("poster", this._options.lazyPlaceholder);
    }
  }

  _removeAttrs() {
    ["src", "delay", "animation", "placeholder", "offset", "error"].forEach(
      (attr) => {
        Manipulator.removeDataAttribute(this._element, `lazy-${attr}`);
      }
    );
  }

  _setupContainer() {
    this._childrenInstances = SelectorEngine.children(
      this._element,
      SELECTOR_ELEMENTS
    ).map((child) => new LazyLoad(child, this._options));
  }

  _getConfig(options) {
    const config = {
      ...Default,
      ...options,
      ...Manipulator.getDataAttributes(this._element),
    };

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }

  // Static

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);

      const _config = typeof config === "object" && config;

      if (!data) {
        data = new LazyLoad(this, _config);
      }

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      }
    });
  }
}

export default LazyLoad;
