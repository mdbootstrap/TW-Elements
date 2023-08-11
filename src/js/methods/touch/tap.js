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

const NAME = "tap";

const DefaultType = {
  interval: "number",
  time: "number",
  taps: "number",
  pointers: "number",
};

const Default = {
  interval: 500,
  time: 250,
  taps: 1,
  pointers: 1,
};

class Tap extends TouchUtil {
  constructor(element, options) {
    super();
    this._element = element;
    this._options = this._getConfig(options);
    this._timer = null;
    this._tapCount = 0;
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  handleTouchStart(e) {
    const { x, y } = this._getCoordinates(e);
    const { interval, taps, pointers } = this._options;

    if (e.touches.length === pointers) {
      this._tapCount += 1;

      if (this._tapCount === 1) {
        this._timer = setTimeout(() => {
          this._tapCount = 0;
        }, interval);
      }

      if (this._tapCount === taps) {
        clearTimeout(this._timer);
        this._tapCount = 0;
        EventHandler.trigger(this._element, NAME, {
          touch: e,
          origin: {
            x,
            y,
          },
        });
      }
    }

    return e;
  }

  handleTouchEnd() {
    return;
  }

  handleTouchMove() {
    return;
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

export default Tap;
