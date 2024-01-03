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
import { getFixture, jQueryMock } from "../mocks";
import initTE from "../../src/js/autoinit/index.js";

const Ripple = require("../../src/js/methods/ripple").default;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

initTE({ Ripple });

const data = {
  rippleCentered: true,
  rippleColor: "red",
  rippleDuration: "1s",
  rippleRadius: 100,
  rippleUnbound: true,
};

describe("Ripple", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.setAttribute("data-te-ripple-init", "");
    fixtureEl.innerText = "Test";
  });

  afterEach(() => {
    fixtureEl.parentNode.removeChild(fixtureEl);
  });

  it("should create a data instance and remove it on dispose", () => {
    let instance = new Ripple(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.dispose();
    instance = Ripple.getInstance(fixtureEl);

    expect(instance).toEqual(null);
  });

  it("should return correct name", () => {
    const instance = new Ripple(fixtureEl);

    expect(Ripple.NAME).toEqual("ripple");

    instance.dispose();
  });

  it("should add and remove ripple div", async () => {
    const instance = new Ripple(fixtureEl, { unbound: true });
    expect(fixtureEl.children[0]).toBeUndefined();

    fixtureEl.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancellable: true })
    );

    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(fixtureEl.children[0]).not.toBeUndefined();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(fixtureEl.children[0]).toBeUndefined();

    instance.dispose();
  });

  // it('should sets _options from data attribute', () => {
  //   fixtureEl.classList.add('ripple');
  //   Object.keys(data).forEach((key) => {
  //     const keyToKebabCase = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  //     fixtureEl.setAttribute(`data-${keyToKebabCase}`, data[key]);
  //   });

  //   const instance = new Ripple(fixtureEl);

  //   expect(instance._options).toEqual(data);
  //   instance.dispose();
  // });

  it("should work with hex colors", () => {
    let instance = new Ripple(fixtureEl, { rippleColor: "#c953d6" });
    fixtureEl.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancellable: true })
    );

    expect(instance._options.rippleColor).toEqual("#c953d6");
    instance.dispose();

    instance = new Ripple(fixtureEl, { rippleColor: "#ddd" });
    fixtureEl.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancellable: true })
    );

    expect(instance._options.rippleColor).toEqual("#ddd");
    instance.dispose();
  });

  it("should work with named colors", () => {
    const instance = new Ripple(fixtureEl, { rippleColor: "red" });
    fixtureEl.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancellable: true })
    );

    expect(instance._options.rippleColor).toEqual("red");
    expect(instance._colorToRGB("redd")).toEqual([0, 0, 0]);

    instance.dispose();
  });

  it("should work with transparent color", () => {
    const instance = new Ripple(fixtureEl, { rippleColor: "transparent" });
    fixtureEl.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancellable: true })
    );

    expect(instance._colorToRGB("redd")).toEqual([0, 0, 0]);

    instance.dispose();
  });

  it("should work with rgba colors", () => {
    const instance = new Ripple(fixtureEl, { rippleColor: "rgba(0, 0, 0, 0)" });
    fixtureEl.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancellable: true })
    );

    expect(instance._options.rippleColor).toEqual("rgba(0, 0, 0, 0)");
    instance.dispose();
  });

  it("should run test function", () => {
    const testFn = jest.fn();
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = `
    <div class="relative mb-3" data-te-input-wrapper-init>
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInput1"
        placeholder="Example label" />
      <label
        for="exampleFormControlInput1"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Example label
      </label>
    </div>

    <input
      type="button"
      id="textbtn"
      data-te-ripple-init
      data-te-ripple-color="light"
      class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]" />`;

    const inputBtn = container.querySelector("#textbtn");

    inputBtn.addEventListener("mousedown", testFn);

    inputBtn.dispatchEvent(new Event("mousedown"));

    expect(testFn).toBeCalledTimes(1);
    container.remove();
  });

  it("should get correct diameter", () => {
    const pythagorean = (sideA, sideB) => Math.sqrt(sideA ** 2 + sideB ** 2);
    const instance = new Ripple(fixtureEl, { rippleCentered: false });

    const diameterOptions = {
      offsetX: 25,
      offsetY: 25,
      height: 100,
      width: 100,
    };

    const getCorner = {
      bottomRight: pythagorean(
        diameterOptions.width - diameterOptions.offsetX,
        diameterOptions.height - diameterOptions.offsetY
      ),
    };

    expect(instance._getDiameter(diameterOptions)).toEqual(
      getCorner.bottomRight * 2
    );

    diameterOptions.offsetY = 75;
    getCorner.topRight = pythagorean(
      diameterOptions.width - diameterOptions.offsetX,
      diameterOptions.offsetY
    );

    expect(instance._getDiameter(diameterOptions)).toEqual(
      getCorner.topRight * 2
    );

    diameterOptions.offsetX = 75;
    diameterOptions.offsetY = 25;
    getCorner.bottomLeft = pythagorean(
      diameterOptions.offsetX,
      diameterOptions.height - diameterOptions.offsetY
    );

    expect(instance._getDiameter(diameterOptions)).toEqual(
      getCorner.bottomLeft * 2
    );

    diameterOptions.offsetY = 75;
    getCorner.topLeft = pythagorean(
      diameterOptions.offsetX,
      diameterOptions.offsetY
    );

    expect(instance._getDiameter(diameterOptions)).toEqual(
      getCorner.topLeft * 2
    );

    instance.dispose();
  });

  it("should auto-init", async () => {
    fixtureEl.setAttribute("data-te-ripple-init", "");

    jest.resetModules();
    const Ripple = require("../../src/js/methods/ripple").default; // eslint-disable-line global-require
    const initTE = require("../../src/js/autoinit/index.js").default; // eslint-disable-line global-require

    initTE({ Ripple });
    fixtureEl.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancellable: true })
    );

    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(fixtureEl.children[0]).not.toBeUndefined();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(fixtureEl.children[0]).toBeUndefined();
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", async () => {
      const rippleColor = "primary";

      const instance = new Ripple(fixtureEl, {}, { ripple: rippleColor });

      fixtureEl.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, cancellable: true })
      );

      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(fixtureEl.classList.contains(`${rippleColor}`)).toBeTruthy();

      instance.dispose();
    });

    it("should sets custom classes via data attributes", async () => {
      const rippleColor = "primary";
      fixtureEl.setAttribute("data-te-class-ripple", rippleColor);
      const instance = new Ripple(fixtureEl);

      fixtureEl.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, cancellable: true })
      );

      await new Promise((resolve) => setTimeout(resolve, 250));

      expect(fixtureEl.classList.contains(rippleColor)).toBeTruthy();
      instance.dispose();
    });
  });
});
