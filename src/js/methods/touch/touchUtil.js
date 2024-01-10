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

class TouchUtil {
  _getCoordinates(e) {
    const [touch] = e.touches;

    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  _getDirection({ x, y }) {
    return {
      x: {
        direction: x < 0 ? "left" : "right",
        value: Math.abs(x),
      },
      y: {
        direction: y < 0 ? "up" : "down",
        value: Math.abs(y),
      },
    };
  }

  _getOrigin({ x, y }, { x: x2, y: y2 }) {
    return {
      x: x - x2,
      y: y - y2,
    };
  }

  _getDistanceBetweenTwoPoints(x1, x2, y1, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  _getMidPoint({ x1, x2, y1, y2 }) {
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    };
  }

  _getVectorLength({ x1, x2, y1, y2 }) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  _getRightMostTouch(touches) {
    let rightMost = null;
    const distance = Number.MIN_VALUE;
    touches.forEach((touch) => {
      if (touch.clientX > distance) {
        rightMost = touch;
      }
    });
    return rightMost;
  }

  _getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  _getAngularDistance(start, end) {
    return end - start;
  }

  _getCenterXY({ x1, x2, y1, y2 }) {
    return {
      x: x1 + (x2 - x1) / 2,
      y: y1 + (y2 - y1) / 2,
    };
  }

  _getPinchTouchOrigin(touches) {
    const [t1, t2] = touches;

    const _position = {
      x1: t1.clientX,
      x2: t2.clientX,
      y1: t1.clientY,
      y2: t2.clientY,
    };

    return [this._getVectorLength(_position), this._getCenterXY(_position)];
  }

  _getPosition({ x1, x2, y1, y2 }) {
    return { x1, x2, y1, y2 };
  }
}

export default TouchUtil;
