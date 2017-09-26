import * as DOM from './dom';

export function toInt(x) {
  return parseInt(x, 10) || 0;
}

export function isEditable(el) {
  return (
    DOM.matches(el, 'input,[contenteditable]') ||
    DOM.matches(el, 'select,[contenteditable]') ||
    DOM.matches(el, 'textarea,[contenteditable]') ||
    DOM.matches(el, 'button,[contenteditable]')
  );
}

export function removePsClasses(element) {
  for (var i = 0; i < element.classList.length; i++) {
    var className = element.classList[i];
    if (className.indexOf('ps-') === 0) {
      element.classList.remove(className);
    }
  }
}

export function outerWidth(element) {
  return (
    toInt(DOM.css(element, 'width')) +
    toInt(DOM.css(element, 'paddingLeft')) +
    toInt(DOM.css(element, 'paddingRight')) +
    toInt(DOM.css(element, 'borderLeftWidth')) +
    toInt(DOM.css(element, 'borderRightWidth'))
  );
}

function psClasses(axis) {
  return axis
    ? ['ps--scrolling-' + axis]
    : ['ps--scrolling-x', 'ps--scrolling-y'];
}

export function startScrolling(element, axis) {
  var classes = psClasses(axis);
  for (var i = 0; i < classes.length; i++) {
    element.classList.add(classes[i]);
  }
}

export function stopScrolling(element, axis) {
  var classes = psClasses(axis);
  for (var i = 0; i < classes.length; i++) {
    element.classList.remove(classes[i]);
  }
}

export const env = {
  isWebKit:
    typeof document !== 'undefined' &&
    'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)),
  supportsIePointer:
    typeof window !== 'undefined' && window.navigator.msMaxTouchPoints !== null,
};
