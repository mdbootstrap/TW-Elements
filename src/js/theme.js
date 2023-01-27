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
      this.setLightTheme();
      // this.setSystemTheme();
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

  addEventListeners() {
    const bindedOnThemeSwitcherItemClick =
      this.onThemeSwitcherItemClick.bind(this);

    this.themeSwitcherItems.forEach((item) => {
      item.addEventListener("click", bindedOnThemeSwitcherItemClick);
    });
  }
}

new ThemeSwitcher(); // eslint-disable-line no-new
