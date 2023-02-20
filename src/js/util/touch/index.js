/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import Swipe from "./swipe";

class Touch {
  constructor(element, event = "swipe", options = {}) {
    this._element = element;
    this._event = event;

    // events

    this.swipe = new Swipe(element, options);

    // handlers

    this._touchStartHandler = this._handleTouchStart.bind(this);
    this._touchMoveHandler = this._handleTouchMove.bind(this);
    this._touchEndHandler = this._handleTouchEnd.bind(this);
  }

  dispose() {
    this._element.removeEventListener("touchstart", this._touchStartHandler);
    this._element.removeEventListener("touchmove", this._touchMoveHandler);
    window.removeEventListener("touchend", this._touchEndHandler);
  }

  init() {
    // istanbul ignore next
    this._element.addEventListener("touchstart", (e) =>
      this._handleTouchStart(e)
    );
    // istanbul ignore next
    this._element.addEventListener("touchmove", (e) =>
      this._handleTouchMove(e)
    );
    // istanbul ignore next
    window.addEventListener("touchend", (e) => this._handleTouchEnd(e));
  }

  _handleTouchStart(e) {
    this[this._event].handleTouchStart(e);
  }

  _handleTouchMove(e) {
    this[this._event].handleTouchMove(e);
  }

  _handleTouchEnd(e) {
    this[this._event].handleTouchEnd(e);
  }
}

export default Touch;
