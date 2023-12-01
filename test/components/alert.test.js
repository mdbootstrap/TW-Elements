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

/* eslint-disable no-undef */
import { clearFixture, getFixture } from "../mocks";
import initTE from "../../src/js/autoinit/index.js";

describe("Alert", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
  });

  afterEach(() => {
    clearFixture();
  });

  it("should initialize an Alert by a data attribute and remove it on dispose", () => {
    fixtureEl.setAttribute("data-te-alert-init", "");
    fixtureEl.setAttribute("data-te-dismiss", "alert");
    jest.resetModules();

    const Alert = require("../../src/js/components/alert").default; // eslint-disable-line global-require
    initTE({ Alert });

    let instance = Alert.getInstance(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.dispose();

    instance = Alert.getInstance(fixtureEl);
    expect(instance).toEqual(null);
  });
});
