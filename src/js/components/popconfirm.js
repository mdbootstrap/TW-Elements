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

import { createPopper } from "@popperjs/core";
import { element, typeCheckConfig, getUID } from "../util/index";
import Data from "../dom/data";
import EventHandler from "../dom/event-handler";
import SelectorEngine from "../dom/selector-engine";
import Manipulator from "../dom/manipulator";
import { ESCAPE } from "../util/keycodes";
import Ripple from "../methods/ripple";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "popconfirm";
const DATA_KEY = "te.popconfirm";
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_CANCEL = `cancel${EVENT_KEY}`;
const EVENT_CONFIRM = `confirm${EVENT_KEY}`;
const SELECTOR_ATTR_POPCONFIRM_BODY = "[data-te-popconfirm-body]";
const ATTR_POPCONFIRM_POPOVER = "data-te-popconfirm-popover";
const ATTR_POPCONFIRM_MODAL = "data-te-popconfirm-modal";
const ATTR_POPCONFIRM_BACKDROP = "data-te-popconfirm-backdrop";

const DefaultType = {
  popconfirmMode: "string",
  message: "string",
  cancelText: "(null|string)",
  okText: "(null|string)",
  popconfirmIconTemplate: "string",
  cancelLabel: "(null|string)",
  confirmLabel: "(null|string)",
  position: "(null|string)",
};

const Default = {
  popconfirmMode: "inline",
  message: "Are you sure?",
  cancelText: "Cancel",
  okText: "OK",
  popconfirmIconTemplate: ``,
  cancelLabel: "Cancel",
  confirmLabel: "Confirm",
  position: "bottom",
};

const DefaultClassesType = {
  backdrop: "string",
  body: "string",
  btnCancel: "string",
  btnConfirm: "string",
  btnsContainer: "string",
  fade: "string",
  icon: "string",
  message: "string",
  messageText: "string",
  modal: "string",
  popover: "string",
};

const DefaultClasses = {
  backdrop:
    "h-full w-full z-[1070] fixed top-0 left-0 bg-[#00000066] flex justify-center items-center",
  body: "p-[1rem] bg-white rounded-[0.5rem] opacity-0 dark:bg-neutral-700",
  btnCancel:
    "inline-block rounded bg-primary-100 px-4 pb-[5px] pt-[6px] text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200",
  btnConfirm:
    "inline-block rounded bg-primary px-4 pb-[5px] pt-[6px] text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]",
  btnsContainer: "flex justify-end space-x-2",
  fade: "transition-opacity duration-[150ms] ease-linear",
  icon: "pr-2",
  message: "flex mb-3",
  messageText: "text-neutral-600 dark:text-white",
  modal: "absolute w-[300px] z-[1080] shadow-sm rounded-[0.5rem]",
  popover: "w-[300px] border-0 rounded-[0.5rem] z-[1080] shadow-sm",
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Popconfirm {
  constructor(element, options, classes) {
    this._element = element;
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);
    this._popper = null;
    this._cancelButton = "";
    this._confirmButton = "";
    this._isOpen = false;
    this._uid = this._element.id
      ? `popconfirm-${this._element.id}`
      : getUID("popconfirm-");

    if (element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._clickHandler = this.open.bind(this);
    EventHandler.on(this._element, "click", this._clickHandler);
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get container() {
    return SelectorEngine.findOne(`#${this._uid}`);
  }

  get popconfirmBody() {
    return SelectorEngine.findOne(
      SELECTOR_ATTR_POPCONFIRM_BODY,
      this.container
    );
  }

  // Public

  dispose() {
    if (this._isOpen || this.container !== null) {
      this.close();
    }
    Data.removeData(this._element, DATA_KEY);
    EventHandler.off(this._element, "click", this._clickHandler);
    this._element = null;
  }

  open() {
    if (this._isOpen) {
      return;
    }
    if (this._options.popconfirmMode === "inline") {
      this._openPopover(this._getPopoverTemplate());
    } else {
      this._openModal(this._getModalTemplate());
    }
    this._handleCancelButtonClick();
    this._handleConfirmButtonClick();
    this._listenToEscapeKey();
    this._listenToOutsideClick();
  }

  close() {
    if (!this._isOpen) {
      return;
    }
    if (
      this._popper !== null ||
      SelectorEngine.findOne(`[${ATTR_POPCONFIRM_POPOVER}]`) !== null
    ) {
      EventHandler.on(
        this.popconfirmBody,
        "transitionend",
        this._handlePopconfirmTransitionEnd.bind(this)
      );
      Manipulator.removeClass(this.popconfirmBody, "opacity-100");
    } else {
      const tempElement = SelectorEngine.findOne(
        `[${ATTR_POPCONFIRM_BACKDROP}]`
      );
      Manipulator.removeClass(this.popconfirmBody, "opacity-100");
      document.body.removeChild(tempElement);
      this._isOpen = false;
    }

    EventHandler.off(document, "click", this._handleOutsideClick.bind(this));
    EventHandler.off(document, "keydown", this._handleEscapeKey.bind(this));
  }

  _handlePopconfirmTransitionEnd(event) {
    if (event.target !== this.popconfirmBody) {
      return;
    }

    const popoverTemplate = SelectorEngine.findOne(
      `[${ATTR_POPCONFIRM_POPOVER}]`
    );
    EventHandler.off(this.popconfirmBody, "transitionend");

    if (this._isOpen && event && event.propertyName === "opacity") {
      this._popper.destroy();

      if (popoverTemplate) {
        document.body.removeChild(popoverTemplate);
      }

      this._isOpen = false;
    }
  }

  // Private

  _getPopoverTemplate() {
    const popover = element("div");
    const popconfirmTemplate = this._getPopconfirmTemplate();
    popover.setAttribute(ATTR_POPCONFIRM_POPOVER, "");
    Manipulator.addClass(popover, this._classes.popover);
    popover.id = this._uid;
    popover.innerHTML = popconfirmTemplate;
    return popover;
  }

  _getModalTemplate() {
    const modal = element("div");
    const popconfirmTemplate = this._getPopconfirmTemplate();
    modal.setAttribute(ATTR_POPCONFIRM_MODAL, "");
    Manipulator.addClass(modal, `${this._classes.modal}`);
    modal.id = this._uid;
    modal.innerHTML = popconfirmTemplate;
    return modal;
  }

  _getPopconfirmTemplate() {
    return `<div data-te-popconfirm-body class="${this._classes.body}">
      <p class="${this._classes.message}">
      ${
        this._options.popconfirmIconTemplate
          ? `<span class="${this._classes.icon}">${this._options.popconfirmIconTemplate}</span>`
          : ""
      }
      <span class="${this._classes.messageText}">${this._options.message}</span>
      </p>
      <div class="${this._classes.btnsContainer}">
      ${
        this._options.cancelText
          ? `<button type="button" data-te-ripple-init data-te-ripple-color="light" id="popconfirm-button-cancel" aria-label="${this._options.cancelLabel}"
        class="${this._classes.btnCancel}">${this._options.cancelText}</button>`
          : ""
      }
      <button type="button" data-te-ripple-init data-te-ripple-color="light" id="popconfirm-button-confirm"
      aria-label="${this._options.confirmLabel}"
      class="${this._classes.btnConfirm}">${
      this._options.okText ? this._options.okText : "Ok"
    }</button>
      </div>
    </div>`;
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...config,
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

  _openPopover(template) {
    this._popper = createPopper(this._element, template, {
      placement: this._translatePositionValue(),
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 5],
          },
        },
      ],
    });
    document.body.appendChild(template);

    setTimeout(() => {
      Manipulator.addClass(
        this.popconfirmBody,
        `${this._classes.fade} opacity-100`
      );
      this._isOpen = true;
    }, 0);
  }

  _openModal(template) {
    const backdrop = element("div");
    backdrop.setAttribute(ATTR_POPCONFIRM_BACKDROP, "");
    Manipulator.addClass(backdrop, this._classes.backdrop);
    document.body.appendChild(backdrop);
    backdrop.appendChild(template);
    Manipulator.addClass(this.popconfirmBody, "opacity-100");
    this._isOpen = true;
  }

  _handleCancelButtonClick() {
    const container = this.container;

    this._cancelButton = SelectorEngine.findOne(
      "#popconfirm-button-cancel",
      container
    );

    Ripple.getOrCreateInstance(this._cancelButton, { rippleColor: "light" });
    if (this._cancelButton !== null) {
      EventHandler.on(this._cancelButton, "click", () => {
        this.close();
        EventHandler.trigger(this._element, EVENT_CANCEL);
      });
    }
  }

  _handleConfirmButtonClick() {
    const container = this.container;
    this._confirmButton = SelectorEngine.findOne(
      "#popconfirm-button-confirm",
      container
    );

    Ripple.getOrCreateInstance(this._confirmButton, { rippleColor: "light" });
    EventHandler.on(this._confirmButton, "click", () => {
      this.close();
      EventHandler.trigger(this._element, EVENT_CONFIRM);
    });
  }

  _listenToEscapeKey() {
    EventHandler.on(document, "keydown", this._handleEscapeKey.bind(this));
  }

  _handleEscapeKey(event) {
    if (event.keyCode === ESCAPE) {
      this.close();
    }
  }

  _listenToOutsideClick() {
    EventHandler.on(document, "click", this._handleOutsideClick.bind(this));
  }

  _handleOutsideClick(event) {
    const container = this.container;
    const isContainer = event.target === container;
    const isContainerContent = container && container.contains(event.target);
    const isElement = event.target === this._element;
    const isElementContent =
      this._element && this._element.contains(event.target);
    if (
      !isContainer &&
      !isContainerContent &&
      !isElement &&
      !isElementContent
    ) {
      this.close();
    }
  }

  _translatePositionValue() {
    switch (this._options.position) {
      // left, right as default
      case "top left":
        return "top-end";
      case "top":
        return "top";
      case "top right":
        return "top-start";
      case "bottom left":
        return "bottom-end";
      case "bottom":
        return "bottom";
      case "bottom right":
        return "bottom-start";
      case "left":
        return "left";
      case "left top":
        return "left-end";
      case "left bottom":
        return "left-start";
      case "right":
        return "right";
      case "right top":
        return "right-end";
      case "right bottom":
        return "right-start";
      case undefined:
        return "bottom";
      default:
        return "bottom";
    }
  }

  // Static

  static jQueryInterface(config, options) {
    return this.each(function () {
      const data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;

      if (!data && /dispose/.test(config)) {
        return;
      }

      if (!data) {
        // eslint-disable-next-line consistent-return
        return new Popconfirm(this, _config);
      }

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](options);
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

export default Popconfirm;
