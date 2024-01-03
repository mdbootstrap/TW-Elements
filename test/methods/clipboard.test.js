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
import { getFixture, jQueryMock, clearFixture } from "../mocks";
import { element } from "../../src/js/util";
import Manipulator from "../../src/js/dom/manipulator";
import EventHandler from "../../src/js/dom/event-handler";

const NAME = "clipboard";

const EVENT_COPIED = `copy.te.clipboard`;

let Clipboard = require("../../src/js/methods/clipboard").default;

describe("Clipboard", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
    document.body.appendChild(fixtureEl);
  });

  afterEach(() => {
    clearFixture();
  });

  it("Should return component name", () => {
    expect(Clipboard.NAME).toEqual(NAME);
  });

  it("Should auto init an element", () => {
    Manipulator.addClass(fixtureEl, "clipboard");
    fixtureEl.setAttribute("data-te-clipboard-init", "");
    jest.resetModules();

    Clipboard = require("../../src/js/methods/clipboard").default;
    const initTE = require("../../src/js/autoinit/index.js").default;
    initTE({ Clipboard });

    const instance = Clipboard.getInstance(fixtureEl);
    expect(instance).not.toEqual(null);
    instance.dispose();
  });

  it("Should create instance and dispose it", () => {
    let instance = new Clipboard(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.dispose();
    instance = Clipboard.getInstance(fixtureEl);

    expect(instance).toEqual(null);
  });

  it("Should copy text from input", () => {
    document.execCommand = jest.fn();

    const instance = new Clipboard(fixtureEl, {
      clipboardTarget: "#copy-target",
    });

    const input = element("input");
    input.setAttribute("type", "text");
    input.value = "text";
    input.id = "copy-target";
    document.body.appendChild(input);

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    instance.dispose();
  });

  it("Should copy from data attribute", () => {
    document.execCommand = jest.fn();

    const instance = new Clipboard(fixtureEl, {
      clipboardTarget: "#copy-target-2",
    });

    const elWithTextToCopy = element("div");
    elWithTextToCopy.setAttribute("data-te-clipboard-text", "text");
    elWithTextToCopy.id = "copy-target-2";
    document.body.appendChild(elWithTextToCopy);

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    instance.dispose();
  });

  it("Should copy from text content", () => {
    document.execCommand = jest.fn();

    const instance = new Clipboard(fixtureEl, {
      clipboardTarget: "#copy-target-3",
    });

    const elWithTextToCopy = element("div");
    elWithTextToCopy.textContent = "text";
    elWithTextToCopy.id = "copy-target-3";
    document.body.appendChild(elWithTextToCopy);

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    instance.dispose();
  });

  it("should fire copy.te.clipboard event", () => {
    const eventFire = jest.fn();

    const instance = new Clipboard(fixtureEl, {
      clipboardTarget: "#copy-target-3",
    });

    EventHandler.on(fixtureEl, EVENT_COPIED, eventFire);

    const elWithTextToCopy = element("div");
    elWithTextToCopy.textContent = "text";
    elWithTextToCopy.id = "copy-target-3";
    document.body.appendChild(elWithTextToCopy);

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    expect(eventFire).toHaveBeenCalled();
    instance.dispose();
  });
});
