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

let InfiniteScroll = require("../../src/js/methods/infinite-scroll").default;

const EVENT_COMPLETED = `complete.te.infiniteScroll`;

describe("Infinite Scroll", () => {
  let fixtureEl;
  const CLASSNAME_INFINITE_SCROLL = "infinite-scroll";

  beforeEach(() => {
    fixtureEl = getFixture();
  });

  afterEach(() => {
    clearFixture();
  });

  describe("initialization", () => {
    it("should initialize an element by a class name and remove it on dispose", () => {
      fixtureEl.classList.add(CLASSNAME_INFINITE_SCROLL);
      fixtureEl.setAttribute("data-te-infinite-scroll-init", "");

      jest.resetModules();

      InfiniteScroll = require("../../src/js/methods/infinite-scroll").default;
      const initTE = require("../../src/js/autoinit/index.js").default;
      initTE({ InfiniteScroll });
      let instance = InfiniteScroll.getInstance(fixtureEl);

      expect(instance).not.toEqual(null);

      instance.dispose();

      instance = InfiniteScroll.getInstance(fixtureEl);

      expect(instance).toEqual(null);
      fixtureEl.classList.remove(CLASSNAME_INFINITE_SCROLL);
    });

    it("should return a NAME of a class", () => {
      const name = InfiniteScroll.NAME;
      expect(name).toEqual("infiniteScroll");
    });
  });

  describe("functionality", () => {
    it("should call a callback after scrolling horizontally", () => {
      jest.useFakeTimers();
      const list = document.createElement("li");

      list.getBoundingClientRect = () => ({
        height: 300,
      });

      list.style.overflowY = "scroll";

      document.body.appendChild(list);

      const els = [];

      for (let i = 0; i < 5; i++) {
        els[i] = document.createElement("li");
        els[i].innerHTML = "Sample";
        els[i].getBoundingClientRect = () => ({
          height: 100,
        });
        list.append(els[i]);
      }

      const instance = new InfiniteScroll(list);

      jest.runAllTimers();

      const callback = jest.fn();

      list.addEventListener(EVENT_COMPLETED, callback);

      list.dispatchEvent(new Event("scroll"));

      instance.scrollHandler();

      expect(callback).toHaveBeenCalled();

      instance.dispose();
    });

    it("should call a callback after scrolling vertically", () => {
      jest.useFakeTimers();

      const divEl = document.createElement("div");

      divEl.getBoundingClientRect = () => ({
        width: 300,
      });

      divEl.style.overflowX = "scroll";
      divEl.style.whiteSpace = "nowrap";
      divEl.setAttribute("data-te-infinite-direction", "x");

      const elements = [];

      for (let i = 0; i < 5; i++) {
        elements[i] = document.createElement("span");
        elements[i].innerHTML = "Sample";
        elements[i].getBoundingClientRect = () => ({
          width: 100,
        });
        divEl.append(elements[i]);
      }

      const instance = new InfiniteScroll(divEl);

      jest.runAllTimers();

      const callback = jest.fn();

      divEl.addEventListener(EVENT_COMPLETED, callback);

      divEl.dispatchEvent(new Event("scroll"));

      instance.scrollHandler();

      expect(callback).toHaveBeenCalled();

      instance.dispose();
    });

    it("should call a callback after scrolling a window", () => {
      jest.useFakeTimers();

      const instance = new InfiniteScroll(window);

      jest.runAllTimers();

      const callback = jest.fn();

      window.addEventListener(EVENT_COMPLETED, callback);

      window.dispatchEvent(new Event("scroll"));

      window.scrollY = 0;

      window.innerHeight = 0;

      instance.scrollHandler();

      expect(callback).toHaveBeenCalled();

      instance.dispose();
    });
  });
});
