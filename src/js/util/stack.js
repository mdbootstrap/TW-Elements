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

import SelectorEngine from "../dom/selector-engine";
import { isVisible, typeCheckConfig } from "./index";

const NAME = "Stack";

const DEFAULT_OPTIONS = {
  position: "top",
  container: null,
  refresh: 1000,
  filter: (el) => {
    return el;
  },
};

const TYPE_OPTIONS = {
  position: "string",
  container: "(undefined|null|string)",
  refresh: "number",
  filter: "function",
};

class Stack {
  constructor(element, selector, options) {
    this._element = element;
    this._selector = selector;
    this._options = this._getConfig(options);

    this._offset = null;

    if (this._options.container) {
      this._parent = SelectorEngine.findOne(this._options.container);
    }
  }

  get stackableElements() {
    return SelectorEngine.find(this._selector)
      .filter((el, i) => this._options.filter(el, i))
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .filter(({ el, rect }) => {
        const basicCondition = el !== this._element && isVisible(el);
        if (this._offset === null) {
          return basicCondition;
        }

        return basicCondition && this._getBoundryOffset(rect) < this._offset;
      })
      .sort((a, b) => {
        return this._getBoundryOffset(b.rect) - this._getBoundryOffset(a.rect);
      });
  }

  get nextElements() {
    return SelectorEngine.find(this._selector)
      .filter((el) => el !== this._element)
      .filter((el, i) => this._options.filter(el, i))
      .filter((el) => {
        this._offset = null;
        return (
          this._getBoundryOffset(el.getBoundingClientRect()) > this._offset
        );
      });
  }

  _getConfig(options) {
    const config = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    typeCheckConfig(NAME, config, TYPE_OPTIONS);

    return config;
  }

  _getBoundryOffset(rect) {
    const { position } = this._options;

    let parentTopOffset = 0;
    let parentBottomBoundry = window.innerHeight;

    if (this._parent) {
      const parentRect = this._parent.getBoundingClientRect();

      parentTopOffset = parentRect.top;
      parentBottomBoundry = parentRect.bottom;
    }

    if (position === "top") {
      return rect.top - parentTopOffset;
    }
    return parentBottomBoundry - rect.bottom;
  }

  calculateOffset() {
    const [previousElement] = this.stackableElements;

    if (!previousElement) {
      this._offset = 0;
    } else {
      this._offset =
        this._getBoundryOffset(previousElement.rect) +
        previousElement.rect.height;
    }

    return this._offset;
  }
}

export default Stack;
