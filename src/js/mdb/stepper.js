import Data from './dom/data';
import EventHandler from './dom/event-handler';
import SelectorEngine from './dom/selector-engine';
import Manipulator from './dom/manipulator';
import { typeCheckConfig } from './util/index';
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
} from './util/keycodes';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'stepper';
const DATA_KEY = 'mdb.stepper';
const SELECTOR_EXPAND = '[data-mdb-stepper="stepper"]';
const EVENT_KEY = `.${DATA_KEY}`;

const STEPPER_HORIZONTAL = 'horizontal';
const STEPPER_VERTICAL = 'vertical';

const DefaultType = {
  stepperType: 'string',
  stepperLinear: 'boolean',
  stepperNoEditable: 'boolean',
  stepperActive: 'string',
  stepperCompleted: 'string',
  stepperInvalid: 'string',
  stepperDisabled: 'string',
  stepperVerticalBreakpoint: 'number',
  stepperMobileBreakpoint: 'number',
  stepperMobileBarBreakpoint: 'number',
};

const Default = {
  stepperType: STEPPER_HORIZONTAL,
  stepperLinear: false,
  stepperNoEditable: false,
  stepperActive: '',
  stepperCompleted: '',
  stepperInvalid: '',
  stepperDisabled: '',
  stepperVerticalBreakpoint: 0,
  stepperMobileBreakpoint: 0,
  stepperMobileBarBreakpoint: 4,
};

const EVENT_MOUSEDOWN = `mousedown${EVENT_KEY}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
const EVENT_KEYUP = `keyup${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_ANIMATIONEND = 'animationend';

const STEP_CLASS = `${NAME}-step`;
const HEAD_CLASS = `${NAME}-head`;
const CONTENT_CLASS = `${NAME}-content`;
const ACTIVE_CLASS = `${NAME}-active`;
const COMPLETED_CLASS = `${NAME}-completed`;
const INVALID_CLASS = `${NAME}-invalid`;
const DISABLED_CLASS = `${NAME}-disabled`;
const VERTICAL_CLASS = `${NAME}-${STEPPER_VERTICAL}`;
const CONTENT_HIDE_CLASS = `${NAME}-content-hide`;
const HORIZONTAL_CLASS = `${NAME}-${STEPPER_HORIZONTAL}`;

class Stepper {
  constructor(element, options) {
    this._element = element;
    this._options = this._getConfig(options);
    this._elementHeight = 0;
    this._steps = SelectorEngine.find(`.${STEP_CLASS}`, this._element);
    this._currentView = '';
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
    const activeStep = SelectorEngine.findOne(`.${ACTIVE_CLASS}`, this._element);

    if (activeStep) {
      this._activeStepIndex = this._steps.indexOf(activeStep);
      this._toggleStepClass(this._activeStepIndex, 'add', this._options.stepperActive);
    } else {
      this._toggleStepClass(this._activeStepIndex, 'add', ACTIVE_CLASS);
      this._toggleStepClass(this._activeStepIndex, 'add', this._options.stepperActive);
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

    if (this._options.stepperVerticalBreakpoint || this._options.stepperMobileBreakpoint) {
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
      const stepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, el);

      EventHandler.on(stepHead, EVENT_MOUSEDOWN, (e) => {
        const step = SelectorEngine.parents(e.target, `.${STEP_CLASS}`)[0];
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

      if (this._options.stepperVerticalBreakpoint || this._options.stepperMobileBreakpoint) {
        this._toggleStepperView();
      }
    });
  }

  _toggleStepperView() {
    const shouldBeHorizontal = this._options.stepperVerticalBreakpoint < window.innerWidth;
    const shouldBeVertical = this._options.stepperVerticalBreakpoint > window.innerWidth;
    const shouldBeMobile = this._options.stepperMobileBreakpoint > window.innerWidth;

    if (shouldBeHorizontal && this._currentView !== STEPPER_HORIZONTAL) {
      this._toggleHorizontal();
    }

    if (shouldBeVertical && !shouldBeMobile && this._currentView !== STEPPER_VERTICAL) {
      this._steps.forEach((el) => {
        const stepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, el);

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

    this._showElement(SelectorEngine.findOne(`.${CONTENT_CLASS}`, this._steps[index]));
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
      SelectorEngine.findOne(`.${HEAD_CLASS}`, this.activeStep),
      SelectorEngine.findOne(`.${HEAD_CLASS}`, this._steps[index])
    );

    this._activeStepIndex = index;
  }

  _resetStepperHeight() {
    this._element.style.height = '';
  }

  _setStepsHeight() {
    this._steps.forEach((el) => {
      const stepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, el);
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
    const stepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, step);
    const isActiveStep = this.activeStep === step;
    const stepIndex = this._steps.indexOf(step);
    let stepContentHeight;

    if (!isActiveStep) {
      stepContentHeight =
        stepContent.scrollHeight +
        this._verticalStepperStyles[stepIndex].paddingTop +
        this._verticalStepperStyles[stepIndex].paddingBottom;
    } else {
      stepContent.style.height = '';
      stepContentHeight = stepContent.scrollHeight;
    }

    stepContent.style.height = `${stepContentHeight}px`;
  }

  _toggleVertical() {
    this._currentView = STEPPER_VERTICAL;

    this._toggleStepperClass(VERTICAL_CLASS);
    this._setStepsHeight();
    this._hideInactiveSteps();
  }

  _toggleHorizontal() {
    this._currentView = STEPPER_HORIZONTAL;

    this._toggleStepperClass(HORIZONTAL_CLASS);
    this._setHeight(this.activeStep);
    this._hideInactiveSteps();
  }

  _toggleStepperClass(className) {
    this._element.classList.remove(HORIZONTAL_CLASS, VERTICAL_CLASS);
    this._element.classList.add(className);

    if (className !== VERTICAL_CLASS) {
      this._steps.forEach((el) => {
        SelectorEngine.findOne(`.${CONTENT_CLASS}`, el).classList.remove(CONTENT_HIDE_CLASS);
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
    this._toggleStepTabIndex(false, SelectorEngine.findOne(`.${HEAD_CLASS}`, this.activeStep));

    this._steps.forEach((el) => {
      const stepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, el);

      EventHandler.on(stepHead, EVENT_KEYDOWN, (e) => {
        const focusedStep = SelectorEngine.parents(e.currentTarget, `.${STEP_CLASS}`)[0];
        const nextStep = SelectorEngine.next(focusedStep, `.${STEP_CLASS}`)[0];
        const prevStep = SelectorEngine.prev(focusedStep, `.${STEP_CLASS}`)[0];
        const focusedStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, focusedStep);
        const activeStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, this.activeStep);
        let nextStepHead = null;
        let prevStepHead = null;

        if (nextStep) {
          nextStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, nextStep);
        }

        if (prevStep) {
          prevStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, prevStep);
        }

        if (e.keyCode === LEFT_ARROW && this._currentView !== STEPPER_VERTICAL) {
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

        if (e.keyCode === RIGHT_ARROW && this._currentView !== STEPPER_VERTICAL) {
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

        if (e.keyCode === DOWN_ARROW && this._currentView === STEPPER_VERTICAL) {
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
          const firstStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, this._steps[0]);

          this._toggleStepTabIndex(focusedStepHead, firstStepHead);
          this._toggleOutlineStyles(focusedStepHead, firstStepHead);

          firstStepHead.focus();
        }

        if (e.keyCode === END) {
          const lastStep = this._steps[this._steps.length - 1];
          const lastStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, lastStep);
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
        const focusedStep = SelectorEngine.parents(e.currentTarget, `.${STEP_CLASS}`)[0];
        const focusedStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, focusedStep);
        const activeStepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, this.activeStep);

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
      focusedElement.setAttribute('tabIndex', -1);
    }

    if (newTarget) {
      newTarget.setAttribute('tabIndex', 0);
    }
  }

  _toggleOutlineStyles(focusedElement, newTarget) {
    if (focusedElement) {
      focusedElement.style.outline = '';
    }

    if (newTarget) {
      newTarget.style.outline = 'revert';
    }
  }

  _toggleDisabled() {
    this._toggleStepClass(this._activeStepIndex, 'add', DISABLED_CLASS);
    this._toggleStepClass(this._activeStepIndex, 'add', this._options.stepperDisabled);
  }

  _toggleActive(index) {
    this._toggleStepClass(index, 'add', ACTIVE_CLASS);
    this._toggleStepClass(this._activeStepIndex, 'remove', ACTIVE_CLASS);
    this._toggleStepClass(index, 'add', this._options.stepperActive);
    this._toggleStepClass(this._activeStepIndex, 'remove', this._options.stepperActive);
  }

  _toggleCompleted(index) {
    this._toggleStepClass(index, 'add', COMPLETED_CLASS);
    this._toggleStepClass(index, 'remove', INVALID_CLASS);
    this._toggleStepClass(index, 'add', this._options.stepperCompleted);
    this._toggleStepClass(index, 'remove', this._options.stepperInvalid);
  }

  _hideInactiveSteps() {
    this._steps.forEach((el) => {
      if (!el.classList.contains(ACTIVE_CLASS)) {
        this._hideElement(SelectorEngine.findOne(`.${CONTENT_CLASS}`, el));
      }
    });
  }

  _setHeight(stepElement) {
    const stepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, stepElement);
    const contentStyle = getComputedStyle(stepContent);
    const stepHead = SelectorEngine.findOne(`.${HEAD_CLASS}`, stepElement);

    const headStyle = getComputedStyle(stepHead);
    const stepContentHeight =
      stepContent.offsetHeight +
      parseFloat(contentStyle.marginTop) +
      parseFloat(contentStyle.marginBottom);

    const stepHeadHeight =
      stepHead.offsetHeight + parseFloat(headStyle.marginTop) + parseFloat(headStyle.marginBottom);

    this._element.style.height = `${stepHeadHeight + stepContentHeight}px`;
  }

  _hideElement(stepContent) {
    const isActive = SelectorEngine.parents(stepContent, `.${STEP_CLASS}`)[0].classList.contains(
      ACTIVE_CLASS
    );

    // prevent hiding during a quick step change
    if (!isActive && this._currentView !== STEPPER_VERTICAL) {
      stepContent.style.display = 'none';
    } else {
      stepContent.classList.add(CONTENT_HIDE_CLASS);
    }
  }

  _showElement(stepContent) {
    if (this._currentView === STEPPER_VERTICAL) {
      stepContent.classList.remove(CONTENT_HIDE_CLASS);
    } else {
      stepContent.style.display = 'block';
    }
  }

  _animateHorizontalStep(index) {
    const isForward = index > this._activeStepIndex;
    const nextStepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, this._steps[index]);
    const activeStepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, this.activeStep);

    let nextStepAnimation;
    let activeStepAnimation;

    this._steps.forEach((el, i) => {
      const stepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, el);

      this._clearStepAnimation(stepContent);

      if (i !== index && i !== this._activeStepIndex) {
        this._hideElement(stepContent);
      }
    });

    if (isForward) {
      activeStepAnimation = 'slide-out-left';
      nextStepAnimation = 'slide-in-right';
    } else {
      activeStepAnimation = 'slide-out-right';
      nextStepAnimation = 'slide-in-left';
    }

    activeStepContent.classList.add(activeStepAnimation, 'animation', 'fast');
    nextStepContent.classList.add(nextStepAnimation, 'animation', 'fast');

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
    const nextStepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, this._steps[index]);
    const activeStepContent = SelectorEngine.findOne(`.${CONTENT_CLASS}`, this.activeStep);

    this._hideElement(activeStepContent);
    this._showElement(nextStepContent);
  }

  _clearStepAnimation(element) {
    element.classList.remove(
      'slide-out-left',
      'slide-in-right',
      'slide-out-right',
      'slide-in-left',
      'animation',
      'fast'
    );
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) || new this(element, typeof config === 'object' ? config : null)
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
