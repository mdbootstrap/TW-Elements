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

import Data from "../dom/data";
import EventHandler from "../dom/event-handler";
import SelectorEngine from "../dom/selector-engine";
import Manipulator from "../dom/manipulator";
import { typeCheckConfig } from "../util/index";
import {
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW,
  DOWN_ARROW,
  HOME,
  END,
  ENTER,
  SPACE,
  TAB,
} from "../util/keycodes";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "stepper";
const DATA_KEY = "te.stepper";
const EVENT_KEY = `.${DATA_KEY}`;
const REF = `data-te-${NAME}`;

const STEPPER_HORIZONTAL = "horizontal";
const STEPPER_VERTICAL = "vertical";

const EVENT_CHANGE_STEP = `onChangeStep${EVENT_KEY}`;
const EVENT_CHANGED_STEP = `onChangedStep${EVENT_KEY}`;

const DefaultType = {
  stepperType: "string",
  stepperLinear: "boolean",
  stepperNoEditable: "boolean",
  stepperActive: "string",
  stepperCompleted: "string",
  stepperInvalid: "string",
  stepperDisabled: "string",
  stepperVerticalBreakpoint: "number",
  stepperMobileBreakpoint: "number",
  stepperMobileBarBreakpoint: "number",
  stepperAnimationDuration: "number",
  slideInLeftAnimation: "string",
  slideOutLeftAnimation: "string",
  slideInRightAnimation: "string",
  slideOutRightAnimation: "string",
};

const Default = {
  stepperType: STEPPER_HORIZONTAL,
  stepperLinear: false,
  stepperNoEditable: false,
  stepperActive: "",
  stepperCompleted: "",
  stepperInvalid: "",
  stepperDisabled: "",
  stepperVerticalBreakpoint: 0,
  stepperMobileBreakpoint: 0,
  stepperMobileBarBreakpoint: 4,
  stepperAnimationDuration: 800,
  slideInLeftAnimation: "animate-[slide-in-left_0.8s_both]",
  slideOutLeftAnimation: "animate-[slide-out-left_0.8s_both]",
  slideInRightAnimation: "animate-[slide-in-right_0.8s_both]",
  slideOutRightAnimation: "animate-[slide-out-right_0.8s_both]",
};

const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_KEYUP = `keyup${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;

const STEP_REF = `[${REF}-step-ref]`;
const HEAD_REF = `[${REF}-head-ref]`;
const HEAD_TEXT_REF = `[${REF}-head-text-ref]`;
const HEAD_ICON_REF = `[${REF}-head-icon-ref]`;
const CONTENT_REF = `[${REF}-content-ref]`;

class Stepper {
  constructor(element, options) {
    this._element = element;
    this._options = this._getConfig(options);
    this._elementHeight = 0;
    this._steps = SelectorEngine.find(`${STEP_REF}`, this._element);
    this._currentView = "";
    this._activeStepIndex = 0;
    this._verticalStepperStyles = [];
    this._timeout = 0;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
      this._init();
    }
  }

  // Getters
  static get NAME() {
    return NAME;
  }

  get activeStep() {
    return this._steps[this._activeStepIndex];
  }

  get activeStepIndex() {
    return this._activeStepIndex;
  }

  // Public

  dispose() {
    this._steps.forEach((el) => {
      EventHandler.off(el, EVENT_MOUSEDOWN);
      EventHandler.off(el, EVENT_KEYDOWN);
    });

    EventHandler.off(window, EVENT_RESIZE);

    Data.removeData(this._element, DATA_KEY);
    this._element = null;
  }

  changeStep(index) {
    this._toggleStep(index);
  }

  nextStep() {
    this._toggleStep(this._activeStepIndex + 1);
  }

  previousStep() {
    this._toggleStep(this._activeStepIndex - 1);
  }

  // Private
  _init() {
    const activeStep = SelectorEngine.find(`${STEP_REF}`, this._element)[
      this._activeStepIndex
    ].setAttribute("data-te", "active-step");
    const stepperHeadText = SelectorEngine.find(
      `${HEAD_TEXT_REF}`,
      this._element
    );
    const stepperHeadIcon = SelectorEngine.find(
      `${HEAD_ICON_REF}`,
      this._element
    );

    if (activeStep) {
      this._activeStepIndex = this._steps.indexOf(activeStep);
      this._toggleStepClass(
        this._activeStepIndex,
        "add",
        this._options.stepperActive
      );

      stepperHeadText[this._activeStepIndex].classList.add("font-medium");
      stepperHeadIcon[this._activeStepIndex].classList.add("!bg-primary-100");
      stepperHeadIcon[this._activeStepIndex].classList.add("!text-primary-700");
    } else {
      stepperHeadText[this._activeStepIndex].classList.add("font-medium");
      stepperHeadIcon[this._activeStepIndex].classList.add("!bg-primary-100");
      stepperHeadIcon[this._activeStepIndex].classList.add("!text-primary-700");
      this._toggleStepClass(
        this._activeStepIndex,
        "add",
        this._options.stepperActive
      );
    }

    this._bindMouseDown();
    this._bindKeysNavigation();

    switch (this._options.stepperType) {
      case STEPPER_VERTICAL:
        this._toggleVertical();
        break;
      default:
        this._toggleHorizontal();
        break;
    }

    if (
      this._options.stepperVerticalBreakpoint ||
      this._options.stepperMobileBreakpoint
    ) {
      this._toggleStepperView();
    }

    this._bindResize();
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

  _bindMouseDown() {
    this._steps.forEach((el) => {
      const stepHead = SelectorEngine.findOne(`${HEAD_REF}`, el);

      EventHandler.on(stepHead, EVENT_MOUSEDOWN, (e) => {
        const step = SelectorEngine.parents(e.target, `${STEP_REF}`)[0];
        const stepIndex = this._steps.indexOf(step);

        e.preventDefault();
        this._toggleStep(stepIndex);
      });
    });
  }

  _bindResize() {
    EventHandler.on(window, EVENT_RESIZE, () => {
      if (this._currentView === STEPPER_VERTICAL) {
        this._setSingleStepHeight(this.activeStep);
      }

      if (this._currentView === STEPPER_HORIZONTAL) {
        this._setHeight(this.activeStep);
      }

      if (
        this._options.stepperVerticalBreakpoint ||
        this._options.stepperMobileBreakpoint
      ) {
        this._toggleStepperView();
      }
    });
  }

  _toggleStepperView() {
    const shouldBeHorizontal =
      this._options.stepperVerticalBreakpoint < window.innerWidth;
    const shouldBeVertical =
      this._options.stepperVerticalBreakpoint > window.innerWidth;
    const shouldBeMobile =
      this._options.stepperMobileBreakpoint > window.innerWidth;

    if (shouldBeHorizontal && this._currentView !== STEPPER_HORIZONTAL) {
      this._toggleHorizontal();
    }

    if (
      shouldBeVertical &&
      !shouldBeMobile &&
      this._currentView !== STEPPER_VERTICAL
    ) {
      this._steps.forEach((el) => {
        const stepContent = SelectorEngine.findOne(`${CONTENT_REF}`, el);

        this._resetStepperHeight();
        this._showElement(stepContent);
      });

      this._toggleVertical();
    }
  }

  _toggleStep(index) {
    if (this._activeStepIndex === index) {
      return;
    }

    if (this._options.stepperNoEditable) {
      this._toggleDisabled();
    }

    const activeStepIndex = this._activeStepIndex;

    const changeStepEvent = EventHandler.trigger(
      this.activeStep,
      EVENT_CHANGE_STEP,
      {
        currentStep: this._activeStepIndex,
        nextStep: index,
      }
    );

    if (index > this._activeStepIndex && changeStepEvent.defaultPrevented) {
      return;
    }

    this._showElement(
      SelectorEngine.findOne(`${CONTENT_REF}`, this._steps[index])
    );
    this._toggleActive(index);

    if (index > this._activeStepIndex) {
      this._toggleCompleted(this._activeStepIndex);
    }

    if (this._currentView === STEPPER_HORIZONTAL) {
      this._animateHorizontalStep(index);
    } else {
      this._animateVerticalStep(index);
      this._setSingleStepHeight(this._steps[index]);
    }

    this._toggleStepTabIndex(
      SelectorEngine.findOne(`${HEAD_REF}`, this.activeStep),
      SelectorEngine.findOne(`${HEAD_REF}`, this._steps[index])
    );

    this._activeStepIndex = index;

    this._steps[this._activeStepIndex].setAttribute("data-te", "active-step");
    this._steps.forEach((step, index) => {
      if (step[this._activeStepIndex] !== index) {
        step.removeAttribute("data-te");
      }
    });

    EventHandler.trigger(this.activeStep, EVENT_CHANGED_STEP, {
      currentStep: this._activeStepIndex,
      prevStep: activeStepIndex,
    });
  }

  _resetStepperHeight() {
    this._element.style.height = "";
  }

  _setStepsHeight() {
    this._steps.forEach((el) => {
      const stepContent = SelectorEngine.findOne(`${CONTENT_REF}`, el);
      const stepComputed = window.getComputedStyle(stepContent);
      this._verticalStepperStyles.push({
        paddingTop: parseFloat(stepComputed.paddingTop),
        paddingBottom: parseFloat(stepComputed.paddingBottom),
      });
      const stepHeight = stepContent.scrollHeight;
      stepContent.style.height = `${stepHeight}px`;
    });
  }

  _setSingleStepHeight(step) {
    const stepContent = SelectorEngine.findOne(`${CONTENT_REF}`, step);
    const isActiveStep = this.activeStep === step;
    const stepIndex = this._steps.indexOf(step);
    let stepContentHeight;

    if (!isActiveStep) {
      stepContentHeight =
        stepContent.scrollHeight +
        this._verticalStepperStyles[stepIndex].paddingTop +
        this._verticalStepperStyles[stepIndex].paddingBottom;
    } else {
      stepContent.style.height = "";
      stepContentHeight = stepContent.scrollHeight;
    }

    stepContent.style.height = `${stepContentHeight}px`;
  }

  _toggleVertical() {
    this._currentView = STEPPER_VERTICAL;

    this._setStepsHeight();
    this._hideInactiveSteps();
  }

  _toggleHorizontal() {
    this._currentView = STEPPER_HORIZONTAL;

    this._setHeight(this.activeStep);
    this._hideInactiveSteps();
  }

  _toggleStepperClass() {
    const vertical = SelectorEngine.findOne(
      "[data-te-stepper-type]",
      this._element
    );

    if (vertical !== null) {
      this._steps.forEach((el) => {
        SelectorEngine.findOne(`${CONTENT_REF}`, el).classList.remove("!my-0");
        SelectorEngine.findOne(`${CONTENT_REF}`, el).classList.remove("!py-0");
        SelectorEngine.findOne(`${CONTENT_REF}`, el).classList.remove("!h-0");
      });
    }
  }

  _toggleStepClass(index, action, className) {
    // condition to prevent errors if the user has not set any custom classes like active, disabled etc.
    if (className) {
      this._steps[index].classList[action](className);
    }
  }

  _bindKeysNavigation() {
    this._toggleStepTabIndex(
      false,
      SelectorEngine.findOne(`${HEAD_REF}`, this.activeStep)
    );

    this._steps.forEach((el) => {
      const stepHead = SelectorEngine.findOne(`${HEAD_REF}`, el);

      EventHandler.on(stepHead, EVENT_KEYDOWN, (e) => {
        const focusedStep = SelectorEngine.parents(
          e.currentTarget,
          `${STEP_REF}`
        )[0];
        const nextStep = SelectorEngine.next(focusedStep, `${STEP_REF}`)[0];
        const prevStep = SelectorEngine.prev(focusedStep, `${STEP_REF}`)[0];
        const focusedStepHead = SelectorEngine.findOne(
          `${HEAD_REF}`,
          focusedStep
        );
        const activeStepHead = SelectorEngine.findOne(
          `${HEAD_REF}`,
          this.activeStep
        );
        let nextStepHead = null;
        let prevStepHead = null;

        if (nextStep) {
          nextStepHead = SelectorEngine.findOne(`${HEAD_REF}`, nextStep);
        }

        if (prevStep) {
          prevStepHead = SelectorEngine.findOne(`${HEAD_REF}`, prevStep);
        }

        if (
          e.keyCode === LEFT_ARROW &&
          this._currentView !== STEPPER_VERTICAL
        ) {
          if (prevStepHead) {
            this._toggleStepTabIndex(focusedStepHead, prevStepHead);
            this._toggleOutlineStyles(focusedStepHead, prevStepHead);

            prevStepHead.focus();
          } else if (nextStepHead) {
            this._toggleStepTabIndex(focusedStepHead, nextStepHead);
            this._toggleOutlineStyles(focusedStepHead, nextStepHead);

            nextStepHead.focus();
          }
        }

        if (
          e.keyCode === RIGHT_ARROW &&
          this._currentView !== STEPPER_VERTICAL
        ) {
          if (nextStepHead) {
            this._toggleStepTabIndex(focusedStepHead, nextStepHead);
            this._toggleOutlineStyles(focusedStepHead, nextStepHead);

            nextStepHead.focus();
          } else if (prevStepHead) {
            this._toggleStepTabIndex(focusedStepHead, prevStepHead);
            this._toggleOutlineStyles(focusedStepHead, prevStepHead);

            prevStepHead.focus();
          }
        }

        if (
          e.keyCode === DOWN_ARROW &&
          this._currentView === STEPPER_VERTICAL
        ) {
          e.preventDefault();

          if (nextStepHead) {
            this._toggleStepTabIndex(focusedStepHead, nextStepHead);
            this._toggleOutlineStyles(focusedStepHead, nextStepHead);

            nextStepHead.focus();
          }
        }

        if (e.keyCode === UP_ARROW && this._currentView === STEPPER_VERTICAL) {
          e.preventDefault();

          if (prevStepHead) {
            this._toggleStepTabIndex(focusedStepHead, prevStepHead);
            this._toggleOutlineStyles(focusedStepHead, prevStepHead);

            prevStepHead.focus();
          }
        }

        if (e.keyCode === HOME) {
          const firstStepHead = SelectorEngine.findOne(
            `${HEAD_REF}`,
            this._steps[0]
          );

          this._toggleStepTabIndex(focusedStepHead, firstStepHead);
          this._toggleOutlineStyles(focusedStepHead, firstStepHead);

          firstStepHead.focus();
        }

        if (e.keyCode === END) {
          const lastStep = this._steps[this._steps.length - 1];
          const lastStepHead = SelectorEngine.findOne(`${HEAD_REF}`, lastStep);
          this._toggleStepTabIndex(focusedStepHead, lastStepHead);
          this._toggleOutlineStyles(focusedStepHead, lastStepHead);

          lastStepHead.focus();
        }

        if (e.keyCode === ENTER || e.keyCode === SPACE) {
          e.preventDefault();

          this.changeStep(this._steps.indexOf(focusedStep));
        }

        if (e.keyCode === TAB) {
          this._toggleStepTabIndex(focusedStepHead, activeStepHead);
          this._toggleOutlineStyles(focusedStepHead, false);

          activeStepHead.focus();
        }
      });

      EventHandler.on(stepHead, EVENT_KEYUP, (e) => {
        const focusedStep = SelectorEngine.parents(
          e.currentTarget,
          `${STEP_REF}`
        )[0];
        const focusedStepHead = SelectorEngine.findOne(
          `${HEAD_REF}`,
          focusedStep
        );
        const activeStepHead = SelectorEngine.findOne(
          `${HEAD_REF}`,
          this.activeStep
        );

        if (e.keyCode === TAB) {
          this._toggleStepTabIndex(focusedStepHead, activeStepHead);
          this._toggleOutlineStyles(false, activeStepHead);

          activeStepHead.focus();
        }
      });
    });
  }

  _toggleStepTabIndex(focusedElement, newTarget) {
    if (focusedElement) {
      focusedElement.setAttribute("tabIndex", -1);
    }

    if (newTarget) {
      newTarget.setAttribute("tabIndex", 0);
    }
  }

  _toggleOutlineStyles(focusedElement, newTarget) {
    if (focusedElement) {
      focusedElement.style.outline = "";
    }

    if (newTarget) {
      newTarget.style.outline = "revert";
    }
  }

  _toggleDisabled() {
    const stepperHead = SelectorEngine.find(`${HEAD_REF}`, this._element);
    const stepperHeadIcon = SelectorEngine.find(
      `${HEAD_ICON_REF}`,
      this._element
    );

    stepperHead[this._activeStepIndex].classList.add("color-[#858585]");
    stepperHead[this._activeStepIndex].classList.add("cursor-default");
    stepperHeadIcon[this._activeStepIndex].classList.add("!bg-[#858585]");
    this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperDisabled
    );
  }

  _toggleActive(index) {
    const stepperHeadText = SelectorEngine.find(
      `${HEAD_TEXT_REF}`,
      this._element
    );
    const stepperHeadIcon = SelectorEngine.find(
      `${HEAD_ICON_REF}`,
      this._element
    );

    stepperHeadText[index].classList.add("font-medium");
    stepperHeadIcon[index].classList.add("!bg-primary-100");
    stepperHeadIcon[index].classList.add("!text-primary-700");
    stepperHeadIcon[index].classList.remove("!bg-success-100");
    stepperHeadIcon[index].classList.remove("!text-success-700");

    stepperHeadText[this._activeStepIndex].classList.remove("font-medium");
    stepperHeadIcon[this._activeStepIndex].classList.remove("!bg-primary-100");
    stepperHeadIcon[this._activeStepIndex].classList.remove(
      "!text-primary-700"
    );

    this._toggleStepClass(index, "add", this._options.stepperActive);
    this._toggleStepClass(
      this._activeStepIndex,
      "remove",
      this._options.stepperActive
    );
  }

  _toggleCompleted(index) {
    const stepperHeadIcon = SelectorEngine.find(
      `${HEAD_ICON_REF}`,
      this._element
    );

    if (!this._options.stepperNoEditable) {
      stepperHeadIcon[index].classList.add("!bg-success-100");
      stepperHeadIcon[index].classList.add("!text-success-700");
    } else {
      this._steps[index].classList.add("pointer-events-none");
    }

    stepperHeadIcon[index].classList.remove("!bg-danger-100");
    stepperHeadIcon[index].classList.remove("!text-danger-700");

    this._toggleStepClass(index, "add", this._options.stepperCompleted);
    this._toggleStepClass(index, "remove", this._options.stepperInvalid);
  }

  _hideInactiveSteps() {
    this._steps.forEach((el) => {
      if (!el.getAttribute("data-te")) {
        const content = SelectorEngine.findOne(`${CONTENT_REF}`, el);
        content.classList.remove("translate-x-[150%]");
        this._hideElement(content);
      }
    });
  }

  _setHeight(stepElement) {
    const stepContent = SelectorEngine.findOne(`${CONTENT_REF}`, stepElement);
    const contentStyle = getComputedStyle(stepContent);
    const stepHead = SelectorEngine.findOne(`${HEAD_REF}`, stepElement);

    const headStyle = getComputedStyle(stepHead);
    const stepContentHeight =
      stepContent.offsetHeight +
      parseFloat(contentStyle.marginTop) +
      parseFloat(contentStyle.marginBottom);

    const stepHeadHeight =
      stepHead.offsetHeight +
      parseFloat(headStyle.marginTop) +
      parseFloat(headStyle.marginBottom);

    this._element.style.height = `${stepHeadHeight + stepContentHeight}px`;
  }

  _hideElement(stepContent) {
    const isActive = SelectorEngine.parents(
      stepContent,
      `${STEP_REF}`
    )[0].getAttribute("data-te");

    // prevent hiding during a quick step change
    if (!isActive && this._currentView !== STEPPER_VERTICAL) {
      stepContent.style.display = "none";
    } else {
      stepContent.classList.add("!my-0");
      stepContent.classList.add("!py-0");
      stepContent.classList.add("!h-0");
    }
  }

  _showElement(stepContent) {
    if (this._currentView === STEPPER_VERTICAL) {
      stepContent.classList.remove("!my-0");
      stepContent.classList.remove("!py-0");
      stepContent.classList.remove("!h-0");
    } else {
      stepContent.style.display = "block";
    }
  }

  _animateHorizontalStep(index) {
    clearTimeout(this._timeout);
    this._clearStepsAnimation();

    const isForward = index > this._activeStepIndex;
    const nextStepContent = SelectorEngine.findOne(
      `${CONTENT_REF}`,
      this._steps[index]
    );
    const activeStepContent = SelectorEngine.findOne(
      `${CONTENT_REF}`,
      this.activeStep
    );

    let nextStepAnimation;
    let activeStepAnimation;

    this._steps.forEach((el, i) => {
      const stepContent = SelectorEngine.findOne(`${CONTENT_REF}`, el);

      if (i !== index && i !== this._activeStepIndex) {
        this._hideElement(stepContent);
      }
    });

    if (isForward) {
      activeStepAnimation = this._options.slideOutLeftAnimation;
      nextStepAnimation = this._options.slideInRightAnimation;
    } else {
      activeStepAnimation = this._options.slideOutRightAnimation;
      nextStepAnimation = this._options.slideInLeftAnimation;
    }

    activeStepContent.classList.add(activeStepAnimation);
    nextStepContent.classList.add(nextStepAnimation);

    this._setHeight(this._steps[index]);

    this._timeout = setTimeout(() => {
      this._hideElement(activeStepContent);
      this._clearStepsAnimation();
    }, this._options.stepperAnimationDuration);
  }

  _clearStepsAnimation() {
    this._steps.forEach((el) => {
      const step = SelectorEngine.findOne(`${CONTENT_REF}`, el);
      step.classList.remove(
        this._options.slideInLeftAnimation,
        this._options.slideOutLeftAnimation,
        this._options.slideInRightAnimation,
        this._options.slideOutRightAnimation
      );
    });
  }

  _animateVerticalStep(index) {
    const nextStepContent = SelectorEngine.findOne(
      `${CONTENT_REF}`,
      this._steps[index]
    );
    const activeStepContent = SelectorEngine.findOne(
      `${CONTENT_REF}`,
      this.activeStep
    );

    this._hideElement(activeStepContent);
    this._showElement(nextStepContent);
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

export default Stepper;
