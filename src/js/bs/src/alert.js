/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin, typeCheckConfig } from "./util/index";
import EventHandler from "./dom/event-handler";
import BaseComponent from "./base-component";
import Manipulator from "./dom/manipulator";
import { enableDismissTrigger } from "./util/component-functions";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "alert";
const DATA_KEY = "te.alert";
const EVENT_KEY = `.${DATA_KEY}`;

const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_CLOSED = `closed${EVENT_KEY}`;

const FADE_OUT_CLASSES =
  "animate-[fade-out-frame_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const SHOW_DATA_ATTRIBUTE = "data-te-toast-show";

const DefaultType = {
  animation: "boolean",
};

const Default = {
  animation: true,
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Alert extends BaseComponent {
  constructor(element, config) {
    super(element);
    this._config = this._getConfig(config);
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
      Manipulator.addMultiClass(this._element, FADE_OUT_CLASSES);
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
 * Data Api implementation
 * ------------------------------------------------------------------------
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
