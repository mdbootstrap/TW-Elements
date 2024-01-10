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

const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = "transitionend";

// Shoutout AngusCroll (https://goo.gl/pxwQGp)
const toType = (obj) => {
  if (obj === null || obj === undefined) {
    return `${obj}`;
  }

  return {}.toString
    .call(obj)
    .match(/\s([a-z]+)/i)[1]
    .toLowerCase();
};

/**
 * --------------------------------------------------------------------------
 * Public Util Api
 * --------------------------------------------------------------------------
 */

const getUID = (prefix) => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));

  return prefix;
};

const getSelector = (element) => {
  let selector = element.getAttribute("data-te-target");

  if (!selector || selector === "#") {
    let hrefAttr = element.getAttribute("href");

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttr || (!hrefAttr.includes("#") && !hrefAttr.startsWith("."))) {
      return null;
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttr.includes("#") && !hrefAttr.startsWith("#")) {
      hrefAttr = `#${hrefAttr.split("#")[1]}`;
    }

    selector = hrefAttr && hrefAttr !== "#" ? hrefAttr.trim() : null;
  }

  return selector;
};

const getSelectorFromElement = (element) => {
  const selector = getSelector(element);

  if (selector) {
    return document.querySelector(selector) ? selector : null;
  }

  return null;
};

const getElementFromSelector = (element) => {
  const selector = getSelector(element);

  return selector ? document.querySelector(selector) : null;
};

const getTransitionDurationFromElement = (element) => {
  if (!element) {
    return 0;
  }

  // Get transition-duration of the element
  let { transitionDuration, transitionDelay } =
    window.getComputedStyle(element);

  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(",")[0];
  transitionDelay = transitionDelay.split(",")[0];

  return (
    (Number.parseFloat(transitionDuration) +
      Number.parseFloat(transitionDelay)) *
    MILLISECONDS_MULTIPLIER
  );
};

const triggerTransitionEnd = (element) => {
  element.dispatchEvent(new Event(TRANSITION_END));
};

const isElement = (obj) => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (typeof obj.jquery !== "undefined") {
    obj = obj[0];
  }

  return typeof obj.nodeType !== "undefined";
};

const getElement = (obj) => {
  if (isElement(obj)) {
    // it's a jQuery object or a node element
    return obj.jquery ? obj[0] : obj;
  }

  if (typeof obj === "string" && obj.length > 0) {
    return document.querySelector(obj);
  }

  return null;
};

const emulateTransitionEnd = (element, duration) => {
  let called = false;
  const durationPadding = 5;
  const emulatedDuration = duration + durationPadding;

  function listener() {
    called = true;
    element.removeEventListener(TRANSITION_END, listener);
  }

  element.addEventListener(TRANSITION_END, listener);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(element);
    }
  }, emulatedDuration);
};

const typeCheckConfig = (componentName, config, configTypes) => {
  Object.keys(configTypes).forEach((property) => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement(value) ? "element" : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new Error(
        `${componentName.toUpperCase()}: ` +
          `Option "${property}" provided type "${valueType}" ` +
          `but expected type "${expectedTypes}".`
      );
    }
  });
};

const isVisible = (element) => {
  if (!element || element.getClientRects().length === 0) {
    return false;
  }

  if (element.style && element.parentNode && element.parentNode.style) {
    const elementStyle = getComputedStyle(element);
    const parentNodeStyle = getComputedStyle(element.parentNode);

    return (
      getComputedStyle(element).getPropertyValue("visibility") === "visible" ||
      (elementStyle.display !== "none" &&
        parentNodeStyle.display !== "none" &&
        elementStyle.visibility !== "hidden")
    );
  }

  return false;
};

const isDisabled = (element) => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }

  if (element.classList.contains("disabled")) {
    return true;
  }

  if (typeof element.disabled !== "undefined") {
    return element.disabled;
  }

  return (
    element.hasAttribute("disabled") &&
    element.getAttribute("disabled") !== "false"
  );
};

const findShadowRoot = (element) => {
  if (!document.documentElement.attachShadow) {
    return null;
  }

  // Can find the shadow root otherwise it'll return the document
  if (typeof element.getRootNode === "function") {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }

  if (element instanceof ShadowRoot) {
    return element;
  }

  // when we don't find a shadow root
  if (!element.parentNode) {
    return null;
  }

  return findShadowRoot(element.parentNode);
};

const noop = () => function () {};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = (element) => {
  // eslint-disable-next-line no-unused-expressions
  element.offsetHeight;
};

const getjQuery = () => {
  const { jQuery } = window;

  if (jQuery && !document.body.hasAttribute("data-te-no-jquery")) {
    return jQuery;
  }

  return null;
};

const DOMContentLoadedCallbacks = [];

const onDOMContentLoaded = (callback) => {
  if (document.readyState === "loading") {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener("DOMContentLoaded", () => {
        DOMContentLoadedCallbacks.forEach((callback) => callback());
      });
    }

    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};

const isRTL = () => document.documentElement.dir === "rtl";

const array = (collection) => {
  return Array.from(collection);
};

const element = (tag) => {
  return document.createElement(tag);
};

const defineJQueryPlugin = (plugin) => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */
    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};

const execute = (callback) => {
  if (typeof callback === "function") {
    callback();
  }
};

const executeAfterTransition = (
  callback,
  transitionElement,
  waitForTransition = true
) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }

  const durationPadding = 5;
  const emulatedDuration =
    getTransitionDurationFromElement(transitionElement) + durationPadding;

  let called = false;

  const handler = ({ target }) => {
    if (target !== transitionElement) {
      return;
    }

    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };

  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};

/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */
const getNextActiveElement = (
  list,
  activeElement,
  shouldGetNext,
  isCycleAllowed
) => {
  let index = list.indexOf(activeElement);

  // if the element does not exist in the list return an element depending on the direction and if cycle is allowed
  if (index === -1) {
    return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
  }

  const listLength = list.length;

  index += shouldGetNext ? 1 : -1;

  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }

  return list[Math.max(0, Math.min(index, listLength - 1))];
};

export {
  getjQuery,
  TRANSITION_END,
  getUID,
  getSelectorFromElement,
  getElementFromSelector,
  getTransitionDurationFromElement,
  triggerTransitionEnd,
  isElement,
  emulateTransitionEnd,
  typeCheckConfig,
  isVisible,
  findShadowRoot,
  noop,
  reflow,
  array,
  element,
  onDOMContentLoaded,
  isRTL,
  defineJQueryPlugin,
  getElement,
  isDisabled,
  execute,
  executeAfterTransition,
  getNextActiveElement,
};
