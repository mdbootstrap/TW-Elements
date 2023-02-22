/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import SelectorEngine from "../../dom/selector-engine";

const DATA_ACTIVE = "data-te-input-state-active";
const DATA_SELECTED = "data-te-input-selected";
const DATA_MULTIPLE_ACTIVE = "data-te-input-multiple-active";

const SELECTOR_FORM_CHECK_INPUT = "[data-te-form-check-input]";

class SelectOption {
  constructor(
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
  ) {
    this.id = id;
    this.nativeOption = nativeOption;
    this.multiple = multiple;
    this.value = value;
    this.label = label;
    this.selected = selected;
    this.disabled = disabled;
    this.hidden = hidden;
    this.secondaryText = secondaryText;
    this.groupId = groupId;
    this.icon = icon;
    this.node = null;
    this.active = false;
  }

  select() {
    if (this.multiple) {
      this._selectMultiple();
    } else {
      this._selectSingle();
    }
  }

  _selectSingle() {
    if (!this.selected) {
      this.node.setAttribute(DATA_SELECTED, "");
      this.node.setAttribute("aria-selected", true);
      this.selected = true;

      if (this.nativeOption) {
        this.nativeOption.selected = true;
      }
    }
  }

  _selectMultiple() {
    if (!this.selected) {
      const checkbox = SelectorEngine.findOne(
        SELECTOR_FORM_CHECK_INPUT,
        this.node
      );
      checkbox.checked = true;
      this.node.setAttribute(DATA_SELECTED, "");

      this.node.setAttribute("aria-selected", true);
      this.selected = true;

      if (this.nativeOption) {
        this.nativeOption.selected = true;
      }
    }
  }

  deselect() {
    if (this.multiple) {
      this._deselectMultiple();
    } else {
      this._deselectSingle();
    }
  }

  _deselectSingle() {
    if (this.selected) {
      this.node.removeAttribute(DATA_SELECTED);

      this.node.setAttribute("aria-selected", false);
      this.selected = false;

      if (this.nativeOption) {
        this.nativeOption.selected = false;
      }
    }
  }

  _deselectMultiple() {
    if (this.selected) {
      const checkbox = SelectorEngine.findOne(
        SELECTOR_FORM_CHECK_INPUT,
        this.node
      );
      checkbox.checked = false;
      this.node.removeAttribute(DATA_SELECTED);

      this.node.setAttribute("aria-selected", false);
      this.selected = false;

      if (this.nativeOption) {
        this.nativeOption.selected = false;
      }
    }
  }

  setNode(node) {
    this.node = node;
  }

  setActiveStyles() {
    if (!this.active) {
      if (this.multiple) {
        this.node.setAttribute(DATA_MULTIPLE_ACTIVE, "");
        return;
      }
      this.active = true;
      this.node.setAttribute(DATA_ACTIVE, "");
    }
  }

  removeActiveStyles() {
    if (this.active) {
      this.active = false;
      this.node.removeAttribute(DATA_ACTIVE);
    }
    if (this.multiple) {
      this.node.removeAttribute(DATA_MULTIPLE_ACTIVE);
    }
  }
}

export default SelectOption;
