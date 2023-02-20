/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { defineJQueryPlugin } from "../util/index";
import EventHandler from "../dom/event-handler";
import BaseComponent from "../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "button";
const DATA_KEY = "bs.button";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";

const CLASS_NAME_ACTIVE = "active";

const SELECTOR_DATA_TOGGLE = '[data-te-toggle="button"]';

const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Button extends BaseComponent {
  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute(
      "aria-pressed",
      this._element.classList.toggle(CLASS_NAME_ACTIVE)
    );
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);

      if (config === "toggle") {
        data[config]();
      }
    });
  }
}

/*
------------------------------------------------------------------------
Data Api implementation
------------------------------------------------------------------------
*/

EventHandler.on(
  document,
  EVENT_CLICK_DATA_API,
  SELECTOR_DATA_TOGGLE,
  (event) => {
    event.preventDefault();

    const button = event.target.closest(SELECTOR_DATA_TOGGLE);
    const data = Button.getOrCreateInstance(button);

    data.toggle();
  }
);

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Button to jQuery only if jQuery is present
 */

defineJQueryPlugin(Button);

export default Button;
