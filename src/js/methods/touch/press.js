/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import TouchUtil from "./touchUtil";
import EventHandler from "../../dom/event-handler";
import { typeCheckConfig } from "../../util";
import Manipulator from "../../dom/manipulator";

const NAME = "press";
const EVENT_UP = "pressup";

const DefaultType = {
  time: "number",
  pointers: "number",
};

const Default = {
  time: 250,
  pointers: 1,
};

class Press extends TouchUtil {
  constructor(element, options = {}) {
    super();
    this._element = element;
    this._options = this._getConfig(options);
    this._timer = null;
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  handleTouchStart(e) {
    const { time, pointers } = this._options;

    if (e.touches.length === pointers) {
      this._timer = setTimeout(() => {
        EventHandler.trigger(this._element, NAME, { touch: e, time });
        EventHandler.trigger(this._element, EVENT_UP, { touch: e });
      }, time);
    }
  }

  handleTouchEnd() {
    clearTimeout(this._timer);
  }

  _getConfig(options) {
    const config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...options,
    };

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }
}

export default Press;
