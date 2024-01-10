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
import Manipulator from "../dom/manipulator";
import { isElement } from "./index";

const SELECTOR_FIXED_CONTENT =
  ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
const SELECTOR_STICKY_CONTENT = ".sticky-top";

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }

  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    // give padding to element to balance the hidden scrollbar width
    this._setElementAttributes(
      this._element,
      "paddingRight",
      (calculatedValue) => calculatedValue + width
    );
    // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
    this._setElementAttributes(
      SELECTOR_FIXED_CONTENT,
      "paddingRight",
      (calculatedValue) => calculatedValue + width
    );
    this._setElementAttributes(
      SELECTOR_STICKY_CONTENT,
      "marginRight",
      (calculatedValue) => calculatedValue - width
    );
  }

  _disableOverFlow() {
    this._saveInitialAttribute(this._element, "overflow");
    this._element.style.overflow = "hidden";
  }

  _setElementAttributes(selector, styleProp, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = (element) => {
      if (
        element !== this._element &&
        window.innerWidth > element.clientWidth + scrollbarWidth
      ) {
        return;
      }

      this._saveInitialAttribute(element, styleProp);
      const calculatedValue = window.getComputedStyle(element)[styleProp];
      element.style[styleProp] = `${callback(
        Number.parseFloat(calculatedValue)
      )}px`;
    };

    this._applyManipulationCallback(selector, manipulationCallBack);
  }

  reset() {
    this._resetElementAttributes(this._element, "overflow");
    this._resetElementAttributes(this._element, "paddingRight");
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, "paddingRight");
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, "marginRight");
  }

  _saveInitialAttribute(element, styleProp) {
    const actualValue = element.style[styleProp];
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProp, actualValue);
    }
  }

  _resetElementAttributes(selector, styleProp) {
    const manipulationCallBack = (element) => {
      const value = Manipulator.getDataAttribute(element, styleProp);
      if (typeof value === "undefined") {
        element.style.removeProperty(styleProp);
      } else {
        Manipulator.removeDataAttribute(element, styleProp);
        element.style[styleProp] = value;
      }
    };

    this._applyManipulationCallback(selector, manipulationCallBack);
  }

  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector);
    } else {
      SelectorEngine.find(selector, this._element).forEach(callBack);
    }
  }

  isOverflowing() {
    return this.getWidth() > 0;
  }
}

export default ScrollBarHelper;
