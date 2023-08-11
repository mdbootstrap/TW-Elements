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

const NAME = "pan";
const EVENT_START = `${NAME}start`;
const EVENT_END = `${NAME}end`;
const EVENT_MOVE = `${NAME}move`;
const LEFT = "left";
const RIGHT = "right";

const DefaultType = {
  threshold: "number",
  direction: "string",
  pointers: "number",
};

const Default = {
  threshold: 20,
  direction: "all",
  pointers: 1,
};

class Pan extends TouchUtil {
  constructor(element, options = {}) {
    super();
    this._element = element;
    this._options = this._getConfig(options);
    this._startTouch = null;
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  handleTouchStart(e) {
    this._startTouch = this._getCoordinates(e);
    this._movedTouch = e;

    EventHandler.trigger(this._element, EVENT_START, { touch: e });
  }

  handleTouchMove(e) {
    // eslint-disable-next-line no-unused-expressions
    e.type === "touchmove" && e.preventDefault();

    const { threshold, direction } = this._options;
    const postion = this._getCoordinates(e);
    const movedPosition = this._getCoordinates(this._movedTouch);

    const displacement = this._getOrigin(postion, this._startTouch);
    const displacementMoved = this._getOrigin(postion, movedPosition);

    const pan = this._getDirection(displacement);
    const movedDirection = this._getDirection(displacementMoved);

    const { x, y } = pan;

    if (direction === "all" && (y.value > threshold || x.value > threshold)) {
      const direction = y.value > x.value ? y.direction : x.direction;

      EventHandler.trigger(this._element, `${NAME}${direction}`, { touch: e });
      EventHandler.trigger(this._element, NAME, {
        ...displacementMoved,
        touch: e,
      });
    }

    const axis = direction === LEFT || direction === RIGHT ? "x" : "y";

    if (
      movedDirection[axis].direction === direction &&
      pan[axis].value > threshold
    ) {
      EventHandler.trigger(this._element, `${NAME}${direction}`, {
        touch: e,
        [axis]: postion[axis] - movedPosition[axis],
      });
    }

    this._movedTouch = e;

    EventHandler.trigger(this._element, EVENT_MOVE, { touch: e });
  }

  handleTouchEnd(e) {
    // eslint-disable-next-line no-unused-expressions
    e.type === "touchend" && e.preventDefault();

    this._movedTouch = null;
    this._startTouch = null;

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

export default Pan;
