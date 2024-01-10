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

import { createPopper } from "@popperjs/core";
import Data from "../../dom/data";
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import ScrollBarHelper from "../../util/scrollbar";
import { typeCheckConfig, getUID, isRTL } from "../../util/index";
import FocusTrap from "../../util/focusTrap";
import {
  getDate,
  getDayNumber,
  getMonth,
  getYear,
  getDaysInMonth,
  addYears,
  addMonths,
  addDays,
  createDate,
  convertStringToDate,
  isSameDate,
  areDatesInSameView,
  isDateDisabled,
  isMonthDisabled,
  isYearDisabled,
  isNextDateDisabled,
  isPreviousDateDisabled,
  getYearsOffset,
  isValidDate,
} from "./date-utils";
import {
  getBackdropTemplate,
  getDatepickerTemplate,
  createDayViewTemplate,
  createMonthViewTemplate,
  createYearViewTemplate,
  getToggleButtonTemplate,
  createViewChangeButtonIcon,
} from "./templates";
import {
  ENTER,
  SPACE,
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  DOWN_ARROW,
  UP_ARROW,
  HOME,
  END,
  PAGE_UP,
  PAGE_DOWN,
} from "../../util/keycodes";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const YEARS_IN_VIEW = 24;
const YEARS_IN_ROW = 4;
const MONTHS_IN_ROW = 4;

const NAME = "datepicker";
const DATA_KEY = "te.datepicker";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";

const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_OPEN = `open${EVENT_KEY}`;
const EVENT_DATE_CHANGE = `dateChange${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const MODAL_CONTAINER_NAME = "data-te-datepicker-modal-container-ref";
const DROPDOWN_CONTAINER_NAME = "data-te-datepicker-dropdown-container-ref";

const DATEPICKER_TOGGLE_SELECTOR = "[data-te-datepicker-toggle-ref]";
const MODAL_CONTAINER_SELECTOR = `[${MODAL_CONTAINER_NAME}]`;
const DROPDOWN_CONTAINER_SELECTOR = `[${DROPDOWN_CONTAINER_NAME}]`;
const VIEW_CHANGE_BUTTON_SELECTOR =
  "[data-te-datepicker-view-change-button-ref]";
const PREVIOUS_BUTTON_SELECTOR = "[data-te-datepicker-previous-button-ref]";
const NEXT_BUTTON_SELECTOR = "[data-te-datepicker-next-button-ref]";
const OK_BUTTON_SELECTOR = "[data-te-datepicker-ok-button-ref]";
const CANCEL_BUTTON_SELECTOR = "[data-te-datepicker-cancel-button-ref]";
const CLEAR_BUTTON_SELECTOR = "[data-te-datepicker-clear-button-ref]";
const VIEW_SELECTOR = "[data-te-datepicker-view-ref]";
const TOGGLE_BUTTON_SELECTOR = "[data-te-datepicker-toggle-button-ref]";
const DATE_TEXT_SELECTOR = "[data-te-datepicker-date-text-ref]";
const BACKDROP_SELECTOR = "[data-te-dropdown-backdrop-ref]";

const FADE_IN_CLASSES =
  "animate-[fade-in_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const FADE_OUT_CLASSES =
  "animate-[fade-out_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const FADE_IN_SHORT_CLASSES =
  "animate-[fade-in_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";
const FADE_OUT_SHORT_CLASSES =
  "animate-[fade-out_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none";

// templates classes
const MODAL_CONTAINER_CLASSES =
  "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[328px] h-[512px] bg-white rounded-[0.6rem] shadow-lg z-[1066] xs:max-md:landscape:w-[475px] xs:max-md:landscape:h-[360px] xs:max-md:landscape:flex-row dark:bg-zinc-700";
const DATEPICKER_BACKDROP_CLASSES =
  "w-full h-full fixed top-0 right-0 left-0 bottom-0 bg-black/40 z-[1065]";
const DATEPICKER_MAIN_CLASSES = "relative h-full";
const DATEPICKER_HEADER_CLASSES =
  "xs:max-md:landscape:h-full h-[120px] px-6 bg-primary flex flex-col rounded-t-lg dark:bg-zinc-800";
const DATEPICKER_TITLE_CLASSES = "h-8 flex flex-col justify-end";
const DATEPICKER_TITLE_TEXT_CLASSES =
  "text-[10px] font-normal uppercase tracking-[1.7px] text-white";
const DATEPICKER_DATE_CLASSES =
  "xs:max-md:landscape:mt-24 h-[72px] flex flex-col justify-end";
const DATEPICKER_DATE_TEXT_CLASSES = "text-[34px] font-normal text-white";
const DATEPICKER_VIEW_CLASSES = "outline-none px-3";
const DATEPICKER_DATE_CONTROLS_CLASSES =
  "px-3 pt-2.5 pb-0 flex justify-between text-black/[64]";
const DATEPICKER_VIEW_CHANGE_BUTTON_CLASSES = `flex items-center outline-none p-2.5 text-neutral-500 font-medium text-[0.9rem] rounded-xl shadow-none bg-transparent m-0 border-none hover:bg-neutral-200 focus:bg-neutral-200  dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10`;
const DATEPICKER_ARROW_CONTROLS_CLASSES = "mt-2.5";
const DATEPICKER_PREVIOUS_BUTTON_CLASSES =
  "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent mr-6 hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:mx-auto";
const DATEPICKER_NEXT_BUTTON_CLASSES =
  "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:rotate-180 [&>svg]:mx-auto";
const DATEPICKER_FOOTER_CLASSES =
  "h-14 flex absolute w-full bottom-0 justify-end items-center px-3";
const DATEPICKER_FOOTER_BTN_CLASSES =
  "outline-none bg-white text-primary border-none cursor-pointer py-0 px-2.5 uppercase text-[0.8rem] leading-10 font-medium h-10 tracking-[.1rem] rounded-[10px] mb-2.5 hover:bg-neutral-200 focus:bg-neutral-200 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10";
const DATEPICKER_CLEAR_BTN_CLASSES = "mr-auto";
const DATEPICKER_DAY_HEADING_CLASSES =
  "w-10 h-10 text-center text-[12px] font-normal dark:text-white";
const DATEPICKER_CELL_CLASSES =
  "text-center data-[te-datepicker-cell-disabled]:text-neutral-300 data-[te-datepicker-cell-disabled]:cursor-default data-[te-datepicker-cell-disabled]:pointer-events-none data-[te-datepicker-cell-disabled]:hover:cursor-default hover:cursor-pointer group";
const DATEPICKER_CELL_SMALL_CLASSES =
  "w-10 h-10 xs:max-md:landscape:w-8 xs:max-md:landscape:h-8";
const DATEPICKER_CELL_LARGE_CLASSES = "w-[76px] h-[42px]";
const DATEPICKER_CELL_CONTENT_CLASSES =
  "mx-auto group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-neutral-300 group-[[data-te-datepicker-cell-selected]]:bg-primary group-[[data-te-datepicker-cell-selected]]:text-white group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-neutral-100 group-[[data-te-datepicker-cell-focused]]:data-[te-datepicker-cell-selected]:bg-primary group-[[data-te-datepicker-cell-current]]:border-solid group-[[data-te-datepicker-cell-current]]:border-black group-[[data-te-datepicker-cell-current]]:border dark:group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-white/10 dark:group-[[data-te-datepicker-cell-current]]:border-white dark:text-white dark:group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-white/10 dark:group-[[data-te-datepicker-cell-disabled]]:text-neutral-500";
const DATEPICKER_CELL_CONTENT_SMALL_CLASSES =
  "w-9 h-9 leading-9 rounded-[50%] text-[13px]";
const DATEPICKER_CELL_CONTENT_LARGE_CLASSES =
  "w-[72px] h-10 leading-10 py-[1px] px-0.5 rounded-[999px]";
const DATEPICKER_TABLE_CLASSES = "mx-auto w-[304px]";
const DATEPICKER_TOGGLE_BUTTON_CLASSES =
  "flex items-center justify-content-center [&>svg]:w-5 [&>svg]:h-5 absolute outline-none border-none bg-transparent right-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-primary focus:text-primary dark:hover:text-primary-400 dark:focus:text-primary-400 dark:text-neutral-200";
const DATEPICKER_VIEW_CHANGE_ICON_CLASSES =
  "inline-block pointer-events-none ml-[3px] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-neutral-500 dark:[&>svg]:fill-white";
const DATEPICKER_DROPDOWN_CONTAINER_CLASSES =
  "w-[328px] h-[380px] bg-white rounded-lg shadow-[0px_2px_15px_-3px_rgba(0,0,0,.07),_0px_10px_20px_-2px_rgba(0,0,0,.04)] z-[1066] dark:bg-zinc-700";

const Default = {
  title: "Select date",
  container: "body",
  disablePast: false,
  disableFuture: false,
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
  changeMonthIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
  `,
  nextMultiYearLabel: "Next 24 years",
  prevMultiYearLabel: "Previous 24 years",
  switchToMultiYearViewLabel: "Choose year and month",
  switchToMonthViewLabel: "Choose date",
  switchToDayViewLabel: "Choose date",

  startDate: null,
  startDay: 0,
  format: "dd/mm/yyyy",
  view: "days",
  viewChangeIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
  `,

  min: null,
  max: null,
  filter: null,

  inline: false,
  toggleButton: true,
  disableToggleButton: false,
  disableInput: false,
  animations: true,
  confirmDateOnSelect: false,
  removeOkBtn: false,
  removeCancelBtn: false,
  removeClearBtn: false,
};

const DefaultType = {
  title: "string",
  container: "string",
  disablePast: "boolean",
  disableFuture: "boolean",
  monthsFull: "array",
  monthsShort: "array",
  weekdaysFull: "array",
  weekdaysShort: "array",
  weekdaysNarrow: "array",

  okBtnText: "string",
  clearBtnText: "string",
  cancelBtnText: "string",
  okBtnLabel: "string",
  clearBtnLabel: "string",
  cancelBtnLabel: "string",
  nextMonthLabel: "string",
  prevMonthLabel: "string",
  nextYearLabel: "string",
  prevYearLabel: "string",
  nextMultiYearLabel: "string",
  prevMultiYearLabel: "string",
  changeMonthIconTemplate: "string",
  switchToMultiYearViewLabel: "string",
  switchToMonthViewLabel: "string",
  switchToDayViewLabel: "string",

  startDate: "(null|string|date)",
  startDay: "number",
  format: "string",
  view: "string",
  viewChangeIconTemplate: "string",

  min: "(null|string|date)",
  max: "(null|string|date)",
  filter: "(null|function)",

  inline: "boolean",
  toggleButton: "boolean",
  disableToggleButton: "boolean",
  disableInput: "boolean",
  animations: "boolean",
  confirmDateOnSelect: "boolean",
  removeOkBtn: "boolean",
  removeCancelBtn: "boolean",
  removeClearBtn: "boolean",
};

const DefaultClasses = {
  fadeIn: FADE_IN_CLASSES,
  fadeOut: FADE_OUT_CLASSES,
  fadeInShort: FADE_IN_SHORT_CLASSES,
  fadeOutShort: FADE_OUT_SHORT_CLASSES,
  modalContainer: MODAL_CONTAINER_CLASSES,
  datepickerBackdrop: DATEPICKER_BACKDROP_CLASSES,
  datepickerMain: DATEPICKER_MAIN_CLASSES,
  datepickerHeader: DATEPICKER_HEADER_CLASSES,
  datepickerTitle: DATEPICKER_TITLE_CLASSES,
  datepickerTitleText: DATEPICKER_TITLE_TEXT_CLASSES,
  datepickerDate: DATEPICKER_DATE_CLASSES,
  datepickerDateText: DATEPICKER_DATE_TEXT_CLASSES,
  datepickerView: DATEPICKER_VIEW_CLASSES,
  datepickerDateControls: DATEPICKER_DATE_CONTROLS_CLASSES,
  datepickerViewChangeButton: DATEPICKER_VIEW_CHANGE_BUTTON_CLASSES,
  datepickerViewChangeIcon: DATEPICKER_VIEW_CHANGE_ICON_CLASSES,
  datepickerArrowControls: DATEPICKER_ARROW_CONTROLS_CLASSES,
  datepickerPreviousButton: DATEPICKER_PREVIOUS_BUTTON_CLASSES,
  datepickerNextButton: DATEPICKER_NEXT_BUTTON_CLASSES,
  datepickerFooter: DATEPICKER_FOOTER_CLASSES,
  datepickerFooterBtn: DATEPICKER_FOOTER_BTN_CLASSES,
  datepickerClearBtn: DATEPICKER_CLEAR_BTN_CLASSES,
  datepickerDayHeading: DATEPICKER_DAY_HEADING_CLASSES,
  datepickerCell: DATEPICKER_CELL_CLASSES,
  datepickerCellSmall: DATEPICKER_CELL_SMALL_CLASSES,
  datepickerCellLarge: DATEPICKER_CELL_LARGE_CLASSES,
  datepickerCellContent: DATEPICKER_CELL_CONTENT_CLASSES,
  datepickerCellContentSmall: DATEPICKER_CELL_CONTENT_SMALL_CLASSES,
  datepickerCellContentLarge: DATEPICKER_CELL_CONTENT_LARGE_CLASSES,
  datepickerTable: DATEPICKER_TABLE_CLASSES,
  datepickerToggleButton: DATEPICKER_TOGGLE_BUTTON_CLASSES,
  datepickerDropdownContainer: DATEPICKER_DROPDOWN_CONTAINER_CLASSES,
};

const DefaultClassesType = {
  fadeIn: "string",
  fadeOut: "string",
  fadeInShort: "string",
  fadeOutShort: "string",
  modalContainer: "string",
  datepickerBackdrop: "string",
  datepickerMain: "string",
  datepickerHeader: "string",
  datepickerTitle: "string",
  datepickerTitleText: "string",
  datepickerDate: "string",
  datepickerDateText: "string",
  datepickerView: "string",
  datepickerDateControls: "string",
  datepickerViewChangeButton: "string",
  datepickerArrowControls: "string",
  datepickerPreviousButton: "string",
  datepickerNextButton: "string",
  datepickerFooter: "string",
  datepickerFooterBtn: "string",
  datepickerClearBtn: "string",
  datepickerDayHeading: "string",
  datepickerCell: "string",
  datepickerCellSmall: "string",
  datepickerCellLarge: "string",
  datepickerCellContent: "string",
  datepickerCellContentSmall: "string",
  datepickerCellContentLarge: "string",
  datepickerTable: "string",
  datepickerToggleButton: "string",
  datepickerDropdownContainer: "string",
};

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Datepicker {
  constructor(element, options, classes) {
    this._element = element;
    this._input = SelectorEngine.findOne("input", this._element);
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);
    this._activeDate = new Date();
    this._selectedDate = null;
    this._selectedYear = null;
    this._selectedMonth = null;
    this._headerDate = null;
    this._headerYear = null;
    this._headerMonth = null;
    this._view = this._options.view;
    this._popper = null;
    this._focusTrap = null;
    this._isOpen = false;
    this._toggleButtonId = getUID("datepicker-toggle-");
    this._animations =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      this._options.animations;

    this._scrollBar = new ScrollBarHelper();

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._init();

    if (this.toggleButton && this._options.disableToggle) {
      this.toggleButton.disabled = "true";
    }

    if (this._options.disableInput) {
      this._input.disabled = "true";
    }
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get container() {
    return (
      SelectorEngine.findOne(
        `[${MODAL_CONTAINER_NAME}='${this._toggleButtonId}']`
      ) ||
      SelectorEngine.findOne(
        `[${DROPDOWN_CONTAINER_NAME}='${this._toggleButtonId}']`
      )
    );
  }

  get options() {
    return this._options;
  }

  get activeCell() {
    let activeCell;

    if (this._view === "days") {
      activeCell = this._getActiveDayCell();
    }

    if (this._view === "months") {
      activeCell = this._getActiveMonthCell();
    }

    if (this._view === "years") {
      activeCell = this._getActiveYearCell();
    }

    return activeCell;
  }

  get activeDay() {
    return getDate(this._activeDate);
  }

  get activeMonth() {
    return getMonth(this._activeDate);
  }

  get activeYear() {
    return getYear(this._activeDate);
  }

  get firstYearInView() {
    return this.activeYear - getYearsOffset(this._activeDate, YEARS_IN_VIEW);
  }

  get lastYearInView() {
    return this.firstYearInView + YEARS_IN_VIEW - 1;
  }

  get viewChangeButton() {
    return SelectorEngine.findOne(VIEW_CHANGE_BUTTON_SELECTOR, this.container);
  }

  get previousButton() {
    return SelectorEngine.findOne(PREVIOUS_BUTTON_SELECTOR, this.container);
  }

  get nextButton() {
    return SelectorEngine.findOne(NEXT_BUTTON_SELECTOR, this.container);
  }

  get okButton() {
    return SelectorEngine.findOne(OK_BUTTON_SELECTOR, this.container);
  }

  get cancelButton() {
    return SelectorEngine.findOne(CANCEL_BUTTON_SELECTOR, this.container);
  }

  get clearButton() {
    return SelectorEngine.findOne(CLEAR_BUTTON_SELECTOR, this.container);
  }

  get datesContainer() {
    return SelectorEngine.findOne(VIEW_SELECTOR, this.container);
  }

  get toggleButton() {
    return SelectorEngine.findOne(TOGGLE_BUTTON_SELECTOR, this._element);
  }

  update(options = {}) {
    this._options = this._getConfig({ ...this._options, ...options });
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    config = {
      ...Default,
      ...dataAttributes,
      ...config,
    };

    typeCheckConfig(NAME, config, DefaultType);

    if (config.max && typeof config.max === "string") {
      config.max = new Date(config.max);
    }

    if (config.min && typeof config.min === "string") {
      config.min = new Date(config.min);
    }

    if (config.startDay && config.startDay !== 0) {
      const sortedWeekdaysNarrow = this._getNewDaysOrderArray(config);
      config.weekdaysNarrow = sortedWeekdaysNarrow;
    }

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

  _getContainer() {
    return SelectorEngine.findOne(this._options.container);
  }

  _getNewDaysOrderArray(config) {
    const index = config.startDay;

    const weekdaysNarrow = config.weekdaysNarrow;
    const sortedWeekdays = weekdaysNarrow
      .slice(index)
      .concat(weekdaysNarrow.slice(0, index));

    return sortedWeekdays;
  }

  _init() {
    if (!this.toggleButton && this._options.toggleButton) {
      this._appendToggleButton();
      if (this._input.readOnly || this._input.disabled) {
        this.toggleButton.style.pointerEvents = "none";
      }
    }

    this._listenToUserInput();
    this._listenToToggleClick();
    this._listenToToggleKeydown();
  }

  _appendToggleButton() {
    const toggleButton = getToggleButtonTemplate(
      this._toggleButtonId,
      this._classes.datepickerToggleButton
    );
    this._element.insertAdjacentHTML("beforeend", toggleButton);
  }

  open() {
    if (this._input.readOnly || this._input.disabled) {
      return;
    }
    const openEvent = EventHandler.trigger(this._element, EVENT_OPEN);

    if (this._isOpen || openEvent.defaultPrevented) {
      return;
    }

    this._setInitialDate();

    const backdrop = getBackdropTemplate(this._classes.datepickerBackdrop);
    const template = getDatepickerTemplate(
      this._activeDate,
      this._selectedDate,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      MONTHS_IN_ROW,
      YEARS_IN_VIEW,
      YEARS_IN_ROW,
      this._toggleButtonId,
      this._classes
    );

    if (this._options.inline) {
      this._openDropdown(template);
    } else {
      this._openModal(backdrop, template);
      this._scrollBar.hide();
    }

    if (this._animations) {
      Manipulator.addClass(this.container, this._classes.fadeIn);
      Manipulator.addClass(backdrop, this._classes.fadeInShort);
    }

    this._setFocusTrap(this.container);

    this._listenToDateSelection();
    this._addControlsListeners();
    this._updateControlsDisabledState();
    this._listenToEscapeClick();
    this._listenToKeyboardNavigation();
    this._listenToDatesContainerFocus();
    this._listenToDatesContainerBlur();

    // We need to wait for popper initialization to avoid bug with
    // focusing dates container, otherwise dates container will be
    // focused before popper position update which can change the
    // scroll position on the page
    this._asyncFocusDatesContainer();
    this._updateViewControlsAndAttributes(this._view);
    this._isOpen = true;

    // Wait for the component to open to prevent immediate calling of the
    // close method upon detecting a click on toggle element (input/button)
    setTimeout(() => {
      this._listenToOutsideClick();
    }, 0);
  }

  _openDropdown(template) {
    this._popper = createPopper(this._input, template, {
      placement: "bottom-start",
    });
    const container = this._getContainer();
    container.appendChild(template);
  }

  _openModal(backdrop, template) {
    const container = this._getContainer();
    container.appendChild(backdrop);
    container.appendChild(template);
  }

  _setFocusTrap(element) {
    this._focusTrap = new FocusTrap(element, {
      event: "keydown",
      condition: (event) => event.key === "Tab",
    });
    this._focusTrap.trap();
  }

  _listenToUserInput() {
    EventHandler.on(this._input, "input", (event) => {
      this._handleUserInput(event.target.value);
    });
  }

  _listenToToggleClick() {
    EventHandler.on(
      this._element,
      EVENT_CLICK_DATA_API,
      DATEPICKER_TOGGLE_SELECTOR,
      (event) => {
        event.preventDefault();
        this.open();
      }
    );
  }

  _listenToToggleKeydown() {
    EventHandler.on(
      this._element,
      "keydown",
      DATEPICKER_TOGGLE_SELECTOR,
      (event) => {
        if (event.keyCode === ENTER && !this._isOpen) {
          this.open();
        }
      }
    );
  }

  _listenToDateSelection() {
    EventHandler.on(this.datesContainer, "click", (e) => {
      this._handleDateSelection(e);
    });
  }

  _handleDateSelection(e) {
    const dataset =
      e.target.nodeName === "DIV"
        ? e.target.parentNode.dataset
        : e.target.dataset;
    const cell = e.target.nodeName === "DIV" ? e.target.parentNode : e.target;

    if (dataset.teDate) {
      this._pickDay(dataset.teDate, cell);
    }

    if (dataset.teMonth && dataset.teYear) {
      const month = parseInt(dataset.teMonth, 10);
      const year = parseInt(dataset.teYear, 10);
      this._pickMonth(month, year);
    }

    if (dataset.teYear && !dataset.teMonth) {
      const year = parseInt(dataset.teYear, 10);
      this._pickYear(year);
    }

    if (!this._options.inline) {
      this._updateHeaderDate(
        this._activeDate,
        this._options.monthsShort,
        this._options.weekdaysShort
      );
    }
  }

  _updateHeaderDate(date, monthNames, dayNames) {
    const headerDateEl = SelectorEngine.findOne(
      DATE_TEXT_SELECTOR,
      this.container
    );
    const month = getMonth(date);
    const day = getDate(date);
    const dayNumber = getDayNumber(date);
    headerDateEl.innerHTML = `${dayNames[dayNumber]}, ${monthNames[month]} ${day}`;
  }

  _addControlsListeners() {
    EventHandler.on(this.nextButton, "click", () => {
      if (this._view === "days") {
        this.nextMonth();
      } else if (this._view === "years") {
        this.nextYears();
      } else {
        this.nextYear();
      }
      this._updateControlsDisabledState();
    });

    EventHandler.on(this.previousButton, "click", () => {
      if (this._view === "days") {
        this.previousMonth();
      } else if (this._view === "years") {
        this.previousYears();
      } else {
        this.previousYear();
      }
      this._updateControlsDisabledState();
    });

    EventHandler.on(this.viewChangeButton, "click", () => {
      if (this._view === "days") {
        this._changeView("years");
      } else if (this._view === "years" || this._view === "months") {
        this._changeView("days");
      }
    });

    if (!this._options.inline) {
      this._listenToFooterButtonsClick();
    }
  }

  _listenToFooterButtonsClick() {
    EventHandler.on(this.okButton, "click", () => this.handleOk());
    EventHandler.on(this.cancelButton, "click", () => this.handleCancel());
    EventHandler.on(this.clearButton, "click", () => this.handleClear());
  }

  _listenToOutsideClick() {
    EventHandler.on(document, EVENT_CLICK_DATA_API, (e) => {
      const isContainer = e.target === this.container;
      const isContainerContent =
        this.container && this.container.contains(e.target);

      if (!isContainer && !isContainerContent) {
        this.close();
      }
    });
  }

  _listenToEscapeClick() {
    EventHandler.on(document, "keydown", (event) => {
      if (event.keyCode === ESCAPE && this._isOpen) {
        this.close();
      }
    });
  }

  _listenToKeyboardNavigation() {
    EventHandler.on(this.datesContainer, "keydown", (event) => {
      this._handleKeydown(event);
    });
  }

  _listenToDatesContainerFocus() {
    EventHandler.on(this.datesContainer, "focus", () => {
      this._focusActiveCell(this.activeCell);
    });
  }

  _listenToDatesContainerBlur() {
    EventHandler.on(this.datesContainer, "blur", () => {
      this._removeCurrentFocusStyles();
    });
  }

  _handleKeydown(event) {
    if (this._view === "days") {
      this._handleDaysViewKeydown(event);
    }

    if (this._view === "months") {
      this._handleMonthsViewKeydown(event);
    }

    if (this._view === "years") {
      this._handleYearsViewKeydown(event);
    }
  }

  _handleDaysViewKeydown(event) {
    const oldActiveDate = this._activeDate;
    const previousActiveCell = this.activeCell;

    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = addDays(this._activeDate, isRTL() ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = addDays(this._activeDate, isRTL() ? -1 : 1);
        break;
      case UP_ARROW:
        this._activeDate = addDays(this._activeDate, -7);
        break;
      case DOWN_ARROW:
        this._activeDate = addDays(this._activeDate, 7);
        break;
      case HOME:
        this._activeDate = addDays(
          this._activeDate,
          1 - getDate(this._activeDate)
        );
        break;
      case END:
        this._activeDate = addDays(
          this._activeDate,
          getDaysInMonth(this._activeDate) - getDate(this._activeDate)
        );
        break;
      case PAGE_UP:
        this._activeDate = addMonths(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this._activeDate = addMonths(this._activeDate, 1);
        break;
      case ENTER:
      case SPACE:
        this._selectDate(this._activeDate);
        this._handleDateSelection(event);
        event.preventDefault();
        return;
      default:
        return;
    }

    if (
      !areDatesInSameView(
        oldActiveDate,
        this._activeDate,
        this._view,
        YEARS_IN_VIEW,
        this._options.min,
        this._options.max
      )
    ) {
      this._changeView("days");
    }

    this._removeHighlightFromCell(previousActiveCell);
    this._focusActiveCell(this.activeCell);
    event.preventDefault();
  }

  _asyncFocusDatesContainer() {
    setTimeout(() => {
      this.datesContainer.focus();
    }, 0);
  }

  _focusActiveCell(cell) {
    if (cell) {
      cell.setAttribute("data-te-datepicker-cell-focused", "");
    }
  }

  _removeHighlightFromCell(cell) {
    if (cell) {
      cell.removeAttribute("data-te-datepicker-cell-focused");
    }
  }

  _getActiveDayCell() {
    const cells = SelectorEngine.find("td", this.datesContainer);

    const activeCell = Array.from(cells).find((cell) => {
      const cellDate = convertStringToDate(cell.dataset.teDate);
      return isSameDate(cellDate, this._activeDate);
    });

    return activeCell;
  }

  _handleMonthsViewKeydown(event) {
    const oldActiveDate = this._activeDate;
    const previousActiveCell = this.activeCell;

    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = addMonths(this._activeDate, isRTL() ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = addMonths(this._activeDate, isRTL() ? -1 : 1);
        break;
      case UP_ARROW:
        this._activeDate = addMonths(this._activeDate, -4);
        break;
      case DOWN_ARROW:
        this._activeDate = addMonths(this._activeDate, 4);
        break;
      case HOME:
        this._activeDate = addMonths(this._activeDate, -this.activeMonth);
        break;
      case END:
        this._activeDate = addMonths(this._activeDate, 11 - this.activeMonth);
        break;
      case PAGE_UP:
        this._activeDate = addYears(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this._activeDate = addYears(this._activeDate, 1);
        break;
      case ENTER:
      case SPACE:
        this._selectMonth(this.activeMonth);
        return;
      default:
        return;
    }

    if (
      !areDatesInSameView(
        oldActiveDate,
        this._activeDate,
        this._view,
        YEARS_IN_VIEW,
        this._options.min,
        this._options.max
      )
    ) {
      this._changeView("months");
    }

    this._removeHighlightFromCell(previousActiveCell);
    this._focusActiveCell(this.activeCell);
    event.preventDefault();
  }

  _getActiveMonthCell() {
    const cells = SelectorEngine.find("td", this.datesContainer);

    const activeCell = Array.from(cells).find((cell) => {
      const cellYear = parseInt(cell.dataset.teYear, 10);
      const cellMonth = parseInt(cell.dataset.teMonth, 10);
      return cellYear === this.activeYear && cellMonth === this.activeMonth;
    });

    return activeCell;
  }

  _handleYearsViewKeydown(event) {
    const oldActiveDate = this._activeDate;
    const previousActiveCell = this.activeCell;
    const yearsPerRow = 4;
    const yearsPerPage = 24;

    switch (event.keyCode) {
      case LEFT_ARROW:
        this._activeDate = addYears(this._activeDate, isRTL() ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this._activeDate = addYears(this._activeDate, isRTL() ? -1 : 1);
        break;
      case UP_ARROW:
        this._activeDate = addYears(this._activeDate, -yearsPerRow);
        break;
      case DOWN_ARROW:
        this._activeDate = addYears(this._activeDate, yearsPerRow);
        break;
      case HOME:
        this._activeDate = addYears(
          this._activeDate,
          -getYearsOffset(this._activeDate, yearsPerPage)
        );
        break;
      case END:
        this._activeDate = addYears(
          this._activeDate,
          yearsPerPage - getYearsOffset(this._activeDate, yearsPerPage) - 1
        );
        break;
      case PAGE_UP:
        this._activeDate = addYears(this._activeDate, -yearsPerPage);
        break;
      case PAGE_DOWN:
        this._activeDate = addYears(this._activeDate, yearsPerPage);
        break;
      case ENTER:
      case SPACE:
        this._selectYear(this.activeYear);
        return;
      default:
        return;
    }

    if (
      !areDatesInSameView(
        oldActiveDate,
        this._activeDate,
        this._view,
        YEARS_IN_VIEW,
        this._options.min,
        this._options.max
      )
    ) {
      this._changeView("years");
    }

    this._removeHighlightFromCell(previousActiveCell);
    this._focusActiveCell(this.activeCell);
    event.preventDefault();
  }

  _getActiveYearCell() {
    const cells = SelectorEngine.find("td", this.datesContainer);

    const activeCell = Array.from(cells).find((cell) => {
      const cellYear = parseInt(cell.dataset.teYear, 10);
      return cellYear === this.activeYear;
    });

    return activeCell;
  }

  _setInitialDate() {
    if (this._input.value) {
      this._handleUserInput(this._input.value);
    } else if (this._options.startDate) {
      this._activeDate = new Date(this._options.startDate);
    } else {
      this._activeDate = new Date();
    }
  }

  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

    if (!this._isOpen || closeEvent.defaultPrevented) {
      return;
    }

    this._removeDatepickerListeners();

    if (this._animations) {
      Manipulator.addClass(this.container, this._classes.fadeOut);
    }

    if (this._options.inline) {
      this._closeDropdown();
    } else {
      this._closeModal();
    }

    this._isOpen = false;
    this._view = this._options.view;

    if (this.toggleButton) {
      this.toggleButton.focus();
    } else {
      this._input.focus();
    }
  }

  _closeDropdown() {
    const datepicker = SelectorEngine.findOne(DROPDOWN_CONTAINER_SELECTOR);
    const container = this._getContainer();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (datepicker) {
        container.removeChild(datepicker);
      }

      if (this._popper) {
        this._popper.destroy();
      }
    }
    datepicker.addEventListener("animationend", () => {
      if (datepicker) {
        container.removeChild(datepicker);
      }

      if (this._popper) {
        this._popper.destroy();
      }
    });
    this._removeFocusTrap();
  }

  _closeModal() {
    const backdrop = SelectorEngine.findOne(BACKDROP_SELECTOR);
    const datepicker = SelectorEngine.findOne(MODAL_CONTAINER_SELECTOR);

    if (!datepicker || !backdrop) {
      return;
    }

    if (this._animations) {
      Manipulator.addClass(backdrop, this._classes.fadeOutShort);

      backdrop.addEventListener("animationend", () => {
        this._removePicker(backdrop, datepicker);
        this._scrollBar.reset();
      });
    } else {
      this._removePicker(backdrop, datepicker);
      this._scrollBar.reset();
    }
  }

  _removePicker(backdrop, datepicker) {
    const container = this._getContainer();

    container.removeChild(backdrop);
    container.removeChild(datepicker);
  }

  _removeFocusTrap() {
    if (this._focusTrap) {
      this._focusTrap.disable();
      this._focusTrap = null;
    }
  }

  _removeDatepickerListeners() {
    EventHandler.off(this.nextButton, "click");
    EventHandler.off(this.previousButton, "click");
    EventHandler.off(this.viewChangeButton, "click");
    EventHandler.off(this.okButton, "click");
    EventHandler.off(this.cancelButton, "click");
    EventHandler.off(this.clearButton, "click");

    EventHandler.off(this.datesContainer, "click");
    EventHandler.off(this.datesContainer, "keydown");
    EventHandler.off(this.datesContainer, "focus");
    EventHandler.off(this.datesContainer, "blur");

    EventHandler.off(document, EVENT_CLICK_DATA_API);
  }

  dispose() {
    if (this._isOpen) {
      this.close();
    }

    this._removeInputAndToggleListeners();

    const generatedToggleButton = SelectorEngine.findOne(
      `#${this._toggleButtonId}`
    );

    if (generatedToggleButton) {
      this._element.removeChild(generatedToggleButton);
    }

    Data.removeData(this._element, DATA_KEY);

    this._element = null;
    this._input = null;
    this._options = null;
    this._activeDate = null;
    this._selectedDate = null;
    this._selectedYear = null;
    this._selectedMonth = null;
    this._headerDate = null;
    this._headerYear = null;
    this._headerMonth = null;
    this._view = null;
    this._popper = null;
    this._focusTrap = null;
  }

  _removeInputAndToggleListeners() {
    EventHandler.off(this._input, "input");
    EventHandler.off(
      this._element,
      EVENT_CLICK_DATA_API,
      DATEPICKER_TOGGLE_SELECTOR
    );
    EventHandler.off(this._element, "keydown", DATEPICKER_TOGGLE_SELECTOR);
  }

  handleOk() {
    this._confirmSelection(this._headerDate);
    this.close();
  }

  _selectDate(date, cell = this.activeCell) {
    const { min, max, filter, disablePast, disableFuture } = this._options;

    if (isDateDisabled(date, min, max, filter, disablePast, disableFuture)) {
      return;
    }

    this._removeCurrentSelectionStyles();
    this._removeCurrentFocusStyles();
    this._addSelectedStyles(cell);
    this._selectedDate = date;
    this._selectedYear = getYear(date);
    this._selectedMonth = getMonth(date);
    this._headerDate = date;

    if (this._options.inline || this.options.confirmDateOnSelect) {
      this._confirmSelection(date);
      this.close();
    }
  }

  _selectYear(year, cell = this.activeCell) {
    this._removeCurrentSelectionStyles();
    this._removeCurrentFocusStyles();
    this._addSelectedStyles(cell);
    this._headerYear = year;

    this._asyncChangeView("months");
  }

  _selectMonth(month, cell = this.activeCell) {
    this._removeCurrentSelectionStyles();
    this._removeCurrentFocusStyles();
    this._addSelectedStyles(cell);
    this._headerMonth = month;

    this._asyncChangeView("days");
  }

  _removeSelectedStyles(cell) {
    if (cell) {
      cell.removeAttribute("data-te-datepicker-cell-selected");
    }
  }

  _addSelectedStyles(cell) {
    if (cell) {
      cell.setAttribute("data-te-datepicker-cell-selected", "");
    }
  }

  _confirmSelection(date) {
    if (date) {
      const dateString = this.formatDate(date);
      this._input.value = dateString;
      EventHandler.trigger(this._element, EVENT_DATE_CHANGE, { date });
      EventHandler.trigger(this._input, "input");
    }
  }

  handleCancel() {
    this._selectedDate = null;
    this._selectedYear = null;
    this._selectedMonth = null;
    this.close();
  }

  handleClear() {
    this._selectedDate = null;
    this._selectedMonth = null;
    this._selectedYear = null;
    this._headerDate = null;
    this._headerMonth = null;
    this._headerYear = null;
    this._removeCurrentSelectionStyles();
    this._input.value = "";
    this._setInitialDate();
    this._changeView("days");
    this._updateHeaderDate(
      this._activeDate,
      this._options.monthsShort,
      this._options.weekdaysShort
    );
  }

  _removeCurrentSelectionStyles() {
    const currentSelected = SelectorEngine.findOne(
      "[data-te-datepicker-cell-selected]",
      this.container
    );

    if (currentSelected) {
      currentSelected.removeAttribute("data-te-datepicker-cell-selected");
    }
  }

  _removeCurrentFocusStyles() {
    const currentFocused = SelectorEngine.findOne(
      "[data-te-datepicker-cell-focused]",
      this.container
    );

    if (currentFocused) {
      currentFocused.removeAttribute("data-te-datepicker-cell-focused");
    }
  }

  formatDate(date) {
    const d = getDate(date);
    const dd = this._addLeadingZero(getDate(date));
    const ddd = this._options.weekdaysShort[getDayNumber(date)];
    const dddd = this._options.weekdaysFull[getDayNumber(date)];
    const m = getMonth(date) + 1;
    const mm = this._addLeadingZero(getMonth(date) + 1);
    const mmm = this._options.monthsShort[getMonth(date)];
    const mmmm = this._options.monthsFull[getMonth(date)];
    const yy =
      getYear(date).toString().length === 2
        ? getYear(date)
        : getYear(date).toString().slice(2, 4);
    const yyyy = getYear(date);

    const preformatted = this._options.format.split(
      /(d{1,4}|m{1,4}|y{4}|yy|!.)/g
    );
    let formatted = "";
    preformatted.forEach((datePart) => {
      switch (datePart) {
        case "dddd":
          datePart = datePart.replace(datePart, dddd);
          break;
        case "ddd":
          datePart = datePart.replace(datePart, ddd);
          break;
        case "dd":
          datePart = datePart.replace(datePart, dd);
          break;
        case "d":
          datePart = datePart.replace(datePart, d);
          break;
        case "mmmm":
          datePart = datePart.replace(datePart, mmmm);
          break;
        case "mmm":
          datePart = datePart.replace(datePart, mmm);
          break;
        case "mm":
          datePart = datePart.replace(datePart, mm);
          break;
        case "m":
          datePart = datePart.replace(datePart, m);
          break;
        case "yyyy":
          datePart = datePart.replace(datePart, yyyy);
          break;
        case "yy":
          datePart = datePart.replace(datePart, yy);
          break;
        default:
      }
      formatted += datePart;
    });

    return formatted;
  }

  _addLeadingZero(value) {
    return parseInt(value, 10) < 10 ? `0${value}` : value;
  }

  _pickDay(day, el) {
    const date = convertStringToDate(day);
    const { min, max, filter, disablePast, disableFuture } = this._options;

    if (isDateDisabled(date, min, max, filter, disablePast, disableFuture)) {
      return;
    }

    this._activeDate = date;
    this._selectDate(date, el);
  }

  _pickYear(year) {
    const { min, max, disablePast, disableFuture } = this._options;

    if (isYearDisabled(year, min, max, disablePast, disableFuture)) {
      return;
    }

    const newDate = createDate(year, this.activeMonth, this.activeDay);

    this._activeDate = newDate;
    this._selectedDate = newDate;
    this._selectYear(year);
  }

  _pickMonth(month, year) {
    const { min, max, disablePast, disableFuture } = this._options;

    if (
      isMonthDisabled(month, year, min, max, disablePast, disableFuture) ||
      isYearDisabled(year, min, max, disablePast, disableFuture)
    ) {
      return;
    }

    const newDate = createDate(year, month, this.activeDay);

    this._activeDate = newDate;
    this._selectMonth(month);
  }

  nextMonth() {
    const nextMonth = addMonths(this._activeDate, 1);
    const template = createDayViewTemplate(
      nextMonth,
      this._headerDate,
      this._options,
      this._classes
    );
    this._activeDate = nextMonth;
    this.viewChangeButton.textContent = `${
      this._options.monthsFull[this.activeMonth]
    } ${this.activeYear}`;
    this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
      this._options,
      this._classes
    );
    this.datesContainer.innerHTML = template;
  }

  previousMonth() {
    const previousMonth = addMonths(this._activeDate, -1);
    this._activeDate = previousMonth;
    const template = createDayViewTemplate(
      previousMonth,
      this._headerDate,
      this._options,
      this._classes
    );
    this.viewChangeButton.textContent = `${
      this._options.monthsFull[this.activeMonth]
    } ${this.activeYear}`;
    this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
      this._options,
      this._classes
    );
    this.datesContainer.innerHTML = template;
  }

  nextYear() {
    const nextYear = addYears(this._activeDate, 1);
    this._activeDate = nextYear;
    this.viewChangeButton.textContent = `${this.activeYear}`;
    this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
      this._options,
      this._classes
    );
    const template = createMonthViewTemplate(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      MONTHS_IN_ROW,
      this._classes
    );
    this.datesContainer.innerHTML = template;
  }

  previousYear() {
    const previousYear = addYears(this._activeDate, -1);
    this._activeDate = previousYear;
    this.viewChangeButton.textContent = `${this.activeYear}`;
    this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
      this._options,
      this._classes
    );
    const template = createMonthViewTemplate(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      MONTHS_IN_ROW,
      this._classes
    );
    this.datesContainer.innerHTML = template;
  }

  nextYears() {
    const nextYear = addYears(this._activeDate, 24);
    this._activeDate = nextYear;
    const template = createYearViewTemplate(
      nextYear,
      this._selectedYear,
      this._options,
      YEARS_IN_VIEW,
      YEARS_IN_ROW,
      this._classes
    );
    this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
    this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
      this._options,
      this._classes
    );
    this.datesContainer.innerHTML = template;
  }

  previousYears() {
    const previousYear = addYears(this._activeDate, -24);
    this._activeDate = previousYear;
    const template = createYearViewTemplate(
      previousYear,
      this._selectedYear,
      this._options,
      YEARS_IN_VIEW,
      YEARS_IN_ROW,
      this._classes
    );
    this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
    this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
      this._options,
      this._classes
    );
    this.datesContainer.innerHTML = template;
  }

  _asyncChangeView(view) {
    setTimeout(() => {
      this._changeView(view);
    }, 0);
  }

  _changeView(view) {
    this._view = view;
    // We need to add blur event here to reapply focus to
    // dates container when switching from years to months
    // view after selecting year
    this.datesContainer.blur();

    if (view === "days") {
      this.datesContainer.innerHTML = createDayViewTemplate(
        this._activeDate,
        this._headerDate,
        this._options,
        this._classes
      );
    }

    if (view === "months") {
      this.datesContainer.innerHTML = createMonthViewTemplate(
        this.activeYear,
        this._selectedYear,
        this._selectedMonth,
        this._options,
        MONTHS_IN_ROW,
        this._classes
      );
    }

    if (view === "years") {
      this.datesContainer.innerHTML = createYearViewTemplate(
        this._activeDate,
        this._selectedYear,
        this._options,
        YEARS_IN_VIEW,
        YEARS_IN_ROW,
        this._classes
      );
    }

    this.datesContainer.focus();
    this._updateViewControlsAndAttributes(view);
    this._updateControlsDisabledState();
  }

  _updateViewControlsAndAttributes(view) {
    if (view === "days") {
      this.viewChangeButton.textContent = `${
        this._options.monthsFull[this.activeMonth]
      } ${this.activeYear}`;
      this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
        this._options,
        this._classes
      );
      this.viewChangeButton.setAttribute(
        "aria-label",
        this._options.switchToMultiYearViewLabel
      );
      this.previousButton.setAttribute(
        "aria-label",
        this._options.prevMonthLabel
      );
      this.nextButton.setAttribute("aria-label", this._options.nextMonthLabel);
    }

    if (view === "months") {
      this.viewChangeButton.textContent = `${this.activeYear}`;
      this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
        this._options,
        this._classes
      );
      this.viewChangeButton.setAttribute(
        "aria-label",
        this._options.switchToDayViewLabel
      );
      this.previousButton.setAttribute(
        "aria-label",
        this._options.prevYearLabel
      );
      this.nextButton.setAttribute("aria-label", this._options.nextYearLabel);
    }

    if (view === "years") {
      this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`;
      this.viewChangeButton.innerHTML += createViewChangeButtonIcon(
        this._options,
        this._classes
      );
      this.viewChangeButton.setAttribute(
        "aria-label",
        this._options.switchToMonthViewLabel
      );
      this.previousButton.setAttribute(
        "aria-label",
        this._options.prevMultiYearLabel
      );
      this.nextButton.setAttribute(
        "aria-label",
        this._options.nextMultiYearLabel
      );
    }
  }

  _updateControlsDisabledState() {
    if (
      isNextDateDisabled(
        this._options.disableFuture,
        this._activeDate,
        this._view,
        YEARS_IN_VIEW,
        this._options.min,
        this._options.max,
        this.lastYearInView,
        this.firstYearInView
      )
    ) {
      this.nextButton.disabled = true;
    } else {
      this.nextButton.disabled = false;
    }

    if (
      isPreviousDateDisabled(
        this._options.disablePast,
        this._activeDate,
        this._view,
        YEARS_IN_VIEW,
        this._options.min,
        this._options.max,
        this.lastYearInView,
        this.firstYearInView
      )
    ) {
      this.previousButton.disabled = true;
    } else {
      this.previousButton.disabled = false;
    }
  }

  _handleUserInput(input) {
    const delimeters = this._getDelimeters(this._options.format);
    const date = this._parseDate(input, this._options.format, delimeters);

    if (isValidDate(date)) {
      this._activeDate = date;
      this._selectedDate = date;
      this._selectedYear = getYear(date);
      this._selectedMonth = getMonth(date);
      this._headerDate = date;
    } else {
      this._activeDate = new Date();
      this._selectedDate = null;
      this._selectedMonth = null;
      this._selectedYear = null;
      this._headerDate = null;
      this._headerMonth = null;
      this._headerYear = null;
    }
  }

  _getDelimeters(format) {
    return format.match(/[^(dmy)]{1,}/g);
  }

  _parseDate(dateString, format, delimeters) {
    let delimeterPattern;

    if (delimeters[0] !== delimeters[1]) {
      delimeterPattern = delimeters[0] + delimeters[1];
    } else {
      delimeterPattern = delimeters[0];
    }

    const regExp = new RegExp(`[${delimeterPattern}]`);
    const dateParts = dateString.split(regExp);
    const formatParts = format.split(regExp);
    const isMonthString = format.indexOf("mmm") !== -1;

    const datesArray = [];

    for (let i = 0; i < formatParts.length; i++) {
      if (formatParts[i].indexOf("yy") !== -1) {
        datesArray[0] = { value: dateParts[i], format: formatParts[i] };
      }
      if (formatParts[i].indexOf("m") !== -1) {
        datesArray[1] = { value: dateParts[i], format: formatParts[i] };
      }
      if (formatParts[i].indexOf("d") !== -1 && formatParts[i].length <= 2) {
        datesArray[2] = { value: dateParts[i], format: formatParts[i] };
      }
    }

    let monthsNames;

    if (format.indexOf("mmmm") !== -1) {
      monthsNames = this._options.monthsFull;
    } else {
      monthsNames = this._options.monthsShort;
    }

    const year = Number(datesArray[0].value);
    const month = isMonthString
      ? this.getMonthNumberByMonthName(datesArray[1].value, monthsNames)
      : Number(datesArray[1].value) - 1;
    const day = Number(datesArray[2].value);

    const parsedDate = createDate(year, month, day);
    return parsedDate;
  }

  getMonthNumberByMonthName(monthValue, monthLabels) {
    return monthLabels.findIndex((monthLabel) => monthLabel === monthValue);
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

export default Datepicker;
