import {
  element,
  getjQuery,
  onDOMContentLoaded,
  typeCheckConfig,
} from "./util/index";
import Data from "./dom/data";
import EventHandler from "./dom/event-handler";
import Manipulator from "./dom/manipulator";
import SelectorEngine from "./dom/selector-engine";
import "detect-autofill";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "input";
const DATA_KEY = "te.input";
const DATA_WRAPPER = "data-te-input-wrapper-init";
const DATA_NOTCH = "data-te-input-notch-ref";
const DATA_NOTCH_LEADING = "data-te-input-notch-leading-ref";
const DATA_NOTCH_MIDDLE = "data-te-input-notch-middle-ref";
const DATA_NOTCH_TRAILING = "data-te-input-notch-trailing-ref";
const DATA_HELPER = "data-te-input-helper-ref";
const DATA_PLACEHOLDER_ACTIVE = "data-te-input-placeholder-active";
const DATA_ACTIVE = "data-te-input-state-active";
const DATA_FOCUSED = "data-te-input-focused";
const DATA_FORM_COUNTER = "data-te-input-form-counter";

const NOTCH_CLASSES =
  "group flex absolute left-0 top-0 w-full max-w-full h-full text-left pointer-events-none";
const NOTCH_DIV_CLASSES =
  "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none";

const NOTCH_LEADING_NORMAL =
  " border-gray-300 dark:border-gray-600 group-data-[te-input-focused]:shadow-[-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca] group-data-[te-input-focused]:border-blue-600";
const NOTCH_LEADING_WHITE =
  " border-gray-200 group-data-[te-input-focused]:shadow-[-1px_0_0_#ffffff,_0_1px_0_0_#ffffff,_0_-1px_0_0_#ffffff] group-data-[te-input-focused]:border-white";

const NOTCH_LEADING_CLASSES =
  NOTCH_DIV_CLASSES +
  " left-0 top-0 h-full w-2 border-r-0 rounded-l-[0.25rem] group-data-[te-input-focused]:border-r-0 group-data-[te-input-state-active]:border-r-0";

const NOTCH_MIDDLE_NORMAL =
  " border-gray-300 dark:border-gray-600 group-data-[te-input-focused]:shadow-[0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-blue-600";
const NOTCH_MIDDLE_WHITE =
  " border-gray-200 group-data-[te-input-focused]:shadow-[0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white";

const NOTCH_MIDDLE_CLASSES =
  NOTCH_DIV_CLASSES +
  " grow-0 shrink-0 basis-auto w-auto max-w-[calc(100%-1rem)] h-full border-r-0 border-l-0 group-data-[te-input-focused]:border-x-0 group-data-[te-input-state-active]:border-x-0 group-data-[te-input-focused]:border-t group-data-[te-input-state-active]:border-t group-data-[te-input-focused]:border-solid group-data-[te-input-state-active]:border-solid group-data-[te-input-focused]:border-t-transparent group-data-[te-input-state-active]:border-t-transparent";

const NOTCH_TRAILING_NORMAL =
  " border-gray-300 dark:border-gray-600 group-data-[te-input-focused]:shadow-[1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-blue-600";
const NOTCH_TRAILING_WHITE =
  " border-gray-200 group-data-[te-input-focused]:shadow-[1px_0_0_#ffffff,_0_-1px_0_0_#ffffff,_0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white";

const NOTCH_TRAILING_CLASSES =
  NOTCH_DIV_CLASSES +
  " grow h-full border-l-0 rounded-r-[0.25rem] group-data-[te-input-focused]:border-l-0 group-data-[te-input-state-active]:border-l-0";

const COUNTER_CLASSES = "text-right leading-[1.6]";

const SELECTOR_OUTLINE_INPUT = `[${DATA_WRAPPER}] input`;
const SELECTOR_OUTLINE_TEXTAREA = `[${DATA_WRAPPER}] textarea`;

const SELECTOR_NOTCH = `[${DATA_NOTCH}]`;
const SELECTOR_NOTCH_LEADING = `[${DATA_NOTCH_LEADING}]`;
const SELECTOR_NOTCH_MIDDLE = `[${DATA_NOTCH_MIDDLE}]`;
const SELECTOR_HELPER = `[${DATA_HELPER}]`;

const Default = {
  inputFormWhite: false,
};

const DefaultType = {
  inputFormWhite: "(boolean|string)",
};
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Input {
  constructor(element, config) {
    this._config = this._getConfig(config, element);
    this._element = element;
    this._label = null;
    this._labelWidth = 0;
    this._labelMarginLeft = 0;
    this._notchLeading = null;
    this._notchMiddle = null;
    this._notchTrailing = null;
    this._initiated = false;
    this._helper = null;
    this._counter = false;
    this._counterElement = null;
    this._maxLength = 0;
    this._leadingIcon = null;
    if (this._element) {
      Data.set(element, DATA_KEY, this);
      this.init();
    }
  }

  // Getters
  static get NAME() {
    return NAME;
  }

  get input() {
    const inputElement =
      SelectorEngine.findOne("input", this._element) ||
      SelectorEngine.findOne("textarea", this._element);
    return inputElement;
  }

  // Public
  init() {
    if (this._initiated) {
      return;
    }
    this._getLabelData();
    this._applyDivs();
    this._applyNotch();
    this._activate();
    this._getHelper();
    this._getCounter();
    this._initiated = true;
  }

  update() {
    this._getLabelData();
    this._getNotchData();
    this._applyNotch();
    this._activate();
    this._getHelper();
    this._getCounter();
  }

  forceActive() {
    this.input.setAttribute(DATA_ACTIVE, "");

    SelectorEngine.findOne(SELECTOR_NOTCH, this.input.parentNode).setAttribute(
      DATA_ACTIVE,
      ""
    );
  }

  forceInactive() {
    this.input.removeAttribute(DATA_ACTIVE);

    SelectorEngine.findOne(
      SELECTOR_NOTCH,
      this.input.parentNode
    ).removeAttribute(DATA_ACTIVE);
  }

  dispose() {
    this._removeBorder();

    Data.remove(this._element, DATA_KEY);
    this._element = null;
  }

  // Private

  _getConfig(config, element) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(element),
      ...(typeof config === "object" ? config : {}),
    };
    typeCheckConfig(NAME, config, DefaultType);
    return config;
  }

  _getLabelData() {
    this._label = SelectorEngine.findOne("label", this._element);

    if (this._label === null) {
      this._showPlaceholder();
    } else {
      this._getLabelWidth();
      this._getLabelPositionInInputGroup();
      this._toggleDefaultDatePlaceholder();
    }
  }

  _getHelper() {
    this._helper = SelectorEngine.findOne(SELECTOR_HELPER, this._element);
  }

  _getCounter() {
    this._counter = Manipulator.getDataAttribute(
      this.input,
      "inputShowcounter"
    );
    if (this._counter) {
      this._maxLength = this.input.maxLength;
      this._showCounter();
    }
  }

  _showCounter() {
    const counters = SelectorEngine.find(
      `[${DATA_FORM_COUNTER}]`,
      this._element
    );
    if (counters.length > 0) {
      return;
    }
    this._counterElement = document.createElement("div");
    Manipulator.addMultiClass(this._counterElement, COUNTER_CLASSES);
    this._counterElement.setAttribute(DATA_FORM_COUNTER, "");
    const actualLength = this.input.value.length;
    this._counterElement.innerHTML = `${actualLength} / ${this._maxLength}`;
    this._helper.appendChild(this._counterElement);
    this._bindCounter();
  }

  _bindCounter() {
    EventHandler.on(this.input, "input", () => {
      const actualLength = this.input.value.length;
      this._counterElement.innerHTML = `${actualLength} / ${this._maxLength}`;
    });
  }

  _toggleDefaultDatePlaceholder(input = this.input) {
    const isTypeDate = input.getAttribute("type") === "date";
    if (!isTypeDate) {
      return;
    }
    const isInputFocused = document.activeElement === input;

    if (!isInputFocused && !input.value) {
      input.style.opacity = 0;
    } else {
      input.style.opacity = 1;
    }
  }

  _showPlaceholder() {
    this.input.setAttribute(DATA_PLACEHOLDER_ACTIVE, "");
  }

  _getNotchData() {
    this._notchMiddle = SelectorEngine.findOne(
      SELECTOR_NOTCH_MIDDLE,
      this._element
    );
    this._notchLeading = SelectorEngine.findOne(
      SELECTOR_NOTCH_LEADING,
      this._element
    );
  }

  _getLabelWidth() {
    this._labelWidth = this._label.clientWidth * 0.8 + 8;
  }

  _getLabelPositionInInputGroup() {
    this._labelMarginLeft = 0;
    if (!this._element.hasAttribute("data-te-input-group-ref")) return;
    const input = this.input;
    const prefix = SelectorEngine.prev(
      input,
      "[data-te-input-group-text-ref]"
    )[0];
    if (prefix === undefined) {
      this._labelMarginLeft = 0;
    } else {
      this._labelMarginLeft = prefix.offsetWidth - 1;
    }
  }

  _applyDivs() {
    const shadowLeading = this._config.inputFormWhite
      ? NOTCH_LEADING_WHITE
      : NOTCH_LEADING_NORMAL;
    const shadowMiddle = this._config.inputFormWhite
      ? NOTCH_MIDDLE_WHITE
      : NOTCH_MIDDLE_NORMAL;
    const shadowTrailing = this._config.inputFormWhite
      ? NOTCH_TRAILING_WHITE
      : NOTCH_TRAILING_NORMAL;

    const allNotchWrappers = SelectorEngine.find(SELECTOR_NOTCH, this._element);
    const notchWrapper = element("div");
    Manipulator.addMultiClass(notchWrapper, NOTCH_CLASSES);
    notchWrapper.setAttribute(DATA_NOTCH, "");
    this._notchLeading = element("div");

    Manipulator.addMultiClass(
      this._notchLeading,
      NOTCH_LEADING_CLASSES + shadowLeading
    );
    this._notchLeading.setAttribute(DATA_NOTCH_LEADING, "");
    this._notchMiddle = element("div");

    Manipulator.addMultiClass(
      this._notchMiddle,
      NOTCH_MIDDLE_CLASSES + shadowMiddle
    );
    this._notchMiddle.setAttribute(DATA_NOTCH_MIDDLE, "");
    this._notchTrailing = element("div");

    Manipulator.addMultiClass(
      this._notchTrailing,
      NOTCH_TRAILING_CLASSES + shadowTrailing
    );
    this._notchTrailing.setAttribute(DATA_NOTCH_TRAILING, "");
    if (allNotchWrappers.length >= 1) {
      return;
    }
    notchWrapper.append(this._notchLeading);
    notchWrapper.append(this._notchMiddle);
    notchWrapper.append(this._notchTrailing);
    this._element.append(notchWrapper);
  }

  _applyNotch() {
    this._notchMiddle.style.width = `${this._labelWidth}px`;
    this._notchLeading.style.width = `${this._labelMarginLeft + 9}px`;

    if (this._label === null) return;
    this._label.style.marginLeft = `${this._labelMarginLeft}px`;
  }

  _removeBorder() {
    const border = SelectorEngine.findOne(SELECTOR_NOTCH, this._element);
    if (border) border.remove();
  }

  _activate(event) {
    onDOMContentLoaded(() => {
      this._getElements(event);
      const input = event ? event.target : this.input;
      const notchWrapper = SelectorEngine.findOne(
        SELECTOR_NOTCH,
        this._element
      );

      if (event && event.type === "focus") {
        notchWrapper.setAttribute(DATA_FOCUSED, "");
      }

      if (input.value !== "") {
        input.setAttribute(DATA_ACTIVE, "");
        notchWrapper.setAttribute(DATA_ACTIVE, "");
      }
      this._toggleDefaultDatePlaceholder(input);
    });
  }

  _getElements(event) {
    if (event) {
      this._element = event.target.parentNode;
      this._label = SelectorEngine.findOne("label", this._element);
    }

    if (event && this._label) {
      const prevLabelWidth = this._labelWidth;
      this._getLabelData();

      if (prevLabelWidth !== this._labelWidth) {
        this._notchMiddle = SelectorEngine.findOne(
          SELECTOR_NOTCH_MIDDLE,
          event.target.parentNode
        );
        this._notchLeading = SelectorEngine.findOne(
          SELECTOR_NOTCH_LEADING,
          event.target.parentNode
        );
        this._applyNotch();
      }
    }
  }

  _deactivate(event) {
    const input = event ? event.target : this.input;
    const notchWrapper = SelectorEngine.findOne(
      SELECTOR_NOTCH,
      input.parentNode
    );
    notchWrapper.removeAttribute(DATA_FOCUSED);

    if (input.value === "") {
      input.removeAttribute(DATA_ACTIVE);
      notchWrapper.removeAttribute(DATA_ACTIVE);
    }
    this._toggleDefaultDatePlaceholder(input);
  }

  static activate(instance) {
    return function (event) {
      instance._activate(event);
    };
  }

  static deactivate(instance) {
    return function (event) {
      instance._deactivate(event);
    };
  }

  static jQueryInterface(config, options) {
    return this.each(function () {
      let data = Data.get(this, DATA_KEY);
      const _config = typeof config === "object" && config;
      if (!data && /dispose/.test(config)) {
        return;
      }
      if (!data) {
        data = new Input(this, _config);
      }
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](options);
      }
    });
  }

  static getInstance(element) {
    return Data.get(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }
}

EventHandler.on(
  document,
  "focus",
  SELECTOR_OUTLINE_INPUT,
  Input.activate(new Input())
);
EventHandler.on(
  document,
  "input",
  SELECTOR_OUTLINE_INPUT,
  Input.activate(new Input())
);
EventHandler.on(
  document,
  "blur",
  SELECTOR_OUTLINE_INPUT,
  Input.deactivate(new Input())
);

EventHandler.on(
  document,
  "focus",
  SELECTOR_OUTLINE_TEXTAREA,
  Input.activate(new Input())
);
EventHandler.on(
  document,
  "input",
  SELECTOR_OUTLINE_TEXTAREA,
  Input.activate(new Input())
);
EventHandler.on(
  document,
  "blur",
  SELECTOR_OUTLINE_TEXTAREA,
  Input.deactivate(new Input())
);

EventHandler.on(window, "shown.te.modal", (e) => {
  SelectorEngine.find(SELECTOR_OUTLINE_INPUT, e.target).forEach((element) => {
    const instance = Input.getInstance(element.parentNode);
    if (!instance) {
      return;
    }
    instance.update();
  });
  SelectorEngine.find(SELECTOR_OUTLINE_TEXTAREA, e.target).forEach(
    (element) => {
      const instance = Input.getInstance(element.parentNode);
      if (!instance) {
        return;
      }
      instance.update();
    }
  );
});

EventHandler.on(window, "shown.te.dropdown", (e) => {
  const target = e.target.parentNode.querySelector(
    "[data-te-dropdown-menu-ref]"
  );
  if (target) {
    SelectorEngine.find(SELECTOR_OUTLINE_INPUT, target).forEach((element) => {
      const instance = Input.getInstance(element.parentNode);
      if (!instance) {
        return;
      }
      instance.update();
    });
    SelectorEngine.find(SELECTOR_OUTLINE_TEXTAREA, target).forEach(
      (element) => {
        const instance = Input.getInstance(element.parentNode);
        if (!instance) {
          return;
        }
        instance.update();
      }
    );
  }
});

EventHandler.on(window, "shown.te.tab", (e) => {
  let targetId;

  if (e.target.href) {
    targetId = e.target.href.split("#")[1];
  } else {
    targetId = Manipulator.getDataAttribute(e.target, "target").split("#")[1];
  }

  const target = SelectorEngine.findOne(`#${targetId}`);
  SelectorEngine.find(SELECTOR_OUTLINE_INPUT, target).forEach((element) => {
    const instance = Input.getInstance(element.parentNode);
    if (!instance) {
      return;
    }
    instance.update();
  });
  SelectorEngine.find(SELECTOR_OUTLINE_TEXTAREA, target).forEach((element) => {
    const instance = Input.getInstance(element.parentNode);
    if (!instance) {
      return;
    }
    instance.update();
  });
});

// auto-init
SelectorEngine.find(`[${DATA_WRAPPER}]`).map((element) => new Input(element));

// form reset handler
EventHandler.on(window, "reset", (e) => {
  SelectorEngine.find(SELECTOR_OUTLINE_INPUT, e.target).forEach((element) => {
    const instance = Input.getInstance(element.parentNode);
    if (!instance) {
      return;
    }
    instance.forceInactive();
  });
  SelectorEngine.find(SELECTOR_OUTLINE_TEXTAREA, e.target).forEach(
    (element) => {
      const instance = Input.getInstance(element.parentNode);
      if (!instance) {
        return;
      }
      instance.forceInactive();
    }
  );
});

// auto-fill
EventHandler.on(window, "onautocomplete", (e) => {
  const instance = Input.getInstance(e.target.parentNode);
  if (!instance || !e.cancelable) {
    return;
  }
  instance.forceActive();
});

onDOMContentLoaded(() => {
  const $ = getjQuery();

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Input.jQueryInterface;
    $.fn[NAME].Constructor = Input;
    $.fn[NAME].noConflict = () => {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Input.jQueryInterface;
    };
  }
});

export default Input;
