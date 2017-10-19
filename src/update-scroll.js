import { setScrollingClassInstantly } from './lib/class-names';

function createEvent(name) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  } else {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
  }
}

export default function(i, axis, value, useScrollingClass = true) {
  let fields;
  if (axis === 'top') {
    fields = [
      'contentHeight',
      'containerHeight',
      'scrollTop',
      'y',
      'up',
      'down',
    ];
  } else if (axis === 'left') {
    fields = [
      'contentWidth',
      'containerWidth',
      'scrollLeft',
      'x',
      'left',
      'right',
    ];
  } else {
    throw new Error('A proper axis should be provided');
  }

  updateScroll(i, value, fields, useScrollingClass);
}

function updateScroll(
  i,
  value,
  [contentHeight, containerHeight, scrollTop, y, up, down],
  useScrollingClass
) {
  const element = i.element;

  let mitigated = false;

  // reset reach
  i.reach[y] = null;

  // don't allow negative scroll offset
  if (value <= 0) {
    value = 0;
    i.reach[y] = 'start';
  }

  // don't allow scroll past container
  if (value >= i[contentHeight] - i[containerHeight]) {
    value = i[contentHeight] - i[containerHeight];

    // mitigates rounding errors on non-subpixel scroll values
    if (value - element[scrollTop] <= 2) {
      mitigated = true;
    }

    i.reach[y] = 'end';
  }

  let diff = element[scrollTop] - value;

  if (diff) {
    element.dispatchEvent(createEvent(`ps-scroll-${y}`));

    if (diff > 0) {
      element.dispatchEvent(createEvent(`ps-scroll-${up}`));
    } else {
      element.dispatchEvent(createEvent(`ps-scroll-${down}`));
    }

    if (!mitigated) {
      element[scrollTop] = value;
    }

    if (i.reach[y]) {
      element.dispatchEvent(createEvent(`ps-${y}-reach-${i.reach[y]}`));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }
}
