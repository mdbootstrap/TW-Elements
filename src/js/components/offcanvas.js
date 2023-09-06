/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

import { typeCheckConfig } from "../util/index";
import ScrollBarHelper from "../util/scrollbar";
import EventHandler from "../dom/event-handler";
import BaseComponent from "../base-component";
import SelectorEngine from "../dom/selector-engine";
import Manipulator from "../dom/manipulator";
import Backdrop from "../util/backdrop";
import FocusTrap from "../util/focusTrap";
import { enableDismissTrigger } from "../util/component-functions";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "offcanvas";
const DATA_KEY = "te.offcanvas";
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = ".data-api";
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
const ESCAPE_KEY = "Escape";

const Default = {
  backdrop: true,
  keyboard: true,
  scroll: false,
};

const DefaultType = {
  backdrop: "boolean",
  keyboard: "boolean",
  scroll: "boolean",
};

const CLASS_NAME_SHOW = "show";
const OPEN_SELECTOR = "[data-te-offcanvas-init][data-te-offcanvas-show]";

const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element);

    this._config = this._getConfig(config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._addEventListeners();
    this._didInit = false;
    this._init();
  }

  // Getters

  static get NAME() {
    return NAME;
  }

  static get Default() {
    return Default;
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget,
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;
    this._element.style.visibility = "visible";

    this._backdrop.show();

    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }

    this._element.removeAttribute("aria-hidden");
    this._element.setAttribute("aria-modal", true);
    this._element.setAttribute("role", "dialog");
    this._element.setAttribute(`data-te-offcanvas-${CLASS_NAME_SHOW}`, "");

    const completeCallBack = () => {
      if (!this._config.scroll) {
        this._focustrap.trap();
      }

      EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget });
    };

    this._queueCallback(completeCallBack, this._element, true);
  }

  hide() {
    if (!this._isShown) {
      return;
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    this._focustrap.disable();
    this._element.blur();
    this._isShown = false;
    this._element.removeAttribute(`data-te-offcanvas-${CLASS_NAME_SHOW}`);
    this._backdrop.hide();

    const completeCallback = () => {
      this._element.setAttribute("aria-hidden", true);
      this._element.removeAttribute("aria-modal");
      this._element.removeAttribute("role");
      this._element.style.visibility = "hidden";

      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }

      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };

    this._queueCallback(completeCallback, this._element, true);
  }

  dispose() {
    this._backdrop.dispose();
    this._focustrap.disable();
    super.dispose();
  }

  // Private
  _init() {
    if (this._didInit) {
      return;
    }

    EventHandler.on(window, EVENT_LOAD_DATA_API, () =>
      SelectorEngine.find(OPEN_SELECTOR).forEach((el) =>
        Offcanvas.getOrCreateInstance(el).show()
      )
    );

    this._didInit = true;
    enableDismissTrigger(Offcanvas);
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === "object" ? config : {}),
    };
    typeCheckConfig(NAME, config, DefaultType);
    return config;
  }

  _initializeBackDrop() {
    return new Backdrop({
      isVisible: this._config.backdrop,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: () => this.hide(),
    });
  }

  _initializeFocusTrap() {
    return new FocusTrap(this._element, {
      event: "keydown",
      condition: (event) => event.key === "Tab",
    });
  }

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
      if (this._config.keyboard && event.key === ESCAPE_KEY) {
        this.hide();
      }
    });
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config);

      if (typeof config !== "string") {
        return;
      }

      if (
        data[config] === undefined ||
        config.startsWith("_") ||
        config === "constructor"
      ) {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](this);
    });
  }
}

export default Offcanvas;
