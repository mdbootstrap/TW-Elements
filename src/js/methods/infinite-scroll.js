import { typeCheckConfig } from "../util/index";
import Data from "../dom/data";
import Manipulator from "../dom/manipulator";
import EventHandler from "../dom/event-handler";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = "infiniteScroll";
const DATA_KEY = `te.${NAME}`;

const Default = {
  infiniteDirection: "y",
};

const DefaultType = {
  infiniteDirection: "string",
};

class InfiniteScroll {
  constructor(element, data) {
    this._element = element;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
    }

    this._options = this._getConfig(data);

    this.scrollHandler = this._scrollHandler.bind(this);

    this._init();
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get rect() {
    return this._element.getBoundingClientRect();
  }

  get condition() {
    if (this._element === window) {
      return (
        Math.abs(
          window.scrollY +
            window.innerHeight -
            document.documentElement.scrollHeight
        ) < 1
      );
    }
    if (this._options.infiniteDirection === "x") {
      return (
        this.rect.width + this._element.scrollLeft + 10 >=
        this._element.scrollWidth
      );
    }
    return (
      Math.ceil(this.rect.height + this._element.scrollTop) >=
      this._element.scrollHeight
    );
  }

  // Public

  dispose() {
    EventHandler.off(this._element, "scroll", this.scrollHandler);

    Data.removeData(this._element, DATA_KEY);

    this._element = null;
  }

  // Private

  _init() {
    EventHandler.on(this._element, "scroll", () => this._scrollHandler());
  }

  _scrollHandler() {
    if (this.condition) {
      EventHandler.trigger(this._element, "complete.te.infiniteScroll");
    }
    EventHandler.off(this._element, "scroll", this.scrollHandler);
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

  // Static

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;
      if (!data) {
        data = new InfiniteScroll(this, _config);
      }
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      }
    });
  }
}

export default InfiniteScroll;
