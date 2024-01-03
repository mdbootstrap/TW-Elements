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

const Touch = require("../../src/js/methods/touch/index").default;

const data = {
  duration: 3000,
};

const event = { preventDefault: () => {} };

describe("Touch", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
  });

  afterEach(() => clearFixture());

  it("should auto init and use options from data-attribute", () => {
    const div = document.createElement("div");
    div.setAttribute("data-te-touch-init", "");
    div.setAttribute("data-te-event", "press");
    div.setAttribute("data-te-time", "200");
    fixtureEl.appendChild(div);

    const initTE = require("../../src/js/autoinit/index.js").default;
    initTE({ Touch });

    const instance = Touch.getInstance(div);

    expect(instance).not.toBe(null);
    expect(instance._event).toBe("press");
    expect(instance._options.time).toEqual(200);

    instance.dispose();
  });

  it("should initialize and add event listeners", () => {
    fixtureEl.addEventListener = jest.fn();
    window.addEventListener = jest.fn();
    const instance = new Touch(fixtureEl, "swipe");

    expect(instance._element).toEqual(fixtureEl);
    expect(instance._event).toEqual("swipe");
    expect(fixtureEl.addEventListener).toHaveBeenCalledTimes(3);
    expect(window.addEventListener).toHaveBeenCalledTimes(0);

    instance.dispose();
  });

  it("should call the events handlers", () => {
    const instance = new Touch(fixtureEl, "swipe");

    instance.swipe = {
      handleTouchStart: jest.fn(),
      handleTouchMove: jest.fn(),
      handleTouchEnd: jest.fn(),
    };

    instance._handleTouchStart();
    expect(instance.swipe.handleTouchStart).toHaveBeenCalled();
    instance._handleTouchMove();
    expect(instance.swipe.handleTouchMove).toHaveBeenCalled();
    instance._handleTouchEnd();
    expect(instance.swipe.handleTouchEnd).toHaveBeenCalled();

    instance.dispose();
  });

  it("shouldn't result in an error if the handleTouchMove method doesn't exist", () => {
    const instance = new Touch(fixtureEl, "swipe");

    // add test value to check if the method was called or not
    let testValue = false;

    // add test method to check if the testValue was changed
    instance.swipe = {
      handleTouchMove: () => (testValue = true),
    };

    instance._handleTouchMove();

    // check if the testValue was changed. If the handleTouchMove is a function it should be changed to true
    expect(testValue).toBeTruthy();

    // reset the testValue and set the handleTouchMove to null
    testValue = false;
    instance.swipe.handleTouchMove = null;

    instance._handleTouchMove();

    // testValue shouldn't be changed
    expect(testValue).toBeFalsy();

    instance.dispose();
  });

  it("should remove event listeners on dispose", () => {
    const instance = new Touch(fixtureEl, "testEvent");

    fixtureEl.removeEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    instance.dispose();
    expect(fixtureEl.removeEventListener).toHaveBeenCalledTimes(3);
    expect(window.removeEventListener).toHaveBeenCalledTimes(0);
  });

  it("should null elements on dispose", () => {
    const instance = new Touch(fixtureEl, "testEvent");

    fixtureEl.removeEventListener = jest.fn();
    window.removeEventListener = jest.fn();

    instance.dispose();
    expect(instance.tap).toBe(null);
    expect(instance.press).toBe(null);
    expect(instance.pinch).toBe(null);
    expect(instance.rotate).toBe(null);
    expect(instance.swipe).toBe(null);
    expect(instance.pan).toBe(null);
  });
});
