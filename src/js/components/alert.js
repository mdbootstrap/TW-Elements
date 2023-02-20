/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { defineJQueryPlugin, typeCheckConfig, isVisible } from "../util/index";
import EventHandler from "../dom/event-handler";
import BaseComponent from "../base-component";
import Manipulator from "../dom/manipulator";
import { enableDismissTrigger } from "../util/component-functions";
import SelectorEngine from "../dom/selector-engine";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "alert";
const DATA_KEY = "te.alert";
const EVENT_KEY = `.${DATA_KEY}`;

const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_CLOSED = `closed${EVENT_KEY}`;

const SHOW_DATA_ATTRIBUTE = "data-te-alert-show";
const SELECTOR_ALERT = "[data-te-alert-init]";

const DefaultType = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number",
};

const Default = {
  animation: true,
  autohide: true,
  delay: 1000,
};

const DefaultClasses = {
  fadeIn:
    "animate-[fade-in_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
  fadeOut:
    "animate-[fade-out_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
};

const DefaultClassesType = {
  fadeIn: "string",
  fadeOut: "string",
};

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Alert extends BaseComponent {
  constructor(element, config, classes) {
    super(element);
    this._element = element;
    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
  }

  // Getters
  static get DefaultType() {
    return DefaultType;
  }

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  // Public

  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

    if (closeEvent.defaultPrevented) {
      return;
    }

    let timeout = 0;
    if (this._config.animation) {
      timeout = 300;
      Manipulator.addClass(this._element, this._classes.fadeOut);
    }
    this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);

    setTimeout(() => {
      this._queueCallback(
        () => this._destroyElement(),
        this._element,
        this._config.animation
      );
    }, timeout);
  }

  show() {
    if (!this._element) {
      return;
    }

    if (this._config.autohide) {
      this._setupAutohide();
    }
    if (!this._element.hasAttribute(SHOW_DATA_ATTRIBUTE)) {
      Object.assign(this._element.style, {
        display: "block",
      });
      if (isVisible(this._element)) {
        const handler = (e) => {
          Object.assign(e.target.style, {
            display: "block",
          });
          EventHandler.off(e.target, "animationend", handler);
        };
        this._element.setAttribute(SHOW_DATA_ATTRIBUTE, "");

        EventHandler.on(this._element, "animationend", handler);
      }
    }

    if (this._config.animation) {
      Manipulator.removeClass(this._element, this._classes.fadeOut);
      Manipulator.addClass(this._element, this._classes.fadeIn);
    }
  }

  hide() {
    if (!this._element) {
      return;
    }
    if (this._element.hasAttribute(SHOW_DATA_ATTRIBUTE)) {
      this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
      const handler = (e) => {
        Object.assign(e.target.style, {
          display: "none",
        });

        if (this._timeout !== null) {
          clearTimeout(this._timeout);
          this._timeout = null;
        }

        EventHandler.off(e.target, "animationend", handler);
      };

      EventHandler.on(this._element, "animationend", handler);

      Manipulator.removeClass(this._element, this._classes.fadeIn);
      Manipulator.addClass(this._element, this._classes.fadeOut);
    }
  }

  // Private
  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === "object" && config ? config : {}),
    };

    typeCheckConfig(NAME, config, this.constructor.DefaultType);

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

  _setupAutohide() {
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }

  _destroyElement() {
    this._element.remove();
    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);

      if (typeof config !== "string") {
        return;
      }

      if (
        data[config] === undefined ||
        config.startsWith("_") ||
        config === "constructor"
      ) {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */

SelectorEngine.find(SELECTOR_ALERT).forEach((alert) => {
  let instance = Alert.getInstance(alert);
  if (!instance) {
    instance = new Alert(alert);
  }
  return instance;
});

/*
------------------------------------------------------------------------
Data Api implementation
------------------------------------------------------------------------
*/

enableDismissTrigger(Alert, "close");

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Alert to jQuery only if jQuery is present
 */

defineJQueryPlugin(Alert);

export default Alert;
