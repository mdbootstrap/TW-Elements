/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import initTE from "../../autoinit/index";
import Input from "../../forms/input";

export const getInputField = ({ inputID, labelText }, classes) => {
  initTE({ Input }, false);
  return `<div data-te-chips-input-wrapper data-te-input-wrapper-init class="${classes.chipsInputWrapper}">
      <input
          type="text"
          class="${classes.chipsInput}"
          id="${inputID}"
          placeholder="Example label" />
        <label
          for="${inputID}"
          class="${classes.chipsLabel}"
          >${labelText}
        </label>

        <div data-te-input-notch-ref class="${classes.chipsNotchesWrapper}">
        <div class="${classes.chipsNotchesLeading}" data-te-input-notch-leading-ref style="width: 9px;"></div>
        <div class="${classes.chipsNotchesMiddle}" data-te-input-notch-middle-ref style="width: 87.2px;"></div>
        <div class="${classes.chipsNotchesTrailing}" data-te-input-notch-trailing-ref></div>
      </div>
    </div>`;
};

export const getChip = ({ text, iconSVG }, classes) => {
  return `<div data-te-chip-init data-te-ripple-init class="${classes.chipElement}">
    <span data-te-chip-text>${text}</span> 
      <span data-te-chip-close class="${classes.chipCloseIcon}">
        ${iconSVG}
      </span>
  </div>`;
};
