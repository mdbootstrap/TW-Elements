import TouchUtil from "./touchUtil";
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import { typeCheckConfig } from "../../util";

const NAME = "pinch";
const EVENT_END = `${NAME}end`;
const EVENT_START = `${NAME}start`;
const EVENT_MOVE = `${NAME}move`;

const DefaultType = {
  threshold: "number",
  pointers: "number",
};

const Default = {
  threshold: 20,
  pointers: 1,
};

class Pinch extends TouchUtil {
  constructor(element, options = {}) {
    super();
    this._element = element;
    this._options = this._getConfig(options);
    this._startTouch = null;
    this._origin = null;
    this._touch = null;
    this._math = null;
    this._ratio = null;
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  get isNumber() {
    return (
      typeof this._startTouch === "number" &&
      typeof this._touch === "number" &&
      // eslint-disable-next-line no-restricted-globals
      !isNaN(this._startTouch) &&
      // eslint-disable-next-line no-restricted-globals
      !isNaN(this._touch)
    );
  }

  handleTouchStart(e) {
    if (e.touches.length !== this._options.pointers) return;

    // eslint-disable-next-line no-unused-expressions
    e.type === "touchstart" && e.preventDefault();

    const [touch, origin] = this._getPinchTouchOrigin(e.touches);

    this._touch = touch;
    this._origin = origin;
    this._startTouch = this._touch;

    EventHandler.trigger(this._element, EVENT_START, {
      touch: e,
      ratio: this._ratio,
      origin: this._origin,
    });
  }

  handleTouchMove(e) {
    const { threshold, pointers } = this._options;

    if (e.touches.length !== pointers) return;

    // eslint-disable-next-line no-unused-expressions
    e.type === "touchmove" && e.preventDefault();

    this._touch = this._getPinchTouchOrigin(e.touches)[0];
    this._ratio = this._touch / this._startTouch;

    if (this.isNumber) {
      if (this._origin.x > threshold || this._origin.y > threshold) {
        this._startTouch = this._touch;

        EventHandler.trigger(this._element, NAME, {
          touch: e,
          ratio: this._ratio,
          origin: this._origin,
        });
        EventHandler.trigger(this._element, EVENT_MOVE, {
          touch: e,
          ratio: this._ratio,
          origin: this._origin,
        });
      }
    }
  }

  handleTouchEnd(e) {
    if (this.isNumber) {
      this._startTouch = null;

      EventHandler.trigger(this._element, EVENT_END, {
        touch: e,
        ratio: this._ratio,
        origin: this._origin,
      });
    }
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

export default Pinch;
