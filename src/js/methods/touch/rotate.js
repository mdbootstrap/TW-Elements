/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

/* eslint-disable no-multi-assign */
import TouchUtil from "./touchUtil";
import EventHandler from "../../dom/event-handler";
import { typeCheckConfig } from "../../util";
import Manipulator from "../../dom/manipulator";

const NAME = "rotate";
const EVENT_END = `${NAME}end`;
const EVENT_START = `${NAME}start`;

const DefaultType = {
  angle: "number",
  pointers: "number",
};

const Default = {
  angle: 0,
  pointers: 2,
};

class Rotate extends TouchUtil {
  constructor(element, options) {
    super();
    this._element = element;
    this._options = this._getConfig(options);
    this._origin = {};
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  handleTouchStart(e) {
    // eslint-disable-next-line no-unused-expressions
    e.type === "touchstart" && e.preventDefault();

    if (e.touches.length < 2) return;
    this._startTouch = e;
    this._origin = {};
    EventHandler.trigger(this._element, EVENT_START, { touch: e });
    return;
  }

  handleTouchMove(e) {
    // eslint-disable-next-line no-unused-expressions
    e.type === "touchmove" && e.preventDefault();

    let origin;
    let input;
    const touches = e.touches;

    if (touches.length === 1 && this._options.pointers === 1) {
      const { left, top, width, height } =
        this._element.getBoundingClientRect();
      origin = {
        x: left + width / 2,
        y: top + height / 2,
      };

      input = touches[0];
    } else if (e.touches.length === 2 && this._options.pointers === 2) {
      const [t2, t1] = e.touches;
      const _position = {
        x1: t1.clientX,
        x2: t2.clientX,
        y1: t1.clientY,
        y2: t2.clientY,
      };

      origin = this._getMidPoint(_position);
      input = this._getRightMostTouch(e.touches);
    } else {
      return;
    }

    this.currentAngle = this._getAngle(
      origin.x,
      origin.y,
      input.clientX,
      input.clientY
    );

    if (!this._origin.initialAngle) {
      this._origin.initialAngle = this._origin.previousAngle =
        this.currentAngle;
      this._origin.distance = this._origin.change = 0;
    } else {
      this._origin.change = this._getAngularDistance(
        this._origin.previousAngle,
        this.currentAngle
      );
      this._origin.distance += this._origin.change;
    }

    this._origin.previousAngle = this.currentAngle;

    this.rotate = {
      currentAngle: this.currentAngle,
      distance: this._origin.distance,
      change: this._origin.change,
    };

    EventHandler.trigger(this._element, NAME, { ...this.rotate, touch: e });
  }

  handleTouchEnd(e) {
    // eslint-disable-next-line no-unused-expressions
    e.type === "touchend" && e.preventDefault();

    this._origin = {};

    EventHandler.trigger(this._element, EVENT_END, { touch: e });
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

export default Rotate;
