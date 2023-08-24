/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { element } from "../../util/index";
import Manipulator from "../../dom/manipulator";
import allOptionsSelected from "./util";

const DATA_FORM_OUTLINE = "data-te-select-form-outline-ref";
const DATA_SELECT_WRAPPER = "data-te-select-wrapper-ref";
const DATA_SELECT_INPUT = "data-te-select-input-ref";
const DATA_CLEAR_BUTTON = "data-te-select-clear-btn-ref";
const DATA_SELECT_DROPDOWN_CONTAINER = "data-te-select-dropdown-container-ref";
const DATA_DROPDOWN = "data-te-select-dropdown-ref";
const DATA_OPTIONS_WRAPPER = "data-te-select-options-wrapper-ref";
const DATA_OPTIONS_LIST = "data-te-select-options-list-ref";
const DATA_FILTER_INPUT = "data-te-select-input-filter-ref";
const DATA_OPTION = "data-te-select-option-ref";
const DATA_OPTION_ALL = "data-te-select-option-all-ref";
const DATA_SELECT_OPTION_TEXT = "data-te-select-option-text-ref";
const DATA_FORM_CHECK_INPUT = "data-te-form-check-input";
const DATA_SELECT_OPTION_GROUP = "data-te-select-option-group-ref";
const DATA_SELECT_OPTION_GROUP_LABEL = "data-te-select-option-group-label-ref";

const DATA_SELECTED = "data-te-select-selected";

const iconSVGTemplate = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
`;

const preventKeydown = (event) => {
  if (event.code === "Tab" || event.code === "Esc") {
    return;
  }

  event.preventDefault();
};

function _setSizeClasses(element, config, defaultSize, smSize, lgSize) {
  if (config.selectSize === "default") {
    Manipulator.addClass(element, defaultSize);
  }

  if (config.selectSize === "sm") {
    Manipulator.addClass(element, smSize);
  }

  if (config.selectSize === "lg") {
    Manipulator.addClass(element, lgSize);
  }
}

export function getWrapperTemplate(id, config, label, classes, selectName) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", id);
  wrapper.setAttribute(DATA_SELECT_WRAPPER, "");

  const formOutline = element("div");
  formOutline.setAttribute(DATA_FORM_OUTLINE, "");
  Manipulator.addClass(formOutline, classes.formOutline);

  const input = element("input");
  const role = config.selectFilter ? "combobox" : "listbox";
  const multiselectable = config.multiple ? "true" : "false";
  const disabled = config.disabled ? "true" : "false";
  input.setAttribute(DATA_SELECT_INPUT, "");
  Manipulator.addClass(input, classes.selectInput);

  _setSizeClasses(
    input,
    config,
    classes.selectInputSizeDefault,
    classes.selectInputSizeSm,
    classes.selectInputSizeLg
  );

  if (config.selectFormWhite) {
    Manipulator.addClass(input, classes.selectInputWhite);
  }

  input.setAttribute("type", "text");
  input.setAttribute("role", role);
  input.setAttribute("aria-multiselectable", multiselectable);
  input.setAttribute("aria-disabled", disabled);
  input.setAttribute("aria-haspopup", "true");
  input.setAttribute("aria-expanded", false);
  input.name = selectName;

  if (config.tabIndex) {
    input.setAttribute("tabIndex", config.tabIndex);
  }

  if (config.disabled) {
    input.setAttribute("disabled", "");
  }

  if (config.selectPlaceholder !== "") {
    input.setAttribute("placeholder", config.selectPlaceholder);
  }

  if (config.selectValidation) {
    Manipulator.addStyle(input, {
      "pointer-events": "none",
      "caret-color": "transparent",
    });
    Manipulator.addStyle(formOutline, { cursor: "pointer" });
  } else {
    input.setAttribute("readonly", "true");
  }

  if (config.selectValidation) {
    input.setAttribute("required", "true");
    input.setAttribute("aria-required", "true");
    input.addEventListener("keydown", preventKeydown);
  }

  const validFeedback = element("div");
  Manipulator.addClass(validFeedback, classes.selectValidationValid);

  const validFeedBackText = document.createTextNode(
    `${config.selectValidFeedback}`
  );
  validFeedback.appendChild(validFeedBackText);

  const invalidFeedback = element("div");
  Manipulator.addClass(invalidFeedback, classes.selectValidationInvalid);

  const invalidFeedBackText = document.createTextNode(
    `${config.selectInvalidFeedback}`
  );
  invalidFeedback.appendChild(invalidFeedBackText);

  const clearBtn = element("span");
  clearBtn.setAttribute(DATA_CLEAR_BUTTON, "");

  Manipulator.addClass(clearBtn, classes.selectClearBtn);

  _setSizeClasses(
    clearBtn,
    config,
    classes.selectClearBtnDefault,
    classes.selectClearBtnSm,
    classes.selectClearBtnLg
  );

  if (config.selectFormWhite) {
    Manipulator.addClass(clearBtn, classes.selectClearBtnWhite);
  }

  const clearBtnText = document.createTextNode("\u2715");
  clearBtn.appendChild(clearBtnText);
  clearBtn.setAttribute("tabindex", "0");

  const arrow = element("span");
  Manipulator.addClass(arrow, classes.selectArrow);

  _setSizeClasses(
    arrow,
    config,
    classes.selectArrowDefault,
    classes.selectArrowSm,
    classes.selectArrowLg
  );

  if (config.selectFormWhite) {
    Manipulator.addClass(arrow, classes.selectArrowWhite);
  }

  arrow.innerHTML = iconSVGTemplate;

  formOutline.appendChild(input);

  if (label) {
    Manipulator.addClass(label, classes.selectLabel);

    _setSizeClasses(
      label,
      config,
      classes.selectLabelSizeDefault,
      classes.selectLabelSizeSm,
      classes.selectLabelSizeLg
    );

    if (config.selectFormWhite) {
      Manipulator.addClass(label, classes.selectLabelWhite);
    }

    formOutline.appendChild(label);
  }

  if (config.selectValidation) {
    formOutline.appendChild(validFeedback);
    formOutline.appendChild(invalidFeedback);
  }

  if (config.selectClearButton) {
    formOutline.appendChild(clearBtn);
  }

  formOutline.appendChild(arrow);

  wrapper.appendChild(formOutline);
  return wrapper;
}

export function getDropdownTemplate(
  id,
  config,
  width,
  height,
  selectAllOption,
  options,
  customContent,
  classes
) {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.setAttribute(DATA_SELECT_DROPDOWN_CONTAINER, "");
  Manipulator.addClass(dropdownContainer, classes.selectDropdownContainer);

  dropdownContainer.setAttribute("id", `${id}`);
  dropdownContainer.style.width = `${width}px`;

  const dropdown = document.createElement("div");
  dropdown.setAttribute("tabindex", 0);
  dropdown.setAttribute(DATA_DROPDOWN, "");
  Manipulator.addClass(dropdown, classes.dropdown);

  const optionsWrapper = element("div");
  optionsWrapper.setAttribute(DATA_OPTIONS_WRAPPER, "");
  Manipulator.addClass(optionsWrapper, classes.optionsWrapper);
  Manipulator.addClass(optionsWrapper, classes.optionsWrapperScrollbar);
  optionsWrapper.style.maxHeight = `${height}px`;

  const optionsList = getOptionsListTemplate(
    options,
    selectAllOption,
    config,
    classes
  );

  optionsWrapper.appendChild(optionsList);

  if (config.selectFilter) {
    dropdown.appendChild(
      getFilterTemplate(config.selectSearchPlaceholder, classes)
    );
  }

  dropdown.appendChild(optionsWrapper);
  if (customContent) {
    dropdown.appendChild(customContent);
  }

  dropdownContainer.appendChild(dropdown);

  return dropdownContainer;
}

export function getOptionsListTemplate(
  options,
  selectAllOption,
  config,
  classes
) {
  const optionsList = element("div");
  optionsList.setAttribute(DATA_OPTIONS_LIST, "");
  Manipulator.addClass(optionsList, classes.optionsList);

  let optionsNodes;

  if (config.multiple) {
    optionsNodes = getMultipleOptionsNodes(
      options,
      selectAllOption,
      config,
      classes
    );
  } else {
    optionsNodes = getSingleOptionsNodes(options, config, classes);
  }

  optionsNodes.forEach((node) => {
    optionsList.appendChild(node);
  });

  return optionsList;
}

export function getFilterTemplate(placeholder, classes) {
  const inputGroup = element("div");
  Manipulator.addClass(inputGroup, classes.inputGroup);

  const input = element("input");

  input.setAttribute(DATA_FILTER_INPUT, "");
  Manipulator.addClass(input, classes.selectFilterInput);
  input.placeholder = placeholder;
  input.setAttribute("role", "searchbox");
  input.setAttribute("type", "text");

  inputGroup.appendChild(input);

  return inputGroup;
}

function getSingleOptionsNodes(options, config, classes) {
  const nodes = getOptionsNodes(options, config, classes);
  return nodes;
}

function getMultipleOptionsNodes(options, selectAllOption, config, classes) {
  let selectAllNode = null;

  if (config.selectAll) {
    selectAllNode = createSelectAllNode(
      selectAllOption,
      options,
      config,
      classes
    );
  }
  const optionsNodes = getOptionsNodes(options, config, classes);
  const nodes = selectAllNode ? [selectAllNode, ...optionsNodes] : optionsNodes;
  return nodes;
}

function getOptionsNodes(options, config, classes) {
  const nodes = [];

  options.forEach((option) => {
    const isOptionGroup = Object.prototype.hasOwnProperty.call(
      option,
      "options"
    );
    if (isOptionGroup) {
      const group = createOptionGroupTemplate(option, config, classes);
      nodes.push(group);
    } else {
      nodes.push(createOptionTemplate(option, config, classes));
    }
  });

  return nodes;
}

function createSelectAllNode(option, options, config, classes) {
  const isSelected = allOptionsSelected(options);
  const optionNode = element("div");
  optionNode.setAttribute(DATA_OPTION, "");
  Manipulator.addClass(optionNode, classes.selectOption);
  optionNode.setAttribute(DATA_OPTION_ALL, "");
  Manipulator.addStyle(optionNode, {
    height: `${config.selectOptionHeight}px`,
  });
  optionNode.setAttribute("role", "option");
  optionNode.setAttribute("aria-selected", isSelected);

  if (isSelected) {
    optionNode.setAttribute(DATA_SELECTED, "");
  }

  optionNode.appendChild(getOptionContentTemplate(option, config, classes));
  option.setNode(optionNode);

  return optionNode;
}

function createOptionTemplate(option, config, classes) {
  if (option.node) {
    return option.node;
  }
  const optionNode = element("div");
  optionNode.setAttribute(DATA_OPTION, "");
  Manipulator.addClass(optionNode, classes.selectOption);

  Manipulator.addStyle(optionNode, {
    height: `${config.selectOptionHeight}px`,
  });
  Manipulator.setDataAttribute(optionNode, "id", option.id);
  optionNode.setAttribute("role", "option");
  optionNode.setAttribute("aria-selected", option.selected);
  optionNode.setAttribute("aria-disabled", option.disabled);

  if (option.selected) {
    optionNode.setAttribute(DATA_SELECTED, "");
  }

  if (option.disabled) {
    optionNode.setAttribute("data-te-select-option-disabled", true);
  }

  if (option.hidden) {
    Manipulator.addClass(optionNode, "hidden");
  }

  optionNode.appendChild(getOptionContentTemplate(option, config, classes));

  if (option.icon) {
    optionNode.appendChild(getOptionIconTemplate(option, classes));
  }

  option.setNode(optionNode);

  return optionNode;
}

function getOptionContentTemplate(option, config, classes) {
  const content = element("span");
  content.setAttribute(DATA_SELECT_OPTION_TEXT, "");
  Manipulator.addClass(content, classes.selectOptionText);

  const label = document.createTextNode(option.label);

  if (config.multiple) {
    content.appendChild(getCheckboxTemplate(option, classes));
  }

  content.appendChild(label);
  if (option.secondaryText || typeof option.secondaryText === "number") {
    content.appendChild(
      getSecondaryTextTemplate(option.secondaryText, classes)
    );
  }

  return content;
}

function getSecondaryTextTemplate(text, classes) {
  const span = element("span");
  Manipulator.addClass(span, classes.selectOptionSecondaryText);
  const textContent = document.createTextNode(text);
  span.appendChild(textContent);
  return span;
}

function getCheckboxTemplate(option, classes) {
  const checkbox = element("input");
  checkbox.setAttribute("type", "checkbox");
  Manipulator.addClass(checkbox, classes.formCheckInput);
  checkbox.setAttribute(DATA_FORM_CHECK_INPUT, "");

  const label = element("label");

  if (option.selected) {
    checkbox.setAttribute("checked", true);
  }

  if (option.disabled) {
    checkbox.setAttribute("disabled", true);
  }

  checkbox.appendChild(label);
  return checkbox;
}

function getOptionIconTemplate(option, classes) {
  const container = element("span");
  const image = element("img");
  Manipulator.addClass(image, classes.selectOptionIcon);

  image.src = option.icon;

  container.appendChild(image);
  return container;
}

function createOptionGroupTemplate(optionGroup, config, classes) {
  const group = element("div");

  group.setAttribute(DATA_SELECT_OPTION_GROUP, "");
  Manipulator.addClass(group, classes.selectOptionGroup);

  group.setAttribute("role", "group");
  group.setAttribute("id", optionGroup.id);

  if (optionGroup.hidden) {
    Manipulator.addClass(group, "hidden");
  }

  const label = element("label");
  label.setAttribute(DATA_SELECT_OPTION_GROUP_LABEL, "");
  Manipulator.addClass(label, classes.selectOptionGroupLabel);

  Manipulator.addStyle(label, { height: `${config.selectOptionHeight}px` });
  label.setAttribute("for", optionGroup.id);
  label.textContent = optionGroup.label;

  group.appendChild(label);

  optionGroup.options.forEach((option) => {
    group.appendChild(createOptionTemplate(option, config, classes));
  });

  return group;
}

export function getFakeValueTemplate(value, classes) {
  const fakeValue = element("div");
  fakeValue.innerHTML = value;
  Manipulator.addClass(fakeValue, classes.selectLabel);

  Manipulator.addClass(fakeValue, classes.selectFakeValue);

  return fakeValue;
}
