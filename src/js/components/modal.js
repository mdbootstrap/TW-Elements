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
  defineJQueryPlugin,
  getElementFromSelector,
  isRTL,
  isVisible,
  reflow,
  typeCheckConfig,
} from "../util/index";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import ScrollBarHelper from "../util/scrollbar";
import BaseComponent from "../base-component";
import Backdrop from "../util/backdrop";
import FocusTrap from "../util/focusTrap";
import { enableDismissTrigger } from "../util/component-functions";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "modal";
const DATA_KEY = "te.modal";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const ESCAPE_KEY = "Escape";

const Default = {
  backdrop: true,
  keyboard: true,
  focus: true,
};

const DefaultType = {
  backdrop: "(boolean|string)",
  keyboard: "boolean",
  focus: "boolean",
};

const DefaultClasses = {
  show: "transform-none",
  static: "scale-[1.02]",
  staticProperties: "transition-scale duration-300 ease-in-out",
};

const DefaultClassesType = {
  show: "string",
  static: "string",
  staticProperties: "string",
};

const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const OPEN_SELECTOR_BODY = "data-te-modal-open";
const OPEN_SELECTOR = "data-te-open";
const SELECTOR_DIALOG = "[data-te-modal-dialog-ref]";
const SELECTOR_MODAL_BODY = "[data-te-modal-body-ref]";
const SELECTOR_DATA_TOGGLE = '[data-te-toggle="modal"]';

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Modal extends BaseComponent {
  constructor(element, config, classes) {
    super(element);

    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._ignoreBackdropClick = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
  }

  // Getters

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget,
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;

    if (this._isAnimated()) {
      this._isTransitioning = true;
    }

    this._scrollBar.hide();

    document.body.setAttribute(OPEN_SELECTOR_BODY, "true");

    this._adjustDialog();

    this._setEscapeEvent();
    this._setResizeEvent();

    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
      EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, (event) => {
        if (event.target === this._element) {
          this._ignoreBackdropClick = true;
        }
      });
    });

    this._showBackdrop(() => this._showElement(relatedTarget));
  }

  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    this._isShown = false;
    const isAnimated = this._isAnimated();

    if (isAnimated) {
      this._isTransitioning = true;
    }

    this._setEscapeEvent();
    this._setResizeEvent();

    this._focustrap.disable();

    const modalDialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    modalDialog.classList.remove(this._classes.show);

    EventHandler.off(this._element, EVENT_CLICK_DISMISS);
    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

    this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    this._element.removeAttribute(OPEN_SELECTOR);
  }

  dispose() {
    [window, this._dialog].forEach((htmlElement) =>
      EventHandler.off(htmlElement, EVENT_KEY)
    );

    this._backdrop.dispose();
    this._focustrap.disable();
    super.dispose();
  }

  handleUpdate() {
    this._adjustDialog();
  }

  // Private

  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop), // 'static' option will be translated to true, and booleans will keep their value
      isAnimated: this._isAnimated(),
    });
  }

  _initializeFocusTrap() {
    return new FocusTrap(this._element, {
      event: "keydown",
      condition: (event) => event.key === "Tab",
    });
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === "object" ? config : {}),
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

  _showElement(relatedTarget) {
    const isAnimated = this._isAnimated();
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

    if (
      !this._element.parentNode ||
      this._element.parentNode.nodeType !== Node.ELEMENT_NODE
    ) {
      // Don't move modal's DOM position
      document.body.append(this._element);
    }

    this._element.style.display = "block";
    this._element.classList.remove("hidden");
    this._element.removeAttribute("aria-hidden");
    this._element.setAttribute("aria-modal", true);
    this._element.setAttribute("role", "dialog");
    this._element.setAttribute(`${OPEN_SELECTOR}`, "true");
    this._element.scrollTop = 0;

    const modalDialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);

    modalDialog.classList.add(this._classes.show);
    modalDialog.classList.remove("opacity-0");
    modalDialog.classList.add("opacity-100");

    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    if (isAnimated) {
      reflow(this._element);
    }

    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.trap();
      }

      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget,
      });
    };

    this._queueCallback(transitionComplete, this._dialog, isAnimated);
  }

  _setEscapeEvent() {
    if (this._isShown) {
      EventHandler.on(document, EVENT_KEYDOWN_DISMISS, (event) => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          event.preventDefault();
          this.hide();
        } else if (!this._config.keyboard && event.key === ESCAPE_KEY) {
          this._triggerBackdropTransition();
        }
      });
    } else {
      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS);
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
    } else {
      EventHandler.off(window, EVENT_RESIZE);
    }
  }

  _hideModal() {
    const modalDialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    modalDialog.classList.remove(this._classes.show);
    modalDialog.classList.remove("opacity-100");
    modalDialog.classList.add("opacity-0");

    setTimeout(() => {
      this._element.style.display = "none";
    }, 300);

    this._element.setAttribute("aria-hidden", true);
    this._element.removeAttribute("aria-modal");
    this._element.removeAttribute("role");
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.removeAttribute(OPEN_SELECTOR_BODY);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    });
  }

  _showBackdrop(callback) {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, (event) => {
      if (this._ignoreBackdropClick) {
        this._ignoreBackdropClick = false;
        return;
      }

      if (event.target !== event.currentTarget) {
        return;
      }

      if (this._config.backdrop === true) {
        this.hide();
      } else if (this._config.backdrop === "static") {
        this._triggerBackdropTransition();
      }
    });

    this._backdrop.show(callback);
  }

  _isAnimated() {
    const animate = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    return !!animate;
  }

  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    if (hideEvent.defaultPrevented) {
      return;
    }

    const { classList, scrollHeight, style } = this._element;
    const isModalOverflowing =
      scrollHeight > document.documentElement.clientHeight;

    // return if the following background transition hasn't yet completed
    if (
      (!isModalOverflowing && style.overflowY === "hidden") ||
      classList.contains(this._classes.static)
    ) {
      return;
    }

    if (!isModalOverflowing) {
      style.overflowY = "hidden";
    }

    classList.add(...this._classes.static.split(" "));
    classList.add(...this._classes.staticProperties.split(" "));

    this._queueCallback(() => {
      classList.remove(this._classes.static);

      setTimeout(() => {
        classList.remove(...this._classes.staticProperties.split(" "));
      }, 300);

      if (!isModalOverflowing) {
        this._queueCallback(() => {
          style.overflowY = "";
        }, this._dialog);
      }
    }, this._dialog);

    this._element.focus();
  }

  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------

  _adjustDialog() {
    const isModalOverflowing =
      this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;

    if (
      (!isBodyOverflowing && isModalOverflowing && !isRTL()) ||
      (isBodyOverflowing && !isModalOverflowing && isRTL())
    ) {
      this._element.style.paddingLeft = `${scrollbarWidth}px`;
    }

    if (
      (isBodyOverflowing && !isModalOverflowing && !isRTL()) ||
      (!isBodyOverflowing && isModalOverflowing && isRTL())
    ) {
      this._element.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = "";
    this._element.style.paddingRight = "";
  }

  // Static

  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);

      if (typeof config !== "string") {
        return;
      }

      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](relatedTarget);
    });
  }
}

/*
------------------------------------------------------------------------
Data Api implementation
------------------------------------------------------------------------
*/

EventHandler.on(
  document,
  EVENT_CLICK_DATA_API,
  SELECTOR_DATA_TOGGLE,
  function (event) {
    const target = getElementFromSelector(this);

    if (["A", "AREA"].includes(this.tagName)) {
      event.preventDefault();
    }

    EventHandler.one(target, EVENT_SHOW, (showEvent) => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
      }

      EventHandler.one(target, EVENT_HIDDEN, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });

    // avoid conflict when clicking moddal toggler while another one is open
    const allReadyOpen = SelectorEngine.findOne(`[${OPEN_SELECTOR}="true"]`);
    if (allReadyOpen) {
      Modal.getInstance(allReadyOpen).hide();
    }

    const data = Modal.getOrCreateInstance(target);

    data.toggle(this);
  }
);

enableDismissTrigger(Modal);

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Modal to jQuery only if jQuery is present
 */

defineJQueryPlugin(Modal);

export default Modal;
