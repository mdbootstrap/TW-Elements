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

import { typeCheckConfig, element } from "../util/index";
import Data from "../dom/data";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "clipboard";
const DATA_KEY = "te.clipboard";
const EVENT_KEY = `.${DATA_KEY}`;

const DEFAULT_OPTIONS = {
  clipboardTarget: null,
};

const OPTIONS_TYPE = {
  clipboardTarget: "null|string",
};

const EVENT_COPY = `copy${EVENT_KEY}`;

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Clipboard {
  constructor(element, options = {}) {
    this._element = element;
    this._options = options;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);

      this._initCopy = this._initCopy.bind(this);

      this._setup();
    }
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get options() {
    const config = {
      ...DEFAULT_OPTIONS,
      ...Manipulator.getDataAttributes(this._element),
      ...this._options,
    };

    typeCheckConfig(NAME, config, OPTIONS_TYPE);

    return config;
  }

  get clipboardTarget() {
    return SelectorEngine.findOne(this.options.clipboardTarget);
  }

  get copyText() {
    const clipboardTextExist = this.clipboardTarget.hasAttribute(
      "data-te-clipboard-text"
    );
    const inputValue = this.clipboardTarget.value;
    const targetText = this.clipboardTarget.textContent;

    if (clipboardTextExist) {
      return this.clipboardTarget.getAttribute("data-te-clipboard-text");
    }

    if (inputValue) {
      return inputValue;
    }

    return targetText;
  }

  // Public

  dispose() {
    EventHandler.off(this._element, "click", this._initCopy);

    Data.removeData(this._element, DATA_KEY);
    this._element = null;
  }

  // Private
  _setup() {
    EventHandler.on(this._element, "click", this._initCopy);
  }

  _initCopy() {
    const inputToCopy = this._createNewInput();
    document.body.appendChild(inputToCopy);
    this._selectInput(inputToCopy);
    EventHandler.trigger(this._element, EVENT_COPY, {
      copyText: this.copyText,
    });

    inputToCopy.remove();
  }

  _createNewInput() {
    const tag =
      this.clipboardTarget.tagName === "TEXTAREA" ? "textarea" : "input";
    const newInput = element(tag);
    newInput.value = this.copyText;
    Manipulator.addClass(newInput, `-left-[9999px] absolute`);
    return newInput;
  }

  _selectInput(input) {
    input.select();
    input.focus();
    input.setSelectionRange(0, 99999);

    document.execCommand("copy");
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;

      if (!data) {
        data = new Clipboard(this, _config);
      }

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
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

export default Clipboard;
