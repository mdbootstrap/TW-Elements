/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin, reflow, typeCheckConfig } from "../util/index";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import BaseComponent from "../base-component";
import { enableDismissTrigger } from "../util/component-functions";
import SelectorEngine from "../dom/selector-engine";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "toast";
const DATA_KEY = "te.toast";
const EVENT_KEY = `.${DATA_KEY}`;

const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;

const HIDE_DATA_ATTRIBUTE = "data-te-toast-hide";
const SHOW_DATA_ATTRIBUTE = "data-te-toast-show";
const SHOWING_DATA_ATTRIBUTE = "data-te-toast-showing";

const SELECTOR_TOAST = "[data-te-toast-init]";

const DefaultType = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number",
};

const Default = {
  animation: true,
  autohide: true,
  delay: 5000,
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

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Toast extends BaseComponent {
  constructor(element, config, classes) {
    super(element);

    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;
    this._setListeners();
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

  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

    if (showEvent.defaultPrevented) {
      return;
    }

    this._clearTimeout();

    if (this._config.animation) {
      Manipulator.removeMultiClass(
        this._element,
        this._classes.fadeOut.split(" ")
      );
      Manipulator.addMultiClass(this._element, this._classes.fadeIn);
    }

    const complete = () => {
      this._element.removeAttribute(SHOWING_DATA_ATTRIBUTE);
      EventHandler.trigger(this._element, EVENT_SHOWN);

      this._maybeScheduleHide();
    };

    this._element.removeAttribute(HIDE_DATA_ATTRIBUTE);
    reflow(this._element);
    this._element.setAttribute(SHOW_DATA_ATTRIBUTE, "");
    this._element.setAttribute(SHOWING_DATA_ATTRIBUTE, "");

    this._queueCallback(complete, this._element, this._config.animation);
  }

  hide() {
    if (!this._element || this._element.dataset.teToastShow === undefined) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    const complete = () => {
      let timeout = 0;
      if (this._config.animation) {
        timeout = 300;
        Manipulator.removeMultiClass(
          this._element,
          this._classes.fadeIn.split(" ")
        );
        Manipulator.addMultiClass(this._element, this._classes.fadeOut);
      }
      setTimeout(() => {
        this._element.setAttribute(HIDE_DATA_ATTRIBUTE, "");
        this._element.removeAttribute(SHOWING_DATA_ATTRIBUTE);
        this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
        EventHandler.trigger(this._element, EVENT_HIDDEN);
      }, timeout);
    };

    this._element.setAttribute(SHOWING_DATA_ATTRIBUTE, "");
    this._queueCallback(complete, this._element, this._config.animation);
  }

  dispose() {
    this._clearTimeout();

    if (this._element.dataset.teToastShow !== undefined) {
      this._element.removeAttribute(SHOW_DATA_ATTRIBUTE);
    }

    super.dispose();
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

  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }

    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }

    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }

  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case "mouseover":
      case "mouseout":
        this._hasMouseInteraction = isInteracting;
        break;
      case "focusin":
      case "focusout":
        this._hasKeyboardInteraction = isInteracting;
        break;
      default:
        break;
    }

    if (isInteracting) {
      this._clearTimeout();
      return;
    }

    const nextElement = event.relatedTarget;
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }

    this._maybeScheduleHide();
  }

  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, (event) =>
      this._onInteraction(event, true)
    );
    EventHandler.on(this._element, EVENT_MOUSEOUT, (event) =>
      this._onInteraction(event, false)
    );
    EventHandler.on(this._element, EVENT_FOCUSIN, (event) =>
      this._onInteraction(event, true)
    );
    EventHandler.on(this._element, EVENT_FOCUSOUT, (event) =>
      this._onInteraction(event, false)
    );
  }

  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      }
    });
  }
}

enableDismissTrigger(Toast);

/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */

SelectorEngine.find(SELECTOR_TOAST).forEach((el) => {
  let instance = Toast.getInstance(el);
  if (!instance) {
    instance = new Toast(el);
  }
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Toast to jQuery only if jQuery is present
 */

defineJQueryPlugin(Toast);

export default Toast;