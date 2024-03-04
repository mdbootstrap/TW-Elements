import Tooltip from "./tooltip";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "popover";
const DATA_KEY = "twe.popover";
const EVENT_KEY = `.${DATA_KEY}`;
const CLASS_PREFIX = "te-popover";

const Default = {
  ...Tooltip.Default,
  placement: "right",
  offset: [0, 8],
  trigger: "click",
  content: "",
  template: `
    <div class="opacity-0 transition-opacity duration-150 ease-in-out absolute top-0 left-0 z-[1070] block max-w-[267px] break-words bg-white bg-clip-padding border border-neutral-100 rounded-lg shadow-2 text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal dark:border-white/10 dark:bg-surface-dark dark:text-white data-[popper-reference-hidden]:hidden" role="tooltip">
      <h3 data-twe-popover-header-ref class="py-2 px-4 mb-0 border-b-2 border-neutral-100 rounded-t-lg font-medium empty:hidden dark:border-white/10"></h3>
      <div data-twe-popover-body-ref class="p-4 text-surface dark:text-white"></div>
    </div>
    `,
};

const DefaultType = {
  ...Tooltip.DefaultType,
  content: "(string|element|function)",
};

const Event = {
  HIDE: `hide${EVENT_KEY}`,
  HIDDEN: `hidden${EVENT_KEY}`,
  SHOW: `show${EVENT_KEY}`,
  SHOWN: `shown${EVENT_KEY}`,
  INSERTED: `inserted${EVENT_KEY}`,
  CLICK: `click${EVENT_KEY}`,
  FOCUSIN: `focusin${EVENT_KEY}`,
  FOCUSOUT: `focusout${EVENT_KEY}`,
  MOUSEENTER: `mouseenter${EVENT_KEY}`,
  MOUSELEAVE: `mouseleave${EVENT_KEY}`,
};

const SELECTOR_TITLE = "[data-twe-popover-header-ref]";
const SELECTOR_CONTENT = "[data-twe-popover-body-ref]";

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Popover extends Tooltip {
  // Getters

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  static get Event() {
    return Event;
  }

  static get DefaultType() {
    return DefaultType;
  }

  // Overrides

  isWithContent() {
    return this.getTitle() || this._getContent();
  }

  setContent(tip) {
    this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);
    this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
  }

  // Private

  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }

  _getBasicClassPrefix() {
    return CLASS_PREFIX;
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config);

      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }
}

export default Popover;
