/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

const options = {
  property: "color",
  defaultValue: null,
  inherit: true,
};

export const getStyle = (className, customOptions) => {
  const { property, defaultValue, inherit } = { ...options, ...customOptions };

  const element = document.createElement("div");

  element.classList.add(className);
  document.body.appendChild(element);

  const computedStyle = window.getComputedStyle(element);
  const value = computedStyle[property] || defaultValue;

  // Get the computed color value of the parent element
  const parentComputedStyle = window.getComputedStyle(element.parentElement);
  const parentValue = parentComputedStyle[property];

  document.body.removeChild(element);

  // Check if the computed color value is the same as the parent's color value. That means the color is not set on the element itself and it's inherited from the parent element
  if (!inherit && parentValue && value === parentValue) {
    return defaultValue;
  }

  // Return the computed color value or the defaultValue if it's not set
  return value || defaultValue;
};
