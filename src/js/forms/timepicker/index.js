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

/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
import { createPopper } from "@popperjs/core";
import { typeCheckConfig, element, getUID } from "../../util/index";
import { getTimepickerTemplate, getToggleButtonTemplate } from "./templates";
import Data from "../../dom/data";
import Manipulator from "../../dom/manipulator";
import EventHandler, { EventHandlerMulti } from "../../dom/event-handler";
import {
  formatToAmPm,
  toggleClassHandler,
  checkBrowser,
  findMousePosition,
  takeValue,
  formatNormalHours,
  setMinTime,
  setMaxTime,
  _convertHourToNumber,
  checkValueBeforeAccept,
  _verifyMaxTimeHourAndAddDisabledClass,
  _verifyMaxTimeMinutesTipsAndAddDisabledClass,
  _verifyMinTimeHourAndAddDisabledClass,
  _verifyMinTimeMinutesTipsAndAddDisabledClass,
} from "./utils";
import ScrollBarHelper from "../../util/scrollbar";
import FocusTrap from "../../util/focusTrap";
import SelectorEngine from "../../dom/selector-engine";
import {
  UP_ARROW,
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
  ESCAPE,
  ENTER,
} from "../../util/keycodes";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "timepicker";
const ATTR_NAME = `data-te-${NAME}`;
const SELECTOR_DATA_TE_TOGGLE = "[data-te-toggle]";

const DATA_KEY = `te.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_MOUSEDOWN_DATA_API = `mousedown${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_MOUSEUP_DATA_API = `mouseup${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_MOUSEMOVE_DATA_API = `mousemove${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_MOUSELEAVE_DATA_API = `mouseleave${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_MOUSEOVER_DATA_API = `mouseover${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_TOUCHMOVE_DATA_API = `touchmove${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_TOUCHEND_DATA_API = `touchend${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_TOUCHSTART_DATA_API = `touchstart${EVENT_KEY}${DATA_API_KEY}`;

const SELECTOR_ATTR_TIMEPICKER_AM = `[${ATTR_NAME}-am]`;
const SELECTOR_ATTR_TIMEPICKER_PM = `[${ATTR_NAME}-pm]`;
const SELECTOR_ATTR_TIMEPICKER_FORMAT24 = `[${ATTR_NAME}-format24]`;
const SELECTOR_ATTR_TIMEPICKER_CURRENT = `[${ATTR_NAME}-current]`;
const SELECTOR_ATTR_TIMEPICKER_HOUR_MODE = `[${ATTR_NAME}-hour-mode]`;
const SELECTOR_ATTR_TIMEPICKER_TOGGLE_BUTTON = `[${ATTR_NAME}-toggle-button]`;

const ATTR_TIMEPICKER_BUTTON_CANCEL = `${ATTR_NAME}-cancel`;
const ATTR_TIMEPICKER_BUTTON_CLEAR = `${ATTR_NAME}-clear`;
const ATTR_TIMEPICKER_BUTTON_SUBMIT = `${ATTR_NAME}-submit`;
const ATTR_TIMEPICKER_ICON = `${ATTR_NAME}-icon`;
const ATTR_TIMEPICKER_ICON_UP = `${ATTR_NAME}-icon-up`;
const ATTR_TIMEPICKER_ICON_DOWN = `${ATTR_NAME}-icon-down`;
const ATTR_TIMEPICKER_ICON_INLINE_HOUR = `${ATTR_NAME}-icon-inline-hour`;
const ATTR_TIMEPICKER_ICON_INLINE_MINUTE = `${ATTR_NAME}-icon-inline-minute`;
const ATTR_TIMEPICKER_ICONS_HOUR_INLINE = `${ATTR_NAME}-inline-hour-icons`;
const ATTR_TIMEPICKER_CURRENT_INLINE = `${ATTR_NAME}-current-inline`;

const ATTR_READONLY = "readonly";
const ATTR_TIMEPICKER_INVALID_FEEDBACK = `${ATTR_NAME}-invalid-feedback`;
const ATTR_TIMEPICKER_IS_INVALID = `${ATTR_NAME}-is-invalid`;
const ATTR_TIMEPICKER_DISABLED = `${ATTR_NAME}-disabled`;
const ATTR_TIMEPICKER_ACTIVE = `${ATTR_NAME}-active`;

const ATTR_TIMEPICKER_INPUT = `${ATTR_NAME}-input`;
const ATTR_TIMEPICKER_CLOCK = `${ATTR_NAME}-clock`;
const ATTR_TIMEPICKER_CLOCK_INNER = `${ATTR_NAME}-clock-inner`;
const ATTR_TIMEPICKER_WRAPPER = `${ATTR_NAME}-wrapper`;
const ATTR_TIMEPICKER_CLOCK_WRAPPER = `${ATTR_NAME}-clock-wrapper`;
const ATTR_TIMEPICKER_HOUR = `${ATTR_NAME}-hour`;
const ATTR_TIMEPICKER_MINUTE = `${ATTR_NAME}-minute`;
const ATTR_TIMEPICKER_TIPS_ELEMENT = `${ATTR_NAME}-tips-element`;
const ATTR_TIMEPICKER_TIPS_HOURS = `${ATTR_NAME}-tips-hours`;
const ATTR_TIMEPICKER_TIPS_MINUTES = `${ATTR_NAME}-tips-minutes`;
const ATTR_TIMEPICKER_INNER_HOURS = `${ATTR_NAME}-tips-inner`;
const ATTR_TIMEPICKER_TIPS_INNER_ELEMENT = `${ATTR_NAME}-tips-inner-element`;
const ATTR_TIMEPICKER_MIDDLE_DOT = `${ATTR_NAME}-middle-dot`;
const ATTR_TIMEPICKER_HAND_POINTER = `${ATTR_NAME}-hand-pointer`;
const ATTR_TIMEPICKER_CIRCLE = `${ATTR_NAME}-circle`;
const ATTR_TIMEPICKER_MODAL = `${ATTR_NAME}-modal`;

const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`;

const Default = {
  appendValidationInfo: true,
  bodyID: "",
  cancelLabel: "Cancel",
  clearLabel: "Clear",
  closeModalOnBackdropClick: true,
  closeModalOnMinutesClick: false,
  container: "body",
  defaultTime: "",
  disabled: false,
  disablePast: false,
  disableFuture: false,
  enableValidation: true,
  focusInputAfterApprove: false,
  footerID: "",
  format12: true,
  format24: false,
  headID: "",
  increment: false,
  inline: false,
  invalidLabel: "Invalid Time Format",
  maxTime: "",
  minTime: "",
  modalID: "",
  okLabel: "Ok",
  overflowHidden: true,
  pickerID: "",
  readOnly: false,
  showClearBtn: true,
  switchHoursToMinutesOnClick: true,
  iconSVG: defaultIcon,
  withIcon: true,
  pmLabel: "PM",
  amLabel: "AM",
  animations: true,
};

const DefaultType = {
  appendValidationInfo: "boolean",
  bodyID: "string",
  cancelLabel: "string",
  clearLabel: "string",
  closeModalOnBackdropClick: "boolean",
  closeModalOnMinutesClick: "boolean",
  container: "string",
  disabled: "boolean",
  disablePast: "boolean",
  disableFuture: "boolean",
  enableValidation: "boolean",
  footerID: "string",
  format12: "boolean",
  format24: "boolean",
  headID: "string",
  increment: "boolean",
  inline: "boolean",
  invalidLabel: "string",
  modalID: "string",
  okLabel: "string",
  overflowHidden: "boolean",
  pickerID: "string",
  readOnly: "boolean",
  showClearBtn: "boolean",
  switchHoursToMinutesOnClick: "boolean",
  defaultTime: "(string|date|number)",
  iconSVG: "string",
  withIcon: "boolean",
  pmLabel: "string",
  amLabel: "string",
  animations: "boolean",
};

const DefaultClasses = {
  tips: "absolute rounded-[100%] w-[32px] h-[32px] text-center cursor-pointer text-[1.1rem] rounded-[100%] bg-transparent flex justify-center items-center font-light focus:outline-none selection:bg-transparent",
  tipsActive: "text-white bg-[#3b71ca] font-normal",
  tipsDisabled: "text-[#b3afaf] pointer-events-none bg-transparent",
  transform: "transition-[transform,height] ease-in-out duration-[400ms]",
  modal: "z-[1065]",
  clockAnimation: "animate-[show-up-clock_350ms_linear]",
  opacity: "!opacity-100",
  timepickerWrapper:
    "touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col fixed",
  timepickerContainer:
    "flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] min-[320px]:max-[825px]:landscape:rounded-lg",
  timepickerElements:
    "flex flex-col min-w-[310px] min-h-[325px] bg-white rounded-t-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape:min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto justify-around",
  timepickerHead:
    "bg-[#3b71ca] dark:bg-zinc-700 h-[100px] rounded-t-lg pr-[24px] pl-[50px] py-[10px] min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center",
  timepickerHeadContent:
    "min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly",
  timepickerCurrentWrapper: "[direction:ltr] rtl:[direction:rtl]",
  timepickerCurrentButtonWrapper: "relative h-full",
  timepickerCurrentButton:
    "text-[3.75rem] font-light leading-[1.2] tracking-[-0.00833em] text-white opacity-[.54] border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none ",
  timepickerDot:
    "font-light leading-[1.2] tracking-[-0.00833em] text-[3.75rem] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal",
  timepickerModeWrapper:
    "flex flex-col justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row",
  timepickerModeAm:
    "p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none",
  timepickerModePm:
    "p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none",
  timepickerClockWrapper:
    "min-w-[310px] max-w-[325px] min-h-[305px] overflow-x-hidden h-full flex justify-center flex-col items-center dark:bg-zinc-500",
  timepickerClock:
    "relative rounded-[100%] w-[260px] h-[260px] cursor-default my-0 mx-auto bg-[#00000012] dark:bg-zinc-600/50",
  timepickerMiddleDot:
    "top-1/2 left-1/2 w-[6px] h-[6px] -translate-y-1/2 -translate-x-1/2 rounded-[50%] bg-[#3b71ca] absolute",
  timepickerHandPointer:
    "bg-[#3b71ca] bottom-1/2 h-2/5 left-[calc(50%-1px)] rtl:!left-auto origin-[center_bottom_0] rtl:!origin-[50%_50%_0] w-[2px] absolute",
  timepickerPointerCircle:
    "-top-[21px] -left-[15px] w-[4px] border-[14px] border-solid border-[#3b71ca] h-[4px] box-content rounded-[100%] absolute",
  timepickerClockInner:
    "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[160px] h-[160px] rounded-[100%]",
  timepickerFooterWrapper:
    "rounded-b-lg flex justify-between items-center w-full h-[56px] px-[12px] bg-white dark:bg-zinc-500",
  timepickerFooter: "w-full flex justify-between",
  timepickerFooterButton:
    "text-[0.8rem] min-w-[64px] box-border font-medium leading-[40px] rounded-[10px] tracking-[0.1rem] uppercase text-[#3b71ca] dark:text-white border-none bg-transparent transition-[background-color,box-shadow,border] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] delay-[0ms] outline-none py-0 px-[10px] h-[40px] mb-[10px] hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none",
  timepickerInlineWrapper:
    "touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col rounded-lg",
  timepickerInlineContainer:
    "flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]",
  timepickerInlineElements:
    "flex flex-col min-h-[auto] min-w-[310px] bg-white rounded-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:rounded-bl-lg min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape::min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto justify-around",
  timepickerInlineHead:
    "bg-[#3b71ca] dark:bg-zinc-700 h-[100px] rounded-t-lg min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center p-0 rounded-b-lg",
  timepickerInlineHeadContent:
    "min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly items-center",
  timepickerInlineHourWrapper: "relative h-full !opacity-100",
  timepickerCurrentMinuteWrapper: "relative h-full",
  timepickerInlineIconUp:
    "absolute text-white -top-[35px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center",
  timepickerInlineIconSvg: "h-4 w-4",
  timepickerInlineCurrentButton:
    "font-light leading-[1.2] tracking-[-0.00833em] text-white border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal !opacity-100 cursor-pointer focus:bg-[#00000026] hover:outline-none focus:outline-none text-[2.5rem] hover:bg-[unset]",
  timepickerInlineIconDown:
    "absolute text-white -bottom-[47px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center",
  timepickerInlineDot:
    "font-light leading-[1.2] tracking-[-0.00833em] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal text-[2.5rem]",
  timepickerInlineModeWrapper:
    "flex justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row",
  timepickerInlineModeAm:
    "hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer mr-2 ml-6",
  timepickerInlineModePm:
    "hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer",
  timepickerInlineSubmitButton:
    "hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none text-[0.8rem] box-border font-medium leading-[40px] tracking-[.1rem] uppercase border-none bg-transparent [transition:background-color_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,box-shadow_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,border_250ms_cubic-bezier(0.4,0,0.2,1)_0ms] outline-none rounded-[100%] h-[48px] min-w-[48px] inline-block ml-[30px] text-white py-1 px-2 mb-0",
  timepickerToggleButton:
    "h-4 w-4 ml-auto absolute outline-none border-none bg-transparent right-1.5 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-pointer hover:text-[#3b71ca] focus:text-[#3b71ca] dark:hover:text-[#3b71ca] dark:focus:text-[#3b71ca] dark:text-white",
};

const DefaultClassesType = {
  tips: "string",
  tipsActive: "string",
  tipsDisabled: "string",
  transform: "string",
  modal: "string",
  clockAnimation: "string",
  opacity: "string",
  timepickerWrapper: "string",
  timepickerContainer: "string",
  timepickerElements: "string",
  timepickerHead: "string",
  timepickerHeadContent: "string",
  timepickerCurrentWrapper: "string",
  timepickerCurrentButtonWrapper: "string",
  timepickerCurrentButton: "string",
  timepickerDot: "string",
  timepickerModeWrapper: "string",
  timepickerModeAm: "string",
  timepickerModePm: "string",
  timepickerClockWrapper: "string",
  timepickerClock: "string",
  timepickerMiddleDot: "string",
  timepickerHandPointer: "string",
  timepickerPointerCircle: "string",
  timepickerClockInner: "string",
  timepickerFooterWrapper: "string",
  timepickerFooterButton: "string",
  timepickerInlineWrapper: "string",
  timepickerInlineContainer: "string",
  timepickerInlineElements: "string",
  timepickerInlineHead: "string",
  timepickerInlineHeadContent: "string",
  timepickerInlineHourWrapper: "string",
  timepickerCurrentMinuteWrapper: "string",
  timepickerInlineIconUp: "string",
  timepickerInlineIconSvg: "string",
  timepickerInlineCurrentButton: "string",
  timepickerInlineIconDown: "string",
  timepickerInlineDot: "string",
  timepickerInlineModeWrapper: "string",
  timepickerInlineModeAm: "string",
  timepickerInlineModePm: "string",
  timepickerInlineSubmitButton: "string",
  timepickerToggleButton: "string",
};

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Timepicker {
  constructor(element, options = {}, classes) {
    this._element = element;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._document = document;
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);
    this._currentTime = null;
    this._toggleButtonId = getUID("timepicker-toggle-");

    this.hoursArray = [
      "12",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
    ];
    this.innerHours = [
      "00",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
    ];
    this.minutesArray = [
      "00",
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55",
    ];

    this.input = SelectorEngine.findOne("input", this._element);
    this.dataWithIcon = element.dataset.withIcon;
    this.dataToggle = element.dataset.toggle;
    this.customIcon = SelectorEngine.findOne(
      SELECTOR_ATTR_TIMEPICKER_TOGGLE_BUTTON,
      this._element
    );

    this._checkToggleButton();

    this.inputFormatShow = SelectorEngine.findOne(
      SELECTOR_ATTR_TIMEPICKER_FORMAT24,
      this._element
    );

    this.inputFormat =
      this.inputFormatShow === null
        ? ""
        : Object.values(this.inputFormatShow.dataset)[0];
    this.elementToggle = SelectorEngine.findOne(
      SELECTOR_DATA_TE_TOGGLE,
      this._element
    );
    this.toggleElement = Object.values(
      element.querySelector(SELECTOR_DATA_TE_TOGGLE).dataset
    )[0];

    this._hour = null;
    this._minutes = null;
    this._AM = null;
    this._PM = null;
    this._wrapper = null;
    this._modal = null;
    this._hand = null;
    this._circle = null;
    this._focusTrap = null;
    this._popper = null;
    this._interval = null;
    this._timeoutInterval = null;

    this._inputValue =
      this._options.defaultTime !== ""
        ? this._options.defaultTime
        : this.input.value;

    if (this._options.format24) {
      this._options.format12 = false;

      this._currentTime = formatNormalHours(this._inputValue);
    }

    if (this._options.format12) {
      this._options.format24 = false;

      this._currentTime = formatToAmPm(this._inputValue);
    }

    if (this._options.readOnly) {
      this.input.setAttribute(ATTR_READONLY, true);
    }

    if (this.inputFormat === "true" && this.inputFormat !== "") {
      this._options.format12 = false;
      this._options.format24 = true;
      this._currentTime = formatNormalHours(this._inputValue);
    }

    this._animations =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      this._options.animations;

    this.init();

    this._isHours = true;
    this._isMinutes = false;
    this._isInvalidTimeFormat = false;
    this._isMouseMove = false;
    this._isInner = false;
    this._isAmEnabled = false;
    this._isPmEnabled = false;

    if (this._options.format12 && !this._options.defaultTime) {
      this._isPmEnabled = true;
    }

    this._objWithDataOnChange = { degrees: null };

    this._scrollBar = new ScrollBarHelper();
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  init() {
    const { format12, format24, enableValidation } = this._options;
    let zero;
    let hoursFormat;
    let _amOrPm;

    this.input.setAttribute(ATTR_TIMEPICKER_INPUT, "");

    if (this._currentTime !== undefined) {
      const { hours, minutes, amOrPm } = this._currentTime;

      zero = Number(hours) < 10 ? 0 : "";
      hoursFormat = `${zero}${Number(hours)}:${minutes}`;
      _amOrPm = amOrPm;

      if (format12) {
        this.input.value = `${hoursFormat} ${_amOrPm}`;
      } else if (format24) {
        this.input.value = `${hoursFormat}`;
      }
    } else {
      zero = "";
      hoursFormat = "";
      _amOrPm = "";

      this.input.value = "";
    }

    if (this.input.value.length > 0 && this.input.value !== "") {
      this.input.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
      EventHandler.trigger(this.input, "input");
    }

    if (this._options === null && this._element === null) return;

    if (enableValidation) {
      this._getValidate("keydown change blur focus");
    }

    this._handleOpen();
    this._listenToToggleKeydown();
  }

  dispose() {
    this._removeModal();

    if (this._element !== null) {
      Data.removeData(this._element, DATA_KEY);
    }

    setTimeout(() => {
      this._element = null;
      this._options = null;
      this.input = null;
      this._focusTrap = null;
    }, 350);

    EventHandler.off(
      this._element,
      "click",
      `[data-te-toggle='${this.toggleElement}']`
    );
    EventHandler.off(
      this._element,
      "keydown",
      `[data-te-toggle='${this.toggleElement}']`
    );
  }

  update(options = {}) {
    this._options = this._getConfig({ ...this._options, ...options });
  }

  // private

  _checkToggleButton() {
    if (this.customIcon !== null) return;

    if (this.dataWithIcon !== undefined) {
      this._options.withIcon = null;

      if (this.dataWithIcon === "true") {
        this._appendToggleButton(this._options);
      }
    }

    if (this._options.withIcon) {
      this._appendToggleButton(this._options);
    }
  }

  _appendToggleButton() {
    const toggleButton = getToggleButtonTemplate(
      this._options,
      this._toggleButtonId,
      this._classes
    );

    this.input.insertAdjacentHTML("afterend", toggleButton);
  }

  _getDomElements() {
    this._hour = SelectorEngine.findOne(`[${ATTR_TIMEPICKER_HOUR}]`);
    this._minutes = SelectorEngine.findOne(`[${ATTR_TIMEPICKER_MINUTE}]`);
    this._AM = SelectorEngine.findOne(SELECTOR_ATTR_TIMEPICKER_AM);
    this._PM = SelectorEngine.findOne(SELECTOR_ATTR_TIMEPICKER_PM);
    this._wrapper = SelectorEngine.findOne(`[${ATTR_TIMEPICKER_WRAPPER}]`);
    this._modal = SelectorEngine.findOne(`[${ATTR_TIMEPICKER_MODAL}]`);
    this._hand = SelectorEngine.findOne(`[${ATTR_TIMEPICKER_HAND_POINTER}]`);
    this._circle = SelectorEngine.findOne(`[${ATTR_TIMEPICKER_CIRCLE}]`);
    this._clock = SelectorEngine.findOne(`[${ATTR_TIMEPICKER_CLOCK}]`);
    this._clockInner = SelectorEngine.findOne(
      `[${ATTR_TIMEPICKER_CLOCK_INNER}]`
    );
  }

  _handlerMaxMinHoursOptions(
    degrees,
    maxHour,
    minHour,
    maxFormat,
    minFormat,
    e
  ) {
    if (!maxHour && !minHour) return true;

    const { format24, format12, disablePast, disableFuture } = this._options;
    const { _isAmEnabled, _isPmEnabled } = this;
    const key = e.keyCode;

    const _isMouseOnInnerClock =
      e.target.hasAttribute(ATTR_TIMEPICKER_CLOCK_INNER) ||
      e.target.hasAttribute(ATTR_TIMEPICKER_INNER_HOURS) ||
      e.target.hasAttribute(ATTR_TIMEPICKER_TIPS_INNER_ELEMENT);

    minHour = setMinTime(minHour, disablePast, format12);
    maxHour = setMaxTime(maxHour, disableFuture, format12);
    typeof maxHour !== "number" && (maxHour = takeValue(maxHour, false)[0]);

    const maxHourDegrees = maxHour !== "" ? maxHour * 30 : "";
    const minHourDegrees = minHour !== "" ? minHour * 30 : "";

    if (degrees < 0) {
      degrees = 360 + degrees;
    }

    degrees = degrees === 360 ? 0 : degrees;

    const _handleKeyboardEvents = () => {
      const tips = document.querySelectorAll(
        `[${ATTR_TIMEPICKER_TIPS_ELEMENT}]`
      );
      const innerTips = document.querySelectorAll(
        `[${ATTR_TIMEPICKER_TIPS_INNER_ELEMENT}]`
      );

      const currentHour = _convertHourToNumber(this._hour.innerText);
      let nextHourTip;
      let numberToAdd;
      let nextHour;

      if (key === UP_ARROW) {
        numberToAdd = 1;
      } else if (key === DOWN_ARROW) {
        numberToAdd = -1;
      }

      if (currentHour === 12 && key === UP_ARROW) {
        nextHour = 1;
      } else if (currentHour === 0 && key === UP_ARROW) {
        nextHour = 13;
      } else if (currentHour === 0 && key === DOWN_ARROW) {
        nextHour = 23;
      } else if (currentHour === 13 && key === DOWN_ARROW) {
        nextHour = 0;
      } else if (currentHour === 1 && key === DOWN_ARROW) {
        nextHour = 12;
      } else {
        nextHour = currentHour + numberToAdd;
      }

      tips.forEach((tip) => {
        if (Number(tip.textContent) === nextHour) {
          nextHourTip = tip;
        }
      });
      innerTips.forEach((innerTip) => {
        if (Number(innerTip.textContent) === nextHour) {
          nextHourTip = innerTip;
        }
      });

      return !nextHourTip.parentElement.hasAttribute(ATTR_TIMEPICKER_DISABLED);
    };

    const _handle24FormatMouseEvents = () => {
      const minInnerHourDegrees =
        minHour !== "" && minHour > 12 ? (minHour - 12) * 30 : "";
      const maxInnerHourDegrees =
        maxHour !== "" && maxHour > 12 ? (maxHour - 12) * 30 : "";

      if (
        (minInnerHourDegrees && degrees < minInnerHourDegrees) ||
        (maxInnerHourDegrees && degrees > maxInnerHourDegrees) ||
        (maxHour && maxHour < 12)
      ) {
        return;
      }
      return true;
    };

    if (format24 && e.type !== "keydown" && _isMouseOnInnerClock) {
      return _handle24FormatMouseEvents();
    }
    if (e.type === "keydown") {
      return _handleKeyboardEvents(e);
    }

    const minFormatAndCurrentFormatEqual =
      !minFormat ||
      (minFormat === "PM" && _isPmEnabled) ||
      (minHour !== "" && minFormat === "AM" && _isAmEnabled);

    const maxFormatAndCurrentFormatEqual =
      !maxFormat ||
      (maxFormat === "PM" && _isPmEnabled) ||
      (maxHour !== "" && maxFormat === "AM" && _isAmEnabled);

    const isMinHourValid = () => {
      const minDegrees =
        minHourDegrees === 360 && format12 ? 0 : minHourDegrees;
      if (!minHour) {
        return true;
      } else if (
        (minFormat === "PM" && _isAmEnabled) ||
        (minFormatAndCurrentFormatEqual && degrees < minDegrees)
      ) {
        return;
      }
      return true;
    };

    const isMaxHourValid = () => {
      const maxDegrees =
        maxHourDegrees === 360 && format12 ? 0 : maxHourDegrees;
      if (!maxHour) {
        return true;
      } else if (
        (maxFormat === "AM" && _isPmEnabled) ||
        (maxFormatAndCurrentFormatEqual && degrees > maxDegrees)
      ) {
        return;
      }
      return true;
    };

    return isMinHourValid() && isMaxHourValid();
  }

  _handleKeyboard() {
    EventHandler.on(this._document, EVENT_KEYDOWN_DATA_API, "", (e) => {
      let hour;
      let minute;
      let innerHour;
      const {
        increment,
        maxTime,
        minTime,
        format12,
        disablePast,
        disableFuture,
      } = this._options;

      let minHour = takeValue(minTime, false)[0];
      let maxHour = takeValue(maxTime, false)[0];
      const minFormat = takeValue(minTime, false)[2];
      const maxFormat = takeValue(maxTime, false)[2];

      minHour = setMinTime(minHour, disablePast, format12);
      maxHour = setMaxTime(maxHour, disableFuture, format12);

      typeof maxHour !== "number" && (maxHour = takeValue(maxHour, false)[0]);

      const hoursView =
        SelectorEngine.findOne(`[${ATTR_TIMEPICKER_TIPS_MINUTES}]`) === null;
      const innerHoursExist =
        SelectorEngine.findOne(`[${ATTR_TIMEPICKER_INNER_HOURS}]`) !== null;

      const degrees = Number(this._hand.style.transform.replace(/[^\d-]/g, ""));

      const allTipsMinutes = SelectorEngine.find(
        `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`,
        this._modal
      );
      const allTipsHours = SelectorEngine.find(
        `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
        this._modal
      );
      const allInnerTips = SelectorEngine.find(
        `[${ATTR_TIMEPICKER_INNER_HOURS}]`,
        this._modal
      );

      let hourTime = this._makeHourDegrees(e.target, degrees, hour).hour;
      const { degrees: hourObjDegrees, addDegrees } = this._makeHourDegrees(
        e.target,
        degrees,
        hour
      );

      let { minute: minHourMinutes, degrees: minObjDegrees } =
        this._makeMinutesDegrees(degrees, minute);
      const addMinDegrees = this._makeMinutesDegrees(
        degrees,
        minute
      ).addDegrees;

      let { hour: innerHourDegrees } = this._makeInnerHoursDegrees(
        degrees,
        innerHour
      );

      if (e.keyCode === ESCAPE) {
        const cancelBtn = SelectorEngine.findOne(
          `[${ATTR_TIMEPICKER_BUTTON_CANCEL}]`,
          this._modal
        );
        EventHandler.trigger(cancelBtn, "click");
      } else if (hoursView) {
        if (innerHoursExist) {
          if (e.keyCode === RIGHT_ARROW) {
            this._isInner = false;
            Manipulator.addStyle(this._hand, {
              height: "calc(40% + 1px)",
            });
            this._hour.textContent = this._setHourOrMinute(
              hourTime > 12 ? 1 : hourTime
            );
            this._toggleClassActive(this.hoursArray, this._hour, allTipsHours);
            this._toggleClassActive(this.innerHours, this._hour, allInnerTips);
          }

          if (e.keyCode === LEFT_ARROW) {
            this._isInner = true;
            Manipulator.addStyle(this._hand, {
              height: "21.5%",
            });

            this._hour.textContent = this._setHourOrMinute(
              innerHourDegrees >= 24 || innerHourDegrees === "00"
                ? 0
                : innerHourDegrees
            );
            this._toggleClassActive(this.innerHours, this._hour, allInnerTips);
            this._toggleClassActive(
              this.hoursArray,
              this._hour - 1,
              allTipsHours
            );
          }
        }
        if (e.keyCode === UP_ARROW) {
          const isNextHourValid = this._handlerMaxMinHoursOptions(
            hourObjDegrees + 30,
            maxHour,
            minHour,
            maxFormat,
            minFormat,
            e
          );

          if (!isNextHourValid) return;

          Manipulator.addStyle(this._hand, {
            transform: `rotateZ(${hourObjDegrees + addDegrees}deg)`,
          });

          if (this._isInner) {
            innerHourDegrees += 1;

            if (innerHourDegrees === 24) {
              innerHourDegrees = 0;
            } else if (innerHourDegrees === 25 || innerHourDegrees === "001") {
              innerHourDegrees = 13;
            }

            this._hour.textContent = this._setHourOrMinute(innerHourDegrees);
            this._toggleClassActive(this.innerHours, this._hour, allInnerTips);
          } else {
            hourTime += 1;
            this._hour.textContent = this._setHourOrMinute(
              hourTime > 12 ? 1 : hourTime
            );
            this._toggleClassActive(this.hoursArray, this._hour, allTipsHours);
          }
        }
        if (e.keyCode === DOWN_ARROW) {
          const isNextHourValid = this._handlerMaxMinHoursOptions(
            hourObjDegrees - 30,
            maxHour,
            minHour,
            maxFormat,
            minFormat,
            e
          );

          if (!isNextHourValid) return;

          Manipulator.addStyle(this._hand, {
            transform: `rotateZ(${hourObjDegrees - addDegrees}deg)`,
          });

          if (this._isInner) {
            innerHourDegrees -= 1;

            if (innerHourDegrees === 12) {
              innerHourDegrees = 0;
            } else if (innerHourDegrees === -1) {
              innerHourDegrees = 23;
            }

            this._hour.textContent = this._setHourOrMinute(innerHourDegrees);
            this._toggleClassActive(this.innerHours, this._hour, allInnerTips);
          } else {
            hourTime -= 1;
            this._hour.textContent = this._setHourOrMinute(
              hourTime === 0 ? 12 : hourTime
            );
            this._toggleClassActive(this.hoursArray, this._hour, allTipsHours);
          }
        }
      } else {
        if (e.keyCode === UP_ARROW) {
          minObjDegrees += addMinDegrees;
          Manipulator.addStyle(this._hand, {
            transform: `rotateZ(${minObjDegrees}deg)`,
          });
          minHourMinutes += 1;
          if (increment) {
            minHourMinutes += 4;

            if (minHourMinutes === "0014") {
              minHourMinutes = 5;
            }
          }

          this._minutes.textContent = this._setHourOrMinute(
            minHourMinutes > 59 ? 0 : minHourMinutes
          );
          this._toggleClassActive(
            this.minutesArray,
            this._minutes,
            allTipsMinutes
          );
          this._toggleBackgroundColorCircle(
            `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`
          );
        }
        if (e.keyCode === DOWN_ARROW) {
          minObjDegrees -= addMinDegrees;
          Manipulator.addStyle(this._hand, {
            transform: `rotateZ(${minObjDegrees}deg)`,
          });
          if (increment) {
            minHourMinutes -= 5;
          } else {
            minHourMinutes -= 1;
          }

          if (minHourMinutes === -1) {
            minHourMinutes = 59;
          } else if (minHourMinutes === -5) {
            minHourMinutes = 55;
          }

          this._minutes.textContent = this._setHourOrMinute(minHourMinutes);
          this._toggleClassActive(
            this.minutesArray,
            this._minutes,
            allTipsMinutes
          );
          this._toggleBackgroundColorCircle(
            `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`
          );
        }
      }
    });
  }

  _setActiveClassToTipsOnOpen(hour, ...rest) {
    if (this._isInvalidTimeFormat) return;

    if (!this._options.format24) {
      [...rest].filter((e) => {
        if (e.toLowerCase() === "pm") {
          Manipulator.addClass(this._PM, this._classes.opacity);
          this._PM.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
        } else if (e.toLowerCase() === "am") {
          Manipulator.addClass(this._AM, this._classes.opacity);
          this._AM.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
        } else {
          Manipulator.removeClass(this._AM, this._classes.opacity);
          Manipulator.removeClass(this._PM, this._classes.opacity);
          this._AM.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
          this._PM.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
        }

        return e;
      });

      const allTipsHours = SelectorEngine.find(
        `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
        this._modal
      );
      this._addActiveClassToTip(allTipsHours, hour);
    } else {
      const allTipsHours = SelectorEngine.find(
        `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
        this._modal
      );
      const allInnerTips = SelectorEngine.find(
        `[${ATTR_TIMEPICKER_INNER_HOURS}]`,
        this._modal
      );

      this._addActiveClassToTip(allTipsHours, hour);
      this._addActiveClassToTip(allInnerTips, hour);
    }
  }

  _setTipsAndTimesDependOnInputValue(hour, minute) {
    const { inline, format12 } = this._options;

    if (!this._isInvalidTimeFormat) {
      const rotateDegrees = hour > 12 ? hour * 30 - 360 : hour * 30;
      this._hour.textContent = hour;
      this._minutes.textContent = minute;

      if (!inline) {
        Manipulator.addStyle(this._hand, {
          transform: `rotateZ(${rotateDegrees}deg)`,
        });
        Manipulator.addStyle(this._circle, {
          backgroundColor: "#1976d2",
        });

        if (Number(hour) > 12 || hour === "00") {
          Manipulator.addStyle(this._hand, {
            height: "21.5%",
          });
        }
      }
    } else {
      this._hour.textContent = "12";
      this._minutes.textContent = "00";

      if (!inline) {
        Manipulator.addStyle(this._hand, {
          transform: "rotateZ(0deg)",
        });
      }
      if (format12) {
        Manipulator.addClass(this._PM, this._classes.opacity);
        this._PM.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
      }
    }
  }

  _listenToToggleKeydown() {
    EventHandler.on(
      this._element,
      "keydown",
      `[data-te-toggle='${this.toggleElement}']`,
      (e) => {
        if (e.keyCode === ENTER) {
          e.preventDefault();
          EventHandler.trigger(this.elementToggle, "click");
        }
      }
    );
  }

  _handleOpen() {
    const container = this._getContainer();
    EventHandlerMulti.on(
      this._element,
      "click",
      `[data-te-toggle='${this.toggleElement}']`,
      (e) => {
        if (this._options === null) return;

        // Fix for input with open, if is not for settimeout input has incorrent jumping label
        const fixForInput =
          Manipulator.getDataAttribute(this.input, "toggle") !== null ? 200 : 0;

        setTimeout(() => {
          Manipulator.addStyle(this.elementToggle, {
            pointerEvents: "none",
          });

          this.elementToggle.blur();

          let checkInputValue;

          if (takeValue(this.input)[0] === "") {
            checkInputValue = ["12", "00", "PM"];
          } else {
            checkInputValue = takeValue(this.input);
          }

          const { modalID, inline, format12 } = this._options;
          const [hour, minute, format] = checkInputValue;
          const div = element("div");

          if (Number(hour) > 12 || hour === "00") {
            this._isInner = true;
          }

          this.input.blur();
          e.target.blur();

          div.innerHTML = getTimepickerTemplate(this._options, this._classes);
          Manipulator.addClass(div, this._classes.modal);
          div.setAttribute(ATTR_TIMEPICKER_MODAL, "");

          div.setAttribute("role", "dialog");
          div.setAttribute("tabIndex", "-1");
          div.setAttribute("id", modalID);

          if (!inline) {
            container.appendChild(div);
            this._scrollBar.hide();
          } else {
            this._popper = createPopper(this.input, div, {
              placement: "bottom-start",
            });

            container.appendChild(div);
          }

          this._getDomElements();
          if (this._animations) {
            this._toggleBackdropAnimation();
          } else {
            Manipulator.addClass(this._wrapper, this._classes.opacity);
          }
          this._setActiveClassToTipsOnOpen(hour, minute, format);
          this._appendTimes();
          this._setActiveClassToTipsOnOpen(hour, minute, format);
          this._setTipsAndTimesDependOnInputValue(hour, minute);

          if (this.input.value === "") {
            const allTipsHours = SelectorEngine.find(
              `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
              this._modal
            );

            if (format12) {
              Manipulator.addClass(this._PM, this._classes.opacity);
              this._PM.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
            }

            this._hour.textContent = "12";
            this._minutes.textContent = "00";
            this._addActiveClassToTip(
              allTipsHours,
              Number(this._hour.textContent)
            );
          }

          this._handleSwitchTimeMode();
          this._handleOkButton();
          this._handleClose();

          if (inline) {
            this._handleHoverInlineBtn();
            this._handleDocumentClickInline();
            this._handleInlineClicks();
          } else {
            this._handleSwitchHourMinute();
            this._handleClockClick();
            this._handleKeyboard();

            // initial opacity on hour/minute mode fix
            const initActive = document.querySelector(
              `${SELECTOR_ATTR_TIMEPICKER_CURRENT}[${ATTR_TIMEPICKER_ACTIVE}]`
            );
            Manipulator.addClass(initActive, this._classes.opacity);

            Manipulator.addStyle(this._hour, {
              pointerEvents: "none",
            });
            Manipulator.addStyle(this._minutes, {
              pointerEvents: "",
            });
          }

          this._focusTrap = new FocusTrap(this._wrapper, {
            event: "keydown",
            condition: ({ key }) => key === "Tab",
          });
          this._focusTrap.trap();
        }, fixForInput);
      }
    );
  }

  _handleInlineClicks() {
    let selectedHour;
    let minuteNumber;
    const countMinutes = (count) => {
      let minutes = count;

      if (minutes > 59) {
        minutes = 0;
      } else if (minutes < 0) {
        minutes = 59;
      }

      return minutes;
    };

    const countHours = (count) => {
      let hour = count;

      if (this._options.format24) {
        if (hour > 24) {
          hour = 1;
        } else if (hour < 0) {
          hour = 23;
        }

        if (hour > 23) {
          hour = 0;
        }
      } else {
        if (hour > 12) {
          hour = 1;
        } else if (hour < 1) {
          hour = 12;
        }

        if (hour > 12) {
          hour = 1;
        }
      }

      return hour;
    };

    const incrementHours = (hour) => {
      const counteredNumber = countHours(hour);
      this._hour.textContent = this._setHourOrMinute(counteredNumber);
    };
    const incrementMinutes = (minutes) => {
      const counteredNumber = countMinutes(minutes);
      this._minutes.textContent = this._setHourOrMinute(counteredNumber);
    };

    const addHours = () => {
      selectedHour = countHours(selectedHour) + 1;
      incrementHours(selectedHour);
    };
    const addMinutes = () => {
      minuteNumber = countMinutes(minuteNumber) + 1;
      incrementMinutes(minuteNumber);
    };

    const subHours = () => {
      selectedHour = countHours(selectedHour) - 1;
      incrementHours(selectedHour);
    };

    const subMinutes = () => {
      minuteNumber = countMinutes(minuteNumber) - 1;
      incrementMinutes(minuteNumber);
    };

    const _clearAsyncs = () => {
      clearInterval(this._interval);
      clearTimeout(this._timeoutInterval);
    };

    const _clearAndSetThisInterval = (addHoursOrAddMinutes) => {
      _clearAsyncs();
      this._timeoutInterval = setTimeout(() => {
        this._interval = setInterval(addHoursOrAddMinutes, 100);
      }, 500);
    };
    EventHandlerMulti.on(
      this._modal,
      "click mousedown mouseup touchstart touchend contextmenu",
      `[${ATTR_TIMEPICKER_ICON_UP}], [${ATTR_TIMEPICKER_ICON_DOWN}]`,
      (e) => {
        selectedHour = Number(this._hour.textContent);
        minuteNumber = Number(this._minutes.textContent);
        const { target, type } = e;
        const isEventTypeMousedownOrTouchstart =
          type === "mousedown" || type === "touchstart";

        if (target.closest(`[${ATTR_TIMEPICKER_ICON_UP}]`)) {
          if (
            target
              .closest(`[${ATTR_TIMEPICKER_ICON_UP}]`)
              .parentNode.hasAttribute(ATTR_TIMEPICKER_ICONS_HOUR_INLINE)
          ) {
            if (isEventTypeMousedownOrTouchstart) {
              _clearAndSetThisInterval(addHours);
            } else if (
              type === "mouseup" ||
              type === "touchend" ||
              type === "contextmenu"
            ) {
              _clearAsyncs();
            } else {
              addHours();
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (isEventTypeMousedownOrTouchstart) {
              _clearAndSetThisInterval(addMinutes);
            } else if (
              type === "mouseup" ||
              type === "touchend" ||
              type === "contextmenu"
            ) {
              _clearAsyncs();
            } else {
              addMinutes();
            }
          }
        } else if (target.closest(`[${ATTR_TIMEPICKER_ICON_DOWN}]`)) {
          if (
            target
              .closest(`[${ATTR_TIMEPICKER_ICON_DOWN}]`)
              .parentNode.hasAttribute(ATTR_TIMEPICKER_ICONS_HOUR_INLINE)
          ) {
            if (isEventTypeMousedownOrTouchstart) {
              _clearAndSetThisInterval(subHours);
            } else if (type === "mouseup" || type === "touchend") {
              _clearAsyncs();
            } else {
              subHours();
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (isEventTypeMousedownOrTouchstart) {
              _clearAndSetThisInterval(subMinutes);
            } else if (type === "mouseup" || type === "touchend") {
              _clearAsyncs();
            } else {
              subMinutes();
            }
          }
        }
      }
    );
    EventHandler.on(window, EVENT_KEYDOWN_DATA_API, (e) => {
      const key = e.code;
      const isHourBtnFocused =
        document.activeElement.hasAttribute(ATTR_TIMEPICKER_HOUR);
      const isMinuteBtnFocused = document.activeElement.hasAttribute(
        ATTR_TIMEPICKER_MINUTE
      );
      const isBodyFocused = document.activeElement === document.body;

      selectedHour = Number(this._hour.textContent);
      minuteNumber = Number(this._minutes.textContent);

      switch (key) {
        case "ArrowUp":
          e.preventDefault();
          if (isBodyFocused || isHourBtnFocused) {
            this._hour.focus();
            addHours();
          } else if (isMinuteBtnFocused) {
            addMinutes();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (isBodyFocused || isHourBtnFocused) {
            this._hour.focus();
            subHours();
          } else if (isMinuteBtnFocused) {
            subMinutes();
          }
          break;
        default:
          break;
      }
    });
  }

  _handleClose() {
    EventHandler.on(
      this._modal,
      "click",
      `[${ATTR_TIMEPICKER_WRAPPER}], [${ATTR_TIMEPICKER_BUTTON_CANCEL}], [${ATTR_TIMEPICKER_BUTTON_CLEAR}]`,
      ({ target }) => {
        const { closeModalOnBackdropClick } = this._options;

        const runRemoveFunction = () => {
          Manipulator.addStyle(this.elementToggle, {
            pointerEvents: "auto",
          });

          if (this._animations) {
            this._toggleBackdropAnimation(true);
          }

          this._removeModal();
          this._focusTrap?.disable();
          this._focusTrap = null;

          if (this.elementToggle) {
            this.elementToggle.focus();
          } else if (this.input) {
            this.input.focus();
          }
        };

        if (target.hasAttribute(ATTR_TIMEPICKER_BUTTON_CLEAR)) {
          this._toggleAmPm("PM");
          this.input.value = "";
          this.input.removeAttribute(ATTR_TIMEPICKER_ACTIVE);

          let checkInputValue;

          if (takeValue(this.input)[0] === "") {
            checkInputValue = ["12", "00", "PM"];
          } else {
            checkInputValue = takeValue(this.input);
          }

          const [hour, minute, format] = checkInputValue;
          this._setTipsAndTimesDependOnInputValue("12", "00");
          this._setActiveClassToTipsOnOpen(hour, minute, format);
          this._hour.click();
        } else if (
          target.hasAttribute(ATTR_TIMEPICKER_BUTTON_CANCEL) ||
          target.hasAttribute(ATTR_TIMEPICKER_BUTTON_SUBMIT)
        ) {
          runRemoveFunction();
        } else if (
          target.hasAttribute(ATTR_TIMEPICKER_WRAPPER) &&
          closeModalOnBackdropClick
        ) {
          runRemoveFunction();
        }
      }
    );
  }

  showValueInput() {
    return this.input.value;
  }

  _handleOkButton() {
    EventHandlerMulti.on(
      this._modal,
      "click",
      `[${ATTR_TIMEPICKER_BUTTON_SUBMIT}]`,
      () => {
        let { maxTime, minTime } = this._options;
        const {
          format12,
          format24,
          readOnly,
          focusInputAfterApprove,
          disablePast,
          disableFuture,
        } = this._options;
        const hourModeActive = this._document.querySelector(
          `${SELECTOR_ATTR_TIMEPICKER_HOUR_MODE}[${ATTR_TIMEPICKER_ACTIVE}]`
        );

        const currentValue = `${this._hour.textContent}:${this._minutes.textContent}`;
        const selectedHourContent = Number(this._hour.textContent);
        const selectedHour =
          selectedHourContent === 12 && format12 ? 0 : selectedHourContent;
        const selectedMinutes = Number(this._minutes.textContent);

        minTime = setMinTime(minTime, disablePast, format12);
        maxTime = setMaxTime(maxTime, disableFuture, format12);

        let [maxTimeHour, maxTimeMinutes, maxTimeFormat] = takeValue(
          maxTime,
          false
        );
        let [minTimeHour, minTimeMinutes, minTimeFormat] = takeValue(
          minTime,
          false
        );

        minTimeHour = minTimeHour === "12" && format12 ? "00" : minTimeHour;
        maxTimeHour = maxTimeHour === "12" && format12 ? "00" : maxTimeHour;

        const isHourLessThanMinHour = selectedHour < Number(minTimeHour);
        const isHourGreaterThanMaxHour = selectedHour > Number(maxTimeHour);
        let maxFormatAndCurrentFormatEqual = true;
        if (hourModeActive) {
          maxFormatAndCurrentFormatEqual =
            maxTimeFormat === hourModeActive.textContent;
        }

        let minFormatAndCurrentFormatEqual = true;
        if (hourModeActive) {
          minFormatAndCurrentFormatEqual =
            minTimeFormat === hourModeActive.textContent;
        }

        const hourEqualToMaxAndMinutesGreaterThanMax =
          selectedMinutes > maxTimeMinutes &&
          selectedHour === Number(maxTimeHour);
        const hourEqualToMinAndMinutesLessThanMin =
          selectedMinutes < minTimeMinutes &&
          selectedHour === Number(minTimeHour);

        this.input.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
        Manipulator.addStyle(this.elementToggle, {
          pointerEvents: "auto",
        });

        if (maxTime !== "") {
          if (
            maxFormatAndCurrentFormatEqual &&
            (isHourGreaterThanMaxHour || hourEqualToMaxAndMinutesGreaterThanMax)
          ) {
            return;
          } else if (
            maxTimeFormat === "AM" &&
            hourModeActive.textContent === "PM"
          ) {
            return;
          }
        }
        if (minTime !== "") {
          if (
            minFormatAndCurrentFormatEqual &&
            (isHourLessThanMinHour || hourEqualToMinAndMinutesLessThanMin)
          ) {
            return;
          }
          if (minTimeFormat === "PM" && hourModeActive.textContent === "AM") {
            return;
          }
        }

        if (
          checkValueBeforeAccept(
            this._options,
            this.input,
            this._hour.textContent
          ) === undefined
        ) {
          return;
        }

        if (this._isInvalidTimeFormat) {
          this.input.removeAttribute(ATTR_TIMEPICKER_IS_INVALID);
        }

        if (!readOnly && focusInputAfterApprove) {
          this.input.focus();
        }

        Manipulator.addStyle(this.elementToggle, {
          pointerEvents: "auto",
        });

        if (format24) {
          this.input.value = currentValue;
        } else if (hourModeActive === null) {
          this.input.value = `${currentValue} PM`;
        } else {
          this.input.value = `${currentValue} ${hourModeActive.textContent}`;
        }

        if (this._animations) {
          this._toggleBackdropAnimation(true);
        }

        this._removeModal();

        EventHandler.trigger(this.input, "input.te.timepicker");
        EventHandler.trigger(this.input, "input");
      }
    );
  }

  _handleHoverInlineBtn() {
    EventHandlerMulti.on(
      this._modal,
      "mouseover mouseleave",
      `[${ATTR_TIMEPICKER_CURRENT_INLINE}]`,
      ({ type, target }) => {
        const allIconsInlineHour = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_ICON_INLINE_HOUR}]`,
          this._modal
        );
        const allIconsInlineMinute = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_ICON_INLINE_MINUTE}]`,
          this._modal
        );

        const modifyIcons = (elements, shouldAdd) => {
          return elements.forEach((icon) => {
            if (shouldAdd) {
              Manipulator.addClass(icon, this._classes.opacity);
              icon.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
              return;
            }

            Manipulator.removeClass(icon, this._classes.opacity);
            icon.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
          });
        };

        const pickerHasHourAttr = target.hasAttribute(ATTR_TIMEPICKER_HOUR);
        const iconElements = pickerHasHourAttr
          ? allIconsInlineHour
          : allIconsInlineMinute;

        modifyIcons(iconElements, type === "mouseover");
      }
    );
  }

  _handleDocumentClickInline() {
    EventHandler.on(document, EVENT_CLICK_DATA_API, ({ target }) => {
      if (
        this._modal &&
        !this._modal.contains(target) &&
        !target.hasAttribute(ATTR_TIMEPICKER_ICON)
      ) {
        clearInterval(this._interval);
        Manipulator.addStyle(this.elementToggle, {
          pointerEvents: "auto",
        });
        this._removeModal();

        if (!this._animations) return;

        this._toggleBackdropAnimation(true);
      }
    });
  }

  _handleSwitchHourMinute() {
    toggleClassHandler(
      "click",
      SELECTOR_ATTR_TIMEPICKER_CURRENT,
      this._classes
    );

    EventHandler.on(
      this._modal,
      "click",
      SELECTOR_ATTR_TIMEPICKER_CURRENT,
      () => {
        const { format24 } = this._options;
        const current = SelectorEngine.find(
          SELECTOR_ATTR_TIMEPICKER_CURRENT,
          this._modal
        );
        const allTipsMinutes = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`,
          this._modal
        );
        const allTipsHours = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
          this._modal
        );
        const allInnerTips = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_INNER_HOURS}]`,
          this._modal
        );
        const hourValue = Number(this._hour.textContent);
        const minuteValue = Number(this._minutes.textContent);

        const switchTips = (array, classes) => {
          allTipsHours.forEach((tip) => tip.remove());
          allTipsMinutes.forEach((tip) => tip.remove());
          Manipulator.addClass(this._hand, this._classes.transform);

          setTimeout(() => {
            Manipulator.removeClass(this._hand, this._classes.transform);
          }, 401);

          this._getAppendClock(array, `[${ATTR_TIMEPICKER_CLOCK}]`, classes);

          const toggleActiveClass = () => {
            const allTipsHours = SelectorEngine.find(
              `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
              this._modal
            );
            const allTipsMinutes = SelectorEngine.find(
              `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`,
              this._modal
            );

            this._addActiveClassToTip(allTipsHours, hourValue);
            this._addActiveClassToTip(allTipsMinutes, minuteValue);
          };

          if (!format24) {
            setTimeout(() => {
              toggleActiveClass();
            }, 401);
          } else {
            const allTipsInnerHours = SelectorEngine.find(
              `[${ATTR_TIMEPICKER_INNER_HOURS}]`,
              this._modal
            );

            setTimeout(() => {
              this._addActiveClassToTip(allTipsInnerHours, hourValue);
              toggleActiveClass();
            }, 401);
          }
        };

        current.forEach((e) => {
          if (e.hasAttribute(ATTR_TIMEPICKER_ACTIVE)) {
            if (e.hasAttribute(ATTR_TIMEPICKER_MINUTE)) {
              Manipulator.addClass(this._hand, this._classes.transform);

              Manipulator.addStyle(this._hand, {
                transform: `rotateZ(${this._minutes.textContent * 6}deg)`,
                height: "calc(40% + 1px)",
              });

              if (format24 && allInnerTips.length > 0) {
                allInnerTips.forEach((innerTip) => innerTip.remove());
              }
              switchTips(
                this.minutesArray,
                ATTR_TIMEPICKER_TIPS_MINUTES,
                allTipsMinutes
              );
              this._hour.style.pointerEvents = "";
              this._minutes.style.pointerEvents = "none";
            } else if (e.hasAttribute(ATTR_TIMEPICKER_HOUR)) {
              Manipulator.addStyle(this._hand, {
                transform: `rotateZ(${this._hour.textContent * 30}deg)`,
              });

              if (Number(this._hour.textContent) > 12) {
                Manipulator.addStyle(this._hand, {
                  transform: `rotateZ(${this._hour.textContent * 30 - 360}deg)`,
                  height: "21.5%",
                });

                if (Number(this._hour.textContent) > 12) {
                  Manipulator.addStyle(this._hand, {
                    height: "21.5%",
                  });
                }
              } else {
                Manipulator.addStyle(this._hand, {
                  height: "calc(40% + 1px)",
                });
              }

              if (format24) {
                this._getAppendClock(
                  this.innerHours,
                  `[${ATTR_TIMEPICKER_CLOCK_INNER}]`,
                  ATTR_TIMEPICKER_INNER_HOURS
                );
              }

              if (allInnerTips.length > 0) {
                allInnerTips.forEach((innerTip) => innerTip.remove());
              }

              switchTips(
                this.hoursArray,
                ATTR_TIMEPICKER_TIPS_HOURS,
                allTipsHours
              );

              Manipulator.addStyle(this._hour, {
                pointerEvents: "none",
              });
              Manipulator.addStyle(this._minutes, {
                pointerEvents: "",
              });
            }
          }
        });
      }
    );
  }

  _handleDisablingTipsMaxTime(
    selectedFormat,
    maxTimeFormat,
    maxTimeMinutes,
    maxTimeHour
  ) {
    if (!this._options.maxTime && !this._options.disableFuture) {
      return;
    }

    const outerHoursTips = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_TIPS_HOURS}]`
    );
    const innerHoursTips = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_INNER_HOURS}]`
    );
    const allTipsMinutes = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`
    );

    if (!maxTimeFormat || maxTimeFormat === selectedFormat) {
      _verifyMaxTimeHourAndAddDisabledClass(
        innerHoursTips,
        maxTimeHour,
        this._classes,
        this._options.format12
      );
      _verifyMaxTimeHourAndAddDisabledClass(
        outerHoursTips,
        maxTimeHour,
        this._classes,
        this._options.format12
      );
      _verifyMaxTimeMinutesTipsAndAddDisabledClass(
        allTipsMinutes,
        maxTimeMinutes,
        maxTimeHour,
        this._hour.textContent,
        this._classes,
        this._options.format12
      );
      return;
    }
    if (maxTimeFormat === "AM" && selectedFormat === "PM") {
      outerHoursTips.forEach((tip) => {
        Manipulator.addClass(tip, this._classes.tipsDisabled);
        tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
      });
      allTipsMinutes.forEach((tip) => {
        Manipulator.addClass(tip, this._classes.tipsDisabled);
        tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
      });
    }
  }

  _handleDisablingTipsMinTime(
    selectedFormat,
    minTimeFormat,
    minTimeMinutes,
    minTimeHour
  ) {
    if (!this._options.minTime && !this._options.disablePast) {
      return;
    }

    const outerHoursTips = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_TIPS_HOURS}]`
    );
    const innerHoursTips = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_INNER_HOURS}]`
    );
    const allTipsMinutes = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`
    );

    if (!minTimeFormat || minTimeFormat === selectedFormat) {
      _verifyMinTimeHourAndAddDisabledClass(
        outerHoursTips,
        minTimeHour,
        this._classes,
        this._options.format12
      );
      _verifyMinTimeHourAndAddDisabledClass(
        innerHoursTips,
        minTimeHour,
        this._classes,
        this._options.format12
      );
      _verifyMinTimeMinutesTipsAndAddDisabledClass(
        allTipsMinutes,
        minTimeMinutes,
        minTimeHour,
        this._hour.textContent,
        this._classes,
        this._options.format12
      );
    } else if (minTimeFormat === "PM" && selectedFormat === "AM") {
      outerHoursTips.forEach((tip) => {
        Manipulator.addClass(tip, this._classes.tipsDisabled);
        tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
      });
      allTipsMinutes.forEach((tip) => {
        Manipulator.addClass(tip, this._classes.tipsDisabled);
        tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
      });
    }
  }

  _toggleAmPm = (enabled) => {
    if (enabled === "PM") {
      this._isPmEnabled = true;
      this._isAmEnabled = false;
    } else if (enabled === "AM") {
      this._isPmEnabled = false;
      this._isAmEnabled = true;
    }
  };

  _handleSwitchTimeMode() {
    EventHandler.on(
      document,
      "click",
      SELECTOR_ATTR_TIMEPICKER_HOUR_MODE,
      ({ target }) => {
        let { maxTime, minTime } = this._options;
        const { disablePast, disableFuture, format12 } = this._options;

        minTime = setMinTime(minTime, disablePast, format12);
        maxTime = setMaxTime(maxTime, disableFuture, format12);

        const [maxTimeHour, maxTimeMinutes, maxTimeFormat] = takeValue(
          maxTime,
          false
        );
        const [minTimeHour, minTimeMinutes, minTimeFormat] = takeValue(
          minTime,
          false
        );

        const allTipsHour = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_TIPS_HOURS}]`
        );
        const allTipsMinutes = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`
        );

        const clearDisabledClassForAllTips = () => {
          allTipsHour.forEach((tip) => {
            Manipulator.removeClass(tip, this._classes.tipsDisabled);
            tip.removeAttribute(ATTR_TIMEPICKER_DISABLED);
          });

          allTipsMinutes.forEach((tip) => {
            Manipulator.removeClass(tip, this._classes.tipsDisabled);
            tip.removeAttribute(ATTR_TIMEPICKER_DISABLED);
          });
        };

        clearDisabledClassForAllTips();
        this._handleDisablingTipsMinTime(
          target.textContent,
          minTimeFormat,
          minTimeMinutes,
          minTimeHour
        );
        this._handleDisablingTipsMaxTime(
          target.textContent,
          maxTimeFormat,
          maxTimeMinutes,
          maxTimeHour
        );
        this._toggleAmPm(target.textContent);
        if (!target.hasAttribute(ATTR_TIMEPICKER_ACTIVE)) {
          const allHoursMode = SelectorEngine.find(
            SELECTOR_ATTR_TIMEPICKER_HOUR_MODE
          );

          allHoursMode.forEach((element) => {
            if (element.hasAttribute(ATTR_TIMEPICKER_ACTIVE)) {
              Manipulator.removeClass(element, this._classes.opacity);
              element.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
            }
          });

          Manipulator.addClass(target, this._classes.opacity);
          target.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
        }
      }
    );
  }

  _handleClockClick() {
    let { maxTime, minTime } = this._options;
    const { disablePast, disableFuture, format12 } = this._options;

    minTime = setMinTime(minTime, disablePast, format12);
    maxTime = setMaxTime(maxTime, disableFuture, format12);

    const maxTimeFormat = takeValue(maxTime, false)[2];
    const minTimeFormat = takeValue(minTime, false)[2];

    const maxTimeHour = takeValue(maxTime, false)[0];
    const minTimeHour = takeValue(minTime, false)[0];

    const clockWrapper = SelectorEngine.findOne(
      `[${ATTR_TIMEPICKER_CLOCK_WRAPPER}]`
    );
    EventHandlerMulti.on(
      document,
      `${EVENT_MOUSEDOWN_DATA_API} ${EVENT_MOUSEUP_DATA_API} ${EVENT_MOUSEMOVE_DATA_API} ${EVENT_MOUSELEAVE_DATA_API} ${EVENT_MOUSEOVER_DATA_API} ${EVENT_TOUCHSTART_DATA_API} ${EVENT_TOUCHMOVE_DATA_API} ${EVENT_TOUCHEND_DATA_API}`,
      "",
      (e) => {
        if (!checkBrowser()) {
          e.preventDefault();
        }

        const { type, target } = e;
        const { closeModalOnMinutesClick, switchHoursToMinutesOnClick } =
          this._options;
        const minutes =
          SelectorEngine.findOne(
            `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`,
            this._modal
          ) !== null;
        const hours =
          SelectorEngine.findOne(
            `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
            this._modal
          ) !== null;
        const innerHours =
          SelectorEngine.findOne(
            `[${ATTR_TIMEPICKER_INNER_HOURS}]`,
            this._modal
          ) !== null;

        const allTipsMinutes = SelectorEngine.find(
          `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`,
          this._modal
        );

        const mouseClick = findMousePosition(e, clockWrapper);
        const radius = clockWrapper.offsetWidth / 2;

        let rds = Math.atan2(mouseClick.y - radius, mouseClick.x - radius);
        if (checkBrowser()) {
          const touchClick = findMousePosition(e, clockWrapper, true);
          rds = Math.atan2(touchClick.y - radius, touchClick.x - radius);
        }

        let xPos = null;
        let yPos = null;
        let elFromPoint = null;

        if (
          type === "mousedown" ||
          type === "mousemove" ||
          type === "touchmove" ||
          type === "touchstart"
        ) {
          if (
            type === "mousedown" ||
            type === "touchstart" ||
            type === "touchmove"
          ) {
            if (
              this._hasTargetInnerClass(target) ||
              target.hasAttribute(ATTR_TIMEPICKER_CLOCK_WRAPPER) ||
              target.hasAttribute(ATTR_TIMEPICKER_CLOCK) ||
              target.hasAttribute(ATTR_TIMEPICKER_TIPS_MINUTES) ||
              target.hasAttribute(ATTR_TIMEPICKER_TIPS_HOURS) ||
              target.hasAttribute(ATTR_TIMEPICKER_CIRCLE) ||
              target.hasAttribute(ATTR_TIMEPICKER_HAND_POINTER) ||
              target.hasAttribute(ATTR_TIMEPICKER_MIDDLE_DOT) ||
              target.hasAttribute(ATTR_TIMEPICKER_TIPS_ELEMENT)
            ) {
              this._isMouseMove = true;

              if (checkBrowser() && e.touches) {
                xPos = e.touches[0].clientX;
                yPos = e.touches[0].clientY;
                elFromPoint = document.elementFromPoint(xPos, yPos);
              }
            }
          }
        } else if (type === "mouseup" || type === "touchend") {
          this._isMouseMove = false;

          if (
            this._hasTargetInnerClass(target) ||
            target.hasAttribute(ATTR_TIMEPICKER_CLOCK) ||
            target.hasAttribute(ATTR_TIMEPICKER_TIPS_HOURS) ||
            target.hasAttribute(ATTR_TIMEPICKER_CIRCLE) ||
            target.hasAttribute(ATTR_TIMEPICKER_HAND_POINTER) ||
            target.hasAttribute(ATTR_TIMEPICKER_MIDDLE_DOT) ||
            target.hasAttribute(ATTR_TIMEPICKER_TIPS_ELEMENT)
          ) {
            if ((hours || innerHours) && switchHoursToMinutesOnClick) {
              const isHourlessThanMinOrGreaterThanMax =
                Number(this._hour.textContent) > maxTimeHour ||
                Number(this._hour.textContent) < minTimeHour;
              if (
                this._options.format24 &&
                maxTimeHour !== "" &&
                minTimeHour !== "" &&
                isHourlessThanMinOrGreaterThanMax
              ) {
                return;
              } else if (
                this._options.format24 &&
                minTimeHour !== "" &&
                Number(this._hour.textContent) < minTimeHour
              ) {
                return;
              }
            }
            EventHandler.trigger(this._minutes, "click");
          }

          if (minutes && closeModalOnMinutesClick) {
            const submitBtn = SelectorEngine.findOne(
              `[${ATTR_TIMEPICKER_BUTTON_SUBMIT}]`,
              this._modal
            );
            EventHandler.trigger(submitBtn, "click");
          }
        }

        if (minutes) {
          let minute;

          const degrees = Math.trunc((rds * 180) / Math.PI) + 90;

          const { degrees: minDegrees, minute: minTimeObj } =
            this._makeMinutesDegrees(degrees, minute);

          if (
            this._handlerMaxMinMinutesOptions(minDegrees, minTimeObj) ===
            undefined
          ) {
            return;
          }

          const { degrees: _degrees, minute: minuteTimes } =
            this._handlerMaxMinMinutesOptions(minDegrees, minTimeObj);

          if (this._isMouseMove) {
            Manipulator.addStyle(this._hand, {
              transform: `rotateZ(${_degrees}deg)`,
            });

            if (minuteTimes === undefined) {
              return;
            }

            const changeMinutes = () => {
              return minuteTimes >= 10 || minuteTimes === "00"
                ? minuteTimes
                : `0${minuteTimes}`;
            };

            this._minutes.textContent = changeMinutes();

            this._toggleClassActive(
              this.minutesArray,
              this._minutes,
              allTipsMinutes
            );
            this._toggleBackgroundColorCircle(
              `[${ATTR_TIMEPICKER_TIPS_MINUTES}]`
            );

            this._objWithDataOnChange.degreesMinutes = _degrees;
            this._objWithDataOnChange.minutes = minuteTimes;
          }
        }

        if (hours || innerHours) {
          let hour;

          let degrees = Math.trunc((rds * 180) / Math.PI) + 90;
          degrees = Math.round(degrees / 30) * 30;

          Manipulator.addStyle(this._circle, {
            backgroundColor: "#1976d2",
          });
          if (this._makeHourDegrees(target, degrees, hour) === undefined) {
            return;
          }
          const makeDegrees = () => {
            if (checkBrowser() && degrees && elFromPoint) {
              const { degrees: touchDegrees, hour: touchHours } =
                this._makeHourDegrees(elFromPoint, degrees, hour);

              return this._handleMoveHand(
                elFromPoint,
                touchHours,
                touchDegrees
              );
            } else {
              const { degrees: movedDegrees, hour: movedHours } =
                this._makeHourDegrees(target, degrees, hour);

              return this._handleMoveHand(target, movedHours, movedDegrees);
            }
          };

          this._objWithDataOnChange.degreesHours = degrees;

          if (
            this._handlerMaxMinHoursOptions(
              degrees,
              maxTimeHour,
              minTimeHour,
              maxTimeFormat,
              minTimeFormat,
              e
            )
          ) {
            makeDegrees();
          }
        }

        e.stopPropagation();
      }
    );
  }

  _hasTargetInnerClass(target) {
    return (
      target.hasAttribute(ATTR_TIMEPICKER_CLOCK_INNER) ||
      target.hasAttribute(ATTR_TIMEPICKER_INNER_HOURS) ||
      target.hasAttribute(ATTR_TIMEPICKER_TIPS_INNER_ELEMENT)
    );
  }

  _handleMoveHand(target, hour, degrees) {
    const allTipsHours = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_TIPS_HOURS}]`,
      this._modal
    );
    const allTipsInner = SelectorEngine.find(
      `[${ATTR_TIMEPICKER_INNER_HOURS}]`,
      this._modal
    );

    if (!this._isMouseMove) return;

    if (this._hasTargetInnerClass(target)) {
      Manipulator.addStyle(this._hand, {
        height: "21.5%",
      });
    } else {
      Manipulator.addStyle(this._hand, {
        height: "calc(40% + 1px)",
      });
    }

    Manipulator.addStyle(this._hand, {
      transform: `rotateZ(${degrees}deg)`,
    });

    this._hour.textContent = hour >= 10 || hour === "00" ? hour : `0${hour}`;

    this._toggleClassActive(this.hoursArray, this._hour, allTipsHours);
    this._toggleClassActive(this.innerHours, this._hour, allTipsInner);

    this._objWithDataOnChange.hour =
      hour >= 10 || hour === "00" ? hour : `0${hour}`;
  }

  _handlerMaxMinMinutesOptions(degrees, minute) {
    let { maxTime, minTime } = this._options;
    const { format12, increment, disablePast, disableFuture } = this._options;

    minTime = setMinTime(minTime, disablePast, format12);
    maxTime = setMaxTime(maxTime, disableFuture, format12);

    const maxMin = takeValue(maxTime, false)[1];
    const minMin = takeValue(minTime, false)[1];
    const maxHourTimeValue = takeValue(maxTime, false)[0];
    const minHourTimeValue = takeValue(minTime, false)[0];
    const minHourTime =
      minHourTimeValue === "12" && format12 ? "0" : minHourTimeValue;
    const maxHourTime =
      maxHourTimeValue === "12" && format12 ? "0" : maxHourTimeValue;

    const maxTimeFormat = takeValue(maxTime, false)[2];
    const minTimeFormat = takeValue(minTime, false)[2];

    const maxMinDegrees = maxMin !== "" ? maxMin * 6 : "";
    const minMinDegrees = minMin !== "" ? minMin * 6 : "";

    const selectedHourContent = Number(this._hour.textContent);
    const selectedHour =
      selectedHourContent === 12 && format12 ? 0 : selectedHourContent;

    if (!maxTimeFormat && !minTimeFormat) {
      if (maxTime !== "" && minTime !== "") {
        if (
          (Number(maxHourTime) === selectedHour && degrees > maxMinDegrees) ||
          (Number(minHourTime) === selectedHour && degrees < minMinDegrees)
        ) {
          return degrees;
        }
      } else if (minTime !== "" && selectedHour <= Number(minHourTime)) {
        if (degrees <= minMinDegrees - 6) {
          return degrees;
        }
      } else if (maxTime !== "" && selectedHour >= Number(maxHourTime)) {
        if (degrees >= maxMinDegrees + 6) {
          return degrees;
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (minTime !== "") {
        if (minTimeFormat === "PM" && this._isAmEnabled) {
          return;
        }

        if (minTimeFormat === "PM" && this._isPmEnabled) {
          if (selectedHour < Number(minHourTime)) {
            return;
          }

          if (selectedHour <= Number(minHourTime)) {
            if (degrees <= minMinDegrees - 6) {
              return degrees;
            }
          }
        } else if (minTimeFormat === "AM" && this._isAmEnabled) {
          if (selectedHour < Number(minHourTime)) {
            return;
          }

          if (selectedHour <= Number(minHourTime)) {
            if (degrees <= minMinDegrees - 6) {
              return degrees;
            }
          }
        }
      }
      if (maxTime !== "") {
        if (maxTimeFormat === "AM" && this._isPmEnabled) {
          return;
        }

        if (maxTimeFormat === "PM" && this._isPmEnabled) {
          if (selectedHour >= Number(maxHourTime)) {
            if (degrees >= maxMinDegrees + 6) {
              return degrees;
            }
          }
        } else if (maxTimeFormat === "AM" && this._isAmEnabled) {
          if (selectedHour >= Number(maxHourTime)) {
            if (degrees >= maxMinDegrees + 6) {
              return degrees;
            }
          }
        }
      }
    }

    if (increment) {
      degrees = Math.round(degrees / 30) * 30;
    }

    if (degrees < 0) {
      degrees = 360 + degrees;
    } else if (degrees >= 360) {
      degrees = 0;
    }

    return {
      degrees,
      minute,
    };
  }

  _removeModal() {
    if (this._animations) {
      setTimeout(() => {
        this._removeModalElements();
        this._scrollBar.reset();
      }, 300);
    } else {
      this._removeModalElements();
      this._scrollBar.reset();
    }

    EventHandlerMulti.off(
      this._document,
      `${EVENT_CLICK_DATA_API} ${EVENT_KEYDOWN_DATA_API} ${EVENT_MOUSEDOWN_DATA_API} ${EVENT_MOUSEUP_DATA_API} ${EVENT_MOUSEMOVE_DATA_API} ${EVENT_MOUSELEAVE_DATA_API} ${EVENT_MOUSEOVER_DATA_API} ${EVENT_TOUCHSTART_DATA_API} ${EVENT_TOUCHMOVE_DATA_API} ${EVENT_TOUCHEND_DATA_API}`
    );
    EventHandler.off(window, EVENT_KEYDOWN_DATA_API);
  }

  _removeModalElements() {
    if (this._modal) this._modal.remove();
  }

  _toggleBackdropAnimation(isToRemove = false) {
    if (isToRemove) {
      this._wrapper.classList.add("animate-[fade-out_350ms_ease-in-out]");
    } else {
      this._wrapper.classList.add("animate-[fade-in_350ms_ease-in-out]");

      if (!this._options.inline)
        Manipulator.addClass(this._clock, this._classes.clockAnimation);
    }

    setTimeout(() => {
      this._wrapper.classList.remove(
        "animate-[fade-out_350ms_ease-in-out]",
        "animate-[fade-in_350ms_ease-in-out]"
      );
    }, 351);
  }

  _toggleBackgroundColorCircle = (classes) => {
    const tips =
      this._modal.querySelector(`${classes}[${ATTR_TIMEPICKER_ACTIVE}]`) !==
      null;
    if (tips) {
      Manipulator.addStyle(this._circle, {
        backgroundColor: "#1976d2",
      });

      return;
    }

    Manipulator.addStyle(this._circle, {
      backgroundColor: "transparent",
    });
  };

  _toggleClassActive = (array, { textContent }, tips) => {
    const findInArray = [...array].find(
      (e) => Number(e) === Number(textContent)
    );

    return tips.forEach((e) => {
      if (e.hasAttribute(ATTR_TIMEPICKER_DISABLED)) return;

      if (e.textContent === findInArray) {
        Manipulator.addClass(e, this._classes.tipsActive);
        e.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
        return;
      }

      Manipulator.removeClass(e, this._classes.tipsActive);
      e.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
    });
  };

  _addActiveClassToTip(tips, value) {
    tips.forEach((tip) => {
      if (Number(tip.textContent) === Number(value)) {
        Manipulator.addClass(tip, this._classes.tipsActive);
        tip.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
      }
    });
  }

  _makeMinutesDegrees = (degrees, minute) => {
    const { increment } = this._options;

    if (degrees < 0) {
      minute = Math.round(360 + degrees / 6) % 60;
      degrees = 360 + Math.round(degrees / 6) * 6;
    } else {
      minute = Math.round(degrees / 6) % 60;
      degrees = Math.round(degrees / 6) * 6;
    }

    if (increment) {
      degrees = Math.round(degrees / 30) * 30;
      minute = (Math.round(degrees / 6) * 6) / 6;

      if (minute === 60) {
        minute = "00";
      }
    }

    if (degrees >= 360) {
      degrees = 0;
    }

    return {
      degrees,
      minute,
      addDegrees: increment ? 30 : 6,
    };
  };

  _makeHourDegrees = (target, degrees, hour) => {
    if (!target) {
      return;
    }
    if (this._hasTargetInnerClass(target)) {
      if (degrees < 0) {
        hour = Math.round(360 + degrees / 30) % 24;
        degrees = 360 + degrees;
      } else {
        hour = Math.round(degrees / 30) + 12;
        if (hour === 12) {
          hour = "00";
        }
      }
    } else if (degrees < 0) {
      hour = Math.round(360 + degrees / 30) % 12;
      degrees = 360 + degrees;
    } else {
      hour = Math.round(degrees / 30) % 12;
      if (hour === 0 || hour > 12) {
        hour = 12;
      }
    }

    if (degrees >= 360) {
      degrees = 0;
    }

    return {
      degrees,
      hour,
      addDegrees: 30,
    };
  };

  _makeInnerHoursDegrees = (degrees, hour) => {
    if (degrees < 0) {
      hour = Math.round(360 + degrees / 30) % 24;
      degrees = 360 + degrees;
    } else {
      hour = Math.round(degrees / 30) + 12;
      if (hour === 12) {
        hour = "00";
      }
    }

    return {
      degrees,
      hour,
      addDegrees: 30,
    };
  };

  _setHourOrMinute(number) {
    return number < 10 ? `0${number}` : number;
  }

  _appendTimes() {
    const { format24 } = this._options;

    if (format24) {
      this._getAppendClock(
        this.hoursArray,
        `[${ATTR_TIMEPICKER_CLOCK}]`,
        ATTR_TIMEPICKER_TIPS_HOURS
      );
      this._getAppendClock(
        this.innerHours,
        `[${ATTR_TIMEPICKER_CLOCK_INNER}]`,
        ATTR_TIMEPICKER_INNER_HOURS
      );

      return;
    }

    this._getAppendClock(
      this.hoursArray,
      `[${ATTR_TIMEPICKER_CLOCK}]`,
      ATTR_TIMEPICKER_TIPS_HOURS
    );
  }

  _getAppendClock = (
    array = [],
    clockClass = `[${ATTR_TIMEPICKER_CLOCK}]`,
    tipsClass
  ) => {
    let { minTime, maxTime } = this._options;
    const { inline, format12, disablePast, disableFuture } = this._options;

    minTime = setMinTime(minTime, disablePast, format12);
    maxTime = setMaxTime(maxTime, disableFuture, format12);

    const [maxTimeHour, maxTimeMinutes, maxTimeFormat] = takeValue(
      maxTime,
      false
    );
    const [minTimeHour, minTimeMinutes, minTimeFormat] = takeValue(
      minTime,
      false
    );

    // fix for append clock for max/min if input has invalid  value
    if (
      !inline &&
      format12 &&
      this._isInvalidTimeFormat &&
      !this._AM.hasAttribute(ATTR_TIMEPICKER_ACTIVE)
    ) {
      Manipulator.addClass(this._PM, this._classes.opacity);
      this._PM.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
    }

    const clock = SelectorEngine.findOne(clockClass);

    const elements = 360 / array.length;

    function rad(el) {
      return el * (Math.PI / 180);
    }

    if (clock === null) return;

    const clockWidth = (clock.offsetWidth - 32) / 2;
    const clockHeight = (clock.offsetHeight - 32) / 2;
    const radius = clockWidth - 4;

    setTimeout(() => {
      let currentFormat;
      if (format12) {
        currentFormat = SelectorEngine.findOne(
          `${SELECTOR_ATTR_TIMEPICKER_HOUR_MODE}[${ATTR_TIMEPICKER_ACTIVE}]`
        ).textContent;
      }
      this._handleDisablingTipsMinTime(
        currentFormat,
        minTimeFormat,
        minTimeMinutes,
        minTimeHour
      );
      this._handleDisablingTipsMaxTime(
        currentFormat,
        maxTimeFormat,
        maxTimeMinutes,
        maxTimeHour
      );
    }, 0);

    [...array].forEach((e, i) => {
      const angle = rad(i * elements);

      const span = element("span");
      const spanToTips = element("span");

      spanToTips.innerHTML = e;
      Manipulator.addClass(span, this._classes.tips);
      span.setAttribute(tipsClass, "");

      const itemWidth = span.offsetWidth;
      const itemHeight = span.offsetHeight;

      Manipulator.addStyle(span, {
        left: `${clockWidth + Math.sin(angle) * radius - itemWidth}px`,
        bottom: `${clockHeight + Math.cos(angle) * radius - itemHeight}px`,
      });

      if (array.includes("05")) {
        span.setAttribute(ATTR_TIMEPICKER_TIPS_MINUTES, "");
      }

      if (array.includes("13")) {
        spanToTips.setAttribute(ATTR_TIMEPICKER_TIPS_INNER_ELEMENT, "");
      } else {
        spanToTips.setAttribute(ATTR_TIMEPICKER_TIPS_ELEMENT, "");
      }

      span.appendChild(spanToTips);
      return clock.appendChild(span);
    });
  };

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

  _getContainer() {
    return SelectorEngine.findOne(this._options.container);
  }

  _getValidate(event) {
    const { format24, format12, appendValidationInfo } = this._options;

    EventHandlerMulti.on(this.input, event, ({ target }) => {
      if (this._options === null || this.input.value === "") return;

      const regexAMFormat = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
      const regexNormalFormat = /^([01]\d|2[0-3])(:[0-5]\d)$/;
      const testedAMRegex = regexAMFormat.test(target.value);
      const testedNormalRegex = regexNormalFormat.test(target.value);

      if (
        (testedNormalRegex !== true && format24) ||
        (testedAMRegex !== true && format12)
      ) {
        if (appendValidationInfo) {
          this.input.setAttribute(ATTR_TIMEPICKER_IS_INVALID, "");
        }

        Manipulator.addStyle(target, { marginBottom: 0 });

        this._isInvalidTimeFormat = true;
        return;
      }

      this.input.removeAttribute(ATTR_TIMEPICKER_IS_INVALID);
      this._isInvalidTimeFormat = false;
      const allInvalid = SelectorEngine.findOne(
        `[${ATTR_TIMEPICKER_INVALID_FEEDBACK}]`
      );

      if (allInvalid === null) return;

      allInvalid.remove();
    });
  }

  // Static
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

export default Timepicker;
