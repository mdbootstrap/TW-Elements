import TouchUtil from "./touchUtil";
import EventHandler from "../../dom/event-handler";
import { typeCheckConfig } from "../../util";
import Manipulator from "../../dom/manipulator";

const NAME = "press";
const EVENT_UP = "pressup";

const DefaultType = {
  time: "number",
  pointers: "number",
};

const Default = {
  time: 250,
  pointers: 1,
};

class Press extends TouchUtil {
  constructor(element, options = {}) {
    super();
    this._element = element;
    this._options = this._getConfig(options);
    this._timer = null;
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  handleTouchStart(e) {
    const { time, pointers } = this._options;

    if (e.touches.length === pointers) {
      this._timer = setTimeout(() => {
        EventHandler.trigger(this._element, NAME, { touch: e, time });
        EventHandler.trigger(this._element, EVENT_UP, { touch: e });
      }, time);
    }
  }

  handleTouchEnd() {
    clearTimeout(this._timer);
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
}

export default Press;
