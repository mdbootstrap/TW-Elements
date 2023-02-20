/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import Data from "./dom/data";
import { executeAfterTransition, getElement } from "./util/index";
import EventHandler from "./dom/event-handler";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const VERSION = "5.1.3";

class BaseComponent {
  constructor(element) {
    element = getElement(element);

    if (!element) {
      return;
    }

    this._element = element;
    Data.setData(this._element, this.constructor.DATA_KEY, this);
  }

  dispose() {
    Data.removeData(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);

    Object.getOwnPropertyNames(this).forEach((propertyName) => {
      this[propertyName] = null;
    });
  }

  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }

  /** Static */

  static getInstance(element) {
    return Data.getData(getElement(element), this.DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }

  static get VERSION() {
    return VERSION;
  }

  static get NAME() {
    throw new Error(
      'You have to implement the static method "NAME", for each component!'
    );
  }

  static get DATA_KEY() {
    return `te.${this.NAME}`;
  }

  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
}

export default BaseComponent;
