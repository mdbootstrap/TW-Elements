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
import { ENTER, TAB, ESCAPE } from "../../src/js/util/keycodes";

// eslint-disable-next-line no-unused-vars
import initTE from "../../src/js/autoinit/index";

import Sidenav from "../../src/js/navigation/sidenav";
import Collapse from "../../src/js/components/collapse";

/* eslint-disable no-undef */

jest.mock("../../src/js/util/touch/index");

jest.mock("../../src/js/methods/ripple");

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {},
}));

global.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

const NAME = "sidenav";

const ARROW_ATTR = "data-te-sidenav-rotate-icon-ref";
const BACKDROP_ATTR = "data-te-backdrop-show";
const COLLAPSE_ATTR = "data-te-sidenav-collapse-ref";
const LINK_ATTR = "data-te-sidenav-link-ref";
const ACTIVE_ATTR = "data-te-sidenav-state-active";

const setFixture = () => {
  const fixtureEl = getFixture();
  fixtureEl.setAttribute("ID", "test-sidenav");
  fixtureEl.style.top = 0;
  fixtureEl.style.left = 0;
  fixtureEl.style.position = "fixed";
  fixtureEl.style.transform = "translateX(-100%)";
  fixtureEl.getBoundingClientRect = () => {
    const x =
      fixtureEl.style.transform === "translateX(-100%)"
        ? -1 * parseFloat(fixtureEl.style.width)
        : 0;
    return {
      x,
    };
  };

  fixtureEl.innerHTML = `
  <ul class="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
    <li class="relative">
      <a
        class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
        data-te-sidenav-link-ref
        href="#test"
        >
        <span
          class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
        </span>
        <span>Test</span>
      </a>
    </li>
    <li class="relative">
      <a
        class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
        data-te-sidenav-link-ref>
        <span
          class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-4 w-4">
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <span>Test</span>
        <span
          class="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
          data-te-sidenav-rotate-icon-ref>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-5 w-5">
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd" />
          </svg>
        </span>
      </a>
      <ul
        class="relative m-0 hidden list-none p-0 data-[te-collapse-show]:block !visible"
        data-te-sidenav-collapse-ref
        data-te-collapse-show>
        <li class="relative">
          <a
            class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
            data-te-sidenav-link-ref
            >Inner</a
          >
        </li>
      </ul>
    </li>
  </ul>
  `;

  return fixtureEl;
};

describe("Sidenav", () => {
  let fixtureEl;
  let firstLink;
  let toggler;
  let secondLink;
  let collapse;
  const [body] = document.getElementsByTagName("body");

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    fixtureEl = setFixture();

    body.appendChild(fixtureEl);

    [firstLink, toggler, secondLink] = [
      ...document.querySelectorAll(`[${LINK_ATTR}]`),
    ];

    collapse = document.querySelector(`[${COLLAPSE_ATTR}]`);
    jest.resetModules();

    const scrollHeightMock = jest.spyOn(
      Object.getPrototypeOf(body),
      "scrollHeight",
      "get"
    );
    scrollHeightMock.mockReturnValue(600);

    const clientHeightMock = jest.spyOn(
      Object.getPrototypeOf(body),
      "clientHeight",
      "get"
    );
    clientHeightMock.mockReturnValue(400);

    const clientWidthMock = jest.spyOn(
      Object.getPrototypeOf(body),
      "clientWidth",
      "get"
    );
    clientWidthMock.mockReturnValue(300);

    const offsetWidthMock = jest.spyOn(
      Object.getPrototypeOf(body),
      "offsetWidth",
      "get"
    );
    offsetWidthMock.mockReturnValue(317);

    const documentClientWidthMock = jest.spyOn(
      document.documentElement,
      "clientWidth",
      "get"
    );
    documentClientWidthMock.mockReturnValue(600);
  });

  afterEach(() => {
    body.innerHTML = "";
    clearFixture();
    jest.restoreAllMocks();
  });

  describe("basic functionality", () => {
    it("should return the name of the component", () => {
      const componentName = Sidenav.NAME;
      expect(componentName).toEqual(NAME);
    });

    it("should create an instance and destroy it on dispose()", () => {
      new Sidenav(fixtureEl); // eslint-disable-line no-new
      const instance = Sidenav.getInstance(fixtureEl);

      expect(instance).not.toBe(null);

      instance.dispose();
    });

    it("should initialize with default options", () => {
      const instance = new Sidenav(fixtureEl);

      const options = {
        sidenavAccordion: false,
        sidenavBackdrop: true,
        sidenavBackdropClass: null,
        sidenavCloseOnEsc: true,
        sidenavColor: "primary",
        sidenavContent: null,
        sidenavExpandable: true,
        sidenavExpandOnHover: false,
        sidenavFocusTrap: true,
        sidenavMode: "over",
        sidenavScrollContainer: null,
        sidenavSlim: false,
        sidenavSlimCollapsed: false,
        sidenavSlimWidth: 77,
        sidenavPosition: "fixed",
        sidenavRight: false,
        sidenavTransitionDuration: 300,
        sidenavWidth: 240,
      };

      const keys = Object.keys(options);
      for (let i = 0; i < keys.length; i++) {
        expect(instance.options[keys[i]]).toBe(options[keys[i]]);
      }
    });

    it("should initialize with options (JS)", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavWidth: 400,
        sidenavPosition: "absolute",
      });

      expect(instance.options.sidenavPosition).toEqual("absolute");
      expect(instance.options.sidenavWidth).toEqual(400);
    });

    it("should initialize with options (data attributes)", () => {
      fixtureEl.setAttribute("data-te-sidenav-width", 800);
      fixtureEl.setAttribute("data-te-sidenav-mode", "side");

      const instance = new Sidenav(fixtureEl);

      expect(instance.options.sidenavMode).toEqual("side");
      expect(instance.options.sidenavWidth).toEqual(800);
    });

    it("should calculate isVisible value correctly for sidenav right", () => {
      const newFixtureEl = fixtureEl;
      newFixtureEl.style.transform = "translateX(100%)";

      const instance = new Sidenav(newFixtureEl, {
        sidenavRight: true,
        sidenavHidden: true,
      });

      expect(instance.container.scrollHeight).toBe(600);
      expect(instance.container.clientHeight).toBe(400);
      expect(instance.container.offsetWidth).toBe(317);
      expect(instance.container.clientWidth).toBe(300);

      // expect(instance.isVisible).toBe(false);
      // instance.toggle();
      // expect(instance.isVisible).toBe(true);
      // instance.dispose();
    });

    it("should receive different styling depending on color attribute", () => {
      const instance = new Sidenav(fixtureEl, { sidenavColor: "secondary" });

      expect(fixtureEl.classList.contains("sidenav-secondary")).toBe(true);

      instance.update({ sidenavColor: "warning" });

      expect(fixtureEl.classList.contains("sidenav-secondary")).not.toBe(true);
      expect(fixtureEl.classList.contains("sidenav-warning")).toBe(true);

      instance.update({ sidenavColor: "test" });

      expect(fixtureEl.classList.contains("sidenav-primary")).toBe(true);
    });

    it("should show/hide and emit events", () => {
      const instance = new Sidenav(fixtureEl);
      const showMock = jest.fn();
      const shownMock = jest.fn();
      const hideMock = jest.fn();
      const hiddenMock = jest.fn();

      fixtureEl.addEventListener("show.te.sidenav", showMock);
      fixtureEl.addEventListener("shown.te.sidenav", shownMock);
      fixtureEl.addEventListener("hide.te.sidenav", hideMock);
      fixtureEl.addEventListener("hidden.te.sidenav", hiddenMock);

      instance.show();

      expect(instance.isVisible).toBe(true);
      expect(showMock).toHaveBeenCalled();

      jest.runAllTimers();

      expect(shownMock).toHaveBeenCalled();

      instance.hide();

      expect(instance.isVisible).toBe(false);
      expect(hideMock).toHaveBeenCalled();

      jest.runAllTimers();

      expect(hiddenMock).toHaveBeenCalled();
    });
  });

  describe("collapse", () => {
    it("should initialize collapse components", () => {
      const instance = new Sidenav(fixtureEl);
      const collapse = Collapse.getInstance(
        document.getElementById(`sidenav-collapse-${instance._ID}-0-0`)
      );
      expect(collapse).not.toBe(null);
      collapse.dispose();
    });
    it("should append arrows and rotate them", () => {
      new Sidenav(fixtureEl);
      const arrow = document.querySelector(`[${ARROW_ATTR}]`);
      expect(arrow.parentNode).toEqual(toggler);
      toggler.dispatchEvent(new MouseEvent("click"));
      jest.runAllTimers();
      expect(arrow.classList).not.toContain("rotate-180");

      toggler.dispatchEvent(new MouseEvent("click"));
      jest.runAllTimers();
      expect(arrow.classList).toContain("rotate-180");
    });

    it("should check if all items are collapsed", () => {
      const instance = new Sidenav(fixtureEl);
      instance.show();

      expect(instance._isAllCollapsed()).toBe(true);

      collapse.getClientRects = jest.fn(() => [
        {
          width: 100,
        },
      ]);
      expect(instance._isAllCollapsed()).toBe(false);
    });
  });

  describe("slim mode", () => {
    it("should collapse into slim mode and emit events", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavSlim: true,
        sidenavSlimWidth: 20,
        sidenavWidth: 90,
      });
      const collapseMock = jest.fn();
      const collapsedMock = jest.fn();
      const expandMock = jest.fn();
      const expandedMock = jest.fn();
      fixtureEl.addEventListener("collapse.te.sidenav", collapseMock);
      fixtureEl.addEventListener("collapsed.te.sidenav", collapsedMock);
      fixtureEl.addEventListener("expand.te.sidenav", expandMock);
      fixtureEl.addEventListener("expanded.te.sidenav", expandedMock);
      expect(fixtureEl.style.width).toEqual("90px");
      instance.toggleSlim();
      expect(fixtureEl.style.width).toEqual("20px");
      expect(collapseMock).toHaveBeenCalled();
      jest.runAllTimers();
      expect(collapsedMock).toHaveBeenCalled();
      instance.toggleSlim();
      expect(fixtureEl.style.width).toEqual("90px");
      expect(expandMock).toHaveBeenCalled();
      jest.runAllTimers();
      expect(expandedMock).toHaveBeenCalled();
    });
    it("should expand on hover", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavSlim: true,
        sidenavExpandOnHover: true,
        sidenavSlimCollapsed: true,
        sidenavSlimWidth: 20,
        sidenavWidth: 90,
      });
      expect(fixtureEl.style.width).toEqual("20px");
      fixtureEl.dispatchEvent(new MouseEvent("mouseenter"));
      expect(fixtureEl.style.width).toEqual("90px");
      fixtureEl.dispatchEvent(new MouseEvent("mouseleave"));
      expect(fixtureEl.style.width).toEqual("20px");
      instance.dispose();
    });
    it("should change the size when toggling sidenav slim to not slim", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavSlim: true,
        sidenavSlimCollapsed: true,
      });
      expect(instance._element.style.width).toBe("77px");
      instance.toggleSlim(false);
      expect(instance._element.style.width).toBe("240px");
      instance.dispose();
    });
    it("should show/hide slim elements", () => {
      fixtureEl.innerHTML = `
          <div data-te-sidenav-slim="true" id="only-slim"></div>
          <div data-te-sidenav-slim="false" id="only-expanded"></div>
          <div id="always-visible"></div>
        `;
      jest.useFakeTimers();
      const instance = new Sidenav(fixtureEl, {
        sidenavSlim: true,
        sidenavTransitionDuration: 0,
      });
      expect(document.getElementById("only-slim").style.display).toEqual(
        "none"
      );
      expect(document.getElementById("only-expanded").style.display).toEqual(
        "unset"
      );
      expect(document.getElementById("always-visible").style.display).toEqual(
        ""
      );
      instance.toggleSlim();
      jest.runAllTimers();
      expect(document.getElementById("only-slim").style.display).toEqual(
        "unset"
      );
      expect(document.getElementById("only-expanded").style.display).toEqual(
        "none"
      );
      expect(document.getElementById("always-visible").style.display).toEqual(
        ""
      );
    });
    it("should hide collapse in a slim mode", () => {
      const instance = new Sidenav(fixtureEl, { sidenavSlim: true });
      instance.show();
      const collapseInstance = Collapse.getInstance(collapse);
      collapseInstance.show();
      collapseInstance.hide = jest.fn();
      instance.toggleSlim();
      jest.runAllTimers();
      expect(collapseInstance.hide).toHaveBeenCalled();
      collapseInstance.dispose();
    });
    // it.only("should return to a slim state after collapsing menu", () => {
    //   const instance = new Sidenav(fixtureEl, {
    //     sidenavSlim: true,
    //     sidenavSlimCollapsed: true,
    //   });
    //   instance.show();
    //   const collapseInstance = Collapse.getInstance(collapse);
    //   console.log("before click");
    //   toggler.dispatchEvent(
    //     new Event("click", {
    //       preventDefault: jest.fn(),
    //     })
    //   );
    //   jest.runAllTimers();
    //   console.log(toggler.parentNode.innerHTML);
    //   console.log("after click");
    //   expect(instance._slimCollapsed).toBe(false);
    //   instance._isAllCollapsed = () => true;
    //   collapseInstance.hide();
    //   jest.runAllTimers();
    //   expect(instance._slimCollapsed).toBe(true);
    // });
  });
  describe("backdrop", () => {
    it("should be controlled with a backdrop option", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavBackdrop: false,
      });
      instance.show();

      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBe(null);
    });
    it("should hide a component on click", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "over",
      });
      instance.show();
      const backdrop = document.querySelector(`[${BACKDROP_ATTR}]`);
      backdrop.dispatchEvent(new MouseEvent("mousedown"));

      expect(instance.isVisible).toBe(false);
    });
    it("should be added to the body", () => {
      const instance = new Sidenav(fixtureEl);
      instance.show();
      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBeTruthy();
      instance.hide();
      jest.runAllTimers();
      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBeFalsy();
    });
    it("should initialize with custom class", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavBackdropClass: "test-class",
      });
      instance.show();
      const backdrop = document.querySelector(`[${BACKDROP_ATTR}]`);
      expect(backdrop.classList.contains("test-class")).toBe(true);
    });
    it("should toggle on mode change", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "side",
      });
      instance.show();
      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBeFalsy();
      instance.changeMode("over");
      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBeTruthy();
      instance.changeMode("push");
      jest.runAllTimers();
      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBeFalsy();
    });
    it("should be removed on dispose", () => {
      const instance = new Sidenav(fixtureEl);
      instance.show();
      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBeTruthy();
      instance.dispose();
      expect(document.querySelector(`[${BACKDROP_ATTR}]`)).toBeFalsy();
    });
    it("should be added to a relative container", () => {
      const container = document.createElement("div");
      container.style.position = "relative";
      body.removeChild(fixtureEl);
      container.appendChild(fixtureEl);
      const instance = new Sidenav(fixtureEl, {
        sidenavPosition: "absolute",
      });
      instance.show();
      expect(container.querySelector(`[${BACKDROP_ATTR}]`)).toBeTruthy();
      container.removeChild(fixtureEl);
    });
  });

  describe("offsets", () => {
    let content;

    beforeEach(() => {
      content = document.createElement("div");
      content.setAttribute("ID", "test-content");
      body.appendChild(content);
    });

    afterEach(() => {
      body.removeChild(content);
    });

    it("should be emitted on show/hide and modeChange", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "side",
        sidenavWidth: 2000,
      });

      const updateMock = jest.fn();
      const update = (e) => {
        updateMock();
        expect(e.margin).toBeTruthy();
        expect(e.padding).toBeTruthy();
      };

      fixtureEl.addEventListener("update.te.sidenav", update);

      instance.show();

      expect(updateMock).toHaveBeenCalledTimes(1);

      instance.changeMode("over");

      expect(updateMock).toHaveBeenCalledTimes(2);

      instance.changeMode("push");

      expect(updateMock).toHaveBeenCalledTimes(3);

      instance.hide();

      expect(updateMock).toHaveBeenCalledTimes(4);
    });

    it("should be applied to a content element depending on a mode", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "side",
        sidenavWidth: 2000,
        sidenavContent: "#test-content",
      });

      instance.show();

      expect(content.style.marginLeft).toEqual("");
      expect(content.style.paddingLeft).toEqual("2000px");
      expect(content.style.marginRight).toEqual("0px");
      expect(content.style.paddingRight).toEqual("");

      instance.changeMode("push");

      expect(content.style.marginLeft).toEqual("");
      expect(content.style.paddingLeft).toEqual("2000px");
      expect(content.style.marginRight).toEqual("-2000px");
      expect(content.style.paddingRight).toEqual("");

      instance.changeMode("over");

      expect(content.style.marginLeft).toEqual("");
      expect(content.style.paddingLeft).toEqual("0px");
      expect(content.style.marginRight).toEqual("0px");
      expect(content.style.paddingRight).toEqual("");
    });

    it("should return to original values after hide()", () => {
      content.style.paddingLeft = "100px";
      content.style.marginRight = "200px";

      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "side",
        sidenavWidth: 2000,
        sidenavContent: "#test-content",
      });

      instance.show();

      expect(content.style.marginLeft).toEqual("");
      expect(content.style.paddingLeft).toEqual("2100px");
      expect(content.style.marginRight).toEqual("200px");
      expect(content.style.paddingRight).toEqual("");

      instance.hide();

      expect(content.style.marginLeft).toEqual("");
      expect(content.style.paddingLeft).toEqual("100px");
      expect(content.style.marginRight).toEqual("200px");
      expect(content.style.paddingRight).toEqual("");
    });

    it("should be added to the other side in a right mode", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "side",
        sidenavWidth: 2000,
        sidenavRight: true,
        sidenavContent: "#test-content",
      });

      instance.show();

      expect(content.style.marginLeft).toEqual("0px");
      expect(content.style.paddingLeft).toEqual("");
      expect(content.style.marginRight).toEqual("");
      expect(content.style.paddingRight).toEqual("2000px");

      instance.changeMode("push");

      expect(content.style.marginLeft).toEqual("-2000px");
      expect(content.style.paddingLeft).toEqual("");
      expect(content.style.marginRight).toEqual("");
      expect(content.style.paddingRight).toEqual("2000px");

      instance.changeMode("over");

      expect(content.style.marginLeft).toEqual("0px");
      expect(content.style.paddingLeft).toEqual("");
      expect(content.style.marginRight).toEqual("");
      expect(content.style.paddingRight).toEqual("0px");
    });

    it("should not change paddingLeft after use an update method", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "side",
        sidenavWidth: 2000,
        sidenavContent: "#test-content",
      });

      instance.show();

      expect(content.style.marginLeft).toEqual("");
      expect(content.style.paddingLeft).toEqual("2000px");
      expect(content.style.marginRight).toEqual("0px");
      expect(content.style.paddingRight).toEqual("");

      instance.update({ sidenavSlim: false });

      expect(content.style.marginLeft).toEqual("");
      expect(content.style.paddingLeft).toEqual("2000px");
      expect(content.style.marginRight).toEqual("0px");
      expect(content.style.paddingRight).toEqual("");

      instance.dispose();
    });
  });

  describe("active", () => {
    it("should set active link on init", () => {
      window.location.hash = "test";
      const instance = new Sidenav(fixtureEl);
      instance.show();

      expect(firstLink.hasAttribute(ACTIVE_ATTR)).toBe(true);
    });
    it("should update active element on click", () => {
      const instance = new Sidenav(fixtureEl);
      instance.show();
      firstLink.dispatchEvent(new MouseEvent("click"));
      expect(firstLink.hasAttribute(ACTIVE_ATTR)).toBe(true);
      console.log(secondLink.innerHTML);
      secondLink.dispatchEvent(new MouseEvent("click"));
      expect(firstLink.hasAttribute(ACTIVE_ATTR)).toBe(false);
      expect(toggler.hasAttribute(ACTIVE_ATTR)).toBe(true);
    });
    it("should set active items on hashchange", () => {
      const instance = new Sidenav(fixtureEl);
      instance._setActiveElements = jest.fn();
      window.dispatchEvent(
        new HashChangeEvent("hashchange", {
          oldURL: "test.com",
          newURL: "new-test.com",
        })
      );
      expect(instance._setActiveElements).toHaveBeenCalled();
    });
  });

  describe("keyboard navigation", () => {
    it("should close on esc", () => {
      fixtureEl.setAttribute("ID", "test-id");
      const toggler = document.createElement("button");
      toggler.setAttribute("data-te-sidenav-toggle-ref", "");
      toggler.setAttribute("data-te-target", "#test-id");

      toggler.getClientRects = jest.fn(() => [
        {
          width: 100,
        },
      ]);

      body.appendChild(toggler);
      const instance = new Sidenav(fixtureEl);
      instance.show();
      window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: TAB }));
      expect(instance.isVisible).toBe(true);
      window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: ESCAPE }));
      expect(instance.isVisible).toBe(false);
      body.removeChild(toggler);
    });
    it("should not close on esc without a visible toggler", () => {
      fixtureEl.setAttribute("ID", "test-id");
      const toggler = document.createElement("button");
      toggler.setAttribute("data-te-sidenav-toggle-ref", "");
      toggler.setAttribute("data-te-target", "#test-id");
      toggler.style.display = "none";

      body.appendChild(toggler);
      const instance = new Sidenav(fixtureEl);
      instance.show();
      window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: ESCAPE }));
      expect(instance.isVisible).toBe(true);
      body.removeChild(toggler);
      window.dispatchEvent(new KeyboardEvent("keydown", { keyCode: ESCAPE }));
      expect(instance.isVisible).toBe(true);
    });
    it("should set active link on enter", () => {
      const instance = new Sidenav(fixtureEl);
      instance._setActiveElements = jest.fn();
      instance.show();
      firstLink.dispatchEvent(new KeyboardEvent("keydown", { keyCode: ENTER }));
      expect(instance._setActiveElements).toHaveBeenCalledWith(firstLink);
    });
  });

  describe("non-fixed positioning", () => {
    let container;

    beforeEach(() => {
      container = document.createElement("div");
      container.style.position = "relative";
      container.style.width = "400px";
      container.style.height = "500px";

      container.getBoundingClientRect = () => ({
        x: 0,
        width: 400,
      });

      container.appendChild(fixtureEl);
    });

    afterEach(() => {
      container.removeChild(fixtureEl);
    });

    it("should be positioned relatively to the container", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavPosition: "absolute",
      });

      expect(window.getComputedStyle(fixtureEl).height).toEqual("100%");

      instance.show();

      expect(instance.isVisible).toBe(true);

      instance.hide();

      expect(instance.isVisible).toBe(false);
    });

    it("should be positioned relatively to container with position-relative class", () => {
      container.style.position = "";
      container.classList.add("relative");
      container.setAttribute("ID", "test-container");
      body.appendChild(container);

      const instance = new Sidenav(fixtureEl, {
        sidenavPosition: "absolute",
      });

      expect(instance.container.getAttribute("ID")).toBe("test-container");

      instance.dispose();
      body.removeChild(container);
    });
  });

  describe("touch events", () => {
    let toggler;

    beforeEach(() => {
      fixtureEl.setAttribute("ID", "test-sidenav");
      toggler = document.createElement("button");
      toggler.setAttribute("data-te-sidenav-toggle-ref", "");
      toggler.setAttribute("data-te-target", "#test-sidenav");

      toggler.getClientRects = jest.fn(() => [
        {
          width: 100,
        },
      ]);

      body.appendChild(toggler);
    });

    afterEach(() => {
      body.removeChild(toggler);
    });

    it("should hide on a swipeleft event (left)", () => {
      const instance = new Sidenav(fixtureEl);

      instance.show();

      fixtureEl.dispatchEvent(new Event("swipeleft"));

      expect(instance.isVisible).toBe(false);
    });

    it("should hide on a swiperight event (right)", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavRight: true,
      });

      instance.show();

      instance.toggle = jest.fn();

      fixtureEl.dispatchEvent(new Event("swiperight"));

      expect(instance.toggle).toHaveBeenCalled();
    });

    it("should expand/collapse slim on swipe (left)", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavSlim: true,
        sidenavSlimCollapsed: true,
      });

      instance.show();

      fixtureEl.dispatchEvent(new Event("swiperight"));

      expect(instance._slimCollapsed).toBe(false);

      fixtureEl.dispatchEvent(new Event("swipeleft"));

      expect(instance._slimCollapsed).toBe(true);

      instance.toggle = jest.fn();

      fixtureEl.dispatchEvent(new Event("swipeleft"));

      expect(instance.toggle).toHaveBeenCalled();
    });

    it("should expand/collapse slim on swipe (right)", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavSlim: true,
        sidenavSlimCollapsed: true,
        sidenavRight: true,
      });

      instance.show();

      fixtureEl.dispatchEvent(new Event("swipeleft"));

      expect(instance._slimCollapsed).toBe(false);

      fixtureEl.dispatchEvent(new Event("swiperight"));

      expect(instance._slimCollapsed).toBe(true);

      instance.toggle = jest.fn();

      fixtureEl.dispatchEvent(new Event("swiperight"));

      expect(instance.toggle).toHaveBeenCalled();
    });
  });

  describe("scrolling", () => {
    it("should initialize Perfect Scrollbar on the main element", () => {
      const instance = new Sidenav(fixtureEl);
      expect(fixtureEl.classList.contains("perfect-scrollbar")).toBe(true);
    });
    it("should initialize Perfect Scrollbar on the inner element", () => {
      const scrollElement = document.createElement("div");
      scrollElement.setAttribute("ID", "scroll-element");
      fixtureEl.appendChild(scrollElement);
      const instance = new Sidenav(fixtureEl, {
        sidenavScrollContainer: "#scroll-element",
      });
      expect(scrollElement.classList.contains("perfect-scrollbar")).toBe(true);
    });
    it("should calculate scroll container height based on siblings", () => {
      const scrollElement = document.createElement("div");
      scrollElement.setAttribute("ID", "scroll-element");
      const header = document.createElement("div");
      header.style.height = "100px";
      fixtureEl.appendChild(header);
      fixtureEl.appendChild(scrollElement);
      const instance = new Sidenav(fixtureEl, {
        sidenavScrollContainer: "#scroll-element",
      });
      expect(scrollElement.style.maxHeight).toEqual("calc(100% - 0px)");
    });
  });

  describe("focus trap", () => {
    it("should toggle focus trap on hide/show", () => {
      const instance = new Sidenav(fixtureEl, {
        mode: "over",
      });
      instance._focusTrap.trap = jest.fn();
      instance._focusTrap.disable = jest.fn();
      instance._focusTrap.update = jest.fn();
      instance.show();
      expect(instance._focusTrap.trap).toHaveBeenCalled();
      instance.hide();
      expect(instance._focusTrap.disable).toHaveBeenCalled();
    });
    it("should update focus trap on collapse", () => {
      const instance = new Sidenav(fixtureEl, {
        mode: "over",
      });
      instance._focusTrap.update = jest.fn();
      collapse.dispatchEvent(new Event("shown.te.collapse"));
      expect(instance._focusTrap.update).toHaveBeenCalled();
      collapse.dispatchEvent(new Event("hidden.te.collapse"));
      expect(instance._focusTrap.update).toHaveBeenCalledTimes(2);
    });
    it("should toggle focus trap on mode change", () => {
      const instance = new Sidenav(fixtureEl, {
        sidenavMode: "side",
      });
      instance._focusTrap.trap = jest.fn();
      instance._focusTrap.disable = jest.fn();
      instance._focusTrap.update = jest.fn();
      instance.show();
      expect(instance._focusTrap.trap).not.toHaveBeenCalled();
      instance.changeMode("over");
      expect(instance._focusTrap.trap).toHaveBeenCalled();
      instance.changeMode("push");
      expect(instance._focusTrap.disable).toHaveBeenCalled();
    });
    it("should focus first item only on a tab key", () => {
      const instance = new Sidenav(fixtureEl);
      expect(instance._focusTrap._condition({ keyCode: ENTER })).toBe(false);
      expect(instance._focusTrap._condition({ keyCode: TAB })).toBe(true);
    });
  });

  describe("jQuery interface", () => {
    it("should register jQuery methods", () => {
      fixtureEl.setAttribute("data-te-sidenav-init", "");
      const mock = { ...jQueryMock };
      window.jQuery = mock;
      jest.resetModules();

      initTE({ Sidenav }, { allowReinits: true });
      jest.resetModules();
      expect(mock.fn.sidenav).toBeTruthy();
      expect(typeof mock.fn.sidenav.noConflict()).toBe("function");
    });
    it("should initialize a component with options", () => {
      jQueryMock.fn.sidenav = Sidenav.jQueryInterface;
      jQueryMock.elements = [fixtureEl];
      jQueryMock.fn.sidenav.call(jQueryMock, {
        mode: "test",
      });
      const instance = Sidenav.getInstance(fixtureEl);
      expect(instance.options.mode).toEqual("test");
    });
    it("should call public methods", () => {
      jQueryMock.fn.sidenav = Sidenav.jQueryInterface;
      jQueryMock.elements = [fixtureEl];
      jQueryMock.fn.sidenav.call(jQueryMock);
      const instance = Sidenav.getInstance(fixtureEl);
      instance.toggle = jest.fn();
      jQueryMock.fn.sidenav.call(jQueryMock, "toggle");
      expect(instance.toggle).toHaveBeenCalled();
      expect(() => jQueryMock.fn.sidenav.call(jQueryMock, "test")).toThrow();
      jQueryMock.fn.sidenav.call(jQueryMock, "dispose");
      expect(Sidenav.getInstance(fixtureEl)).toBe(null);
      expect(() =>
        jQueryMock.fn.sidenav.call(jQueryMock, "dispose")
      ).not.toThrow();
    });
  });

  describe("autoinit", () => {
    it("should initialize sidenav with data attribute", () => {
      const sidenav = document.createElement("div");
      sidenav.setAttribute("data-te-sidenav-init", "");
      body.appendChild(sidenav);
      jest.unmock("../../src/js/util/index");

      initTE({ Sidenav }, { allowReinits: true });
      const instance = Sidenav.getInstance(sidenav);
      expect(instance).toBeTruthy();
    });
  });
});
