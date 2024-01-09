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

const Rotate = require("../../src/js/methods/touch/rotate").default;
const Touch = require("../../src/js/methods/touch/index").default;
initTE({ Touch });

describe("Rotate", () => {
  let fixtureEl;
  let touch1;
  let touch2;

  beforeEach(() => {
    fixtureEl = getFixture();
    touch1 = {
      touches: [
        {
          clientX: 5,
          clientY: 10,
        },
        {
          clientX: 5,
          clientY: 20,
        },
      ],
    };

    touch2 = {
      touches: [
        {
          clientX: 5,
          clientY: 30,
        },
        {
          clientX: 5,
          clientY: 60,
        },
      ],
    };
  });

  afterEach(() => {
    clearFixture();
  });

  it('should return the component"s name', () => {
    const name = Rotate.NAME;

    expect(name).toEqual("rotate");
  });

  it("should initialize with options", () => {
    let instance = new Touch(fixtureEl, { event: "rotate" });

    expect(instance._event).toEqual("rotate");
    expect(instance.rotate._options.angle).toEqual(0);
    expect(instance.rotate._options.pointers).toEqual(2);

    instance = new Touch(fixtureEl, {
      event: "rotate",
      angle: 120,
      pointers: 3,
    });

    expect(instance.rotate._options.angle).toEqual(120);
    expect(instance.rotate._options.pointers).toEqual(3);
  });

  it("should set a start position", () => {
    const instance = new Touch(fixtureEl, { event: "rotate" });

    instance._handleTouchStart(touch1);

    expect(instance.rotate._startTouch).toEqual(touch1);
    expect(instance.rotate._origin).toEqual({});

    instance.dispose();
  });

  it("should set a move position", () => {
    const instance = new Touch(fixtureEl, { event: "rotate" });

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);

    expect(instance.rotate._startTouch).toEqual(touch1);
    expect(instance.rotate._origin).toEqual({
      change: 0,
      distance: 0,
      initialAngle: 1.5707963267948966,
      previousAngle: 1.5707963267948966,
    });

    instance.dispose();
  });

  it("should set a end position", () => {
    const instance = new Touch(fixtureEl, { event: "rotate" });

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);
    instance._handleTouchEnd(touch2);

    expect(instance.rotate._startTouch).toEqual(touch1);
    expect(instance.rotate._touch).toEqual(undefined);
    expect(instance.rotate._origin).toEqual({});

    instance.dispose();
  });

  it("should fire all events", () => {
    const instance = new Touch(fixtureEl, { event: "rotate" });

    // eslint-disable-next-line no-undef
    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch1);
    instance._handleTouchMove(touch2);
    instance._handleTouchEnd(touch2);

    // start event
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      1,
      fixtureEl,
      "rotatestart",
      {
        touch: {
          touches: [
            {
              clientX: 5,
              clientY: 10,
            },
            {
              clientX: 5,
              clientY: 20,
            },
          ],
        },
      }
    );

    // move event
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "rotate",
      {
        touch: {
          touches: [
            {
              clientX: 5,
              clientY: 30,
            },
            {
              clientX: 5,
              clientY: 60,
            },
          ],
        },
        currentAngle: 1.5707963267948966,
        distance: 0,
        change: 0,
      }
    );

    // end event
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      3,
      fixtureEl,
      "rotateend",
      {
        touch: {
          touches: [
            {
              clientX: 5,
              clientY: 30,
            },
            {
              clientX: 5,
              clientY: 60,
            },
          ],
        },
      }
    );
  });
});
