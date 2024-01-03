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

const Sticky = require("../../src/js/methods/sticky").default;

const testOptions = {
  stickyActiveClass: "test",
  stickyAnimationSticky: "testS",
  stickyAnimationUnsticky: "testU",
  stickyBoundary: true,
  stickyDelay: 100,
  stickyDirection: "up",
  stickyMedia: 50,
  stickyOffset: 10,
  stickyPosition: "bottom",
  stickyZIndex: 100,
};

const defaultOptions = {
  stickyAnimationSticky: "",
  stickyAnimationUnsticky: "",
  stickyBoundary: false,
  stickyDelay: 0,
  stickyDirection: "down",
  stickyMedia: 0,
  stickyOffset: 0,
  stickyPosition: "top",
  stickyZIndex: 100,
};

describe("Sticky", () => {
  let fixtureEl;
  let sticky;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML =
      '<div><div class="sticky-test-fixture">sticky</div></div>';
    sticky = fixtureEl.querySelector(".sticky-test-fixture");
    sticky.height = "15";
  });

  afterEach(() => {
    clearFixture();
    jest.clearAllMocks();
    jest.runAllTimers();
  });

  it("should create a data instance and remove it on dispose", () => {
    let instance = new Sticky(sticky, testOptions);
    instance = Sticky.getInstance(sticky);

    expect(instance).not.toEqual(null);

    instance.dispose();
    jest.runAllTimers();

    instance = Sticky.getInstance(sticky);

    expect(instance).toEqual(null);
  });

  it("should return name", () => {
    expect(Sticky.NAME).toEqual("sticky");
  });

  describe("set options", () => {
    it("should initialize with options (default)", () => {
      const instance = new Sticky(sticky);

      expect(instance._options).toEqual(defaultOptions);

      instance.dispose();
    });

    it("should initialize with options (JS)", () => {
      let instance = new Sticky(sticky);

      expect(instance._options).toEqual(defaultOptions);

      instance.dispose();

      instance = new Sticky(sticky, testOptions);

      expect(instance._options).toEqual({
        ...testOptions,
      });

      instance.dispose();
    });

    it("should initialize with options (data-te-attributes)", () => {
      sticky.setAttribute("data-te-sticky-direction", "up");
      sticky.setAttribute("data-te-sticky-position", "bottom");

      const instance = new Sticky(sticky);

      expect(instance._options.stickyDirection).toEqual("up");
      expect(instance._options.stickyPosition).toEqual("bottom");

      instance.dispose();
    });
  });

  describe("activation & deactivation", () => {
    describe("default behavior", () => {
      it("should activate component when client scroll window", () => {
        const instance = new Sticky(sticky);

        expect(instance._isSticked).toEqual(false);

        window.pageYOffset = 100;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(true);

        instance.dispose();
      });

      it("should deactivate component when client scroll window up", () => {
        const instance = new Sticky(sticky);

        expect(instance._isSticked).toEqual(false);

        window.pageYOffset = 100;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(true);

        window.pageYOffset = 50;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(false);

        instance.dispose();
      });
    });
    describe(`direction === "up"`, () => {
      it("should activate component when client scroll window up", () => {
        const instance = new Sticky(sticky, {
          stickyDirection: "up",
        });

        expect(instance._isSticked).toEqual(false);

        window.pageYOffset = 100;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(false);

        window.pageYOffset = 50;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(true);

        instance.dispose();
      });

      it("should deactivate component when client scroll window down", () => {
        const instance = new Sticky(sticky, {
          stickyDirection: "up",
        });

        expect(instance._isSticked).toEqual(false);

        window.pageYOffset = 100;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(false);

        window.pageYOffset = 50;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(true);

        window.pageYOffset = 150;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(false);
        instance.dispose();
      });
    });

    describe("direction === `both`", () => {
      it("should activate component when client scroll window up or down", () => {
        const instance = new Sticky(sticky, {
          stickyDirection: "both",
        });

        expect(instance._isSticked).toEqual(false);

        window.pageYOffset = 100;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(true);

        window.pageYOffset = 50;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._isSticked).toEqual(true);

        instance.dispose();
      });
    });

    describe("position", () => {
      it("should set top: 0px after scroll when position === top", () => {
        const instance = new Sticky(sticky, {
          stickyPosition: "top",
        });

        expect(instance._element.style.top).not.toBe("0px");

        window.pageYOffset = 100;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._element.style.top).toBe("0px");

        instance.dispose();
      });

      it("should set bottom: 0 after scroll when position === bottom", () => {
        const instance = new Sticky(sticky, {
          stickyPosition: "bottom",
        });

        expect(instance._element.style.bottom).not.toBe("0px");

        window.pageYOffset = 100;
        window.dispatchEvent(new CustomEvent("scroll"));

        expect(instance._element.style.bottom).toBe("0px");

        instance.dispose();
      });
    });
  });

  describe("Animation", () => {
    it('should don`t add animation class if "animationSticky" and "animationUnsticky" is empty', () => {
      const instance = new Sticky(sticky);

      expect(sticky.classList.contains("animation")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("animation")).toBe(false);

      instance.dispose();
    });

    it('should add animation class after scroll down if "animationSticky" is not empty', () => {
      const instance = new Sticky(sticky, {
        stickyAnimationSticky: "test",
      });

      expect(sticky.classList.contains("test")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test")).toBe(true);

      instance.dispose();
    });

    it('should add animation class after scroll up if "animationUnsticky" is not empty ', () => {
      const instance = new Sticky(sticky, {
        stickyAnimationUnsticky: "test",
        stickyBoundary: true,
      });

      expect(sticky.classList.contains("test")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test")).toBe(false);

      window.pageYOffset = 50;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test")).toBe(true);

      instance.dispose();
    });

    it("should add stickyAnimationSticky class after scroll down", () => {
      const instance = new Sticky(sticky, {
        stickyAnimationSticky: "test-sticky",
        stickyBoundary: true,
      });

      expect(sticky.classList.contains("test-sticky")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test-sticky")).toBe(true);

      instance.dispose();
    });

    it("should add animationUnsticky after scroll up", () => {
      const instance = new Sticky(sticky, {
        stickyAnimationUnsticky: "test-unsticky",
        stickyBoundary: true,
      });

      expect(sticky.classList.contains("test-unsticky")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test-unsticky")).toBe(false);

      window.pageYOffset = 50;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test-unsticky")).toBe(true);

      instance.dispose();
    });

    it("should toggle className between animationSticky and animationUnsticky", () => {
      const instance = new Sticky(sticky, {
        stickyAnimationUnsticky: "test-unsticky",
        stickyAnimationSticky: "test-sticky",
        stickyBoundary: true,
      });

      expect(sticky.classList.contains("test-unsticky")).toBe(false);
      expect(sticky.classList.contains("test-sticky")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test-sticky")).toBe(true);
      expect(sticky.classList.contains("test-unsticky")).toBe(false);

      window.pageYOffset = 50;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test-unsticky")).toBe(true);
      expect(sticky.classList.contains("test-sticky")).toBe(false);

      instance.dispose();
    });
  });

  describe("test options", () => {
    it("should activate component with a delay (delay)", () => {
      const instance = new Sticky(sticky, {
        stickyDelay: -100,
      });

      // usually stickyDelay option is positive, but to make it easier to test, set it to negative.

      window.pageYOffset = 90;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(instance._isSticked).toBe(false);

      window.pageYOffset = 110;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(instance._isSticked).toBe(true);

      instance.dispose();
    });

    it("should set offset after scroll when position === top", () => {
      const instance = new Sticky(sticky, {
        stickyPosition: "top",
        stickyOffset: 10,
      });

      expect(instance._element.style.top).not.toBe("10px");

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(instance._element.style.top).toBe("10px");

      instance.dispose();
    });

    it("should set offset position === bottom", () => {
      const instance = new Sticky(sticky, {
        stickyPosition: "bottom",
        stickyOffset: 10,
      });

      expect(instance._element.style.bottom).not.toBe("10px");

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(instance._element.style.bottom).toBe("10px");

      instance.dispose();
    });

    it("should activate sticky only when window.width > media (media)", () => {
      let instance = new Sticky(sticky, {
        stickyMedia: 10000,
      });

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(instance._isSticked).toBe(false);

      instance = new Sticky(sticky, {
        stickyMedia: 100,
      });

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(instance._isSticked).toBe(true);

      instance.dispose();
    });
  });

  describe("public methods", () => {
    it("active should work if element is not sticked", () => {
      const instance = new Sticky(sticky);

      instance._changeBoundaryPosition = jest.fn();
      instance._isSticked = true;

      instance.active();

      expect(instance._changeBoundaryPosition).not.toHaveBeenCalled();

      instance._isSticked = false;

      instance.active();

      expect(instance._changeBoundaryPosition).toHaveBeenCalled();

      instance.dispose();
    });

    it("inactive should work if element is sticked", () => {
      const instance = new Sticky(sticky);

      instance._disableSticky = jest.fn();
      instance._isSticked = false;

      instance.inactive();

      expect(instance._disableSticky).not.toHaveBeenCalled();

      instance._isSticked = true;

      instance.inactive();

      expect(instance._disableSticky).toHaveBeenCalled();

      instance.dispose();
    });
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const instance = new Sticky(
        sticky,
        {},
        {
          stickyActive: "test-active",
        }
      );

      expect(sticky.classList.contains("test-active")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test-active")).toBe(true);

      window.pageYOffset = 50;
      window.dispatchEvent(new CustomEvent("scroll"));

      jest.runAllTimers();

      expect(sticky.classList.contains("test-active")).toBe(false);

      instance.dispose();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.children[0].children[0].setAttribute(
        "data-te-class-sticky-active",
        "test-active"
      );
      const instance = new Sticky(sticky);

      expect(sticky.classList.contains("test-active")).toBe(false);

      window.pageYOffset = 100;
      window.dispatchEvent(new CustomEvent("scroll"));

      expect(sticky.classList.contains("test-active")).toBe(true);

      window.pageYOffset = 50;
      window.dispatchEvent(new CustomEvent("scroll"));

      jest.runAllTimers();

      expect(sticky.classList.contains("test-active")).toBe(false);

      instance.dispose();
    });
  });
});
