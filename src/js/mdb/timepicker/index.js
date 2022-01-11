/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
import { createPopper } from '@popperjs/core';
import { typeCheckConfig, element, getUID } from '../util/index';
import { getTimepickerTemplate, getToggleButtonTemplate } from './templates';
import Data from '../dom/data';
import Manipulator from '../dom/manipulator';
import EventHandler, { EventHandlerMulti } from '../dom/event-handler';
import {
  formatToAmPm,
  toggleClassHandler,
  checkBrowser,
  findMousePosition,
  takeValue,
} from './utils';
import FocusTrap from '../util/focusTrap';
import SelectorEngine from '../dom/selector-engine';
import { UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, ESCAPE, ENTER } from '../util/keycodes';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'timepicker';

const DATA_KEY = `mdb.${NAME}`;

const ACTIVE_CLASS = 'active';
const AM_CLASS = `${NAME}-am`;
const BUTTON_CANCEL_CLASS = `${NAME}-cancel`;
const BUTTON_CLEAR_CLASS = `${NAME}-clear`;
const BUTTON_SUBMIT_CLASS = `${NAME}-submit`;
const CIRCLE_CLASS = `${NAME}-circle`;
const CLOCK_ANIMATION_CLASS = `${NAME}-clock-animation`;
const CLOCK_CLASS = `${NAME}-clock`;
const CLOCK_INNER_CLASS = `${NAME}-clock-inner`;
const CLOCK_WRAPPER_CLASS = `${NAME}-clock-wrapper`;
const CURRENT_CLASS = `.${NAME}-current`;
const CURRENT_INLINE_CLASS = `${NAME}-current-inline`;
const WRAPPER_OPEN_ANIMATION_CLASS = 'fade-in';
const WRAPPER_CLOSE_ANIMATION_CLASS = 'fade-out';

const HAND_CLASS = `${NAME}-hand-pointer`;
const HOUR_CLASS = `${NAME}-hour`;
const HOUR_MODE_CLASS = `${NAME}-hour-mode`;
const ICON_DOWN_CLASS = `${NAME}-icon-down`;
const ICON_INLINE_HOUR_CLASS = `${NAME}-icon-inline-hour`;
const ICON_INLINE_MINUTE_CLASS = `${NAME}-icon-inline-minute`;
const ICON_UP_CLASS = `${NAME}-icon-up`;
const ICONS_HOUR_INLINE = `${NAME}-inline-hour-icons`;
const MIDDLE_DOT_CLASS = `${NAME}-middle-dot`;
const MINUTE_CLASS = `${NAME}-minute`;
const MODAL_CLASS = `${NAME}-modal`;
const PM_CLASS = `${NAME}-pm`;
const TIPS_ELEMENT_CLASS = `${NAME}-tips-element`;
const TIPS_HOURS_CLASS = `${NAME}-time-tips-hours`;
const TIPS_INNER_ELEMENT_CLASS = `${NAME}-tips-inner-element`;
const TIPS_INNER_HOURS_CLASS = `${NAME}-time-tips-inner`;
const TIPS_MINUTES_CLASS = `${NAME}-time-tips-minutes`;
const TRANSFORM_CLASS = `${NAME}-transform`;
const WRAPPER_CLASS = `${NAME}-wrapper`;
const INPUT_CLASS = `${NAME}-input`;

const Default = {
  appendValidationInfo: true,
  bodyID: '',
  cancelLabel: 'Cancel',
  clearLabel: 'Clear',
  closeModalOnBackdropClick: true,
  closeModalOnMinutesClick: false,
  defaultTime: '',
  disabled: false,
  focusInputAfterApprove: false,
  footerID: '',
  format12: true,
  headID: '',
  increment: false,
  invalidLabel: 'Invalid Time Format',
  maxHour: '',
  minHour: '',
  maxTime: '',
  minTime: '',
  modalID: '',
  okLabel: 'Ok',
  overflowHidden: true,
  pickerID: '',
  readOnly: false,
  showClearBtn: true,
  switchHoursToMinutesOnClick: true,
  iconClass: 'far fa-clock fa-sm timepicker-icon',
  withIcon: true,
  pmLabel: 'PM',
  amLabel: 'AM',
};

const DefaultType = {
  appendValidationInfo: 'boolean',
  bodyID: 'string',
  cancelLabel: 'string',
  clearLabel: 'string',
  closeModalOnBackdropClick: 'boolean',
  closeModalOnMinutesClick: 'boolean',
  disabled: 'boolean',
  footerID: 'string',
  format12: 'boolean',
  headID: 'string',
  increment: 'boolean',
  invalidLabel: 'string',
  maxHour: '(string|number)',
  minHour: '(string|number)',
  modalID: 'string',
  okLabel: 'string',
  overflowHidden: 'boolean',
  pickerID: 'string',
  readOnly: 'boolean',
  showClearBtn: 'boolean',
  switchHoursToMinutesOnClick: 'boolean',
  defaultTime: '(string|date|number)',
  iconClass: 'string',
  withIcon: 'boolean',
  pmLabel: 'string',
  amLabel: 'string',
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Timepicker {
  constructor(element, options = {}) {
    this._element = element;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._document = document;
    this._options = this._getConfig(options);
    this._currentTime = null;
    this._toggleButtonId = getUID('timepicker-toggle-');

    this.hoursArray = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    this.innerHours = ['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    this.minutesArray = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

    this.input = SelectorEngine.findOne('input', this._element);
    this.dataWithIcon = element.dataset.withIcon;
    this.dataToggle = element.dataset.toggle;
    this.customIcon = SelectorEngine.findOne('.timepicker-toggle-button', this._element);

    this._checkToggleButton();

    this.inputFormatShow = SelectorEngine.findOne('[data-mdb-timepicker-format24]', this._element);

    this.inputFormat =
      this.inputFormatShow === null ? '' : Object.values(this.inputFormatShow.dataset)[0];
    this.elementToggle = SelectorEngine.findOne('[data-mdb-toggle]', this._element);
    this.toggleElement = Object.values(element.querySelector('[data-mdb-toggle]').dataset)[0];

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

    this._inputValue =
      this._options.defaultTime !== '' ? this._options.defaultTime : this.input.value;

    if (this._options.format12) {
      this._currentTime = formatToAmPm(this._inputValue);
    }

    if (this._options.readOnly) {
      this.input.setAttribute('readonly', true);
    }

    this.init();

    this._isHours = true;
    this._isMinutes = false;
    this._isInvalidTimeFormat = false;
    this._isMouseMove = false;
    this._isInner = false;
    this._isAmEnabled = false;
    this._isPmEnabled = false;

    this._objWithDataOnChange = { degrees: null };
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  init() {
    let zero;
    let hoursFormat;
    let _amOrPm;

    Manipulator.addClass(this.input, INPUT_CLASS);

    if (this._currentTime !== undefined) {
      const { hours, minutes, amOrPm } = this._currentTime;

      zero = Number(hours) < 10 ? 0 : '';
      hoursFormat = `${zero}${Number(hours)}:${minutes}`;
      _amOrPm = amOrPm;

      this.input.value = `${hoursFormat} ${_amOrPm}`;
    } else {
      zero = '';
      hoursFormat = '';
      _amOrPm = '';

      this.input.value = '';
    }

    if (this.input.value.length > 0 && this.input.value !== '') {
      Manipulator.addClass(this.input, 'active');
    }

    if (this._options !== null || this._element !== null) {
      this._handleOpen();
      this._listenToToggleKeydown();
    }
  }

  dispose() {
    this._removeModal();

    if (this._element !== null) {
      Data.removeData(this._element, DATA_KEY);
    }

    this._element = null;
    this._options = null;
    this.input = null;
    this._focusTrap = null;

    EventHandler.off(this._document, 'click', `[data-mdb-toggle='${this.toggleElement}']`);
    EventHandler.off(this._element, 'keydown', `[data-mdb-toggle='${this.toggleElement}']`);
  }

  // private

  _checkToggleButton() {
    if (this.customIcon === null) {
      if (this.dataWithIcon !== undefined) {
        this._options.withIcon = null;

        if (this.dataWithIcon === 'true') {
          this._appendToggleButton(this._options);
        }
      }

      if (this._options.withIcon) {
        this._appendToggleButton(this._options);
      }
    }
  }

  _appendToggleButton() {
    const toggleButton = getToggleButtonTemplate(this._options, this._toggleButtonId);

    this.input.insertAdjacentHTML('afterend', toggleButton);
  }

  _getDomElements() {
    this._hour = SelectorEngine.findOne(`.${HOUR_CLASS}`);
    this._minutes = SelectorEngine.findOne(`.${MINUTE_CLASS}`);
    this._AM = SelectorEngine.findOne(`.${AM_CLASS}`);
    this._PM = SelectorEngine.findOne(`.${PM_CLASS}`);
    this._wrapper = SelectorEngine.findOne(`.${WRAPPER_CLASS}`);
    this._modal = SelectorEngine.findOne(`.${MODAL_CLASS}`);
    this._hand = SelectorEngine.findOne(`.${HAND_CLASS}`);
    this._circle = SelectorEngine.findOne(`.${CIRCLE_CLASS}`);
    this._clock = SelectorEngine.findOne(`.${CLOCK_CLASS}`);
    this._clockInner = SelectorEngine.findOne(`.${CLOCK_INNER_CLASS}`);
  }

  _handlerMaxMinHoursOptions(degrees, fn, maxHour, minHour, maxFormat, minFormat) {
    const maxHourDegrees = maxHour !== '' ? maxHour * 30 : '';
    let minHourDegrees = minHour !== '' ? minHour * 30 : '';

    if (maxHour !== '' && minHour !== '') {
      if (degrees <= 0) {
        degrees = 360 + degrees;
      }
      if (degrees <= maxHourDegrees && degrees >= minHourDegrees) {
        return fn();
      }
    } else if (minHour !== '') {
      if (degrees <= 0) {
        degrees = 360 + degrees;
      }

      if (Number(minHour) > 12) {
        minHourDegrees = minHour * 30 - minHourDegrees;
      }

      if (degrees >= minHourDegrees && minFormat === undefined) {
        return fn();
      } else if (minFormat !== undefined) {
        if (minFormat === 'PM' && this._isAmEnabled) {
          return;
        }

        if (minFormat === 'PM' && this._isPmEnabled) {
          if (degrees >= minHourDegrees) {
            return fn();
          }
        }

        if (minFormat === 'AM' && this._isPmEnabled) {
          return fn();
        } else if (minFormat === 'AM' && this._isAmEnabled) {
          if (degrees >= minHourDegrees) {
            return fn();
          }
        }
      }
    } else if (maxHour !== '') {
      if (degrees <= 0) {
        degrees = 360 + degrees;
      }
      if (degrees <= maxHourDegrees && maxFormat === undefined) {
        return fn();
      } else if (maxFormat !== undefined) {
        if (maxFormat === 'AM' && this._isPmEnabled) {
          return;
        }

        if (maxFormat === 'AM' && this._isAmEnabled) {
          if (degrees <= maxHourDegrees) {
            return fn();
          }
        }

        if (maxFormat === 'PM' && this._isPmEnabled) {
          if (degrees <= maxHourDegrees) {
            return fn();
          }
        } else if (maxFormat === 'PM' && this._isAmEnabled) {
          return fn();
        }
      }
    } else {
      return fn();
    }

    return fn;
  }

  _handleKeyboard() {
    EventHandler.on(this._document, 'keydown', '', (e) => {
      let hour;
      let minute;
      let innerHour;
      const { maxHour, minHour, increment } = this._options;

      const notNullMinutes = SelectorEngine.findOne(`.${TIPS_MINUTES_CLASS}`) !== null;
      const notNullInnerHours = SelectorEngine.findOne(`.${TIPS_INNER_HOURS_CLASS}`) !== null;

      const degrees = Number(this._hand.style.transform.replace(/[^\d-]/g, ''));

      const allTipsMinutes = SelectorEngine.find(`.${TIPS_MINUTES_CLASS}`, this._modal);
      const allTipsHours = SelectorEngine.find(`.${TIPS_HOURS_CLASS}`, this._modal);
      const allInnerTips = SelectorEngine.find(`.${TIPS_INNER_HOURS_CLASS}`, this._modal);

      const maxHourNumber = maxHour !== '' ? Number(maxHour) : '';
      const minHourNumber = minHour !== '' ? Number(minHour) : '';

      let hourTime = this._makeHourDegrees(e.target, degrees, hour).hour;
      const { degrees: hourObjDegrees, addDegrees } = this._makeHourDegrees(
        e.target,
        degrees,
        hour
      );

      let { minute: minHourMinutes, degrees: minObjDegrees } = this._makeMinutesDegrees(
        degrees,
        minute
      );
      const addMinDegrees = this._makeMinutesDegrees(degrees, minute).addDegrees;

      let { hour: innerHourDegrees } = this._makeInnerHoursDegrees(degrees, innerHour);

      if (e.keyCode === ESCAPE) {
        const cancelBtn = SelectorEngine.findOne(`.${BUTTON_CANCEL_CLASS}`, this._modal);
        EventHandler.trigger(cancelBtn, 'click');
      }

      if (!notNullMinutes) {
        if (notNullInnerHours) {
          if (e.keyCode === RIGHT_ARROW) {
            this._isInner = false;
            Manipulator.addStyle(this._hand, {
              height: 'calc(40% + 1px)',
            });
            this._hour.textContent = this._setHourOrMinute(hourTime > 12 ? 1 : hourTime);
            this._toggleClassActive(this.hoursArray, this._hour, allTipsHours);
            this._toggleClassActive(this.innerHours, this._hour, allInnerTips);
          }

          if (e.keyCode === LEFT_ARROW) {
            this._isInner = true;
            Manipulator.addStyle(this._hand, {
              height: '21.5%',
            });

            this._hour.textContent = this._setHourOrMinute(
              innerHourDegrees >= 24 || innerHourDegrees === '00' ? 0 : innerHourDegrees
            );
            this._toggleClassActive(this.innerHours, this._hour, allInnerTips);
            this._toggleClassActive(this.hoursArray, this._hour - 1, allTipsHours);
          }
        }

        if (e.keyCode === UP_ARROW) {
          const addRotate = () => {
            return Manipulator.addStyle(this._hand, {
              transform: `rotateZ(${hourObjDegrees + addDegrees}deg)`,
            });
          };

          this._handlerMaxMinHoursOptions(hourObjDegrees + 30, addRotate, maxHour, minHour);

          if (this._isInner) {
            innerHourDegrees += 1;

            if (innerHourDegrees === 24) {
              innerHourDegrees = 0;
            } else if (innerHourDegrees === 25 || innerHourDegrees === '001') {
              innerHourDegrees = 13;
            }

            this._hour.textContent = this._setHourOrMinute(innerHourDegrees);
            this._toggleClassActive(this.innerHours, this._hour, allInnerTips);
          } else {
            hourTime += 1;

            // Condition for max/min option
            if (maxHour !== '' && minHour !== '') {
              if (hourTime > maxHour) {
                hourTime = maxHourNumber;
              } else if (hourTime < minHour) {
                hourTime = minHourNumber;
              }
            } else if (maxHour !== '' && minHour === '') {
              if (hourTime > maxHour) {
                hourTime = maxHourNumber;
              }
            } else if (maxHour === '' && minHour !== '') {
              if (hourTime >= 12) {
                hourTime = 12;
              }
            }

            this._hour.textContent = this._setHourOrMinute(hourTime > 12 ? 1 : hourTime);
            this._toggleClassActive(this.hoursArray, this._hour, allTipsHours);
          }
        }
        if (e.keyCode === DOWN_ARROW) {
          const addRotate = () => {
            return Manipulator.addStyle(this._hand, {
              transform: `rotateZ(${hourObjDegrees - addDegrees}deg)`,
            });
          };

          this._handlerMaxMinHoursOptions(hourObjDegrees - 30, addRotate, maxHour, minHour);

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

            // Condition for max/min option
            if (maxHour !== '' && minHour !== '') {
              if (hourTime > maxHourNumber) {
                hourTime = maxHourNumber;
              } else if (hourTime < minHourNumber) {
                hourTime = minHourNumber;
              }
            } else if (maxHour === '' && minHour !== '') {
              if (hourTime <= minHourNumber) {
                hourTime = minHourNumber;
              }
            } else if (maxHour !== '' && minHour === '') {
              const maxNumber = 1;
              if (maxNumber >= hourTime) {
                hourTime = maxNumber;
              }
            }

            this._hour.textContent = this._setHourOrMinute(hourTime === 0 ? 12 : hourTime);
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

            if (minHourMinutes === '0014') {
              minHourMinutes = 5;
            }
          }

          this._minutes.textContent = this._setHourOrMinute(
            minHourMinutes > 59 ? 0 : minHourMinutes
          );
          this._toggleClassActive(this.minutesArray, this._minutes, allTipsMinutes);
          this._toggleBackgroundColorCircle(`${TIPS_MINUTES_CLASS}`);
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
          this._toggleClassActive(this.minutesArray, this._minutes, allTipsMinutes);
          this._toggleBackgroundColorCircle(`${TIPS_MINUTES_CLASS}`);
        }
      }
    });
  }

  _setActiveClassToTipsOnOpen(hour, ...rest) {
    if (this._isInvalidTimeFormat) {
      return;
    }

    [...rest].filter((e) => {
      if (e === 'PM') {
        Manipulator.addClass(this._PM, ACTIVE_CLASS);
      } else if (e === 'AM') {
        Manipulator.addClass(this._AM, ACTIVE_CLASS);
      } else {
        Manipulator.removeClass(this._AM, ACTIVE_CLASS);
        Manipulator.removeClass(this._PM, ACTIVE_CLASS);
      }

      return e;
    });

    const allTipsHours = SelectorEngine.find(`.${TIPS_HOURS_CLASS}`, this._modal);
    this._addActiveClassToTip(allTipsHours, hour);
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
          backgroundColor: '#1976d2',
        });

        if (Number(hour) > 12 || hour === '00') {
          Manipulator.addStyle(this._hand, {
            height: '21.5%',
          });
        }
      }
    } else {
      this._hour.textContent = '12';
      this._minutes.textContent = '00';

      if (!inline) {
        Manipulator.addStyle(this._hand, {
          transform: 'rotateZ(0deg)',
        });
      }
      if (format12) {
        Manipulator.addClass(this._PM, ACTIVE_CLASS);
      }
    }
  }

  _listenToToggleKeydown() {
    EventHandler.on(this._element, 'keydown', `[data-mdb-toggle='${this.toggleElement}']`, (e) => {
      if (e.keyCode === ENTER) {
        e.preventDefault();
        EventHandler.trigger(this.elementToggle, 'click');
      }
    });
  }

  _handleOpen() {
    EventHandlerMulti.on(
      this._element,
      'click',
      `[data-mdb-toggle='${this.toggleElement}']`,
      (e) => {
        if (this._options === null) {
          return;
        }

        // Fix for input with open, if is not for settimeout input has incorrent jumping label
        const fixForInput = Manipulator.getDataAttribute(this.input, 'toggle') !== null ? 200 : 0;

        setTimeout(() => {
          Manipulator.addStyle(this.elementToggle, {
            pointerEvents: 'none',
          });

          this.elementToggle.blur();

          let checkInputValue;

          if (takeValue(this.input)[0] === '') {
            checkInputValue = ['12', '00', 'PM'];
          } else {
            checkInputValue = takeValue(this.input);
          }

          const { modalID, inline, format12, overflowHidden } = this._options;
          const [hour, minute, format] = checkInputValue;
          const div = element('div');

          if (Number(hour) > 12 || hour === '00') {
            this._isInner = true;
          }

          this.input.blur();
          e.target.blur();

          div.innerHTML = getTimepickerTemplate(this._options);
          Manipulator.addClass(div, MODAL_CLASS);

          div.setAttribute('role', 'dialog');
          div.setAttribute('tabIndex', '-1');
          div.setAttribute('id', modalID);

          if (!inline) {
            this._document.body.appendChild(div);
          } else {
            this._popper = createPopper(this.input, div, {
              placement: 'bottom-start',
            });

            this._document.body.appendChild(div);
          }

          this._getDomElements();
          this._toggleBackdropAnimation();
          this._setActiveClassToTipsOnOpen(hour, minute, format);
          this._appendTimes();
          this._setActiveClassToTipsOnOpen(hour, minute, format);
          this._setTipsAndTimesDependOnInputValue(hour, minute);

          if (this.input.value === '') {
            const allTipsHours = SelectorEngine.find(`.${TIPS_HOURS_CLASS}`, this._modal);

            if (format12) {
              Manipulator.addClass(this._PM, ACTIVE_CLASS);
            }

            this._hour.textContent = '12';
            this._minutes.textContent = '00';
            this._addActiveClassToTip(allTipsHours, Number(this._hour.textContent));
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

            Manipulator.addStyle(this._hour, {
              pointerEvents: 'none',
            });
            Manipulator.addStyle(this._minutes, {
              pointerEvents: '',
            });
          }

          if (overflowHidden) {
            const hasVerticalScroll = window.innerWidth > document.documentElement.clientWidth;
            Manipulator.addStyle(this._document.body, {
              overflow: 'hidden',
            });

            if (!checkBrowser() && hasVerticalScroll) {
              const scrollHeight = '15px';
              Manipulator.addStyle(this._document.body, {
                paddingRight: scrollHeight,
              });
            }
          }

          this._focusTrap = new FocusTrap(this._wrapper, {
            event: 'keydown',
            condition: ({ key }) => key === 'Tab',
          });
          this._focusTrap.trap();
        }, fixForInput);
      }
    );
  }

  _handleInlineClicks() {
    EventHandlerMulti.on(
      this._modal,
      'click mousedown mouseup touchstart touchend contextmenu',
      `.${ICON_UP_CLASS}, .${ICON_DOWN_CLASS}`,
      (e) => {
        const { target, type } = e;

        let hourNumber = Number(this._hour.textContent);
        let minuteNumber = Number(this._minutes.textContent);

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

          if (hour > 12) {
            hour = 1;
          } else if (hour < 1) {
            hour = 12;
          }

          if (hour > 12) {
            hour = 1;
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
          hourNumber += 1;
          incrementHours(hourNumber);
        };
        const addMinutes = () => {
          minuteNumber += 1;
          incrementMinutes(minuteNumber);
        };

        const subHours = () => {
          hourNumber -= 1;
          incrementHours(hourNumber);
        };

        const subMinutes = () => {
          minuteNumber -= 1;
          incrementMinutes(minuteNumber);
        };

        if (Manipulator.hasClass(target, ICON_UP_CLASS)) {
          if (Manipulator.hasClass(target.parentNode, ICONS_HOUR_INLINE)) {
            if (type === 'mousedown' || type === 'touchstart') {
              clearInterval(this._interval);
              this._interval = setInterval(addHours, 100);
            } else if (type === 'mouseup' || type === 'touchend' || type === 'contextmenu') {
              clearInterval(this._interval);
            } else {
              addHours();
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (type === 'mousedown' || type === 'touchstart') {
              clearInterval(this._interval);
              this._interval = setInterval(addMinutes, 100);
            } else if (type === 'mouseup' || type === 'touchend' || type === 'contextmenu') {
              clearInterval(this._interval);
            } else {
              addMinutes();
            }
          }
        } else if (Manipulator.hasClass(target, ICON_DOWN_CLASS)) {
          if (Manipulator.hasClass(target.parentNode, ICONS_HOUR_INLINE)) {
            if (type === 'mousedown' || type === 'touchstart') {
              clearInterval(this._interval);
              this._interval = setInterval(subHours, 100);
            } else if (type === 'mouseup' || type === 'touchend') {
              clearInterval(this._interval);
            } else {
              subHours();
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (type === 'mousedown' || type === 'touchstart') {
              clearInterval(this._interval);
              this._interval = setInterval(subMinutes, 100);
            } else if (type === 'mouseup' || type === 'touchend') {
              clearInterval(this._interval);
            } else {
              subMinutes();
            }
          }
        }
      }
    );
  }

  _handleClose() {
    EventHandler.on(
      this._modal,
      'click',
      `.${WRAPPER_CLASS}, .${BUTTON_CANCEL_CLASS}, .${BUTTON_CLEAR_CLASS}`,
      ({ target }) => {
        const { closeModalOnBackdropClick } = this._options;

        const runRemoveFunction = () => {
          Manipulator.addStyle(this.elementToggle, {
            pointerEvents: 'auto',
          });
          this._toggleBackdropAnimation(true);
          this._removeModal();
          this._focusTrap.disable();
          this._focusTrap = null;

          if (this.elementToggle) {
            this.elementToggle.focus();
          } else if (this.input) {
            this.input.focus();
          }
        };

        if (Manipulator.hasClass(target, BUTTON_CLEAR_CLASS)) {
          this.input.value = '';
          Manipulator.removeClass(this.input, 'active');

          let checkInputValue;

          if (takeValue(this.input)[0] === '') {
            checkInputValue = ['12', '00', 'PM'];
          } else {
            checkInputValue = takeValue(this.input);
          }

          const [hour, minute, format] = checkInputValue;
          this._setTipsAndTimesDependOnInputValue('12', '00');
          this._setActiveClassToTipsOnOpen(hour, minute, format);
          this._hour.click();
        } else if (Manipulator.hasClass(target, BUTTON_CANCEL_CLASS)) {
          runRemoveFunction();
        } else if (Manipulator.hasClass(target, WRAPPER_CLASS) && closeModalOnBackdropClick) {
          runRemoveFunction();
        }
      }
    );
  }

  showValueInput() {
    return this.input.value;
  }

  _handleOkButton() {
    EventHandlerMulti.on(this._modal, 'click', `.${BUTTON_SUBMIT_CLASS}`, () => {
      const { readOnly, focusInputAfterApprove } = this._options;
      const hourModeActive = this._document.querySelector(`.${HOUR_MODE_CLASS}.${ACTIVE_CLASS}`);
      const currentValue = `${this._hour.textContent}:${this._minutes.textContent}`;

      Manipulator.addClass(this.input, 'active');
      Manipulator.addStyle(this.elementToggle, {
        pointerEvents: 'auto',
      });

      if (this._isInvalidTimeFormat) {
        Manipulator.removeClass(this.input, 'is-invalid');
      }

      if (!readOnly && focusInputAfterApprove) {
        this.input.focus();
      }

      Manipulator.addStyle(this.elementToggle, {
        pointerEvents: 'auto',
      });

      if (hourModeActive === null) {
        this.input.value = `${currentValue} PM`;
      } else {
        this.input.value = `${currentValue} ${hourModeActive.textContent}`;
      }

      this._toggleBackdropAnimation(true);
      this._removeModal();

      EventHandler.trigger(this.input, 'input.mdb.timepicker');
    });
  }

  _handleHoverInlineBtn() {
    EventHandlerMulti.on(
      this._modal,
      'mouseover mouseleave',
      `.${CURRENT_INLINE_CLASS}`,
      ({ type, target }) => {
        const allIconsInlineHour = SelectorEngine.find(`.${ICON_INLINE_HOUR_CLASS}`, this._modal);
        const allIconsInlineMinute = SelectorEngine.find(
          `.${ICON_INLINE_MINUTE_CLASS}`,
          this._modal
        );

        if (type === 'mouseover') {
          if (Manipulator.hasClass(target, HOUR_CLASS)) {
            allIconsInlineHour.forEach((icon) => Manipulator.addClass(icon, ACTIVE_CLASS));
          } else {
            allIconsInlineMinute.forEach((icon) => Manipulator.addClass(icon, ACTIVE_CLASS));
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (Manipulator.hasClass(target, HOUR_CLASS)) {
            allIconsInlineHour.forEach((icon) => Manipulator.removeClass(icon, ACTIVE_CLASS));
          } else {
            allIconsInlineMinute.forEach((icon) => Manipulator.removeClass(icon, ACTIVE_CLASS));
          }
        }
      }
    );
  }

  _handleDocumentClickInline() {
    EventHandler.on(document, 'click', ({ target }) => {
      if (
        this._modal &&
        !this._modal.contains(target) &&
        !Manipulator.hasClass(target, 'timepicker-icon')
      ) {
        clearInterval(this._interval);
        Manipulator.addStyle(this.elementToggle, {
          pointerEvents: 'auto',
        });
        this._removeModal();
      }
    });
  }

  _handleSwitchHourMinute() {
    toggleClassHandler('click', CURRENT_CLASS);

    EventHandler.on(this._modal, 'click', CURRENT_CLASS, () => {
      const current = SelectorEngine.find(CURRENT_CLASS, this._modal);
      const allTipsMinutes = SelectorEngine.find(`.${TIPS_MINUTES_CLASS}`, this._modal);
      const allTipsHours = SelectorEngine.find(`.${TIPS_HOURS_CLASS}`, this._modal);
      const allInnerTips = SelectorEngine.find(`.${TIPS_INNER_HOURS_CLASS}`, this._modal);
      const hourValue = Number(this._hour.textContent);
      const minuteValue = Number(this._minutes.textContent);

      const switchTips = (array, classes) => {
        allTipsHours.forEach((tip) => tip.remove());
        allTipsMinutes.forEach((tip) => tip.remove());
        Manipulator.addClass(this._hand, TRANSFORM_CLASS);

        setTimeout(() => {
          Manipulator.removeClass(this._hand, TRANSFORM_CLASS);
        }, 401);

        this._getAppendClock(array, `.${CLOCK_CLASS}`, classes);

        const toggleActiveClass = () => {
          const allTipsHours = SelectorEngine.find(`.${TIPS_HOURS_CLASS}`, this._modal);
          const allTipsMinutes = SelectorEngine.find(`.${TIPS_MINUTES_CLASS}`, this._modal);

          this._addActiveClassToTip(allTipsHours, hourValue);
          this._addActiveClassToTip(allTipsMinutes, minuteValue);
        };

        setTimeout(() => {
          toggleActiveClass();
        }, 401);
      };

      current.forEach((e) => {
        if (Manipulator.hasClass(e, ACTIVE_CLASS)) {
          if (Manipulator.hasClass(e, MINUTE_CLASS)) {
            Manipulator.addClass(this._hand, TRANSFORM_CLASS);

            Manipulator.addStyle(this._hand, {
              transform: `rotateZ(${this._minutes.textContent * 6}deg)`,
              height: 'calc(40% + 1px)',
            });

            if (allInnerTips.length > 0) {
              allInnerTips.forEach((innerTip) => innerTip.remove());
            }
            switchTips(this.minutesArray, `${TIPS_MINUTES_CLASS}`, allTipsMinutes);
            this._hour.style.pointerEvents = '';
            this._minutes.style.pointerEvents = 'none';
          } else if (Manipulator.hasClass(e, HOUR_CLASS)) {
            Manipulator.addStyle(this._hand, {
              transform: `rotateZ(${this._hour.textContent * 30}deg)`,
            });

            if (Number(this._hour.textContent) > 12) {
              Manipulator.addStyle(this._hand, {
                transform: `rotateZ(${this._hour.textContent * 30 - 360}deg)`,
                height: '21.5%',
              });

              if (Number(this._hour.textContent) > 12) {
                Manipulator.addStyle(this._hand, {
                  height: '21.5%',
                });
              }
            } else {
              Manipulator.addStyle(this._hand, {
                height: 'calc(40% + 1px)',
              });
            }

            if (allInnerTips.length > 0) {
              allInnerTips.forEach((innerTip) => innerTip.remove());
            }

            switchTips(this.hoursArray, `${TIPS_HOURS_CLASS}`, allTipsHours);

            Manipulator.addStyle(this._hour, {
              pointerEvents: 'none',
            });
            Manipulator.addStyle(this._minutes, {
              pointerEvents: '',
            });
          }
        }
      });
    });
  }

  _handleSwitchTimeMode() {
    EventHandler.on(document, 'click', `.${HOUR_MODE_CLASS}`, ({ target }) => {
      if (!Manipulator.hasClass(target, ACTIVE_CLASS)) {
        const allHoursMode = SelectorEngine.find(`.${HOUR_MODE_CLASS}`);

        allHoursMode.forEach((element) => {
          if (Manipulator.hasClass(element, ACTIVE_CLASS)) {
            Manipulator.removeClass(element, ACTIVE_CLASS);
          }
        });

        Manipulator.addClass(target, ACTIVE_CLASS);
      }
    });
  }

  _handleClockClick() {
    const clockWrapper = SelectorEngine.findOne(`.${CLOCK_WRAPPER_CLASS}`);
    EventHandlerMulti.on(
      document,
      'mousedown mouseup mousemove mouseleave mouseover touchstart touchmove touchend',
      '',
      (e) => {
        if (!checkBrowser()) {
          e.preventDefault();
        }

        const { maxHour, minHour } = this._options;
        const { type, target } = e;
        const { closeModalOnMinutesClick, switchHoursToMinutesOnClick } = this._options;
        const minutes = SelectorEngine.findOne(`.${TIPS_MINUTES_CLASS}`, this._modal) !== null;
        const hours = SelectorEngine.findOne(`.${TIPS_HOURS_CLASS}`, this._modal) !== null;
        const innerHours =
          SelectorEngine.findOne(`.${TIPS_INNER_HOURS_CLASS}`, this._modal) !== null;

        const allTipsMinutes = SelectorEngine.find(`.${TIPS_MINUTES_CLASS}`, this._modal);

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
          type === 'mousedown' ||
          type === 'mousemove' ||
          type === 'touchmove' ||
          type === 'touchstart'
        ) {
          if (type === 'mousedown' || type === 'touchstart' || type === 'touchmove') {
            if (
              Manipulator.hasClass(target, CLOCK_WRAPPER_CLASS) ||
              Manipulator.hasClass(target, CLOCK_CLASS) ||
              Manipulator.hasClass(target, TIPS_MINUTES_CLASS) ||
              Manipulator.hasClass(target, CLOCK_INNER_CLASS) ||
              Manipulator.hasClass(target, TIPS_INNER_HOURS_CLASS) ||
              Manipulator.hasClass(target, TIPS_HOURS_CLASS) ||
              Manipulator.hasClass(target, CIRCLE_CLASS) ||
              Manipulator.hasClass(target, HAND_CLASS) ||
              Manipulator.hasClass(target, MIDDLE_DOT_CLASS) ||
              Manipulator.hasClass(target, TIPS_ELEMENT_CLASS) ||
              Manipulator.hasClass(target, TIPS_INNER_ELEMENT_CLASS)
            ) {
              this._isMouseMove = true;

              if (checkBrowser() && e.touches) {
                xPos = e.touches[0].clientX;
                yPos = e.touches[0].clientY;
                elFromPoint = document.elementFromPoint(xPos, yPos);
              }
            }
          }
        } else if (type === 'mouseup' || type === 'touchend') {
          this._isMouseMove = false;

          if (
            Manipulator.hasClass(target, CLOCK_CLASS) ||
            Manipulator.hasClass(target, CLOCK_INNER_CLASS) ||
            Manipulator.hasClass(target, TIPS_INNER_HOURS_CLASS) ||
            Manipulator.hasClass(target, TIPS_HOURS_CLASS) ||
            Manipulator.hasClass(target, CIRCLE_CLASS) ||
            Manipulator.hasClass(target, HAND_CLASS) ||
            Manipulator.hasClass(target, MIDDLE_DOT_CLASS) ||
            Manipulator.hasClass(target, TIPS_ELEMENT_CLASS) ||
            Manipulator.hasClass(target, TIPS_INNER_ELEMENT_CLASS)
          ) {
            if ((hours || innerHours) && switchHoursToMinutesOnClick) {
              EventHandler.trigger(this._minutes, 'click');
            }
          }

          if (minutes && closeModalOnMinutesClick) {
            const submitBtn = SelectorEngine.findOne(`.${BUTTON_SUBMIT_CLASS}`, this._modal);

            EventHandler.trigger(submitBtn, 'click');
          }
        }

        if (minutes) {
          let minute;

          const degrees = Math.trunc((rds * 180) / Math.PI) + 90;

          const { degrees: minDegrees, minute: minTimeObj } = this._makeMinutesDegrees(
            degrees,
            minute
          );

          if (this._handlerMaxMinMinutesOptions(minDegrees, minTimeObj) === undefined) {
            return;
          }

          const { degrees: _degrees, minute: minuteTimes } = this._handlerMaxMinMinutesOptions(
            minDegrees,
            minTimeObj
          );

          if (this._isMouseMove) {
            Manipulator.addStyle(this._hand, {
              transform: `rotateZ(${_degrees}deg)`,
            });

            if (minuteTimes === undefined) {
              return;
            }

            const changeMinutes = () => {
              return minuteTimes >= 10 || minuteTimes === '00' ? minuteTimes : `0${minuteTimes}`;
            };

            this._minutes.textContent = changeMinutes();

            this._toggleClassActive(this.minutesArray, this._minutes, allTipsMinutes);
            this._toggleBackgroundColorCircle(`${TIPS_MINUTES_CLASS}`);

            this._objWithDataOnChange.degreesMinutes = _degrees;
            this._objWithDataOnChange.minutes = minuteTimes;
          }
        }

        if (hours || innerHours) {
          let hour;

          let degrees = Math.trunc((rds * 180) / Math.PI) + 90;
          degrees = Math.round(degrees / 30) * 30;

          Manipulator.addStyle(this._circle, {
            backgroundColor: '#1976d2',
          });
          if (this._makeHourDegrees(target, degrees, hour) === undefined) {
            return;
          }
          const makeDegrees = () => {
            if (checkBrowser() && degrees) {
              const { degrees: touchDegrees, hour: touchHours } = this._makeHourDegrees(
                elFromPoint,
                degrees,
                hour
              );

              return this._handleMoveHand(elFromPoint, touchHours, touchDegrees);
            } else {
              const { degrees: movedDegrees, hour: movedHours } = this._makeHourDegrees(
                target,
                degrees,
                hour
              );

              return this._handleMoveHand(target, movedHours, movedDegrees);
            }
          };

          this._objWithDataOnChange.degreesHours = degrees;
          this._handlerMaxMinHoursOptions(degrees, makeDegrees, maxHour, minHour);
        }

        e.stopPropagation();
      }
    );
  }

  _handleMoveHand(target, hour, degrees) {
    const allTipsHours = SelectorEngine.find(`.${TIPS_HOURS_CLASS}`, this._modal);
    const allTipsInner = SelectorEngine.find(`.${TIPS_INNER_HOURS_CLASS}`, this._modal);

    if (this._isMouseMove) {
      if (
        Manipulator.hasClass(target, CLOCK_INNER_CLASS) ||
        Manipulator.hasClass(target, TIPS_INNER_HOURS_CLASS) ||
        Manipulator.hasClass(target, TIPS_INNER_ELEMENT_CLASS)
      ) {
        Manipulator.addStyle(this._hand, {
          height: '21.5%',
        });
      } else {
        Manipulator.addStyle(this._hand, {
          height: 'calc(40% + 1px)',
        });
      }

      Manipulator.addStyle(this._hand, {
        transform: `rotateZ(${degrees}deg)`,
      });

      this._hour.textContent = hour >= 10 || hour === '00' ? hour : `0${hour}`;

      this._toggleClassActive(this.hoursArray, this._hour, allTipsHours);
      this._toggleClassActive(this.innerHours, this._hour, allTipsInner);

      this._objWithDataOnChange.hour = hour >= 10 || hour === '00' ? hour : `0${hour}`;
    }
  }

  _handlerMaxMinMinutesOptions(degrees, minute) {
    const { increment, maxTime, minTime } = this._options;

    const maxMin = takeValue(maxTime, false)[1];
    const minMin = takeValue(minTime, false)[1];
    const maxHourTime = takeValue(maxTime, false)[0];
    const minHourTime = takeValue(minTime, false)[0];

    const maxTimeFormat = takeValue(maxTime, false)[2];
    const minTimeFormat = takeValue(minTime, false)[2];

    const maxMinDegrees = maxMin !== '' ? maxMin * 6 : '';
    const minMinDegrees = minMin !== '' ? minMin * 6 : '';

    if (maxTimeFormat === undefined && minTimeFormat === undefined) {
      if (maxTime !== '' && minTime !== '') {
        if (degrees <= maxMinDegrees && degrees >= minMinDegrees) {
          return degrees;
        }
      } else if (minTime !== '' && Number(this._hour.textContent) <= Number(minHourTime)) {
        if (degrees <= minMinDegrees - 6) {
          return degrees;
        }
      } else if (maxTime !== '' && Number(this._hour.textContent) >= Number(maxHourTime)) {
        if (degrees >= maxMinDegrees + 6) {
          return degrees;
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (minTime !== '') {
        if (minTimeFormat === 'PM' && this._isAmEnabled) {
          return;
        }

        if (minTimeFormat === 'PM' && this._isPmEnabled) {
          if (Number(this._hour.textContent) < Number(minHourTime)) {
            return;
          }

          if (Number(this._hour.textContent) <= Number(minHourTime)) {
            if (degrees <= minMinDegrees - 6) {
              return degrees;
            }
          }
        } else if (minTimeFormat === 'AM' && this._isAmEnabled) {
          if (Number(this._hour.textContent) < Number(minHourTime)) {
            return;
          }

          if (Number(this._hour.textContent) <= Number(minHourTime)) {
            if (degrees <= minMinDegrees - 6) {
              return degrees;
            }
          }
        }
      } else if (maxTime !== '') {
        if (maxTimeFormat === 'AM' && this._isPmEnabled) {
          return;
        }

        if (maxTimeFormat === 'PM' && this._isPmEnabled) {
          if (Number(this._hour.textContent) >= Number(maxHourTime)) {
            if (degrees >= maxMinDegrees + 6) {
              return degrees;
            }
          }
        } else if (maxTimeFormat === 'AM' && this._isAmEnabled) {
          if (Number(this._hour.textContent) >= Number(maxHourTime)) {
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

    if (degrees <= 0) {
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
    setTimeout(() => {
      this._modal.remove();
      Manipulator.addStyle(this._document.body, {
        overflow: '',
      });
      if (!checkBrowser()) {
        Manipulator.addStyle(this._document.body, {
          paddingRight: '',
        });
      }
    }, 300);

    EventHandlerMulti.off(
      this._document,
      'click keydown mousedown mouseup mousemove mouseleave mouseover touchmove touchend'
    );
  }

  _toggleBackdropAnimation(isToRemove = false) {
    if (isToRemove) {
      Manipulator.addClass(this._wrapper, 'animation');
      Manipulator.addClass(this._wrapper, WRAPPER_CLOSE_ANIMATION_CLASS);
      this._wrapper.style.animationDuration = '300ms';
    } else {
      Manipulator.addClass(this._wrapper, 'animation');
      Manipulator.addClass(this._wrapper, WRAPPER_OPEN_ANIMATION_CLASS);
      this._wrapper.style.animationDuration = '300ms';

      if (!this._options.inline) Manipulator.addClass(this._clock, CLOCK_ANIMATION_CLASS);
    }
  }

  _toggleBackgroundColorCircle = (classes) => {
    const tips = this._modal.querySelector(`.${classes}.${ACTIVE_CLASS}`) !== null;

    if (tips) {
      Manipulator.addStyle(this._circle, {
        backgroundColor: '#1976d2',
      });
    } else {
      Manipulator.addStyle(this._circle, {
        backgroundColor: 'transparent',
      });
    }
  };

  _toggleClassActive = (array, { textContent }, tips) => {
    const findInArray = [...array].find((e) => Number(e) === Number(textContent));

    return tips.forEach((e) => {
      if (!Manipulator.hasClass(e, 'disabled')) {
        if (e.textContent === findInArray) {
          Manipulator.addClass(e, ACTIVE_CLASS);
        } else {
          Manipulator.removeClass(e, ACTIVE_CLASS);
        }
      }
    });
  };

  _addActiveClassToTip(tips, value) {
    tips.forEach((tip) => {
      if (Number(tip.textContent) === Number(value)) {
        Manipulator.addClass(tip, ACTIVE_CLASS);
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
        minute = '00';
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
    const { maxHour, minHour } = this._options;
    if (!target) {
      return;
    }
    if (
      Manipulator.hasClass(target, CLOCK_INNER_CLASS) ||
      Manipulator.hasClass(target, TIPS_INNER_HOURS_CLASS) ||
      Manipulator.hasClass(target, TIPS_INNER_ELEMENT_CLASS)
    ) {
      if (degrees < 0) {
        hour = Math.round(360 + degrees / 30) % 24;
        degrees = 360 + degrees;
      } else {
        hour = Math.round(degrees / 30) + 12;
        if (hour === 12) {
          hour = '00';
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

    if (maxHour !== '') {
      if (hour > Number(maxHour)) {
        return;
      }
    }

    if (minHour !== '') {
      if (hour < Number(minHour)) {
        return;
      }
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
        hour = '00';
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
    this._getAppendClock(this.hoursArray, `.${CLOCK_CLASS}`, `${TIPS_HOURS_CLASS}`);
  }

  _getAppendClock = (array = [], clockClass = `.${CLOCK_CLASS}`, tipsClass) => {
    const { maxHour, minHour, minTime, maxTime, inline, format12 } = this._options;
    const [maxTimeHour, maxTimeMinutes, maxTimeFormat] = takeValue(maxTime, false);
    const [minTimeHour, minTimeMinutes, minTimeFormat] = takeValue(minTime, false);

    // fix for append clock for max/min if input has invalid  value
    if (!inline) {
      if (format12) {
        if (this._isInvalidTimeFormat && !Manipulator.hasClass(this._AM, 'active')) {
          Manipulator.addClass(this._PM, 'active');
        }
      }
    }

    const hourModeActive = SelectorEngine.findOne(`.${HOUR_MODE_CLASS}.${ACTIVE_CLASS}`);

    const clock = SelectorEngine.findOne(clockClass);

    const elements = 360 / array.length;

    function rad(el) {
      return el * (Math.PI / 180);
    }

    if (clock === null) {
      return;
    }

    const clockWidth = (clock.offsetWidth - 32) / 2;
    const clockHeight = (clock.offsetHeight - 32) / 2;
    const radius = clockWidth - 4;

    [...array].forEach((e, i) => {
      const angle = rad(i * elements);

      const span = element('span');
      const spanToTips = element('span');

      spanToTips.innerHTML = e;
      Manipulator.addClass(span, tipsClass);

      const itemWidth = span.offsetWidth;
      const itemHeight = span.offsetHeight;

      Manipulator.addStyle(span, {
        left: `${clockWidth + Math.sin(angle) * radius - itemWidth}px`,
        bottom: `${clockHeight + Math.cos(angle) * radius - itemHeight}px`,
      });

      if (array.includes('05')) {
        Manipulator.addClass(span, `${TIPS_MINUTES_CLASS}`);
      }

      if (array.includes('13')) {
        spanToTips.classList.add(TIPS_INNER_ELEMENT_CLASS);
      } else {
        spanToTips.classList.add(TIPS_ELEMENT_CLASS);
      }

      if (!Manipulator.hasClass(span, `${TIPS_MINUTES_CLASS}`)) {
        if (maxHour !== '') {
          if (Number(e) > Number(maxHour)) {
            Manipulator.addClass(span, 'disabled');
          }
        }

        if (minHour !== '') {
          if (Number(e) < Number(minHour)) {
            Manipulator.addClass(span, 'disabled');
          }
        }

        if (maxTime !== '') {
          if (maxTimeFormat !== undefined) {
            if (maxTimeFormat === 'PM' && hourModeActive.textContent === 'PM') {
              this._isAmEnabled = false;
              this._isPmEnabled = true;
              if (Number(e) > Number(maxTimeHour)) {
                Manipulator.addClass(span, 'disabled');
              }
            }

            if (maxTimeFormat === 'AM' && hourModeActive.textContent === 'PM') {
              this._isAmEnabled = false;
              this._isPmEnabled = true;
              Manipulator.addClass(span, 'disabled');
            } else if (maxTimeFormat === 'AM' && hourModeActive.textContent === 'AM') {
              this._isAmEnabled = true;
              this._isPmEnabled = false;
              if (Number(e) > Number(maxTimeHour)) {
                Manipulator.addClass(span, 'disabled');
              }
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (Number(e) > Number(maxTimeHour)) {
              Manipulator.addClass(span, 'disabled');
            }
          }
        }

        if (minTime !== '') {
          if (Number(e) < Number(minTimeHour)) {
            Manipulator.addClass(span, 'disabled');
          }
        }

        if (minTime !== '') {
          if (minTimeFormat !== undefined) {
            if (minTimeFormat === 'PM' && hourModeActive.textContent === 'PM') {
              this._isAmEnabled = false;
              this._isPmEnabled = true;
              if (Number(e) < Number(minTimeHour)) {
                Manipulator.addClass(span, 'disabled');
              }
            } else if (minTimeFormat === 'PM' && hourModeActive.textContent === 'AM') {
              this._isAmEnabled = true;
              this._isPmEnabled = false;
              Manipulator.addClass(span, 'disabled');
            }

            if (minTimeFormat === 'AM' && hourModeActive.textContent === 'PM') {
              this._isAmEnabled = false;
              this._isPmEnabled = true;
              Manipulator.removeClass(span, 'disabled');
            } else if (minTimeFormat === 'AM' && hourModeActive.textContent === 'AM') {
              this._isAmEnabled = true;
              this._isPmEnabled = false;
              if (Number(e) < Number(minTimeHour)) {
                Manipulator.addClass(span, 'disabled');
              }
            }
          }
        }
      } else if (Manipulator.hasClass(span, `${TIPS_MINUTES_CLASS}`)) {
        if (maxTime !== '') {
          if (
            Number(e) > Number(maxTimeMinutes) &&
            Number(this._hour.textContent) >= Number(maxTimeHour)
          ) {
            Manipulator.addClass(span, 'disabled');
          }
        }

        if (minTime !== '') {
          if (
            Number(e) < Number(minTimeMinutes) &&
            Number(this._hour.textContent) <= Number(minTimeHour)
          ) {
            Manipulator.addClass(span, 'disabled');
          }
        }

        if (maxTime !== '') {
          if (maxTimeFormat !== undefined) {
            if (maxTimeFormat === 'PM' && hourModeActive.textContent === 'PM') {
              if (
                Number(e) > Number(maxTimeMinutes) &&
                Number(this._hour.textContent) >= Number(maxTimeHour)
              ) {
                Manipulator.addClass(span, 'disabled');
              }
            } else if (maxTimeFormat === 'PM' && hourModeActive.textContent === 'AM') {
              Manipulator.removeClass(span, 'disabled');
            }

            if (maxTimeFormat === 'AM' && hourModeActive.textContent === 'PM') {
              Manipulator.addClass(span, 'disabled');
            } else if (maxTimeFormat === 'AM' && hourModeActive.textContent === 'AM') {
              if (
                Number(this._hour.textContent) >= Number(maxTimeHour) &&
                Number(e) > Number(maxTimeMinutes)
              ) {
                Manipulator.addClass(span, 'disabled');
              }
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (maxTimeFormat !== undefined) {
              if (Number(e) > Number(maxTimeHour)) {
                Manipulator.addClass(span, 'disabled');
              }
            }
          }
        }

        if (minTime !== '') {
          if (minTimeFormat !== undefined) {
            if (minTimeFormat === 'PM' && hourModeActive.textContent === 'PM') {
              if (
                Number(e) < Number(minTimeMinutes) &&
                Number(this._hour.textContent) === Number(minTimeHour)
              ) {
                Manipulator.addClass(span, 'disabled');
              } else if (Number(this._hour.textContent) < Number(minTimeHour)) {
                Manipulator.addClass(span, 'disabled');
              }
            } else if (minTimeFormat === 'PM' && hourModeActive.textContent === 'AM') {
              Manipulator.addClass(span, 'disabled');
            }

            if (minTimeFormat === 'AM' && hourModeActive.textContent === 'PM') {
              Manipulator.removeClass(span, 'disabled');
            } else if (minTimeFormat === 'AM' && hourModeActive.textContent === 'AM') {
              if (
                Number(this._hour.textContent) === Number(minTimeHour) &&
                Number(e) < Number(minTimeMinutes)
              ) {
                Manipulator.addClass(span, 'disabled');
              } else if (Number(this._hour.textContent) < Number(minTimeHour)) {
                Manipulator.addClass(span, 'disabled');
              }
            }
          }
        }
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

  // Static
  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) || new this(element, typeof config === 'object' ? config : null)
    );
  }
}

export default Timepicker;

EventHandler.on(window, 'DOMContentLoaded', () => {
  SelectorEngine.find(`.${NAME}`).forEach((timepicker) => {
    let instance = Timepicker.getInstance(timepicker);

    if (!instance) {
      instance = new Timepicker(timepicker);
    }
  });
});
