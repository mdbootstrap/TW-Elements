/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { typeCheckConfig } from "../util/index";
import EventHandler from "../dom/event-handler";
import BaseComponent from "../base-component";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import { DefaultClasses as InputClasses } from "../forms/input";

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

const SELECTOR_VALIDATION_ELEMENTS = `[${ATTR_VALIDATION_ELEMENTS}]`;
const SELECTOR_INPUT_NOTCHES = "[data-te-input-notch-ref] div";

const EVENT_VALIDATED = `validated${EVENT_KEY}`;

const DefaultType = {
  test: "boolean",
};

const Default = {
  test: true,
};

const DefaultClasses = {
  notchLeadingValid:
    "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[-1px_0_0_#14a44d,_0_1px_0_0_#14a44d,_0_-1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
  notchMiddleValid:
    "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[0_1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
  notchTrailingValid:
    "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[1px_0_0_#14a44d,_0_-1px_0_0_#14a44d,_0_1px_0_0_#14a44d] group-data-[te-input-focused]:border-[#14a44d]",
  notchLeadingInvalid:
    "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[-1px_0_0_#dc4c64,_0_1px_0_0_#dc4c64,_0_-1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
  notchMiddleInvalid:
    "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[0_1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
  notchTrailingInvalid:
    "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[1px_0_0_#dc4c64,_0_-1px_0_0_#dc4c64,_0_1px_0_0_#dc4c64] group-data-[te-input-focused]:border-[#dc4c64]",
  labelValid: "peer-focus:!text-[#14a44d]",
  labelInvalid: "peer-focus:!text-[#dc4c64]",
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
        element,
      };
    });
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

    this._validationElements.forEach((validationElement) => {
      const { element, type } = validationElement;
      const validationResult = element.getAttribute(ATTR_VALIDATION_STATE);

      if (validationResult !== "valid" && validationResult !== "invalid") {
        return;
      }

      const capitalizedValidationResult = validationResult.replace(
        validationResult.charAt(0),
        validationResult.charAt(0).toUpperCase()
      );

      if (type === "input") {
        const notches = SelectorEngine.find(SELECTOR_INPUT_NOTCHES, element);

        notches.forEach((notch, id) => {
          let classes =
            id === 0
              ? "notchLeading"
              : id === 1
              ? "notchMiddle"
              : "notchTrailing";

          notch.className = "";
          Manipulator.addClass(notch, InputClasses[classes]);

          classes += capitalizedValidationResult;
          Manipulator.addClass(notch, this._classes[classes]);
        });

        const labels = SelectorEngine.find("label", element);
        labels.forEach((label) => {
          Manipulator.removeClass(label, this._classes.labelValid);
          Manipulator.removeClass(label, this._classes.labelInvalid);

          Manipulator.addClass(
            label,
            this._classes[`label${capitalizedValidationResult}`]
          );
        });
      }
    });

    EventHandler.trigger(this._element, EVENT_VALIDATED);
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
