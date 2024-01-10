/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

import EventHandler from "../dom/event-handler";
import SelectorEngine from "../dom/selector-engine";
import {
  isDisabled,
  getElementFromSelector,
  isVisible,
  getSelectorFromElement,
} from "../util";

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

const collapseCallback = (component, initSelector) => {
  EventHandler.on(
    document,
    `click.te.${component.NAME}.data-api`,
    initSelector,
    function (event) {
      // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
      if (
        event.target.tagName === "A" ||
        (event.delegateTarget && event.delegateTarget.tagName === "A")
      ) {
        event.preventDefault();
      }

      const selector = getSelectorFromElement(this);
      const selectorElements = SelectorEngine.find(selector);

      selectorElements.forEach((element) => {
        component.getOrCreateInstance(element, { toggle: false }).toggle();
      });
    }
  );
};

const tooltipsCallback = (component, initSelector) => {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll(initSelector)
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new component(tooltipTriggerEl);
  });
};

const popoverCallback = (component, initSelector) => {
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll(initSelector)
  );
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new component(popoverTriggerEl);
  });
};

const lightboxCallback = (component, initSelector) => {
  SelectorEngine.find(initSelector).forEach((element) => {
    new component(element);
  });
  EventHandler.on(
    document,
    `click.te.${component.NAME}.data-api`,
    `${initSelector} img:not([data-te-lightbox-disabled])`,
    component.toggle()
  );
};

export {
  dropdownCallback,
  tabCallback,
  offcanvasCallback,
  buttonCallback,
  modalCallback,
  rippleCallback,
  collapseCallback,
  tooltipsCallback,
  popoverCallback,
  lightboxCallback,
};
