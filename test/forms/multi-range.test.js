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
import { clearFixture, getFixture, jQueryMock } from "../mocks";
import {
  getConnectsTemplate,
  getHandleTemplate,
  getTooltipTemplate,
} from "../../src/js/forms/multi-range/template";
import { getEventTypeClientX } from "../../src/js/forms/multi-range/utils";
import MultiRangeSlider from "../../src/js/forms/multi-range/index";
import initTE from "../../src/js/autoinit/index";

describe("MultiRangeSlider", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = "<div data-te-multi-range-slider-init></div>";
  });

  afterEach(() => {
    clearFixture();
    jest.clearAllMocks();
  });

  afterEach(() => clearFixture());

  describe("basic functionality", () => {
    it("should return a name of a component", () => {
      const NAME = MultiRangeSlider.NAME;
      expect(NAME).toEqual("multiRangeSlider");
    });

    describe("should return templates", () => {
      it("should getConnectsTemplate", () => {
        const template = getConnectsTemplate(
          { connectContainer: "testConnectContainer", connect: "testConnect" },
          "data-te-multi-range-slider-connect-ref"
        );

        fixtureEl.innerHTML = template;

        expect(
          fixtureEl.children[0].getAttribute(
            "data-te-multi-range-slider-connect-ref"
          )
        ).toBe("");
        expect(
          fixtureEl.children[0].classList.contains("testConnectContainer")
        ).toBe(true);
        expect(
          fixtureEl.children[0].children[0].classList.contains("testConnect")
        ).toBe(true);
      });

      it("should getHandleTemplate", () => {
        const template = getHandleTemplate(
          { hand: "handClass" },
          "data-te-multi-range-slider-handle"
        );

        fixtureEl.innerHTML = template;

        expect(
          fixtureEl.children[0].getAttribute(
            "data-te-multi-range-slider-handle"
          )
        ).toBe("");
        expect(fixtureEl.children[0].classList.contains("handClass")).toBe(
          true
        );
      });

      it("should getTooltipTemplate", () => {
        const template = getTooltipTemplate(
          { tooltip: "tooltipClass", tooltipValue: "tooltipValueClass" },
          "data-te-multi-range-slider-tooltip-ref"
        );

        fixtureEl.innerHTML = template;

        expect(fixtureEl.children[0].classList.contains("tooltipClass")).toBe(
          true
        );
        expect(
          fixtureEl.children[0].children[0].classList.contains(
            "tooltipValueClass"
          )
        ).toBe(true);
        expect(
          fixtureEl.children[0].getAttribute(
            "data-te-multi-range-slider-tooltip-ref"
          )
        ).toEqual("");
      });
    });

    describe("should return utils", () => {
      it("should getEventTypeClientX", () => {
        const obj = {
          type: "click",
          touches: [{ clientX: 200 }],
          clientX: 100,
        };

        let template = getEventTypeClientX(obj);
        fixtureEl.innerHTML = template;

        expect(template).toBe(100);

        obj.type = "touchmove";

        template = getEventTypeClientX(obj);

        expect(template).toBe(200);
      });
    });

    describe("index.js", () => {
      it("should get getters", () => {
        const instance = new MultiRangeSlider(fixtureEl);

        expect(instance.hands).not.toBe(null);
        expect(instance.leftConnectRect).not.toBe(null);
        expect(instance.handsNoActive).not.toBe(null);
        expect(instance.handActive).toBe(null);
        instance.dispose();
      });

      it("should create a data instance and remove it on dispose", () => {
        let instance = new MultiRangeSlider(fixtureEl, { type: "test" });
        expect(instance).toBeTruthy();
        instance.dispose();
        instance = MultiRangeSlider.getInstance(fixtureEl);
        expect(instance).not.toBeTruthy();
      });

      it("should start init", () => {
        const instance = new MultiRangeSlider(fixtureEl);
        instance.init();

        expect(instance.hands).not.toBe(null);
        instance.dispose();
      });

      it("should start init", () => {
        const instance = new MultiRangeSlider(fixtureEl);
        instance.init();

        expect(instance.hands).not.toBe(null);
        instance.dispose();
      });

      it("should _setRangeHandleElements", () => {
        const instance = new MultiRangeSlider(fixtureEl, {
          numberOfRanges: 2,
          orientation: "vertical",
        });
        instance._setRangeHandleElements();

        expect([...instance.hands].length).toBe(4);
        instance.dispose();
      });

      it("should create a data instance and remove it on dispose", () => {
        let instance = new MultiRangeSlider(fixtureEl, { type: "test" });
        expect(instance).toBeTruthy();
        instance.dispose();
        instance = MultiRangeSlider.getInstance(fixtureEl);
        expect(instance).not.toBeTruthy();
      });

      it("should _setTransofrmationOnStart", () => {
        const instance = new MultiRangeSlider(fixtureEl);
        expect(instance).toBeTruthy();

        instance._setTransofrmationOnStart();
        const hand = instance.hands[0].dataset.teTranslation;
        expect(hand).toEqual("0");
        instance.dispose();
      });

      it("should _setTooltipToHand", () => {
        const instance = new MultiRangeSlider(fixtureEl, { tooltip: true });
        instance._setTooltipToHand();

        const test = instance.hands[0].querySelector(
          "[data-te-multi-range-slider-tooltip-ref]"
        );
        const test1 = instance.hands[1].querySelector(
          "[data-te-multi-range-slider-tooltip-ref]"
        );

        expect(
          test.getAttribute("data-te-multi-range-slider-tooltip-ref")
        ).toBe("");
        expect(
          test1.getAttribute("data-te-multi-range-slider-tooltip-ref")
        ).toBe("");

        instance.dispose();
      });

      it("moves left hand to the left should not set the value lower than 0", () => {
        const instance = new MultiRangeSlider(fixtureEl);
        const min = instance._options.min;
        const hand = instance.hands[0];
        const mockTooltipValue = "0";

        Object.defineProperty(instance, "activeTooltipValue", {
          get() {
            return {
              textContent: mockTooltipValue,
            };
          },
          set(value) {
            this._activeTooltipValue = value;
          },
        });

        const event = new MouseEvent("mousedown");
        hand.dispatchEvent(event);

        const expectedValue = min;
        const actualValue = parseFloat(instance.activeTooltipValue.textContent);

        expect(actualValue).toBeGreaterThanOrEqual(min);
        expect(actualValue).toBe(expectedValue);

        instance.dispose();
      });
    });

    test("starting positions of hands should correspond to the given startValues", () => {
      const instance = new MultiRangeSlider(fixtureEl, {
        startValues: [40, 80],
        min: 10,
        max: 90,
      });

      const hand = instance.hands[0];
      const mockTooltipValue = "40";

      Object.defineProperty(instance, "activeTooltipValue", {
        get() {
          return {
            textContent: mockTooltipValue,
          };
        },
        set(value) {
          this._activeTooltipValue = value;
        },
      });

      const event = new MouseEvent("mousedown");
      hand.dispatchEvent(event);

      const expectedValue = instance._options.startValues[0];
      const actualValue = parseFloat(instance.activeTooltipValue.textContent);

      expect(actualValue).toBe(expectedValue);

      instance.dispose();
    });
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const instance = new MultiRangeSlider(
        fixtureEl,
        {},
        { connect: "text-green-100" }
      );

      const connect = fixtureEl.querySelector(
        "[data-te-multi-range-slider-connect-ref]"
      );

      expect(connect.children[0].classList.contains("text-green-100")).toBe(
        true
      );
      instance.dispose();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.setAttribute("data-te-class-connect", "text-green-100");

      const instance = new MultiRangeSlider(fixtureEl);
      const connect = fixtureEl.querySelector(
        "[data-te-multi-range-slider-connect-ref]"
      );

      expect(connect.children[0].classList.contains("text-green-100")).toBe(
        true
      );
      instance.dispose();
    });
  });

  describe("initTE", () => {
    it("should auto-init", () => {
      const multiRange = document.createElement("div");
      multiRange.setAttribute("data-te-multi-range-slider-init", "");
      document.body.appendChild(multiRange);

      initTE({ MultiRangeSlider });

      const instance = MultiRangeSlider.getInstance(multiRange);

      expect(instance).toBeTruthy();

      instance.dispose();
    });
  });

  describe("jQuery interface", () => {
    it("should register jQuery methods", () => {
      const mock = { ...jQueryMock };
      window.jQuery = mock;
      jest.resetModules();

      const initTE = require("../../src/js/autoinit/index.js").default;
      const MultiRangeSlider =
        require("../../src/js/forms/multi-range/index").default;
      initTE({ MultiRangeSlider });

      expect(mock.fn.multiRangeSlider).toBeTruthy();

      expect(typeof mock.fn.multiRangeSlider.noConflict()).toBe("function");
    });

    it("should initialize a component with options", () => {
      clearFixture();
      jQueryMock.fn.multiRangeSlider = MultiRangeSlider.jQueryInterface;
      jQueryMock.elements = [fixtureEl];

      jQueryMock.fn.multiRangeSlider.call(jQueryMock, {
        step: 5,
      });

      const instance = MultiRangeSlider.getInstance(fixtureEl);
      expect(instance._options.step).toBe(5);

      instance.dispose();
    });

    it("should call public methods", () => {
      jQueryMock.fn.multiRangeSlider = MultiRangeSlider.jQueryInterface;
      jQueryMock.elements = [fixtureEl];

      jQueryMock.fn.multiRangeSlider.call(jQueryMock, { type: "test" });

      expect(() =>
        jQueryMock.fn.multiRangeSlider.call(jQueryMock, "test")
      ).toThrow();

      jQueryMock.fn.multiRangeSlider.call(jQueryMock, "dispose");

      expect(MultiRangeSlider.getInstance(fixtureEl)).toBe(null);

      expect(() =>
        jQueryMock.fn.multiRangeSlider.call(jQueryMock, "dispose")
      ).not.toThrow();
    });
  });
});
