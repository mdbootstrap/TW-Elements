/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

import { isDisabled, isVisible } from "../util/index";

const NODE_TEXT = 3;

const SelectorEngine = {
  closest(element, selector) {
    return element.closest(selector);
  },

  matches(element, selector) {
    return element.matches(selector);
  },

  find(selector, element = document.documentElement) {
    return [].concat(
      ...Element.prototype.querySelectorAll.call(element, selector)
    );
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },

  children(element, selector) {
    const children = [].concat(...element.children);

    return children.filter((child) => child.matches(selector));
  },

  parents(element, selector) {
    const parents = [];

    let ancestor = element.parentNode;

    while (
      ancestor &&
      ancestor.nodeType === Node.ELEMENT_NODE &&
      ancestor.nodeType !== NODE_TEXT
    ) {
      if (this.matches(ancestor, selector)) {
        parents.push(ancestor);
      }

      ancestor = ancestor.parentNode;
    }

    return parents;
  },

  prev(element, selector) {
    let previous = element.previousElementSibling;

    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }

      previous = previous.previousElementSibling;
    }

    return [];
  },

  next(element, selector) {
    let next = element.nextElementSibling;

    while (next) {
      if (this.matches(next, selector)) {
        return [next];
      }

      next = next.nextElementSibling;
    }

    return [];
  },

  focusableChildren(element) {
    const focusables = [
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "details",
      "[tabindex]",
      '[contenteditable="true"]',
    ]
      .map((selector) => `${selector}:not([tabindex^="-"])`)
      .join(", ");

    return this.find(focusables, element).filter(
      (el) => !isDisabled(el) && isVisible(el)
    );
  },
};

export default SelectorEngine;
