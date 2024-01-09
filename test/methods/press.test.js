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

const Press = require("../../src/js/methods/touch/press").default;
const Touch = require("../../src/js/methods/touch/index").default;
initTE({ Touch });

describe("Press", () => {
  let fixtureEl;
  let touch1;

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
  });

  afterEach(() => {
    clearFixture();
  });

  it('should return the component"s name', () => {
    const name = Press.NAME;

    expect(name).toEqual("press");
  });

  it("should initialize with options", () => {
    let instance = new Touch(fixtureEl, { event: "press" });

    expect(instance._event).toEqual("press");
    expect(instance.press._options.time).toEqual(250);
    expect(instance.press._options.pointers).toEqual(1);

    instance = new Touch(fixtureEl, {
      event: "press",
      time: 300,
      pointers: 2,
    });

    expect(instance.press._options.time).toEqual(300);
    expect(instance.press._options.pointers).toEqual(2);
  });

  it("should set a start position", () => {
    const instance = new Touch(fixtureEl, { event: "press" });

    instance._handleTouchStart(touch1);
    expect(instance.press._timer).toEqual(12);

    instance.dispose();

    expect(instance.press).toEqual(null);
  });

  it("should set a end position", () => {
    const instance = new Touch(fixtureEl, { event: "press" });

    instance._handleTouchStart(touch1);
    expect(instance.press._timer).toEqual(17);

    instance._handleTouchEnd(touch1);
    expect(instance.press._timer).toEqual(17);

    instance.dispose();

    expect(instance.press).toEqual(null);
  });

  it("should fire all events", () => {
    jest.useFakeTimers();
    const instance = new Touch(fixtureEl, {
      event: "press",
      time: 300,
      pointers: 1,
    });

    // eslint-disable-next-line no-undef
    EventHandler.trigger = jest.fn();

    instance._handleTouchStart(touch1);
    jest.runAllTimers();

    // 'press' event is fired with touch object and time
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      1,
      fixtureEl,
      "press",
      {
        touch: { touches: [{ clientX: 0, clientY: 10 }] },
        time: 300,
      }
    );

    // 'pressup' event is fired with touch object
    expect(EventHandler.trigger).toHaveBeenNthCalledWith(
      2,
      fixtureEl,
      "pressup",
      {
        touch: { touches: [{ clientX: 0, clientY: 10 }] },
      }
    );

    instance.dispose();

    expect(instance.press).toEqual(null);
  });
});
