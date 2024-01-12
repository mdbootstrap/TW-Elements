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
import initTE from "../../src/js/autoinit/index.js";
import Datetimepicker from "../../src/js/forms/dateTimepicker";
import Input from "../../src/js/forms/input";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const DEFAULT_OPTIONS = {
  appendValidationInfo: true,
  inline: false,
  toggleButton: true,
  disableToggleButton: false,
  disabled: false,
  defaultTime: "",
  defaultDate: "",
  dateFormat: "dd/mm/yyyy",
  invalidLabel: "Invalid Date or Time Format",
};

describe("Datetimepicker", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `<div
    class="relative mb-3"
    data-te-date-timepicker-init
    data-te-input-wrapper-init>
    <input
      type="text"
      class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
      id="form1" />
    <label
      for="form1"
      class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
      >Select a time</label
    >
  </div>`;
  });

  afterEach(() => clearFixture());

  it("should return the component name", () => {
    const name = Datetimepicker.NAME;

    expect(name).toEqual("datetimepicker");
  });

  it("should create an instance and destroy it on dispose()", () => {
    const datepicker = new Datetimepicker(fixtureEl);

    const instance = Datetimepicker.getInstance(fixtureEl);

    expect(instance).not.toBe(null);

    datepicker.dispose();

    expect(Datetimepicker.getInstance(fixtureEl)).toBe(null);
  });

  it("should initialize with default options", () => {
    const instance = new Datetimepicker(fixtureEl, { ...DEFAULT_OPTIONS });

    for (const option in DEFAULT_OPTIONS) {
      expect(instance._options[option]).toBe(DEFAULT_OPTIONS[option]);
    }

    instance.dispose();
  });

  it("should not initiate twice", () => {
    const instance = new Datetimepicker(fixtureEl);

    expect(instance).not.toEqual(null);

    instance._init();

    expect(instance).not.toEqual(null);

    instance.dispose();
  });

  it("should add datepicker and timepicker to DOM", () => {
    const instance = new Datetimepicker(fixtureEl);
    const datepicker = fixtureEl.querySelector("[data-te-datepicker-init]");
    const timepicker = fixtureEl.querySelector("[data-te-timepicker-init]");

    expect(datepicker).not.toBe(null);
    expect(timepicker).not.toBe(null);

    instance.dispose();
  });

  it("should initialize with inline picker", () => {
    const instance = new Datetimepicker(fixtureEl, { inline: true });

    expect(instance._options.inline).toEqual(true);
    expect(instance._datepicker._options.inline).toEqual(true);
    expect(instance._timepicker._options.inline).toEqual(true);

    instance.dispose();
  });

  it("should update pickers value based on input value", () => {
    let instance = new Datetimepicker(fixtureEl);

    const input = fixtureEl.querySelector("input");
    const date = "15/04/2022";
    const time = "05:08 PM";

    input.value = `${date}, ${time}`;
    instance._handleInput(input.value);

    expect(instance._datepicker._input.value).toBe(date);
    expect(instance._timepicker.input.value).toBe(time);

    instance.dispose();

    instance = new Datetimepicker(fixtureEl, {
      datepicker: { format: "dd mmm yyyy" },
      timepicker: { format24: true },
    });

    const date2 = "18 Nov 2013";
    const time2 = "15:43";

    input.value = `${date2}, ${time2}`;
    instance._handleInput(input.value);

    expect(instance._datepicker._input.value).toBe(date2);
    expect(instance._timepicker.input.value).toBe(time2);

    instance.dispose();
  });

  it("should call _init() and dispose()", () => {
    const instance = new Datetimepicker(fixtureEl);

    instance._init = jest.fn();

    instance.update({ inline: false });

    expect(instance._init).toBeCalledTimes(1);

    instance.dispose();
  });

  it("should change it's options", () => {
    const instance = new Datetimepicker(fixtureEl);
    const options = {
      timepicker: { format24: true, format12: false },
      inline: true,
      disabled: true,
      datepicker: { format: "yyyy-mm-dd" },
    };
    expect(instance._options.inline).toEqual(false);
    expect(instance._options.disabled).toEqual(false);

    instance.update(options);

    const toggleButton = document.querySelector(
      "[data-te-date-timepicker-toggle-ref]"
    );

    instance._openDatePicker = jest.fn();

    toggleButton.click();
    expect(instance._openDatePicker).toHaveBeenCalledTimes(0);
    expect(toggleButton.disabled).toBe(true);
    expect(instance._options.inline).toEqual(true);
    expect(instance._options.disabled).toEqual(true);

    instance.update({ disabled: false });
    // check if old button, timepicker, datepicker were deleted
    const toggleButtons = document.querySelectorAll(
      "[data-te-date-timepicker-toggle-ref]"
    );
    const timepickers = document.querySelectorAll("[data-te-timepicker-init]");
    const datepickers = document.querySelectorAll("[data-te-datepicker-init]");

    expect(toggleButtons.length).toEqual(1);
    expect(timepickers.length).toEqual(1);
    expect(datepickers.length).toEqual(1);

    toggleButtons[0].click();
    expect(instance._openDatePicker).toHaveBeenCalledTimes(1);

    instance.dispose();
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const instance = new Datetimepicker(
        fixtureEl,
        {},
        { toggleButton: "text-green-100" }
      );
      const toggleButton = fixtureEl.querySelector(
        "[data-te-date-timepicker-toggle-ref]"
      );

      expect(toggleButton.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.setAttribute("data-te-class-toggle-button", "text-green-100");

      const instance = new Datetimepicker(fixtureEl);
      const toggleButton = fixtureEl.querySelector(
        "[data-te-date-timepicker-toggle-ref]"
      );

      expect(toggleButton.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
    });
  });

  describe("initTE", () => {
    it("should auto-init", () => {
      const datetimepicker = document.createElement("div");
      datetimepicker.setAttribute("data-te-date-timepicker-init", "");
      datetimepicker.setAttribute("data-te-input-wrapper-init", "");
      document.body.appendChild(datetimepicker);
      initTE({ Datetimepicker, Input }, { allowReinits: true });

      const instance = Datetimepicker.getInstance(datetimepicker);
      expect(instance).toBeTruthy();
    });
  });

  describe("jQuery interface", () => {
    beforeEach(() => {
      jQueryMock.fn.datetimepicker = Datetimepicker.jQueryInterface;
      jQueryMock.elements = [fixtureEl];
    });

    it("should initialize a component with options", () => {
      jQueryMock.fn.datetimepicker.call(jQueryMock, {
        inline: true,
      });

      const instance = Datetimepicker.getInstance(fixtureEl);

      expect(instance._options.inline).toEqual(true);

      instance.dispose();
    });

    it("should call public methods", () => {
      jQueryMock.fn.datepicker = Datetimepicker.jQueryInterface;
      jQueryMock.elements = [fixtureEl];

      jQueryMock.fn.datetimepicker.call(jQueryMock);

      const instance = Datetimepicker.getInstance(fixtureEl);

      instance.open = jest.fn();

      jQueryMock.fn.datetimepicker.call(jQueryMock, "open");

      expect(instance.open).toHaveBeenCalled();

      expect(() =>
        jQueryMock.fn.datetimepicker.call(jQueryMock, "test")
      ).toThrow();

      jQueryMock.fn.datetimepicker.call(jQueryMock, "dispose");

      expect(Datetimepicker.getInstance(fixtureEl)).toBe(null);

      expect(() =>
        jQueryMock.fn.datepicker.call(jQueryMock, "dispose")
      ).not.toThrow();
    });
  });
});
