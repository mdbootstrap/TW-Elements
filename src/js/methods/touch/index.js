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

import Data from "../../dom/data";
import EventHandler from "../../dom/event-handler";
import Press from "./press";
import Swipe from "./swipe";
import Pan from "./pan";
import Pinch from "./pinch";
import Tap from "./tap";
import Rotate from "./rotate";
import { typeCheckConfig } from "../../util";
import Manipulator from "../../dom/manipulator";

const NAME = "touch";
const DATA_KEY = `te.${NAME}`;

const DefaultType = {
  event: "string",
};

const Default = {
  event: "swipe",
};

class Touch {
  constructor(element, options = {}) {
    this._element = element;
    this._options = this._getConfig(options);
    this._event = this._options.event;
    // events

    this.swipe = this._event === "swipe" ? new Swipe(element, options) : null;
    this.press = this._event === "press" ? new Press(element, options) : null;
    this.pan = this._event === "pan" ? new Pan(element, options) : null;
    this.pinch = this._event === "pinch" ? new Pinch(element, options) : null;
    this.tap = this._event === "tap" ? new Tap(element, options) : null;
    this.rotate =
      this._event === "rotate" ? new Rotate(element, options) : null;

    // handlers

    this._touchStartHandler = (e) => this._handleTouchStart(e);
    this._touchMoveHandler = (e) => this._handleTouchMove(e);
    this._touchEndHandler = (e) => this._handleTouchEnd(e);

    // istanbul ignore next
    EventHandler.on(this._element, "touchstart", this._touchStartHandler);

    // istanbul ignore next
    EventHandler.on(this._element, "touchmove", this._touchMoveHandler);

    // istanbul ignore next
    EventHandler.on(this._element, "touchend", this._touchEndHandler);

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }
  }

  // Getters
  static get NAME() {
    return NAME;
  }

  dispose() {
    EventHandler.off(this._element, "touchstart", this._touchStartHandler);
    EventHandler.off(this._element, "touchmove", this._touchMoveHandler);
    EventHandler.off(this._element, "touchend", this._touchEndHandler);

    this.swipe = null;
    this.press = null;
    this.pan = null;
    this.pinch = null;
    this.tap = null;
    this.rotate = null;
  }

  _getConfig(options) {
    const config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...options,
    };

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }

  _handleTouchStart(e) {
    this[this._event].handleTouchStart(e);
  }

  _handleTouchMove(e) {
    if (this[this._event].handleTouchMove) {
      this[this._event].handleTouchMove(e);
    }
  }

  _handleTouchEnd(e) {
    this[this._event].handleTouchEnd(e);
  }

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;

      if (!data && /dispose/.test(config)) {
        return;
      }

      if (!data) {
        data = new Touch(this, _config);
      }

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        // eslint-disable-next-line consistent-return
        return data[config];
      }
    });
  }

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

export default Touch;
