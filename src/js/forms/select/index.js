/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { createPopper } from "@popperjs/core";
import Data from "../../dom/data";
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import { typeCheckConfig, getUID } from "../../util/index";
import Input from "../input";
import SelectOption from "./select-option";
import SelectionModel from "./selection-model";
import {
  ESCAPE,
  ENTER,
  DOWN_ARROW,
  UP_ARROW,
  HOME,
  END,
  TAB,
} from "../../util/keycodes";
import allOptionsSelected from "./util";
import {
  getWrapperTemplate,
  getDropdownTemplate,
  getOptionsListTemplate,
  getFakeValueTemplate,
} from "./templates";

const NAME = "select";
const DATA_KEY = "te.select";

const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_CLOSE = `close${EVENT_KEY}`;
const EVENT_OPEN = `open${EVENT_KEY}`;
const EVENT_SELECT = `optionSelect${EVENT_KEY}`;
const EVENT_DESELECT = `optionDeselect${EVENT_KEY}`;
const EVENT_VALUE_CHANGE = `valueChange${EVENT_KEY}`;
const EVENT_CHANGE = "change";

const DATA_SELECT_INIT = "data-te-select-init";
const DATA_NO_RESULT = "data-te-select-no-results-ref";
const DATA_OPEN = "data-te-select-open";
const DATA_ACTIVE = "data-te-input-state-active";
const DATA_FOCUSED = "data-te-input-focused";
const DATA_DISABLED = "data-te-input-disabled";
const DATA_SELECT_OPTION_GROUP_LABEL = "data-te-select-option-group-label-ref";
const DATA_OPTION_ALL = "data-te-select-option-all-ref";
const DATA_SELECTED = "data-te-select-selected";

const SELECTOR_LABEL = "[data-te-select-label-ref]";
const SELECTOR_INPUT = "[data-te-select-input-ref]";
const SELECTOR_FILTER_INPUT = "[data-te-select-input-filter-ref]";
const SELECTOR_DROPDOWN = "[data-te-select-dropdown-ref]";
const SELECTOR_OPTIONS_WRAPPER = "[data-te-select-options-wrapper-ref]";
const SELECTOR_OPTIONS_LIST = "[data-te-select-options-list-ref]";
const SELECTOR_OPTION = "[data-te-select-option-ref]";
const SELECTOR_CLEAR_BUTTON = "[data-te-select-clear-btn-ref]";
const SELECTOR_CUSTOM_CONTENT = "[data-te-select-custom-content-ref]";
const SELECTOR_NO_RESULTS = `[${DATA_NO_RESULT}]`;
const SELECTOR_FORM_OUTLINE = "[data-te-select-form-outline-ref]";
const SELECTOR_TOGGLE = "[data-te-select-toggle]";
const SELECTOR_NOTCH = "[data-te-input-notch-ref]";

const ANIMATION_TRANSITION_TIME = 200;

const Default = {
  selectAutoSelect: false,
  selectContainer: "body",
  selectClearButton: false,
  disabled: false,
  selectDisplayedLabels: 5,
  selectFormWhite: false,
  multiple: false,
  selectOptionsSelectedLabel: "options selected",
  selectOptionHeight: 38,
  selectAll: true,
  selectAllLabel: "Select all",
  selectSearchPlaceholder: "Search...",
  selectSize: "default",
  selectVisibleOptions: 5,
  selectFilter: false,
  selectFilterDebounce: 300,
  selectNoResultText: "No results",
  selectValidation: false,
  selectValidFeedback: "Valid",
  selectInvalidFeedback: "Invalid",
  selectPlaceholder: "",
};

const DefaultType = {
  selectAutoSelect: "boolean",
  selectContainer: "string",
  selectClearButton: "boolean",
  disabled: "boolean",
  selectDisplayedLabels: "number",
  selectFormWhite: "boolean",
  multiple: "boolean",
  selectOptionsSelectedLabel: "string",
  selectOptionHeight: "number",
  selectAll: "boolean",
  selectAllLabel: "string",
  selectSearchPlaceholder: "string",
  selectSize: "string",
  selectVisibleOptions: "number",
  selectFilter: "boolean",
  selectFilterDebounce: "number",
  selectNoResultText: "string",
  selectValidation: "boolean",
  selectValidFeedback: "string",
  selectInvalidFeedback: "string",
  selectPlaceholder: "string",
};

const DefaultClasses = {
  dropdown:
    "relative outline-none min-w-[100px] m-0 scale-[0.8] opacity-0 bg-white shadow-[0_2px_5px_0_rgba(0,0,0,0.16),_0_2px_10px_0_rgba(0,0,0,0.12)] transition duration-200 motion-reduce:transition-none data-[te-select-open]:scale-100 data-[te-select-open]:opacity-100 dark:bg-zinc-700",
  formCheckInput:
    "relative float-left mt-[0.15rem] mr-[8px] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 dark:border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary dark:checked:border-primary checked:bg-primary dark:checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent",
  formOutline: "relative",
  initialized: "hidden",
  inputGroup:
    "flex items-center whitespace-nowrap p-2.5 text-center text-base font-normal leading-[1.6] text-gray-700 dark:bg-zinc-800 dark:text-gray-200 dark:placeholder:text-gray-200",
  noResult: "flex items-center px-4",
  optionsList: "list-none m-0 p-0",
  optionsWrapper: "overflow-y-auto",
  optionsWrapperScrollbar:
    "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-button]:block [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-button]:bg-transparent [&::-webkit-scrollbar-track-piece]:bg-transparent [&::-webkit-scrollbar-track-piece]:rounded-none [&::-webkit-scrollbar-track-piece]: [&::-webkit-scrollbar-track-piece]:rounded-l [&::-webkit-scrollbar-thumb]:h-[50px] [&::-webkit-scrollbar-thumb]:bg-[#999] [&::-webkit-scrollbar-thumb]:rounded",
  selectArrow:
    "absolute right-3 text-[0.8rem] cursor-pointer peer-focus:text-primary peer-data-[te-input-focused]:text-primary group-data-[te-was-validated]/validation:peer-valid:text-green-600 group-data-[te-was-validated]/validation:peer-invalid:text-[rgb(220,76,100)] w-5 h-5",
  selectArrowWhite:
    "text-gray-50 peer-focus:!text-white peer-data-[te-input-focused]:!text-white",
  selectArrowDefault: "top-2",
  selectArrowLg: "top-[13px]",
  selectArrowSm: "top-1",
  selectClearBtn:
    "absolute top-2 right-9 text-black cursor-pointer focus:text-primary outline-none dark:text-gray-200",
  selectClearBtnWhite: "!text-gray-50",
  selectClearBtnDefault: "top-2 text-base",
  selectClearBtnLg: "top-[11px] text-base",
  selectClearBtnSm: "top-1 text-[0.8rem]",
  selectDropdownContainer: "z-[1070]",
  selectFakeValue: "transform-none hidden data-[te-input-state-active]:block",
  selectFilterInput:
    "relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-gray-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition duration-300 ease-in-out motion-reduce:transition-none focus:border-primary focus:text-gray-700 focus:shadow-te-primary focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-200",
  selectInput:
    "peer block min-h-[auto] w-full rounded border-0 bg-transparent outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-gray-200 dark:placeholder:text-gray-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 cursor-pointer data-[te-input-disabled]:bg-[#e9ecef] data-[te-input-disabled]:cursor-default group-data-[te-was-validated]/validation:mb-4 dark:data-[te-input-disabled]:bg-zinc-600",
  selectInputWhite: "!text-gray-50",
  selectInputSizeDefault: "py-[0.32rem] px-3 leading-[1.6]",
  selectInputSizeLg: "py-[0.32rem] px-3 leading-[2.15]",
  selectInputSizeSm: "py-[0.33rem] px-3 text-xs leading-[1.5]",
  selectLabel:
    "pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate text-gray-500 transition-all duration-200 ease-out peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-200 dark:peer-focus:text-gray-200 data-[te-input-state-active]:scale-[0.8] dark:peer-focus:text-primary",
  selectLabelWhite: "!text-gray-50",
  selectLabelSizeDefault:
    "pt-[0.37rem] leading-[1.6] peer-focus:-translate-y-[0.9rem] peer-data-[te-input-state-active]:-translate-y-[0.9rem] data-[te-input-state-active]:-translate-y-[0.9rem]",
  selectLabelSizeLg:
    "pt-[0.37rem] leading-[2.15] peer-focus:-translate-y-[1.15rem] peer-data-[te-input-state-active]:-translate-y-[1.15rem] data-[te-input-state-active]:-translate-y-[1.15rem]",
  selectLabelSizeSm:
    "pt-[0.37rem] text-xs leading-[1.5] peer-focus:-translate-y-[0.75rem] peer-data-[te-input-state-active]:-translate-y-[0.75rem] data-[te-input-state-active]:-translate-y-[0.75rem]",
  selectOption:
    "flex flex-row items-center justify-between w-full px-4 truncate text-gray-700 bg-transparent select-none cursor-pointer data-[te-input-multiple-active]:bg-black/5 hover:[&:not([data-te-select-option-disabled])]:bg-black/5 data-[te-input-state-active]:bg-black/5 data-[te-select-option-selected]:data-[te-input-state-active]:bg-black/5 data-[te-select-selected]:data-[te-select-option-disabled]:cursor-default data-[te-select-selected]:data-[te-select-option-disabled]:text-gray-400 data-[te-select-selected]:data-[te-select-option-disabled]:bg-transparent data-[te-select-option-selected]:bg-black/[0.02] data-[te-select-option-disabled]:text-gray-400 data-[te-select-option-disabled]:cursor-default group-data-[te-select-option-group-ref]/opt:pl-7 dark:text-gray-200 dark:hover:[&:not([data-te-select-option-disabled])]:bg-white/30 dark:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-selected]:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-disabled]:text-gray-400 dark:data-[te-input-multiple-active]:bg-white/30",
  selectOptionGroup: "group/opt",
  selectOptionGroupLabel:
    "flex flex-row items-center w-full px-4 truncate bg-transparent text-black/50 select-none dark:text-gray-300",
  selectOptionIcon: "w-7 h-7 rounded-full",
  selectOptionSecondaryText:
    "block text-[0.8rem] text-gray-500 dark:text-gray-300",
  selectOptionText: "group",
  selectValidationValid:
    "hidden absolute -mt-3 w-auto text-sm text-green-600 cursor-pointer group-data-[te-was-validated]/validation:peer-valid:block",
  selectValidationInvalid:
    "hidden absolute -mt-3 w-auto text-sm text-[rgb(220,76,100)] cursor-pointer group-data-[te-was-validated]/validation:peer-invalid:block",
};

const DefaultClassesType = {
  dropdown: "string",
  formCheckInput: "string",
  formOutline: "string",
  initialized: "string",
  inputGroup: "string",
  noResult: "string",
  optionsList: "string",
  optionsWrapper: "string",
  optionsWrapperScrollbar: "string",
  selectArrow: "string",
  selectArrowDefault: "string",
  selectArrowLg: "string",
  selectArrowSm: "string",
  selectClearBtn: "string",
  selectClearBtnDefault: "string",
  selectClearBtnLg: "string",
  selectClearBtnSm: "string",
  selectDropdownContainer: "string",
  selectFakeValue: "string",
  selectFilterInput: "string",
  selectInput: "string",
  selectInputSizeDefault: "string",
  selectInputSizeLg: "string",
  selectInputSizeSm: "string",
  selectLabel: "string",
  selectLabelSizeDefault: "string",
  selectLabelSizeLg: "string",
  selectLabelSizeSm: "string",
  selectOption: "string",
  selectOptionGroup: "string",
  selectOptionGroupLabel: "string",
  selectOptionIcon: "string",
  selectOptionSecondaryText: "string",
  selectOptionText: "string",
};

class Select {
  constructor(element, config, classes) {
    this._element = element;
    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);

    if (this._config.selectPlaceholder && !this._config.multiple) {
      this._addPlaceholderOption();
    }

    this._optionsToRender = this._getOptionsToRender(element);

    // optionsToRender may contain option groups and nested options, in this case
    // we need a list of plain options to manage selections and keyboard navigation
    this._plainOptions = this._getPlainOptions(this._optionsToRender);
    this._filteredOptionsList = null;

    this._selectionModel = new SelectionModel(this.multiple);

    this._activeOptionIndex = -1;
    this._activeOption = null;

    this._wrapperId = getUID("select-wrapper-");
    this._dropdownContainerId = getUID("select-dropdown-container-");
    this._selectAllId = getUID("select-all-");
    this._debounceTimeoutId = null;

    this._dropdownHeight =
      this._config.selectOptionHeight * this._config.selectVisibleOptions;

    this._popper = null;
    this._input = null;
    this._label = SelectorEngine.next(this._element, SELECTOR_LABEL)[0];
    this._notch = null;
    this._fakeValue = null;
    this._isFakeValueActive = false;

    this._customContent = SelectorEngine.next(
      element,
      SELECTOR_CUSTOM_CONTENT
    )[0];

    this._toggleButton = null;
    this._elementToggle = null;

    this._wrapper = null;
    this._inputEl = null;
    this._dropdownContainer = null;
    this._container = null;
    this._selectAllOption = null;

    this._init();

    this._mutationObserver = null;
    this._isOpen = false;

    this._addMutationObserver();

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }
  }

  static get NAME() {
    return NAME;
  }

  get filterInput() {
    return SelectorEngine.findOne(
      SELECTOR_FILTER_INPUT,
      this._dropdownContainer
    );
  }

  get dropdown() {
    return SelectorEngine.findOne(SELECTOR_DROPDOWN, this._dropdownContainer);
  }

  get optionsList() {
    return SelectorEngine.findOne(
      SELECTOR_OPTIONS_LIST,
      this._dropdownContainer
    );
  }

  get optionsWrapper() {
    return SelectorEngine.findOne(
      SELECTOR_OPTIONS_WRAPPER,
      this._dropdownContainer
    );
  }

  get clearButton() {
    return SelectorEngine.findOne(SELECTOR_CLEAR_BUTTON, this._wrapper);
  }

  get options() {
    return this._filteredOptionsList
      ? this._filteredOptionsList
      : this._plainOptions;
  }

  get value() {
    return this.multiple
      ? this._selectionModel.values
      : this._selectionModel.value;
  }

  get multiple() {
    return this._config.multiple;
  }

  get hasSelectAll() {
    return this.multiple && this._config.selectAll;
  }

  get hasSelection() {
    return (
      this._selectionModel.selection ||
      this._selectionModel.selections.length > 0
    );
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    config = {
      ...Default,
      ...dataAttributes,
      ...config,
    };

    if (this._element.hasAttribute("multiple")) {
      config.multiple = true;
    }

    if (this._element.hasAttribute("disabled")) {
      config.disabled = true;
    }

    if (this._element.tabIndex) {
      config.tabIndex = this._element.getAttribute("tabIndex");
    }

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

  _addPlaceholderOption() {
    const placeholderOption = new Option("", "", true, true);
    placeholderOption.hidden = true;
    placeholderOption.selected = true;

    this._element.prepend(placeholderOption);
  }

  _getOptionsToRender(select) {
    const options = [];

    const nodes = select.childNodes;

    nodes.forEach((node) => {
      if (node.nodeName === "OPTGROUP") {
        const optionGroup = {
          id: getUID("group-"),
          label: node.label,
          disabled: node.hasAttribute("disabled"),
          hidden: node.hasAttribute("hidden"),
          options: [],
        };
        const groupOptions = node.childNodes;
        groupOptions.forEach((option) => {
          if (option.nodeName === "OPTION") {
            optionGroup.options.push(
              this._createOptionObject(option, optionGroup)
            );
          }
        });
        options.push(optionGroup);
      } else if (node.nodeName === "OPTION") {
        options.push(this._createOptionObject(node));
      }
    });
    return options;
  }

  _getPlainOptions(optionsToRender) {
    const hasOptionGroup = SelectorEngine.findOne("optgroup", this._element);

    if (!hasOptionGroup) {
      return optionsToRender;
    }

    const options = [];

    optionsToRender.forEach((option) => {
      const isOptionGroup = Object.prototype.hasOwnProperty.call(
        option,
        "options"
      );

      if (isOptionGroup) {
        option.options.forEach((nestedOption) => {
          options.push(nestedOption);
        });
      } else {
        options.push(option);
      }
    });

    return options;
  }

  _createOptionObject(nativeOption, group = {}) {
    const id = getUID("option-");
    const groupId = group.id ? group.id : null;
    const groupDisabled = group.disabled ? group.disabled : false;
    const selected =
      nativeOption.selected || nativeOption.hasAttribute(DATA_SELECTED);
    const disabled = nativeOption.hasAttribute("disabled") || groupDisabled;
    const hidden =
      nativeOption.hasAttribute("hidden") || (group && group.hidden);
    const multiple = this.multiple;
    const value = nativeOption.value;
    const label = nativeOption.label;
    const secondaryText = Manipulator.getDataAttribute(
      nativeOption,
      "selectSecondaryText"
    );
    const icon = Manipulator.getDataAttribute(nativeOption, "select-icon");
    return new SelectOption(
      id,
      nativeOption,
      multiple,
      value,
      label,
      selected,
      disabled,
      hidden,
      secondaryText,
      groupId,
      icon
    );
  }

  _getNavigationOptions() {
    const availableOptions = this.options.filter((option) => !option.hidden);

    return this.hasSelectAll
      ? [this._selectAllOption, ...availableOptions]
      : availableOptions;
  }

  _init() {
    this._renderMaterialWrapper();

    this._wrapper = SelectorEngine.findOne(`#${this._wrapperId}`);
    this._input = SelectorEngine.findOne(SELECTOR_INPUT, this._wrapper);
    this._config.disabled && this._input.setAttribute(DATA_DISABLED, "");

    const containerSelector = this._config.selectContainer;

    if (containerSelector === "body") {
      this._container = document.body;
    } else {
      this._container = SelectorEngine.findOne(containerSelector);
    }

    this._initOutlineInput();
    this._setDefaultSelections();
    this._updateInputValue();
    this._appendFakeValue();
    this._updateFakeLabelPosition();
    this._updateLabelPosition();
    this._updateClearButtonVisibility();

    this._bindComponentEvents();

    if (this.hasSelectAll) {
      this._selectAllOption = this._createSelectAllOption();
    }

    this._dropdownContainer = getDropdownTemplate(
      this._dropdownContainerId,
      this._config,
      this._input.offsetWidth,
      this._dropdownHeight,
      this._selectAllOption,
      this._optionsToRender,
      this._customContent,
      this._classes
    );

    this._setFirstActiveOption();
    this._listenToFocusChange();
  }

  _renderMaterialWrapper() {
    const template = getWrapperTemplate(
      this._wrapperId,
      this._config,
      this._label,
      this._classes,
      this._element.name
    );
    this._element.parentNode.insertBefore(template, this._element);
    Manipulator.addClass(this._element, this._classes.initialized);
    template.appendChild(this._element);
  }

  _initOutlineInput() {
    const inputWrapper = SelectorEngine.findOne(
      SELECTOR_FORM_OUTLINE,
      this._wrapper
    );
    const outlineInput = new Input(
      inputWrapper,
      {
        inputFormWhite: this._config.selectFormWhite,
      },
      this._classes
    );
    outlineInput.init();
    this._notch = SelectorEngine.findOne(SELECTOR_NOTCH, this._wrapper);
  }

  _bindComponentEvents() {
    this._listenToComponentKeydown();
    this._listenToWrapperClick();
    this._listenToClearBtnClick();
    this._listenToClearBtnKeydown();
  }

  _setDefaultSelections() {
    this.options.forEach((option) => {
      if (option.selected) {
        this._selectionModel.select(option);
      }
    });
  }

  _listenToComponentKeydown() {
    EventHandler.on(this._wrapper, "keydown", this._handleKeydown.bind(this));
  }

  _handleKeydown(event) {
    if (this._isOpen && !this._config.selectFilter) {
      this._handleOpenKeydown(event);
    } else {
      this._handleClosedKeydown(event);
    }
  }

  _handleOpenKeydown(event) {
    const key = event.keyCode;
    const isCloseKey =
      key === ESCAPE || (key === UP_ARROW && event.altKey) || key === TAB;

    if (key === TAB && this._config.selectAutoSelect && !this.multiple) {
      this._handleAutoSelection(this._activeOption);
    }

    if (isCloseKey) {
      this.close();
      this._input.focus();
      return;
    }

    switch (key) {
      case DOWN_ARROW:
        this._setNextOptionActive();
        this._scrollToOption(this._activeOption);
        break;
      case UP_ARROW:
        this._setPreviousOptionActive();
        this._scrollToOption(this._activeOption);
        break;
      case HOME:
        this._setFirstOptionActive();
        this._scrollToOption(this._activeOption);
        break;
      case END:
        this._setLastOptionActive();
        this._scrollToOption(this._activeOption);
        break;
      case ENTER:
        event.preventDefault();
        if (this._activeOption) {
          if (this.hasSelectAll && this._activeOptionIndex === 0) {
            this._handleSelectAll();
          } else {
            this._handleSelection(this._activeOption);
          }
        }
        return;
      default:
        return;
    }

    event.preventDefault();
  }

  _handleClosedKeydown(event) {
    const key = event.keyCode;
    if (key === ENTER) {
      event.preventDefault();
    }
    const isOpenKey =
      key === ENTER ||
      (key === DOWN_ARROW && event.altKey) ||
      (key === DOWN_ARROW && this.multiple);

    if (isOpenKey) {
      this.open();
    }

    if (!this.multiple) {
      switch (key) {
        case DOWN_ARROW:
          this._setNextOptionActive();
          this._handleSelection(this._activeOption);
          break;
        case UP_ARROW:
          this._setPreviousOptionActive();
          this._handleSelection(this._activeOption);
          break;
        case HOME:
          this._setFirstOptionActive();
          this._handleSelection(this._activeOption);
          break;
        case END:
          this._setLastOptionActive();
          this._handleSelection(this._activeOption);
          break;
        default:
          return;
      }
    } else {
      switch (key) {
        case DOWN_ARROW:
          this.open();
          break;
        case UP_ARROW:
          this.open();
          break;
        default:
          return;
      }
    }

    event.preventDefault();
  }

  _scrollToOption(option) {
    if (!option) {
      return;
    }

    let optionIndex;

    const visibleOptions = this.options.filter((option) => !option.hidden);

    if (this.hasSelectAll) {
      optionIndex = visibleOptions.indexOf(option) + 1;
    } else {
      optionIndex = visibleOptions.indexOf(option);
    }

    const groupsNumber = this._getNumberOfGroupsBeforeOption(optionIndex);

    const scrollToIndex = optionIndex + groupsNumber;

    const list = this.optionsWrapper;
    const listHeight = list.offsetHeight;
    const optionHeight = this._config.selectOptionHeight;
    const scrollTop = list.scrollTop;

    if (optionIndex > -1) {
      const optionOffset = scrollToIndex * optionHeight;
      const isBelow = optionOffset + optionHeight > scrollTop + listHeight;
      const isAbove = optionOffset < scrollTop;

      if (isAbove) {
        list.scrollTop = optionOffset;
      } else if (isBelow) {
        list.scrollTop = optionOffset - listHeight + optionHeight;
      } else {
        list.scrollTop = scrollTop;
      }
    }
  }

  _getNumberOfGroupsBeforeOption(optionIndex) {
    const optionsList = this.options.filter((option) => !option.hidden);
    const groupsList = this._optionsToRender.filter((group) => !group.hidden);
    const index = this.hasSelectAll ? optionIndex - 1 : optionIndex;
    let groupsNumber = 0;

    for (let i = 0; i <= index; i++) {
      if (
        optionsList[i].groupId &&
        groupsList[groupsNumber] &&
        groupsList[groupsNumber].id &&
        optionsList[i].groupId === groupsList[groupsNumber].id
      ) {
        groupsNumber++;
      }
    }

    return groupsNumber;
  }

  _setNextOptionActive() {
    let index = this._activeOptionIndex + 1;
    const options = this._getNavigationOptions();

    if (!options[index]) {
      return;
    }

    while (options[index].disabled) {
      index += 1;

      if (!options[index]) {
        return;
      }
    }

    this._updateActiveOption(options[index], index);
  }

  _setPreviousOptionActive() {
    let index = this._activeOptionIndex - 1;
    const options = this._getNavigationOptions();

    if (!options[index]) {
      return;
    }

    while (options[index].disabled) {
      index -= 1;

      if (!options[index]) {
        return;
      }
    }

    this._updateActiveOption(options[index], index);
  }

  _setFirstOptionActive() {
    const index = 0;
    const options = this._getNavigationOptions();

    this._updateActiveOption(options[index], index);
  }

  _setLastOptionActive() {
    const options = this._getNavigationOptions();
    const index = options.length - 1;

    this._updateActiveOption(options[index], index);
  }

  _updateActiveOption(newActiveOption, index) {
    const currentActiveOption = this._activeOption;

    if (currentActiveOption) {
      currentActiveOption.removeActiveStyles();
    }

    newActiveOption.setActiveStyles();
    this._activeOptionIndex = index;
    this._activeOption = newActiveOption;
  }

  _listenToWrapperClick() {
    EventHandler.on(this._wrapper, "click", () => {
      this.toggle();
    });
  }

  _listenToClearBtnClick() {
    EventHandler.on(this.clearButton, "click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._handleClear();
    });
  }

  _listenToClearBtnKeydown() {
    EventHandler.on(this.clearButton, "keydown", (event) => {
      if (event.keyCode === ENTER) {
        this._handleClear();
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  _handleClear() {
    if (this.multiple) {
      this._selectionModel.clear();
      this._deselectAllOptions(this.options);

      if (this.hasSelectAll) {
        this._updateSelectAllState();
      }
    } else {
      const selected = this._selectionModel.selection;
      this._selectionModel.clear();
      selected.deselect();
    }
    this._fakeValue.innerHTML = "";
    this._updateInputValue();
    this._updateFakeLabelPosition();
    this._updateLabelPosition();
    this._updateClearButtonVisibility();

    this._emitValueChangeEvent(null);
    this._emitNativeChangeEvent();
  }

  _listenToOptionsClick() {
    EventHandler.on(this.optionsWrapper, "click", (event) => {
      const optionGroupLabel = event.target.hasAttribute(
        DATA_SELECT_OPTION_GROUP_LABEL
      );

      if (optionGroupLabel) {
        return;
      }

      const target =
        event.target.nodeName === "DIV"
          ? event.target
          : SelectorEngine.closest(event.target, SELECTOR_OPTION);

      const selectAllOption = target.hasAttribute(DATA_OPTION_ALL);

      if (selectAllOption) {
        this._handleSelectAll();
        return;
      }

      const id = target.dataset.teId;
      const option = this.options.find((option) => option.id === id);

      if (option && !option.disabled) {
        this._handleSelection(option);
      }
    });
  }

  _handleSelectAll() {
    const selected = this._selectAllOption.selected;

    if (selected) {
      this._deselectAllOptions(this.options);
      this._selectAllOption.deselect();
    } else {
      this._selectAllOptions(this.options);
      this._selectAllOption.select();
    }

    this._updateInputValue();
    this._updateFakeLabelPosition();
    this._updateLabelPosition();
    this._updateClearButtonVisibility();

    this._emitValueChangeEvent(this.value);
    this._emitNativeChangeEvent();
  }

  _selectAllOptions(options) {
    options.forEach((option) => {
      if (!option.selected && !option.disabled) {
        this._selectionModel.select(option);
        option.select();
      }
    });
  }

  _deselectAllOptions(options) {
    options.forEach((option) => {
      if (option.selected && !option.disabled) {
        this._selectionModel.deselect(option);
        option.deselect();
      }
    });
  }

  _handleSelection(option) {
    if (this.multiple) {
      this._handleMultiSelection(option);

      if (this.hasSelectAll) {
        this._updateSelectAllState();
      }
    } else {
      this._handleSingleSelection(option);
    }

    this._updateInputValue();
    this._updateFakeLabelPosition();
    this._updateLabelPosition();
    this._updateClearButtonVisibility();
  }

  _handleAutoSelection(option) {
    this._singleOptionSelect(option);
    this._updateInputValue();
    this._updateFakeLabelPosition();
    this._updateLabelPosition();
    this._updateClearButtonVisibility();
  }

  _handleSingleSelection(option) {
    this._singleOptionSelect(option);
    this.close();
    this._input.focus();
  }

  _singleOptionSelect(option) {
    const currentSelected = this._selectionModel.selections[0];

    if (currentSelected && currentSelected !== option) {
      this._selectionModel.deselect(currentSelected);
      currentSelected.deselect();
      currentSelected.node.setAttribute(DATA_SELECTED, false);
      EventHandler.trigger(this._element, EVENT_DESELECT, {
        value: currentSelected.value,
      });
    }

    if (!currentSelected || (currentSelected && option !== currentSelected)) {
      this._selectionModel.select(option);
      option.select();
      option.node.setAttribute(DATA_SELECTED, true);
      EventHandler.trigger(this._element, EVENT_SELECT, {
        value: option.value,
      });
      this._emitValueChangeEvent(this.value);
      this._emitNativeChangeEvent();
    }
  }

  _handleMultiSelection(option) {
    if (option.selected) {
      this._selectionModel.deselect(option);
      option.deselect();
      option.node.setAttribute(DATA_SELECTED, false);
      EventHandler.trigger(this._element, EVENT_DESELECT, {
        value: option.value,
      });
    } else {
      this._selectionModel.select(option);
      option.select();
      option.node.setAttribute(DATA_SELECTED, true);
      EventHandler.trigger(this._element, EVENT_SELECT, {
        value: option.value,
      });
    }

    this._emitValueChangeEvent(this.value);
    this._emitNativeChangeEvent();
  }

  _emitValueChangeEvent(value) {
    EventHandler.trigger(this._element, EVENT_VALUE_CHANGE, { value });
  }

  _emitNativeChangeEvent() {
    EventHandler.trigger(this._element, EVENT_CHANGE);
  }

  _updateInputValue() {
    const labels = this.multiple
      ? this._selectionModel.labels
      : this._selectionModel.label;
    let value;

    if (
      this.multiple &&
      this._config.selectDisplayedLabels !== -1 &&
      this._selectionModel.selections.length >
        this._config.selectDisplayedLabels
    ) {
      value = `${this._selectionModel.selections.length} ${this._config.selectOptionsSelectedLabel}`;
    } else {
      value = labels;
    }

    if (
      !this.multiple &&
      !this._isSelectionValid(this._selectionModel.selection)
    ) {
      this._input.value = "";
    } else if (this._isLabelEmpty(this._selectionModel.selection)) {
      this._input.value = " ";
    } else if (value) {
      this._input.value = value;
    } else {
      // prettier-ignore
      // eslint-disable-next-line
      this.multiple || !this._optionsToRender[0] ? (this._input.value = '') : (this._input.value = this._optionsToRender[0].label);
    }
  }

  _isSelectionValid(selection) {
    if (selection && (selection.disabled || selection.value === "")) {
      return false;
    }

    return true;
  }

  _isLabelEmpty(selection) {
    if (selection && selection.label === "") {
      return true;
    }

    return false;
  }

  _appendFakeValue() {
    if (!this._selectionModel.selection || this._selectionModel._multiple) {
      return;
    }

    const value = this._selectionModel.selection.label;
    this._fakeValue = getFakeValueTemplate(value, this._classes);
    const inputWrapper = SelectorEngine.findOne(
      SELECTOR_FORM_OUTLINE,
      this._wrapper
    );
    inputWrapper.appendChild(this._fakeValue);
  }

  _updateLabelPosition() {
    const isInitialized = this._element.hasAttribute(DATA_SELECT_INIT);

    const isValueEmpty = this._input.value !== "";
    if (!this._label) {
      return;
    }

    if (
      isInitialized &&
      (isValueEmpty || this._isOpen || this._isFakeValueActive)
    ) {
      this._label.setAttribute(DATA_ACTIVE, "");
      this._notch.setAttribute(DATA_ACTIVE, "");
    } else {
      this._label.removeAttribute(DATA_ACTIVE);
      this._notch.removeAttribute(DATA_ACTIVE, "");
    }
  }

  _updateLabelPositionWhileClosing() {
    if (!this._label) {
      return;
    }

    if (this._input.value !== "" || this._isFakeValueActive) {
      this._label.setAttribute(DATA_ACTIVE, "");
      this._notch.setAttribute(DATA_ACTIVE, "");
    } else {
      this._label.removeAttribute(DATA_ACTIVE);
      this._notch.removeAttribute(DATA_ACTIVE);
    }
  }

  _updateFakeLabelPosition() {
    if (!this._fakeValue) {
      return;
    }

    if (
      this._input.value === "" &&
      this._fakeValue.innerHTML !== "" &&
      !this._config.selectPlaceholder
    ) {
      this._isFakeValueActive = true;
      this._fakeValue.setAttribute(DATA_ACTIVE, "");
    } else {
      this._isFakeValueActive = false;
      this._fakeValue.removeAttribute(DATA_ACTIVE);
    }
  }

  _updateClearButtonVisibility() {
    if (!this.clearButton) {
      return;
    }

    const hasSelection =
      this._selectionModel.selection ||
      this._selectionModel.selections.length > 0;

    if (hasSelection) {
      Manipulator.addStyle(this.clearButton, { display: "block" });
    } else {
      Manipulator.addStyle(this.clearButton, { display: "none" });
    }
  }

  _updateSelectAllState() {
    const selectAllSelected = this._selectAllOption.selected;
    const allSelected = allOptionsSelected(this.options);
    if (!allSelected && selectAllSelected) {
      this._selectAllOption.deselect();
    } else if (allSelected && !selectAllSelected) {
      this._selectAllOption.select();
    }
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const isDisabled = this._config.disabled;
    const openEvent = EventHandler.trigger(this._element, EVENT_OPEN);

    if (this._isOpen || isDisabled || openEvent.defaultPrevented) {
      return;
    }

    this._openDropdown();
    this._updateDropdownWidth();
    this._setFirstActiveOption();
    this._scrollToOption(this._activeOption);

    if (this._config.selectFilter) {
      // We need to wait for popper initialization, otherwise
      // dates container will be focused before popper position
      // update which can change the scroll position on the page
      setTimeout(() => {
        this.filterInput.focus();
      }, 0);

      this._listenToSelectSearch();

      // New listener for dropdown navigation is needed, because
      // we focus search input inside dropdown template, wchich is
      // appended to the body. In this case listener attached to the
      // select wrapper won't work
      this._listenToDropdownKeydown();
    }

    this._listenToOptionsClick();
    this._listenToOutsideClick();
    this._listenToWindowResize();

    this._isOpen = true;

    this._updateLabelPosition();
    this._setInputActiveStyles();
  }

  _openDropdown() {
    this._popper = createPopper(this._input, this._dropdownContainer, {
      placement: "bottom-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 1],
          },
        },
      ],
    });
    this._container.appendChild(this._dropdownContainer);

    // We need to add delay to wait for the popper initialization
    // and position update
    setTimeout(() => {
      this.dropdown.setAttribute(DATA_OPEN, "");
    }, 0);
  }

  _updateDropdownWidth() {
    const inputWidth = this._input.offsetWidth;
    Manipulator.addStyle(this._dropdownContainer, { width: `${inputWidth}px` });
  }

  _setFirstActiveOption() {
    const options = this._getNavigationOptions();
    const currentActive = this._activeOption;

    if (currentActive) {
      currentActive.removeActiveStyles();
    }

    const firstSelected = this.multiple
      ? this._selectionModel.selections[0]
      : this._selectionModel.selection;

    if (firstSelected) {
      this._activeOption = firstSelected;
      firstSelected.setActiveStyles();
      this._activeOptionIndex = options.findIndex(
        (option) => option === firstSelected
      );
    } else {
      this._activeOption = null;
      this._activeOptionIndex = -1;
    }
  }

  _setInputActiveStyles() {
    this._input.setAttribute(DATA_FOCUSED, "");
    SelectorEngine.findOne(SELECTOR_NOTCH, this._wrapper).setAttribute(
      DATA_FOCUSED,
      ""
    );
  }

  _listenToWindowResize() {
    EventHandler.on(window, "resize", this._handleWindowResize.bind(this));
  }

  _handleWindowResize() {
    if (this._dropdownContainer) {
      this._updateDropdownWidth();
    }
  }

  _listenToSelectSearch() {
    this.filterInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value;
      const debounceTime = this._config.selectFilterDebounce;
      this._debounceFilter(searchTerm, debounceTime);
    });
  }

  _debounceFilter(searchTerm, debounceTime) {
    if (this._debounceTimeoutId) {
      clearTimeout(this._debounceTimeoutId);
    }

    this._debounceTimeoutId = setTimeout(() => {
      this._filterOptions(searchTerm);
    }, debounceTime);
  }

  _filterOptions(searchTerm) {
    const filtered = [];

    this._optionsToRender.forEach((option) => {
      const isOptionGroup = Object.prototype.hasOwnProperty.call(
        option,
        "options"
      );

      const isValidOption =
        !isOptionGroup &&
        option.label.toLowerCase().includes(searchTerm.toLowerCase());
      const group = {};

      if (isOptionGroup) {
        group.label = option.label;
        group.options = this._filter(searchTerm, option.options);

        if (group.options.length > 0) {
          filtered.push(group);
        }
      }

      if (isValidOption) {
        filtered.push(option);
      }
    });

    const hasNoResultsText = this._config.selectNoResultText !== "";
    const hasFilteredOptions = filtered.length !== 0;

    if (hasFilteredOptions) {
      this._updateOptionsListTemplate(filtered);
      this._popper.forceUpdate();
      this._filteredOptionsList = this._getPlainOptions(filtered);

      if (this.hasSelectAll) {
        this._updateSelectAllState();
      }

      this._setFirstActiveOption();
    } else if (!hasFilteredOptions && hasNoResultsText) {
      const noResultsTemplate = this._getNoResultTemplate();
      this.optionsWrapper.innerHTML = noResultsTemplate;
    }
  }

  _updateOptionsListTemplate(optionsToRender) {
    const optionsWrapperContent =
      SelectorEngine.findOne(SELECTOR_OPTIONS_LIST, this._dropdownContainer) ||
      SelectorEngine.findOne(SELECTOR_NO_RESULTS, this._dropdownContainer);

    const optionsListTemplate = getOptionsListTemplate(
      optionsToRender,
      this._selectAllOption,
      this._config,
      this._classes
    );

    this.optionsWrapper.removeChild(optionsWrapperContent);
    this.optionsWrapper.appendChild(optionsListTemplate);
  }

  _getNoResultTemplate() {
    return `<div class="${this._classes.noResult}" ${DATA_NO_RESULT} style="height: ${this._config.selectOptionHeight}px">${this._config.selectNoResultText}</div>`;
  }

  _filter(value, options) {
    const filterValue = value.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  _listenToDropdownKeydown() {
    EventHandler.on(
      this.dropdown,
      "keydown",
      this._handleOpenKeydown.bind(this)
    );
  }

  _listenToOutsideClick() {
    this._outsideClick = this._handleOutSideClick.bind(this);
    EventHandler.on(document, "click", this._outsideClick);
  }

  _listenToFocusChange(add = true) {
    if (add === false) {
      EventHandler.off(this._input, "focus", () =>
        this._notch.setAttribute(DATA_FOCUSED, "")
      );

      EventHandler.off(this._input, "blur", () =>
        this._notch.removeAttribute(DATA_FOCUSED)
      );
      return;
    }
    EventHandler.on(this._input, "focus", () =>
      this._notch.setAttribute(DATA_FOCUSED, "")
    );

    EventHandler.on(this._input, "blur", () =>
      this._notch.removeAttribute(DATA_FOCUSED)
    );
  }

  _handleOutSideClick(event) {
    const isSelectContent =
      this._wrapper && this._wrapper.contains(event.target);
    const isDropdown = event.target === this._dropdownContainer;
    const isDropdownContent =
      this._dropdownContainer && this._dropdownContainer.contains(event.target);

    let isButton;
    if (!this._toggleButton) {
      this._elementToggle = SelectorEngine.find(SELECTOR_TOGGLE);
    }
    if (this._elementToggle) {
      this._elementToggle.forEach((button) => {
        const attributes = Manipulator.getDataAttribute(
          button,
          "select-toggle"
        );
        if (
          attributes === this._element.id ||
          this._element.classList.contains(attributes)
        ) {
          this._toggleButton = button;
          isButton = this._toggleButton.contains(event.target);
        }
      });
    }

    if (!isSelectContent && !isDropdown && !isDropdownContent && !isButton) {
      this.close();
    }
  }

  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

    if (!this._isOpen || closeEvent.defaultPrevented) {
      return;
    }

    if (this._config.selectFilter && this.hasSelectAll) {
      this._resetFilterState();
      this._updateOptionsListTemplate(this._optionsToRender);
      if (this._config.multiple) {
        this._updateSelectAllState();
      }
    }

    this._removeDropdownEvents();

    this.dropdown.removeAttribute(DATA_OPEN);

    setTimeout(() => {
      this._input.removeAttribute(DATA_FOCUSED);
      this._input.blur();

      SelectorEngine.findOne(SELECTOR_NOTCH, this._wrapper).removeAttribute(
        DATA_FOCUSED
      );
      if (this._label && !this.hasSelection) {
        this._label.removeAttribute(DATA_ACTIVE);
        this._notch.setAttribute(DATA_ACTIVE, "");

        this._input.removeAttribute(DATA_ACTIVE);
        this._notch.removeAttribute(DATA_ACTIVE);
      }
      this._updateLabelPositionWhileClosing();
    }, 0);

    setTimeout(() => {
      if (
        this._container &&
        this._dropdownContainer.parentNode === this._container
      ) {
        this._container.removeChild(this._dropdownContainer);
      }
      this._popper.destroy();
      this._isOpen = false;
      EventHandler.off(this.dropdown, "transitionend");
    }, ANIMATION_TRANSITION_TIME);
  }

  _resetFilterState() {
    this.filterInput.value = "";
    this._filteredOptionsList = null;
  }

  _removeDropdownEvents() {
    EventHandler.off(document, "click", this._outsideClick);

    if (this._config.selectFilter) {
      EventHandler.off(this.dropdown, "keydown");
    }

    EventHandler.off(this.optionsWrapper, "click");
  }

  _addMutationObserver() {
    this._mutationObserver = new MutationObserver(() => {
      if (this._wrapper) {
        this._updateSelections();
        this._updateDisabledState();
      }
    });

    this._observeMutationObserver();
  }

  _updateSelections() {
    this._optionsToRender = this._getOptionsToRender(this._element);
    this._plainOptions = this._getPlainOptions(this._optionsToRender);
    this._selectionModel.clear();
    this._setDefaultSelections();
    this._updateInputValue();
    this._updateFakeLabelPosition();
    this._updateLabelPosition();
    this._updateClearButtonVisibility();

    if (this.hasSelectAll) {
      this._updateSelectAllState();
    }

    const hasFilterValue =
      this._config.filter && this.filterInput && this.filterInput.value;

    if (this._isOpen && !hasFilterValue) {
      this._updateOptionsListTemplate(this._optionsToRender);
      this._setFirstActiveOption();
    } else if (this._isOpen && hasFilterValue) {
      this._filterOptions(this.filterInput.value);
      this._setFirstActiveOption();
    } else {
      this._dropdownContainer = getDropdownTemplate(
        this._dropdownContainerId,
        this._config,
        this._input.offsetWidth,
        this._dropdownHeight,
        this._selectAllOption,
        this._optionsToRender,
        this._customContent,
        this._classes
      );
    }
  }

  _updateDisabledState() {
    const input = SelectorEngine.findOne(SELECTOR_INPUT, this._wrapper);

    if (this._element.hasAttribute("disabled")) {
      this._config.disabled = true;
      input.setAttribute("disabled", "");
      input.setAttribute(DATA_DISABLED, "");
    } else {
      this._config.disabled = false;
      input.removeAttribute("disabled");
      input.removeAttribute(DATA_DISABLED);
    }
  }

  _observeMutationObserver() {
    if (!this._mutationObserver) {
      return;
    }

    this._mutationObserver.observe(this._element, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  _disconnectMutationObserver() {
    if (this.mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
  }

  _createSelectAllOption() {
    const id = this._selectAllId;
    const nativeOption = null;
    const multiple = true;
    const value = "select-all";
    const label = this._config.selectAllLabel;
    const selected = allOptionsSelected(this.options);
    const disabled = false;
    const hidden = false;
    const secondaryText = null;
    const groupId = null;
    const icon = null;

    return new SelectOption(
      id,
      nativeOption,
      multiple,
      value,
      label,
      selected,
      disabled,
      hidden,
      secondaryText,
      groupId,
      icon
    );
  }

  dispose() {
    this._removeComponentEvents();

    this._destroyMaterialSelect();
    this._listenToFocusChange(false);

    Data.removeData(this._element, DATA_KEY);
  }

  _removeComponentEvents() {
    EventHandler.off(this.input, "click");
    EventHandler.off(this.wrapper, this._handleKeydown.bind(this));
    EventHandler.off(this.clearButton, "click");
    EventHandler.off(this.clearButton, "keydown");
    EventHandler.off(window, "resize", this._handleWindowResize.bind(this));
  }

  _destroyMaterialSelect() {
    if (this._isOpen) {
      this.close();
    }

    this._destroyMaterialTemplate();
  }

  _destroyMaterialTemplate() {
    const wrapperParent = this._wrapper.parentNode;
    const labels = SelectorEngine.find("label", this._wrapper);

    wrapperParent.appendChild(this._element);
    labels.forEach((label) => {
      wrapperParent.appendChild(label);
    });

    labels.forEach((label) => {
      label.removeAttribute(DATA_ACTIVE);
    });
    Manipulator.removeClass(this._element, this._classes.initialized);
    this._element.removeAttribute(DATA_SELECT_INIT);

    wrapperParent.removeChild(this._wrapper);
  }

  setValue(value) {
    this.options
      .filter((option) => option.selected)
      .forEach((selection) => (selection.nativeOption.selected = false));

    const isMultipleValue = Array.isArray(value);

    if (isMultipleValue) {
      value.forEach((selectionValue) => {
        this._selectByValue(selectionValue);
      });
    } else {
      this._selectByValue(value);
    }

    this._updateSelections();
  }

  _selectByValue(value) {
    const correspondingOption = this.options.find(
      (option) => option.value === value
    );
    if (!correspondingOption) {
      return false;
    }
    correspondingOption.nativeOption.selected = true;
    return true;
  }

  static jQueryInterface(config, options) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;

      if (!data && /dispose/.test(config)) {
        return;
      }

      if (!data) {
        data = new Select(this, _config);
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

export default Select;
