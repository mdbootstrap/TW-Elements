class ThemeSwitcher {
  constructor(element) {
    this.element = element;
    this.themeSwitcherButton = this.element.querySelector("button");
    this.themeSwitcherItems = this.element.querySelectorAll("a");

    this.activeTheme = "light";
    this.customTogglers = [];

    this.init();
  }

  init() {
    if (!this.getCookie("tailwindTheme")) {
      this.setLightTheme();
      // this.setSystemTheme();
    } else if (this.getCookie("tailwindTheme") === "dark") {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }

    this.addEventListeners();
    this.initCustomTogglers();
    this.setCustomTogglersState();
  }

  setSystemTheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      this.setActiveThemeIcon("dark");
      this.activeTheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      this.setActiveThemeIcon("light");
      this.activeTheme = "light";
    }
    this.setActiveDropdownItem("system");
  }

  setDarkTheme() {
    document.documentElement.classList.add("dark");
    this.setCookie("tailwindTheme","dark",365);
    this.setActiveThemeIcon("dark");
    this.setActiveDropdownItem("dark");
    this.activeTheme = "dark";
    this.customTogglers.forEach((customToggler) => {
      customToggler.checked = true;
    });
  }

  setLightTheme() {
    document.documentElement.classList.remove("dark");
    this.setCookie("tailwindTheme","light",365);
    this.setActiveThemeIcon("light");
    this.setActiveDropdownItem("light");
    this.activeTheme = "light";
    this.customTogglers.forEach((customToggler) => {
      customToggler.checked = false;
    });
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
      this.eraseCookie("tailwindTheme");
      this.setSystemTheme();
    } else if (theme === "dark") {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }

    this.setCustomTogglersState();
  }

  onThemeSwitcherShortCut() {
    if (!this.getCookie("tailwindTheme")) {
      document.querySelector("html").classList.contains("dark")
        ? this.setLightTheme()
        : this.setDarkTheme();
    } else if (this.getCookie("tailwindTheme") === "dark") {
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
  }

  toggleDarkOrLightTheme() {
    if (this.activeTheme === "dark") {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }

    this.setCustomTogglersState();
  }

  initCustomTogglers() {
    this.customTogglers = document.querySelectorAll("[data-te-theme-toggler]");

    this.customTogglers.forEach((customToggler) => {
      customToggler.addEventListener("change", () =>
        this.toggleDarkOrLightTheme()
      );
    });
  }

  setCustomTogglersState() {
    this.customTogglers.forEach((customToggler) => {
      if (this.activeTheme === "dark") {
        customToggler.checked = true;
      } else {
        customToggler.checked = false;
      }
    });

    window.addEventListener("keydown", (event) => {
      if (document.activeElement === document.body && event.key.toLocaleLowerCase() === "d" && event.shiftKey) {
        this.onThemeSwitcherShortCut(event);
      }
    });
  }

  setCookie(name,value,days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

const themeSwitcher = document.querySelector("#theme-switcher");
let themeInstance;

if (themeSwitcher) {
  themeInstance = new ThemeSwitcher(themeSwitcher);
}
