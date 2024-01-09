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

const Pan = require("../../src/js/methods/touch/pan").default;
const Touch = require("../../src/js/methods/touch/index").default;
initTE({ Touch });

describe("Pan", () => {
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

  it('should return the component"s name', () => {
    const name = Pan.NAME;

    expect(name).toEqual("pan");
  });

  it("should initialize with options & default values", () => {
    let instance = new Touch(fixtureEl, { event: "pan" });

    expect(instance._event).toEqual("pan");
    expect(instance.pan._options.threshold).toEqual(20);
    expect(instance.pan._options.direction).toEqual("all");

    instance = new Touch(fixtureEl, {
      event: "pan",
      threshold: 1000,
      direction: "left",
    });

    expect(instance.pan._options.threshold).toEqual(1000);
    expect(instance.pan._options.direction).toEqual("left");
  });

  it("should set a start position", () => {
    const instance = new Touch(fixtureEl, { event: "pan" });

    instance._handleTouchStart(touch1);
    expect(instance.pan._startTouch.x).toEqual(0);
    expect(instance.pan._startTouch.y).toEqual(10);
    expect(instance.pan._movedTouch).toEqual(touch1);

    instance.dispose();
  });

  it("should fire all events", () => {
    const instance = new Touch(fixtureEl, { event: "pan" });

    // eslint-disable-next-line no-undef
    EventHandler.trigger = jest.fn();

    // first case - pandown
    instance._handleTouchStart(touch1);
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      1,
      fixtureEl,
      "panstart",
      {
        touch: { touches: [{ clientX: 0, clientY: 10 }] },
      }
    );

    instance._handleTouchMove(touch2);

    // moved down
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "pandown",
      {
        touch: { touches: [{ clientX: 5, clientY: 40 }] },
      }
    );

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(3, fixtureEl, "pan", {
      touch: { touches: [{ clientX: 5, clientY: 40 }] },
      x: 5, // 5 - 0
      y: 30, // 40 - 10
    });

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      4,
      fixtureEl,
      "panmove",
      {
        touch: { touches: [{ clientX: 5, clientY: 40 }] },
      }
    );

    instance._handleTouchEnd(touch2);
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      5,
      fixtureEl,
      "panend",
      {
        touch: { touches: [{ clientX: 5, clientY: 40 }] },
      }
    );

    expect(instance.pan._startTouch).toBe(null);
    expect(instance.pan._movedTouch).toBe(null);

    // second case - panup
    instance._handleTouchStart(touch2);
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      6,
      fixtureEl,
      "panstart",
      {
        touch: { touches: [{ clientX: 5, clientY: 40 }] },
      }
    );

    instance._handleTouchMove(touch1);

    // moved up
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      7,
      fixtureEl,
      "panup",
      {
        touch: { touches: [{ clientX: 0, clientY: 10 }] },
      }
    );

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(8, fixtureEl, "pan", {
      touch: { touches: [{ clientX: 0, clientY: 10 }] },
      x: -5, // 0 - 5
      y: -30, // 10 - 40
    });

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      9,
      fixtureEl,
      "panmove",
      {
        touch: { touches: [{ clientX: 0, clientY: 10 }] },
      }
    );

    // third case - panleft
    instance._handleTouchStart(touch4);
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      10,
      fixtureEl,
      "panstart",
      {
        touch: { touches: [{ clientX: 50, clientY: 3 }] },
      }
    );

    instance._handleTouchMove(touch3);

    // moved left
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      11,
      fixtureEl,
      "panleft",
      {
        touch: { touches: [{ clientX: 0, clientY: 2 }] },
      }
    );

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(12, fixtureEl, "pan", {
      touch: { touches: [{ clientX: 0, clientY: 2 }] },
      x: -50, // 0 - 50
      y: -1, // 2 - 3
    });

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      13,
      fixtureEl,
      "panmove",
      {
        touch: { touches: [{ clientX: 0, clientY: 2 }] },
      }
    );

    // fourth case - panright
    instance._handleTouchStart(touch3);
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      14,
      fixtureEl,
      "panstart",
      {
        touch: { touches: [{ clientX: 0, clientY: 2 }] },
      }
    );

    instance._handleTouchMove(touch4);

    // moved right
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      15,
      fixtureEl,
      "panright",
      {
        touch: { touches: [{ clientX: 50, clientY: 3 }] },
      }
    );

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(16, fixtureEl, "pan", {
      touch: { touches: [{ clientX: 50, clientY: 3 }] },
      x: 50, // 50 - 0
      y: 1, // 3 - 2
    });

    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      17,
      fixtureEl,
      "panmove",
      {
        touch: { touches: [{ clientX: 50, clientY: 3 }] },
      }
    );
  });
});
