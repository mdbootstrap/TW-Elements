import { element, typeCheckConfig } from "../../util/index";
import Data from "../../dom/data";
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import { getStyle } from "../../util/getStyle";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "ripple";
const DATA_KEY = "twe.ripple";

const GRADIENT =
  "rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%";

const SELECTOR_COMPONENT = ["[data-twe-ripple-init]"];
const DEFAULT_RIPPLE_COLOR = [0, 0, 0];

// prettier-ignore
const BOOTSTRAP_COLORS = [
  {
    name: "primary",
    gradientColor: getStyle("text-primary", { defaultValue: "#3B71CA", inherit: false }),
  },
  {
    name: "secondary",
    gradientColor: getStyle("text-primary-100", { defaultValue: "#9FA6B2", inherit: false }),
  },
  {
    name: "success",
    gradientColor: getStyle("text-success", { defaultValue: "#14A44D", inherit: false }),
  },
  {
    name: "danger",
    gradientColor: getStyle("text-danger", { defaultValue: "#DC4C64", inherit: false }),
  },
  {
    name: "warning",
    gradientColor: getStyle("text-warning", { defaultValue: "#E4A11B", inherit: false }),
  },
  {
    name: "info",
    gradientColor: getStyle("text-info", { defaultValue: "#54B4D3", inherit: false }),
  },
  {
    name: "light",
    gradientColor: "#fbfbfb",
  },
  {
    name: "dark",
    gradientColor: "#262626",
  },
];

// Sets value when run opacity transition
// Hide element after 50% (0.5) time of animation and finish on 100%
const TRANSITION_BREAK_OPACITY = 0.5;

const Default = {
  rippleCentered: false,
  rippleColor: "",
  rippleColorDark: "",
  rippleDuration: "500ms",
  rippleRadius: 0,
  rippleUnbound: false,
};

const DefaultType = {
  rippleCentered: "boolean",
  rippleColor: "string",
  rippleColorDark: "string",
  rippleDuration: "string",
  rippleRadius: "number",
  rippleUnbound: "boolean",
};

const DefaultClasses = {
  ripple: "relative overflow-hidden inline-block align-bottom",
  rippleWave:
    "rounded-[50%] opacity-50 pointer-events-none absolute touch-none scale-0 transition-[transform,_opacity] ease-[cubic-bezier(0,0,0.15,1),_cubic-bezier(0,0,0.15,1)] z-[999]",
  unbound: "overflow-visible",
};

const DefaultClassesType = {
  ripple: "string",
  rippleWave: "string",
  unbound: "string",
};

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Ripple {
  constructor(element, options, classes) {
    this._element = element;
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);
    this._currentColor = this._options.rippleColor;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
      Manipulator.addClass(this._element, this._classes.ripple);
    }
    this._clickHandler = this._createRipple.bind(this);
    this._rippleTimer = null;
    this._isMinWidthSet = false;
    this._initialClasses = null;

    this.init();
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  // Public

  init() {
    this._addClickEvent(this._element);
  }

  dispose() {
    Data.removeData(this._element, DATA_KEY);
    EventHandler.off(this._element, "mousedown", this._clickHandler);
    this._element = null;
    this._options = null;
  }

  // Private

  _autoInit(event) {
    SELECTOR_COMPONENT.forEach((selector) => {
      const target = SelectorEngine.closest(event.target, selector);
      if (target) {
        this._element = SelectorEngine.closest(event.target, selector);
      }
    });

    if (!this._element.style.minWidth) {
      Manipulator.style(this._element, {
        "min-width": getComputedStyle(this._element).width,
      });
      this._isMinWidthSet = true;
    }

    this._options = this._getConfig();
    this._classes = this._getClasses();

    this._initialClasses = [...this._element.classList];
    Manipulator.addClass(this._element, this._classes.ripple);
    this._createRipple(event);
  }

  _addClickEvent(target) {
    EventHandler.on(target, "mousedown", this._clickHandler);
  }

  _createRipple(event) {
    if (this._element.className.indexOf(this._classes.ripple) < 0) {
      Manipulator.addClass(this._element, this._classes.ripple);
    }

    const { layerX, layerY } = event;
    const offsetX = event.offsetX || layerX;
    const offsetY = event.offsetY || layerY;
    const height = this._element.offsetHeight;
    const width = this._element.offsetWidth;
    const duration = this._durationToMsNumber(this._options.rippleDuration);
    const diameterOptions = {
      offsetX: this._options.rippleCentered ? height / 2 : offsetX,
      offsetY: this._options.rippleCentered ? width / 2 : offsetY,
      height,
      width,
    };
    const diameter = this._getDiameter(diameterOptions);
    const radiusValue = this._options.rippleRadius || diameter / 2;

    const opacity = {
      delay: duration * TRANSITION_BREAK_OPACITY,
      duration: duration - duration * TRANSITION_BREAK_OPACITY,
    };

    const styles = {
      left: this._options.rippleCentered
        ? `${width / 2 - radiusValue}px`
        : `${offsetX - radiusValue}px`,
      top: this._options.rippleCentered
        ? `${height / 2 - radiusValue}px`
        : `${offsetY - radiusValue}px`,
      height: `${this._options.rippleRadius * 2 || diameter}px`,
      width: `${this._options.rippleRadius * 2 || diameter}px`,
      transitionDelay: `0s, ${opacity.delay}ms`,
      transitionDuration: `${duration}ms, ${opacity.duration}ms`,
    };

    const rippleHTML = element("div");

    this._createHTMLRipple({
      wrapper: this._element,
      ripple: rippleHTML,
      styles,
    });
    this._removeHTMLRipple({ ripple: rippleHTML, duration });
  }

  _createHTMLRipple({ wrapper, ripple, styles }) {
    Object.keys(styles).forEach(
      (property) => (ripple.style[property] = styles[property])
    );
    Manipulator.addClass(ripple, this._classes.rippleWave);
    ripple.setAttribute("data-twe-ripple-ref", "");
    this._addColor(ripple, wrapper);

    this._toggleUnbound(wrapper);
    this._appendRipple(ripple, wrapper);
  }

  _removeHTMLRipple({ ripple, duration }) {
    if (this._rippleTimer) {
      clearTimeout(this._rippleTimer);
      this._rippleTimer = null;
    }
    if (ripple) {
      setTimeout(() => {
        ripple.classList.add("!opacity-0");
      }, 10);
    }
    this._rippleTimer = setTimeout(() => {
      if (ripple) {
        ripple.remove();
        if (this._element) {
          SelectorEngine.find("[data-twe-ripple-ref]", this._element).forEach(
            (rippleEl) => {
              rippleEl.remove();
            }
          );
          if (this._isMinWidthSet) {
            Manipulator.style(this._element, { "min-width": "" });
            this._isMinWidthSet = false;
          }
          // check if added ripple classes wasn't there initialy
          const classesToRemove = this._initialClasses
            ? this._addedNewRippleClasses(
                this._classes.ripple,
                this._initialClasses
              )
            : this._classes.ripple.split(" ");
          Manipulator.removeClass(this._element, classesToRemove);
        }
      }
    }, duration);
  }

  _addedNewRippleClasses(defaultRipple, initialClasses) {
    return defaultRipple
      .split(" ")
      .filter(
        (item) => initialClasses.findIndex((init) => item === init) === -1
      );
  }

  _durationToMsNumber(time) {
    return Number(time.replace("ms", "").replace("s", "000"));
  }

  _getConfig(config = {}) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    config = {
      ...Default,
      ...dataAttributes,
      ...config,
    };

    typeCheckConfig(NAME, config, DefaultType);
    return config;
  }

  _getClasses(classes = {}) {
    const dataAttributes = Manipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  _getDiameter({ offsetX, offsetY, height, width }) {
    const top = offsetY <= height / 2;
    const left = offsetX <= width / 2;
    const pythagorean = (sideA, sideB) => Math.sqrt(sideA ** 2 + sideB ** 2);

    const positionCenter = offsetY === height / 2 && offsetX === width / 2;
    // mouse position on the quadrants of the coordinate system
    const quadrant = {
      first: top === true && left === false,
      second: top === true && left === true,
      third: top === false && left === true,
      fourth: top === false && left === false,
    };

    const getCorner = {
      topLeft: pythagorean(offsetX, offsetY),
      topRight: pythagorean(width - offsetX, offsetY),
      bottomLeft: pythagorean(offsetX, height - offsetY),
      bottomRight: pythagorean(width - offsetX, height - offsetY),
    };

    let diameter = 0;

    if (positionCenter || quadrant.fourth) {
      diameter = getCorner.topLeft;
    } else if (quadrant.third) {
      diameter = getCorner.topRight;
    } else if (quadrant.second) {
      diameter = getCorner.bottomRight;
    } else if (quadrant.first) {
      diameter = getCorner.bottomLeft;
    }
    return diameter * 2;
  }

  _appendRipple(target, parent) {
    const FIX_ADD_RIPPLE_EFFECT = 50; // delay for active animations
    parent.appendChild(target);
    setTimeout(() => {
      Manipulator.addClass(target, "opacity-0 scale-100");
    }, FIX_ADD_RIPPLE_EFFECT);
  }

  _toggleUnbound(target) {
    if (this._options.rippleUnbound === true) {
      Manipulator.addClass(target, this._classes.unbound);
    } else {
      Manipulator.removeClass(target, this._classes.unbound);
    }
  }

  _addColor(target) {
    let rippleColor = this._options.rippleColor || "rgb(0,0,0)";

    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      rippleColor = this._options.rippleColorDark || this._options.rippleColor;
    }

    const IS_BOOTSTRAP_COLOR = BOOTSTRAP_COLORS.find(
      (color) => color.name === rippleColor.toLowerCase()
    );

    const rgbValue = IS_BOOTSTRAP_COLOR
      ? this._colorToRGB(IS_BOOTSTRAP_COLOR.gradientColor).join(",")
      : this._colorToRGB(rippleColor).join(",");

    const gradientImage = GRADIENT.split("{{color}}").join(`${rgbValue}`);
    target.style.backgroundImage = `radial-gradient(circle, ${gradientImage})`;
  }

  _colorToRGB(color) {
    function hexToRgb(color) {
      const HEX_COLOR_LENGTH = 7;
      const IS_SHORT_HEX = color.length < HEX_COLOR_LENGTH;
      if (IS_SHORT_HEX) {
        color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
      }
      return [
        parseInt(color.substr(1, 2), 16),
        parseInt(color.substr(3, 2), 16),
        parseInt(color.substr(5, 2), 16),
      ];
    }

    function namedColorsToRgba(color) {
      const tempElem = document.body.appendChild(
        document.createElement("fictum")
      );
      const flag = "rgb(1, 2, 3)";
      tempElem.style.color = flag;
      if (tempElem.style.color !== flag) {
        return DEFAULT_RIPPLE_COLOR;
      }
      tempElem.style.color = color;
      if (tempElem.style.color === flag || tempElem.style.color === "") {
        return DEFAULT_RIPPLE_COLOR;
      } // color parse failed
      color = getComputedStyle(tempElem).color;
      document.body.removeChild(tempElem);
      return color;
    }

    function rgbaToRgb(color) {
      color = color.match(/[.\d]+/g).map((a) => +Number(a));
      color.length = 3;
      return color;
    }

    if (color.toLowerCase() === "transparent") {
      return DEFAULT_RIPPLE_COLOR;
    }
    if (color[0] === "#") {
      return hexToRgb(color);
    }
    if (color.indexOf("rgb") === -1) {
      color = namedColorsToRgba(color);
    }
    if (color.indexOf("rgb") === 0) {
      return rgbaToRgb(color);
    }

    return DEFAULT_RIPPLE_COLOR;
  }

  // Static
  static autoInitial(instance) {
    return function (event) {
      instance._autoInit(event);
    };
  }

  static jQueryInterface(options) {
    return this.each(function () {
      const data = Data.getData(this, DATA_KEY);
      if (!data) {
        return new Ripple(this, options);
      }

      return null;
    });
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

export default Ripple;
