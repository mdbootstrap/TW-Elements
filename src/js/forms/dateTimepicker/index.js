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

import { element, getUID, typeCheckConfig } from "../../util/index";
import {
  getDelimeters,
  parseDate,
  getMonth,
  getYear,
  isValidDate,
  isValidTime,
} from "./utils";
import { getIconButtonsTemplate, getToggleButtonTemplate } from "./templates";
import ScrollBarHelper from "../../util/scrollbar";
import Data from "../../dom/data";
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import Datepicker from "../datepicker";
import Timepicker from "../timepicker";

const NAME = "datetimepicker";
const DATA_KEY = `te.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;

const ATTR_DATEPICKER = "data-te-datepicker-init";
const ATTR_TIMEPICKER = "data-te-timepicker-init";

const ATTR_DATEPICKER_HEADER = "data-te-datepicker-header";
const ATTR_DATEPICKER_CANCEL_BTN_REF = "data-te-datepicker-cancel-button-ref";
const ATTR_DATEPICKER_OK_BTN_REF = "data-te-datepicker-ok-button-ref";

const ATTR_TIMEPICKER_WRAPPER = "data-te-timepicker-wrapper";
const ATTR_TIMEPICKER_CANCEL_BTN = "data-te-timepicker-cancel";
const ATTR_TIMEPICKER_SUBMIT = "data-te-timepicker-submit";
const ATTR_TIMEPICKER_CLEAR = "data-te-timepicker-clear";

const ATTR_BUTTON_TIMEPICKER = "data-te-buttons-timepicker";
const ATTR_TOGGLE_BUTTON = `data-te-date-timepicker-toggle-ref`;
const ATTR_DATEPICKER_TOGGLE_BTN = "data-te-datepicker-toggle-button-ref";
const ATTR_TIMEPICKER_TOGGLE_BTN = "data-te-timepicker-toggle-button-ref";

const SELECTOR_TIMEPICKER = `[${ATTR_TIMEPICKER}]`;
const SELECTOR_DATEPICKER = `[${ATTR_DATEPICKER}]`;
const SELECTOR_TOGGLE_BUTTON = `[${ATTR_TOGGLE_BUTTON}]`;
const SELECTOR_TIMEPICKER_TOGGLE = `[${ATTR_TIMEPICKER_TOGGLE_BTN}]`;

const SELECTOR_INPUT_NOTCH = "[data-te-input-notch-ref]";
const SELECTOR_DATA_TOGGLE = `[data-te-date-timepicker-toggle-ref]`;
const SELECTOR_TIMEPICKER_ELEMENTS = "[data-te-timepicker-elements-wrapper]";
const SELECTOR_TIMEPICKER_CLOCK = "[data-te-timepicker-clock-wrapper]";

const EVENT_OPEN = `open${EVENT_KEY}`;
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_DATETIME_CHANGE = `datetimeChange${EVENT_KEY}`;

const EVENT_CLOSE_DATEPICKER = "close.te.datepicker";
const EVENT_INPUT_TIMEPICKER = "input.te.timepicker";
const BUTTONS_WRAPPER = element("div");

const Default = {
  inline: false,
  toggleButton: true,
  container: "body",
  disabled: false,
  disablePast: false,
  disableFuture: false,
  defaultTime: "",
  defaultDate: "",
  timepicker: {},
  datepicker: {},
  showFormat: false,
  dateTimepickerToggleIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
  </svg>`,
  datepickerToggleIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
  </svg>`,
  timepickerToggleIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
};

const DefaultType = {
  inline: "boolean",
  toggleButton: "boolean",
  container: "string",
  disabled: "boolean",
  disablePast: "boolean",
  disableFuture: "boolean",
  defaultTime: "(string|date|number)",
  defaultDate: "(string|date|number)",
  timepicker: "object",
  datepicker: "object",
  showFormat: "boolean",
  dateTimepickerToggleIconTemplate: "string",
  datepickerToggleIconTemplate: "string",
  timepickerToggleIconTemplate: "string",
};

const DefaultClasses = {
  toggleButton:
    "flex items-center justify-content-center [&>svg]:w-5 [&>svg]:h-5 absolute outline-none border-none bg-transparent right-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-primary focus:text-primary dark:hover:text-primary-400 dark:focus:text-primary-400 dark:text-neutral-200",
  pickerIcon:
    "[&>svg]:w-6 [&>svg]:h-6 [&>svg]:mx-auto [&>svg]:pointer-events-none w-1/2 px-1.5 py-[1px] rounded-[10px] min-h-[40px] cursor-pointer outline-none border-none text-white hover:bg-primary-600 dark:hover:bg-neutral-600",
  buttonsContainer:
    "flex justify-evenly items-end bg-primary dark:bg-zinc-800 dark:data-[te-buttons-timepicker]:bg-zinc-700",
  timepicker: {},
  datepicker: {},
};

const DefaultClassesType = {
  toggleButton: "string",
  pickerIcon: "string",
  buttonsContainer: "string",
  timepicker: "object",
  datepicker: "object",
};

class Datetimepicker {
  constructor(element, options, classes) {
    this._element = element;

    this._input = SelectorEngine.findOne("input", this._element);
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);

    this._timepicker = null;
    this._datepicker = null;
    this._dateValue = this._options.defaultDate
      ? this._options.defaultDate
      : "";
    this._timeValue = this._options.defaultTime
      ? this._options.defaultTime
      : "";
    this._isInvalidTimeFormat = false;
    this._format = this._options.datepicker.format
      ? this._options.datepicker.format
      : "dd/mm/yyyy";
    this._cancel = false;

    this._scrollBar = new ScrollBarHelper();

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._init();
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get toggleButton() {
    return SelectorEngine.findOne(SELECTOR_TOGGLE_BUTTON, this._element);
  }

  get notch() {
    return SelectorEngine.findOne(SELECTOR_INPUT_NOTCH, this._element);
  }

  dispose() {
    EventHandler.off(this._element, "click", this._openDatePicker);
    EventHandler.off(this._input, "input", this._handleInput);
    EventHandler.off(this._element, "click");
    Data.removeData(this._element, DATA_KEY);

    this._removeTimePicker();
    this._removeDatepicker();
    this.toggleButton?.remove();

    this._options = Default;
    this._timepicker = null;
    this._datepicker = null;
    this._dateValue = null;
    this._timeValue = null;
    this._isInvalidTimeFormat = null;
  }

  update(options = {}) {
    const tempOptions = this._getConfig({ ...this._options, ...options });
    this.dispose();
    this._options = tempOptions;

    this._init();
  }

  // Private

  _init() {
    this._addDatepicker();
    this._addTimePicker();
    this._appendToggleButton();
    this._listenToToggleClick();
    this._listenToUserInput();
    this._disableInput();
    this._setInitialDefaultInput();
    this._applyFormatPlaceholder();

    if (this._options.disablePast) {
      this._handleTimepickerDisablePast();
    }
    if (this._options.disableFuture) {
      this._handleTimepickerDisableFuture();
    }
  }

  _removeDatepicker() {
    const datepicker = this._element.querySelector(SELECTOR_DATEPICKER);
    if (datepicker) {
      datepicker.remove();
    }
  }

  _addDatepicker() {
    const DATEPICKER_WRAPPER = element("div");
    DATEPICKER_WRAPPER.id = this._element.id
      ? `datepicker-${this._element.id}`
      : getUID("datepicker-");

    const DATEPICKER_INPUT = '<input type="text">';
    DATEPICKER_WRAPPER.innerHTML = DATEPICKER_INPUT;

    DATEPICKER_WRAPPER.setAttribute(ATTR_DATEPICKER, "");
    this._element.appendChild(DATEPICKER_WRAPPER);
    Manipulator.addClass(DATEPICKER_WRAPPER, "hidden");

    let datepickerOptions = {
      ...this._options.datepicker,
      ...{
        container: this._options.container,
        disablePast: this._options.disablePast,
        disableFuture: this._options.disableFuture,
      },
    };

    if (this._options.inline || this._options.datepicker.inline) {
      datepickerOptions = { ...datepickerOptions, inline: true };
    }
    this._datepicker = new Datepicker(DATEPICKER_WRAPPER, datepickerOptions, {
      ...this._classes.datepicker,
    });
    this._datepicker._input.value = this._dateValue;
  }

  _removeTimePicker() {
    const timepicker = this._element.querySelector(SELECTOR_TIMEPICKER);
    if (timepicker) {
      timepicker.remove();
      this._scrollBar.reset();
    }
  }

  _addTimePicker() {
    const TIMEPICKER_WRAPPER = element("div");
    TIMEPICKER_WRAPPER.id = this._element.id
      ? `timepicker-${this._element.id}`
      : getUID("timepicker-");

    const TIMEPICKER_INPUT = '<input type="text">';
    TIMEPICKER_WRAPPER.innerHTML = TIMEPICKER_INPUT;

    TIMEPICKER_WRAPPER.setAttribute(ATTR_TIMEPICKER, "");
    this._element.appendChild(TIMEPICKER_WRAPPER);
    Manipulator.addClass(TIMEPICKER_WRAPPER, "hidden");

    let timepickerOptions = {
      ...this._options.timepicker,
      ...{ container: this._options.container },
    };

    if (this._options.inline || this._options.timepicker.inline) {
      timepickerOptions = { ...timepickerOptions, inline: true };
    }

    this._timepicker = new Timepicker(TIMEPICKER_WRAPPER, timepickerOptions, {
      ...this._classes.timepicker,
    });
    this._timepicker.input.value = this._timeValue;
  }

  _addIconButtons() {
    Manipulator.addClass(BUTTONS_WRAPPER, this._classes.buttonsContainer);

    BUTTONS_WRAPPER.innerHTML = getIconButtonsTemplate(
      this._options.datepickerToggleIconTemplate,
      this._options.timepickerToggleIconTemplate,
      this._classes
    );
    BUTTONS_WRAPPER.removeAttribute(ATTR_BUTTON_TIMEPICKER);

    if (this._options.inline || this._options.datepicker.inline) {
      return;
    }

    this._scrollBar.hide();

    if (this._datepicker._isOpen) {
      const headerDate = SelectorEngine.findOne(
        `[${ATTR_DATEPICKER_HEADER}]`,
        document.body
      );

      headerDate.appendChild(BUTTONS_WRAPPER);
    } else if (this._timepicker._modal && !this._options.timepicker.inline) {
      const header = SelectorEngine.findOne(
        SELECTOR_TIMEPICKER_ELEMENTS,
        document.body
      );
      const headerTime = SelectorEngine.findOne(
        SELECTOR_TIMEPICKER_CLOCK,
        document.body
      );

      BUTTONS_WRAPPER.setAttribute(ATTR_BUTTON_TIMEPICKER, "");

      header.insertBefore(BUTTONS_WRAPPER, headerTime);
    }
  }

  _enableOrDisableToggleButton() {
    if (this._options.disabled) {
      this.toggleButton.disabled = true;
      Manipulator.addClass(this.toggleButton, "pointer-events-none");
    } else {
      this.toggleButton.disabled = false;
      Manipulator.removeClass(this.toggleButton, "pointer-events-none");
    }
  }

  _appendToggleButton() {
    if (!this._options.toggleButton) {
      return;
    }
    this._element.insertAdjacentHTML(
      "beforeend",
      getToggleButtonTemplate(
        this._options.dateTimepickerToggleIconTemplate,
        this._classes
      )
    );

    this._enableOrDisableToggleButton();
  }

  _applyFormatPlaceholder() {
    if (this._options.showFormat) {
      this._input.placeholder = this._format;
    }
  }

  _listenToCancelClick() {
    const DATEPICKER_CANCEL_BTN = SelectorEngine.findOne(
      `[${ATTR_DATEPICKER_CANCEL_BTN_REF}]`,
      document.body
    );

    EventHandler.one(DATEPICKER_CANCEL_BTN, "mousedown", () => {
      this._cancel = true;
      this._scrollBar.reset();
      EventHandler.off(DATEPICKER_CANCEL_BTN, "mousedown");
    });
  }

  _listenToToggleClick() {
    EventHandler.on(this._element, "click", SELECTOR_DATA_TOGGLE, (event) => {
      event.preventDefault();
      this._openDatePicker();
    });
  }

  _listenToUserInput() {
    EventHandler.on(this._input, "input", (event) => {
      this._handleInput(event.target.value);
    });
  }

  _disableInput() {
    if (this._options.disabled) {
      this._input.disabled = "true";
    }
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    config = {
      ...Default,
      ...dataAttributes,
      ...config,
    };

    typeCheckConfig(NAME, config, DefaultType);
    return config;
  }

  _getClasses(classes) {
    const dataAttributes = Manipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  _handleInput(input) {
    const dateTimeSplited = input.split(", ");
    const dateDelimeters = getDelimeters(this._format);

    const inputFirstValue = dateTimeSplited[0];
    const inputSecondValue = dateTimeSplited[1] || "";

    const date = parseDate(
      inputFirstValue,
      this._format,
      dateDelimeters,
      this._datepicker._options
    );

    if (dateTimeSplited.length === 2) {
      const isInputValid = isValidDate(date) && isValidTime(inputSecondValue);

      if (isInputValid) {
        this._dateValue = inputFirstValue;
        this._timeValue = inputSecondValue;
        this._datepicker._input.value = this._dateValue;
        this._datepicker._activeDate = this._dateValue;
        this._datepicker._selectedYear = getYear(date);
        this._datepicker._selectedMonth = getMonth(date);
        this._datepicker._headerDate = date;
        this._timepicker.input.value = this._timeValue;
        this._timepicker._isInvalidTimeFormat = false;
      } else {
        this._datepicker._activeDate = new Date();
        this._datepicker._selectedDate = null;
        this._datepicker._selectedMonth = null;
        this._datepicker._selectedYear = null;
        this._datepicker._headerDate = null;
        this._datepicker._headerMonth = null;
        this._datepicker._headerYear = null;
        this._timepicker._isInvalidTimeFormat = true;
      }
    }
  }

  _openDatePicker() {
    const openEvent = EventHandler.trigger(this._element, EVENT_OPEN);

    if (openEvent.defaultPrevented) {
      return;
    }

    this._datepicker.open();

    if (!this._options.inline) {
      this._scrollBar.hide();
    }

    if (this._options.inline || this._options.datepicker.inline) {
      this._openDropdownDate();
    }
    this._addIconButtons();

    this._listenToCancelClick();

    if (this._options.inline && this._datepicker._isOpen) {
      Manipulator.addClass(this.toggleButton, "pointer-events-none");
    }

    EventHandler.one(this._datepicker._element, EVENT_CLOSE_DATEPICKER, () => {
      this._dateValue = this._datepicker._input.value;

      this._updateInputValue();

      if (this._cancel) {
        this._cancel = false;
        return;
      }

      let openingTimepicker = false;

      EventHandler.on(this._datepicker.container, "click", (e) => {
        if (
          (!this._datepicker._selectedDate &&
            e.target.hasAttribute(ATTR_DATEPICKER_OK_BTN_REF)) ||
          openingTimepicker
        ) {
          return;
        }
        this._openTimePicker();
        openingTimepicker = true;

        setTimeout(() => {
          openingTimepicker = false;
        }, 500);
      });
      setTimeout(() => {
        const timepicker = SelectorEngine.findOne(
          `[${ATTR_TIMEPICKER_WRAPPER}]`,
          document.body
        );
        if (!timepicker) {
          this._scrollBar.reset();
        }
      }, 10);
      if (this._options.inline) {
        Manipulator.removeClass(this.toggleButton, "pointer-events-none");
      }
    });

    const CLOCK_BTN = SelectorEngine.findOne(
      SELECTOR_TIMEPICKER_TOGGLE,
      document.body
    );

    EventHandler.on(CLOCK_BTN, "click", () => {
      this._datepicker.close();
      this._scrollBar.hide();
      EventHandler.trigger(this._datepicker._element, EVENT_CLOSE_DATEPICKER);
    });
  }

  _handleTimepickerDisablePast() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    EventHandler.on(
      this._datepicker._element,
      "dateChange.te.datepicker",
      () => {
        if (
          this._datepicker._selectedDate.getTime() === currentDate.getTime()
        ) {
          this._timepicker.update({ disablePast: true });
        } else {
          this._timepicker.update({ disablePast: false });
        }
      }
    );
  }

  _handleTimepickerDisableFuture() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    EventHandler.on(
      this._datepicker._element,
      "dateChange.te.datepicker",
      () => {
        if (
          this._datepicker._selectedDate.getTime() === currentDate.getTime()
        ) {
          this._timepicker.update({ disableFuture: true });
        } else {
          this._timepicker.update({ disableFuture: false });
        }
      }
    );
  }

  _handleEscapeKey() {
    EventHandler.one(document.body, "keyup", () => {
      setTimeout(() => {
        const timepicker = SelectorEngine.findOne(
          `[${ATTR_TIMEPICKER_WRAPPER}]`,
          document.body
        );
        if (!timepicker) {
          this._scrollBar.reset();
        }
      }, 250);
    });
  }

  _handleCancelButton() {
    const CANCEL_BTN = SelectorEngine.findOne(
      `[${ATTR_TIMEPICKER_CANCEL_BTN}]`,
      document.body
    );
    EventHandler.one(CANCEL_BTN, "mousedown", () => {
      this._scrollBar.reset();
    });
  }

  _openDropdownDate() {
    const datePopper = this._datepicker._popper;
    datePopper.state.elements.reference = this._input;
    this._scrollBar.reset();
  }

  _openTimePicker() {
    EventHandler.trigger(this._timepicker.elementToggle, "click");
    setTimeout(() => {
      this._addIconButtons();

      if (this._options.inline || this._options.timepicker.inline) {
        this._openDropdownTime();
      }
      if (this._timepicker._modal) {
        const CANCEL_BTN = SelectorEngine.findOne(
          `[${ATTR_TIMEPICKER_CANCEL_BTN}]`,
          document.body
        );
        this._handleEscapeKey();
        this._handleCancelButton();
        EventHandler.on(this._timepicker._modal, "click", (e) => {
          if (
            e.target.hasAttribute(ATTR_TIMEPICKER_WRAPPER) ||
            e.target.hasAttribute(ATTR_TIMEPICKER_SUBMIT)
          ) {
            setTimeout(() => {
              this._scrollBar.reset();
            }, 200);
          }
          if (e.target.hasAttribute(ATTR_TIMEPICKER_CLEAR)) {
            EventHandler.trigger(
              this._timepicker._element,
              EVENT_INPUT_TIMEPICKER
            );
          }
          if (e.target.hasAttribute(ATTR_DATEPICKER_TOGGLE_BTN)) {
            EventHandler.trigger(CANCEL_BTN, "click");
            setTimeout(() => {
              this._openDatePicker();
              this._scrollBar.hide();
            }, 200);
          }
        });
      }
    });

    EventHandler.one(this._timepicker._element, EVENT_INPUT_TIMEPICKER, () => {
      this._timeValue = this._timepicker.input.value;
      this._updateInputValue();
      EventHandler.trigger(this._element, EVENT_CLOSE);
    });
  }

  _openDropdownTime() {
    const timePopper = this._timepicker._popper;
    timePopper.state.elements.reference = this._input;
    timePopper.update();
    this._scrollBar.reset();
  }

  _setInitialDefaultInput() {
    const shouldUpdate = this._options.defaultDate || this._options.defaultTime;

    if (shouldUpdate) {
      this._updateInputValue();
    }
  }

  _updateInputValue() {
    const isDateTimeFilled = this._timeValue && this._dateValue;

    if (isDateTimeFilled) {
      this._input.value = `${this._dateValue}, ${this._timeValue}`;

      const changeEvent = EventHandler.trigger(
        this._element,
        EVENT_DATETIME_CHANGE,
        { value: this._input.value }
      );

      if (changeEvent.defaultPrevented) {
        return;
      }
    }

    EventHandler.trigger(this._input, "focus");
    this.notch && this.notch.removeAttribute("data-te-input-focused");
  }

  // static

  static jQueryInterface(config, options) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;

      if (!data && /dispose/.test(config)) {
        return;
      }

      if (!data) {
        data = new Datetimepicker(this, _config);
      }

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](options);
      }
    });
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }
}

export default Datetimepicker;
