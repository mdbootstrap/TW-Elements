/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { typeCheckConfig } from "../../util/index";
import EventHandler from "../../dom/event-handler";
import BaseComponent from "../../base-component";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import { DefaultClasses as InputClasses } from "../../forms/input";
import rules from "./rules";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "validation";
const DATA_KEY = "te.validation";
const EVENT_KEY = `.${DATA_KEY}`;

const ATTR_VALIDATION_ELEMENTS = "data-te-validate";
const ATTR_VALIDATED = "data-te-validated";
const ATTR_VALIDATION_STATE = "data-te-validation-state";
const ATTR_VALIDATION_FEEDBACK = "data-te-validation-feedback";

const ATTR_VALID_FEEDBACK = "data-te-valid-feedback";
const ATTR_INVALID_FEEDBACK = "data-te-invalid-feedback";
const ATTR_VALIDATION_RULESET = "data-te-validation-ruleset";

const SELECTOR_VALIDATION_ELEMENTS = `[${ATTR_VALIDATION_ELEMENTS}]`;
const SELECTOR_INPUT_NOTCHES = "[data-te-input-notch-ref] div";

const EVENT_VALIDATED = `validated${EVENT_KEY}`;
const EVENT_VALIDATION_VALID = `valid${EVENT_KEY}`;
const EVENT_VALIDATION_INVALID = `invalid${EVENT_KEY}`;

const DefaultType = {
  validFeedback: "string",
  invalidFeedback: "string",
  disableFeedback: "boolean",
  validationFull: "boolean",
  validationDefaultRules: "string",
  customRules: "object",
};

const Default = {
  validFeedback: "Looks good!",
  invalidFeedback: "Something is wrong!",
  disableFeedback: false,
  validationFull: false,
  validationDefaultRules: "required",
  customRules: {},
};

const DefaultClasses = {
  // default notch
  notchLeadingValid:
    "border-[#14a44d] dark:border-[#14a44d] group-data-[te-input-focused]:shadow-[-1px_0_0_#14a44d,_0_1px_0_0_#14a44d,_0_-1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
  notchMiddleValid:
    "border-[#14a44d] dark:border-[#14a44d] group-data-[te-input-focused]:shadow-[0_1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
  notchTrailingValid:
    "border-[#14a44d] dark:border-[#14a44d] group-data-[te-input-focused]:shadow-[1px_0_0_#14a44d,_0_-1px_0_0_#14a44d,_0_1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
  notchLeadingInvalid:
    "border-[#dc4c64] dark:border-[#dc4c64] group-data-[te-input-focused]:shadow-[-1px_0_0_#dc4c64,_0_1px_0_0_#dc4c64,_0_-1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
  notchMiddleInvalid:
    "border-[#dc4c64] dark:border-[#dc4c64] group-data-[te-input-focused]:shadow-[0_1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
  notchTrailingInvalid:
    "border-[#dc4c64] dark:border-[#dc4c64] group-data-[te-input-focused]:shadow-[1px_0_0_#dc4c64,_0_-1px_0_0_#dc4c64,_0_1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",

  // basic inputs
  basicInputValid:
    "!border-[#14a44d] focus:!border-[#14a44d] focus:!shadow-[inset_0_0_0_1px_#14a44d]",
  basicInputInvalid:
    "!border-[#dc4c64] focus:!border-[#dc4c64] focus:!shadow-[inset_0_0_0_1px_#dc4c64]",

  // checkbox

  checkboxValid:
    "checked:!border-[#14a44d] checked:!bg-[#14a44d] checked:after:!bg-[#14a44d]",
  checkboxInvalid:
    "checked:!border-[#dc4c64] checked:!bg-[#dc4c64] checked:after:!bg-[#dc4c64]",

  radioValid: "checked:!border-[#14a44d] checked:after:!bg-[#14a44d]",
  radioInvalid: "checked:!border-[#dc4c64] checked:after:!bg-[#dc4c64]",

  // labels
  labelValid: "!text-[#14a44d]",
  labelInvalid: "!text-[#dc4c64]",

  // feedback
  validFeedback:
    "absolute top-full left-0 m-1 w-auto text-sm text-[#14a44d] animate-[fade-in_0.3s_both]",
  invalidFeedback:
    "absolute top-full left-0 m-1 w-auto text-sm text-[#dc4c64] animate-[fade-in_0.3s_both]",

  // element validated
  elementValidated: "mb-8",
};

const DefaultClassesType = {
  notchLeadingValid: "string",
  notchMiddleValid: "string",
  notchTrailingValid: "string",
  notchLeadingInvalid: "string",
  notchMiddleInvalid: "string",
  notchTrailingInvalid: "string",
  labelValid: "string",
  labelInvalid: "string",
};

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Validation extends BaseComponent {
  constructor(element, config, classes) {
    super(element);
    this._element = element;
    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);

    this._validationElements = this._getValidationElements();

    this._validationObserver = this._watchForValidationChanges();
    this._validationObserver.observe(this._element, { attributes: true });
  }

  // Getters
  static get DefaultType() {
    return DefaultType;
  }

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  // Public
  dispose() {
    this._validationObserver.disconnect();
    this._validationObserver = null;
    this._element.removeAttribute(ATTR_VALIDATED);
  }

  // Private
  _getValidationElements() {
    const elements = SelectorEngine.find(
      SELECTOR_VALIDATION_ELEMENTS,
      this._element
    );
    return elements.map((element) => {
      return {
        type: element.getAttribute(ATTR_VALIDATION_ELEMENTS),
        validFeedback: element.getAttribute(ATTR_VALID_FEEDBACK),
        invalidFeedback: element.getAttribute(ATTR_INVALID_FEEDBACK),
        element,
      };
    });
  }

  _createFeedbackWrapper(element) {
    if (element.querySelectorAll(`[${ATTR_VALIDATION_FEEDBACK}]`).length > 0) {
      return;
    }

    const span = document.createElement("span");
    span.setAttribute(ATTR_VALIDATION_FEEDBACK, "");
    element.appendChild(span);
  }

  _watchForValidationChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const { attributeName } = mutation;
        if (attributeName === ATTR_VALIDATED) {
          this._handleValidation();
        }
      });
    });
    return observer;
  }

  _handleValidation() {
    if (!this._element.getAttribute(ATTR_VALIDATED)) {
      return;
    }

    let isInvalid = false;

    this._validationElements.forEach((validationElement) => {
      const { element, type } = validationElement;

      if (this._config.validationFull) {
        this._validateByRuleset(validationElement);
      }

      const validationResult = element.getAttribute(ATTR_VALIDATION_STATE);

      if (validationResult !== "valid" && validationResult !== "invalid") {
        return;
      }

      const capitalizedValidationResult = validationResult.replace(
        validationResult.charAt(0),
        validationResult.charAt(0).toUpperCase()
      );

      const wrapper =
        type === "select"
          ? element.parentNode.querySelector(
              "[data-te-select-form-outline-ref]"
            )
          : element;

      if (type === "input" || type === "select" || type === "chips") {
        this._restyleNotches(wrapper, capitalizedValidationResult);
      }

      if (type === "basic") {
        this._restyleBasicInputs(element, capitalizedValidationResult);
      }

      if (type === "checkbox" || type === "radio") {
        this._restyleCheckboxes(element, capitalizedValidationResult, type);
      }

      this._restyleLabels(wrapper, capitalizedValidationResult);

      if (validationResult === "invalid") {
        isInvalid = true;
      }

      if (!this._config.disableFeedback) {
        this._applyFeedback(wrapper, validationResult);
      }
    });

    this._emitEvents(isInvalid);
  }

  _validateByRuleset({ element, type, invalidFeedback }) {
    if (type === "chips") {
      return;
    }

    const ruleset = this._getRuleset(element);

    const input =
      type === "select"
        ? element.parentNode.querySelector("[data-te-select-input-ref] ")
        : SelectorEngine.findOne("input", element) ||
          SelectorEngine.findOne("textarea", element);

    const result =
      type === "checkbox" || type === "radio" ? input.checked : input.value;

    let testResult = null;

    for (const rule of ruleset) {
      testResult = rule.callback(result, rule.parameter);
      if (typeof testResult === "string") {
        break;
      }
    }

    if (testResult === true) {
      element.setAttribute(ATTR_VALIDATION_STATE, `valid`);
      return;
    }

    element.setAttribute(ATTR_VALIDATION_STATE, `invalid`);

    if (!invalidFeedback) {
      element.setAttribute(ATTR_INVALID_FEEDBACK, testResult);
    }
  }

  _getRuleset(element) {
    const ruleset =
      element.getAttribute(ATTR_VALIDATION_RULESET) ||
      this._config.validationDefaultRules;
    const ruleArray = ruleset.split("|");

    let rulesToApply = [];

    const rulesList = {
      ...rules,
      ...this._config.customRules,
    };

    ruleArray.forEach((rule) => {
      const ruleData = this._getRuleData(rule, rulesList);
      if (ruleData.callback) {
        rulesToApply.push(ruleData);
      } else {
        console.warn(`Rule ${rule} does not exist`);
      }
    });

    return rulesToApply;
  }

  _getRuleData(rule, rulesList) {
    const split = rule.split("(");
    return {
      callback: rulesList[split[0]],
      parameter: split[1] ? split[1].split(")")[0] : null,
    };
  }

  _applyFeedback(element, result) {
    this._createFeedbackWrapper(element);

    const feedback = SelectorEngine.findOne(
      `[${ATTR_VALIDATION_FEEDBACK}]`,
      element
    );

    const valid =
      element.getAttribute(ATTR_VALID_FEEDBACK) || this._config.validFeedback;
    const invalid =
      element.getAttribute(ATTR_INVALID_FEEDBACK) ||
      this._config.invalidFeedback;

    Manipulator.addClass(element, this._classes.elementValidated);

    feedback.textContent = result === "valid" ? valid : invalid;

    feedback.className =
      this._classes[result === "valid" ? "validFeedback" : "invalidFeedback"];
  }

  _restyleCheckboxes(element, result, type) {
    const checkbox = SelectorEngine.findOne("input", element);
    Manipulator.removeClass(checkbox, this._classes.checkboxValid);
    Manipulator.removeClass(checkbox, this._classes.checkboxInvalid);

    Manipulator.addClass(checkbox, this._classes[`${type}${result}`]);
  }

  _restyleBasicInputs(element, result) {
    const input = SelectorEngine.findOne("input", element);
    Manipulator.removeClass(input, this._classes.basicInputValid);
    Manipulator.removeClass(input, this._classes.basicInputInvalid);

    Manipulator.addClass(input, this._classes[`basicInput${result}`]);
  }

  _restyleNotches(element, result) {
    const notches = SelectorEngine.find(SELECTOR_INPUT_NOTCHES, element);
    notches.forEach((notch, id) => {
      let classes =
        id === 0 ? "notchLeading" : id === 1 ? "notchMiddle" : "notchTrailing";

      notch.className = "";
      Manipulator.addClass(notch, InputClasses[classes]);

      classes += result;
      Manipulator.addClass(notch, this._classes[classes]);
    });
  }

  _restyleLabels(element, result) {
    const labels = SelectorEngine.find("label", element);

    if (!labels.length) {
      return;
    }

    labels.forEach((label) => {
      Manipulator.removeClass(label, this._classes.labelValid);
      Manipulator.removeClass(label, this._classes.labelInvalid);

      Manipulator.addClass(label, this._classes[`label${result}`]);
    });
  }

  _emitEvents(isInvalid) {
    EventHandler.trigger(this._element, EVENT_VALIDATED);

    if (isInvalid) {
      EventHandler.trigger(this._element, EVENT_VALIDATION_INVALID);
      return;
    }

    EventHandler.trigger(this._element, EVENT_VALIDATION_VALID);
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === "object" && config ? config : {}),
    };

    typeCheckConfig(NAME, config, this.constructor.DefaultType);

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

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Validation.getOrCreateInstance(this);

      if (typeof config !== "string") {
        return;
      }

      if (
        data[config] === undefined ||
        config.startsWith("_") ||
        config === "constructor"
      ) {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }
}

export default Validation;
