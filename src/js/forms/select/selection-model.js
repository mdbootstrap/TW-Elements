class SelectionModel {
  constructor(multiple = false) {
    this._multiple = multiple;
    this._selections = [];
  }

  select(option) {
    if (this._multiple) {
      this._selections.push(option);
    } else {
      this._selections = [option];
    }
  }

  deselect(option) {
    if (this._multiple) {
      const optionIndex = this._selections.findIndex(
        (selection) => option === selection
      );
      this._selections.splice(optionIndex, 1);
    } else {
      this._selections = [];
    }
  }

  clear() {
    this._selections = [];
  }

  get selection() {
    return this._selections[0];
  }

  get selections() {
    return this._selections;
  }

  get label() {
    return this._selections[0] && this.selection.label;
  }

  get labels() {
    return this._selections.map((selection) => selection.label).join(", ");
  }

  get value() {
    return this.selections[0] && this.selection.value;
  }

  get values() {
    return this._selections.map((selection) => selection.value);
  }
}

export default SelectionModel;
