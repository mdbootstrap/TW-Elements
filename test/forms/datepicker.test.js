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
import { clearFixture, getFixture, jQueryMock } from "../mocks";
import Datepicker from "../../src/js/forms/datepicker";
import Input from "../../src/js/forms/input";
import SelectorEngine from "../../src/js/dom/selector-engine";
import {
  addDays,
  getDate,
  getDaysInMonth,
  addMonths,
  addYears,
  getYearsOffset,
} from "../../src/js/forms/datepicker/date-utils";
import {
  ENTER,
  LEFT_ARROW,
  RIGHT_ARROW,
  DOWN_ARROW,
  UP_ARROW,
  HOME,
  END,
  PAGE_UP,
  PAGE_DOWN,
} from "../../src/js/util/keycodes";
import initTE from "../../src/js/autoinit/index.js";

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

describe("Datepicker", () => {
  let fixtureEl;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllTimers();
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `
    <div
      class="relative mb-3"
      data-te-datepicker-init
      data-te-input-wrapper-init>
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        placeholder="Select a date" />
      <label
        for="floatingInput"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Select a date</label
      >
    </div>
      `;
  });

  afterEach(() => {
    clearFixture();
    document.getElementsByTagName("html")[0].innerHTML = "";
  });

  it("should return the component name", () => {
    const name = Datepicker.NAME;
    expect(name).toEqual("datepicker");
  });

  it("should create an instance and destroy it on dispose()", () => {
    const datepicker = new Datepicker(fixtureEl);

    const instance = Datepicker.getInstance(fixtureEl);

    expect(instance).not.toBe(null);

    datepicker.dispose();

    expect(Datepicker.getInstance(fixtureEl)).toBe(null);
  });

  describe("options", () => {
    it("should initialize with default options", () => {
      const instance = new Datepicker(fixtureEl);

      const options = {
        title: "Select date",
        monthsFull: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthsShort: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        weekdaysFull: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        weekdaysNarrow: ["S", "M", "T", "W", "T", "F", "S"],
        okBtnText: "Ok",
        clearBtnText: "Clear",
        cancelBtnText: "Cancel",

        okBtnLabel: "Confirm selection",
        clearBtnLabel: "Clear selection",
        cancelBtnLabel: "Cancel selection",
        nextMonthLabel: "Next month",
        prevMonthLabel: "Previous month",
        nextYearLabel: "Next year",
        prevYearLabel: "Previous year",
        nextMultiYearLabel: "Next 24 years",
        prevMultiYearLabel: "Previous 24 years",
        switchToMultiYearViewLabel: "Choose year and month",
        switchToDayViewLabel: "Choose date",

        startDate: null,
        startDay: 0,
        format: "dd/mm/yyyy",
        view: "days",

        min: null,
        max: null,
        filter: null,

        inline: false,
        toggleButton: true,
        disableToggleButton: false,
        disableInput: false,
        confirmDateOnSelect: false,
        removeOkBtn: false,
        removeCancelBtn: false,
        removeClearBtn: false,
      };

      Object.keys(options).forEach((option) => {
        expect(instance.options[option]).toStrictEqual(options[option]);
      });

      instance.dispose();
    });

    it("should initialize with options (JS)", () => {
      const instance = new Datepicker(fixtureEl, {
        title: "Custom title",
        format: "dd-mmmm-yyyy",
      });

      expect(instance.options.title).toEqual("Custom title");
      expect(instance.options.format).toEqual("dd-mmmm-yyyy");

      instance.dispose();
    });

    it("should initialize with options (data attributes)", () => {
      fixtureEl.setAttribute("data-te-title", "Custom title");
      fixtureEl.setAttribute("data-te-format", "dd-mmmm-yyyy");

      const instance = new Datepicker(fixtureEl);

      expect(instance.options.title).toEqual("Custom title");
      expect(instance.options.format).toEqual("dd-mmmm-yyyy");

      instance.dispose();
    });

    it("should update options", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, { startDate });
      const myOptions = {
        title: "Select date",
        monthsFull: [
          "month1",
          "month2",
          "month3",
          "month4",
          "month5",
          "month6",
          "month7",
          "month8",
          "month9",
          "month10",
          "month11",
          "month12",
        ],
        monthsShort: [
          "m1",
          "m2",
          "m3",
          "m4",
          "m5",
          "m6",
          "m7",
          "m8",
          "m9",
          "m10",
          "m11",
          "m12",
        ],
        weekdaysFull: [
          "poniedziałek",
          "wtorek",
          "środa",
          "czwartek",
          "piątek",
          "sobota",
          "niedziela",
        ],
        weekdaysShort: ["pon", "wt", "śr", "czw", "pt", "sb", "nd"],
        okBtnText: "Okej",
        clearBtnText: "wyczyść",
        cancelBtnText: "anuluj",

        switchToMonthViewLabel: "wybierz datę",

        format: "dd/mm/yyyy",
        view: "months",

        inline: true,
      };

      instance.update(myOptions);

      expect(instance._options.okBtnText).toEqual(myOptions.okBtnText);
      expect(instance._options.clearBtnText).toEqual(myOptions.clearBtnText);
      expect(instance._options.cancelBtnText).toEqual(myOptions.cancelBtnText);
      expect(instance._options.switchToMonthViewLabel).toEqual(
        myOptions.switchToMonthViewLabel
      );
      expect(instance._options.format).toEqual(myOptions.format);
      expect(instance._options.view).toEqual(myOptions.view);
      expect(instance._options.inline).toEqual(myOptions.inline);

      instance._options.monthsFull.forEach((value, i) =>
        expect(value).toEqual(myOptions.monthsFull[i])
      );

      instance._options.monthsShort.forEach((value, i) =>
        expect(value).toEqual(myOptions.monthsShort[i])
      );

      instance._options.weekdaysFull.forEach((value, i) =>
        expect(value).toEqual(myOptions.weekdaysFull[i])
      );

      instance._options.weekdaysShort.forEach((value, i) =>
        expect(value).toEqual(myOptions.weekdaysShort[i])
      );

      instance.dispose();
    });
  });

  describe("opening and closing", () => {
    it("should open and close component in modal mode by default", () => {
      const instance = new Datepicker(fixtureEl, { animations: false });

      instance.open();

      expect(instance._isOpen).toBeTruthy();
      expect(
        SelectorEngine.findOne("[data-te-dropdown-backdrop-ref]")
      ).toBeTruthy();
      expect(
        SelectorEngine.findOne("[data-te-datepicker-modal-container-ref]")
      ).toBeTruthy();

      instance.close();

      expect(instance._isOpen).toBe(false);

      expect(
        SelectorEngine.findOne("[data-te-dropdown-backdrop-ref]")
      ).toBeNull();
      expect(
        SelectorEngine.findOne("[data-te-datepicker-modal-container-ref]")
      ).toBeNull();

      instance.dispose();
    });

    it("should open component in inline mode if inline option is set to true", () => {
      const instance = new Datepicker(fixtureEl, { inline: true });

      instance.open();

      setTimeout(() => {
        expect(instance._isOpen).toBeTruthy();
        expect(
          SelectorEngine.findOne("[data-te-dropdown-backdrop-ref]")
        ).toBeNull();
        expect(
          SelectorEngine.find("[data-te-datepicker-dropdown-container-ref]")
            .length
        ).toEqual(1);
      }, 300);
      jest.runAllTimers();

      instance.close();

      const dropdownContainer = SelectorEngine.findOne(
        "[data-te-datepicker-dropdown-container-ref]"
      );
      dropdownContainer.dispatchEvent(new Event("animationend"));

      expect(instance._isOpen).toBe(false);
      expect(
        SelectorEngine.findOne("[data-te-datepicker-dropdown-container-ref]")
      ).toBeNull();

      instance.dispose();
    });
  });

  describe("date selection", () => {
    it("should format date correctly", () => {
      const instance = new Datepicker(fixtureEl, { format: "dd, mm, yyyy" });

      expect(instance.formatDate(new Date(2020, 5, 10))).toEqual(
        "10, 06, 2020"
      );

      instance._options.format = "dddd, dd mmm, yyyy";

      expect(instance.formatDate(new Date(2020, 5, 10))).toEqual(
        "Wednesday, 10 Jun, 2020"
      );

      instance._options.format = "ddd, dd mmmm, yyyy";

      expect(instance.formatDate(new Date(2020, 5, 10))).toEqual(
        "Wed, 10 June, 2020"
      );

      instance._options.format = "d/mmm/yyyy";

      expect(instance.formatDate(new Date(2020, 5, 5))).toEqual("5/Jun/2020");

      instance._options.format = "d/m/yyyy";

      expect(instance.formatDate(new Date(2020, 5, 5))).toEqual("5/6/2020");

      instance.dispose();
    });

    it("should parse date string correctly", () => {
      const format = "dddd, dd mmm, yyyy";
      const instance = new Datepicker(fixtureEl, { format });
      const delimeters = instance._getDelimeters(format);

      expect(
        instance._parseDate("Wednesday, 10 Jun, 2020", format, delimeters)
      ).toEqual(new Date(2020, 5, 10));

      instance.dispose();
    });

    it("should correctly select date in inline mode", () => {
      const startDate = new Date(2020, 5, 15);
      const inline = true;
      const format = "dd, mm, yyyy";
      const instance = new Datepicker(fixtureEl, { startDate, inline, format });
      const input = fixtureEl.querySelector("input");

      instance.open();

      setTimeout(() => {
        const container = SelectorEngine.findOne(
          "[data-te-datepicker-dropdown-container-ref]"
        );
        const cell = SelectorEngine.findOne(
          '[data-te-date="2020-5-15"]',
          container
        );

        cell.click();

        expect(instance._selectedDate).toEqual(startDate);
        expect(input.value).toEqual("15, 06, 2020");
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should correctly select date in modal mode", () => {
      const startDate = new Date(2020, 5, 15);
      const format = "dd, mm, yyyy";
      const instance = new Datepicker(fixtureEl, {
        startDate: startDate,
        format: format,
      });
      const input = fixtureEl.querySelector("input");

      instance.open();

      setTimeout(() => {
        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const cell = SelectorEngine.findOne(
          '[data-te-date="2020-5-20"]',
          container
        );
        const okBtn = SelectorEngine.findOne(
          "[data-te-datepicker-ok-button-ref]",
          container
        );

        expect(container).toBeTruthy();

        cell.click();

        expect(instance._selectedDate).toEqual(new Date(2020, 5, 20));

        okBtn.click();

        expect(input.value).toEqual("20, 06, 2020");
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should correctly select year and switch to month view & to days view and select proper date", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, {
        startDate: startDate,
        view: "years",
      });

      instance.open();
      jest.runAllTimers();

      const container = SelectorEngine.findOne(
        "[data-te-datepicker-modal-container-ref]"
      );
      const cell = SelectorEngine.findOne('[data-te-year="2020"]', container);

      cell.click();
      expect(instance._headerYear).toEqual(2020);
      expect(instance._headerMonth).toEqual(null);
      expect(instance._selectedYear).toEqual(null);

      setTimeout(() => {
        expect(instance._view).toBe("months");
      }, 300);
      jest.runAllTimers();

      const marchCell = SelectorEngine.findOne(
        '[data-te-month="2"]',
        container
      );
      marchCell.click();

      setTimeout(() => {
        expect(instance._headerYear).toEqual(2020);
        expect(instance._headerMonth).toEqual(2);
        expect(instance._view).toBe("days");
      }, 300);
      jest.runAllTimers();

      const day6Cell = SelectorEngine.findOne(
        '[data-te-date="2020-2-6"]',
        container
      );
      day6Cell.click();

      setTimeout(() => {
        expect(instance._headerYear).toEqual(2020);
        expect(instance._headerMonth).toEqual(2);
        expect(instance._view).toBe("days");
      }, 300);
      jest.runAllTimers();

      SelectorEngine.findOne("[data-te-datepicker-ok-button-ref]").click();

      expect(instance._view).toBe("years");
      expect(instance._selectedMonth).toEqual(2);
      expect(instance._selectedYear).toEqual(2020);

      expect(instance._selectedDate.getFullYear()).toEqual(2020);
      expect(instance._selectedDate.getMonth()).toEqual(2);
      expect(instance._selectedDate.getDay()).toEqual(5);

      instance.dispose();
    });

    it("should correctly select month and switch to days view", () => {
      const startDate = new Date(2020, 5, 15);
      const view = "months";
      const instance = new Datepicker(fixtureEl, {
        startDate: startDate,
        view: view,
      });

      instance.open();

      const container = SelectorEngine.findOne(
        "[data-te-datepicker-modal-container-ref]"
      );
      const cell = SelectorEngine.findOne('[data-te-month="5"]', container);

      cell.click();

      setTimeout(() => {
        expect(instance._headerMonth).toEqual(5);
        expect(instance._view).toBe("days");
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should set min and max correctly with string", () => {
      jest.clearAllMocks;
      const startDate = new Date(2022, 5, 10);
      const format = "dd, mm, yyyy";
      const instance = new Datepicker(fixtureEl, {
        min: "2022-05-02",
        max: "2022-06-15",
        startDate,
        format,
      });
      const input = fixtureEl.querySelector("input");

      const calendarIcon = fixtureEl.querySelector(
        "[data-te-datepicker-toggle-button-ref]"
      );

      // test date in range
      calendarIcon.dispatchEvent(new MouseEvent("click"));

      const containerList = SelectorEngine.find(
        "[data-te-datepicker-modal-container-ref]"
      );
      const container = containerList[containerList.length - 1];
      const okBtn = SelectorEngine.findOne(
        "[data-te-datepicker-ok-button-ref]",
        container
      );

      expect(container).toBeTruthy();

      instance.datesContainer.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: ENTER })
      );

      okBtn.dispatchEvent(new MouseEvent("click"));

      expect(input.value).toEqual("10, 06, 2022");
      // test date out of range
      calendarIcon.dispatchEvent(new MouseEvent("click"));
      instance.datesContainer.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      instance.datesContainer.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: ENTER })
      );

      okBtn.dispatchEvent(new MouseEvent("click"));

      expect(input.value).toEqual("10, 06, 2022");

      instance.dispose();
    });

    it("should not select past date", () => {
      const yesterdayDate = new Date();
      const currentDate = new Date();
      let currentDay = currentDate.getDate();
      let currentMonth = currentDate.getMonth();
      let currentMonthMMFormat = currentMonth + 1;
      let currentYear = currentDate.getFullYear();

      yesterdayDate.setDate(yesterdayDate.getDate() - 133);
      let yesterdayDay = yesterdayDate.getDate();

      if (String(currentDay).length === 1) {
        currentDay = `0${currentDay}`;
      }
      if (String(yesterdayDay).length === 1) {
        yesterdayDay = `0${yesterdayDay}`;
      }
      if (String(currentMonth).length === 1) {
        currentMonthMMFormat = `0${currentMonthMMFormat}`;
      }

      const instance = new Datepicker(fixtureEl, {
        disablePast: true,
      });
      const input = fixtureEl.querySelector("input");

      instance.open();
      const nextBtn = SelectorEngine.findOne(
        "[data-te-datepicker-next-button-ref]"
      );
      const previousBtn = SelectorEngine.findOne(
        "[data-te-datepicker-previous-button-ref]"
      );
      const okBtn = SelectorEngine.findOne(
        "[data-te-datepicker-ok-button-ref]"
      );
      const yesterdayDateBtn = document.querySelector(
        `[data-te-date="${currentYear}-${currentMonth}-${yesterdayDay}"]`
      );

      expect(instance._options.disablePast).toEqual(true);
      expect(nextBtn.disabled).toEqual(false);
      expect(previousBtn.disabled).toEqual(true);

      // don't run next part of the test if 'today' is first day of the month
      if (currentDate.getMonth() != yesterdayDate.getMonth()) {
        return;
      }
      expect(
        yesterdayDateBtn.getAttribute("[data-te-datepicker-cell-disabled]")
      ).toBe(true);

      yesterdayDateBtn.click();

      okBtn.dispatchEvent(new MouseEvent("click"));

      expect(input.value).toEqual("");

      instance.dispose();
    });

    it("should reset select date field on clear", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, { startDate });
      instance.open();

      instance.datesContainer.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      instance.datesContainer.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: ENTER })
      );

      expect(instance._selectedDate).toEqual(addDays(startDate, 7));

      const selectDateField = SelectorEngine.findOne(
        "[data-te-datepicker-date-text-ref]"
      );

      expect(selectDateField.textContent).toEqual("Mon, Jun 22");

      instance.clearButton.click();

      expect(selectDateField.textContent).toEqual("Mon, Jun 15");

      instance.dispose();
    });

    it("should close modal after date selection when confirmDateOnSelect option is true", () => {
      const startDate = new Date(2020, 5, 15);
      const format = "dd, mm, yyyy";
      const instance = new Datepicker(fixtureEl, {
        startDate: startDate,
        format: format,
        confirmDateOnSelect: true,
      });
      const input = fixtureEl.querySelector("input");

      instance.open();
      expect(instance.okButton).toBeTruthy();
      expect(instance._isOpen).toBeTruthy();

      setTimeout(() => {
        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const cell = SelectorEngine.findOne(
          '[data-te-date="2020-5-20"]',
          container
        );

        expect(container).toBeTruthy();

        cell.click();

        expect(instance._selectedDate).toEqual(new Date(2020, 5, 20));
        expect(instance._isOpen).toBeFalsy();
        expect(input.value).toEqual("20, 06, 2020");
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should remove Ok button  when removeOkBtn option is true", () => {
      const instance = new Datepicker(fixtureEl, { removeOkBtn: true });

      instance.open();

      expect(instance.cancelButton).toBeTruthy();
      expect(instance.okButton).toBeNull();

      instance.dispose();
    });

    it("should remove Cancel button when removeOkBtn option is true", () => {
      const instance = new Datepicker(fixtureEl, { removeCancelBtn: true });

      instance.open();

      expect(instance.cancelButton).toBeNull();
      expect(instance.okButton).toBeTruthy();

      instance.dispose();
    });

    it("should remove Clear button when removeOkBtn option is true", () => {
      const instance = new Datepicker(fixtureEl, { removeClearBtn: true });

      instance.open();

      expect(instance.clearButton).toBeNull();
      expect(instance.okButton).toBeTruthy();

      instance.dispose();
    });
  });

  describe("controls", () => {
    it("should increase month by 1 and update view on next click in day view", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, { startDate: startDate });

      instance.open();

      setTimeout(() => {
        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const nextButton = SelectorEngine.findOne(
          "[data-te-datepicker-next-button-ref]",
          container
        );
        const viewChangeBtn = SelectorEngine.findOne(
          "[data-te-datepicker-view-change-button-ref]",
          container
        );

        expect(viewChangeBtn.textContent.trim() === "June 2020").toBe(true);

        nextButton.click();

        expect(instance._activeDate).toEqual(addMonths(startDate, 1));
        expect(viewChangeBtn.textContent.trim() === "July 2020").toBe(true);

        const newDateCell = SelectorEngine.findOne(
          '[data-te-date="2020-6-10"]',
          container
        );
        expect(newDateCell).toBeTruthy();
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should decrease month by 1 and update view on previous click in day view", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, { startDate: startDate });

      instance.open();
      setTimeout(() => {
        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const previousBtn = SelectorEngine.findOne(
          "[data-te-datepicker-previous-button-ref]",
          container
        );
        const viewChangeBtn = SelectorEngine.findOne(
          "[data-te-datepicker-view-change-button-ref]",
          container
        );
        expect(viewChangeBtn.textContent.trim() === "June 2020").toBe(true);
        previousBtn.click();
        expect(instance._activeDate).toEqual(addMonths(startDate, -1));
        expect(viewChangeBtn.textContent.trim() === "May 2020").toBe(true);
        const newDateCell = SelectorEngine.findOne(
          '[data-te-date="2020-4-10"]',
          container
        );
        expect(newDateCell).toBeTruthy();
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should increase years by 24 and update view on next click in years view", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, {
        startDate: startDate,
        view: "years",
      });

      setTimeout(() => {
        instance.open();

        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const nextButton = SelectorEngine.findOne(
          "[data-te-datepicker-next-button-ref]",
          container
        );
        const viewChangeBtn = SelectorEngine.findOne(
          "[data-te-datepicker-view-change-button-ref]",
          container
        );

        expect(viewChangeBtn.textContent.trim() === "2016 - 2039").toBe(true);

        nextButton.click();

        expect(instance._activeDate).toEqual(addYears(startDate, 24));
        expect(viewChangeBtn.textContent.trim() === "2040 - 2063").toBe(true);

        const newYearCell = SelectorEngine.find(
          '[data-te-year="2040"]',
          container
        );
        expect(newYearCell.length).toEqual(1);
      }, 300);

      jest.runAllTimers();

      instance.dispose();
    });

    it("should decrease years by 24 and update view on previous click in years view", () => {
      const startDate = new Date(2020, 5, 15);
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      setTimeout(() => {
        instance.open();

        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const previousBtn = SelectorEngine.findOne(
          "[data-te-datepicker-previous-button-ref]",
          container
        );
        const viewChangeBtn = SelectorEngine.findOne(
          "[data-te-datepicker-view-change-button-ref]",
          container
        );

        expect(viewChangeBtn.textContent.trim() === "2016 - 2039").toBe(true);

        previousBtn.click();

        expect(instance._activeDate).toEqual(addYears(startDate, -24));
        expect(viewChangeBtn.textContent.trim() === "1992 - 2015").toBe(true);

        const newYearCell = SelectorEngine.findOne(
          '[data-te-year="1995"]',
          container
        );
        expect(newYearCell).toBeTruthy();
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should increase year by 1 and update view on next click in months view", () => {
      const startDate = new Date(2020, 5, 15);
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      setTimeout(() => {
        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const nextButton = SelectorEngine.findOne(
          "[data-te-datepicker-next-button-ref]",
          container
        );
        const viewChangeBtn = SelectorEngine.findOne(
          "[data-te-datepicker-view-change-button-ref]",
          container
        );

        expect(viewChangeBtn.textContent.trim() === "2020").toBe(true);

        nextButton.click();

        expect(instance._activeDate).toEqual(addYears(startDate, 1));
        expect(viewChangeBtn.textContent.trim() === "2021").toBe(true);

        const newMonthCell = SelectorEngine.findOne(
          '[data-te-year="2021"][data-te-month="5"]',
          container
        );
        expect(newMonthCell).toBeTruthy();
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });

    it("should decrease year by 1 and update view on previous click in months view", () => {
      const startDate = new Date(2020, 5, 15);
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      setTimeout(() => {
        instance.open();

        const container = SelectorEngine.findOne(
          "[data-te-datepicker-modal-container-ref]"
        );
        const previousBtn = SelectorEngine.findOne(
          "[data-te-datepicker-previous-button-ref]",
          container
        );
        const viewChangeBtn = SelectorEngine.findOne(
          "[data-te-datepicker-view-change-button-ref]",
          container
        );

        expect(viewChangeBtn.textContent.trim() === "2020").toBe(true);

        previousBtn.click();

        expect(instance._activeDate).toEqual(addYears(startDate, -1));
        expect(viewChangeBtn.textContent.trim() === "2019").toBe(true);

        const newMonthCell = SelectorEngine.findOne(
          '[data-te-year="2019"][data-te-month="5"]',
          container
        );
        expect(newMonthCell).toBeTruthy();
      }, 300);
      jest.runAllTimers();

      instance.dispose();
    });
  });

  describe("accessibility", () => {
    it("should add correct aria attributes to the elements", () => {
      const instance = new Datepicker(fixtureEl);

      instance.open();

      expect(instance.viewChangeButton.getAttribute("aria-label")).toBe(
        "Choose year and month"
      );
      expect(instance.previousButton.getAttribute("aria-label")).toBe(
        "Previous month"
      );
      expect(instance.nextButton.getAttribute("aria-label")).toBe("Next month");
      expect(instance.okButton.getAttribute("aria-label")).toBe(
        "Confirm selection"
      );
      expect(instance.cancelButton.getAttribute("aria-label")).toBe(
        "Cancel selection"
      );
      expect(instance.clearButton.getAttribute("aria-label")).toBe(
        "Clear selection"
      );

      instance.dispose();
    });

    it("should update aria attributes on view change", () => {
      const instance = new Datepicker(fixtureEl, { view: "years" });

      instance.open();

      expect(instance.viewChangeButton.getAttribute("aria-label")).toBe(
        "Choose date"
      );
      expect(instance.previousButton.getAttribute("aria-label")).toBe(
        "Previous 24 years"
      );
      expect(instance.nextButton.getAttribute("aria-label")).toBe(
        "Next 24 years"
      );

      instance.dispose();
    });
  });

  describe("day view keyboard navigation", () => {
    it("should increment days by 1 on right arrow keydown", () => {
      const startDate = new Date();
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: RIGHT_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addDays(startDate, 1));

      instance.dispose();
    });

    it("should decrement days by 1 on left arrow keydown", () => {
      const startDate = new Date();
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: LEFT_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addDays(startDate, -1));

      instance.dispose();
    });

    it("should increment days by 7 on down arrow keydown", () => {
      const instance = new Datepicker(fixtureEl, { startDate: new Date() });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: DOWN_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addDays(new Date(), 7));

      instance.dispose();
    });

    it("should decrement days by 7 on up arrow keydown", () => {
      const startDate = new Date();
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: UP_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addDays(startDate, -7));

      instance.dispose();
    });

    it("should select first day of the month on home keydown", () => {
      const startDate = new Date();
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: HOME });
      instance.datesContainer.dispatchEvent(event);

      const firstDayOfTheMonth = addDays(startDate, 1 - getDate(startDate));

      expect(instance._activeDate).toEqual(firstDayOfTheMonth);

      instance.dispose();
    });

    it("should select last day of the month on end keydown", () => {
      const startDate = new Date();
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: END });
      instance.datesContainer.dispatchEvent(event);

      const lastDayOfTheMonth = addDays(
        startDate,
        getDaysInMonth(startDate) - getDate(startDate)
      );

      expect(instance._activeDate).toEqual(lastDayOfTheMonth);

      instance.dispose();
    });

    it("should increment months by 1 on page down keydown", () => {
      const startDate = new Date();
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: PAGE_DOWN });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addMonths(startDate, 1));

      instance.dispose();
    });

    it("should decrement months by 1 on page up keydown", () => {
      const startDate = new Date();
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: PAGE_UP });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addMonths(startDate, -1));

      instance.dispose();
    });

    it("should select date on enter keydown", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, { startDate });

      instance.open();

      const event = new KeyboardEvent("keydown", { keyCode: ENTER });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._selectedDate).toEqual(startDate);

      instance.dispose();
    });

    it("should update select date field on enter keydown", () => {
      const startDate = new Date(2020, 5, 15);
      const instance = new Datepicker(fixtureEl, { startDate });
      instance.open();

      instance.datesContainer.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      instance.datesContainer.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: ENTER })
      );

      expect(instance._selectedDate).toEqual(addDays(startDate, 7));

      const selectDateField = SelectorEngine.findOne(
        "[data-te-datepicker-date-text-ref]"
      );

      expect(selectDateField.textContent).toEqual("Mon, Jun 22");

      instance.dispose();
    });
  });

  describe("years view keyboard navigation", () => {
    it("should increment years by 1 on right arrow keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: RIGHT_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, 1));

      instance.dispose();
    });

    it("should decrement years by 1 on left arrow keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: LEFT_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, -1));

      instance.dispose();
    });

    it("should increment years by 4 on down arrow keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: DOWN_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, 4));

      instance.dispose();
    });

    it("should decrement years by 4 on up arrow keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: UP_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, -4));

      instance.dispose();
    });

    it("should select first year in view on home keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: HOME });
      instance.datesContainer.dispatchEvent(event);

      const firstYearInView = addYears(
        startDate,
        -getYearsOffset(startDate, 24)
      );

      expect(instance._activeDate).toEqual(firstYearInView);

      instance.dispose();
    });

    it("should select last year in view on end keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: END });
      instance.datesContainer.dispatchEvent(event);

      const lastYearInView = addYears(
        startDate,
        24 - getYearsOffset(startDate, 24) - 1
      );

      expect(instance._activeDate).toEqual(lastYearInView);

      instance.dispose();
    });

    it("should increment years by 24 on page down keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: PAGE_DOWN });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, 24));

      instance.dispose();
    });

    it("should decrement years by 24 on page up keydown", () => {
      const startDate = new Date();
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: PAGE_UP });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, -24));

      instance.dispose();
    });

    it("should select year on enter keydown", () => {
      const startDate = new Date(2020, 5, 15);
      const view = "years";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: ENTER });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._headerYear).toEqual(2020);

      instance.dispose();
    });
  });

  describe("months view keyboard navigation", () => {
    it("should increment month by 1 on right arrow keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: RIGHT_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addMonths(startDate, 1));

      instance.dispose();
    });

    it("should decrement months by 1 on left arrow keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: LEFT_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addMonths(startDate, -1));

      instance.dispose();
    });

    it("should increment months by 4 on down arrow keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: DOWN_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addMonths(startDate, 4));

      instance.dispose();
    });

    it("should decrement months by 4 on up arrow keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: UP_ARROW });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addMonths(startDate, -4));

      instance.dispose();
    });

    it("should select first month in view on home keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: HOME });
      instance.datesContainer.dispatchEvent(event);

      const firstMonthInView = addMonths(
        instance._activeDate,
        -instance.activeMonth
      );

      expect(instance._activeDate).toEqual(firstMonthInView);

      instance.dispose();
    });

    it("should select last month in view on end keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: END });
      instance.datesContainer.dispatchEvent(event);

      const lastMonthInView = addMonths(
        instance._activeDate,
        11 - instance.activeMonth
      );

      expect(instance._activeDate).toEqual(lastMonthInView);

      instance.dispose();
    });

    it("should increment years by 1 on page down keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: PAGE_DOWN });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, 1));

      instance.dispose();
    });

    it("should decrement years by 1 on page up keydown", () => {
      const startDate = new Date();
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: PAGE_UP });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._activeDate).toEqual(addYears(startDate, -1));

      instance.dispose();
    });

    it("should select year on enter keydown", () => {
      const startDate = new Date(2020, 5, 15);
      const view = "months";
      const instance = new Datepicker(fixtureEl, { startDate, view });

      instance.open();
      const event = new KeyboardEvent("keydown", { keyCode: ENTER });
      instance.datesContainer.dispatchEvent(event);

      expect(instance._headerMonth).toEqual(5);

      instance.dispose();
    });

    it("should append instance`s body to selected container", () => {
      const containerEl = document.createElement("div");
      containerEl.classList.add("container");
      document.body.appendChild(containerEl);

      const instance = new Datepicker(fixtureEl, { container: ".container" });
      expect(instance._options.container).toEqual(".container");

      instance.open();

      expect(containerEl.children.length).toEqual(2);

      instance.close();

      expect(containerEl.children.length).toEqual(2);

      instance.dispose();
      containerEl.remove();
    });
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const instance = new Datepicker(
        fixtureEl,
        {},
        { datepickerBackdrop: "text-green-100" }
      );

      instance.open();
      const backdrop = SelectorEngine.findOne(
        "[data-te-dropdown-backdrop-ref]"
      );
      expect(backdrop.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.setAttribute(
        "data-te-class-datepicker-backdrop",
        "text-green-100"
      );

      const instance = new Datepicker(fixtureEl);
      instance.open();
      const backdrop = SelectorEngine.findOne(
        "[data-te-dropdown-backdrop-ref]"
      );
      expect(backdrop.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
    });
  });

  describe("initTE", () => {
    it("should auto-init", () => {
      const datepicker = document.createElement("div");
      datepicker.setAttribute("data-te-datepicker-init", "");
      datepicker.setAttribute("data-te-input-wrapper-init", "");
      datepicker.appendChild(fixtureEl);
      document.body.appendChild(datepicker);
      initTE({ Datepicker, Input }, { allowReinits: true });

      const instance = Datepicker.getInstance(datepicker);
      expect(instance).toBeTruthy();
    });
  });

  describe("jQuery interface", () => {
    it("should register jQuery methods", () => {
      jest.resetModules();

      const mock = { ...jQueryMock };
      window.jQuery = mock;

      const initTE = require("../../src/js/autoinit/index.js").default;
      const Datepicker = require("../../src/js/forms/datepicker").default;

      initTE({ Datepicker });

      expect(mock.fn.datepicker).toBeTruthy();

      expect(typeof mock.fn.datepicker.noConflict()).toBe("function");
      window.jQuery = null;
    });

    it("should initialize a component with options", () => {
      jest.resetModules();
      jQueryMock.fn.datepicker = Datepicker.jQueryInterface;
      jQueryMock.elements = [fixtureEl];

      jQueryMock.fn.datepicker.call(jQueryMock, {
        title: "Custom title",
      });

      const instance = Datepicker.getInstance(fixtureEl);

      expect(instance.options.title).toEqual("Custom title");

      instance.dispose();
    });

    it("should call public methods", () => {
      jQueryMock.fn.datepicker = Datepicker.jQueryInterface;
      jQueryMock.elements = [fixtureEl];

      jQueryMock.fn?.datepicker?.call(jQueryMock);

      const instance = Datepicker.getInstance(fixtureEl);

      instance.open = jest.fn();

      jQueryMock.fn.datepicker.call(jQueryMock, "open");

      expect(instance.open).toHaveBeenCalled();

      expect(() => jQueryMock.fn.datepicker.call(jQueryMock, "test")).toThrow();

      jQueryMock.fn.datepicker.call(jQueryMock, "dispose");

      expect(Datepicker.getInstance(fixtureEl)).toBe(null);

      expect(() =>
        jQueryMock.fn.datepicker.call(jQueryMock, "dispose")
      ).not.toThrow();
    });
  });
});
