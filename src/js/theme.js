/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { switcherTemplate } from "./templates/themeSwitcher";

class ThemeSwitcher {
  constructor() {
    this.init();
  }

  init() {
    document.body.insertAdjacentHTML("beforeend", switcherTemplate);

    this.element = document.querySelector("#theme-switcher");
    this.themeSwitcherButton = this.element.querySelector("button");
    this.themeSwitcherItems = this.element.querySelectorAll("a");

    if (!("theme" in localStorage)) {
      this.setSystemTheme();
    } else if (localStorage.theme === "dark") {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }

    this.addEventListeners();
  }

  setSystemTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      this.setActiveThemeIcon("dark");
    } else {
      document.documentElement.classList.remove("dark");
      this.setActiveThemeIcon("light");
    }
    this.setActiveDropdownItem("system");
  }

  setDarkTheme() {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
    this.setActiveThemeIcon("dark");
    this.setActiveDropdownItem("dark");
  }

  setLightTheme() {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
    this.setActiveThemeIcon("light");
    this.setActiveDropdownItem("light");
  }

  setActiveThemeIcon(theme) {
    this.themeSwitcherButton.innerHTML = this.element.querySelector(
      `[data-theme-icon=${theme}]`
    ).innerHTML;
  }

  setActiveDropdownItem(theme) {
    this.element.querySelectorAll("[data-theme-icon]").forEach((item) => {
      item.classList.remove("text-primary-500");
    });
    this.element.querySelectorAll("[data-theme-name]").forEach((item) => {
      item.classList.remove("text-primary-500");
    });
    this.element
      .querySelector(`[data-theme-icon=${theme}]`)
      .classList.add("text-primary-500");
    this.element
      .querySelector(`[data-theme-name=${theme}]`)
      .classList.add("text-primary-500");
  }

  onThemeSwitcherItemClick(event) {
    const theme = event.target.dataset.theme;

    if (theme === "system") {
      localStorage.removeItem("theme");
      this.setSystemTheme();
    } else if (theme === "dark") {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }

  onThemeSwitcherShortCut() {
    if (!("theme" in localStorage)) {
      document.querySelector("html").classList.contains("dark")
        ? this.setLightTheme()
        : this.setDarkTheme();
    } else if (localStorage.theme === "dark") {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }

  addEventListeners() {
    const bindedOnThemeSwitcherItemClick =
      this.onThemeSwitcherItemClick.bind(this);

    this.themeSwitcherItems.forEach((item) => {
      item.addEventListener("click", bindedOnThemeSwitcherItemClick);
    });

    window.addEventListener("keydown", (event) => {
      if (
        document.activeElement === document.body &&
        event.key.toLocaleLowerCase() === "d" &&
        event.shiftKey
      ) {
        this.onThemeSwitcherShortCut(event);
      }
    });
  }
}

new ThemeSwitcher(); // eslint-disable-line no-new
