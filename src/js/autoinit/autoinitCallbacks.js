import EventHandler from "../dom/event-handler";
import SelectorEngine from "../dom/selector-engine";
import { isDisabled, getElementFromSelector, isVisible } from "../util";

const dropdownCallback = (component, initSelector) => {
  EventHandler.on(
    document,
    `click.te.${component.NAME}`,
    initSelector,
    function (event) {
      event.preventDefault();
      component.getOrCreateInstance(this).toggle();
    }
  );
};

const tabCallback = (component, initSelector) => {
  EventHandler.on(
    document,
    `click.te.${component.NAME}.data-api`,
    initSelector,
    function (event) {
      if (["A", "AREA"].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      const data = component.getOrCreateInstance(this);
      data.show();
    }
  );
};

const offcanvasCallback = (component, initSelector) => {
  EventHandler.on(
    document,
    `click.te.${component.NAME}.data-api`,
    initSelector,
    function (event) {
      const target = getElementFromSelector(this);

      if (["A", "AREA"].includes(this.tagName)) {
        event.preventDefault();
      }

      if (isDisabled(this)) {
        return;
      }

      EventHandler.one(target, component.EVENT_HIDDEN, () => {
        // focus on trigger when it is closed
        if (isVisible(this)) {
          this.focus();
        }
      });

      // avoid conflict when clicking a toggler of an offcanvas, while another is open
      const allReadyOpen = SelectorEngine.findOne(component.OPEN_SELECTOR);
      if (allReadyOpen && allReadyOpen !== target) {
        component.getInstance(allReadyOpen).hide();
      }

      const data = component.getOrCreateInstance(target);
      data.toggle(this);
    }
  );
};

const buttonCallback = (component, initSelector) => {
  EventHandler.on(
    document,
    `click.te.${component.NAME}`,
    initSelector,
    (event) => {
      event.preventDefault();

      const button = event.target.closest(initSelector);
      const data = component.getOrCreateInstance(button);

      data.toggle();
    }
  );
};

const modalCallback = (component, initSelector) => {
  EventHandler.on(
    document,
    `click.te.${component.NAME}`,
    initSelector,
    function (event) {
      const target = getElementFromSelector(this);

      if (["A", "AREA"].includes(this.tagName)) {
        event.preventDefault();
      }

      EventHandler.one(target, component.EVENT_SHOW, (showEvent) => {
        if (showEvent.defaultPrevented) {
          // only register focus restorer if modal will actually get shown
          return;
        }

        EventHandler.one(target, component.EVENT_HIDDEN, () => {
          if (isVisible(this)) {
            this.focus();
          }
        });
      });

      // avoid conflict when clicking moddal toggler while another one is open
      const allReadyOpen = SelectorEngine.findOne(
        `[${component.OPEN_SELECTOR}="true"]`
      );
      if (allReadyOpen) {
        component.getInstance(allReadyOpen).hide();
      }

      const data = component.getOrCreateInstance(target);

      data.toggle(this);
    }
  );
};

const rippleCallback = (component, initSelector) => {
  EventHandler.one(
    document,
    "mousedown",
    initSelector,
    component.autoInitial(new component())
  );
};

export {
  dropdownCallback,
  tabCallback,
  offcanvasCallback,
  buttonCallback,
  modalCallback,
  rippleCallback,
};
