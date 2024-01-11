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
import Validation from "../forms/validation/validation";
import BaseComponent from "../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "stepper";
const ATTR_NAME = `data-te-${NAME}`;
const DATA_KEY = "te.stepper";
const EVENT_KEY = `.${DATA_KEY}`;

const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_KEYUP = `keyup${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK = `click${EVENT_KEY}`;
const EVENT_SUBMIT = `submit${EVENT_KEY}`;
const EVENT_STEP_CHANGE = `stepChange${EVENT_KEY}`;
const EVENT_STEP_CHANGED = `stepChanged${EVENT_KEY}`;
const EVENT_INVALID = `stepInvalid${EVENT_KEY}`;
const EVENT_VALID = `stepValid${EVENT_KEY}`;

const ATTR_STEP_REF = `[${ATTR_NAME}-step-ref]`;
const ATTR_HEAD_REF = `[${ATTR_NAME}-head-ref]`;
const ATTR_HEAD_TEXT_REF = `[${ATTR_NAME}-head-text-ref]`;
const ATTR_HEAD_ICON_REF = `[${ATTR_NAME}-head-icon-ref]`;
const ATTR_CONTENT_REF = `[${ATTR_NAME}-content-ref]`;
const ATTR_STEP_INVALID = `${ATTR_NAME}-step-invalid`;
const ATTR_STEP_COMPLETED = `${ATTR_NAME}-step-completed`;
const ATTR_STEP_DISABLED = `${ATTR_NAME}-step-disabled`;
const ATTR_ACTIVE_STEP = `${ATTR_NAME}-step-active`;
const ATTR_VALIDATION_VALIDATE_ELEMENTS = `[data-te-validate]`;
const ATTR_VALIDATION_VALIDATED = `data-te-validated`;
const ATTR_VALIDATION_STYLING = `data-te-validation-styling`;
const ATTR_VALIDATION_STATE = `data-te-validation-state`;

const ATTR_MOBILE_HEADER_REF = `${ATTR_NAME}-mobile-header-ref`;
const ATTR_MOBILE_FOOTER_REF = `${ATTR_NAME}-mobile-footer-ref`;

const ATTR_MOBILE_BTN_NEXT_REF = `${ATTR_NAME}-mobile-btn-next-ref`;
const ATTR_MOBILE_BTN_BACK_REF = `${ATTR_NAME}-mobile-btn-back-ref`;
const ATTR_MOBILE_ACTIVE_STEP_REF = `${ATTR_NAME}-mobile-active-step-ref`;
const ATTR_MOBILE_ALL_STEPS_REF = `${ATTR_NAME}-mobile-all-steps-ref`;
const ATTR_MOBILE_PROGRESS_BAR_REF = `${ATTR_NAME}-mobile-progress-bar-ref`;

const STEPPER_HORIZONTAL = "horizontal";
const STEPPER_VERTICAL = "vertical";
const STEPPER_MOBILE = "mobile";

const Default = {
  stepperType: STEPPER_HORIZONTAL,
  stepperLinear: false,
  stepperNoEditable: false,
  stepperHeadClick: true,
  stepperVerticalBreakpoint: 0,
  stepperMobileBreakpoint: 0,
  stepperMobileBarBreakpoint: 4,
  stepperAnimationDuration: 800,
  slideInLeftAnimation: "animate-[slide-in-left_0.8s_both]",
  slideOutLeftAnimation: "animate-[slide-out-left_0.8s_both]",
  slideInRightAnimation: "animate-[slide-in-right_0.8s_both]",
  slideOutRightAnimation: "animate-[slide-out-right_0.8s_both]",
  stepperMobileStepTxt: "step",
  stepperMobileOfTxt: "of",
  stepperMobileNextBtn: "NEXT",
  stepperMobileBackBtn: "BACK",
  stepperMobileNextBtnIcon: ` 
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>`,
  stepperMobileBackBtnIcon: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>`,
};

const DefaultType = {
  stepperType: "string",
  stepperLinear: "boolean",
  stepperNoEditable: "boolean",
  stepperHeadClick: "boolean",
  stepperVerticalBreakpoint: "number",
  stepperMobileBreakpoint: "number",
  stepperMobileBarBreakpoint: "number",
  stepperAnimationDuration: "number",
  slideInLeftAnimation: "string",
  slideOutLeftAnimation: "string",
  slideInRightAnimation: "string",
  slideOutRightAnimation: "string",
  stepperMobileStepTxt: "string",
  stepperMobileOfTxt: "string",
  stepperMobileNextBtn: "string",
  stepperMobileBackBtn: "string",
  stepperMobileNextBtnIcon: "string",
  stepperMobileBackBtnIcon: "string",
};

const DefaultClasses = {
  activeStepHeadIcon:
    "!bg-primary-100 !text-primary-700 dark:!bg-[#0c1728] dark:!text-[#628dd5]",
  activeStepHeadText: "font-medium !text-black/[.55] dark:!text-white/[.55]",
  defaultStepHeadIcon: "bg-neutral-500 text-white",
  defaultStepHeadText: "text-black/[.55] dark:text-white/[.55]",
  disabledStepHead: "!cursor-default",
  disabledStepHeadText: "text-black/[.3] dark:text-white/[.3]",
  disabledStepHeadIcon: "bg-neutral-500 text-neutral-300 dark:text-white/50",
  invalidStepHeadIcon:
    "bg-danger-100 text-danger-700 dark:bg-[#2c0f14] dark:text-[#e37083]",
  invalidStepHeadText: "",
  completedStepHeadIcon:
    "bg-success-100 text-success-700 dark:bg-[#04210f] dark:text-[#72c894]",
  completedStepHeadText: "",
  mobileActiveStepHeadIcon: "!bg-primary",
  mobileDefaultStepHeadIcon: "bg-neutral-500",
  mobileCompletedStepHeadIcon: "bg-success",
  mobileDisabledStepHeadIcon: "bg-neutral-500",
  mobileInvalidStepHeadIcon: "bg-danger",
  mobileHeader:
    "absolute top-0 h-fit w-full bg-[#fbfbfb] px-4 py-2 dark:bg-neutral-700",
  mobileHeaderText: "text-base text-neutral-600 dark:text-white",
  mobileFooter:
    "absolute flex h-[40px] w-full items-center justify-between bg-[#fbfbfb] dark:bg-neutral-700",
  mobileBtnBack:
    "flex h-[40px] items-center justify-center rounded pl-4 pr-5 text-xs font-medium uppercase leading-normal text-neutral-600 transition duration-150 ease-in-out focus:text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-0 dark:text-white dark:focus:text-neutral-300 dark:hover:bg-zinc-600 dark:hover:bg-opacity-70",
  mobileBtnNext:
    "flex h-[40px] items-center justify-center rounded pl-5 pr-4 text-xs font-medium uppercase leading-normal text-neutral-600 transition duration-150 ease-in-out focus:text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-0 dark:text-white dark:focus:text-neutral-300 dark:hover:bg-zinc-600 dark:hover:bg-opacity-70",
  mobileBtnBackIcon: "pr-2 [&>svg]:h-[18px] [&>svg]:w-[18px]",
  mobileBtnNextIcon: "pl-2 [&>svg]:h-[18px] [&>svg]:w-[18px]",
  mobileProgressBarWrapper: "h-1 w-full bg-zinc-100 dark:bg-neutral-600",
  mobileProgressBar: "h-1 bg-primary-600",
};

const DefaultClassesType = {
  activeStepHeadIcon: "string",
  activeStepHeadText: "string",
  disabledStepHead: "string",
  disabledStepHeadIcon: "string",
  disabledStepHeadText: "string",
  invalidStepHeadIcon: "string",
  invalidStepHeadText: "string",
  completedStepHeadIcon: "string",
  completedStepHeadText: "string",
  defaultStepHeadIcon: "string",
  defaultStepHeadText: "string",
  mobileActiveStepHeadIcon: "string",
  mobileDefaultStepHeadIcon: "string",
  mobileCompletedStepHeadIcon: "string",
  mobileDisabledStepHeadIcon: "string",
  mobileInvalidStepHeadIcon: "string",
  mobileHeader: "string",
  mobileHeaderText: "string",
  mobileFooter: "string",
  mobileBtnBack: "string",
  mobileBtnNext: "string",
  mobileBtnBackIcon: "string",
  mobileBtnNextIcon: "string",
  mobileProgressBarWrapper: "string",
  mobileProgressBar: "string",
};

class Stepper extends BaseComponent {
  constructor(element, options, classes) {
    super(element);

    this._element = element;
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);
    this._elementHeight = 0;
    this._steps = SelectorEngine.find(`${ATTR_STEP_REF}`, this._element);
    this._currentView = "";
    this._activeStepIndex = 0;
    this._verticalStepperStyles = [];
    this._timeout = 0;
    this._isValid = false;
    this._isValidationInstance = false;
    this._isMobile = false;

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

  get validationElements() {
    const wrappersToValidate = [];
    const defaultValidationElements = [];

    this._steps.forEach((el) => {
      const wrappers = SelectorEngine.find(
        ATTR_VALIDATION_VALIDATE_ELEMENTS,
        el
      );
      const inputs = SelectorEngine.find("[required]", el);

      wrappersToValidate.push(wrappers);
      defaultValidationElements.push(inputs);
    });

    return { wrappersToValidate, defaultValidationElements };
  }

  get stepElements() {
    const stepperHead = SelectorEngine.find(`${ATTR_HEAD_REF}`, this._element);
    const stepperHeadText = SelectorEngine.find(
      `${ATTR_HEAD_TEXT_REF}`,
      this._element
    );
    const stepperHeadIcon = SelectorEngine.find(
      `${ATTR_HEAD_ICON_REF}`,
      this._element
    );

    if (this._options.stepperType === STEPPER_MOBILE) {
      this._isMobile = true;
    }

    const getStepHeadIconClasses = (baseClass, mobileClass) => {
      return this._isMobile ? mobileClass : baseClass;
    };

    const activeStepHeadIconClasses = getStepHeadIconClasses(
      this._classes.activeStepHeadIcon,
      this._classes.mobileActiveStepHeadIcon
    );

    const completedStepHeadIconClasses = getStepHeadIconClasses(
      this._classes.completedStepHeadIcon,
      this._classes.mobileCompletedStepHeadIcon
    );

    const invalidStepHeadIconClasses = getStepHeadIconClasses(
      this._classes.invalidStepHeadIcon,
      this._classes.mobileInvalidStepHeadIcon
    );

    const defaultStepHeadIconClasses = getStepHeadIconClasses(
      this._classes.defaultStepHeadIcon,
      this._classes.mobileDefaultStepHeadIcon
    );

    const disabledStepHeadIconClasses = getStepHeadIconClasses(
      this._classes.disabledStepHeadIcon,
      this._classes.mobileDisabledStepHeadIcon
    );

    return {
      stepperHead,
      stepperHeadText,
      stepperHeadIcon,
      activeStepHeadIconClasses,
      completedStepHeadIconClasses,
      defaultStepHeadIconClasses,
      disabledStepHeadIconClasses,
      invalidStepHeadIconClasses,
    };
  }

  // Public

  dispose() {
    this._steps.forEach((el) => {
      EventHandler.off(el, EVENT_MOUSEDOWN);
      EventHandler.off(el, EVENT_KEYDOWN);
    });

    EventHandler.off(window, EVENT_RESIZE);

    this._unbindMouseDown();

    super.dispose();
  }

  changeStep(index) {
    this._toggleStep(index);
  }

  nextStep() {
    this._toggleStep(this._activeStepIndex + 1);
  }

  prevStep() {
    this._toggleStep(this._activeStepIndex - 1);
  }

  resizeStepper() {
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
  }

  // Private
  _init() {
    const activeStep = SelectorEngine.find(`${ATTR_STEP_REF}`, this._element)[
      this._activeStepIndex
    ];
    activeStep.setAttribute(ATTR_ACTIVE_STEP, "");

    const {
      stepperHeadText,
      stepperHeadIcon,
      activeStepHeadIconClasses,
      defaultStepHeadIconClasses,
    } = this.stepElements;

    this._steps.forEach((el, index) => {
      if (el === activeStep) {
        this._toggleClasses(
          stepperHeadIcon[this._activeStepIndex],
          "addClass",
          activeStepHeadIconClasses
        );
        this._toggleClasses(
          stepperHeadText[this._activeStepIndex],
          "addClass",
          this._classes.activeStepHeadText
        );
      }

      this._toggleClasses(
        stepperHeadIcon[index],
        "addClass",
        defaultStepHeadIconClasses
      );
      this._toggleClasses(
        stepperHeadText[index],
        "addClass",
        this._classes.defaultStepHeadText
      );
    });

    this._setOptional();

    if (this._options.stepperHeadClick) {
      this._bindMouseDown();
    }

    this._bindKeysNavigation();

    switch (this._options.stepperType) {
      case STEPPER_VERTICAL:
        this._toggleVertical();
        break;
      case STEPPER_MOBILE:
        this._toggleMobile();
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

    if (this._options.stepperLinear) {
      this._setValidation();
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

  _bindMouseDown() {
    this._steps.forEach((el) => {
      const stepHead = SelectorEngine.findOne(`${ATTR_HEAD_REF}`, el);

      EventHandler.on(stepHead, EVENT_MOUSEDOWN, (e) => {
        const step = SelectorEngine.parents(e.target, `${ATTR_STEP_REF}`)[0];
        const stepIndex = this._steps.indexOf(step);

        e.preventDefault();

        this._toggleStep(stepIndex);
      });
    });
  }

  _unbindMouseDown() {
    this._steps.forEach((el) => {
      const stepHead = SelectorEngine.findOne(`${ATTR_HEAD_REF}`, el);

      EventHandler.off(stepHead, EVENT_MOUSEDOWN);
    });
  }

  _bindResize() {
    EventHandler.on(window, EVENT_RESIZE, () => {
      this.resizeStepper();
    });
  }

  _toggleStepperView() {
    const shouldBeHorizontal =
      this._options.stepperVerticalBreakpoint < window.innerWidth;
    const shouldBeVertical =
      this._options.stepperVerticalBreakpoint > window.innerWidth;
    const shouldBeMobile =
      this._options.stepperMobileBreakpoint > window.innerWidth;

    this._toggleClassesAtBreakpoints(shouldBeMobile);

    if (shouldBeHorizontal && this._currentView !== STEPPER_HORIZONTAL) {
      this._toggleHorizontal();

      this._isMobile = false;
    }

    if (
      shouldBeVertical &&
      !shouldBeMobile &&
      this._currentView !== STEPPER_VERTICAL
    ) {
      this._steps.forEach((el) => {
        const stepContent = SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el);

        this._resetStepperHeight();
        this._showElement(stepContent);
      });

      this._toggleVertical();
      this._isMobile = false;
    }

    if (shouldBeMobile && this._currentView !== STEPPER_MOBILE) {
      this._isMobile = true;
      this._toggleMobile();
    }
  }

  _toggleClassesAtBreakpoints(mobile) {
    const { stepperHeadIcon, stepperHeadText } = this.stepElements;

    const toggleHeadIconClasses = (index, removeClass, addClass) => {
      this._toggleClasses(stepperHeadIcon[index], "removeClass", removeClass);
      this._toggleClasses(stepperHeadIcon[index], "addClass", addClass);
    };

    this._steps.forEach((el, index) => {
      if (el.hasAttribute(ATTR_ACTIVE_STEP)) {
        toggleHeadIconClasses(
          index,
          mobile
            ? this._classes.activeStepHeadIcon
            : this._classes.mobileActiveStepHeadIcon,
          mobile
            ? this._classes.mobileActiveStepHeadIcon
            : this._classes.activeStepHeadIcon
        );

        this._toggleClasses(
          stepperHeadIcon[index],
          "removeClass",
          mobile
            ? this._classes.mobileDefaultStepHeadIcon
            : this._classes.defaultStepHeadIcon
        );
      }

      if (
        el.hasAttribute(ATTR_STEP_COMPLETED) &&
        !this._options.stepperNoEditable
      ) {
        toggleHeadIconClasses(
          index,
          mobile
            ? this._classes.completedStepHeadIcon
            : this._classes.mobileCompletedStepHeadIcon,
          mobile
            ? this._classes.mobileCompletedStepHeadIcon
            : this._classes.completedStepHeadIcon
        );

        this._toggleClasses(
          stepperHeadIcon[index],
          "removeClass",
          mobile
            ? this._classes.mobileDefaultStepHeadIcon
            : this._classes.defaultStepHeadIcon
        );

        this._classes.completedStepHeadText &&
          this._toggleClasses(
            stepperHeadText[index],
            "removeClass",
            this._classes.defaultStepHeadText
          );
      }

      if (
        el.hasAttribute(ATTR_STEP_INVALID) &&
        !this._options.stepperNoEditable
      ) {
        toggleHeadIconClasses(
          index,
          mobile
            ? this._classes.invalidStepHeadIcon
            : this._classes.mobileInvalidStepHeadIcon,
          mobile
            ? this._classes.mobileInvalidStepHeadIcon
            : this._classes.invalidStepHeadIcon
        );

        this._toggleClasses(
          stepperHeadIcon[index],
          "removeClass",
          mobile
            ? this._classes.mobileDefaultStepHeadIcon
            : this._classes.defaultStepHeadIcon
        );

        this._classes.invalidStepHeadText &&
          this._toggleClasses(
            stepperHeadText[index],
            "removeClass",
            this._classes.defaultStepHeadText
          );
      }
    });
  }

  async _getValidationInstance(element) {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(Validation.getInstance(element));
      }, 10);
    });
  }

  async _setValidation() {
    const form = SelectorEngine.findOne("form", this._element);
    const { wrappersToValidate } = this.validationElements;
    const validationInstance = await this._getValidationInstance(form);

    if (validationInstance) {
      this._isValidationInstance = true;

      EventHandler.on(
        form,
        EVENT_SUBMIT,
        (event) => {
          const isFormValid = wrappersToValidate.every((arrOfEl) =>
            arrOfEl.every((el) => {
              return el.getAttribute(ATTR_VALIDATION_STATE) === "valid";
            })
          );

          wrappersToValidate.forEach((arrOfEl) => {
            arrOfEl.forEach((el) => {
              el.removeAttribute(ATTR_VALIDATION_STYLING);
            });
          });

          if (!isFormValid) {
            event.preventDefault();
            event.stopPropagation();
          }

          this._steps.forEach(async (_, i) => {
            const isValid = await this._validateStep(i);

            if (!isValid) {
              this._toggleInvalid(i);
              EventHandler.trigger(this.activeStep, EVENT_INVALID);
            }
          });
        },
        false
      );

      return;
    }

    EventHandler.on(
      form,
      EVENT_SUBMIT,
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        this._steps.forEach(async (_, i) => {
          const isValid = await this._validateStep(i);

          if (!isValid) {
            this._toggleInvalid(i);
            EventHandler.trigger(this.activeStep, EVENT_INVALID);
          }
        });
      },
      false
    );
  }

  async _validateActiveStepRequiredElements() {
    let elementsToValidate;

    if (!this._isValidationInstance) {
      elementsToValidate = SelectorEngine.find("[required]", this.activeStep);

      const validationResult = elementsToValidate.every((el) => {
        return el.checkValidity() === true;
      });

      return validationResult;
    }

    elementsToValidate = SelectorEngine.find(
      ATTR_VALIDATION_VALIDATE_ELEMENTS,
      this.activeStep
    );

    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          elementsToValidate.every(
            (el) => el.getAttribute(ATTR_VALIDATION_STATE) === "valid"
          )
        );
      }, 10);
    });
  }

  async _getValidationResult() {
    const form = SelectorEngine.findOne("form", this._element);
    form.setAttribute(ATTR_VALIDATION_VALIDATED, true);

    let validationResult;

    if (!this._isValidationInstance) {
      validationResult = this._validateActiveStepRequiredElements();

      return validationResult;
    }

    validationResult = await this._validateActiveStepRequiredElements();

    return validationResult;
  }

  async _validateStep(index) {
    const numberOfSteps = this._steps.length;
    const isSameStep = index === this._activeStepIndex;
    const isOutOfRange = index >= numberOfSteps || index < 0;
    const isStepDisabled =
      this._options.stepperNoEditable &&
      this._steps[index].hasAttribute(ATTR_STEP_DISABLED);

    let result = true;

    if (isSameStep || isOutOfRange || isStepDisabled) {
      result = false;
    }

    const changeStepEvent = EventHandler.trigger(
      this.activeStep,
      EVENT_STEP_CHANGE,
      {
        currentStep: this._activeStepIndex,
        nextStep: index,
      }
    );

    if (this._options.stepperLinear) {
      const stepsToCheck = index - this.activeStepIndex - 1;

      if (index > this._activeStepIndex || index === numberOfSteps - 1) {
        const validationResult = await this._getValidationResult();

        if (!validationResult) {
          EventHandler.trigger(this.activeStep, EVENT_INVALID, {
            currentStep: this._activeStepIndex,
            nextStep: index,
          });

          this._toggleInvalid(this._activeStepIndex);

          result = false;
        } else if (index === numberOfSteps - 1) {
          this._toggleCompleted(index);
        }

        const setHeightFunction =
          this._currentView !== STEPPER_VERTICAL
            ? () => this._setHeight(this.activeStep)
            : () => this._setSingleStepHeight(this.activeStep);

        setTimeout(setHeightFunction, 10);
      }

      if (index > this._activeStepIndex + 1) {
        const { wrappersToValidate, defaultValidationElements } =
          this.validationElements;

        for (let i = 0; i <= stepsToCheck; i++) {
          if (this._isValidationInstance) {
            wrappersToValidate[i].forEach((el) => {
              if (
                el.length !== 0 &&
                el.getAttribute(ATTR_VALIDATION_STATE) === "invalid"
              ) {
                this._toggleInvalid(i);
                result = false;
              }
            });
          } else {
            defaultValidationElements[i].forEach((el) => {
              if (el.length !== 0 && !el.checkValidity()) {
                this._toggleInvalid(i);
                result = false;
              }
            });
          }
        }
      }
    }

    if (index > this._activeStepIndex && changeStepEvent.defaultPrevented) {
      result = false;
    }

    return result;
  }

  async _toggleStep(index) {
    this._isValid = await this._validateStep(index);

    if (!this._isValid) {
      return;
    }

    const activeStepIndex = this._activeStepIndex;

    this._showElement(
      SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, this._steps[index])
    );

    if (index > this._activeStepIndex) {
      this._toggleCompleted(index);

      if (this._options.stepperLinear) {
        EventHandler.trigger(this.activeStep, EVENT_VALID, {
          currentStep: this._activeStepIndex,
          nextStep: index,
        });
      }
    }

    if (this._options.stepperNoEditable) {
      this._toggleDisabled();
    }

    this._toggleActive(index);

    if (
      this._currentView === STEPPER_HORIZONTAL ||
      this._currentView === STEPPER_MOBILE
    ) {
      this._animateHorizontalStep(index);
    } else {
      this._animateVerticalStep(index);
      this._setSingleStepHeight(this._steps[index]);
    }

    this._toggleStepTabIndex(
      SelectorEngine.findOne(`${ATTR_HEAD_REF}`, this.activeStep),
      SelectorEngine.findOne(`${ATTR_HEAD_REF}`, this._steps[index])
    );

    this._activeStepIndex = index;

    if (this._currentView === STEPPER_MOBILE) {
      const activeStepElement = SelectorEngine.findOne(
        `[${ATTR_MOBILE_ACTIVE_STEP_REF}]`,
        this._element
      );

      activeStepElement.textContent = this._activeStepIndex + 1;

      if (this._steps.length >= this._options.stepperMobileBarBreakpoint) {
        const { stepperHeadIcon } = this.stepElements;

        stepperHeadIcon.forEach((el) => {
          Manipulator.addClass(el, "hidden");
        });

        this._updateProgressBar();
      }
    }

    EventHandler.trigger(this.activeStep, EVENT_STEP_CHANGED, {
      currentStep: this._activeStepIndex,
      prevStep: activeStepIndex,
    });
  }

  _resetStepperHeight() {
    this._element.style.height = "";
  }

  _setStepsHeight() {
    this._steps.forEach((el) => {
      const stepContent = SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el);
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
    const stepContent = SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, step);
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
    if (this._currentView === STEPPER_MOBILE) {
      this._deleteMobileElements();
      this._unbindMobileButtons();
    }

    this._currentView = STEPPER_VERTICAL;

    this._setStepsHeight();
    this._hideInactiveSteps();
  }

  _toggleHorizontal() {
    if (this._currentView === STEPPER_MOBILE) {
      this._deleteMobileElements();
      this._unbindMobileButtons();
    }
    this._removeVerticalContentHideClasses();

    this._currentView = STEPPER_HORIZONTAL;

    this._setHeight(this.activeStep);
    this._hideInactiveSteps();
  }

  _toggleMobile() {
    this._removeVerticalContentHideClasses();

    this._currentView = STEPPER_MOBILE;

    this._createMobileElements();
    this._bindMobileButtons();
    this._setHeight(this.activeStep);
    this._hideInactiveSteps();
  }

  _bindMobileButtons() {
    const btnNext = SelectorEngine.findOne(
      `[${ATTR_MOBILE_BTN_NEXT_REF}]`,
      this._element
    );
    const btnBack = SelectorEngine.findOne(
      `[${ATTR_MOBILE_BTN_BACK_REF}]`,
      this._element
    );

    EventHandler.on(btnNext, EVENT_CLICK, () => {
      this.nextStep();
    });

    EventHandler.on(btnBack, EVENT_CLICK, () => {
      this.prevStep();
    });
  }

  _unbindMobileButtons() {
    const btnNext = SelectorEngine.findOne(
      `[${ATTR_MOBILE_BTN_NEXT_REF}]`,
      this._element
    );
    const btnBack = SelectorEngine.findOne(
      `[${ATTR_MOBILE_BTN_BACK_REF}]`,
      this._element
    );

    EventHandler.off(btnNext, EVENT_CLICK, () => {
      this.nextStep();
    });

    EventHandler.off(btnBack, EVENT_CLICK, () => {
      this.prevStep();
    });
  }

  _createMobileElements() {
    const mobileHeader = `
      <div
        ${ATTR_MOBILE_HEADER_REF}
        class="${this._classes.mobileHeader}">
        <p class="${this._classes.mobileHeaderText}">
          ${this._options.stepperMobileStepTxt} <span ${ATTR_MOBILE_ACTIVE_STEP_REF}></span> ${this._options.stepperMobileOfTxt}
          <span ${ATTR_MOBILE_ALL_STEPS_REF}></span>
        </p>
      </div>
    `;

    const mobileFooter = `
      <div
        ${ATTR_MOBILE_FOOTER_REF}
        class="${this._classes.mobileFooter}">      
      </div>    
    `;

    const mobileBtnBack = `
      <button
        type="button"
        class="${this._classes.mobileBtnBack}"
        ${ATTR_MOBILE_BTN_BACK_REF}>
        <span class="${this._classes.mobileBtnBackIcon}">
          ${this._options.stepperMobileBackBtnIcon}
        </span>
        ${this._options.stepperMobileBackBtn}
      </button>
    `;

    const mobileBtnNext = `
      <button
        type="button"
        class="${this._classes.mobileBtnNext}"
        ${ATTR_MOBILE_BTN_NEXT_REF}>
        ${this._options.stepperMobileNextBtn}
        <span class="${this._classes.mobileBtnNextIcon}">
         ${this._options.stepperMobileNextBtnIcon}
        </span>
      </button>
    `;

    const mobileProgressBar = `
      <div class="${this._classes.mobileProgressBarWrapper}">
        <div
          ${ATTR_MOBILE_PROGRESS_BAR_REF}
          class="${this._classes.mobileProgressBar}"></div>
      </div> 
    `;

    this._element.insertAdjacentHTML("afterbegin", mobileHeader);
    this._element.insertAdjacentHTML("beforeend", mobileFooter);
    const footer = SelectorEngine.findOne(
      `[${ATTR_MOBILE_FOOTER_REF}]`,
      this._element
    );

    if (this._steps.length >= this._options.stepperMobileBarBreakpoint) {
      const { stepperHeadIcon } = this.stepElements;

      stepperHeadIcon.forEach((el) => {
        Manipulator.addClass(el, "hidden");
      });

      this._element.classList.add("stepper-progress-bar");

      footer.insertAdjacentHTML("afterbegin", mobileProgressBar);

      this._updateProgressBar();
    }

    footer.insertAdjacentHTML("afterbegin", mobileBtnBack);
    footer.insertAdjacentHTML("beforeend", mobileBtnNext);

    const allStepsElement = SelectorEngine.findOne(
      `[${ATTR_MOBILE_ALL_STEPS_REF}]`,
      this._element
    );
    const activeStepsElement = SelectorEngine.findOne(
      `[${ATTR_MOBILE_ACTIVE_STEP_REF}]`,
      this._element
    );

    allStepsElement.textContent = this._steps.length;
    activeStepsElement.textContent = this._activeStepIndex + 1;
  }

  _deleteMobileElements() {
    const footer = SelectorEngine.findOne(
      `[${ATTR_MOBILE_HEADER_REF}]`,
      this._element
    );
    const head = SelectorEngine.findOne(
      `[${ATTR_MOBILE_FOOTER_REF}]`,
      this._element
    );

    footer.remove();
    head.remove();
  }

  _updateProgressBar() {
    const numberOfSteps = this._steps.length;
    const progressBar = SelectorEngine.findOne(
      `[${ATTR_MOBILE_PROGRESS_BAR_REF}]`,
      this._element
    );

    if (!progressBar) {
      return;
    }

    Manipulator.addStyle(progressBar, {
      width: `${((this._activeStepIndex + 1) / numberOfSteps) * 100}%`,
    });
  }

  _removeVerticalContentHideClasses() {
    if (this._currentView === "vertical") {
      this._steps.forEach((el) => {
        SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el).classList.remove(
          "!my-0"
        );
        SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el).classList.remove(
          "!py-0"
        );
        SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el).classList.remove(
          "!h-0"
        );
      });
    }
  }

  _toggleClasses(element, action, classes) {
    // condition to prevent errors if the user has not set any custom classes like active, disabled etc.
    if (element && classes) {
      Manipulator[action](element, classes);
    }
  }

  _bindKeysNavigation() {
    this._toggleStepTabIndex(
      false,
      SelectorEngine.findOne(`${ATTR_HEAD_REF}`, this.activeStep)
    );

    this._steps.forEach((el) => {
      const stepHead = SelectorEngine.findOne(`${ATTR_HEAD_REF}`, el);

      EventHandler.on(stepHead, EVENT_KEYDOWN, (e) => {
        const focusedStep = SelectorEngine.parents(
          e.currentTarget,
          `${ATTR_STEP_REF}`
        )[0];
        const nextStep = SelectorEngine.next(
          focusedStep,
          `${ATTR_STEP_REF}`
        )[0];
        const prevStep = SelectorEngine.prev(
          focusedStep,
          `${ATTR_STEP_REF}`
        )[0];
        const focusedStepHead = SelectorEngine.findOne(
          `${ATTR_HEAD_REF}`,
          focusedStep
        );
        const activeStepHead = SelectorEngine.findOne(
          `${ATTR_HEAD_REF}`,
          this.activeStep
        );
        let nextStepHead = null;
        let prevStepHead = null;

        if (nextStep) {
          nextStepHead = SelectorEngine.findOne(`${ATTR_HEAD_REF}`, nextStep);
        }

        if (prevStep) {
          prevStepHead = SelectorEngine.findOne(`${ATTR_HEAD_REF}`, prevStep);
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
            `${ATTR_HEAD_REF}`,
            this._steps[0]
          );

          this._toggleStepTabIndex(focusedStepHead, firstStepHead);
          this._toggleOutlineStyles(focusedStepHead, firstStepHead);

          firstStepHead.focus();
        }

        if (e.keyCode === END) {
          const lastStep = this._steps[this._steps.length - 1];
          const lastStepHead = SelectorEngine.findOne(
            `${ATTR_HEAD_REF}`,
            lastStep
          );
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
          `${ATTR_STEP_REF}`
        )[0];
        const focusedStepHead = SelectorEngine.findOne(
          `${ATTR_HEAD_REF}`,
          focusedStep
        );
        const activeStepHead = SelectorEngine.findOne(
          `${ATTR_HEAD_REF}`,
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
    const {
      stepperHead,
      stepperHeadIcon,
      stepperHeadText,
      disabledStepHeadIconClasses,
    } = this.stepElements;

    this._steps[this._activeStepIndex].setAttribute(ATTR_STEP_DISABLED, "");

    this._toggleClasses(
      stepperHead[this._activeStepIndex],
      "addClass",
      this._classes.disabledStepHead
    );
    this._toggleClasses(
      stepperHeadIcon[this._activeStepIndex],
      "addClass",
      disabledStepHeadIconClasses
    );
    this._toggleClasses(
      stepperHeadText[this._activeStepIndex],
      "addClass",
      this._classes.disabledStepHeadText
    );
  }

  _allowApplyValidationStyes(index) {
    const inputWrappers = this._steps[index].querySelectorAll(
      ATTR_VALIDATION_VALIDATE_ELEMENTS
    );
    const form = SelectorEngine.findOne("form", this._element);

    inputWrappers.forEach((el) => {
      el.hasAttribute(ATTR_VALIDATION_STYLING) &&
        el.removeAttribute(ATTR_VALIDATION_STYLING);
    });

    form.setAttribute(ATTR_VALIDATION_VALIDATED, true);
  }

  _toggleActive(index) {
    const {
      stepperHeadIcon,
      stepperHeadText,
      defaultStepHeadIconClasses,
      activeStepHeadIconClasses,
    } = this.stepElements;

    this._steps[index].setAttribute(ATTR_ACTIVE_STEP, "");

    this._steps[this._activeStepIndex].removeAttribute(ATTR_ACTIVE_STEP);

    const isInvalid = this._steps[index].hasAttribute(ATTR_STEP_INVALID);

    if (!this._options.stepperLinear && index === this._steps.length - 1) {
      Manipulator.removeClass(
        stepperHeadIcon[index],
        defaultStepHeadIconClasses
      );
    }

    !isInvalid &&
      (this._toggleClasses(
        stepperHeadIcon[index],
        "addClass",
        activeStepHeadIconClasses
      ),
      this._toggleClasses(
        stepperHeadText[index],
        "addClass",
        this._classes.activeStepHeadText
      ));

    this._toggleClasses(
      stepperHeadIcon[this._activeStepIndex],
      "removeClass",
      activeStepHeadIconClasses
    );

    this._toggleClasses(
      stepperHeadText[this._activeStepIndex],
      "removeClass",
      this._classes.activeStepHeadText
    );
  }

  _toggleCompleted(index) {
    const {
      stepperHeadIcon,
      stepperHeadText,
      completedStepHeadIconClasses,
      invalidStepHeadIconClasses,
      defaultStepHeadIconClasses,
    } = this.stepElements;

    this._steps[this._activeStepIndex].setAttribute(ATTR_STEP_COMPLETED, "");
    this._steps[this._activeStepIndex].removeAttribute(ATTR_STEP_INVALID);

    this._options.stepperLinear &&
      this._allowApplyValidationStyes(this._activeStepIndex);

    if (
      !this._options.stepperLinear &&
      !this._options.stepperNoEditable &&
      index === this._steps.length - 1
    ) {
      this._toggleClasses(
        stepperHeadIcon[index],
        "addClass",
        completedStepHeadIconClasses
      );
      this._toggleClasses(
        stepperHeadText[index],
        "addClass",
        this._classes.completedStepHeadText
      );

      this._steps[index].setAttribute(ATTR_STEP_COMPLETED, "");
    }

    if (!this._options.stepperNoEditable) {
      this._toggleClasses(
        stepperHeadIcon[this._activeStepIndex],
        "addClass",
        completedStepHeadIconClasses
      );

      this._toggleClasses(
        stepperHeadText[this._activeStepIndex],
        "addClass",
        this._classes.completedStepHeadText
      );
    }

    this._toggleClasses(
      stepperHeadIcon[this._activeStepIndex],
      "removeClass",
      defaultStepHeadIconClasses
    );

    this._options.stepperNoEditable &&
      this._toggleClasses(
        stepperHeadText[this._activeStepIndex],
        "removeClass",
        this._classes.defaultStepHeadText
      );

    this._toggleClasses(
      stepperHeadIcon[this._activeStepIndex],
      "removeClass",
      invalidStepHeadIconClasses
    );

    this._toggleClasses(
      stepperHeadText[this._activeStepIndex],
      "removeClass",
      this._classes.invalidStepHeadText
    );
  }

  _toggleInvalid(index) {
    const {
      stepperHeadIcon,
      stepperHeadText,
      activeStepHeadIconClasses,
      completedStepHeadIconClasses,
      defaultStepHeadIconClasses,
      invalidStepHeadIconClasses,
    } = this.stepElements;

    this._steps[index].setAttribute(ATTR_STEP_INVALID, "");
    this._steps[index].removeAttribute(ATTR_STEP_COMPLETED);

    if (index === this._activeStepIndex) {
      this._allowApplyValidationStyes(index);
    }

    this._toggleClasses(
      stepperHeadIcon[index],
      "addClass",
      invalidStepHeadIconClasses
    );

    this._toggleClasses(
      stepperHeadText[index],
      "addClass",
      this._classes.invalidStepHeadText
    );

    this._toggleClasses(
      stepperHeadIcon[index],
      "removeClass",
      activeStepHeadIconClasses
    );

    this._toggleClasses(
      stepperHeadText[index],
      "removeClass",
      this._classes.activeStepHeadText
    );

    this._toggleClasses(
      stepperHeadIcon[index],
      "removeClass",
      completedStepHeadIconClasses
    );

    this._toggleClasses(
      stepperHeadText[index],
      "removeClass",
      this._classes.completedStepHeadText
    );

    this._toggleClasses(
      stepperHeadIcon[index],
      "removeClass",
      defaultStepHeadIconClasses
    );
  }

  _setOptional() {
    this._steps.forEach((el) => {
      const isOptional = Manipulator.getDataAttribute(el, "stepper-optional");

      if (isOptional) {
        const stepHeadText = SelectorEngine.findOne(
          `${ATTR_HEAD_TEXT_REF}`,
          el
        );
        stepHeadText.setAttribute("data-te-content", "Optional");
        Manipulator.addClass(
          stepHeadText,
          "after:content-[attr(data-te-content)]"
        );
      }
    });
  }

  _hideInactiveSteps() {
    this._steps.forEach((el) => {
      if (!el.hasAttribute(ATTR_ACTIVE_STEP)) {
        const content = SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el);
        content.classList.remove("translate-x-[150%]");
        this._hideElement(content);
      }
    });
  }

  _setHeight(stepElement) {
    const stepContent = SelectorEngine.findOne(ATTR_CONTENT_REF, stepElement);
    const stepFooter = SelectorEngine.findOne(
      `[${ATTR_MOBILE_FOOTER_REF}]`,
      this._element
    );

    const contentStyle = getComputedStyle(stepContent);
    const footerStyle = stepFooter ? getComputedStyle(stepFooter) : null;

    let stepHead;

    if (this._currentView === STEPPER_MOBILE) {
      stepHead = SelectorEngine.findOne(
        `[${ATTR_MOBILE_HEADER_REF}]`,
        this._element
      );
    } else {
      stepHead = SelectorEngine.findOne(ATTR_HEAD_REF, stepElement);
    }

    const headStyle = getComputedStyle(stepHead);
    const stepContentHeight =
      stepContent.offsetHeight +
      parseFloat(contentStyle.marginTop) +
      parseFloat(contentStyle.marginBottom);

    const stepHeadHeight =
      stepHead.offsetHeight +
      parseFloat(headStyle.marginTop) +
      parseFloat(headStyle.marginBottom);

    const stepFooterHeight = stepFooter
      ? stepFooter.offsetHeight +
        parseFloat(footerStyle.marginTop) +
        parseFloat(footerStyle.marginBottom)
      : 0;

    Manipulator.addStyle(this._element, {
      height: `${stepHeadHeight + stepContentHeight + stepFooterHeight}px`,
    });
  }

  _hideElement(stepContent) {
    const isActive = SelectorEngine.parents(
      stepContent,
      `${ATTR_STEP_REF}`
    )[0].hasAttribute(ATTR_ACTIVE_STEP);

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
      `${ATTR_CONTENT_REF}`,
      this._steps[index]
    );
    const activeStepContent = SelectorEngine.findOne(
      `${ATTR_CONTENT_REF}`,
      this.activeStep
    );

    let nextStepAnimation;
    let activeStepAnimation;

    this._steps.forEach((el, i) => {
      const stepContent = SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el);

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
      const step = SelectorEngine.findOne(`${ATTR_CONTENT_REF}`, el);
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
      `${ATTR_CONTENT_REF}`,
      this._steps[index]
    );
    const activeStepContent = SelectorEngine.findOne(
      `${ATTR_CONTENT_REF}`,
      this.activeStep
    );

    this._hideElement(activeStepContent);
    this._showElement(nextStepContent);
  }
}

export default Stepper;
