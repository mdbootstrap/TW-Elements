import Data from "./dom/data";
import EventHandler from "./dom/event-handler";
import SelectorEngine from "./dom/selector-engine";
import Manipulator from "./dom/manipulator";
import { typeCheckConfig } from "./util/index";
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
} from "./util/keycodes";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "stepper";
const DATA_KEY = "te.stepper";
const EVENT_KEY = `.${DATA_KEY}`;
const REF = `data-te-${NAME}`;
const SELECTOR_EXPAND = `[${REF}-init]`;

const STEPPER_HORIZONTAL = "horizontal";
const STEPPER_VERTICAL = "vertical";

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
};

const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_KEYUP = `keyup${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_ANIMATIONEND = "animationend";

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
    ].setAttribute("data-et", "active-step");
    const stepperContent = SelectorEngine.find(`${CONTENT_REF}`, this._element);
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

      stepperContent[this._activeStepIndex].classList.add("block");
      stepperHeadText[this._activeStepIndex].classList.add("font-medium");
      stepperHeadIcon[this._activeStepIndex].classList.add("bg-[#0d6efd]");
    } else {
      stepperContent[this._activeStepIndex].classList.add("block");
      stepperHeadText[this._activeStepIndex].classList.add("font-medium");
      stepperHeadIcon[this._activeStepIndex].classList.add("bg-[#0d6efd]");
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

    this._steps[this._activeStepIndex].setAttribute("data-et", "active-step");
    this._steps.forEach((step, index) => {
      if (step[this._activeStepIndex] !== index) {
        step.removeAttribute("data-et");
      }
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
      "[data-mdb-stepper-type]",
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
    stepperHeadIcon[this._activeStepIndex].classList.add("bg-[#858585]");
    this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperDisabled
    );
  }

  _toggleActive(index) {
    const stepperContent = SelectorEngine.find(`${CONTENT_REF}`, this._element);
    const stepperHeadText = SelectorEngine.find(
      `${HEAD_TEXT_REF}`,
      this._element
    );
    const stepperHeadIcon = SelectorEngine.find(
      `${HEAD_ICON_REF}`,
      this._element
    );

    stepperContent[index].classList.add("block");
    stepperHeadText[index].classList.add("font-medium");
    stepperHeadIcon[index].classList.add("bg-[#0d6efd]");
    stepperHeadIcon[index].classList.remove("bg-[#198754]");

    stepperContent[this._activeStepIndex].classList.remove("block");
    stepperHeadText[this._activeStepIndex].classList.remove("font-medium");
    stepperHeadIcon[this._activeStepIndex].classList.remove("bg-[#0d6efd]");

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
    stepperHeadIcon[index].classList.add("bg-[#198754]");
    stepperHeadIcon[index].classList.remove("bg-[#dc3545]");

    this._toggleStepClass(index, "add", this._options.stepperCompleted);
    this._toggleStepClass(index, "remove", this._options.stepperInvalid);
  }

  _hideInactiveSteps() {
    this._steps.forEach((el) => {
      if (!el.getAttribute("data-et")) {
        this._hideElement(SelectorEngine.findOne(`${CONTENT_REF}`, el));
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
    )[0].getAttribute("data-et");

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

      this._clearStepAnimation(stepContent);

      if (i !== index && i !== this._activeStepIndex) {
        this._hideElement(stepContent);
      }
    });

    if (isForward) {
      activeStepAnimation = "slide-out-left";
      nextStepAnimation = "slide-in-right";
    } else {
      activeStepAnimation = "slide-out-right";
      nextStepAnimation = "slide-in-left";
    }

    activeStepContent.classList.add(activeStepAnimation, "animation", "fast");
    nextStepContent.classList.add(nextStepAnimation, "animation", "fast");

    this._setHeight(this._steps[index]);

    EventHandler.one(activeStepContent, EVENT_ANIMATIONEND, (e) => {
      this._clearStepAnimation(e.target);
      this._hideElement(e.target);
    });

    EventHandler.one(nextStepContent, EVENT_ANIMATIONEND, (e) => {
      this._clearStepAnimation(e.target);
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

  _clearStepAnimation(element) {
    element.classList.remove(
      "slide-out-left",
      "slide-in-right",
      "slide-out-right",
      "slide-in-left",
      "animation",
      "fast"
    );
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

/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */

SelectorEngine.find(SELECTOR_EXPAND).forEach((el) => {
  let instance = Stepper.getInstance(el);
  if (!instance) {
    instance = new Stepper(el);
  }

  return instance;
});

export default Stepper;
