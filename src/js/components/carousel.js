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

import {
  getElementFromSelector,
  isRTL,
  isVisible,
  getNextActiveElement,
  reflow,
  triggerTransitionEnd,
  typeCheckConfig,
} from "../util/index";
import EventHandler from "../dom/event-handler";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import BaseComponent from "../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "carousel";
const DATA_KEY = "te.carousel";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";

const ARROW_LEFT_KEY = "ArrowLeft";
const ARROW_RIGHT_KEY = "ArrowRight";
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch
const SWIPE_THRESHOLD = 40;

const Default = {
  interval: 5000,
  keyboard: true,
  ride: false,
  pause: "hover",
  wrap: true,
  touch: true,
};

const DefaultType = {
  interval: "(number|boolean)",
  keyboard: "boolean",
  ride: "(boolean|string)",
  pause: "(string|boolean)",
  wrap: "boolean",
  touch: "boolean",
};

const DefaultClasses = {
  pointer: "touch-pan-y",
  block: "!block",
  visible: "data-[te-carousel-fade]:opacity-100 data-[te-carousel-fade]:z-[1]",
  invisible:
    "data-[te-carousel-fade]:z-0 data-[te-carousel-fade]:opacity-0 data-[te-carousel-fade]:duration-[600ms] data-[te-carousel-fade]:delay-600",
  slideRight: "translate-x-full",
  slideLeft: "-translate-x-full",
};

const DefaultClassesType = {
  pointer: "string",
  block: "string",
  visible: "string",
  invisible: "string",
  slideRight: "string",
  slideLeft: "string",
};

const ORDER_NEXT = "next";
const ORDER_PREV = "prev";
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";

const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY]: DIRECTION_LEFT,
};

const EVENT_SLIDE = `slide${EVENT_KEY}`;
const EVENT_SLID = `slid${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const ATTR_CAROUSEL = "data-te-carousel-init";
const ATTR_ACTIVE = "data-te-carousel-active";
const ATTR_END = "data-te-carousel-item-end";
const ATTR_START = "data-te-carousel-item-start";
const ATTR_NEXT = "data-te-carousel-item-next";
const ATTR_PREV = "data-te-carousel-item-prev";
const ATTR_POINTER_EVENT = "data-te-carousel-pointer-event";

const SELECTOR_DATA_CAROUSEL_INIT = "[data-te-carousel-init]";
const SELECTOR_DATA_ACTIVE = "[data-te-carousel-active]";
const SELECTOR_DATA_ITEM = "[data-te-carousel-item]";
const SELECTOR_DATA_ACTIVE_ITEM = `${SELECTOR_DATA_ACTIVE}${SELECTOR_DATA_ITEM}`;
const SELECTOR_DATA_ITEM_IMG = `${SELECTOR_DATA_ITEM} img`;
const SELECTOR_DATA_NEXT_PREV =
  "[data-te-carousel-item-next], [data-te-carousel-item-prev]";
const SELECTOR_DATA_INDICATORS = "[data-te-carousel-indicators]";
const SELECTOR_INDICATOR = "[data-te-target]";
const SELECTOR_DATA_SLIDE = "[data-te-slide], [data-te-slide-to]";

const POINTER_TYPE_TOUCH = "touch";
const POINTER_TYPE_PEN = "pen";

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/
class Carousel extends BaseComponent {
  constructor(element, config, classes) {
    super(element);

    this._items = null;
    this._interval = null;
    this._activeElement = null;
    this._isPaused = false;
    this._isSliding = false;
    this.touchTimeout = null;
    this.touchStartX = 0;
    this.touchDeltaX = 0;

    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
    this._indicatorsElement = SelectorEngine.findOne(
      SELECTOR_DATA_INDICATORS,
      this._element
    );
    this._touchSupported =
      "ontouchstart" in document.documentElement ||
      navigator.maxTouchPoints > 0;
    this._pointerEvent = Boolean(window.PointerEvent);

    this._setActiveElementClass();
    this._addEventListeners();
    this._didInit = false;
    this._init();
    if (this._config.ride === "carousel") {
      this.cycle();
    }
  }

  // Getters

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  // Public

  next() {
    this._slide(ORDER_NEXT);
  }

  nextWhenVisible() {
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }

  prev() {
    this._slide(ORDER_PREV);
  }

  pause(event) {
    if (!event) {
      this._isPaused = true;
    }

    if (SelectorEngine.findOne(SELECTOR_DATA_NEXT_PREV, this._element)) {
      triggerTransitionEnd(this._element);
      this.cycle(true);
    }

    clearInterval(this._interval);
    this._interval = null;
  }

  cycle(event) {
    if (!event) {
      this._isPaused = false;
    }

    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }

    if (this._config && this._config.interval && !this._isPaused) {
      this._updateInterval();

      this._interval = setInterval(
        (document.visibilityState ? this.nextWhenVisible : this.next).bind(
          this
        ),
        this._config.interval
      );
    }
  }

  to(index) {
    this._activeElement = SelectorEngine.findOne(
      SELECTOR_DATA_ACTIVE_ITEM,
      this._element
    );
    const activeIndex = this._getItemIndex(this._activeElement);

    if (index > this._items.length - 1 || index < 0) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }

    if (activeIndex === index) {
      this.pause();
      this.cycle();
      return;
    }

    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

    this._slide(order, this._items[index]);
  }

  // Private
  _init() {
    if (this._didInit) {
      return;
    }
    EventHandler.on(
      document,
      EVENT_CLICK_DATA_API,
      SELECTOR_DATA_SLIDE,
      Carousel.dataApiClickHandler
    );

    EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
      const carousels = SelectorEngine.find(SELECTOR_DATA_CAROUSEL_INIT);

      for (let i = 0, len = carousels.length; i < len; i++) {
        Carousel.carouselInterface(
          carousels[i],
          Carousel.getInstance(carousels[i])
        );
      }
    });

    this._didInit = true;
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

  _enableCycle() {
    if (!this._config.ride) {
      return;
    }

    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }

    this.cycle();
  }

  _applyInitialClasses() {
    const activeElement = SelectorEngine.findOne(
      SELECTOR_DATA_ACTIVE_ITEM,
      this._element
    );
    activeElement.classList.add(
      this._classes.block,
      ...this._classes.visible.split(" ")
    );

    this._setActiveIndicatorElement(activeElement);
  }

  _handleSwipe() {
    const absDeltax = Math.abs(this.touchDeltaX);

    if (absDeltax <= SWIPE_THRESHOLD) {
      return;
    }

    const direction = absDeltax / this.touchDeltaX;

    this.touchDeltaX = 0;

    if (!direction) {
      return;
    }

    this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
  }

  _setActiveElementClass() {
    this._activeElement = SelectorEngine.findOne(
      SELECTOR_DATA_ACTIVE_ITEM,
      this._element
    );
    Manipulator.addClass(this._activeElement, "hidden");
  }

  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN, (event) =>
        this._keydown(event)
      );
    }

    if (this._config.pause === "hover") {
      EventHandler.on(this._element, EVENT_MOUSEENTER, (event) =>
        this.pause(event)
      );
      EventHandler.on(this._element, EVENT_MOUSELEAVE, (event) =>
        this._enableCycle(event)
      );
    }

    if (this._config.touch && this._touchSupported) {
      this._addTouchEventListeners();
    }

    this._applyInitialClasses();
  }

  _addTouchEventListeners() {
    const hasPointerPenTouch = (event) => {
      return (
        this._pointerEvent &&
        (event.pointerType === POINTER_TYPE_PEN ||
          event.pointerType === POINTER_TYPE_TOUCH)
      );
    };

    const start = (event) => {
      if (hasPointerPenTouch(event)) {
        this.touchStartX = event.clientX;
      } else if (!this._pointerEvent) {
        this.touchStartX = event.touches[0].clientX;
      }
    };

    const move = (event) => {
      // ensure swiping with one touch and not pinching
      this.touchDeltaX =
        event.touches && event.touches.length > 1
          ? 0
          : event.touches[0].clientX - this.touchStartX;
    };

    const end = (event) => {
      if (hasPointerPenTouch(event)) {
        this.touchDeltaX = event.clientX - this.touchStartX;
      }

      this._handleSwipe();
      if (this._config.pause === "hover") {
        // If it's a touch-enabled device, mouseenter/leave are fired as
        // part of the mouse compatibility events on first tap - the carousel
        // would stop cycling until user tapped out of it;
        // here, we listen for touchend, explicitly pause the carousel
        // (as if it's the second time we tap on it, mouseenter compat event
        // is NOT fired) and after a timeout (to allow for mouse compatibility
        // events to fire) we explicitly restart cycling

        this.pause();
        if (this.touchTimeout) {
          clearTimeout(this.touchTimeout);
        }

        this.touchTimeout = setTimeout(
          (event) => this._enableCycle(event),
          TOUCHEVENT_COMPAT_WAIT + this._config.interval
        );
      }
    };

    SelectorEngine.find(SELECTOR_DATA_ITEM_IMG, this._element).forEach(
      (itemImg) => {
        EventHandler.on(itemImg, EVENT_DRAG_START, (event) =>
          event.preventDefault()
        );
      }
    );

    if (this._pointerEvent) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, (event) =>
        start(event)
      );
      EventHandler.on(this._element, EVENT_POINTERUP, (event) => end(event));

      this._element.classList.add(this._classes.pointer);
      this._element.setAttribute(`${ATTR_POINTER_EVENT}`, "");
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, (event) => start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, (event) => move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, (event) => end(event));
    }
  }

  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }

    const direction = KEY_TO_DIRECTION[event.key];
    if (direction) {
      event.preventDefault();
      this._slide(direction);
    }
  }

  _getItemIndex(element) {
    this._items =
      element && element.parentNode
        ? SelectorEngine.find(SELECTOR_DATA_ITEM, element.parentNode)
        : [];

    return this._items.indexOf(element);
  }

  _getItemByOrder(order, activeElement) {
    const isNext = order === ORDER_NEXT;
    return getNextActiveElement(
      this._items,
      activeElement,
      isNext,
      this._config.wrap
    );
  }

  _triggerSlideEvent(relatedTarget, eventDirectionName) {
    const targetIndex = this._getItemIndex(relatedTarget);
    const fromIndex = this._getItemIndex(
      SelectorEngine.findOne(SELECTOR_DATA_ACTIVE_ITEM, this._element)
    );

    return EventHandler.trigger(this._element, EVENT_SLIDE, {
      relatedTarget,
      direction: eventDirectionName,
      from: fromIndex,
      to: targetIndex,
    });
  }

  _setActiveIndicatorElement(element) {
    if (this._indicatorsElement) {
      const activeIndicator = SelectorEngine.findOne(
        SELECTOR_DATA_ACTIVE,
        this._indicatorsElement
      );

      activeIndicator.removeAttribute(ATTR_ACTIVE);
      activeIndicator.removeAttribute("aria-current");
      activeIndicator.classList.remove("!opacity-100");

      const indicators = SelectorEngine.find(
        SELECTOR_INDICATOR,
        this._indicatorsElement
      );

      for (let i = 0; i < indicators.length; i++) {
        if (
          Number.parseInt(
            indicators[i].getAttribute("data-te-slide-to"),
            10
          ) === this._getItemIndex(element)
        ) {
          indicators[i].setAttribute(`${ATTR_ACTIVE}`, "");
          indicators[i].setAttribute("aria-current", "true");
          indicators[i].classList.add("!opacity-100");
          break;
        }
      }
    }
  }

  _updateInterval() {
    const element =
      this._activeElement ||
      SelectorEngine.findOne(SELECTOR_DATA_ACTIVE_ITEM, this._element);

    if (!element) {
      return;
    }

    const elementInterval = Number.parseInt(
      element.getAttribute("data-te-interval"),
      10
    );

    if (elementInterval) {
      this._config.defaultInterval =
        this._config.defaultInterval || this._config.interval;
      this._config.interval = elementInterval;
    } else {
      this._config.interval =
        this._config.defaultInterval || this._config.interval;
    }
  }

  _slide(directionOrOrder, element) {
    const order = this._directionToOrder(directionOrOrder);

    const activeElement = SelectorEngine.findOne(
      SELECTOR_DATA_ACTIVE_ITEM,
      this._element
    );
    const activeElementIndex = this._getItemIndex(activeElement);

    const nextElement = element || this._getItemByOrder(order, activeElement);
    const nextElementIndex = this._getItemIndex(nextElement);

    const isCycling = Boolean(this._interval);

    const isNext = order === ORDER_NEXT;
    const directionalAttr = isNext ? ATTR_START : ATTR_END;
    const orderAttr = isNext ? ATTR_NEXT : ATTR_PREV;
    const eventDirectionName = this._orderToDirection(order);

    const activeClass =
      directionalAttr === ATTR_START
        ? this._classes.slideLeft
        : this._classes.slideRight;
    const nextClass =
      directionalAttr !== ATTR_START
        ? this._classes.slideLeft
        : this._classes.slideRight;

    if (nextElement && nextElement.hasAttribute(ATTR_ACTIVE)) {
      this._isSliding = false;
      return;
    }

    if (this._isSliding) {
      return;
    }

    const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
    if (slideEvent.defaultPrevented) {
      return;
    }

    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      return;
    }

    this._isSliding = true;

    if (isCycling) {
      this.pause();
    }

    this._setActiveIndicatorElement(nextElement);
    this._activeElement = nextElement;

    const triggerSlidEvent = () => {
      EventHandler.trigger(this._element, EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex,
      });
    };

    if (this._element.hasAttribute(ATTR_CAROUSEL)) {
      nextElement.setAttribute(`${orderAttr}`, "");
      nextElement.classList.add(this._classes.block, nextClass);

      reflow(nextElement);

      activeElement.setAttribute(`${directionalAttr}`, "");
      activeElement.classList.add(
        activeClass,
        ...this._classes.invisible.split(" ")
      );
      activeElement.classList.remove(...this._classes.visible.split(" "));

      nextElement.setAttribute(`${directionalAttr}`, "");
      nextElement.classList.add(...this._classes.visible.split(" "));
      nextElement.classList.remove(
        this._classes.slideRight,
        this._classes.slideLeft
      );

      const completeCallBack = () => {
        nextElement.removeAttribute(directionalAttr);
        nextElement.removeAttribute(orderAttr);
        nextElement.setAttribute(`${ATTR_ACTIVE}`, "");

        activeElement.removeAttribute(ATTR_ACTIVE);
        activeElement.classList.remove(
          activeClass,
          ...this._classes.invisible.split(" "),
          this._classes.block
        );
        activeElement.removeAttribute(orderAttr);
        activeElement.removeAttribute(directionalAttr);

        this._isSliding = false;

        setTimeout(triggerSlidEvent, 0);
      };

      this._queueCallback(completeCallBack, activeElement, true);
    } else {
      activeElement.removeAttribute(ATTR_ACTIVE);
      activeElement.classList.remove(this._classes.block);

      nextElement.setAttribute(`${ATTR_ACTIVE}`, "");
      nextElement.classList.add(this._classes.block);

      this._isSliding = false;
      triggerSlidEvent();
    }

    if (isCycling) {
      this.cycle();
    }
  }

  _directionToOrder(direction) {
    if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
      return direction;
    }

    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }

    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }

  _orderToDirection(order) {
    if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
      return order;
    }

    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }

    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  }

  // Static

  static carouselInterface(element, config) {
    const data = Carousel.getOrCreateInstance(element, config);

    let { _config } = data;
    if (typeof config === "object") {
      _config = {
        ..._config,
        ...config,
      };
    }
    const action = typeof config === "string" ? config : config.slide;

    if (typeof config === "number") {
      data.to(config);
      return;
    }
    if (typeof action === "string") {
      if (typeof data[action] === "undefined") {
        throw new TypeError(`No method named "${action}"`);
      }

      data[action]();
    } else if (_config.interval && _config.ride === true) {
      data.pause();
    }
  }

  static jQueryInterface(config) {
    return this.each(function () {
      Carousel.carouselInterface(this, config);
    });
  }

  static dataApiClickHandler(event) {
    const target = getElementFromSelector(this);

    if (!target || !target.hasAttribute(ATTR_CAROUSEL)) {
      return;
    }

    const config = {
      ...Manipulator.getDataAttributes(target),
      ...Manipulator.getDataAttributes(this),
    };
    const slideIndex = this.getAttribute("data-te-slide-to");

    if (slideIndex) {
      config.interval = false;
    }

    Carousel.carouselInterface(target, config);

    if (slideIndex) {
      Carousel.getInstance(target).to(slideIndex);
    }

    event.preventDefault();
  }
}

export default Carousel;
