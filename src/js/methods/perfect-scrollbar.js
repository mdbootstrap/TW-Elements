/* eslint-disable no-restricted-globals */
import PerfectScrollbar from "perfect-scrollbar";

import { getjQuery, typeCheckConfig, onDOMContentLoaded } from "../util/index";
import Data from "../dom/data";
import Manipulator from "../dom/manipulator";
import EventHandler from "../dom/event-handler";
import SelectorEngine from "../dom/selector-engine";

const NAME = "perfectScrollbar";
const CLASSNAME_PS = "perfect-scrollbar";
const DATA_KEY = "te.perfectScrollbar";
const TE_NAME = "te";
const PS_NAME = "ps";

const EVENTS = [
  { te: `scrollX.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-x" },
  { te: `scrollY.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-y" },
  { te: `scrollUp.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-up" },
  { te: `scrollDown.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-down" },
  { te: `scrollLeft.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-left" },
  { te: `scrollRight.${TE_NAME}.${PS_NAME}`, ps: "ps-scroll-right" },
  { te: `scrollXEnd.${TE_NAME}.${PS_NAME}`, ps: "ps-x-reach-end" },
  { te: `scrollYEnd.${TE_NAME}.${PS_NAME}`, ps: "ps-y-reach-end" },
  { te: `scrollXStart.${TE_NAME}.${PS_NAME}`, ps: "ps-x-reach-start" },
  { te: `scrollYStart.${TE_NAME}.${PS_NAME}`, ps: "ps-y-reach-start" },
];

const PERFECT_SCROLLBAR_INIT = "data-te-perfect-scrollbar-init";

const Default = {
  handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
  wheelSpeed: 1,
  wheelPropagation: true,
  swipeEasing: true,
  minScrollbarLength: null,
  maxScrollbarLength: null,
  scrollingThreshold: 1000,
  useBothWheelAxes: false,
  suppressScrollX: false,
  suppressScrollY: false,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
};

const DefaultType = {
  handlers: "(string|array)",
  wheelSpeed: "number",
  wheelPropagation: "boolean",
  swipeEasing: "boolean",
  minScrollbarLength: "(number|null)",
  maxScrollbarLength: "(number|null)",
  scrollingThreshold: "number",
  useBothWheelAxes: "boolean",
  suppressScrollX: "boolean",
  suppressScrollY: "boolean",
  scrollXMarginOffset: "number",
  scrollYMarginOffset: "number",
};

const DefaultClasses = {
  ps: "group/ps overflow-hidden [overflow-anchor:none] touch-none",
  railX:
    "group/x absolute bottom-0 h-[0.9375rem] hidden opacity-0 transition-[background-color,_opacity] duration-200 ease-linear motion-reduce:transition-none z-[1035] group-[&.ps--active-x]/ps:block group-[&.ps--active-x]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-x]/ps:opacity-60 hover:!opacity-90 hover:!bg-[#eee] focus:!opacity-90 focus:!bg-[#eee] [&.ps--clicking]:!opacity-90 [&.ps--clicking]:!bg-[#eee] outline-none",
  railXThumb:
    "absolute bottom-0.5 rounded-md h-1.5 opacity-0 group-hover/ps:opacity-100 group-focus/ps:opacity-100 group-active/ps:opacity-100 bg-[#aaa] [transition:background-color_.2s_linear,_height_.2s_ease-in-out] group-hover/x:bg-[#999] group-hover/x:h-[11px] group-focus/x:bg-[#999] group-focus/x:h-[0.6875rem] group-[&.ps--clicking]/x:bg-[#999] group-[&.ps--clicking]/x:h-[11px] outline-none",
  railY:
    "group/y absolute right-0 w-[0.9375rem] hidden opacity-0 transition-[background-color,_opacity] duration-200 ease-linear motion-reduce:transition-none z-[1035] group-[&.ps--active-y]/ps:block group-[&.ps--active-y]/ps:bg-transparent group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-y]/ps:opacity-60 hover:!opacity-90 hover:!bg-[#eee] focus:!opacity-90 focus:!bg-[#eee] [&.ps--clicking]:!opacity-90 [&.ps--clicking]:!bg-[#eee] outline-none",
  railYThumb:
    "absolute right-0.5 rounded-md w-1.5 opacity-0 group-hover/ps:opacity-100 group-focus/ps:opacity-100 group-active/ps:opacity-100 bg-[#aaa] [transition:background-color_.2s_linear,_width_.2s_ease-in-out] group-hover/y:bg-[#999] group-hover/y:w-[11px] group-focus/y:bg-[#999] group-focus/y:w-[0.6875rem] group-[&.ps--clicking]/y:bg-[#999] group-[&.ps--clicking]/y:w-[11px] outline-none",
};

const DefaultClassesType = {
  ps: "string",
  railX: "string",
  railXThumb: "string",
  railY: "string",
  railYThumb: "string",
};

class PerfectScrollbars {
  constructor(element, options = {}, classes = {}) {
    this._element = element;
    this._options = this._getConfig(options);
    this._classes = this._getClasses(classes);
    this.perfectScrollbar = null;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
      Manipulator.addClass(this._element, CLASSNAME_PS);
    }

    this.init();
  }

  // Getters
  static get NAME() {
    return NAME;
  }

  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);

    if (dataAttributes.handlers !== undefined) {
      dataAttributes.handlers = dataAttributes.handlers.split(" ");
    }

    config = {
      ...Default,
      ...dataAttributes,
      ...config,
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

  // Public
  dispose() {
    Data.removeData(this._element, DATA_KEY);
    this._element = null;
    this._dataAttrOptions = null;
    this._options = null;
    this.perfectScrollbar.destroy();
    this.removeEvent(EVENTS);
    this.perfectScrollbar = null;
  }

  init() {
    this.perfectScrollbar = new PerfectScrollbar(this._element, this._options);
    this._addPerfectScrollbarStyles();
    this.perfectScrollbar.update();
    this._initEvents(EVENTS);
  }

  update() {
    return this.perfectScrollbar.update();
  }

  _initEvents(events = []) {
    events.forEach(({ ps, te }) =>
      EventHandler.on(this._element, ps, (e) =>
        EventHandler.trigger(this._element, te, { e })
      )
    );
  }

  _addPerfectScrollbarStyles() {
    const classes = [
      { ps: "ps__rail-x", te: this._classes.railX },
      { ps: "ps__rail-y", te: this._classes.railY },
      { ps: "ps__thumb-x", te: this._classes.railXThumb },
      { ps: "ps__thumb-y", te: this._classes.railYThumb },
    ];

    classes.forEach((item) => {
      const container = SelectorEngine.findOne(`.${item.ps}`, this._element);
      Manipulator.addClass(container, item.te);
      if (item.ps.includes("rail-x")) {
        console.log();
        container.style.transform = `translateY(calc(-100% + ${getComputedStyle(
          this._element
        ).getPropertyValue("height")}))`;
      }
      if (item.ps.includes("rail-y")) {
        container.style.transform = `translateX(calc(-100% + ${getComputedStyle(
          this._element
        ).getPropertyValue("width")}))`;
      }

      Manipulator.removeClass(
        SelectorEngine.findOne(`.${item.ps}`, this._element),
        item.ps
      );
    });
    Manipulator.addClass(this._element, this._classes.ps);
    Manipulator.removeClass(this._element, "ps");
  }

  removeEvent(event) {
    let filter = [];

    if (typeof event === "string") {
      filter = EVENTS.filter(({ te }) => te === event);
    }

    filter.forEach(({ ps, te }) => {
      EventHandler.off(this._element, ps);
      EventHandler.off(this._element, te);
    });
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      let data = Data.getData(this, DATA_KEY);
      const _config = typeof config === "object" && config;

      if (!data && /dispose|hide/.test(config)) {
        return;
      }

      if (!data) {
        data = new PerfectScrollbars(this, _config);
      }

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
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

SelectorEngine.find(`[${PERFECT_SCROLLBAR_INIT}]`).forEach((scroll) => {
  let instance = PerfectScrollbars.getInstance(scroll);
  if (!instance) {
    instance = new PerfectScrollbars(scroll);
  }
  return instance;
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .perfectScrollbar to jQuery only if jQuery is present
 */

onDOMContentLoaded(() => {
  const $ = getjQuery();

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = PerfectScrollbars.jQueryInterface;
    $.fn[NAME].Constructor = PerfectScrollbars;
    $.fn[NAME].noConflict = () => {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return PerfectScrollbars.jQueryInterface;
    };
  }
});

export default PerfectScrollbars;
