import { isRTL, reflow, typeCheckConfig } from "../../util/index";
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import ScrollBarHelper from "../../util/scrollbar";
import BaseComponent from "../../base-component";
import Backdrop from "../../util/backdrop";
import FocusTrap from "../../util/focusTrap";

import { enableDismissTrigger } from "../../util/component-functions";
import { getTransitionDurationFromElement } from "../../util/index";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "modal";
const DATA_KEY = "twe.modal";
const EVENT_KEY = `.${DATA_KEY}`;
const ESCAPE_KEY = "Escape";

const Default = {
  backdrop: true,
  keyboard: true,
  focus: true,
};

const DefaultType = {
  backdrop: "(boolean|string)",
  keyboard: "boolean",
  focus: "boolean",
};

const DefaultClasses = {
  show: "transform-none",
  static: "scale-[1.02]",
  staticProperties: "transition-scale duration-300 ease-in-out",
  backdrop:
    "opacity-50 transition-all duration-300 ease-in-out fixed top-0 left-0 z-[1040] bg-black w-screen h-screen",
};

const DefaultClassesType = {
  show: "string",
  static: "string",
  staticProperties: "string",
  backdrop: "string",
};

const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;

const OPEN_SELECTOR_BODY = "data-twe-modal-open";
const OPEN_SELECTOR = "data-twe-open";
const SELECTOR_DIALOG = "[data-twe-modal-dialog-ref]";
const SELECTOR_MODAL_BODY = "[data-twe-modal-body-ref]";

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class Modal extends BaseComponent {
  constructor(element, config, classes) {
    super(element);

    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._scrollBar = new ScrollBarHelper();

    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._isShown = false;
    this._ignoreBackdropClick = false;
    this._isTransitioning = false;
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

  static get getDefaultType() {
    return DefaultType;
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }

  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
      relatedTarget,
    });

    if (showEvent.defaultPrevented) {
      return;
    }

    this._isShown = true;

    if (this._isAnimated()) {
      this._isTransitioning = true;
    }

    this._scrollBar.hide();

    document.body.setAttribute(OPEN_SELECTOR_BODY, "true");

    this._adjustDialog();

    this._setEscapeEvent();
    this._setResizeEvent();

    EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
      EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, (event) => {
        if (event.target === this._element) {
          this._ignoreBackdropClick = true;
        }
      });
    });
    this._showElement(relatedTarget);
    this._showBackdrop();
  }

  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

    if (hideEvent.defaultPrevented) {
      return;
    }

    this._isShown = false;
    const isAnimated = this._isAnimated();

    if (isAnimated) {
      this._isTransitioning = true;
    }

    this._setEscapeEvent();
    this._setResizeEvent();

    this._focustrap.disable();

    const modalDialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    modalDialog.classList.remove(this._classes.show);

    EventHandler.off(this._element, EVENT_CLICK_DISMISS);
    EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

    this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    this._element.removeAttribute(OPEN_SELECTOR);
  }

  dispose() {
    [window, document, this._dialog].forEach((htmlElement) =>
      EventHandler.off(htmlElement, EVENT_KEY)
    );

    this._backdrop.dispose();
    this._focustrap.disable();

    super.dispose();
  }

  handleUpdate() {
    this._adjustDialog();
  }

  // Private

  _init() {
    if (this._didInit) {
      return;
    }

    enableDismissTrigger(Modal);

    this._didInit = true;
  }

  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop), // 'static' option will be translated to true, and booleans will keep their value
      isAnimated: this._isAnimated(),
      backdropClasses: this._classes.backdrop,
    });
  }

  _initializeFocusTrap() {
    return new FocusTrap(this._element, {
      event: "keydown",
      condition: (event) => event.key === "Tab",
    });
  }

  _showElement(relatedTarget) {
    const isAnimated = this._isAnimated();
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

    if (
      !this._element.parentNode ||
      this._element.parentNode.nodeType !== Node.ELEMENT_NODE
    ) {
      // Don't move modal's DOM position
      document.body.append(this._element);
    }

    this._element.style.display = "block";
    this._element.classList.remove("hidden");
    this._element.removeAttribute("aria-hidden");
    this._element.setAttribute("aria-modal", true);
    this._element.setAttribute("role", "dialog");
    this._element.setAttribute(`${OPEN_SELECTOR}`, "true");
    this._element.scrollTop = 0;

    const modalDialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);

    modalDialog.classList.add(this._classes.show);
    modalDialog.classList.remove("opacity-0");
    modalDialog.classList.add("opacity-100");

    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    if (isAnimated) {
      reflow(this._element);
    }

    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.trap();
      }

      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN, {
        relatedTarget,
      });
    };

    this._queueCallback(transitionComplete, this._dialog, isAnimated);
  }

  _setEscapeEvent() {
    if (this._isShown) {
      EventHandler.on(document, EVENT_KEYDOWN_DISMISS, (event) => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          event.preventDefault();
          this.hide();
        } else if (!this._config.keyboard && event.key === ESCAPE_KEY) {
          this._triggerBackdropTransition();
        }
      });
    } else {
      EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS);
    }
  }

  _setResizeEvent() {
    if (this._isShown) {
      EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
    } else {
      EventHandler.off(window, EVENT_RESIZE);
    }
  }

  _hideModal() {
    const modalDialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    modalDialog.classList.remove(this._classes.show);
    modalDialog.classList.remove("opacity-100");
    modalDialog.classList.add("opacity-0");
    const transitionTime = getTransitionDurationFromElement(modalDialog);

    setTimeout(() => {
      this._element.style.display = "none";
    }, transitionTime);

    this._element.setAttribute("aria-hidden", true);
    this._element.removeAttribute("aria-modal");
    this._element.removeAttribute("role");
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.removeAttribute(OPEN_SELECTOR_BODY);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    });
  }

  _showBackdrop(callback) {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, (event) => {
      if (this._ignoreBackdropClick) {
        this._ignoreBackdropClick = false;
        return;
      }

      if (event.target !== event.currentTarget) {
        return;
      }

      if (this._config.backdrop === true) {
        this.hide();
      } else if (this._config.backdrop === "static") {
        this._triggerBackdropTransition();
      }
    });

    this._backdrop.show(callback);
  }

  _isAnimated() {
    const animate = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    return !!animate;
  }

  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    if (hideEvent.defaultPrevented) {
      return;
    }

    const { classList, scrollHeight, style } = this._element;
    const isModalOverflowing =
      scrollHeight > document.documentElement.clientHeight;

    // return if the following background transition hasn't yet completed
    if (
      (!isModalOverflowing && style.overflowY === "hidden") ||
      classList.contains(this._classes.static)
    ) {
      return;
    }

    if (!isModalOverflowing) {
      style.overflowY = "hidden";
    }

    classList.add(...this._classes.static.split(" "));
    classList.add(...this._classes.staticProperties.split(" "));

    const transisitionTime = getTransitionDurationFromElement(this._element);

    this._queueCallback(() => {
      classList.remove(this._classes.static);

      setTimeout(() => {
        classList.remove(...this._classes.staticProperties.split(" "));
      }, transisitionTime);

      if (!isModalOverflowing) {
        this._queueCallback(() => {
          style.overflowY = "";
        }, this._dialog);
      }
    }, this._dialog);

    this._element.focus();
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

  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------

  _adjustDialog() {
    const isModalOverflowing =
      this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;

    if (
      (!isBodyOverflowing && isModalOverflowing && !isRTL()) ||
      (isBodyOverflowing && !isModalOverflowing && isRTL())
    ) {
      this._element.style.paddingLeft = `${scrollbarWidth}px`;
    }

    if (
      (isBodyOverflowing && !isModalOverflowing && !isRTL()) ||
      (!isBodyOverflowing && isModalOverflowing && isRTL())
    ) {
      this._element.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  _resetAdjustments() {
    this._element.style.paddingLeft = "";
    this._element.style.paddingRight = "";
  }

  // Static

  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);

      if (typeof config !== "string") {
        return;
      }

      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config](relatedTarget);
    });
  }
}

export default Modal;
