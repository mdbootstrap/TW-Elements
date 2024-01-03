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
// eslint-disable-next-line no-unused-vars
import { getFixture, clearFixture, jQueryMock } from "../mocks";
import Tab from "../../src/js/navigation/tab";
import SelectorEngine from "../../src/js/dom/selector-engine";
// eslint-disable-next-line no-unused-vars
import initTE from "../../src/js/autoinit/index";

const NAME = "tab";

describe("Tab", () => {
  let fixtureEl;

  const [body] = document.getElementsByTagName("body");

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `
    <ul
      class="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
      role="tablist"
      id="myTab"
      data-te-nav-ref
    >
      <li role="presentation">
        <a
          href="#tabs-home"
          class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
          data-te-toggle="pill"
          data-te-target="#tabs-1"
          data-te-nav-active
          role="tab"
          aria-controls="tabs-home"
          aria-selected="true"
          >Tab1</a
        >
      </li>
      <li role="presentation">
        <a
          href="#tabs-profile"
          class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
          data-te-toggle="pill"
          data-te-target="#tabs-2"
          role="tab"
          aria-controls="tabs-profile"
          aria-selected="false"
          >Tab2</a
        >
      </li>
    
      <li role="presentation">
        <a
          href="#tabs-contact"
          class="disabled pointer-events-none my-2 block border-x-0 border-b-2 border-t-0 border-transparent bg-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-400 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent dark:text-neutral-600"
          style="pointer-events: none;"
          data-te-toggle="pill"
          data-te-target="#tabs-3"
          role="tab"
          aria-controls="tabs-contact"
          aria-selected="false"
          >Tab3 Disabled</a
        >
      </li>
    </ul>

    <!--Tabs content-->
    <div class="mb-6" id="tab-content">
      <div
        class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        id="tabs-1"
        role="tabpanel"
        aria-labelledby="tabs-home-tab"
        data-te-tab-active
      >
        Tab 1 content
      </div>
      <div
        class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        id="tabs-2"
        role="tabpanel"
        aria-labelledby="tabs-profile-tab"
      >
        Tab 2 content
      </div>
      <div
        class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        id="tabs-3"
        role="tabpanel"
        aria-labelledby="tabs-profile-tab"
      >
        Tab 3 content
      </div>
    </div>
    `;

    body.appendChild(fixtureEl);
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    clearFixture();
    jest.clearAllMocks();

    body.innerHTML = "";
  });

  it("should return component name", () => {
    expect(Tab.NAME).toEqual(NAME);
  });

  it("should init an instance with JS", () => {
    const firstTab = SelectorEngine.findOne("#myTab a", fixtureEl);

    const instance = new Tab(firstTab);

    expect(Tab.getInstance(firstTab)).toEqual(instance);
  });

  it("should create an instance and destroy it on dispose()", () => {
    const firstTab = SelectorEngine.findOne("#myTab a", fixtureEl);

    const tab = new Tab(firstTab);
    const instance = Tab.getInstance(firstTab);

    expect(instance).not.toBe(null);

    tab.dispose();
    expect(Tab.getInstance(firstTab)).toBe(null);
  });

  it("should change the active tab after click on navigation elements", () => {
    jest.useFakeTimers();

    const eventListenerHandler = (event, tabTrigger) => {
      // Ignore the event if the element has pointer-events: none
      if (getComputedStyle(event.target).pointerEvents === "none") {
        return;
      }
      event.preventDefault();
      tabTrigger.show();
    };

    const triggerTabList = [].slice.call(document.querySelectorAll("#myTab a"));

    triggerTabList.forEach((triggerEl) => {
      const tabTrigger = new Tab(triggerEl);

      triggerEl.addEventListener("click", (event) =>
        eventListenerHandler(event, tabTrigger)
      );
    });

    // first element is active at the beginning
    expect(
      SelectorEngine.findOne(
        "#tab-content [data-te-tab-active]",
        fixtureEl
      ).innerHTML.trim()
    ).toBe("Tab 1 content");

    // click on second element
    triggerTabList[1].dispatchEvent(new Event("click"));

    jest.advanceTimersByTime(500);

    expect(
      SelectorEngine.findOne(
        "#tab-content [data-te-tab-active]",
        fixtureEl
      ).innerHTML.trim()
    ).toBe("Tab 2 content");

    // click on third element
    triggerTabList[2].dispatchEvent(new Event("click"));

    jest.advanceTimersByTime(500);

    expect(triggerTabList[2].classList.contains("pointer-events-none")).toBe(
      true
    );

    expect(
      SelectorEngine.findOne(
        "#tab-content [data-te-tab-active]",
        fixtureEl
      ).innerHTML.trim()
    ).toBe("Tab 2 content"); // the third element is diasbled and has pointer-events property set to none
  });

  describe("class customization", () => {
    const SHOW_CLASSLIST = "opacity-100";
    const HIDE_CLASSLIST = "opacity-0";

    it("should apply default active classes", () => {
      jest.useFakeTimers();
      const firstTab = SelectorEngine.find("#myTab a", fixtureEl);
      const instance = new Tab(firstTab[0]);
      const instance2 = new Tab(firstTab[1]);

      const firstTabContent = SelectorEngine.findOne("#tabs-1", fixtureEl);

      expect(firstTabContent.className.includes(SHOW_CLASSLIST)).toBe(true);
      expect(firstTabContent.className.includes(HIDE_CLASSLIST)).toBe(false);

      instance2.show();

      jest.advanceTimersByTime(500);

      expect(instance._element.hasAttribute("data-te-nav-active")).toBe(false);

      expect(firstTabContent.className.includes(SHOW_CLASSLIST)).toBe(false);
      expect(firstTabContent.className.includes(HIDE_CLASSLIST)).toBe(true);
    });

    it("should change active styles", () => {
      const HIDE_CLASSLIST_CUSTOM = "opacity-0 text-red-500";

      jest.useFakeTimers();

      const tabs = SelectorEngine.find("#myTab a", fixtureEl);
      const instance = new Tab(tabs[0], {
        hide: HIDE_CLASSLIST_CUSTOM,
      });
      const instance2 = new Tab(tabs[1], {
        hide: HIDE_CLASSLIST_CUSTOM,
      });

      const firstTabContent = SelectorEngine.findOne("#tabs-1", fixtureEl);

      instance2.show();
      jest.advanceTimersByTime(500);

      expect(instance._element.hasAttribute("data-te-nav-active")).toBe(false);
      expect(firstTabContent.className.includes(HIDE_CLASSLIST_CUSTOM)).toBe(
        true
      );
    });

    it("should change active styles with use of data attributes", () => {
      const HIDE_CLASSLIST_CUSTOM = "opacity-0 text-red-500";

      jest.useFakeTimers();

      const tabs = SelectorEngine.find("#myTab a", fixtureEl);
      tabs[0].setAttribute("data-te-class-hide", HIDE_CLASSLIST_CUSTOM);
      tabs[1].setAttribute("data-te-class-hide", HIDE_CLASSLIST_CUSTOM);

      const instance = new Tab(tabs[0]);
      const instance2 = new Tab(tabs[1]);

      const firstTabContent = SelectorEngine.findOne("#tabs-1", fixtureEl);

      instance2.show();
      jest.advanceTimersByTime(500);

      expect(instance._element.hasAttribute("data-te-nav-active")).toBe(false);
      expect(firstTabContent.className.includes(HIDE_CLASSLIST_CUSTOM)).toBe(
        true
      );
    });
  });

  describe("jQuery interface", () => {
    it("should register jQuery methods", () => {
      const mock = { ...jQueryMock };
      window.jQuery = mock;
      jest.resetModules();

      initTE({ Tab });
      jest.resetModules();
      expect(mock.fn.tab).toBeTruthy();
      expect(typeof mock.fn.tab.noConflict()).toBe("function");
    });
  });

  describe("initTE", () => {
    it("should initialize with use of initTE method", () => {
      const firstTab = SelectorEngine.findOne("#myTab a", fixtureEl);

      expect(Tab.getInstance(firstTab)).toEqual(null);

      initTE({ Tab }, { allowReinits: true });

      firstTab.dispatchEvent(new Event("click"));

      expect(Tab.getInstance(firstTab)).not.toEqual(null);
    });
  });
});
