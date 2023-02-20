/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

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
