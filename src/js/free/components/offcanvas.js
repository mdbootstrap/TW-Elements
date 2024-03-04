import { typeCheckConfig } from "../../util/index";
import ScrollBarHelper from "../../util/scrollbar";
import EventHandler from "../../dom/event-handler";
import BaseComponent from "../../base-component";
import SelectorEngine from "../../dom/selector-engine";
import Manipulator from "../../dom/manipulator";
import Backdrop from "../../util/backdrop";
import FocusTrap from "../../util/focusTrap";
import { enableDismissTrigger } from "../../util/component-functions";
import { TAB } from "../../util/keycodes";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "offcanvas";
const DATA_KEY = "twe.offcanvas";
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
const OPEN_SELECTOR = "[data-twe-offcanvas-init][data-twe-offcanvas-show]";

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
    this._element.setAttribute(`data-twe-offcanvas-${CLASS_NAME_SHOW}`, "");

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
    this._element.removeAttribute(`data-twe-offcanvas-${CLASS_NAME_SHOW}`);
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
      condition: (e) => e.keyCode === TAB,
      onlyVisible: true,
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
