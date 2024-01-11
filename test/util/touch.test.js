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
const TouchHandler = require("../../src/js/util/touch/index").default;

import { clearFixture, getFixture, jQueryMock } from "../mocks";
import EventHandler from "../../src/js/dom/event-handler";

describe("Touch", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
  });

  afterEach(() => {
    clearFixture();
  });

  it("should initialize and add event listeners", () => {
    fixtureEl.addEventListener = jest.fn();
    window.addEventListener = jest.fn();
    const instance = new TouchHandler(fixtureEl, "testEvent");
    instance.init();

    expect(instance._element).toEqual(fixtureEl);
    expect(instance._event).toEqual("testEvent");
    expect(fixtureEl.addEventListener).toHaveBeenCalledTimes(2);
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
  });

  it("should call the event's handlers", () => {
    const instance = new TouchHandler(fixtureEl, "testEvent");
    instance.init();
    instance.testEvent = {
      handleTouchStart: jest.fn(),
      handleTouchMove: jest.fn(),
      handleTouchEnd: jest.fn(),
    };

    instance._handleTouchStart();
    expect(instance.testEvent.handleTouchStart).toHaveBeenCalled();
    instance._handleTouchMove();
    expect(instance.testEvent.handleTouchMove).toHaveBeenCalled();
    instance._handleTouchEnd();
    expect(instance.testEvent.handleTouchEnd).toHaveBeenCalled();
  });

  it("should remove event listeners on dispose", () => {
    const instance = new TouchHandler(fixtureEl, "testEvent");
    instance.init();
    fixtureEl.removeEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    instance.dispose();
    expect(fixtureEl.removeEventListener).toHaveBeenCalledTimes(2);
    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
  });
});

describe("Swipe", () => {
  let fixtureEl;
  let touch1;
  let touch2;
  let touch3;
  let touch4;

  beforeEach(() => {
    fixtureEl = getFixture();

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
    let instance = new TouchHandler(fixtureEl);
    instance.init();
    expect(instance._event).toEqual("swipe");
    expect(instance.swipe._options.threshold).toEqual(10);
    expect(instance.swipe._options.direction).toEqual("all");

    instance = new TouchHandler(fixtureEl, "swipe", {
      threshold: 1000,
      direction: "left",
    });

    instance.init();
    expect(instance.swipe._options.threshold).toEqual(1000);
    expect(instance.swipe._options.direction).toEqual("left");
  });

  it("should set a start position", () => {
    let instance = new TouchHandler(fixtureEl, "swipe");
    instance.init();

    instance._handleTouchStart(touch1);
    expect(instance.swipe._startPosition.x).toEqual(0);
    expect(instance.swipe._startPosition.y).toEqual(10);
  });

  it("should fire all events", () => {
    let instance = new TouchHandler(fixtureEl, "swipe");
    instance.init();
    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      1,
      fixtureEl,
      "swipedown"
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "swipe",
      {
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
      "swipeup"
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      4,
      fixtureEl,
      "swipe",
      {
        direction: "up",
      }
    );

    instance._handleTouchStart(touch4);
    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      5,
      fixtureEl,
      "swipeleft"
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      6,
      fixtureEl,
      "swipe",
      {
        direction: "left",
      }
    );

    instance._handleTouchStart(touch3);
    instance._handleTouchMove(touch4);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      7,
      fixtureEl,
      "swiperight"
    );
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      8,
      fixtureEl,
      "swipe",
      {
        direction: "right",
      }
    );
  });

  it("should not fire an event below a threshold", () => {
    let instance = new TouchHandler(fixtureEl, "swipe", {
      threshold: 10000,
      direction: "all",
    });
    instance.init();

    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).not.toHaveBeenCalled();
  });

  it("should fire only direction event", () => {
    let instance = new TouchHandler(fixtureEl, "swipe", { direction: "left" });
    instance.init();
    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch4);
    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).toHaveBeenCalledWith(fixtureEl, "swipeleft");

    instance._handleTouchStart(touch3);
    instance._handleTouchMove(touch4);

    expect(EventHandler.trigger).toHaveBeenCalledTimes(1);

    instance = new TouchHandler(fixtureEl, "swipe", { direction: "down" });
    instance.init();

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "swipedown"
    );

    instance._handleTouchStart(touch2);
    instance._handleTouchMove(touch1);

    expect(EventHandler.trigger).toHaveBeenCalledTimes(2);
  });

  it("should fire only direction event", () => {
    let instance = new TouchHandler(fixtureEl, "swipe", {
      direction: "left",
      threshold: 3,
    });
    instance.init();
    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch4);
    instance._handleTouchMove(touch2);

    expect(EventHandler.trigger).toHaveBeenCalledWith(fixtureEl, "swipeleft");

    instance._handleTouchMove(touch3);

    expect(EventHandler.trigger).toHaveBeenCalledTimes(1);
  });

  it("should reset the start position on touchend", () => {
    let instance = new TouchHandler(fixtureEl);
    instance.init();

    instance._handleTouchStart(touch4);
    expect(instance.swipe._startPosition).not.toBe(null);

    instance._handleTouchEnd();
    expect(instance.swipe._startPosition).toBe(null);
  });
});
