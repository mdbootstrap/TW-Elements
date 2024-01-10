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

import { typeCheckConfig } from "../../util/index";
import EventHandler, { EventHandlerMulti } from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import Data from "../../dom/data";
import {
  getConnectsTemplate,
  getHandleTemplate,
  getTooltipTemplate,
} from "./template";
import { getEventTypeClientX } from "./utils";
import BaseComponent from "../../base-component";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "multiRangeSlider";
const DATA_KEY = `te.${NAME}`;

const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_VALUE_CHANGED = `valueChanged${EVENT_KEY}`;

const ATTR_STATE_ACTIVE = "data-te-active";
const ATTR_HAND_REF = "data-te-multi-range-slider-hand-ref";
const ATTR_CONNECT_REF = "data-te-multi-range-slider-connect-ref";
const ATTR_TOOLTIP_REF = "data-te-multi-range-slider-tooltip-ref";

const DefaultType = {
  max: "number",
  min: "number",
  numberOfRanges: "number",
  startValues: "(array|string)",
  step: "(string|null|number)",
  tooltip: "boolean",
};

const Default = {
  max: 100,
  min: 0,
  numberOfRanges: 2,
  startValues: [0, 100],
  step: null,
  tooltip: false,
};

const DefaultClasses = {
  connect:
    "z-10 h-full w-full bg-[#eee] will-change-transform dark:bg-[#4f4f4f]",
  connectContainer:
    "relative border-[1px] border-[#eee] z-0 h-full w-full overflow-hidden dark:border-[#4f4f4f]",
  container:
    "apperance-none relative m-auto w-full cursor-pointer h-1 border-0 bg-transparent p-0 focus:outline-none dark:border-[#4f4f4f]",
  hand: "apperance-none absolute top-[50%] border-0 -mt-1 h-4 w-4 cursor-pointer rounded-[50%] border-0 bg-primary transition-colors ease-in-out will-change-transform active:bg-[#c4d4ef] active:z-60",
  tooltip:
    "absolute -top-[18px] origin-[50%_50%] -translate-x-[6px] -rotate-45 scale-0 rounded-bl-none rounded-br-2xl rounded-tl-2xl rounded-tr-2xl bg-primary text-white transition-all duration-[200ms] data-[te-active]:-top-[38px] data-[te-active]:scale-100",
  tooltipValue:
    "block h-[30px] w-[30px] -translate-x-[6px] translate-y-[6px] rotate-45 text-center text-[10px]",
};

const DefaultClassesType = {
  container: "string",
  connectContainer: "string",
  connect: "string",
  hand: "string",
  tooltip: "string",
  tooltipValue: "string",
};

class MultiRangeSlider extends BaseComponent {
  constructor(element, options, classes) {
    super(element);
    this._options = this._getConfig(options);
    this._mousemove = false;
    this._classes = this._getClasses(classes);
    this._maxTranslation = null;
    this._minTranslation = null;
    this._currentStepValue = null;
    this._canChangeStep = false;

    this.init();
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get hands() {
    return SelectorEngine.find(`[${ATTR_HAND_REF}]`, this._element);
  }

  get connect() {
    return SelectorEngine.findOne(`[${ATTR_CONNECT_REF}]`, this._element);
  }

  get leftConnectRect() {
    return this.connect.getBoundingClientRect().left;
  }

  get handActive() {
    return SelectorEngine.findOne(`[${ATTR_STATE_ACTIVE}]`);
  }

  get activeTooltipValue() {
    const handTooltips = SelectorEngine.find(`[${ATTR_TOOLTIP_REF}]`);
    const handTooltipActive = handTooltips.filter((hand) =>
      hand.hasAttribute(ATTR_STATE_ACTIVE)
    );

    const tooltip = handTooltipActive[0].children[0];
    return tooltip;
  }

  // Public

  init() {
    this._setContainerClasses();
    this._setRangeConnectsElement();
    this._setRangeHandleElements();
    this._setMaxAndMinTranslation();
    this._setTransofrmationOnStart();
    this._handleClickEventOnHand();
    this._handleEndMoveEventDocument();
    this._handleClickOnRange();
    this._setTooltipToHand();
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY);

    this._options = null;
    this._mousemove = null;
    this._maxTranslation = null;
    this._minTranslation = null;
    this._currentStepValue = null;
    this._canChangeStep = null;

    this.hands.forEach((hand) => {
      EventHandlerMulti.off(hand, "mousedown touchstart");
      EventHandlerMulti.off(hand, "mouseup touchend");
    });

    EventHandlerMulti.off(document, "mousemove touchmove");
    EventHandlerMulti.off(document, "mouseup touchend");
    EventHandlerMulti.off(this.connect, "mousedown touchstart");
  }

  // Private

  _setMaxAndMinTranslation() {
    this._maxTranslation =
      this.connect.offsetWidth - this.hands[0].offsetWidth / 2;
    this._minTranslation =
      this.connect.offsetLeft - this.hands[0].offsetWidth / 2;
  }

  _setTransofrmationOnStart() {
    const { max, min } = this._options;
    let { startValues } = this._options;

    if (typeof startValues === "string") {
      startValues = JSON.parse(startValues.replace(/'/g, '"'));
    }

    if (startValues.length === 0) {
      this.hands.forEach((hand) => {
        Manipulator.setDataAttribute(
          hand,
          "translation",
          Math.round(this._minTranslation)
        );

        Manipulator.addStyle(hand, {
          transform: `translate(${this._minTranslation}px,-25%)`,
        });
      });
    } else {
      this.hands.forEach((hand, i) => {
        if (startValues[i] > max || startValues[i] < min) {
          return;
        }

        if (startValues[i] === undefined) {
          Manipulator.setDataAttribute(
            hand,
            "translation",
            Math.round(this._maxTranslation)
          );

          Manipulator.addStyle(hand, {
            transform: `translate(${this._maxTranslation}px,-25%)`,
            zIndex: this.hands.length - i,
          });

          return;
        }

        const normalizedValue = (startValues[i] - min) / (max - min);
        const translation =
          normalizedValue * this.connect.offsetWidth - hand.offsetWidth / 2;

        Manipulator.setDataAttribute(
          hand,
          "translation",
          Math.round(translation)
        );

        Manipulator.addStyle(hand, {
          transform: `translate(${translation}px,-25%)`,
          zIndex: this.hands.length - i,
        });
      });
    }
  }

  _handleOutOfMaxRangeValue(hand, max) {
    this._updateHand(hand, this._maxTranslation);

    if (this._options.tooltip) {
      this.activeTooltipValue.innerText = max;
    }
  }

  _handleOutOfMinRangeValue(hand, min) {
    this._updateHand(hand, this._minTranslation);

    if (this._options.tooltip) {
      this.activeTooltipValue.innerText = min;
    }
  }

  _handleNormalMove(hand, translation, value) {
    this._updateHand(hand, translation);

    if (this._options.tooltip) {
      this.activeTooltipValue.innerText = Math.round(value);
    }
  }

  _handleClickEventOnHand() {
    const { max, min, step } = this._options;

    this.hands.forEach((hand) => {
      EventHandlerMulti.on(hand, "mousedown touchstart", (ev) => {
        this._mousemove = true;

        hand.setAttribute(ATTR_STATE_ACTIVE, "");

        if (this._options.tooltip) {
          hand.children[1].setAttribute(ATTR_STATE_ACTIVE, "");
        }

        this._handleMoveEvent(hand);
        this._handleEndMoveEvent(hand, ev);

        if (!this._canChangeStep && step !== null) {
          return;
        }

        const translation =
          getEventTypeClientX(ev) - this.leftConnectRect - hand.offsetWidth / 2;

        const value =
          ((getEventTypeClientX(ev) - this.leftConnectRect) /
            (this.connect.offsetWidth / (max - min))) %
          (max - min);

        if (translation >= this._maxTranslation) {
          this._handleOutOfMaxRangeValue(hand, max);
        } else if (translation <= this._minTranslation) {
          this._handleOutOfMinRangeValue(hand, min);
        } else {
          this._handleNormalMove(hand, translation, value);
        }
      });
    });
  }

  _setContainerClasses() {
    Manipulator.addClass(this._element, this._classes.container);
  }

  _setRangeConnectsElement() {
    this._element.insertAdjacentHTML(
      "afterbegin",
      getConnectsTemplate(
        {
          connectContainer: this._classes.connectContainer,
          connect: this._classes.connect,
        },
        ATTR_CONNECT_REF
      )
    );
  }

  _setRangeHandleElements() {
    for (let i = 0; i < this._options.numberOfRanges; i++) {
      this._element.insertAdjacentHTML(
        "beforeend",
        getHandleTemplate({ hand: this._classes.hand }, ATTR_HAND_REF)
      );
    }

    this.hands.forEach((hand, i) => {
      hand.setAttribute("aria-orientation", "horizontal");
      hand.setAttribute("role", "slider");

      Manipulator.setDataAttribute(hand, "handle", i);
    });
  }

  _setTooltipToHand() {
    if (this._options.tooltip) {
      this.hands.forEach((hand) => {
        return hand.insertAdjacentHTML(
          "beforeend",
          getTooltipTemplate(
            {
              tooltip: this._classes.tooltip,
              tooltipValue: this._classes.tooltipValue,
            },
            ATTR_TOOLTIP_REF
          )
        );
      });
    }
  }

  _handleMoveEvent(hand) {
    const { tooltip, step } = this._options;

    EventHandlerMulti.on(document, "mousemove touchmove", (ev) => {
      if (ev.type === "mousemove") {
        ev.preventDefault();
      }

      const { max, min, numberOfRanges } = this._options;

      if (hand.hasAttribute(ATTR_STATE_ACTIVE)) {
        const maxValue =
          ((getEventTypeClientX(ev) - this.leftConnectRect) /
            this.connect.offsetWidth) *
          max;

        let value =
          (((getEventTypeClientX(ev) - this.leftConnectRect) /
            (this.connect.offsetWidth / (max - min))) %
            (max - min)) +
          min;

        if (
          (this._currentStepValue === Math.round(value) ||
            Math.round(value) % step !== 0) &&
          step !== null
        ) {
          this._canChangeStep = false;
          return;
        }

        this._canChangeStep = true;

        let translation =
          getEventTypeClientX(ev) - this.leftConnectRect - hand.offsetWidth / 2;

        const handActiveHandle = Manipulator.getDataAttribute(
          this.handActive,
          "handle"
        );

        const handActiveTranslation = Manipulator.getDataAttribute(
          this.handActive,
          "translation"
        );
        if (value < min) {
          translation = min - hand.offsetWidth / 2;
          value = min;
        } else if (maxValue >= max) {
          return;
        }

        const handleDataTranslate = this.hands.map((hand) =>
          Manipulator.getDataAttribute(hand, "translation")
        );

        if (numberOfRanges < 2) {
          if (Math.round(value) % step === 0 && step !== null) {
            this._currentStepValue = Math.round(value);

            Manipulator.addStyle(hand, {
              transform: `translate(${translation}px,-25%)`,
            });

            if (tooltip) {
              this.activeTooltipValue.innerText = Math.round(value);
            }
          } else if (step === null) {
            Manipulator.addStyle(hand, {
              transform: `translate(${translation}px,-25%)`,
            });

            if (tooltip) {
              this.activeTooltipValue.innerText = Math.round(value);
            }
          }
          Manipulator.setDataAttribute(hand, "translation", translation);
        } else {
          const isWithinBounds =
            handActiveHandle > 0 && handActiveHandle < numberOfRanges - 1;
          let newPosition = translation;
          let canChangeTranslation = false;

          const nextTranslation = handleDataTranslate[handActiveHandle + 1];
          const prevTranslation = handleDataTranslate[handActiveHandle - 1];

          if (
            handActiveHandle === 0 &&
            handActiveTranslation >= nextTranslation
          ) {
            newPosition = nextTranslation;
            canChangeTranslation = translation <= newPosition;
          } else if (
            handActiveHandle === numberOfRanges - 1 &&
            handActiveTranslation <= prevTranslation
          ) {
            newPosition = prevTranslation;
            canChangeTranslation = translation >= newPosition;
          } else if (
            isWithinBounds &&
            (handActiveTranslation >= nextTranslation ||
              handActiveTranslation <= prevTranslation)
          ) {
            newPosition =
              handActiveTranslation >= nextTranslation
                ? nextTranslation
                : prevTranslation;
            canChangeTranslation =
              newPosition === nextTranslation
                ? translation <= newPosition
                : translation >= newPosition;
          }

          if (Math.round(value) % step === 0 && step !== null) {
            this._currentStepValue = Math.round(value);

            Manipulator.addStyle(hand, {
              transform: `translate(${newPosition}px,-25%)`,
            });
            if (
              tooltip &&
              newPosition === translation &&
              this.activeTooltipValue !== null
            ) {
              this.activeTooltipValue.innerText = Math.round(value);
            }
          } else if (step === null) {
            Manipulator.addStyle(hand, {
              transform: `translate(${newPosition}px,-25%)`,
            });
            if (
              tooltip &&
              newPosition === translation &&
              this.activeTooltipValue !== null
            ) {
              this.activeTooltipValue.innerText = Math.round(value);
            }
          }

          Manipulator.setDataAttribute(
            hand,
            "translation",
            canChangeTranslation ? translation : newPosition
          );
        }

        this._canChangeStep && this._handleEventChangeValuesOnRange();
      }
    });
  }

  _handleEventChangeValuesOnRange() {
    const { max, min, numberOfRanges } = this._options;

    const calculateValue = (hand) => {
      const translation =
        hand.getBoundingClientRect().left -
        this.leftConnectRect +
        hand.offsetWidth / 2;

      let value =
        (translation / (this.connect.offsetWidth / (max - min))) % (max - min);

      if (translation === this.connect.offsetWidth) {
        value = max;
      } else {
        value += min;
      }

      Manipulator.setDataAttribute(hand, "value", Math.round(value * 10) / 10);

      return { value };
    };

    if (numberOfRanges < 2) {
      const { value } = calculateValue(this.hands[0]);

      EventHandler.trigger(this._element, EVENT_VALUE_CHANGED, {
        values: { value: value + min, rounded: Math.round(value + min) },
      });

      return;
    }

    const valuesArray = this.hands.map((hand) => calculateValue(hand));

    EventHandler.trigger(this._element, EVENT_VALUE_CHANGED, {
      values: {
        value: valuesArray.map(({ value }) => value + min),
        rounded: valuesArray.map(({ value }) => Math.round(value + min)),
      },
    });
  }

  _resetHandState(hand, eventType) {
    EventHandler.off(hand, eventType);
    hand.removeAttribute(ATTR_STATE_ACTIVE);

    if (this._options.tooltip) {
      hand.children[1].removeAttribute(ATTR_STATE_ACTIVE);
    }
  }

  _handleEndMoveEventDocument() {
    EventHandlerMulti.on(document, "mouseup touchend", () => {
      if (this._mousemove) {
        this.hands.forEach((hand) => {
          this._resetHandState(hand, "mousemove");
        });

        EventHandlerMulti.off(document, "mousemove touchmove");

        this._mousemove = false;
      }
    });
  }

  _handleEndMoveEvent(hand) {
    EventHandlerMulti.on(hand, "mouseup touchend", () => {
      this._resetHandState(hand, "mousemove");

      EventHandlerMulti.off(document, "mousemove touchmove");

      this._mousemove = false;
    });
  }

  _handleClickOnRange() {
    if (this._options.step !== null) {
      return;
    }

    EventHandlerMulti.on(this.connect, "mousedown touchstart", (ev) => {
      const arr = [];
      let index = 0;

      this.hands.forEach((hand) => {
        this._mousemove = true;

        const eventTypeClientX = getEventTypeClientX(ev);
        const handWidth = hand.offsetWidth;
        const handTranslation = Manipulator.getDataAttribute(
          hand,
          "translation"
        );
        const translation =
          eventTypeClientX - this.leftConnectRect - handWidth / 2;

        if (this._options.numberOfRanges < 2) {
          this._updateHand(hand, translation);
        } else {
          arr.push(Math.abs(translation - handTranslation));

          arr.forEach((item, i) => {
            if (item < arr[index]) {
              index = i;
            }
          });
        }
      });

      if (this._options.numberOfRanges >= 2) {
        const translation =
          getEventTypeClientX(ev) -
          this.leftConnectRect -
          this.hands[index].offsetWidth / 2;

        this._updateAdjacentHands(index, translation);
      }

      this._handleEventChangeValuesOnRange();
    });
  }

  _updateHand(hand, translation) {
    Manipulator.addStyle(hand, {
      transform: `translate(${translation}px,-25%)`,
    });
    Manipulator.setDataAttribute(hand, "translation", translation);
  }

  _updateAdjacentHands(index, translation) {
    const nextHand = this.hands[index + 1];
    const prevHand = this.hands[index - 1];

    const translationNext = nextHand
      ? Manipulator.getDataAttribute(nextHand, "translation")
      : undefined;
    const translationPrev = prevHand
      ? Manipulator.getDataAttribute(prevHand, "translation")
      : undefined;

    if (nextHand && translation > translationNext) {
      this._updateHand(nextHand, translation);
    } else if (prevHand && translation < translationPrev) {
      this._updateHand(prevHand, translation);
    } else {
      this._updateHand(this.hands[index], translation);
    }
  }

  _getConfig(options) {
    const config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...options,
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

  static jQueryInterface(config, options) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;

      if (!data && /dispose|hide/.test(config)) {
        return;
      }

      if (!data) {
        data = new MultiRangeSlider(this, _config);
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

export default MultiRangeSlider;
