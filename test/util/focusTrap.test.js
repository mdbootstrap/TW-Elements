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
import FocusTrap from "../../src/js/util/focusTrap";
import { clearFixture, getFixture, jQueryMock } from "../mocks";

describe("FocusTrap", () => {
  let fixtureEl;
  const list = `
  <ul>
    <li><a id="first-element" href="#">First</a></li>
    <li><a href="#">Inner</a></li>
    <li><a id="last-element" href="#">Last</a></li>
  </ul>
  `;

  const expandedList = `
  <ul>
    <li><a id="first-element" href="#">First</a></li>
    <li><a href="#">Inner</a></li>
    <li><a id="last-element" href="#">Last</a>
      <ul id="toggle-list">
        <li><a href="#">First Item</a></li>
        <li><a href="#">Inner Item</a></li>
        <li><a id="last-item" href="#">Last Item</a>
      </ul>
    </li>
  </ul>
  `;

  beforeEach(() => {
    fixtureEl = getFixture();
  });

  afterEach(() => {
    clearFixture();
  });

  it("should initialize with options", () => {
    const instance = new FocusTrap(fixtureEl, {
      event: "test event",
      condition: "test condition",
      onlyVisible: false,
    });
    expect(instance._element).toEqual(fixtureEl);
    expect(instance._event).toEqual("test event");
    expect(instance._condition).toEqual("test condition");
    expect(instance._onlyVisible).toEqual(false);

    instance.disable();
  });

  it("should calculate items & focus first item on tab", () => {
    fixtureEl.innerHTML = list;
    const instance = new FocusTrap(fixtureEl);
    instance.trap();

    expect(instance._focusableElements.length).toEqual(3);

    instance._firstElement.focus = jest.fn();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));

    expect(instance._firstElement.focus).toHaveBeenCalled();
  });

  it("should focus the first event after an event event on the last", () => {
    fixtureEl.innerHTML = list;
    const instance = new FocusTrap(fixtureEl, { event: "test" });
    instance.trap();

    instance._firstElement.focus = jest.fn();

    instance._lastElement.dispatchEvent(new KeyboardEvent("test"));

    expect(instance._firstElement.focus).toHaveBeenCalled();
  });

  it("should recalculate number of items on update()", () => {
    fixtureEl.innerHTML = list;
    const instance = new FocusTrap(fixtureEl);
    instance.trap();

    expect(instance._focusableElements.length).toEqual(3);
    instance._firstElement.focus = jest.fn();
    document
      .getElementById("last-element")
      .dispatchEvent(new KeyboardEvent("blur"));
    expect(instance._firstElement.focus).toHaveBeenCalled();

    fixtureEl.innerHTML = expandedList;
    instance.update();
    instance._firstElement.focus = jest.fn();
    expect(instance._focusableElements.length).toEqual(6);
    document
      .getElementById("last-element")
      .dispatchEvent(new KeyboardEvent("blur"));
    expect(instance._firstElement.focus).not.toHaveBeenCalled();
    document
      .getElementById("last-item")
      .dispatchEvent(new KeyboardEvent("blur"));
    expect(instance._firstElement.focus).toHaveBeenCalled();
  });

  it("should remove event listeners on disable()", () => {
    fixtureEl.innerHTML = list;
    const instance = new FocusTrap(fixtureEl);
    instance.trap();
    instance._firstElement.focus = jest.fn();
    instance._lastElement.dispatchEvent(new KeyboardEvent("blur"));
    expect(instance._firstElement.focus).toHaveBeenCalled();

    instance.disable();
    instance._lastElement.dispatchEvent(new KeyboardEvent("blur"));
    expect(instance._firstElement.focus).toHaveBeenCalledTimes(1);
  });

  it("should only calculate items visible in the DOM", () => {
    fixtureEl.innerHTML = expandedList;
    document.getElementById("toggle-list").style.display = "none";
    const instance = new FocusTrap(fixtureEl, { onlyVisible: true });
    instance.trap();

    expect(instance._focusableElements.length).toEqual(3);

    document.getElementById("first-element").style.visibility = "hidden";
    instance.update();
    expect(instance._focusableElements.length).toEqual(2);
  });

  it("should only calculate items that are not disabled", () => {
    fixtureEl.innerHTML = list;
    const listEl = fixtureEl.querySelectorAll("li a");
    listEl[0].setAttribute("disabled", "");
    const instance = new FocusTrap(fixtureEl);

    instance.trap();
    expect(instance._focusableElements.length).toBe(2);
  });

  it("should check condition before focusing first element", () => {
    fixtureEl.innerHTML = list;
    const condition = jest.fn();
    const instance = new FocusTrap(fixtureEl, { condition });
    instance.trap();

    instance._lastElement.dispatchEvent(new KeyboardEvent("blur"));
    expect(condition).toHaveBeenCalled();
  });

  it("should return if the first element cannot be found", () => {
    const instance = new FocusTrap(fixtureEl);
    instance.trap();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    expect(instance._firstElement).toBe(undefined);
  });
});
