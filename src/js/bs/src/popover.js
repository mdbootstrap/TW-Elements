/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { defineJQueryPlugin } from './util/index';
import Tooltip from './tooltip';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'popover';
const DATA_KEY = 'te.popover';
const EVENT_KEY = `.${DATA_KEY}`;
const CLASS_PREFIX = 'te-popover';

const Default = {
  ...Tooltip.Default,
  placement: 'right',
  offset: [0, 8],
  trigger: 'click',
  content: '',
  template:
    '<div class="opacity-0 transition-opacity duration-300 ease-in-out absolute top-0 left-0 z-[1070] block max-w-[267px] break-words bg-white bg-clip-padding border-0 rounded-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal" role="tooltip">' +
    '<h3 class="popover-header py-2 px-4 mb-0 bg-white border border-solid rounded-t-lg font-medium empty:hidden"></h3>' +
    '<div class="popover-body p-4 text-[#212529]"></div>' +
    '</div>',
};

const DefaultType = {
  ...Tooltip.DefaultType,
  content: '(string|element|function)',
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

const SELECTOR_TITLE = '.popover-header';
const SELECTOR_CONTENT = '.popover-body';

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
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

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    });
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .Popover to jQuery only if jQuery is present
 */

defineJQueryPlugin(Popover);

export default Popover;
