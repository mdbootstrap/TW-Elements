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
import { clearFixture, getFixture, jQueryMock } from "../mocks";
import EventHandler from "../../src/js/dom/event-handler";
import initTE from "../../src/js/autoinit/index.js";

const Touch = require("../../src/js/methods/touch/index").default;
initTE({ Touch });

describe("Swipe", () => {
  let fixtureEl;
  let touch1;
  let touch2;
  let touch3;
  let touch4;

  const event = { preventDefault: () => {} };

  beforeEach(() => {
    fixtureEl = getFixture();

    jest.spyOn(event, "preventDefault");

    touch1 = {
      touches: [
        {
          clientX: 0,
          clientY: 10,
        },
      ],
    };

    touch2 = {
      touches: [
        {
          clientX: 5,
          clientY: 40,
        },
      ],
    };

    touch3 = {
      touches: [
        {
          clientX: 0,
          clientY: 2,
        },
      ],
    };

    touch4 = {
      touches: [
        {
          clientX: 50,
          clientY: 3,
        },
      ],
    };
  });

  afterEach(() => {
    clearFixture();
  });

  it("should initialize with options & default values", () => {
    let instance = new Touch(fixtureEl);

    expect(instance._event).toEqual("swipe");
    expect(instance.swipe._options.threshold).toEqual(10);
    expect(instance.swipe._options.direction).toEqual("all");

    instance = new Touch(fixtureEl, {
      event: "swipe",
      threshold: 1000,
      direction: "left",
    });

    expect(instance.swipe._options.threshold).toEqual(1000);
    expect(instance.swipe._options.direction).toEqual("left");
  });

  it("should set a start position", () => {
    const instance = new Touch(fixtureEl, { event: "swipe" });

    instance._handleTouchStart(touch1);
    expect(instance.swipe._startPosition.x).toEqual(0);
    expect(instance.swipe._startPosition.y).toEqual(10);
  });

  it("should fire all events", () => {
    const instance = new Touch(fixtureEl, { event: "swipe" });

    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      1,
      fixtureEl,
      "swipedown",
      {
        touch: { touches: [{ clientX: 5, clientY: 40 }] },
      }
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "swipe",
      {
        touch: { touches: [{ clientX: 5, clientY: 40 }] },
        direction: "down",
      }
    );

    instance._handleTouchEnd();
    expect(instance.swipe._startPosition).toBe(null);

    instance._handleTouchStart(touch2);
    instance._handleTouchMove(touch1);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      3,
      fixtureEl,
      "swipeup",
      {
        touch: { touches: [{ clientX: 0, clientY: 10 }] },
      }
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      4,
      fixtureEl,
      "swipe",
      {
        touch: { touches: [{ clientX: 0, clientY: 10 }] },
        direction: "up",
      }
    );

    instance._handleTouchStart(touch4);
    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      5,
      fixtureEl,
      "swipeleft",
      {
        touch: { touches: [{ clientX: 0, clientY: 2 }] },
      }
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      6,
      fixtureEl,
      "swipe",
      {
        touch: { touches: [{ clientX: 0, clientY: 2 }] },
        direction: "left",
      }
    );

    instance._handleTouchStart(touch3);
    instance._handleTouchMove(touch4);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      7,
      fixtureEl,
      "swiperight",
      {
        touch: { touches: [{ clientX: 50, clientY: 3 }] },
      }
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      8,
      fixtureEl,
      "swipe",
      {
        touch: { touches: [{ clientX: 50, clientY: 3 }] },
        direction: "right",
      }
    );
  });

  it("should not fire an event below a threshold", () => {
    const instance = new Touch(fixtureEl, {
      event: "swipe",
      threshold: 10000,
      direction: "all",
    });

    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).not.toHaveBeenCalled();
  });

  it("should fire only direction event", () => {
    let instance = new Touch(fixtureEl, { event: "swipe", direction: "left" });

    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch4);
    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).toHaveBeenCalledWith(fixtureEl, "swipeleft", {
      touch: { touches: [{ clientX: 0, clientY: 2 }] },
    });

    instance._handleTouchStart(touch3);
    instance._handleTouchMove(touch4);

    expect(EventHandler.trigger).toHaveBeenCalledTimes(1);

    instance = new Touch(fixtureEl, {
      event: "swipe",
      touch: { touches: [{ clientX: 50, clientY: 3 }] },
      direction: "down",
    });

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "swipedown",
      {
        touch: { touches: [{ clientX: 5, clientY: 40 }] },
      }
    );

    instance._handleTouchStart(touch2);
    instance._handleTouchMove(touch1);

    expect(EventHandler.trigger).toHaveBeenCalledTimes(2);
  });

  it("should fire only direction event", () => {
    const instance = new Touch(fixtureEl, {
      event: "swipe",
      direction: "left",
      threshold: 3,
    });

    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch4);
    instance._handleTouchMove(touch2);

    expect(EventHandler.trigger).toHaveBeenCalledWith(fixtureEl, "swipeleft", {
      touch: { touches: [{ clientX: 5, clientY: 40 }] },
    });

    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).toHaveBeenCalledTimes(1);
  });

  it("should reset the start position on touchend", () => {
    const instance = new Touch(fixtureEl);

    instance._handleTouchStart(touch4);
    expect(instance.swipe._startPosition).not.toBe(null);

    instance._handleTouchEnd();
    expect(instance.swipe._startPosition).toBe(null);
  });
});
