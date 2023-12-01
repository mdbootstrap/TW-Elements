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

const fixtureId = "fixture";

export const getFixture = () => {
  let fixtureEl = document.getElementById(fixtureId);

  if (!fixtureEl) {
    fixtureEl = document.createElement("div");
    fixtureEl.setAttribute("id", fixtureId);
    fixtureEl.style.position = "absolute";
    fixtureEl.style.top = "-10000px";
    fixtureEl.style.left = "-10000px";
    fixtureEl.style.width = "10000px";
    fixtureEl.style.height = "10000px";
    document.body.appendChild(fixtureEl);
  }

  return fixtureEl;
};

export const clearFixture = () => {
  const fixtureEl = getFixture();

  fixtureEl.innerHTML = "";
};
