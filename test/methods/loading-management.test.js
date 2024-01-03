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
/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { clearFixture, getFixture, jQueryMock } from "../mocks";
import initTE from "../../src/js/autoinit/index.js";

let Loading = require("../../src/js/methods/loading-management").default;
const {
  getBackdropTemplate,
} = require("../../src/js/methods/loading-management/templates");

const DEFAULT_OPTIONS = {
  backdrop: true,
  backdropColor: "rgba(0, 0, 0)",
  backdropOpacity: 0.4,
  delay: null,
  loader: "",
  parentSelector: null,
  scroll: true,
  loadingText: true,
  loadingIcon: true,
};

describe("Loading", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `<div id="loading-basic-example" class="h-[300px] w-full">
      <div
        data-te-loading-management-init
        data-te-parent-selector="#loading-basic-example">
        <div
          data-te-loading-icon-ref
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"></div>
        <span data-te-loading-text-ref>Loading...</span>
      </div>
    </div>`;
  });

  afterEach(() => {
    clearFixture();
  });

  it('should return the component"s name', () => {
    const name = Loading.NAME;

    expect(name).toEqual("loadingManagement");
  });

  it("should create an instance and destroy it on dispose()", () => {
    jest.useFakeTimers();

    const loadingDec = new Loading(fixtureEl);

    const instance = Loading.getInstance(fixtureEl);

    expect(instance).not.toBe(null);

    instance.dispose();
    jest.runAllTimers();

    expect(Loading.getInstance(fixtureEl)).toBe(null);
  });

  it("should initialize with default options", () => {
    const instance = new Loading(fixtureEl, { ...DEFAULT_OPTIONS });

    for (const option in DEFAULT_OPTIONS) {
      expect(instance._options[option]).toBe(DEFAULT_OPTIONS[option]);
    }

    instance.dispose();
    jest.runAllTimers();
  });

  it("should return backdrop with id", () => {
    const template = getBackdropTemplate(
      {
        backdropID: "test",
      },
      { backdrop: "backdropClass" }
    );

    expect(template.id).toBe("test");
  });

  it("should set backdrop", () => {
    const loadingDec = new Loading(fixtureEl);

    jest.runAllTimers();
    expect(loadingDec._backdropElement).not.toBeNull();

    loadingDec.dispose();
    jest.runAllTimers();
  });

  it("should not set backdrop element", () => {
    const loadingDec = new Loading(fixtureEl, { backdrop: false });

    expect(loadingDec._backdropElement).toBe(null);

    loadingDec.dispose();
    jest.runAllTimers();
  });

  it("should remove backdrop on dispose", () => {
    jest.useFakeTimers();

    const loadingDec = new Loading(fixtureEl);
    jest.runAllTimers();
    expect(loadingDec._backdropElement).not.toBe(null);

    loadingDec.dispose();

    jest.runAllTimers();
    expect(loadingDec._backdropElement).toBe(null);
    jest.runAllTimers();
  });

  it("should not set loading icon", () => {
    const loadingDec = new Loading(fixtureEl, { loadingIcon: false });

    expect(loadingDec._setLoadingIcon(fixtureEl)).toBe(undefined);

    loadingDec.dispose();
    jest.runAllTimers();
  });

  it("should not set loading text", () => {
    const loadingDec = new Loading(fixtureEl, { loadingText: false });

    expect(loadingDec._setLoadingText(fixtureEl)).toBe(undefined);

    loadingDec.dispose();
    jest.runAllTimers();
  });

  it("should not to remove if element is null", () => {
    const loadingDec = new Loading(fixtureEl);

    expect(loadingDec._removeElementsOnStart()).toBe(undefined);

    loadingDec.dispose();
    jest.runAllTimers();
  });

  it("should set hidden to _parentElement", () => {
    fixtureEl.innerHTML = `<div id="loading-basic-example" class="h-[300px] w-full">
    <div
      data-te-loading-management-init
      data-te-parent-selector="#loading-basic-example">
      <div
        data-te-loading-icon-ref
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"></div>
      <span data-te-loading-text-ref>Loading...</span>
    </div>
  </div>`;

    const loadingDec = new Loading(fixtureEl, { scroll: true });
    expect(loadingDec._parentElement).toBe(null);

    loadingDec.dispose();
    jest.runAllTimers();
  });

  it("should set null to _parentElement", () => {
    const loadingDec = new Loading(fixtureEl, { scroll: false });

    expect(loadingDec._parentElement).toBe(null);

    loadingDec.dispose();
    jest.runAllTimers();
  });

  it("should check if _backdropElement has a class or id", () => {
    const loadingDec = new Loading(fixtureEl);
    jest.runAllTimers();

    const hasClass = loadingDec._backdropElement.className.length > 0;
    const hasId = loadingDec._backdropElement.id.length > 0;

    expect(hasClass || hasId).toBeTruthy();

    loadingDec.dispose();
    jest.runAllTimers();
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const loadingDec = new Loading(
        fixtureEl,
        {},
        { backdropColor: "bg-green-100" }
      );

      expect(loadingDec._classes.backdropColor).toBe("bg-green-100");

      loadingDec.dispose();
      jest.runAllTimers();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.setAttribute("data-te-class-backdrop-color", "bg-green-100");

      const loadingDec = new Loading(fixtureEl);

      expect(loadingDec._classes.backdropColor).toBe("bg-green-100");

      loadingDec.dispose();
      jest.runAllTimers();
    });
  });
});
