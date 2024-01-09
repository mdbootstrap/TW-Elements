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

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { clearFixture, getFixture } from "../mocks";
import EventHandler from "../../src/js/dom/event-handler";
import initTE from "../../src/js/autoinit/index.js";

const Pinch = require("../../src/js/methods/touch/pinch").default;
const Touch = require("../../src/js/methods/touch/index").default;

initTE({ Touch });

describe("Pinch", () => {
  let fixtureEl;
  let touch1;
  let touch2;

  beforeEach(() => {
    fixtureEl = getFixture();
    touch1 = {
      touches: [
        {
          clientX: 0,
          clientY: 10,
        },
        {
          clientX: 0,
          clientY: 20,
        },
      ],
    };

    touch2 = {
      touches: [
        {
          clientX: 0,
          clientY: 30,
        },
        {
          clientX: 0,
          clientY: 60,
        },
      ],
    };
  });

  afterEach(() => {
    clearFixture();
  });

  it('should return the component"s name', () => {
    const name = Pinch.NAME;

    expect(name).toEqual("pinch");
  });

  it("should initialize with options", () => {
    let instance = new Touch(fixtureEl, { event: "pinch" });

    expect(instance._event).toEqual("pinch");
    expect(instance.pinch._options.threshold).toEqual(10);
    expect(instance.pinch._options.pointers).toEqual(2);

    instance = new Touch(fixtureEl, {
      event: "pinch",
      threshold: 20,
      pointers: 1,
    });

    expect(instance.pinch._options.threshold).toEqual(20);
    expect(instance.pinch._options.pointers).toEqual(1);
  });

  it("should set a start position", () => {
    const instance = new Touch(fixtureEl, { event: "pinch" });

    instance._handleTouchStart(touch1);

    expect(instance.pinch._startTouch).toEqual(10);
    expect(instance.pinch._touch).toEqual(10);
    expect(instance.pinch._origin).toEqual({ x: 0, y: 15 });

    instance.dispose();
  });

  it("should set a move position", () => {
    const instance = new Touch(fixtureEl, { event: "pinch" });

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);

    expect(instance.pinch._startTouch).toEqual(30);
    expect(instance.pinch._touch).toEqual(30);
    expect(instance.pinch._origin).toEqual({ x: 0, y: 15 });
    expect(instance.pinch._ratio).toEqual(3);

    instance.dispose();
  });

  it("should set a end position", () => {
    const instance = new Touch(fixtureEl, { event: "pinch" });

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);
    instance._handleTouchEnd(touch2);

    expect(instance.pinch._startTouch).toEqual(null);
    expect(instance.pinch._touch).toEqual(30);
    expect(instance.pinch._origin).toEqual({ x: 0, y: 15 });
    expect(instance.pinch._ratio).toEqual(3);

    instance.dispose();
  });

  it("should fire all events", () => {
    const instance = new Touch(fixtureEl, { event: "pinch" });

    // eslint-disable-next-line no-undef
    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);
    instance._handleTouchEnd(touch2);

    // start event
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      1,
      fixtureEl,
      "pinchstart",
      {
        touch: {
          touches: [
            { clientX: 0, clientY: 10 },
            { clientX: 0, clientY: 20 },
          ],
        },
        ratio: null, // at the start ratio is null
        origin: { x: 0, y: 15 },
      }
    );

    // move event
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "pinch",
      {
        touch: {
          touches: [
            {
              clientX: 0,
              clientY: 30,
            },
            {
              clientX: 0,
              clientY: 60,
            },
          ],
        },
        ratio: 3,
        origin: { x: 0, y: 15 },
      }
    );

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      3,
      fixtureEl,
      "pinchmove",
      {
        touch: {
          touches: [
            {
              clientX: 0,
              clientY: 30,
            },
            {
              clientX: 0,
              clientY: 60,
            },
          ],
        },
        ratio: 3,
        origin: { x: 0, y: 15 },
      }
    );

    // end event
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      4,
      fixtureEl,
      "pinchend",
      {
        touch: {
          touches: [
            {
              clientX: 0,
              clientY: 30,
            },
            {
              clientX: 0,
              clientY: 60,
            },
          ],
        },
        ratio: 3,
        origin: { x: 0, y: 15 },
      }
    );
  });
});
