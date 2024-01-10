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

import { typeCheckConfig } from "../../util/index";
import Data from "../../dom/data";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import EventHandler from "../../dom/event-handler";
import { getBackdropTemplate } from "./templates";

const NAME = "loadingManagement";
const DATA_KEY = `te.${NAME}`;

const ATTR_SELECTOR_LOADING_ICON = "[data-te-loading-icon-ref]";
const ATTR_SELECTOR_LOADING_TEXT = "[data-te-loading-text-ref]";

const SHOW_EVENT = `show.te.${NAME}`;

const DefaultType = {
  backdrop: "(null|boolean)",
  backdropID: "(null|string|number)",
  delay: "(null|number)",
  loader: "(null|string|number)",
  parentSelector: "(null|string)",
  loadingIcon: "boolean",
  loadingText: "boolean",
  scroll: "boolean",
};

const Default = {
  backdrop: true,
  backdropID: null,
  delay: 0,
  loader: "",
  parentSelector: null,
  scroll: true,
  loadingText: true,
  loadingIcon: true,
};

const DefaultClasses = {
  loadingSpinner:
    "absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center z-40",
  spinnerColor: "text-primary dark:text-primary-400",
  backdrop: "w-full h-full fixed top-0 left-0 bottom-0 right-0 z-30",
  backdropColor: "bg-[rgba(0,0,0,0.4)]",
};

const DefaultClassesType = {
  loadingSpinner: "string",
  spinnerColor: "string",
  backdrop: "string",
  backdropColor: "string",
};

class Loading {
  constructor(element, options = {}, classes) {
    this._element = element;
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._backdropElement = null;
    this._parentElement = SelectorEngine.findOne(this._options.parentSelector);

    this._loadingIcon = SelectorEngine.findOne(
      ATTR_SELECTOR_LOADING_ICON,
      this._element
    );
    this._loadingText = SelectorEngine.findOne(
      ATTR_SELECTOR_LOADING_TEXT,
      this._element
    );

    this.init();
  }
  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  init() {
    const spinnerCloned = this._loadingIcon.cloneNode(true);
    const loadingCloned = this._loadingText.cloneNode(true);

    this._removeElementsOnStart();

    setTimeout(() => {
      Manipulator.addClass(
        this._element,
        `${this._classes.loadingSpinner} ${this._classes.spinnerColor}`
      );

      this._setBackdrop();
      this._setLoadingIcon(spinnerCloned);
      this._setLoadingText(loadingCloned);
      this._setScrollOption();

      EventHandler.trigger(this._element, SHOW_EVENT);
    }, this._options.delay);
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY);
    Manipulator.removeClass(
      this._element,
      `${this._classes.loadingSpinner} ${this._classes.spinnerColor}`
    );

    const delay = this._options.delay;

    setTimeout(() => {
      this._removeBackdrop();
      this._backdropElement = null;

      this._element = null;
      this._options = null;
    }, delay);
  }

  // Private

  _setBackdrop() {
    const { backdrop } = this._options;

    if (!backdrop) return;

    this._backdropElement = getBackdropTemplate(this._options, this._classes);

    if (this._parentElement !== null) {
      Manipulator.addClass(this._element, "absolute");
      Manipulator.addClass(this._parentElement, "relative");
      Manipulator.addClass(this._backdropElement, "absolute");

      this._parentElement.appendChild(this._backdropElement);
    } else {
      Manipulator.addClass(this._element, "!fixed");

      document.body.appendChild(this._backdropElement);
      document.body.appendChild(this._element);
    }
  }

  _removeBackdrop() {
    const { backdrop } = this._options;

    if (!backdrop) return;

    if (this._parentElement !== null) {
      Manipulator.removeClass(this._element, "absolute");
      Manipulator.removeClass(this._parentElement, "relative");

      this._backdropElement.remove();
    } else {
      this._backdropElement.remove();
      this._element.remove();
    }
  }

  _setLoadingIcon(spinner) {
    if (!this._options.loadingIcon) {
      spinner.remove();
      return;
    }
    this._element.appendChild(spinner);
    spinner.id = this._options.loader;
  }

  _setLoadingText(text) {
    if (!this._options.loadingText) {
      text.remove();
      return;
    }

    this._element.appendChild(text);
  }

  _removeElementsOnStart() {
    if (this._element === null) return;

    this._loadingIcon.remove();
    this._loadingText.remove();
  }

  _setScrollOption() {
    if (!this._options.scroll) {
      if (this._parentElement === null) {
        Manipulator.addClass(document.body, "overflow-hidden");
        return;
      }

      Manipulator.addClass(this._parentElement, "overflow-hidden");
    } else {
      if (this._parentElement === null) {
        Manipulator.addClass(document.body, "overflow-auto");
        return;
      }

      Manipulator.addClass(this._parentElement, "overflow-auto");
    }
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
        data = new Loading(this, _config);
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

export default Loading;
