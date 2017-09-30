class EventElement {
  constructor(element) {
    this.element = element;
    this.handlers = {};
  }

  bind(eventName, handler) {
    if (typeof this.handlers[eventName] === 'undefined') {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
    this.element.addEventListener(eventName, handler, false);
  }

  unbind(eventName, target) {
    this.handlers[eventName] = this.handlers[eventName].filter(handler => {
      if (target && handler !== target) {
        return true;
      }
      this.element.removeEventListener(eventName, handler, false);
      return false;
    });
  }

  unbindAll() {
    for (const name in this.handlers) {
      this.unbind(name);
    }
  }
}

export default class EventManager {
  constructor() {
    this.eventElements = [];
  }

  eventElement(element) {
    let e = this.eventElements.filter(ee => ee.element === element)[0];
    if (!e) {
      e = new EventElement(element);
      this.eventElements.push(e);
    }
    return e;
  }

  bind(element, eventName, handler) {
    this.eventElement(element).bind(eventName, handler);
  }

  unbind(element, eventName, handler) {
    this.eventElement(element).unbind(eventName, handler);
  }

  unbindAll() {
    this.eventElements.forEach(e => e.unbindAll());
  }

  once(element, eventName, handler) {
    const ee = this.eventElement(element);
    const onceHandler = evt => {
      ee.unbind(eventName, onceHandler);
      handler(evt);
    };
    ee.bind(eventName, onceHandler);
  }
}
