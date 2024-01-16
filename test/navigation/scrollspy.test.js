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
import { getFixture, clearFixture } from "../mocks";
import ScrollSpy from "../../src/js/navigation/scrollspy";
import SelectorEngine from "../../src/js/dom/selector-engine";
// eslint-disable-next-line no-unused-vars
import initTE from "../../src/js/autoinit/index";

const NAME = "scrollspy";

describe("ScrollSpy", () => {
  let fixtureEl;

  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      width: 10,
      height: 10,
    };
  });

  const [body] = document.getElementsByTagName("body");

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `
    <div
      data-te-spy="scroll"
      data-te-target="#scrollspy"
      class="relative h-[50px] overflow-auto"
    >
      <section class="block h-[100px]" style="width:10px" id="one"></section>
      <section class="block h-[100px]" id="two"></section>
      <section class="block h-[100px]" id="three"></section>
      <section class="block h-[100px]" id="four"></section>
      <section class="block h-[100px]" id="five"></section>
    </div>

    <div id="scrollspy">
      <ul class="sticky-top pl-3 text-sm" data-te-nav-list-ref>
        <li class="py-1">
          <a
            data-te-nav-link-ref
            class="bg-transparent inline-block px-[5px] w-[10px] text-neutral-600 shadow-none dark:text-neutral-200 uncollapsed-column"
            href="#one" style="display:inline-block;width: 10px;"
            >One</a
          >
        </li>
        <li class="py-1">
          <a
            data-te-nav-link-ref
            class="bg-transparent px-[5px] text-neutral-600 shadow-none dark:text-neutral-200"
            href="#two"
            data-te-collapsible-scrollspy-ref
            >Two</a
          >
          <ul data-te-nav-list-ref class="pl-3 collapsed-column">
            <li class="py-1">
              <a
                data-te-nav-link-ref
                class="bg-transparent px-[5px] text-neutral-600 shadow-none dark:text-neutral-200"
                href="#three"
                >Three</a
              >
            </li>
          </ul>
        </li>

        <li class="py-1">
          <a
            data-te-nav-link-ref
            class="bg-transparent px-[5px] text-neutral-600 shadow-none dark:text-neutral-200"
            href="#four"
            data-te-collapsible-scrollspy-ref
            >Four</a
          >
          <ul class="nav flex-column ps-3">
            <li class="py-1">
              <a
                data-te-nav-link-ref
                class="bg-transparent px-[5px] text-neutral-600 shadow-none dark:text-neutral-200"
                href="#five"
                >Five</a
              >
            </li>
          </ul>
        </li>
      </ul>
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
    expect(ScrollSpy.NAME).toEqual(NAME);
  });

  it("should init an instance with JS", () => {
    const spyInstance = new ScrollSpy(fixtureEl);
    expect(spyInstance).not.toEqual(null);
  });

  it("should create an instance and destroy it on dispose()", () => {
    const scrollspy = new ScrollSpy(fixtureEl);
    const instance = ScrollSpy.getInstance(fixtureEl);
    expect(instance).not.toBe(null);
    scrollspy.dispose();
    expect(ScrollSpy.getInstance(fixtureEl)).toBe(null);
  });

  it("should add data-te-nav-link-active to one of the links", () => {
    new ScrollSpy(fixtureEl);

    const activeLink = SelectorEngine.findOne(
      "[data-te-nav-link-active]",
      fixtureEl
    );

    expect(activeLink).not.toBe(null);
  });

  it("should have height equal to 0 for collapsed list", () => {
    const scrollspy = new ScrollSpy(fixtureEl);
    const instance = ScrollSpy.getInstance(fixtureEl);
    const collapsedColumn = SelectorEngine.findOne(
      ".collapsed-column",
      fixtureEl
    );
    jest.runAllTimers();
    expect(collapsedColumn.style.height).toBe("0px");
    instance.dispose();
  });

  it("should not have 0px height for uncollapsed list", () => {
    const scrollspy = new ScrollSpy(fixtureEl);
    const instance = ScrollSpy.getInstance(fixtureEl);
    const uncollapsedColumn = SelectorEngine.findOne(
      ".uncollapsed-column",
      fixtureEl
    );
    jest.runAllTimers();

    expect(uncollapsedColumn.style.height).not.toBe("0px");
    instance.dispose();
  });

  describe("class customization", () => {
    const ACTIVE_CLASSLIST =
      "!text-primary font-semibold border-l-[0.125rem] border-solid border-primary";

    // Mock scrollHeight for document.body and document.documentElement
    Object.defineProperty(document.body, "scrollHeight", { value: 200 });

    it("should apply default active classes", () => {
      new ScrollSpy(fixtureEl);
      const activeLink = SelectorEngine.findOne(
        "[data-te-nav-link-active]",
        fixtureEl
      );

      expect(activeLink.className.includes(ACTIVE_CLASSLIST)).toBe(true);
    });
    it("should change active styles", () => {
      const ACTIVE_CLASSLIST_CUSTOM = "text-red-500";

      new ScrollSpy(
        fixtureEl,
        {},
        {
          active: ACTIVE_CLASSLIST_CUSTOM,
        }
      );
      const activeLink = SelectorEngine.findOne(
        "[data-te-nav-link-active]",
        fixtureEl
      );

      expect(activeLink.className.includes(ACTIVE_CLASSLIST)).toBe(false);
      expect(activeLink.className.includes(ACTIVE_CLASSLIST_CUSTOM)).toBe(true);
    });

    it("should change active styles with use of data attributes", () => {
      const ACTIVE_CLASSLIST_CUSTOM = "text-red-500";

      fixtureEl.setAttribute("data-te-class-active", ACTIVE_CLASSLIST_CUSTOM);

      new ScrollSpy(fixtureEl);
      const activeLink = SelectorEngine.findOne(
        "[data-te-nav-link-active]",
        fixtureEl
      );

      expect(activeLink.className.includes(ACTIVE_CLASSLIST)).toBe(false);
      expect(activeLink.className.includes(ACTIVE_CLASSLIST_CUSTOM)).toBe(true);
    });
  });

  describe("initTE", () => {
    it("should initialize with use of initTE method", () => {
      const target = SelectorEngine.findOne("[data-te-target]");

      expect(ScrollSpy.getInstance(target)).toEqual(null);

      initTE({ ScrollSpy });

      expect(ScrollSpy.getInstance(target)).not.toEqual(null);
    });
  });
});
