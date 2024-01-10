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

import * as Popper from "@popperjs/core";

import {
  findShadowRoot,
  getElement,
  getUID,
  isElement,
  isRTL,
  noop,
  typeCheckConfig,
} from "../util/index";
import { DefaultAllowlist, sanitizeHtml } from "../util/sanitizer";
import Data from "../dom/data";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import BaseComponent from "../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "tooltip";
const DATA_KEY = "te.tooltip";
const EVENT_KEY = `.${DATA_KEY}`;
const CLASS_PREFIX = "te-tooltip";
const DISALLOWED_ATTRIBUTES = new Set(["sanitize", "allowList", "sanitizeFn"]);

const DefaultType = {
  animation: "boolean",
  template: "string",
  title: "(string|element|function)",
  trigger: "string",
  delay: "(number|object)",
  html: "boolean",
  selector: "(string|boolean)",
  placement: "(string|function)",
  offset: "(array|string|function)",
  container: "(string|element|boolean)",
  fallbackPlacements: "array",
  boundary: "(string|element)",
  customClass: "(string|function)",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  allowList: "object",
  popperConfig: "(null|object|function)",
};

const AttachmentMap = {
  AUTO: "auto",
  TOP: "top",
  RIGHT: isRTL() ? "left" : "right",
  BOTTOM: "bottom",
  LEFT: isRTL() ? "right" : "left",
};

const Default = {
  animation: true,
  template:
    '<div class="opacity-0 transition-opacity duration-300 ease-in-out absolute z-[1080] block m-0 text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal" role="tooltip">' +
    '<div data-te-tooltip-inner-ref class="tooltip-inner max-w-[200px] text-sm py-1.5 px-4 text-white text-center bg-[#6d6d6d] rounded"></div>' +
    "</div>",
  trigger: "hover focus",
  title: "",
  delay: 0,
  html: false,
  selector: false,
  placement: "top",
  offset: [0, 0],
  container: false,
  fallbackPlacements: ["top", "right", "bottom", "left"],
  boundary: "clippingParents",
  customClass: "",
  sanitize: true,
  sanitizeFn: null,
  allowList: DefaultAllowlist,
  popperConfig: { hide: true },
};

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`,
};

const CLASS_NAME_FADE = "fade";
const CLASS_NAME_MODAL = "modal";
const CLASS_NAME_SHOW = "show";

const HOVER_STATE_SHOW = "show";
const HOVER_STATE_OUT = "out";

const SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;

const EVENT_MODAL_HIDE = "hide.te.modal";

const TRIGGER_HOVER = "hover";
const TRIGGER_FOCUS = "focus";
const TRIGGER_CLICK = "click";
const TRIGGER_MANUAL = "manual";

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof Popper === "undefined") {
      throw new TypeError(
        "Bootstrap's tooltips require Popper (https://popper.js.org)"
      );
    }

    super(element);

    // private
    this._isEnabled = true;
    this._timeout = 0;
    this._hoverState = "";
    this._activeTrigger = {};
    this._popper = null;

    // Protected
    this._config = this._getConfig(config);
    this.tip = null;

    this._setListeners();
  }

  // Getters

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  static get Event() {
    return Event;
  }

  static get DefaultType() {
    return DefaultType;
  }

  // Public

  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }

  toggle(event) {
    if (!this._isEnabled) {
      return;
    }

    if (event) {
      const context = this._initializeOnDelegatedTarget(event);

      context._activeTrigger.click = !context._activeTrigger.click;

      if (context._isWithActiveTrigger()) {
        context._enter(null, context);
      } else {
        context._leave(null, context);
      }
    } else {
      if (this.getTipElement().classList.contains(CLASS_NAME_SHOW)) {
        this._leave(null, this);
        return;
      }

      this._enter(null, this);
    }
  }

  dispose() {
    clearTimeout(this._timeout);

    EventHandler.off(
      this._element.closest(SELECTOR_MODAL),
      EVENT_MODAL_HIDE,
      this._hideModalHandler
    );

    if (this.tip) {
      this.tip.remove();
    }

    this._disposePopper();
    super.dispose();
  }

  show() {
    if (this._element.style.display === "none") {
      throw new Error("Please use show on visible elements");
    }

    if (!(this.isWithContent() && this._isEnabled)) {
      return;
    }

    const showEvent = EventHandler.trigger(
      this._element,
      this.constructor.Event.SHOW
    );
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom =
      shadowRoot === null
        ? this._element.ownerDocument.documentElement.contains(this._element)
        : shadowRoot.contains(this._element);

    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    }

    // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-te-original-title`
    // This will be removed later in favor of a `setContent` method
    if (
      this.constructor.NAME === "tooltip" &&
      this.tip &&
      this.getTitle() !==
        this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML
    ) {
      this._disposePopper();
      this.tip.remove();
      this.tip = null;
    }

    const tip = this.getTipElement();
    const tipId = getUID(this.constructor.NAME);

    tip.setAttribute("id", tipId);
    this._element.setAttribute("aria-describedby", tipId);

    if (this._config.animation) {
      setTimeout(() => {
        this.tip.classList.add("opacity-100");
        this.tip.classList.remove("opacity-0");
      }, 100);
    }

    const placement =
      typeof this._config.placement === "function"
        ? this._config.placement.call(this, tip, this._element)
        : this._config.placement;

    const attachment = this._getAttachment(placement);
    this._addAttachmentClass(attachment);

    const { container } = this._config;
    Data.setData(tip, this.constructor.DATA_KEY, this);

    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
    }

    if (this._popper) {
      this._popper.update();
    } else {
      this._popper = Popper.createPopper(
        this._element,
        tip,
        this._getPopperConfig(attachment)
      );
    }

    const notPopover = tip.getAttribute("id").includes("tooltip");
    if (notPopover) {
      switch (placement) {
        case "bottom":
          tip.classList.add("py-[0.4rem]");
          break;
        case "left":
          tip.classList.add("px-[0.4rem]");
          break;
        case "right":
          tip.classList.add("px-[0.4rem]");
          break;

        default:
          tip.classList.add("py-[0.4rem]");
          break;
      }
    }

    const customClass = this._resolvePossibleFunction(this._config.customClass);
    if (customClass) {
      tip.classList.add(...customClass.split(" "));
    }

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ("ontouchstart" in document.documentElement) {
      [].concat(...document.body.children).forEach((element) => {
        EventHandler.on(element, "mouseover", noop);
      });
    }

    const complete = () => {
      const prevHoverState = this._hoverState;

      this._hoverState = null;
      EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

      if (prevHoverState === HOVER_STATE_OUT) {
        this._leave(null, this);
      }
    };

    const isAnimated = this.tip.classList.contains("transition-opacity");
    this._queueCallback(complete, this.tip, isAnimated);
  }

  hide() {
    if (!this._popper) {
      return;
    }

    const tip = this.getTipElement();
    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }

      if (this._hoverState !== HOVER_STATE_SHOW) {
        tip.remove();
      }

      this._cleanTipClass();
      this._element.removeAttribute("aria-describedby");
      EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

      this._disposePopper();
    };

    const hideEvent = EventHandler.trigger(
      this._element,
      this.constructor.Event.HIDE
    );
    if (hideEvent.defaultPrevented) {
      return;
    }

    tip.classList.add("opacity-0");
    tip.classList.remove("opacity-100");

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ("ontouchstart" in document.documentElement) {
      []
        .concat(...document.body.children)
        .forEach((element) => EventHandler.off(element, "mouseover", noop));
    }

    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;

    const isAnimated = this.tip.classList.contains("opacity-0");
    this._queueCallback(complete, this.tip, isAnimated);
    this._hoverState = "";
  }

  update() {
    if (this._popper !== null) {
      this._popper.update();
    }
  }

  // Protected

  isWithContent() {
    return Boolean(this.getTitle());
  }

  getTipElement() {
    if (this.tip) {
      return this.tip;
    }

    const element = document.createElement("div");
    element.innerHTML = this._config.template;

    const tip = element.children[0];
    this.setContent(tip);
    tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW);

    this.tip = tip;
    return this.tip;
  }

  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
  }

  _sanitizeAndSetContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);

    if (!content && templateElement) {
      templateElement.remove();
      return;
    }

    // we use append for html objects to maintain js events
    this.setElementContent(templateElement, content);
  }

  setElementContent(element, content) {
    if (element === null) {
      return;
    }

    if (isElement(content)) {
      content = getElement(content);

      // content is a DOM node or a jQuery
      if (this._config.html) {
        if (content.parentNode !== element) {
          element.innerHTML = "";
          element.append(content);
        }
      } else {
        element.textContent = content.textContent;
      }

      return;
    }

    if (this._config.html) {
      if (this._config.sanitize) {
        content = sanitizeHtml(
          content,
          this._config.allowList,
          this._config.sanitizeFn
        );
      }

      element.innerHTML = content;
    } else {
      element.textContent = content;
    }
  }

  getTitle() {
    const title =
      this._element.getAttribute("data-te-original-title") ||
      this._config.title;

    return this._resolvePossibleFunction(title);
  }

  updateAttachment(attachment) {
    if (attachment === "right") {
      return "end";
    }

    if (attachment === "left") {
      return "start";
    }

    return attachment;
  }

  // Private

  _initializeOnDelegatedTarget(event, context) {
    return (
      context ||
      this.constructor.getOrCreateInstance(
        event.delegateTarget,
        this._getDelegateConfig()
      )
    );
  }

  _getOffset() {
    const { offset } = this._config;

    if (typeof offset === "string") {
      return offset.split(",").map((val) => Number.parseInt(val, 10));
    }

    if (typeof offset === "function") {
      return (popperData) => offset(popperData, this._element);
    }

    return offset;
  }

  _resolvePossibleFunction(content) {
    return typeof content === "function"
      ? content.call(this._element)
      : content;
  }

  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: this._config.fallbackPlacements,
          },
        },
        {
          name: "offset",
          options: {
            offset: this._getOffset(),
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary,
          },
        },
        {
          name: "arrow",
          options: {
            element: `.${this.constructor.NAME}-arrow`,
          },
        },
        {
          name: "onChange",
          enabled: true,
          phase: "afterWrite",
          fn: (data) => this._handlePopperPlacementChange(data),
        },
      ],
      onFirstUpdate: (data) => {
        if (data.options.placement !== data.placement) {
          this._handlePopperPlacementChange(data);
        }
      },
    };

    return {
      ...defaultBsPopperConfig,
      ...(typeof this._config.popperConfig === "function"
        ? this._config.popperConfig(defaultBsPopperConfig)
        : this._config.popperConfig),
    };
  }

  _addAttachmentClass(attachment) {
    this.getTipElement().classList.add(
      `${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`
    );
  }

  _getAttachment(placement) {
    return AttachmentMap[placement.toUpperCase()];
  }

  _setListeners() {
    const triggers = this._config.trigger.split(" ");

    triggers.forEach((trigger) => {
      if (trigger === "click") {
        EventHandler.on(
          this._element,
          this.constructor.Event.CLICK,
          this._config.selector,
          (event) => this.toggle(event)
        );
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn =
          trigger === TRIGGER_HOVER
            ? this.constructor.Event.MOUSEENTER
            : this.constructor.Event.FOCUSIN;
        const eventOut =
          trigger === TRIGGER_HOVER
            ? this.constructor.Event.MOUSELEAVE
            : this.constructor.Event.FOCUSOUT;

        EventHandler.on(
          this._element,
          eventIn,
          this._config.selector,
          (event) => this._enter(event)
        );
        EventHandler.on(
          this._element,
          eventOut,
          this._config.selector,
          (event) => this._leave(event)
        );
      }
    });

    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };

    EventHandler.on(
      this._element.closest(SELECTOR_MODAL),
      EVENT_MODAL_HIDE,
      this._hideModalHandler
    );

    if (this._config.selector) {
      this._config = {
        ...this._config,
        trigger: "manual",
        selector: "",
      };
    } else {
      this._fixTitle();
    }
  }

  _fixTitle() {
    const title = this._element.getAttribute("title");
    const originalTitleType = typeof this._element.getAttribute(
      "data-te-original-title"
    );

    if (title || originalTitleType !== "string") {
      this._element.setAttribute("data-te-original-title", title || "");
      if (
        title &&
        !this._element.getAttribute("aria-label") &&
        !this._element.textContent
      ) {
        this._element.setAttribute("aria-label", title);
      }

      this._element.setAttribute("title", "");
    }
  }

  _enter(event, context) {
    context = this._initializeOnDelegatedTarget(event, context);

    if (event) {
      context._activeTrigger[
        event.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = true;
    }

    if (
      context.getTipElement().classList.contains(CLASS_NAME_SHOW) ||
      context._hoverState === HOVER_STATE_SHOW
    ) {
      context._hoverState = HOVER_STATE_SHOW;
      return;
    }

    clearTimeout(context._timeout);

    context._hoverState = HOVER_STATE_SHOW;

    if (!context._config.delay || !context._config.delay.show) {
      context.show();
      return;
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_SHOW) {
        context.show();
      }
    }, context._config.delay.show);
  }

  _leave(event, context) {
    context = this._initializeOnDelegatedTarget(event, context);

    if (event) {
      context._activeTrigger[
        event.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER
      ] = context._element.contains(event.relatedTarget);
    }

    if (context._isWithActiveTrigger()) {
      return;
    }

    clearTimeout(context._timeout);

    context._hoverState = HOVER_STATE_OUT;

    if (!context._config.delay || !context._config.delay.hide) {
      context.hide();
      return;
    }

    context._timeout = setTimeout(() => {
      if (context._hoverState === HOVER_STATE_OUT) {
        context.hide();
      }
    }, context._config.delay.hide);
  }

  _isWithActiveTrigger() {
    for (const trigger in this._activeTrigger) {
      if (this._activeTrigger[trigger]) {
        return true;
      }
    }

    return false;
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    Object.keys(dataAttributes).forEach((dataAttr) => {
      if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
        delete dataAttributes[dataAttr];
      }
    });

    config = {
      ...this.constructor.Default,
      ...dataAttributes,
      ...(typeof config === "object" && config ? config : {}),
    };

    config.container =
      config.container === false ? document.body : getElement(config.container);

    if (typeof config.delay === "number") {
      config.delay = {
        show: config.delay,
        hide: config.delay,
      };
    }

    if (typeof config.title === "number") {
      config.title = config.title.toString();
    }

    if (typeof config.content === "number") {
      config.content = config.content.toString();
    }

    typeCheckConfig(NAME, config, this.constructor.DefaultType);

    if (config.sanitize) {
      config.template = sanitizeHtml(
        config.template,
        config.allowList,
        config.sanitizeFn
      );
    }

    return config;
  }

  _getDelegateConfig() {
    const config = {};

    for (const key in this._config) {
      if (this.constructor.Default[key] !== this._config[key]) {
        config[key] = this._config[key];
      }
    }

    // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`
    return config;
  }

  _cleanTipClass() {
    const tip = this.getTipElement();
    const basicClassPrefixRegex = new RegExp(
      `(^|\\s)${this._getBasicClassPrefix()}\\S+`,
      "g"
    );
    const tabClass = tip.getAttribute("class").match(basicClassPrefixRegex);
    if (tabClass !== null && tabClass.length > 0) {
      tabClass
        .map((token) => token.trim())
        .forEach((tClass) => tip.classList.remove(tClass));
    }
  }

  _getBasicClassPrefix() {
    return CLASS_PREFIX;
  }

  _handlePopperPlacementChange(popperData) {
    const { state } = popperData;

    if (!state) {
      return;
    }

    this.tip = state.elements.popper;
    this._cleanTipClass();
    this._addAttachmentClass(this._getAttachment(state.placement));
  }

  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config);

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }
}

export default Tooltip;
