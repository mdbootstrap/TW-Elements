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
import Stack from "../../src/js/util/stack";
import { element } from "../../src/js/util/index";
import Manipulator from "../../src/js/dom/manipulator";
import { clearFixture, getFixture, jQueryMock } from "../mocks";

const CLASSNAME_STACK = "stack-element";
const CLASSNAME_CONTAINER = "stack-container";
const SELECTOR_STACK = ".stack-element";
const SELECTOR_CONTAINER = ".stack-container";

describe("Stack", () => {
  const generateElement = (
    { height, top, bottom },
    className = CLASSNAME_STACK
  ) => {
    const el = element("div");
    Manipulator.addClass(el, className);

    el.getBoundingClientRect = () => ({
      height,
      top,
      y: top,
      bottom,
    });

    return el;
  };

  describe("window", () => {
    beforeAll(() => {
      window.innerHeight = 500;
    });

    it("should calculate offset for the next element (top)", () => {
      const firstEl = generateElement({ height: 100, top: 10, bottom: 90 });
      const secondEl = generateElement({ height: 200, top: 0, bottom: 0 });

      document.body.appendChild(firstEl);
      document.body.appendChild(secondEl);

      const stackUtil = new Stack(secondEl, SELECTOR_STACK, {
        position: "top",
      });

      const offset = stackUtil.calculateOffset();

      expect(offset).toEqual(110);

      document.body.removeChild(firstEl);
      document.body.removeChild(secondEl);
    });

    it("should calculate offset for the next element (bottom)", () => {
      const firstEl = generateElement({ height: 100, top: 300, bottom: 400 });
      const secondEl = generateElement({ height: 200, top: 0, bottom: 0 });

      document.body.appendChild(firstEl);
      document.body.appendChild(secondEl);

      const stackUtil = new Stack(secondEl, SELECTOR_STACK, {
        position: "bottom",
      });

      const offset = stackUtil.calculateOffset();

      expect(offset).toEqual(200);

      document.body.removeChild(firstEl);
      document.body.removeChild(secondEl);
    });
  });

  describe("container", () => {
    let container;

    beforeAll(() => {
      window.innerHeight = 800;
      container = generateElement(
        { height: 500, top: 100, bottom: 600 },
        CLASSNAME_CONTAINER
      );
      document.body.appendChild(container);
    });

    afterAll(() => {
      document.body.removeChild(container);
    });

    it("should calculate offset for the next element (top)", () => {
      const firstEl = generateElement({ height: 100, top: 150, bottom: 250 });
      const secondEl = generateElement({ height: 200, top: 0, bottom: 0 });

      container.appendChild(firstEl);
      container.appendChild(secondEl);

      const stackUtil = new Stack(secondEl, SELECTOR_STACK, {
        position: "top",
        container: SELECTOR_CONTAINER,
      });

      const offset = stackUtil.calculateOffset();

      expect(offset).toEqual(150);

      container.removeChild(firstEl);
      container.removeChild(secondEl);
    });

    it("should calculate offset for the next element (bottom)", () => {
      const firstEl = generateElement({ height: 100, top: 500, bottom: 600 });
      const secondEl = generateElement({ height: 200, top: 0, bottom: 0 });

      container.appendChild(firstEl);
      container.appendChild(secondEl);

      const stackUtil = new Stack(secondEl, SELECTOR_STACK, {
        position: "bottom",
        container: SELECTOR_CONTAINER,
      });

      const offset = stackUtil.calculateOffset();

      expect(offset).toEqual(100);

      container.removeChild(firstEl);
      container.removeChild(secondEl);
    });
  });

  describe("updating position", () => {
    beforeAll(() => {
      window.innerHeight = 800;
    });

    it("should recalculate its position", () => {
      const firstEl = generateElement({ height: 100, top: 0, bottom: 100 });
      const secondEl = generateElement({ height: 100, top: 0, bottom: 0 });

      document.body.appendChild(firstEl);
      document.body.appendChild(secondEl);

      const stackUtil = new Stack(secondEl, SELECTOR_STACK, {
        position: "top",
      });
      let offset = stackUtil.calculateOffset();

      expect(offset).toEqual(100);

      document.body.removeChild(firstEl);

      offset = stackUtil.calculateOffset();

      expect(offset).toEqual(0);

      document.body.removeChild(secondEl);
    });
  });

  describe("next elements", () => {
    it("should return elements futher in the stack", () => {
      const firstEl = generateElement({ height: 100, top: 150, bottom: 250 });
      const secondEl = generateElement({ height: 100, top: 250, bottom: 350 });

      document.body.appendChild(firstEl);
      document.body.appendChild(secondEl);

      const stackUtil = new Stack(secondEl, SELECTOR_STACK, {
        position: "top",
      });
      stackUtil.calculateOffset();

      const thirdEl = generateElement({ height: 100, top: 350, bottom: 450 });
      const fourthEl = generateElement({ height: 100, top: 450, bottom: 550 });
      document.body.appendChild(thirdEl);
      document.body.appendChild(fourthEl);

      const nextElements = stackUtil.nextElements;

      expect(nextElements).toHaveLength(3);

      document.body.removeChild(firstEl);
      document.body.removeChild(secondEl);
      document.body.removeChild(thirdEl);
      document.body.removeChild(fourthEl);
    });
  });
});
