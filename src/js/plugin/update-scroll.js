'use strict';

var instances = require('./instances');

var createDOMEvent = function (name) {
  var event = document.createEvent("Event");
  event.initEvent(name, true, true);
  return event;
};

module.exports = function (element, axis, value) {
  if (typeof element === 'undefined') {
    throw 'You must provide an element to the update-scroll function';
  }

  if (typeof axis === 'undefined') {
    throw 'You must provide an axis to the update-scroll function';
  }

  if (typeof value === 'undefined') {
    throw 'You must provide a value to the update-scroll function';
  }

  if (axis === 'top' && value <= 0) {
    element.scrollTop = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-y-reach-start'));
  }

  if (axis === 'left' && value <= 0) {
    element.scrollLeft = value = 0; // don't allow negative scroll
    element.dispatchEvent(createDOMEvent('ps-x-reach-start'));
  }

  var i = instances.get(element);

  if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
    // don't allow scroll past container
    value = i.contentHeight - i.containerHeight;
    if (value - element.scrollTop <= 2) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollTop;
    } else {
      element.scrollTop = value;
    }
    element.dispatchEvent(createDOMEvent('ps-y-reach-end'));
  }

  if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
    // don't allow scroll past container
    value = i.contentWidth - i.containerWidth;
    if (value - element.scrollLeft <= 2) {
      // mitigates rounding errors on non-subpixel scroll values
      value = element.scrollLeft;
    } else {
      element.scrollLeft = value;
    }
    element.dispatchEvent(createDOMEvent('ps-x-reach-end'));
  }

  if (i.lastTop === undefined) {
    i.lastTop = element.scrollTop;
  }

  if (i.lastLeft === undefined) {
    i.lastLeft = element.scrollLeft;
  }

  if (axis === 'top' && value < i.lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-up'));
  }

  if (axis === 'top' && value > i.lastTop) {
    element.dispatchEvent(createDOMEvent('ps-scroll-down'));
  }

  if (axis === 'left' && value < i.lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-left'));
  }

  if (axis === 'left' && value > i.lastLeft) {
    element.dispatchEvent(createDOMEvent('ps-scroll-right'));
  }

  if (axis === 'top' && value !== i.lastTop) {
    element.scrollTop = i.lastTop = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-y'));
  }

  if (axis === 'left' && value !== i.lastLeft) {
    element.scrollLeft = i.lastLeft = value;
    element.dispatchEvent(createDOMEvent('ps-scroll-x'));
  }

};
