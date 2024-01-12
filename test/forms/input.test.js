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
import SelectorEngine from "../../src/js/dom/selector-engine";
import { clearFixture, getFixture, jQueryMock } from "../mocks";
import Input from "../../src/js/forms/input";
import Modal from "../../src/js/components/modal";
import Dropdown from "../../src/js/components/dropdown";
import Tab from "../../src/js/navigation/tab";
import initTE from "../../src/js/autoinit/index.js";

const SELECTOR_COUNTER = "[data-te-input-form-counter]";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Input", () => {
  let fixtureEl;

  beforeEach(() => {
    fixtureEl = getFixture();
    fixtureEl.innerHTML = `
    <div class="relative mb-3" data-te-input-wrapper-init>
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInput1"
        placeholder="Example label" />
      <label
        for="exampleFormControlInput1"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Example label
      </label>
    </div>`;
  });

  afterEach(() => {
    clearFixture();
  });

  it("should create a data instance and remove it on dispose", () => {
    let instance = new Input(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.dispose();
    instance = Input.getInstance(fixtureEl);

    expect(instance).toEqual(null);
  });

  it("should return correct name", () => {
    const instance = new Input(fixtureEl);

    const name = Input.NAME;
    expect(name).toEqual("input");

    instance.dispose();
  });

  it("should append outline border divs", () => {
    fixtureEl.innerHTML = `<input
      type="text"
      class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
      id="exampleFormControlInput1"
      placeholder="Example label" />
    <label
      for="exampleFormControlInput1"
      class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
      >Example label
    </label>`;

    const instance = new Input(fixtureEl);

    expect(fixtureEl.getElementsByTagName("div").length).toEqual(4);

    instance.dispose();
  });

  it("should toggle active class on value change", () => {
    fixtureEl.setAttribute("data-te-input-wrapper-init", "");
    fixtureEl.innerHTML = `<input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInput1"
        placeholder="Example label" />
      <label
        for="exampleFormControlInput1"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Example label
      </label>`;
    jest.resetModules();

    const initTE = require("../../src/js/autoinit/index.js").default;
    const Input = require("../../src/js/forms/input").default;

    initTE({ Input });

    const instance = Input.getInstance(fixtureEl);
    const input = fixtureEl.querySelector("input");
    const label = fixtureEl.querySelector("[data-te-input-notch-ref]");

    input.value = "Test";
    input.focus();

    expect(label.getAttribute("data-te-input-focused")).toBe("");

    input.value = "";
    input.blur();

    expect(label.getAttribute("data-te-input-focused")).not.toBe("");

    instance.dispose();
  });

  it("should work with input group", () => {
    fixtureEl.setAttribute("data-te-input-wrapper-init", "");
    fixtureEl.setAttribute("data-te-input-group-ref", "");
    fixtureEl.classList.add("items-stretch");
    fixtureEl.innerHTML = `
      <span
        class="flex items-center whitespace-nowrap rounded-l border border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
        id="basic-addon1"
        data-te-input-group-text-ref
        >@</span
      >
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        placeholder="Username"
        aria-label="Username"
        id="exampleFormControlInput"
        aria-describedby="basic-addon1" />
      <label
        for="exampleFormControlInput"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-700 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Example label
      </label>
    </div>`;

    const instance = new Input(fixtureEl);

    const input = fixtureEl.querySelector("input");
    const label = fixtureEl.querySelector("[data-te-input-notch-ref]");

    input.value = "Test";
    input.focus();

    expect(label.getAttribute("data-te-input-focused")).toBe("");

    input.value = "";
    input.blur();

    expect(label.getAttribute("data-te-input-focused")).not.toBe("");

    instance.dispose();
  });

  it("should not initiate twice", () => {
    let instance = new Input(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.init();

    expect(instance).not.toEqual(null);

    instance.dispose();
  });

  it("should update & force active on demand", () => {
    fixtureEl.setAttribute("data-te-input-wrapper-init", "");
    fixtureEl.innerHTML = `
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInput1"
        placeholder="Example label" />
      <label
        for="exampleFormControlInput1"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Example label
      </label>`;
    let instance = new Input(fixtureEl);

    expect(instance).not.toEqual(null);

    instance.update();
    instance.forceActive();

    const label = fixtureEl.querySelector("[data-te-input-notch-ref]");
    expect(label.getAttribute("data-te-input-state-active")).toBe("");

    instance.dispose();
  });

  it("should show placeholder if label is null", () => {
    fixtureEl.setAttribute("data-te-input-wrapper-init", "");
    fixtureEl.innerHTML = `
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInput1"
        placeholder="Example label" />`;
    let instance = new Input(fixtureEl);

    expect(
      instance.input.getAttribute("data-te-input-placeholder-active")
    ).toBe("");

    instance.dispose();
  });

  it("should update on modal shown", () => {
    jest.useFakeTimers();

    const modal = document.createElement("div");
    modal.setAttribute("data-te-modal-init", "");
    modal.innerHTML = `
    <div
      class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div
        data-te-modal-dialog-ref
        class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
        <div
          class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
          <div
            class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
            <!--Modal title-->
            <h5
              class="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
              id="exampleModalLabel">
              Modal title
            </h5>
            <!--Close button-->
            <button
              type="button"
              class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
              data-te-modal-dismiss
              aria-label="Close">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
    
          <!--Modal body-->
          <div class="relative flex-auto p-4" data-te-modal-body-ref>
            <div class="relative mb-3" data-te-input-wrapper-init>
              <input
                type="text"
                class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlInput1"
                placeholder="Example label" />
              <label
                for="exampleFormControlInput1"
                class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >Example label
              </label>
            </div>

            <div class="relative mb-3" data-te-input-wrapper-init>
              <textarea
                class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="exampleFormControlTextarea1"
                rows="3"
                placeholder="Your message"></textarea>
              <label
                for="exampleFormControlTextarea1"
                class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >Example textarea</label
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    document.body.appendChild(modal);

    const inputInstance = new Input(
      modal.querySelectorAll("[data-te-input-wrapper-init]")[0]
    );
    const textareaInstance = new Input(
      modal.querySelectorAll("[data-te-input-wrapper-init]")[1]
    );
    const inputUpdate = jest.spyOn(inputInstance, "update");
    const textareaUpdate = jest.spyOn(textareaInstance, "update");

    const modalInstance = new Modal(modal);
    modalInstance.show();

    jest.runAllTimers();

    expect(inputUpdate).toHaveBeenCalled();
    expect(textareaUpdate).toHaveBeenCalled();

    inputInstance.dispose();
    textareaInstance.dispose();

    modalInstance.hide();
    modalInstance.show();

    jest.runAllTimers();

    expect(inputUpdate).toHaveBeenCalled();
    expect(textareaUpdate).toHaveBeenCalled();

    modalInstance.dispose();
  });

  it("should update on dropdown shown", () => {
    jest.useFakeTimers();

    const dropdown = document.createElement("div");
    dropdown.innerHTML = `
    <div class="relative" data-te-dropdown-ref>
        <button
          class="flex items-center whitespace-nowrap rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          type="button"
          id="dropdownMenuButton1"
          data-te-dropdown-toggle-ref
          aria-expanded="false"
          data-te-ripple-init
          data-te-ripple-color="light">
          Dropdown button
          <span class="ml-2 w-2">
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
        </button>
        <ul
          class="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
          aria-labelledby="dropdownMenuButton1"
          data-te-dropdown-menu-ref>
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
              href="#"
              data-te-dropdown-item-ref
              >
                <div class="relative mb-3" data-te-input-wrapper-init>
                  <input
                    type="text"
                    class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleFormControlInput1"
                    placeholder="Example label" />
                  <label
                    for="exampleFormControlInput1"
                    class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Example label
                  </label>
                </div>
              </a>
          </li>
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
              href="#"
              data-te-dropdown-item-ref
              >
                <div class="relative mb-3" data-te-input-wrapper-init>
                  <textarea
                    class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Your message"></textarea>
                  <label
                    for="exampleFormControlTextarea1"
                    class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                    >Example textarea</label
                  >
                </div>
              </a>
          </li>
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
              href="#"
              data-te-dropdown-item-ref
              >Something else here</a
            >
          </li>
        </ul>
      </div>
    `;

    document.body.appendChild(dropdown);

    const inputInstance = new Input(
      dropdown.querySelectorAll("[data-te-input-wrapper-init]")[0]
    );
    const textareaInstance = new Input(
      dropdown.querySelectorAll("[data-te-input-wrapper-init]")[1]
    );
    const inputUpdate = jest.spyOn(inputInstance, "update");
    const textareaUpdate = jest.spyOn(textareaInstance, "update");
    const dropdownInstance = new Dropdown(
      dropdown.querySelector("[data-te-dropdown-toggle-ref]")
    );

    dropdownInstance._menu.animate = jest.fn();
    dropdownInstance.show();

    jest.runAllTimers();

    expect(inputUpdate).toHaveBeenCalled();
    expect(textareaUpdate).toHaveBeenCalled();

    inputInstance.dispose();
    textareaInstance.dispose();

    dropdownInstance.hide();
    dropdownInstance.show();

    jest.runAllTimers();

    expect(inputUpdate).toHaveBeenCalled();
    expect(textareaUpdate).toHaveBeenCalled();

    dropdownInstance.dispose();
  });

  it("should update on tab shown", () => {
    jest.useFakeTimers();

    const tabs = document.createElement("div");

    tabs.innerHTML = `
    <ul
      class="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
      role="tablist"
      data-te-nav-ref>
      <li role="presentation">
        <a
          href="#tabs-home"
          class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
          data-te-toggle="pill"
          data-te-target="#tabs-home"
          data-te-nav-active
          role="tab"
          aria-controls="tabs-home"
          aria-selected="true"
          >Home</a
        >
      </li>
      <li role="presentation">
        <a
          href="#tabs-profile"
          class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
          data-te-toggle="pill"
          data-te-target="#tabs-profile"
          role="tab"
          aria-controls="tabs-profile"
          aria-selected="false"
          >Profile</a
        >
      </li>
      <li role="presentation">
        <a
          href="#tabs-messages"
          class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
          data-te-toggle="pill"
          data-te-target="#tabs-messages"
          role="tab"
          aria-controls="tabs-messages"
          aria-selected="false"
          >Messages</a
        >
      </li>
    </ul>

    <!--Tabs content-->
    <div class="mb-6">
      <div
        class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        id="tabs-home"
        role="tabpanel"
        aria-labelledby="tabs-home-tab"
        data-te-tab-active>
        Tab 1 content
      </div>
      <div
        class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        id="tabs-profile"
        role="tabpanel"
        aria-labelledby="tabs-profile-tab">
          <div class="relative mb-3" data-te-input-wrapper-init>
            <input
              type="text"
              class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
              id="exampleFormControlInput1"
              placeholder="Example label" />
            <label
              for="exampleFormControlInput1"
              class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
              >Example label
            </label>
          </div>

          <div class="relative mb-3" data-te-input-wrapper-init>
          <textarea
            class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Your message"></textarea>
          <label
            for="exampleFormControlTextarea1"
            class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
            >Example textarea</label
          >
        </div>
      </div>
      <div
        class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
        id="tabs-messages"
        role="tabpanel"
        aria-labelledby="tabs-profile-tab">
        Tab 3 content
      </div>
    </div>    `;

    document.body.appendChild(tabs);

    const inputInstance = new Input(
      tabs.querySelectorAll("[data-te-input-wrapper-init]")[0]
    );
    const textareaInstance = new Input(
      tabs.querySelectorAll("[data-te-input-wrapper-init]")[1]
    );
    const inputUpdate = jest.spyOn(inputInstance, "update");
    const textareaUpdate = jest.spyOn(textareaInstance, "update");

    let tabInstance = new Tab(tabs.querySelectorAll("[data-te-nav-ref] a")[1]);
    tabInstance.show();

    jest.runAllTimers();

    expect(inputUpdate).toHaveBeenCalled();
    expect(textareaUpdate).toHaveBeenCalled();

    tabInstance.dispose();
    inputInstance.dispose();
    textareaInstance.dispose();

    tabInstance = new Tab(tabs.querySelectorAll("[data-te-nav-ref] a")[0]);
    tabInstance.show();
    jest.runAllTimers();

    tabInstance.dispose();
    tabInstance = new Tab(tabs.querySelectorAll("[data-te-nav-ref] a")[1]);
    tabInstance.show();

    jest.runAllTimers();

    expect(inputUpdate).toHaveBeenCalled();
    expect(textareaUpdate).toHaveBeenCalled();

    tabInstance.dispose();
  });

  it("should activate on auto-fill", () => {
    fixtureEl.innerHTML =
      '<input type="email" id="form1" class="form-control" autocomplete="email" required />';

    document.body.append(fixtureEl);

    const instance = new Input(fixtureEl);

    expect(instance).not.toBe(null);

    instance.dispose();
  });

  it("should init input with counter", () => {
    const maxLength = 20;

    fixtureEl.innerHTML = `
    <div class="relative mb-3" data-te-input-wrapper-init>
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInputCounter"
        placeholder="Example label"
        data-te-input-showcounter="true"
        maxlength="${maxLength}" />
      <label
        for="exampleFormControlInputCounter"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Example label
      </label>
      <div
        class="absolute w-full text-sm text-neutral-500 peer-focus:text-primary dark:text-neutral-200 dark:peer-focus:text-primary"
        data-te-input-helper-ref></div>
    </div>`;

    const instance = new Input(fixtureEl);
    const counter = SelectorEngine.findOne(SELECTOR_COUNTER);
    const counterContent = counter.innerHTML;

    expect(counter).toBeDefined();
    expect(counterContent).toBe(`0 / ${maxLength}`);

    instance.dispose();
  });

  it("should change counter content on input change", () => {
    const maxLength = 20;
    const exampleValue = "Example value";

    fixtureEl.setAttribute("data-te-input-wrapper-init", "");
    fixtureEl.innerHTML = `
      <input
        type="text"
        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="exampleFormControlInputCounter"
        placeholder="Example label"
        data-te-input-showcounter="true"
        maxlength="${maxLength}" />
      <label
        for="exampleFormControlInputCounter"
        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
        >Example label
      </label>
      <div
        class="absolute w-full text-sm text-neutral-500 peer-focus:text-primary dark:text-neutral-200 dark:peer-focus:text-primary"
        data-te-input-helper-ref></div>`;

    const instance = new Input(fixtureEl);

    instance.input.value = exampleValue;
    instance.input.dispatchEvent(new KeyboardEvent("input"));
    const inputLength = instance.input.value.length;

    const counter = SelectorEngine.findOne(SELECTOR_COUNTER);
    const counterContent = counter.innerHTML;

    expect(counterContent).toBe(`${inputLength} / ${maxLength}`);

    instance.dispose();
  });

  describe("class customization", () => {
    it("should sets custom classes via JavaScript", () => {
      const instance = new Input(
        fixtureEl,
        {},
        {
          notchLeadingNormal: "text-green-100",
        }
      );
      const notchLeading = fixtureEl.querySelector(
        "[data-te-input-notch-leading-ref]"
      );

      expect(notchLeading.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
    });

    it("should sets custom classes via data attributes", () => {
      fixtureEl.innerHTML = `
      <div class="relative mb-3" data-te-input-wrapper-init>
        <input
          type="text"
          class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
          id="exampleFormControlInput1"
          placeholder="Example label" />
        <label
          for="exampleFormControlInput1"
          class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
          >Example label
        </label>
      </div>`;
      fixtureEl.setAttribute(
        "data-te-class-notch-leading-normal",
        "text-green-100"
      );

      const instance = new Input(fixtureEl);
      const notchLeading = fixtureEl.querySelector(
        "[data-te-input-notch-leading-ref]"
      );

      expect(notchLeading.classList.contains("text-green-100")).toBe(true);
      instance.dispose();
    });
  });

  describe("initTE", () => {
    it("should auto-init", () => {
      initTE({ Input });

      const instance = Input.getInstance(fixtureEl);

      expect(instance).toBeTruthy();

      instance.dispose();
    });
  });

  describe("jQueryInterface", () => {
    it("should init using jQuery", () => {
      jQueryMock.fn.input = Input.jQueryInterface;
      jQueryMock.elements = [fixtureEl];

      jQueryMock.fn.input.call(jQueryMock);

      const instance = Input.getInstance(fixtureEl);

      expect(instance).not.toEqual(null);

      instance.dispose();
    });

    it("should call public methods", () => {
      jQueryMock.fn.init = Input.jQueryInterface;
      jQueryMock.elements = [fixtureEl];

      jQueryMock.fn.init.call(jQueryMock, { type: "test" });

      const instance = Input.getInstance(fixtureEl);

      instance.update = jest.fn();

      jQueryMock.fn.init.call(jQueryMock, "update");

      expect(instance.update).toHaveBeenCalled();

      expect(() => jQueryMock.fn.init.call(jQueryMock, "test")).toThrow();

      jQueryMock.fn.init.call(jQueryMock, "dispose");

      expect(Input.getInstance(fixtureEl)).toBe(null);

      expect(() =>
        jQueryMock.fn.init.call(jQueryMock, "dispose")
      ).not.toThrow();
    });
  });
});
