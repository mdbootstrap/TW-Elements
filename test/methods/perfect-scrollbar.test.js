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

const ResizeObserverMock = jest.fn(function (callback) {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
  this.trigger = (entry) => {
    callback([entry], this);
  };
});

global.ResizeObserver = ResizeObserverMock;

const PerfectScrollbar =
  require("../../src/js/methods/perfect-scrollbar").default;

const EVENTS = [
  {
    event: {
      te: "scrollX.te.ps",
      ps: "ps-scroll-x",
    },
  },
  {
    event: {
      te: "scrollY.te.ps",
      ps: "ps-scroll-y",
    },
  },
  {
    event: {
      te: "scrollUp.te.ps",
      ps: "ps-scroll-up",
    },
  },
  {
    event: {
      te: "scrollDown.te.ps",
      ps: "ps-scroll-down",
    },
  },
  {
    event: {
      te: "scrollLeft.te.ps",
      ps: "ps-scroll-left",
    },
  },
  {
    event: {
      te: "scrollRight.te.ps",
      ps: "ps-scroll-right",
    },
  },
  {
    event: {
      te: "scrollXEnd.te.ps",
      ps: "ps-x-reach-end",
    },
  },
  {
    event: {
      te: "scrollYEnd.te.ps",
      ps: "ps-y-reach-end",
    },
  },
  {
    event: {
      te: "scrollXStart.te.ps",
      ps: "ps-x-reach-start",
    },
  },
  {
    event: {
      te: "scrollYStart.te.ps",
      ps: "ps-y-reach-start",
    },
  },
];

describe("PerfectScrollbar", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `
      <div
        data-te-perfect-scrollbar-init
        class="relative h-[400px] w-[600px] overflow-hidden">
        <img
          src="https://tecdn.b-cdn.net/img/new/slides/041.webp"
          alt="Wild Landscape"
          class="h-[700px] w-[1000px] max-w-none" />
      </div>`;
  });

  describe("basic functionality", () => {
    it("should return a name of a component", () => {
      const NAME = PerfectScrollbar.NAME;
      expect(NAME).toEqual("perfectScrollbar");
    });

    it("should create a data instance and remove it on dispose", () => {
      let instance = new PerfectScrollbar(fixtureEl, { type: "test" });
      expect(instance).toBeTruthy();
      instance.dispose();
      instance = PerfectScrollbar.getInstance(fixtureEl);
      expect(instance).not.toBeTruthy();
    });

    it("should add class perfest-scrollbar with data-te-attr init", () => {
      const instance = new PerfectScrollbar(fixtureEl, { type: "test" });
      expect(fixtureEl.classList.contains("perfect-scrollbar")).toBe(true);
      instance.dispose();
    });

    it("should create a data instance and update and remove it", () => {
      let instance = new PerfectScrollbar(fixtureEl, { type: "test" });
      expect(instance).toBeTruthy();

      instance.update();
      instance.dispose();

      instance = PerfectScrollbar.getInstance(fixtureEl);

      expect(instance).not.toBeTruthy();
    });

    it("should create options with data-te-attr init", () => {
      fixtureEl.setAttribute(
        "data-te-handlers",
        "click-rail drag-thumb keyboard wheel"
      );
      fixtureEl.setAttribute("data-te-wheel-speed", "1000");
      fixtureEl.setAttribute("data-te-wheel-propagation", "true");
      fixtureEl.setAttribute("data-te-swipe-easing", "true");
      fixtureEl.setAttribute("data-te-min-scrollbar-length", "1000");
      fixtureEl.setAttribute("data-te-max-scrollbar-length", "500");
      fixtureEl.setAttribute("data-te-scrolling-threshold", "300");
      fixtureEl.setAttribute("data-te-use-both-wheel-axes", "true");
      fixtureEl.setAttribute("data-te-suppress-scroll-x", "true");
      fixtureEl.setAttribute("data-te-suppress-scroll-y", "true");
      fixtureEl.setAttribute("data-te-scroll-x-margin-offset", "100");
      fixtureEl.setAttribute("data-te-scroll-y-margin-offset", "100");

      const instance = new PerfectScrollbar(fixtureEl);

      expect(instance).toBeTruthy();

      expect(instance._options.handlers).toEqual([
        "click-rail",
        "drag-thumb",
        "keyboard",
        "wheel",
      ]);
      expect(instance._options.wheelSpeed).toEqual(1000);
      expect(instance._options.wheelPropagation).toEqual(true);
      expect(instance._options.swipeEasing).toEqual(true);
      expect(instance._options.minScrollbarLength).toEqual(1000);
      expect(instance._options.maxScrollbarLength).toEqual(500);
      expect(instance._options.scrollingThreshold).toEqual(300);
      expect(instance._options.useBothWheelAxes).toEqual(true);
      expect(instance._options.suppressScrollX).toEqual(true);
      expect(instance._options.suppressScrollY).toEqual(true);
      expect(instance._options.scrollXMarginOffset).toEqual(100);
      expect(instance._options.scrollYMarginOffset).toEqual(100);

      instance.dispose();
    });

    it("should create events", () => {
      let instance = new PerfectScrollbar(fixtureEl);

      instance = PerfectScrollbar.getInstance(fixtureEl);

      instance._initEvents(EVENTS);

      fixtureEl.addEventListener("scrollX.te.ps", () => {
        expect(fixtureEl.style.display).toEqual("none");
      });

      instance.dispose();
    });

    it("should add class on DOMcontentload", () => {
      fixtureEl.addEventListener = jest.fn();
      window.addEventListener = jest.fn();

      jest.resetModules();

      window.dispatchEvent(new Event("DOMContentLoaded"));

      expect(fixtureEl.classList.contains("perfect-scrollbar")).toBe(true);
    });
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const instance = new PerfectScrollbar(
        fixtureEl,
        {},
        { railXColors: "bg-green-100" }
      );

      expect(instance._classes.railXColors).toBe("bg-green-100");

      instance.dispose();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.setAttribute("data-te-class-rail-x-colors", "bg-green-100");

      const instance = new PerfectScrollbar(fixtureEl);

      expect(instance._classes.railXColors).toBe("bg-green-100");

      instance.dispose();
    });
  });
});
