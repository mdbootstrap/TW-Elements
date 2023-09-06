/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { reflow, typeCheckConfig } from "../util/index";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import BaseComponent from "../base-component";
import { enableDismissTrigger } from "../util/component-functions";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
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

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
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
    this._didInit = false;
    this._init();
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
      Manipulator.removeClass(this._element, this._classes.fadeOut);
      Manipulator.addClass(this._element, this._classes.fadeIn);
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
        Manipulator.removeClass(this._element, this._classes.fadeIn);
        Manipulator.addClass(this._element, this._classes.fadeOut);
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
  _init() {
    if (this._didInit) {
      return;
    }

    enableDismissTrigger(Toast);
    this._didInit = true;
  }

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

export default Toast;
