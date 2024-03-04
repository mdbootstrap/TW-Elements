import {
  getElement,
  getSelectorFromElement,
  typeCheckConfig,
} from "../../util/index";
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";
import MDBManipulator from "../../dom/manipulator";
import SelectorEngine from "../../dom/selector-engine";
import BaseComponent from "../../base-component";

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const NAME = "scrollspy";
const DATA_KEY = "twe.scrollspy";
const EVENT_KEY = `.${DATA_KEY}`;

const Default = {
  offset: 10,
  method: "auto",
  target: "",
};

const DefaultType = {
  offset: "number",
  method: "string",
  target: "(string|element)",
};

const DefaultClasses = {
  active:
    "!text-primary font-semibold border-s-[0.125rem] border-solid border-primary",
};

const DefaultClassesType = {
  active: "string",
};

const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
const EVENT_SCROLL = `scroll${EVENT_KEY}`;

const LINK_ACTIVE = "data-twe-nav-link-active";
const LINK_COLLAPSIBLE = "data-twe-collapsible-scrollspy-ref";
const SELECTOR_DROPDOWN_ITEM = "[data-twe-dropdown-item-ref]";
const SELECTOR_NAV_LIST_GROUP = "[data-twe-nav-list-ref]";
const SELECTOR_NAV_LINKS = "[data-twe-nav-link-ref]";
const SELECTOR_NAV_ITEMS = "[data-twe-nav-item-ref]";
const SELECTOR_LIST_ITEMS = "[data-twe-list-group-item-ref]";
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, ${SELECTOR_DROPDOWN_ITEM}`;
const SELECTOR_DROPDOWN = "[data-twe-dropdown-ref]";
const SELECTOR_DROPDOWN_TOGGLE = "[data-twe-dropdown-toggle-ref]";
const SELECTOR_COLLAPSIBLE_SCROLLSPY = `[${LINK_COLLAPSIBLE}]`;
const SELECTOR_ACTIVE = `[${LINK_ACTIVE}]`;
const SELECTOR_LIST = "ul";

const METHOD_OFFSET = "maxOffset";
const METHOD_POSITION = "position";

/*
------------------------------------------------------------------------
Class Definition
------------------------------------------------------------------------
*/

class ScrollSpy extends BaseComponent {
  constructor(element, config, classes) {
    super(element);
    this._scrollElement =
      this._element.tagName === "BODY" ? window : this._element;
    this._config = this._getConfig(config);
    this._classes = this._getClasses(classes);
    this._offsets = [];
    this._targets = [];
    this._collapsibles = [];

    this._activeTarget = null;
    this._scrollHeight = 0;

    EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());

    this.refresh();
    this._process();

    this._bindActivateEvent();
    this._getCollapsibles();

    if (this._collapsibles.length === 0) {
      return;
    }

    this._showSubsection();
    this._hideSubsection();
  }

  // Getters

  static get Default() {
    return Default;
  }

  static get NAME() {
    return NAME;
  }

  // Public

  refresh() {
    const autoMethod =
      this._scrollElement === this._scrollElement.window
        ? METHOD_OFFSET
        : METHOD_POSITION;

    const offsetMethod =
      this._config.method === "auto" ? autoMethod : this._config.method;

    const offsetBase =
      offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;

    this._offsets = [];
    this._targets = [];
    this._scrollHeight = this._getScrollHeight();

    const targets = SelectorEngine.find(
      SELECTOR_LINK_ITEMS,
      this._config.target
    );

    targets
      .map((element) => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector
          ? SelectorEngine.findOne(targetSelector)
          : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();
          if (targetBCR.width || targetBCR.height) {
            return [
              Manipulator[offsetMethod](target).top + offsetBase,
              targetSelector,
            ];
          }
        }

        return null;
      })
      .filter((item) => item)
      .sort((a, b) => a[0] - b[0])
      .forEach((item) => {
        this._offsets.push(item[0]);
        this._targets.push(item[1]);
      });
  }

  dispose() {
    EventHandler.off(this._scrollElement, EVENT_KEY);
    EventHandler.off(this._scrollElement, EVENT_ACTIVATE);

    super.dispose();
  }

  // Private
  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === "object" && config ? config : {}),
    };

    config.target = getElement(config.target) || document.documentElement;

    typeCheckConfig(NAME, config, DefaultType);

    return config;
  }

  _getClasses(classes) {
    const dataAttributes = MDBManipulator.getDataClassAttributes(this._element);

    classes = {
      ...DefaultClasses,
      ...dataAttributes,
      ...classes,
    };

    typeCheckConfig(NAME, classes, DefaultClassesType);

    return classes;
  }

  _getScrollTop() {
    return this._scrollElement === window
      ? this._scrollElement.pageYOffset
      : this._scrollElement.scrollTop;
  }

  _getScrollHeight() {
    return (
      this._scrollElement.scrollHeight ||
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
    );
  }

  _getOffsetHeight() {
    return this._scrollElement === window
      ? window.innerHeight
      : this._scrollElement.getBoundingClientRect().height;
  }

  _process() {
    const scrollTop = this._getScrollTop() + this._config.offset;
    const scrollHeight = this._getScrollHeight();
    const maxScroll =
      this._config.offset + scrollHeight - this._getOffsetHeight();

    if (this._scrollHeight !== scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      const target = this._targets[this._targets.length - 1];

      if (this._activeTarget !== target) {
        this._activate(target);
      }

      return;
    }

    if (
      this._activeTarget &&
      scrollTop < this._offsets[0] &&
      this._offsets[0] > 0
    ) {
      this._activeTarget = null;
      this._clear();
      return;
    }

    for (let i = this._offsets.length; i--; ) {
      const isActiveTarget =
        this._activeTarget !== this._targets[i] &&
        scrollTop >= this._offsets[i] &&
        (typeof this._offsets[i + 1] === "undefined" ||
          scrollTop < this._offsets[i + 1]);

      if (isActiveTarget) {
        this._activate(this._targets[i]);
      }
    }
  }

  _activate(target) {
    this._activeTarget = target;

    this._clear();

    const queries = SELECTOR_LINK_ITEMS.split(",").map(
      (selector) =>
        `${selector}[data-twe-target="${target}"],${selector}[href="${target}"]`
    );

    const link = SelectorEngine.findOne(queries.join(","), this._config.target);

    link.classList.add(...this._classes.active.split(" "));
    link.setAttribute(LINK_ACTIVE, "");

    if (link.getAttribute(SELECTOR_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(
        SELECTOR_DROPDOWN_TOGGLE,
        link.closest(SELECTOR_DROPDOWN)
      ).classList.add(...this._classes.active.split(" "));
    } else {
      SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP).forEach(
        (listGroup) => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(
            listGroup,
            `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`
          ).forEach((item) => {
            item.classList.add(...this._classes.active.split(" "));
            item.setAttribute(LINK_ACTIVE, "");
          });

          // Handle special case when .nav-link is inside .nav-item
          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(
            (navItem) => {
              SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(
                (item) => item.classList.add(...this._classes.active.split(" "))
              );
            }
          );
        }
      );
    }

    EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
      relatedTarget: target,
    });
  }

  _clear() {
    SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target)
      .filter((node) =>
        node.classList.contains(...this._classes.active.split(" "))
      )
      .forEach((node) => {
        node.classList.remove(...this._classes.active.split(" "));
        node.removeAttribute(LINK_ACTIVE);
      });
  }

  _hide(target) {
    const itemsToHide = SelectorEngine.findOne(
      SELECTOR_LIST,
      target.parentNode
    );
    itemsToHide.style.overflow = "hidden";
    itemsToHide.style.height = `${0}px`;
  }

  _show(target, destinedHeight) {
    target.style.height = destinedHeight;
  }

  _getCollapsibles() {
    const collapsibleElements = SelectorEngine.find(
      SELECTOR_COLLAPSIBLE_SCROLLSPY
    );

    if (!collapsibleElements) {
      return;
    }

    collapsibleElements.forEach((collapsibleElement) => {
      const listParent = collapsibleElement.parentNode;
      const list = SelectorEngine.findOne(SELECTOR_LIST, listParent);
      const listHeight = list.offsetHeight || list.scrollHeight;

      this._collapsibles.push({
        element: list,
        relatedTarget: collapsibleElement.getAttribute("href"),
        height: `${listHeight}px`,
      });
    });
  }

  _showSubsection() {
    const activeElements = SelectorEngine.find(SELECTOR_ACTIVE);
    const actives = activeElements.filter((active) => {
      return active.hasAttribute(LINK_COLLAPSIBLE);
    });

    actives.forEach((active) => {
      const list = SelectorEngine.findOne(SELECTOR_LIST, active.parentNode);
      const height = this._collapsibles.find((collapsible) => {
        return (collapsible.relatedTarget = active.getAttribute("href"));
      }).height;

      this._show(list, height);
    });
  }

  _hideSubsection() {
    const unactives = SelectorEngine.find(
      SELECTOR_COLLAPSIBLE_SCROLLSPY
    ).filter((collapsible) => {
      return collapsible.hasAttribute(LINK_ACTIVE) === false;
    });
    unactives.forEach((unactive) => {
      this._hide(unactive);
    });
  }

  _bindActivateEvent() {
    EventHandler.on(this._element, EVENT_ACTIVATE, () => {
      this._showSubsection();
      this._hideSubsection();
    });
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);

      if (typeof config !== "string") {
        return;
      }

      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }

      data[config]();
    });
  }
}

export default ScrollSpy;
