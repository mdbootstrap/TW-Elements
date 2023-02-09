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
