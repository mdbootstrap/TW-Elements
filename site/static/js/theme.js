class ThemeSwitcher {
  constructor(element) {
    this.element = element;
    this.themeSwitcherButton = this.element.querySelector('button');
    this.themeSwitcherItems = this.element.querySelectorAll('a');

    this.init();
  }

  init() {
    if (!('theme' in localStorage)) {
      this.setLightTheme();
      // this.setSystemTheme();
    } else if (localStorage.theme === 'dark') {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }

    this.addEventListeners();
  }

  setSystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      this.setActiveThemeIcon('dark');
    } else {
      document.documentElement.classList.remove('dark');
      this.setActiveThemeIcon('light');
    }
    this.setActiveDropdownItem('system');
  }

  setDarkTheme() {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    this.setActiveThemeIcon('dark');
    this.setActiveDropdownItem('dark');
  }

  setLightTheme() {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
    this.setActiveThemeIcon('light');
    this.setActiveDropdownItem('light');
  }

  setActiveThemeIcon(theme) {
    this.themeSwitcherButton.innerHTML = this.element.querySelector(
      `[data-theme-icon=${theme}]`
    ).innerHTML;
  }

  setActiveDropdownItem(theme) {
    this.element.querySelectorAll('[data-theme-icon]').forEach((item) => {
      item.classList.remove('text-blue-500');
    });
    this.element.querySelectorAll('[data-theme-name]').forEach((item) => {
      item.classList.remove('text-blue-500');
    });
    this.element.querySelector(`[data-theme-icon=${theme}]`).classList.add('text-blue-500');
    this.element.querySelector(`[data-theme-name=${theme}]`).classList.add('text-blue-500');
  }

  onThemeSwitcherItemClick(event) {
    const theme = event.target.dataset.theme;

    if (theme === 'system') {
      localStorage.removeItem('theme');
      this.setSystemTheme();
    } else if (theme === 'dark') {
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
    const bindedOnThemeSwitcherItemClick = this.onThemeSwitcherItemClick.bind(this);

    this.themeSwitcherItems.forEach((item) => {
      item.addEventListener('click', bindedOnThemeSwitcherItemClick);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key.toLocaleLowerCase() === "d" && event.shiftKey) {
        this.onThemeSwitcherShortCut(event);
      }
    });
  }
}

const themeSwitcher = document.querySelector('#theme-switcher');

if (themeSwitcher) {
  new ThemeSwitcher(themeSwitcher); // eslint-disable-line no-new
}
