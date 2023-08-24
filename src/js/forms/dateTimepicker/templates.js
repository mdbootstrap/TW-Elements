/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

export const getIconButtonsTemplate = (
  datepickerIconTemplate,
  timepickerIconTemplate,
  classes
) => `
  <button type="button" class="${classes.pickerIcon}" data-te-datepicker-toggle-button-ref>
    ${datepickerIconTemplate}
  </button>
  <button type="button" class="${classes.pickerIcon}" data-te-timepicker-toggle-button-ref>
    ${timepickerIconTemplate}
  </button>
`;

export const getToggleButtonTemplate = (toggleButtonTemplate, classes) => `
  <button type="button" class="${classes.toggleButton}" data-te-date-timepicker-toggle-ref>
    ${toggleButtonTemplate} 
  </button>
`;
