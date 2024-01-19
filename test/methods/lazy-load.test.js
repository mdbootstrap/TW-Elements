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

let LazyLoad = require("../../src/js/methods/lazy-load").default;

const EVENT_LOADED = `onLoad.te.lazy`;
const EVENT_ERROR = `onError.te.lazy`;

describe("Lazy Loading", () => {
  let fixtureEl;
  let img;
  let video;
  const CLASSNAME_LAZY = "lazy";

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    fixtureEl = getFixture();
    img = document.createElement("img");
    video = document.createElement("video");
    document.body.appendChild(img);
    document.body.appendChild(video);
  });

  afterEach(() => {
    clearFixture();
    document.body.removeChild(img);
    document.body.removeChild(video);
    img.remove();
    video.remove();
  });

  describe("initialization", () => {
    it("should initialize an img element by data attribute", () => {
      img.setAttribute("data-te-lazy-src", "test");

      img.setAttribute("data-te-lazy-load-init", "");

      jest.resetModules();

      const initTE = require("../../src/js/autoinit/index.js").default;
      LazyLoad = require("../../src/js/methods/lazy-load").default;

      let instance = LazyLoad.getOrCreateInstance(img);
      img.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(instance).not.toEqual(null);

      instance.dispose();

      instance = LazyLoad.getInstance(img);

      expect(instance).toEqual(null);
    });

    it("should initialize an video element by data attribute", () => {
      video.setAttribute("data-te-lazy-src", "test");
      video.setAttribute("data-te-lazy-load-init", "");

      jest.resetModules();
      const initTE = require("../../src/js/autoinit/index.js").default;
      LazyLoad = require("../../src/js/methods/lazy-load").default;

      let instance = LazyLoad.getOrCreateInstance(video);
      video.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(instance).not.toEqual(null);

      instance.dispose();

      instance = LazyLoad.getInstance(video);

      expect(instance).toEqual(null);
    });

    it("should return a NAME of a class", () => {
      const name = LazyLoad.NAME;
      expect(name).toEqual("lazyLoad");
    });

    it("should initialize an image element with init values", () => {
      const initTE = require("../../src/js/autoinit/index.js").default;
      const LazyLoad = require("../../src/js/methods/lazy-load").default;
      const instance = new LazyLoad(img, { lazySrc: "test" });
      img.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(instance._options.lazySrc).toEqual("test");

      expect(instance._options.lazyDelay).toEqual(500);

      expect(instance._options.lazyAnimation).toEqual(
        "[fade-in_1s_ease-in-out]"
      );

      expect(instance._options.lazyOffset).toEqual(0);

      instance.dispose();
    });

    it("should initialize an video element with init values", () => {
      const instance = new LazyLoad(video, { lazySrc: "test" });
      video.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(instance._options.lazySrc).toEqual("test");

      expect(instance._options.lazyDelay).toEqual(500);

      expect(instance._options.lazyAnimation).toEqual(
        "[fade-in_1s_ease-in-out]"
      );

      expect(instance._options.lazyOffset).toEqual(0);

      instance.dispose();
    });
  });

  describe("options", () => {
    it("should initialize an img element with selected options (data attrs)", () => {
      const instance = new LazyLoad(img, {
        lazySrc: "test",
        lazyPlaceholder: "placeholder",
        lazyError: "error",
        lazyDelay: 5000,
        lazyOffset: 500,
        lazyAnimation: "tada",
      });

      img.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(instance._options.lazySrc).toEqual("test");

      expect(instance._options.lazyPlaceholder).toEqual("placeholder");

      expect(instance._options.lazyError).toEqual("error");

      expect(instance._options.lazyDelay).toEqual(5000);

      expect(instance._options.lazyAnimation).toEqual("tada");

      expect(instance._options.lazyOffset).toEqual(500);

      instance.dispose();
    });

    it("should initialize an img element with selected options (data attrs)", () => {
      const instance = new LazyLoad(video, {
        lazySrc: "test",
        lazyPlaceholder: "placeholder",
        lazyError: "error",
        lazyDelay: 5000,
        lazyOffset: 500,
        lazyAnimation: "tada",
      });

      video.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(instance._options.lazySrc).toEqual("test");

      expect(instance._options.lazyPlaceholder).toEqual("placeholder");

      expect(instance._options.lazyError).toEqual("error");

      expect(instance._options.lazyDelay).toEqual(5000);

      expect(instance._options.lazyAnimation).toEqual("tada");

      expect(instance._options.lazyOffset).toEqual(500);

      instance.dispose();
    });
  });

  describe("delay", () => {
    it("should trigger lazy load on img element after some amount of time", () => {
      img.setAttribute("data-te-lazy-src", "mdbootstrap.com");
      img.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(img);

      img.dispatchEvent(new Event("load"));

      window.scrollY = 100;

      window.innerHeight = 1400;

      instance.scrollHandler();

      jest.runAllTimers();

      expect(img.src).toEqual("http://localhost/mdbootstrap.com");

      expect(instance.inViewport).toEqual(true);

      instance.dispose();
    });

    it("should trigger lazy load on img element after some amount of time", () => {
      video.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      video.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(video);

      video.dispatchEvent(new Event("load"));

      window.scrollY = 1000;

      window.innerHeight = 1400;

      instance.scrollHandler();

      jest.runAllTimers();

      expect(video.src).toEqual("http://localhost/mdbootstrap.com");

      instance.dispose();
    });
  });

  describe("placeholder / error", () => {
    it("should display img placeholder before loading", () => {
      img.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      img.setAttribute("data-te-lazy-placeholder", "placeholder.com");

      img.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(img);

      img.dispatchEvent(new Event("load"));

      expect(img.src).toEqual("http://localhost/placeholder.com");

      window.scrollY = 1000;

      window.innerHeight = 1400;

      instance.scrollHandler();

      jest.runAllTimers();

      expect(img.src).toEqual("http://localhost/mdbootstrap.com");

      instance.dispose();
    });

    it("should display video placeholder before loading", () => {
      video.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      video.setAttribute("data-te-lazy-placeholder", "placeholder.com");

      video.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(video);

      video.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      window.scrollY = 1000;

      window.innerHeight = 1400;

      instance.scrollHandler();

      jest.runAllTimers();

      expect(video.poster).toEqual("http://localhost/placeholder.com");

      expect(video.src).toEqual("http://localhost/mdbootstrap.com");

      instance.dispose();
    });

    it("should does not work on other elements", () => {
      fixtureEl.setAttribute("data-te-lazy-src", "mdbootstrap.com");
      fixtureEl.setAttribute("data-te-lazy-placeholder", "placeholder.com");

      fixtureEl.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(fixtureEl);

      fixtureEl.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(fixtureEl.src).toEqual(undefined);

      instance.dispose();

      fixtureEl.removeAttribute("data-te-lazy-src");
      fixtureEl.removeAttribute("data-te-lazy-placeholder");
      fixtureEl.classList.remove(...fixtureEl.classList);
    });

    it("should display error picture in img if error occurs", () => {
      img.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      img.setAttribute("data-te-lazy-error", "error.com");

      img.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(img);

      img.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      img.dispatchEvent(new Event("error"));

      expect(img.src).toEqual("http://localhost/error.com");

      instance.dispose();
    });

    it("should display error picture in video if error occurs", () => {
      video.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      video.setAttribute("data-te-lazy-error", "error.com");

      video.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(video);

      video.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      video.dispatchEvent(new Event("error"));

      expect(video.src).toEqual("http://localhost/error.com");

      instance.dispose();
    });

    it("should show error message as alt if initial src failed to load and lazyError wasn't provided", () => {
      img.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      img.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(img);

      img.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      img.dispatchEvent(new Event("error"));

      expect(img.src).toEqual("http://localhost/mdbootstrap.com");
      expect(img.alt).toBe("404 not found");

      instance.dispose();
    });

    it("should show error message as alt if both initial src and lazyError failed to load", () => {
      img.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      img.setAttribute("data-te-lazy-error", "http://localhost/error.com");

      img.getBoundingClientRect = () => ({
        top: 100,
        height: 100,
        bottom: 1100,
      });

      const instance = new LazyLoad(img);

      img.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      img.dispatchEvent(new Event("error"));

      expect(img.src).toEqual("http://localhost/error.com");

      img.dispatchEvent(new Event("error"));

      expect(img.src).toEqual("http://localhost/error.com");

      instance.dispose();
    });
  });

  describe("viewport", () => {
    it("should return true if an img is not in viewport", () => {
      const elImg = document.createElement("img");
      const parent = document.createElement("div");

      document.body.appendChild(parent);
      parent.appendChild(elImg);

      elImg.setAttribute("data-te-lazy-src", "mdbootstrap.com");

      parent.getBoundingClientRect = () => ({
        top: 100,
        y: 100,
        height: 100,
        bottom: 1100,
      });

      elImg.getBoundingClientRect = () => ({
        top: 130,
        y: 130,
        height: 50,
        bottom: 1120,
      });

      window.scrollY = 1000;

      window.innerHeight = 1400;

      const instance = new LazyLoad(parent);

      const childInstance = LazyLoad.getInstance(elImg);

      parent.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(childInstance.inViewport).toEqual(true);
      expect(instance.inViewport).toEqual(true);

      instance.dispose();

      parent.removeChild(elImg);
      document.body.removeChild(parent);
    });
  });

  describe("lazy container", () => {
    it("should initialize every img/video element inside parent with lazy class", () => {
      const containterElement = document.createElement("div");

      document.body.appendChild(containterElement);

      const imageElement = document.createElement("img");

      containterElement.appendChild(imageElement);

      const videoElement = document.createElement("video");

      window.scrollY = 1000;

      window.innerHeight = 1400;

      containterElement.getBoundingClientRect = () => ({
        top: 100,
        y: 100,
        height: 100,
        bottom: 1100,
      });

      imageElement.getBoundingClientRect = () => ({
        top: 130,
        y: 130,
        height: 50,
        bottom: 1120,
      });

      containterElement.appendChild(videoElement);

      const containerInstance = new LazyLoad(containterElement);

      containterElement.dispatchEvent(new Event("load"));

      const imageInstance = LazyLoad.getInstance(imageElement);

      const videoInstance = LazyLoad.getInstance(videoElement);

      imageElement.dispatchEvent(new Event("load"));

      videoElement.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(containerInstance).not.toEqual(null);

      expect(imageInstance).not.toBe(null);

      expect(videoInstance).not.toBe(null);

      containerInstance.dispose();
    });
  });

  describe("events", () => {
    it("should trigger onLoad.te.lazy event on image element after loading", () => {
      const instance = new LazyLoad(img);

      const callback = jest.fn();

      img.addEventListener(EVENT_LOADED, callback);

      img.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();

      instance.dispose();
    });

    it("should trigger onLoad.te.lazy event on video element after loading", () => {
      const instance = new LazyLoad(video);

      const callback = jest.fn();

      video.addEventListener(EVENT_LOADED, callback);

      video.dispatchEvent(new Event("load"));

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();

      instance.dispose();
    });

    it("should trigger onError.te.lazy event on image element after error occurs", () => {
      const instance = new LazyLoad(img);

      const callback = jest.fn();

      img.addEventListener(EVENT_ERROR, callback);

      img.dispatchEvent(new Event("error"));

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();

      instance.dispose();
    });

    it("should trigger onError.te.lazy event on video element after error occurs", () => {
      const instance = new LazyLoad(video);

      jest.runAllTimers();

      const callback = jest.fn();

      video.addEventListener(EVENT_ERROR, callback);

      video.dispatchEvent(new Event("error"));

      jest.runAllTimers();

      expect(callback).toHaveBeenCalled();

      instance.dispose();
    });
  });
});
