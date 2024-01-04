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

import { clearFixture, getFixture, jQueryMock } from "../mocks";
import Animate from "../../src/js/content-styles/animate";
import EventHandler from "../../src/js/dom/event-handler.js";

/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import initTE from "../../src/js/autoinit/index.js";

const NAME = "animation";

describe("Animate", () => {
  let fixtureEl;

  const [body] = document.getElementsByTagName("body");

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `
      <div>test</div>
    `;
  });

  afterEach(() => {
    clearFixture();
    jest.clearAllMocks();

    body.innerHTML = "";
  });

  it("should return component name", () => {
    expect(Animate.NAME).toEqual(NAME);
  });

  it("should init an instance via JS", () => {
    const instance = new Animate(fixtureEl);

    expect(instance).not.toBeNull();
  });

  it("should create a data instance and remove it on dispose", () => {
    let instance = new Animate(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.dispose();
    instance = Animate.getInstance(fixtureEl);

    expect(instance).toEqual(null);
  });

  it("should create constructor data based on HTML", () => {
    const instance = new Animate(fixtureEl);

    expect(instance._element).toBe(fixtureEl);

    instance.dispose();
  });

  it("should create constructor data based on data-te-attributes on init", () => {
    fixtureEl.setAttribute("data-te-animation", "[slide-right_1s_ease-in-out]");
    fixtureEl.setAttribute("data-te-animation-offset", 100);
    fixtureEl.setAttribute("data-te-animation-delay", 2000);
    fixtureEl.setAttribute("data-te-animation-reverse", true);
    fixtureEl.setAttribute("data-te-animation-interval", 1000);
    fixtureEl.setAttribute("data-te-animation-repeat", true);

    const instance = new Animate(fixtureEl);

    expect(instance._options.animation).toBe("[slide-right_1s_ease-in-out]");
    expect(instance._options.animationOffset).toBe(100);
    expect(instance._options.animationDelay).toBe(2000);
    expect(instance._options.animationReverse).toBe(true);
    expect(instance._options.animationInterval).toBe(1000);
    expect(instance._options.animationRepeat).toBe(true);

    instance.dispose();
  });

  describe("Should call other functions depending on data-te-animation-start", () => {
    beforeEach(() => {
      fixtureEl.setAttribute(
        "data-te-animation",
        "[slide-right_1s_ease-in-out]"
      );
    });

    it("should call _startAnimation only on click", () => {
      const instance = new Animate(fixtureEl);

      const _startAnimation = jest.spyOn(instance, "_startAnimation");

      const clickEvent = new Event("mousedown");
      const hoverEvent = new Event("mouseover");
      const scrollEvent = new Event("scroll");

      fixtureEl.dispatchEvent(clickEvent);
      fixtureEl.dispatchEvent(hoverEvent);
      window.dispatchEvent(scrollEvent);

      expect(_startAnimation).toHaveBeenCalledTimes(1);

      instance.dispose();
    });

    it("should call _startAnimation only on hover", () => {
      fixtureEl.setAttribute("data-te-animation-start", "onHover");

      const instance = new Animate(fixtureEl);

      const _startAnimation = jest.spyOn(instance, "_startAnimation");

      const clickEvent = new Event("mousedown");
      const hoverEvent = new Event("mouseover");
      const scrollEvent = new Event("scroll");

      fixtureEl.dispatchEvent(hoverEvent);
      fixtureEl.dispatchEvent(clickEvent);
      window.dispatchEvent(scrollEvent);

      expect(_startAnimation).toHaveBeenCalledTimes(1);

      instance.dispose();
    });

    it("should call _startAnimation only on scroll", () => {
      fixtureEl.setAttribute("data-te-animation-start", "onScroll");

      const instance = new Animate(fixtureEl);

      const _startAnimation = jest.spyOn(instance, "_startAnimation");

      const clickEvent = new Event("mousedown");
      const hoverEvent = new Event("mouseover");
      const scrollEvent = new Event("scroll");

      window.dispatchEvent(scrollEvent);
      fixtureEl.dispatchEvent(hoverEvent);
      fixtureEl.dispatchEvent(clickEvent);

      expect(_startAnimation).toHaveBeenCalledTimes(1);

      instance.dispose();
    });

    it("should call _startAnimation only on load", () => {
      fixtureEl.setAttribute("data-te-animation-start", "onLoad");

      const instance = new Animate(fixtureEl);

      const _startAnimation = jest.spyOn(instance, "_startAnimation");

      const clickEvent = new Event("mousedown");
      const hoverEvent = new Event("mouseover");
      const scrollEvent = new Event("scroll");

      window.dispatchEvent(scrollEvent);
      fixtureEl.dispatchEvent(hoverEvent);
      fixtureEl.dispatchEvent(clickEvent);

      expect(_startAnimation).toHaveBeenCalledTimes(0);

      instance.dispose();
    });

    it("should don't call any function when animationStart is set to manually", () => {
      fixtureEl.setAttribute("data-te-animation-start", "manually");

      const instance = new Animate(fixtureEl);

      const _startAnimation = jest.spyOn(instance, "_startAnimation");

      const clickEvent = new Event("mousedown");
      const hoverEvent = new Event("mouseover");
      const scrollEvent = new Event("scroll");

      window.dispatchEvent(scrollEvent);
      fixtureEl.dispatchEvent(hoverEvent);
      fixtureEl.dispatchEvent(clickEvent);

      expect(_startAnimation).toHaveBeenCalledTimes(0);

      instance.dispose();
    });
  });

  it("should call _setAnimationRepeat after start animation", () => {
    const instance = new Animate(fixtureEl, {
      animationStart: "manually",
      animation: "[slide-right_1s_ease-in-out]",
      animationRepeat: true,
    });

    const _setAnimationRepeat = jest.spyOn(instance, "_setAnimationRepeat");

    instance._startAnimation();

    expect(_setAnimationRepeat).toHaveBeenCalled();

    instance.dispose();
  });

  it("should bind click events and reset animation", () => {
    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_1s_ease-in-out]",
      animationReset: true,
    });

    const _resetAnimation = jest.spyOn(instance, "_clearAnimationClass");
    const _startAnimation = jest.spyOn(instance, "_startAnimation");

    const clickEvent = new Event("mousedown");
    const hoverEvent = new Event("mouseover");

    fixtureEl.dispatchEvent(clickEvent);
    fixtureEl.dispatchEvent(hoverEvent);

    expect(_startAnimation).toHaveBeenCalledTimes(1);

    EventHandler.on(fixtureEl, "animationend", () => {
      expect(_resetAnimation).toHaveBeenCalledTimes(1);
    });

    EventHandler.off(fixtureEl, "animationend");
    instance.dispose();
  });

  it("should not call animateOnScroll if not scrolling and showOnLoad === true", () => {
    const _animateOnScroll = jest.spyOn(Animate.prototype, "_animateOnScroll");

    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_1s_ease-in-out]",
      animationStart: "onScroll",
      animateShowOnLoad: true,
    });

    expect(_animateOnScroll).not.toHaveBeenCalled();

    instance.dispose();
  });

  it("should hide element if element not visible on screen on first scroll", () => {
    const instance = new Animate(fixtureEl, {
      animationStart: "onScroll",
      animation: "[slide-right_1s_ease-in-out]",
      animationOffset: -1000,
      animateShowOnLoad: false,
    });

    instance._isFirstScroll = true;

    const _hideAnimateElement = jest.spyOn(instance, "_hideAnimateElement");

    const scrollEvent = new Event("scroll");
    window.dispatchEvent(scrollEvent);

    expect(_hideAnimateElement).toHaveBeenCalled();

    instance.dispose();
  });

  it("should call callback, show element and start animate if element visible on screen", () => {
    const instance = new Animate(fixtureEl, {
      animationStart: "onScroll",
      animation: "[slide-right_1s_ease-in-out]",
    });

    const _showAnimateElement = jest.spyOn(instance, "_showAnimateElement");
    const _startAnimation = jest.spyOn(instance, "_startAnimation");
    const _callback = jest.spyOn(instance, "_callback");

    instance._isFirstScroll = false;

    const scrollEvent = new Event("scroll");
    window.dispatchEvent(scrollEvent);

    expect(_showAnimateElement).toHaveBeenCalled();
    expect(_startAnimation).toHaveBeenCalled();
    expect(_callback).toHaveBeenCalled();

    instance.dispose();
  });

  it("should add animated class to animateElement after _addAnimatedClass is triggered", () => {
    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_1s_ease-in-out]",
    });

    const _addAnimatedClass = jest.spyOn(instance, "_addAnimatedClass");

    const clickEvent = new Event("mousedown");
    fixtureEl.dispatchEvent(clickEvent);

    expect(_addAnimatedClass).toHaveBeenCalled();
    expect(fixtureEl.classList).toContain(
      "animate-[slide-right_1s_ease-in-out]"
    );

    instance.dispose();
  });

  it("should delete animated class to animateElement after _clearAnimationClass is triggered", () => {
    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_1s_ease-in-out]",
    });

    const _clearAnimationClass = jest.spyOn(instance, "_clearAnimationClass");

    const clickEvent = new Event("mousedown");
    fixtureEl.dispatchEvent(clickEvent);

    EventHandler.on(fixtureEl, "animationend", () => {
      expect(_clearAnimationClass).toHaveBeenCalled();
      expect(fixtureEl.classList).not.toContain(
        "animate-[slide-right_1s_ease-in-out]"
      );
    });

    instance.dispose();
  });

  it("should start animation after startAnimation is triggered", () => {
    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_1s_ease-in-out]",
      animationStart: "manually",
    });

    instance.startAnimation();

    expect(fixtureEl.classList).toContain(
      "animate-[slide-right_1s_ease-in-out]"
    );

    instance.dispose();
  });

  it("should stop animation after stopAnimation is triggered", () => {
    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_1s_ease-in-out]",
      animationStart: "manually",
    });

    instance.stopAnimation();

    expect(fixtureEl.classList).not.toContain(
      "animate-[slide-right_1s_ease-in-out]"
    );

    instance.dispose();
  });

  it("should change animation type", () => {
    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_1s_ease-in-out]",
      animationStart: "manually",
    });

    instance.startAnimation();

    expect(fixtureEl.classList).toContain(
      "animate-[slide-right_1s_ease-in-out]"
    );

    instance.stopAnimation();

    instance.changeAnimationType("[slide-left_1s_ease-in-out]");

    instance.startAnimation();

    expect(fixtureEl.classList).toContain(
      "animate-[slide-left_1s_ease-in-out]"
    );
    expect(fixtureEl.classList).not.toContain(
      "animate-[slide-right_1s_ease-in-out]"
    );

    instance.dispose();
  });

  it("should set animation interval", () => {
    jest.useFakeTimers();

    const instance = new Animate(fixtureEl, {
      animation: "[slide-right_0.1s_ease-in-out]",
      animationStart: "manually",
      animationInterval: 100,
    });

    const _addAnimatedClass = jest.spyOn(instance, "_addAnimatedClass");

    instance._setAnimationInterval();

    fixtureEl.dispatchEvent(new Event("animationend"));

    jest.advanceTimersByTime(instance._options.animationInterval);

    expect(_addAnimatedClass).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("should be able to init via jq", () => {
    const _init = jest.spyOn(Animate.prototype, "_init");

    jQueryMock.fn.animate = Animate.jQueryInterface;
    jQueryMock.elements = [fixtureEl];
    jQueryMock.fn.animate.call(jQueryMock.elements);

    expect(_init).toHaveBeenCalled();
  });

  describe("initTE", () => {
    it("should initialize with use of initTE", () => {
      fixtureEl.setAttribute("data-te-animation-init", "");

      initTE({ Animate });

      const instance = Animate.getInstance(fixtureEl);

      expect(instance).not.toBeNull();

      instance.dispose();
    });
  });
});
