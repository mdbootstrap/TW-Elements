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
import { element } from "../../src/js/util/index";
import initTE from "../../src/js/autoinit/index.js";

const SmoothScroll = require("../../src/js/methods/smooth-scroll").default;

describe("Smooth Scroll", () => {
  let fixtureEl;
  let parentDiv;

  beforeEach(() => {
    Element.prototype.scrollTo = () => {};

    parentDiv = element("div");
    parentDiv.className = "smooth-scroll";

    fixtureEl = getFixture();
    fixtureEl = element("a");
    fixtureEl.href = "#section-1";
    fixtureEl.setAttribute("data-te-smooth-scroll-init", "");

    const contentEl = element("div");
    contentEl.style.height = "120vh";

    const parentSection = element("div");
    parentSection.style.height = "100px";
    parentSection.innerHTML = '<div style="height: 100px;"></div>';
    parentSection.className = "parent-section";
    const section1 = element("div");
    section1.id = "section-1";

    parentSection.appendChild(section1);

    parentDiv.appendChild(fixtureEl);
    parentDiv.appendChild(contentEl);
    parentDiv.appendChild(parentSection);

    document.body.appendChild(parentDiv);
  });

  afterEach(() => {
    document.body.removeChild(parentDiv);
    clearFixture();
  });

  it("Should return the component name", () => {
    const name = SmoothScroll.NAME;
    expect(name).toEqual("smoothScroll");
  });

  it("Should initialize instance on data-te-attr", () => {
    setTimeout(() => {
      const instance = SmoothScroll.getInstance(fixtureEl);
      expect(instance).not.toEqual(null);
      instance.dispose();
    });
  });

  it("Should create instance and dispose", () => {
    let instance = new SmoothScroll(fixtureEl);
    expect(instance).not.toEqual(null);
    instance.dispose();
    instance = SmoothScroll.getInstance(fixtureEl);
    expect(instance).toEqual(null);
  });

  it("Should return default values", () => {
    const Default = {
      container: "body",
      offset: 0,
      easing: "linear",
      duration: 500,
      smoothScrollInit: null,
    };

    const instance = new SmoothScroll(fixtureEl);
    expect(instance._options).toEqual(Default);

    instance.dispose();
  });

  it("Should return window as scroll container", () => {
    const instance = new SmoothScroll(fixtureEl);
    expect(instance.isWindow).toEqual(true);
    expect(instance.containerToScroll).toEqual(document.documentElement);

    instance.dispose();
  });

  it("Should scroll on click for body container", () => {
    const instance = new SmoothScroll(fixtureEl);

    let isScrollEnd = false;
    fixtureEl.addEventListener("scrollEnd.te.smoothScroll", () => {
      isScrollEnd = true;
    });

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    setTimeout(() => {
      expect(isScrollEnd).toEqual(true);
    });

    instance.dispose();
  });

  it("Should scroll on click for custom container", () => {
    const instance = new SmoothScroll(fixtureEl, {
      container: ".smooth-scroll",
    });

    let isScrollEnd = false;
    fixtureEl.addEventListener("scrollEnd.te.smoothScroll", () => {
      isScrollEnd = true;
    });

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    setTimeout(() => {
      expect(isScrollEnd).toEqual(true);
    });

    instance.dispose();
  });

  it("Should cancel scroll immediately after start of scrolling", () => {
    const instance = new SmoothScroll(fixtureEl);

    let isCanceled = false;

    fixtureEl.addEventListener("scrollStart.te.smoothScroll", () => {
      instance.cancelScroll();
    });

    fixtureEl.addEventListener("scrollCancel.te.smoothScroll", () => {
      isCanceled = true;
    });

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    expect(isCanceled).toEqual(true);

    instance.dispose();
  });

  it("Should initialize body scroll then container scroll", () => {
    jest.useFakeTimers();

    const instance = new SmoothScroll(fixtureEl, {
      container: ".parent-section",
    });
    instance.inViewport = false;

    jest.runAllTimers();

    const clickEvent = new Event("click");
    fixtureEl.dispatchEvent(clickEvent);

    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalled();
  });

  describe("Easing", () => {
    it("Linear easing", () => {
      const easings = [
        "linear",
        "easeInQuad",
        "easeInCubic",
        "easeInQuart",
        "easeInQuint",
        "easeInOutQuad",
        "easeInOutCubic",
        "easeInOutQuart",
        "easeInOutQuint",
        "easeOutQuad",
        "easeOutCubic",
        "easeOutQuart",
        "easeOutQuint",
      ];

      easings.forEach((easing) => {
        const instance = new SmoothScroll(fixtureEl, { easing });
        const motionName = `_motion${easing[0].toUpperCase()}${easing.slice(
          1
        )}`;
        const received = instance[motionName](2);

        switch (easing) {
          case "linear":
            expect(received).toEqual(2);
            break;
          case "easeInQuad":
            expect(received).toEqual(4);
            break;
          case "easeInCubic":
            expect(received).toEqual(8);
            break;
          case "easeInQuart":
            expect(received).toEqual(16);
            break;
          case "easeInQuint":
            expect(received).toEqual(32);
            break;
          case "easeInOutQuad":
            expect(received).toEqual(-1);
            break;
          case "easeInOutCubic":
            expect(received).toEqual(5);
            break;
          case "easeInOutQuart":
            expect(received).toEqual(-7);
            break;
          case "easeInOutQuint":
            expect(received).toEqual(17);
            break;
          case "easeOutQuad":
            expect(received).toEqual(-0);
            break;
          case "easeOutCubic":
            expect(received).toEqual(2);
            break;
          case "easeOutQuart":
            expect(received).toEqual(-0);
            break;
          case "easeOutQuint":
            expect(received).toEqual(2);
            break;
          default:
            break;
        }

        instance[motionName] = jest.fn();

        const clickEvent = new Event("click");
        fixtureEl.dispatchEvent(clickEvent);

        expect(instance[motionName]).toHaveBeenCalled();

        instance.dispose();
      });
    });
  });
});
