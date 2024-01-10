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
import SelectorEngine from "../dom/selector-engine";
import Manipulator from "../dom/manipulator";
import Tooltip from "./tooltip";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "rating";
const DATA_KEY = "te.rating";
const DATA_INIT = "data-te-rating-init";
const SELECTOR_ICON = "[data-te-rating-icon-ref]";
const EVENT_KEY = `.${DATA_KEY}`;

const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";

const DefaultType = {
  tooltip: "string",
  value: "(string|number)",
  readonly: "boolean",
  after: "string",
  before: "string",
  dynamic: "boolean",
  active: "string",
};

const Default = {
  tooltip: "top",
  value: "",
  readonly: false,
  after: "",
  before: "",
  dynamic: false,
  active: "fill-current",
};

const EVENT_SELECT = `onSelect${EVENT_KEY}`;
const EVENT_HOVER = `onHover${EVENT_KEY}`;
const EVENT_KEYUP = `keyup${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Rating {
  constructor(element, options) {
    this._element = element;
    this._icons = SelectorEngine.find(SELECTOR_ICON, this._element);
    this._options = this._getConfig(options);
    this._index = -1;
    this._savedIndex = null;
    this._originalClassList = [];
    this._originalIcons = [];
    this._fn = {};
    this._tooltips = [];

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
      this._init();
    }
  }

  // Getters
  static get NAME() {
    return NAME;
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY);

    if (!this._options.readonly) {
      EventHandler.off(this._element, EVENT_KEYUP);
      EventHandler.off(this._element, EVENT_FOCUSOUT);
      EventHandler.off(this._element, EVENT_KEYDOWN);
      this._element.removeEventListener("mouseleave", this._fn.mouseleave);

      this._icons.forEach((el, i) => {
        EventHandler.off(el, EVENT_MOUSEDOWN);
        el.removeEventListener("mouseenter", this._fn.mouseenter[i]);
        Manipulator.removeClass(el, "cursor-pointer");
      });

      this._tooltips.forEach((el) => {
        el._element.removeAttribute(DATA_INIT);
        el.dispose();
      });

      this._icons.forEach((el) => el.removeAttribute("tabIndex"));
    }

    this._element = null;
  }

  // Private
  _init() {
    if (!this._options.readonly) {
      this._bindMouseEnter();
      this._bindMouseLeave();
      this._bindMouseDown();
      this._bindKeyDown();
      this._bindKeyUp();
      this._bindFocusLost();

      this._icons.forEach((el) => {
        Manipulator.addClass(el, "cursor-pointer");
      });
    }

    if (this._options.dynamic) {
      this._saveOriginalClassList();
      this._saveOriginalIcons();
    }

    this._setCustomText();
    this._setToolTips();

    if (this._options.value) {
      this._index = this._options.value - 1;
      this._updateRating(this._index);
    }
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    config = {
      ...Default,
      ...dataAttributes,
      ...config,
    };

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }

  _bindMouseEnter() {
    this._fn.mouseenter = [];
    this._icons.forEach((el, i) => {
      // EventHandler.on changes mouseenter to mouseover - use addEventListener
      el.addEventListener(
        "mouseenter",
        // this._fn.mouseenter[i] is needed to create reference and unpin events after call dispose
        // prettier-ignore
        this._fn.mouseenter[i] = (e) => {
          this._index = this._icons.indexOf(e.target);
          this._updateRating(this._index);
          this._triggerEvents(el, EVENT_HOVER);
          // prettier-ignore
        }
      );
    });
  }

  _bindMouseLeave() {
    // EventHandler.on changes mouseleave to mouseout - use addEventListener
    this._element.addEventListener(
      "mouseleave",
      // this._fn.mouseleave is needed to create reference and unpin events after call dispose
      // prettier-ignore
      this._fn.mouseleave = () => {
        if (this._savedIndex !== null) {
          this._updateRating(this._savedIndex);
          this._index = this._savedIndex;
        } else if (this._options.value) {
          this._updateRating(this._options.value - 1);
          this._index = this._options.value - 1
        } else {
          this._index = -1;
          this._clearRating();
        }
        // prettier-ignore
      }
    );
  }

  _bindMouseDown() {
    this._icons.forEach((el) => {
      EventHandler.on(el, EVENT_MOUSEDOWN, () => {
        this._setElementOutline("none");
        this._savedIndex = this._index;
        this._triggerEvents(el, EVENT_SELECT);
      });
    });
  }

  _bindKeyDown() {
    this._element.tabIndex = 0;
    EventHandler.on(this._element, EVENT_KEYDOWN, (e) =>
      this._updateAfterKeyDown(e)
    );
  }

  _bindKeyUp() {
    EventHandler.on(this._element, EVENT_KEYUP, () =>
      this._setElementOutline("auto")
    );
  }

  _bindFocusLost() {
    EventHandler.on(this._element, EVENT_FOCUSOUT, () =>
      this._setElementOutline("none")
    );
  }

  _setElementOutline(value) {
    this._element.style.outline = value;
  }

  _triggerEvents(el, event) {
    EventHandler.trigger(el, event, {
      value: this._index + 1,
    });
  }

  _updateAfterKeyDown(e) {
    const maxIndex = this._icons.length - 1;
    const indexBeforeChange = this._index;

    if (e.key === ARROW_RIGHT_KEY && this._index < maxIndex) {
      this._index += 1;
    }

    if (e.key === ARROW_LEFT_KEY && this._index > -1) {
      this._index -= 1;
    }

    if (indexBeforeChange !== this._index) {
      this._savedIndex = this._index;
      this._updateRating(this._savedIndex);
      this._triggerEvents(this._icons[this._savedIndex], EVENT_SELECT);
    }
  }

  _updateRating(index) {
    this._clearRating();

    if (this._options.dynamic) {
      this._restoreOriginalIcon(index);
    }

    this._icons.forEach((el, i) => {
      if (i <= index) {
        Manipulator.addClass(el.querySelector("svg"), this._options.active);
      }
    });
  }

  _clearRating() {
    this._icons.forEach((el, i) => {
      const element = el.querySelector("svg");
      if (this._options.dynamic) {
        el.classList = this._originalClassList[i];
        element.innerHTML = this._originalIcons[i];
      }
      Manipulator.removeClass(element, this._options.active);
    });
  }

  _setToolTips() {
    this._icons.forEach((el, i) => {
      const hasOwnTooltips = Manipulator.getDataAttribute(el, "toggle");

      if (el.title && !hasOwnTooltips) {
        Manipulator.setDataAttribute(el, "toggle", "tooltip");
        this._tooltips[i] = new Tooltip(el, {
          placement: this._options.tooltip,
        });
      }
    });
  }

  _setCustomText() {
    this._icons.forEach((el) => {
      const after = Manipulator.getDataAttribute(el, "after");
      const before = Manipulator.getDataAttribute(el, "before");

      if (after) {
        el.insertAdjacentHTML("afterEnd", after);
      }

      if (before) {
        el.insertAdjacentHTML("beforeBegin", before);
      }
    });
  }

  _saveOriginalClassList() {
    this._icons.forEach((el) => {
      const classList = el.classList.value;
      this._originalClassList.push(classList);
    });
  }

  _saveOriginalIcons() {
    this._icons.forEach((el) => {
      const svgHtml = el.querySelector("svg").innerHTML;
      this._originalIcons.push(svgHtml);
    });
  }

  _restoreOriginalIcon(index) {
    const classList = this._originalClassList[index];
    const icon = this._originalIcons[index];
    this._icons.forEach((el, i) => {
      if (i <= index) {
        const element = el.querySelector("svg");
        element.innerHTML = icon;
        el.classList = classList;
      }
    });
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
}

export default Rating;
