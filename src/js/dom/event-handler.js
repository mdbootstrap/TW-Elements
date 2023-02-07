/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery } from "../util/index";

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const $ = getjQuery();
const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: "mouseover",
  mouseleave: "mouseout",
};
const nativeEvents = [
  "click",
  "dblclick",
  "mouseup",
  "mousedown",
  "contextmenu",
  "mousewheel",
  "DOMMouseScroll",
  "mouseover",
  "mouseout",
  "mousemove",
  "selectstart",
  "selectend",
  "keydown",
  "keypress",
  "keyup",
  "orientationchange",
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointerleave",
  "pointercancel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "focus",
  "blur",
  "change",
  "reset",
  "select",
  "submit",
  "focusin",
  "focusout",
  "load",
  "unload",
  "beforeunload",
  "resize",
  "move",
  "DOMContentLoaded",
  "readystatechange",
  "error",
  "abort",
  "scroll",
];

/**
 * ------------------------------------------------------------------------
 * Private methods
 * ------------------------------------------------------------------------
 */

function getUidEvent(element, uid) {
  return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++;
}

function getEvent(element) {
  const uid = getUidEvent(element);

  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};

  return eventRegistry[uid];
}

function bootstrapHandler(element, fn) {
  return function handler(event) {
    event.delegateTarget = element;

    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }

    return fn.apply(element, [event]);
  };
}

function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);

    for (
      let { target } = event;
      target && target !== this;
      target = target.parentNode
    ) {
      for (let i = domElements.length; i--; "") {
        if (domElements[i] === target) {
          event.delegateTarget = target;

          if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
          }

          return fn.apply(target, [event]);
        }
      }
    }

    // To please ESLint
    return null;
  };
}

function findHandler(events, handler, delegationSelector = null) {
  const uidEventList = Object.keys(events);

  for (let i = 0, len = uidEventList.length; i < len; i++) {
    const event = events[uidEventList[i]];

    if (
      event.originalHandler === handler &&
      event.delegationSelector === delegationSelector
    ) {
      return event;
    }
  }

  return null;
}

function normalizeParams(originalTypeEvent, handler, delegationFn) {
  const delegation = typeof handler === "string";
  const originalHandler = delegation ? delegationFn : handler;

  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  let typeEvent = originalTypeEvent.replace(stripNameRegex, "");
  const custom = customEvents[typeEvent];

  if (custom) {
    typeEvent = custom;
  }

  const isNative = nativeEvents.indexOf(typeEvent) > -1;

  if (!isNative) {
    typeEvent = originalTypeEvent;
  }

  return [delegation, originalHandler, typeEvent];
}

function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
  if (typeof originalTypeEvent !== "string" || !element) {
    return;
  }

  if (!handler) {
    handler = delegationFn;
    delegationFn = null;
  }

  const [delegation, originalHandler, typeEvent] = normalizeParams(
    originalTypeEvent,
    handler,
    delegationFn
  );
  const events = getEvent(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFn = findHandler(
    handlers,
    originalHandler,
    delegation ? handler : null
  );

  if (previousFn) {
    previousFn.oneOff = previousFn.oneOff && oneOff;

    return;
  }

  const uid = getUidEvent(
    originalHandler,
    originalTypeEvent.replace(namespaceRegex, "")
  );
  const fn = delegation
    ? bootstrapDelegationHandler(element, handler, delegationFn)
    : bootstrapHandler(element, handler);

  fn.delegationSelector = delegation ? handler : null;
  fn.originalHandler = originalHandler;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;

  element.addEventListener(typeEvent, fn, delegation);
}

function removeHandler(
  element,
  events,
  typeEvent,
  handler,
  delegationSelector
) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};

  Object.keys(storeElementEvent).forEach((handlerKey) => {
    if (handlerKey.indexOf(namespace) > -1) {
      const event = storeElementEvent[handlerKey];

      removeHandler(
        element,
        events,
        typeEvent,
        event.originalHandler,
        event.delegationSelector
      );
    }
  });
}

const EventHandler = {
  on(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, false);
  },

  one(element, event, handler, delegationFn) {
    addHandler(element, event, handler, delegationFn, true);
  },

  off(element, originalTypeEvent, handler, delegationFn) {
    if (typeof originalTypeEvent !== "string" || !element) {
      return;
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(
      originalTypeEvent,
      handler,
      delegationFn
    );
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getEvent(element);
    const isNamespace = originalTypeEvent.charAt(0) === ".";

    if (typeof originalHandler !== "undefined") {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!events || !events[typeEvent]) {
        return;
      }

      removeHandler(
        element,
        events,
        typeEvent,
        originalHandler,
        delegation ? handler : null
      );
      return;
    }

    if (isNamespace) {
      Object.keys(events).forEach((elementEvent) => {
        removeNamespacedHandlers(
          element,
          events,
          elementEvent,
          originalTypeEvent.slice(1)
        );
      });
    }

    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach((keyHandlers) => {
      const handlerKey = keyHandlers.replace(stripUidRegex, "");

      if (!inNamespace || originalTypeEvent.indexOf(handlerKey) > -1) {
        const event = storeElementEvent[keyHandlers];

        removeHandler(
          element,
          events,
          typeEvent,
          event.originalHandler,
          event.delegationSelector
        );
      }
    });
  },

  trigger(element, event, args) {
    if (typeof event !== "string" || !element) {
      return null;
    }

    const typeEvent = event.replace(stripNameRegex, "");
    const inNamespace = event !== typeEvent;
    const isNative = nativeEvents.indexOf(typeEvent) > -1;

    let jQueryEvent;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    let evt = null;

    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);

      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }

    if (isNative) {
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(typeEvent, bubbles, true);
    } else {
      evt = new CustomEvent(event, {
        bubbles,
        cancelable: true,
      });
    }

    // merge custom informations in our event
    if (typeof args !== "undefined") {
      Object.keys(args).forEach((key) => {
        Object.defineProperty(evt, key, {
          get() {
            return args[key];
          },
        });
      });
    }

    if (defaultPrevented) {
      evt.preventDefault();
    }

    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }

    if (evt.defaultPrevented && typeof jQueryEvent !== "undefined") {
      jQueryEvent.preventDefault();
    }

    return evt;
  },
};

export const EventHandlerMulti = {
  on(element, eventsName, handler, delegationFn) {
    const events = eventsName.split(" ");

    for (let i = 0; i < events.length; i++) {
      EventHandler.on(element, events[i], handler, delegationFn);
    }
  },
  off(element, originalTypeEvent, handler, delegationFn) {
    const events = originalTypeEvent.split(" ");

    for (let i = 0; i < events.length; i++) {
      EventHandler.off(element, events[i], handler, delegationFn);
    }
  },
};

export default EventHandler;
