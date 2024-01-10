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
