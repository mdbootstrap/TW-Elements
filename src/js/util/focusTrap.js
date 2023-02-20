/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import SelectorEngine from "../dom/selector-engine";
import { isVisible } from "./index";

class FocusTrap {
  constructor(element, options = {}, toggler) {
    this._element = element;
    this._toggler = toggler;
    this._event = options.event || "blur";
    this._condition = options.condition || (() => true);
    this._selector =
      options.selector ||
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this._onlyVisible = options.onlyVisible || false;
    this._focusableElements = [];
    this._firstElement = null;
    this._lastElement = null;

    this.handler = (e) => {
      if (this._condition(e) && !e.shiftKey && e.target === this._lastElement) {
        e.preventDefault();
        this._firstElement.focus();
      } else if (
        this._condition(e) &&
        e.shiftKey &&
        e.target === this._firstElement
      ) {
        e.preventDefault();
        this._lastElement.focus();
      }
    };
  }

  trap() {
    this._setElements();
    this._init();
    this._setFocusTrap();
  }

  disable() {
    this._focusableElements.forEach((element) => {
      element.removeEventListener(this._event, this.handler);
    });

    if (this._toggler) {
      this._toggler.focus();
    }
  }

  update() {
    this._setElements();
    this._setFocusTrap();
  }

  _init() {
    const handler = (e) => {
      if (
        !this._firstElement ||
        e.key !== "Tab" ||
        this._focusableElements.includes(e.target)
      ) {
        return;
      }

      e.preventDefault();
      this._firstElement.focus();

      window.removeEventListener("keydown", handler);
    };

    window.addEventListener("keydown", handler);
  }

  _filterVisible(elements) {
    return elements.filter((el) => {
      if (!isVisible(el)) return false;

      const ancestors = SelectorEngine.parents(el, "*");

      for (let i = 0; i < ancestors.length; i++) {
        const style = window.getComputedStyle(ancestors[i]);
        if (
          style &&
          (style.display === "none" || style.visibility === "hidden")
        )
          return false;
      }
      return true;
    });
  }

  _setElements() {
    this._focusableElements = SelectorEngine.focusableChildren(this._element);

    if (this._onlyVisible) {
      this._focusableElements = this._filterVisible(this._focusableElements);
    }

    this._firstElement = this._focusableElements[0];
    this._lastElement =
      this._focusableElements[this._focusableElements.length - 1];
  }

  _setFocusTrap() {
    this._focusableElements.forEach((element, i) => {
      if (i === this._focusableElements.length - 1 || i === 0) {
        element.addEventListener(this._event, this.handler);
      } else {
        element.removeEventListener(this._event, this.handler);
      }
    });
  }
}

export default FocusTrap;
