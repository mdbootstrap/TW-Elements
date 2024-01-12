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
import SelectorEngine from "../../src/js/dom/selector-engine";
import {
  DOWN_ARROW,
  UP_ARROW,
  LEFT_ARROW,
  HOME,
  END,
  ENTER,
  TAB,
} from "../../src/js/util/keycodes";
import initTE from "../../src/js/autoinit/index.js";
import Autocomplete from "../../src/js/forms/autocomplete";
import Input from "../../src/js/forms/input";

const SELECTOR_DROPDOWN_CONTAINER = "[data-te-autocomplete-dropdown-ref]";
const SELECTOR_ITEM = "[data-te-autocomplete-item-ref]";
const SELECTOR_NO_RESULTS = "[data-te-autocomplete-message-ref]";

describe("Autocomplete", () => {
  let fixtureEl;
  let input;
  const autocompleteTemplate = `
  <div class="relative" data-te-input-wrapper-init id="basic">
    <input
      type="text"
      class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear placeholder:opacity-0 focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
      id="exampleFormControlInput1" />
    <label
      for="exampleFormControlInput1"
      class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[80%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-focused]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-focused]:scale-[0.8] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
      >Example label
    </label>
  </div>
  `;

  const data = ["One", "Two", "Three", "Four", "Five"];
  const basicFilter = (value) => {
    return data.filter((item) => {
      return item.toLowerCase().startsWith(value.toLowerCase());
    });
  };

  const complexData = [
    { title: "One", subtitle: "Secondary text" },
    { title: "Two", subtitle: "Secondary text" },
    { title: "Three", subtitle: "Secondary text" },
    { title: "Four", subtitle: "Secondary text" },
    { title: "Five", subtitle: "Secondary text" },
    { title: "Six", subtitle: "Secondary text" },
  ];

  const customContentTemplate = `
    <div data-te-autocomplete-custom-content-ref class="autocomplete-custom-content"></div>
  `;

  const complexFilter = (query) => {
    return complexData.filter((item) => {
      return item.title.toLowerCase().startsWith(query.toLowerCase());
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    fixtureEl = getFixture();
    fixtureEl.innerHTML = autocompleteTemplate;
    fixtureEl.setAttribute("data-te-input-wrapper-init", "");
    input = SelectorEngine.findOne("input", fixtureEl);
  });

  afterEach(() => clearFixture());

  it("should return the component name", () => {
    const name = Autocomplete.NAME;
    expect(name).toEqual("autocomplete");
  });

  it("should create an instance and destroy it on dispose()", () => {
    const autocomplete = new Autocomplete(fixtureEl);

    const instance = Autocomplete.getInstance(fixtureEl);

    expect(instance).not.toBe(null);

    autocomplete.dispose();

    expect(Autocomplete.getInstance(autocomplete)).toBe(null);
  });

  describe("options", () => {
    it("should initialize with default options", () => {
      const autocomplete = new Autocomplete(fixtureEl);
      const instance = Autocomplete.getInstance(fixtureEl);

      const options = {
        customContent: "",
        debounce: 300,
        displayValue: (value) => value,
        filter: null,
        itemContent: null,
        listHeight: 190,
        noResults: "No results found",
        threshold: 0,
      };

      Object.keys(options).forEach((option) => {
        if (option === "displayValue") {
          expect(instance._options[option]("test")).toBe("test");
        } else {
          expect(instance._options[option]).toBe(options[option]);
        }
      });
      autocomplete.dispose();
    });

    it("should initialize with options (JS)", () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        debounce: 500,
        threshold: 2,
      });
      const instance = Autocomplete.getInstance(fixtureEl);

      expect(instance._options.debounce).toEqual(500);
      expect(instance._options.threshold).toEqual(2);
      autocomplete.dispose();
    });

    it("should initialize with options (data attributes)", () => {
      fixtureEl.setAttribute("data-te-debounce", 700);
      fixtureEl.setAttribute("data-te-threshold", 3);

      const autocomplete = new Autocomplete(fixtureEl);
      const instance = Autocomplete.getInstance(fixtureEl);

      expect(instance._options.debounce).toBe(700);
      expect(instance._options.threshold).toEqual(3);

      fixtureEl.removeAttribute("data-te-debounce");
      fixtureEl.removeAttribute("data-te-threshold");
      autocomplete.dispose();
    });
  });

  describe("Opening and closing", () => {
    it("should open on input focus if the threshold condition is met", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });
      input.focus();

      jest.runAllTimers();

      const dropdownContainer = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_CONTAINER
      );
      expect(dropdownContainer).toBeDefined();
      autocomplete.dispose();
    });

    it("should not open the dropdown if the threshold condition is not met", () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        filter: basicFilter,
        threshold: 2,
      });

      input.focus();

      const dropdownContainer = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_CONTAINER
      );
      expect(dropdownContainer).toBe(null);
      autocomplete.dispose();
    });

    it("should close the dropdown when the result item is clicked", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });
      const close = spyOn(autocomplete, "close");

      input.focus();
      jest.runOnlyPendingTimers();

      const menu = SelectorEngine.findOne(
        "[data-te-autocomplete-items-list-ref]"
      );
      const firstItem = menu.querySelector(SELECTOR_ITEM);
      firstItem.click();

      jest.runAllTimers();

      expect(close).toHaveBeenCalledTimes(1);
      autocomplete.dispose();
    });

    it("should close on click outside dropdown and input", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });
      const close = jest.spyOn(autocomplete, "close");

      input.focus();

      jest.runOnlyPendingTimers();

      document.dispatchEvent(
        new MouseEvent("click", { screenX: 1, screenY: 1 })
      );

      jest.runOnlyPendingTimers();

      expect(close).toHaveBeenCalledTimes(1);
      autocomplete.dispose();
    });

    it("should open the dropdown if the open method is called", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      autocomplete.open();
      jest.runAllTimers();

      const dropdownContainer = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_CONTAINER
      );

      expect(window.getComputedStyle(dropdownContainer).height).not.toBe("0px");
      expect(dropdownContainer.querySelectorAll(SELECTOR_ITEM).length).toBe(5);
      autocomplete.dispose();
    });
  });

  describe("Custom templates", () => {
    it("should correctly render custom item template", () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        filter: complexFilter,
        displayValue: (value) => value.title,
        itemContent: (result) => {
          return `
              <div class="autocomplete-custom-item-content">
                <div class="autocomplete-custom-item-title">${result.title}</div>
                <div class="autocomplete-custom-item-subtitle">${result.subtitle}</div>
              </div>
            `;
        },
      });

      input.focus();
      jest.runAllTimers();

      const dropdownContainer = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_CONTAINER
      );
      const firstItem = SelectorEngine.findOne(
        SELECTOR_ITEM,
        dropdownContainer
      );
      const customTitle = SelectorEngine.findOne(
        ".autocomplete-custom-item-title",
        firstItem
      );
      const customSubtitle = SelectorEngine.findOne(
        ".autocomplete-custom-item-subtitle",
        firstItem
      );

      expect(customTitle).toBeDefined();
      expect(customSubtitle).toBeDefined();
      expect(customTitle.textContent).toEqual("One");
      expect(customSubtitle.textContent).toEqual("Secondary text");
      autocomplete.dispose();
    });

    it("should correctly render custom item template", () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        filter: basicFilter,
        customContent: customContentTemplate,
      });

      input.focus();
      jest.runAllTimers();

      const customContent = SelectorEngine.findOne(
        "[data-te-autocomplete-custom-content-ref]"
      );

      expect(customContent).toBeDefined();
      autocomplete.dispose();
    });
  });

  describe("Results filtering", () => {
    it("should update results list when input value changes", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });
      const input = fixtureEl.querySelector("input");
      let items;

      input.focus();
      jest.runAllTimers();

      const dropdownContainer = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_CONTAINER
      );

      items = SelectorEngine.find(SELECTOR_ITEM, dropdownContainer);
      expect(items.length).toEqual(5);

      input.value = "One";
      input.dispatchEvent(new Event("input"));
      jest.runAllTimers();

      items = SelectorEngine.find(SELECTOR_ITEM, dropdownContainer);
      expect(items.length).toEqual(1);

      input.value = "T";
      input.dispatchEvent(new Event("input"));
      jest.runAllTimers();

      items = SelectorEngine.find(SELECTOR_ITEM, dropdownContainer);
      expect(items.length).toEqual(2);
      autocomplete.dispose();
    });

    it("should display no results message if results list is empty", () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        filter: basicFilter,
        debounce: 0,
      });

      input.focus();
      jest.runAllTimers();

      input.value = "Test input";
      input.dispatchEvent(new Event("input"));
      jest.runAllTimers();

      const noResultsElement = SelectorEngine.findOne(SELECTOR_NO_RESULTS);

      expect(noResultsElement).toBeDefined();
      autocomplete.dispose();
    });

    it("should reset active item when result list change", () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        filter: basicFilter,
        debounce: 0,
      });
      let items;

      input.focus();
      jest.runAllTimers();

      items = SelectorEngine.find(SELECTOR_ITEM);
      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );

      expect(items[0].getAttribute("data-te-autocomplete-item-active")).toBe(
        ""
      );

      input.value = "T";
      input.dispatchEvent(new Event("input"));
      jest.runAllTimers();

      items = SelectorEngine.find(SELECTOR_ITEM);

      expect(
        items[0].getAttribute("data-te-autocomplete-item-active")
      ).not.toBe("");
      expect(autocomplete._activeItemIndex).toEqual(-1);
      autocomplete.dispose();
    });
  });

  describe("Keydown navigation for opened dropdown", () => {
    it("should highlight next option on down arrow click", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runAllTimers();

      const items = SelectorEngine.find(SELECTOR_ITEM);

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );

      expect(items[0].getAttribute("data-te-autocomplete-item-active")).toBe(
        ""
      );

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );

      expect(
        items[0].getAttribute("data-te-autocomplete-item-active")
      ).not.toBe("");
      expect(items[2].getAttribute("data-te-autocomplete-item-active")).toBe(
        ""
      );
      autocomplete.dispose();
    });

    it("should highlight previous option on up arrow click", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runAllTimers();

      const items = SelectorEngine.find(SELECTOR_ITEM);

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );

      expect(items[1].getAttribute("data-te-autocomplete-item-active")).toBe(
        ""
      );
      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: UP_ARROW })
      );

      expect(
        items[1].getAttribute("data-te-autocomplete-item-active")
      ).not.toBe("");
      expect(items[0].getAttribute("data-te-autocomplete-item-active")).toBe(
        ""
      );
      autocomplete.dispose();
    });

    it("should highlight first option on home click or move caret", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runAllTimers();

      const items = SelectorEngine.find(SELECTOR_ITEM);

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(new KeyboardEvent("keydown", { keyCode: HOME }));

      // select first item if user moved to dropdown with arrows
      expect(items[0].getAttribute("data-te-autocomplete-item-active")).toBe(
        ""
      );

      input.value = "Two";
      input.dispatchEvent(new Event("input"));

      jest.runAllTimers();

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: LEFT_ARROW })
      );
      fixtureEl.dispatchEvent(new KeyboardEvent("keydown", { keyCode: HOME }));

      // move caret to start of input if user wrote or deleted something
      expect(input.selectionStart).toBe(0);
      autocomplete.dispose();
    });

    it("should highlight last option on end click or move caret", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runAllTimers();

      const items = SelectorEngine.find(SELECTOR_ITEM);
      const lastItemIndex = items.length - 1;

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(new KeyboardEvent("keydown", { keyCode: END }));

      // select last item if user moved to dropdown with arrows
      expect(items[lastItemIndex].className).toContain("active");

      input.value = "Two";
      input.dispatchEvent(new Event("input"));

      jest.runAllTimers();

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: LEFT_ARROW })
      );
      fixtureEl.dispatchEvent(new KeyboardEvent("keydown", { keyCode: END }));

      // move caret to the end of input if user wrote or deleted something
      expect(input.selectionStart).toBe(3);

      autocomplete.dispose();
    });

    it("should select active option on enter click", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runAllTimers();

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(new KeyboardEvent("keydown", { keyCode: ENTER }));

      jest.runAllTimers();

      expect(input.value).toBe("One");
      autocomplete.dispose();
    });

    it("should select active option on tab in auto select mode", () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        filter: basicFilter,
        autoSelect: true,
      });

      input.focus();
      jest.runAllTimers();

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(new KeyboardEvent("keydown", { keyCode: TAB }));

      jest.runAllTimers();

      expect(input.value).toBe("Two");
      autocomplete.dispose();
    });

    it('should disable selecting result when "no results found', () => {
      const autocomplete = new Autocomplete(fixtureEl, {
        filter: basicFilter,
        debounce: 0,
      });

      input.focus();
      jest.runAllTimers();

      input.value = "Test input";
      input.dispatchEvent(new Event("input"));

      jest.runAllTimers();

      const noResultsElement = SelectorEngine.find(SELECTOR_NO_RESULTS);

      expect(noResultsElement).toBeDefined();

      fixtureEl.dispatchEvent(
        new KeyboardEvent("keydown", { keyCode: DOWN_ARROW })
      );
      fixtureEl.dispatchEvent(new KeyboardEvent("keydown", { keyCode: ENTER }));

      jest.runAllTimers();

      expect(input.value).not.toBe("undefined");
      autocomplete.dispose();
    });

    it("should append autocomplete to custom container", () => {
      const customContainer = document.createElement("div");
      customContainer.classList.add("custom-container");
      document.body.appendChild(customContainer);

      const autocomplete = new Autocomplete(fixtureEl, {
        filter: basicFilter,
        container: ".custom-container",
      });

      input.focus();
      expect(
        customContainer.querySelectorAll(SELECTOR_DROPDOWN_CONTAINER).length
      ).toEqual(1);
      jest.runAllTimers();

      customContainer.remove();
      autocomplete.dispose();
    });
  });

  describe("input and label styles", () => {
    it("should add active attributes to input after dropdown is opened", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runAllTimers();

      expect(input.getAttribute("data-te-input-focused")).toBe("");
      expect(input.getAttribute("data-te-input-state-active")).toBe("");

      autocomplete.dispose();
    });

    it("should remove active attributes from label and input after dropdown is closed", () => {
      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runAllTimers();

      autocomplete.close();
      jest.runAllTimers();

      expect(input.getAttribute("data-te-input-focused")).not.toBe("");
      expect(input.getAttribute("data-te-input-state-active")).not.toBe("");
      autocomplete.dispose();
    });
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const autocomplete = new Autocomplete(
        fixtureEl,
        { filter: basicFilter },
        { autocompleteItem: "text-green-100" }
      );

      input.focus();
      jest.runOnlyPendingTimers();

      const dropdownContainer = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_CONTAINER
      );
      const firstItem = dropdownContainer.querySelector(SELECTOR_ITEM);

      expect(firstItem.classList.contains("text-green-100")).toBe(true);

      autocomplete.dispose();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.setAttribute(
        "data-te-class-autocomplete-item",
        "text-green-100"
      );

      const autocomplete = new Autocomplete(fixtureEl, { filter: basicFilter });

      input.focus();
      jest.runOnlyPendingTimers();

      const dropdownContainer = SelectorEngine.findOne(
        SELECTOR_DROPDOWN_CONTAINER
      );
      const firstItem = dropdownContainer.querySelector(SELECTOR_ITEM);

      expect(firstItem.classList.contains("text-green-100")).toBe(true);

      autocomplete.dispose();
    });
  });

  describe("initTE", () => {
    it("should auto-init", () => {
      initTE({ Input }, { allowReinits: true });

      new Autocomplete(fixtureEl, {
        filter: basicFilter,
      });

      const instance = Autocomplete.getInstance(fixtureEl);
      expect(instance).toBeTruthy();
    });
  });
});
