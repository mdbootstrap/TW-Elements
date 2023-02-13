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

const defaultIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>';

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
  icon: "float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:text-[#8b8b8b] transition-all duration-200 ease-in-out",
  chipElement:
    "flex justify-between items-center h-[32px] leading-loose py-[5px] px-[12px] mr-4 my-[5px] text-[13px] font-normal text-[#4f4f4f] cursor-pointer bg-[#eceff1] dark:text-white dark:bg-neutral-600 rounded-[16px] transition-[opacity] duration-300 ease-linear [word-wrap: break-word] shadow-none normal-case hover:!shadow-none active:bg-[#cacfd1] inline-block font-medium leading-normal text-[#4f4f4f] text-center no-underline align-middle cursor-pointer select-none border-[.125rem] border-solid border-transparent py-1.5 px-3 text-xs rounded",
  chipCloseIcon:
    "w-4 float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:fill-[#8b8b8b] dark:fill-gray-400 dark:hover:fill-gray-100 transition-all duration-200 ease-in-out",
};

const DefaultClassesType = {
  icon: "string",
  chipElement: "string",
  chipCloseIcon: "string",
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
    const chip = getChip({ text, closeIcon, iconSVG }, this._classes);

    return chip;
  }

  // Private

  _appendCloseIcon(el = this._element) {
    if (SelectorEngine.find(ATTR_SELECTOR_CHIP_CLOSE, this._element).length > 0)
      return;

    if (this._options.closeIcon) {
      const createIcon = element("span");

      createIcon.classList = this._classes.icon;
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
