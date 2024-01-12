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
import { getFixture, jQueryMock } from "../mocks";
import EventHandler from "../../src/js/dom/event-handler";
import Timepicker from "../../src/js/forms/timepicker";
import Input from "../../src/js/forms/input";
import initTE from "../../src/js/autoinit/index.js";

const SELECTOR_TOGGLE_BUTTON = "[data-te-timepicker-toggle-button]";

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
  okLabel: "Ok",
  cancelLabel: "Cancel",
  clearLabel: "Clear",
  format12: true,
  format24: false,
  minTime: "",
  maxTime: "",
  inline: false,
  disabled: false,
  headID: "",
  footerID: "",
  bodyID: "",
  pickerID: "",
  modalID: "",
  overflowHidden: true,
  readOnly: false,
  invalidText: "Invalid Time Format",
  increment: false,
  closeModalOnMinutesClick: false,
  showClearBtn: true,
};

describe("Timepicker", () => {
  let fixtureEl;

  beforeAll(() => {
    jest.useFakeTimers("modern");
  });

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `
      <div class="relative" data-te-timepicker-init data-te-input-wrapper-init>
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

  it('should return the component"s name', () => {
    const name = Timepicker.NAME;

    expect(name).toEqual("timepicker");
  });

  it("should create an instance and destroy it on dispose()", () => {
    const instance = new Timepicker(fixtureEl);

    expect(instance).not.toBe(null);

    instance.dispose();
    jest.runAllTimers();

    expect(Timepicker.getInstance(fixtureEl)).toBe(null);
  });

  it("should open timepicker and close it", () => {
    let instance = new Timepicker(fixtureEl);
    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);

    button.dispatchEvent(new MouseEvent("click"));

    jest.runAllTimers();

    expect(document.querySelector("[data-te-timepicker-modal]")).toBeTruthy();
    const timepickerSubmit = document.querySelector(
      "[data-te-timepicker-submit]"
    );

    timepickerSubmit.dispatchEvent(new MouseEvent("click"));

    instance.dispose();
    jest.runAllTimers();
    instance = Timepicker.getInstance(fixtureEl);

    expect(instance).toEqual(null);
  });

  it("should set ID to timepicker-modal", () => {
    const instance = new Timepicker(fixtureEl, { modalID: "test-modal-id" });

    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);
    button.dispatchEvent(new MouseEvent("click"));

    setTimeout(() => {
      const modalId = document.querySelector("#test-modal-id");
      expect(modalId.id).toBe("test-modal-id");

      instance.dispose();
    }, 300);

    jest.runAllTimers();
  });

  it("should initialize with default options", () => {
    const instance = new Timepicker(fixtureEl, { ...DEFAULT_OPTIONS });

    for (const option in DEFAULT_OPTIONS) {
      expect(instance._options[option]).toBe(DEFAULT_OPTIONS[option]);
    }

    instance.dispose();
  });

  it("should initialize with max and min values", () => {
    const instance = new Timepicker(fixtureEl, { maxHour: 11, minHour: 3 });

    expect(instance._options.maxHour).toEqual(11);
    expect(instance._options.minHour).toEqual(3);
    instance.dispose();
  });

  it("should initialize with inline picker", () => {
    const instance = new Timepicker(fixtureEl, { inline: true });

    expect(instance._options.inline).toEqual(true);

    instance.dispose();
  });

  it("should initialize with format24", () => {
    const instance = new Timepicker(fixtureEl, { format24: true });

    expect(instance._options.format24).toEqual(true);

    instance.dispose();
  });

  it("should initialize with polish invalid text", () => {
    const instance = new Timepicker(fixtureEl, {
      invalidText: "Niepoprawny format daty",
    });

    expect(instance._options.invalidText).toEqual("Niepoprawny format daty");

    instance.dispose();
  });

  it("should initialize with increment minutes", () => {
    const instance = new Timepicker(fixtureEl, { increment: true });

    expect(instance._options.increment).toEqual(true);

    instance.dispose();
  });

  it("should set default value to input", () => {
    const instance = new Timepicker(fixtureEl, {
      increment: true,
      defaultTime: "02:12 PM",
    });

    const input = document.querySelector("input");

    expect(instance._options.defaultTime).toEqual("02:12 PM");
    expect(input.value).toEqual("02:12 PM");

    instance.dispose();
  });

  it("should change hour and minute using keyboard", () => {
    const instance = new Timepicker(fixtureEl, {
      inline: true,
      format12: true,
    });
    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);

    button.click();

    setTimeout(() => {
      const arrowUpEvent = new KeyboardEvent("keydown", { code: "ArrowUp" });
      const arrowDownEvent = new KeyboardEvent("keydown", {
        code: "ArrowDown",
      });

      expect(instance._hour.innerHTML).toEqual("12");

      for (let i = 1; i < 25; i++) {
        window.dispatchEvent(arrowUpEvent);
        if (i < 10) {
          expect(instance._hour.innerHTML).toEqual(`0${i}`);
        } else if (i < 13) {
          expect(instance._hour.innerHTML).toEqual(`${i}`);
        } else if (i < 22) {
          expect(instance._hour.innerHTML).toEqual(`0${i - 12}`);
        } else if (i >= 22) {
          expect(instance._hour.innerHTML).toEqual(`${i - 12}`);
        }
      }

      for (let i = 1; i < 24; i++) {
        window.dispatchEvent(arrowDownEvent);
        if (i < 3) {
          expect(instance._hour.innerHTML).toEqual(`${12 - i}`);
        } else if (i < 12) {
          expect(instance._hour.innerHTML).toEqual(`0${12 - i}`);
        } else if (i < 15) {
          expect(instance._hour.innerHTML).toEqual(`${24 - i}`);
        } else {
          expect(instance._hour.innerHTML).toEqual(`0${24 - i}`);
        }
      }

      instance._minutes.focus();

      for (let i = 1; i < 121; i++) {
        window.dispatchEvent(arrowDownEvent);
        if (i < 51) {
          expect(instance._minutes.innerHTML).toEqual(`${60 - i}`);
        } else if (i <= 60) {
          expect(instance._minutes.innerHTML).toEqual(`0${60 - i}`);
        } else if (i < 111) {
          expect(instance._minutes.innerHTML).toEqual(`${120 - i}`);
        } else if (i >= 111) {
          expect(instance._minutes.innerHTML).toEqual(`0${120 - i}`);
        }
      }

      for (let i = 1; i < 120; i++) {
        window.dispatchEvent(arrowUpEvent);
        if (i < 10) {
          expect(instance._minutes.innerHTML).toEqual(`0${i}`);
        } else if (i >= 60 && i < 70) {
          expect(instance._minutes.innerHTML).toEqual(`0${i - 60}`);
        } else if (i >= 70) {
          expect(instance._minutes.innerHTML).toEqual(`${i - 60}`);
        } else if (i < 60) {
          expect(instance._minutes.innerHTML).toEqual(`${i}`);
        }
      }

      instance.dispose();
    }, 500);

    jest.runAllTimers();
  });

  it("should append instance's body to selected container", () => {
    const containerEl = document.createElement("div");
    containerEl.classList.add("container");
    document.body.appendChild(containerEl);

    const instance = new Timepicker(fixtureEl, { container: ".container" });
    expect(instance._options.container).toEqual(".container");

    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);
    button.dispatchEvent(new MouseEvent("click"));

    jest.runAllTimers();
    expect(containerEl.children.length).toEqual(1);

    instance.dispose();
    jest.runAllTimers();

    expect(containerEl.children.length).toEqual(0);
  });

  it("should format24 be true", () => {
    const instance = new Timepicker(fixtureEl, {
      format24: true,
      minTime: "6:25",
      maxTime: "20:35",
    });

    expect(instance._options.format24).toBe(true);
    expect(instance._isInner).toBe(false);

    instance.dispose();
  });

  it("should perform basic input validation on open", () => {
    let instance = new Timepicker(fixtureEl);

    const input = fixtureEl.querySelector("input");
    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);

    input.dispatchEvent(new MouseEvent("input"));
    input.value = "12:05test AM";

    button.dispatchEvent(new MouseEvent("click"));

    setTimeout(() => {
      expect(
        document.querySelector("[data-te-timepicker-hour]").textContent
      ).toBe("12");
      expect(
        document.querySelector("[data-te-timepicker-minute]").textContent
      ).toBe("00");
      expect(instance._inputValue).toBe("");
      expect(instance._isInvalidTimeFormat).toBe(true);

      instance.dispose();
    }, 300);
  });

  it("should update method change options", () => {
    const instance = new Timepicker(fixtureEl, {
      format24: true,
      minTime: "6:25",
      maxTime: "20:35",
    });

    instance.update({
      format24: false,
      format12: true,
      maxTime: "4:30",
      minTime: "1:30",
      inline: true,
    });

    expect(instance._isInner).toBe(false);
    expect(instance._options.format24).toBe(false);
    expect(instance._options.format12).toBe(true);
    expect(instance._options.maxTime).toEqual("4:30");
    expect(instance._options.minTime).toEqual("1:30");
    expect(instance._options.inline).toEqual(true);

    instance.dispose();
  });

  it("should not trigger the mouseup event on clock click when the minutes mode is already active", () => {
    jest.useFakeTimers();

    const instance = new Timepicker(fixtureEl);

    instance._hasTargetInnerClass = jest.fn().mockReturnValue(true);
    EventHandler.trigger = jest.fn().mockImplementation(() => {
      instance._minutes.setAttribute("data-te-timepicker-active", "");
    });

    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);
    button.dispatchEvent(new MouseEvent("click"));

    setTimeout(() => {
      instance._handleClockClick();

      // first time when we open, the hours tips are visible so the "click" event is triggered
      document.dispatchEvent(new MouseEvent("mouseup"));
      expect(EventHandler.trigger).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(500);

      // second time when we open, the minutes tips are already visible so the "click" event is not triggered
      document.dispatchEvent(new MouseEvent("mouseup"));
      expect(EventHandler.trigger).toHaveBeenCalledTimes(1); // still one time because the event is not triggered again

      instance.dispose();
    }, 500);
  });

  it("should change time on triggering mouse events on inline timepicker icon buttons", async () => {
    const instance = new Timepicker(fixtureEl, { inline: true });
    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);

    await button.click();

    setTimeout(() => {
      const iconUpHours = document.querySelector(
        "[data-te-timepicker-icon-up]"
      );
      const iconDownHours = document.querySelector(
        "[data-te-timepicker-icon-down]"
      );
      expect(instance._hour.innerHTML).toEqual("12");

      // after 500 ms the interval will start to decrease the hour with the rate of 100ms (so after 650 ms we will see the first change, and then after 100ms we will see the second change, and so on)
      iconDownHours.dispatchEvent(new MouseEvent("mousedown"));
      jest.advanceTimersByTime(650);
      expect(instance._hour.innerHTML).toEqual("11");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("10");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("09");
      jest.advanceTimersByTime(800);
      expect(instance._hour.innerHTML).toEqual("01");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("12");
      jest.advanceTimersByTime(300);
      expect(instance._hour.innerHTML).toEqual("09");
      iconDownHours.dispatchEvent(new MouseEvent("mouseup"));

      iconUpHours.dispatchEvent(new MouseEvent("mousedown"));
      jest.advanceTimersByTime(650);
      expect(instance._hour.innerHTML).toEqual("10");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("11");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("12");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("01");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("02");
      iconUpHours.dispatchEvent(new MouseEvent("mouseup"));

      instance._minutes.focus();

      // minutes work the same way as hours

      const iconUpMinutes = document.querySelector(
        "[data-te-timepicker-icon-inline-minute][data-te-timepicker-icon-up]"
      );
      const iconDownMinutes = document.querySelector(
        "[data-te-timepicker-icon-inline-minute][data-te-timepicker-icon-down]"
      );
      expect(instance._minutes.innerHTML).toEqual("00");

      iconUpMinutes.dispatchEvent(new MouseEvent("mousedown"));
      jest.advanceTimersByTime(650);
      expect(instance._minutes.innerHTML).toEqual("01");
      iconUpMinutes.dispatchEvent(new MouseEvent("mouseup"));

      iconDownMinutes.dispatchEvent(new MouseEvent("mousedown"));
      jest.advanceTimersByTime(650);
      expect(instance._minutes.innerHTML).toEqual("00");
      jest.advanceTimersByTime(100);
      expect(instance._minutes.innerHTML).toEqual("59");
      iconDownMinutes.dispatchEvent(new MouseEvent("mouseup"));

      instance.dispose();
    }, 500);
  });

  it("should stop changing time in inline picker on mouseup", async () => {
    const instance = new Timepicker(fixtureEl, { inline: true });
    const button = fixtureEl.querySelector(SELECTOR_TOGGLE_BUTTON);
    await button.click();

    setTimeout(() => {
      const iconDownHours = document.querySelector(
        "[data-te-timepicker-icon-down]"
      );
      expect(instance._hour.innerHTML).toEqual("12");

      // after 500 ms the interval will start to decrease the hour with the rate of 100ms (so after 650 ms we will see the first change, and then after 100ms we will see the second change, and so on)
      iconDownHours.dispatchEvent(new MouseEvent("mousedown"));
      jest.advanceTimersByTime(650);
      expect(instance._hour.innerHTML).toEqual("11");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("10");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("09");
      jest.advanceTimersByTime(800);
      expect(instance._hour.innerHTML).toEqual("01");
      jest.advanceTimersByTime(100);
      expect(instance._hour.innerHTML).toEqual("12");
      jest.advanceTimersByTime(300);
      expect(instance._hour.innerHTML).toEqual("09");

      instance._document.dispatchEvent(new MouseEvent("mouseup"));

      // stop the interval after mouseup on document
      jest.advanceTimersByTime(150);
      expect(instance._hour.innerHTML).toEqual("09");

      instance.dispose();
    }, 500);
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      jest.resetModules();

      const instance = new Timepicker(
        fixtureEl,
        {},
        { timepickerToggleButton: "text-green-100" }
      );

      const button = fixtureEl.querySelector("button");
      expect(button.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
      jest.runAllTimers();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.setAttribute(
        "data-te-class-timepicker-toggle-button",
        "text-green-100"
      );

      const instance = new Timepicker(fixtureEl);
      const button = fixtureEl.querySelector("button");

      expect(button.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
      jest.runAllTimers();
    });
  });

  describe("initTE", () => {
    it("should auto-init", () => {
      const timepicker = document.createElement("div");
      timepicker.setAttribute("data-te-timepicker-init", "");
      timepicker.setAttribute("data-te-input-wrapper-init", "");
      timepicker.appendChild(fixtureEl);
      document.body.appendChild(timepicker);
      initTE({ Timepicker, Input }, { allowReinits: true });

      const instance = Timepicker.getInstance(timepicker);
      expect(instance).toBeTruthy();
    });
  });

  describe("jQuery interface", () => {
    it("should initialize a component with options", () => {
      jQueryMock.fn.timepicker = Timepicker.jQueryInterface;
      jQueryMock.elements = [fixtureEl];
      jQueryMock.fn.timepicker.call(jQueryMock, {
        inline: true,
      });

      const instance = Timepicker.getInstance(fixtureEl);

      expect(instance._options.inline).toEqual(true);

      instance.dispose();
    });
  });
});
