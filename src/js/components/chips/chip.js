import { element, typeCheckConfig } from "../../util/index";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import Data from "../../dom/data";
import EventHandler from "../../dom/event-handler";
import { getChip } from "./templates";

/**
 *
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "chip";
const DATA_KEY = `te.${NAME}`;

const ATTR_CHIP_CLOSE = "data-te-chip-close";

const ATTR_SELECTOR_CHIP_INIT = "[data-te-chip-init]";
const ATTR_SELECTOR_CHIP_CLOSE = `[${ATTR_CHIP_CLOSE}]`;

const EVENT_DELETE = "delete.te.chips";
const EVENT_SELECT = "select.te.chip";

const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;

const DefaultType = {
  text: "string",
  closeIcon: "boolean",
  img: "object",
  iconSVG: "string",
};

const Default = {
  text: "",
  closeIcon: false,
  img: { path: "", alt: "" },
  iconSVG: defaultIcon,
};

const DefaultClasses = {
  iconClasses:
    "float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer text-[#afafaf] hover:text-[#8b8b8b] transition-all duration-200 ease-in-out",
};

const DefaultClassesType = {
  iconClasses: "string",
};

class Chip {
  constructor(element, data = {}, classes) {
    this._element = element;
    this._options = this._getConfig(data);
    this._classes = this._getClasses(classes);
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  init() {
    this._appendCloseIcon();
    this._handleDelete();
    this._handleTextChip();
    this._handleClickOnChip();
  }

  dispose() {
    this._element = null;
    this._options = null;
    EventHandler.off(this._element, "click");
  }

  appendChip() {
    const { text, closeIcon, iconSVG } = this._options;
    const chip = getChip({ text, closeIcon, iconSVG });

    return chip;
  }

  // Private

  _appendCloseIcon(el = this._element) {
    if (SelectorEngine.find(ATTR_SELECTOR_CHIP_CLOSE, this._element).length > 0)
      return;

    if (this._options.closeIcon) {
      const createIcon = element("span");

      createIcon.classList = this._classes.iconClasses;
      createIcon.setAttribute(ATTR_CHIP_CLOSE);
      createIcon.innerHTML = this._options.iconSVG;

      el.insertAdjacentElement("beforeend", createIcon);
    }
  }

  _handleClickOnChip() {
    EventHandler.on(this._element, "click", (event) => {
      const { textContent } = event.target;
      const obj = {};

      obj.tag = textContent.trim();

      EventHandler.trigger(EVENT_SELECT, { event, obj });
    });
  }

  _handleDelete() {
    const deleteElement = SelectorEngine.find(
      ATTR_SELECTOR_CHIP_CLOSE,
      this._element
    );

    if (deleteElement.length === 0) return;

    EventHandler.on(this._element, "click", ATTR_SELECTOR_CHIP_CLOSE, () => {
      EventHandler.trigger(this._element, EVENT_DELETE);
      this._element.remove();
    });
  }

  _handleTextChip() {
    if (this._element.innerText !== "") return;

    this._element.innerText = this._options.text;
  }

  _getConfig(options) {
    const config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...options,
    };

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }

  _getClasses(classes) {
    const dataAttributes = Manipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }
}

EventHandler.on(window, "DOMContentLoaded", () => {
  SelectorEngine.find(ATTR_SELECTOR_CHIP_INIT).forEach((chip) => {
    let instance = Chip.getInstance(chip);

    if (!instance) {
      instance = new Chip(chip);
    }

    return instance.init();
  });
});

export default Chip;
