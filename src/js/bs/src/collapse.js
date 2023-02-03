/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import {
  defineJQueryPlugin,
  getElement,
  getSelectorFromElement,
  getElementFromSelector,
  reflow,
  typeCheckConfig,
} from "./util/index";
import Data from "./dom/data";
import EventHandler from "./dom/event-handler";
import Manipulator from "./dom/manipulator";
import SelectorEngine from "./dom/selector-engine";
import BaseComponent from "./base-component";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "collapse";
const DATA_KEY = "te.collapse";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";

const Default = {
  toggle: true,
  parent: null,
};

const DefaultType = {
  toggle: "boolean",
  parent: "(null|element)",
};

const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const ATTR_SHOW = "data-te-collapse-show";
const ATTR_COLLAPSED = "data-te-collapse-collapsed";
const ATTR_COLLAPSING = "data-te-collapse-collapsing";
const ATTR_HORIZONTAL = "data-te-collapse-horizontal";
const ATTR_COLLAPSE_ITEM = "data-te-collapse-item";
const ATTR_COLLAPSE_DEEPER_CHILDREN = `:scope [${ATTR_COLLAPSE_ITEM}] [${ATTR_COLLAPSE_ITEM}]`;

const WIDTH = "width";
const HEIGHT = "height";

const SELECTOR_DATA_ACTIVES =
  "[data-te-collapse-item][data-te-collapse-show], [data-te-collapse-item][data-te-collapse-collapsing]";
const SELECTOR_DATA_COLLAPSE_INIT = "[data-te-collapse-init]";

const DefaultClasses = {
  visible: "!visible",
  hidden: "hidden",
  baseTransition:
    "overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
  collapsing:
    "h-0 transition-[height] overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
  collapsingHorizontal:
    "w-0 h-auto transition-[width] overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
};

const DefaultClassesType = {
  visible: "string",
  hidden: "string",
  baseTransition: "string",
  collapsing: "string",
  collapsingHorizontal: "string",
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Collapse extends BaseComponent {
  constructor(element, config, classes) {
    super(element);

    this._isTransitioning = false;
    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
    this._triggerArray = [];

    const toggleList = SelectorEngine.find(SELECTOR_DATA_COLLAPSE_INIT);

    for (let i = 0, len = toggleList.length; i < len; i++) {
      const elem = toggleList[i];
      const selector = getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(
        (foundElem) => foundElem === this._element
      );

      if (selector !== null && filterElement.length) {
        this._selector = selector;
        this._triggerArray.push(elem);
      }
    }

    this._initializeChildren();

    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }

    if (this._config.toggle) {
      this.toggle();
    }
  }

  // Getters

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  // Public

  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }

    let actives = [];
    let activesData;

    if (this._config.parent) {
      const children = SelectorEngine.find(
        ATTR_COLLAPSE_DEEPER_CHILDREN,
        this._config.parent
      );
      actives = SelectorEngine.find(
        SELECTOR_DATA_ACTIVES,
        this._config.parent
      ).filter((elem) => !children.includes(elem)); // remove children if greater depth
    }

    const container = SelectorEngine.findOne(this._selector);
    if (actives.length) {
      const tempActiveData = actives.find((elem) => container !== elem);
      activesData = tempActiveData
        ? Collapse.getInstance(tempActiveData)
        : null;

      if (activesData && activesData._isTransitioning) {
        return;
      }
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW);
    if (startEvent.defaultPrevented) {
      return;
    }

    actives.forEach((elemActive) => {
      if (container !== elemActive) {
        Collapse.getOrCreateInstance(elemActive, { toggle: false }).hide();
      }

      if (!activesData) {
        Data.set(elemActive, DATA_KEY, null);
      }
    });

    const dimension = this._getDimension();
    const CLASS_NAME_TRANSITION =
      dimension === "height"
        ? this._classes.collapsing
        : this._classes.collapsingHorizontal;

    Manipulator.removeMultiClass(
      this._element,
      this._classes.visible.split(" ")
    );
    Manipulator.removeMultiClass(
      this._element,
      this._classes.hidden.split(" ")
    );
    Manipulator.addMultiClass(this._element, CLASS_NAME_TRANSITION);
    this._element.removeAttribute(ATTR_COLLAPSE_ITEM);
    this._element.setAttribute(ATTR_COLLAPSING, "");

    this._element.style[dimension] = 0;

    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      Manipulator.removeMultiClass(
        this._element,
        this._classes.hidden.split(" ")
      );
      Manipulator.removeMultiClass(
        this._element,
        CLASS_NAME_TRANSITION.split(" ")
      );
      Manipulator.addMultiClass(this._element, this._classes.visible);
      this._element.removeAttribute(ATTR_COLLAPSING);
      this._element.setAttribute(ATTR_COLLAPSE_ITEM, "");
      this._element.setAttribute(ATTR_SHOW, "");

      this._element.style[dimension] = "";

      EventHandler.trigger(this._element, EVENT_SHOWN);
    };

    const capitalizedDimension =
      dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;

    this._queueCallback(complete, this._element, true);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }

  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }

    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (startEvent.defaultPrevented) {
      return;
    }

    const dimension = this._getDimension();
    const CLASS_NAME_TRANSITION =
      dimension === "height"
        ? this._classes.collapsing
        : this._classes.collapsingHorizontal;

    this._element.style[dimension] = `${
      this._element.getBoundingClientRect()[dimension]
    }px`;

    reflow(this._element);

    Manipulator.addMultiClass(this._element, CLASS_NAME_TRANSITION);
    Manipulator.removeMultiClass(
      this._element,
      this._classes.visible.split(" ")
    );
    Manipulator.removeMultiClass(
      this._element,
      this._classes.hidden.split(" ")
    );
    this._element.setAttribute(ATTR_COLLAPSING, "");
    this._element.removeAttribute(ATTR_COLLAPSE_ITEM);
    this._element.removeAttribute(ATTR_SHOW);

    const triggerArrayLength = this._triggerArray.length;
    for (let i = 0; i < triggerArrayLength; i++) {
      const trigger = this._triggerArray[i];
      const elem = getElementFromSelector(trigger);

      if (elem && !this._isShown(elem)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }

    this._isTransitioning = true;

    const complete = () => {
      this._isTransitioning = false;

      Manipulator.removeMultiClass(
        this._element,
        CLASS_NAME_TRANSITION.split(" ")
      );
      Manipulator.addMultiClass(this._element, this._classes.visible);
      Manipulator.addMultiClass(this._element, this._classes.hidden);

      this._element.removeAttribute(ATTR_COLLAPSING);
      this._element.setAttribute(ATTR_COLLAPSE_ITEM, "");

      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };

    this._element.style[dimension] = "";

    this._queueCallback(complete, this._element, true);
  }

  _isShown(element = this._element) {
    return element.hasAttribute(ATTR_SHOW);
  }

  // Private

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...config,
    };
    config.toggle = Boolean(config.toggle); // Coerce string values
    config.parent = getElement(config.parent);
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

  _getDimension() {
    return this._element.hasAttribute(ATTR_HORIZONTAL) ? WIDTH : HEIGHT;
  }

  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }

    const children = SelectorEngine.find(
      ATTR_COLLAPSE_DEEPER_CHILDREN,
      this._config.parent
    );
    SelectorEngine.find(SELECTOR_DATA_COLLAPSE_INIT, this._config.parent)
      .filter((elem) => !children.includes(elem))
      .forEach((element) => {
        const selected = getElementFromSelector(element);

        if (selected) {
          this._addAriaAndCollapsedClass([element], this._isShown(selected));
        }
      });
  }

  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }

    triggerArray.forEach((elem) => {
      if (isOpen) {
        elem.removeAttribute(ATTR_COLLAPSED);
      } else {
        elem.setAttribute(`${ATTR_COLLAPSED}`, "");
      }

      elem.setAttribute("aria-expanded", isOpen);
    });
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const _config = {};
      if (typeof config === "string" && /show|hide/.test(config)) {
        _config.toggle = false;
      }

      const data = Collapse.getOrCreateInstance(this, _config);

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(
  document,
  EVENT_CLICK_DATA_API,
  SELECTOR_DATA_COLLAPSE_INIT,
  function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (
      event.target.tagName === "A" ||
      (event.delegateTarget && event.delegateTarget.tagName === "A")
    ) {
      event.preventDefault();
    }

    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);

    selectorElements.forEach((element) => {
      Collapse.getOrCreateInstance(element, { toggle: false }).toggle();
    });
  }
);

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Collapse to jQuery only if jQuery is present
 */

defineJQueryPlugin(Collapse);

export default Collapse;
