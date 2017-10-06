import * as CSS from './lib/css';
import * as DOM from './lib/dom';
import EventManager from './lib/event-manager';
import updateGeometry from './update-geometry';
import updateScroll from './update-scroll';
import { toInt, outerWidth } from './lib/util';

import clickRail from './handlers/click-rail';
import dragThumb from './handlers/drag-thumb';
import keyboard from './handlers/keyboard';
import wheel from './handlers/mouse-wheel';
import touch from './handlers/touch';

const defaultSettings = () => ({
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipePropagation: true,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: false,
  wheelSpeed: 1,
});

const handlers = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard,
  wheel,
  touch,
};

const psClassName = 'ps';

export default class PerfectScrollbar {
  constructor(element, userSettings = {}) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (!element || !element.nodeName) {
      throw new Error('no element is specified to initialize PerfectScrollbar');
    }

    this.element = element;

    element.classList.add(psClassName);

    this.settings = defaultSettings();
    for (const key in userSettings) {
      this.settings[key] = userSettings[key];
    }

    this.containerWidth = null;
    this.containerHeight = null;
    this.contentWidth = null;
    this.contentHeight = null;

    const focus = () => element.classList.add('ps--focus');
    const blur = () => element.classList.remove('ps--focus');

    this.isRtl = CSS.get(element).direction === 'rtl';
    this.isNegativeScroll = (() => {
      const originalScrollLeft = element.scrollLeft;
      let result = null;
      element.scrollLeft = -1;
      result = element.scrollLeft < 0;
      element.scrollLeft = originalScrollLeft;
      return result;
    })();
    this.negativeScrollAdjustment = this.isNegativeScroll
      ? element.scrollWidth - element.clientWidth
      : 0;
    this.event = new EventManager();
    this.ownerDocument = element.ownerDocument || document;

    this.scrollbarXRail = DOM.div('ps__rail-x');
    element.appendChild(this.scrollbarXRail);
    this.scrollbarX = DOM.div('ps__thumb-x');
    this.scrollbarXRail.appendChild(this.scrollbarX);
    this.scrollbarX.setAttribute('tabindex', 0);
    this.event.bind(this.scrollbarX, 'focus', focus);
    this.event.bind(this.scrollbarX, 'blur', blur);
    this.scrollbarXActive = null;
    this.scrollbarXWidth = null;
    this.scrollbarXLeft = null;
    const railXStyle = CSS.get(this.scrollbarXRail);
    this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
    if (isNaN(this.scrollbarXBottom)) {
      this.isScrollbarXUsingBottom = false;
      this.scrollbarXTop = toInt(railXStyle.top);
    } else {
      this.isScrollbarXUsingBottom = true;
    }
    this.railBorderXWidth =
      toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
    // Set rail to display:block to calculate margins
    CSS.set(this.scrollbarXRail, { display: 'block' });
    this.railXMarginWidth =
      toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
    CSS.set(this.scrollbarXRail, { display: '' });
    this.railXWidth = null;
    this.railXRatio = null;

    this.scrollbarYRail = DOM.div('ps__rail-y');
    element.appendChild(this.scrollbarYRail);
    this.scrollbarY = DOM.div('ps__thumb-y');
    this.scrollbarYRail.appendChild(this.scrollbarY);
    this.scrollbarY.setAttribute('tabindex', 0);
    this.event.bind(this.scrollbarY, 'focus', focus);
    this.event.bind(this.scrollbarY, 'blur', blur);
    this.scrollbarYActive = null;
    this.scrollbarYHeight = null;
    this.scrollbarYTop = null;
    const railYStyle = CSS.get(this.scrollbarYRail);
    this.scrollbarYRight = parseInt(railYStyle.right, 10);
    if (isNaN(this.scrollbarYRight)) {
      this.isScrollbarYUsingRight = false;
      this.scrollbarYLeft = toInt(railYStyle.left);
    } else {
      this.isScrollbarYUsingRight = true;
    }
    this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
    this.railBorderYWidth =
      toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
    CSS.set(this.scrollbarYRail, { display: 'block' });
    this.railYMarginHeight =
      toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
    CSS.set(this.scrollbarYRail, { display: '' });
    this.railYHeight = null;
    this.railYRatio = null;

    this.settings.handlers.forEach(handlerName => handlers[handlerName](this));

    this.event.bind(this.element, 'scroll', () => updateGeometry(this));
    updateGeometry(this);
  }

  get isInitialized() {
    return this.element.classList.contains(psClassName);
  }

  update() {
    if (!this.isInitialized) {
      return;
    }

    // Recalcuate negative scrollLeft adjustment
    this.negativeScrollAdjustment = this.isNegativeScroll
      ? this.element.scrollWidth - this.element.clientWidth
      : 0;

    // Recalculate rail margins
    CSS.set(this.scrollbarXRail, { display: 'block' });
    CSS.set(this.scrollbarYRail, { display: 'block' });
    this.railXMarginWidth =
      toInt(CSS.get(this.scrollbarXRail).marginLeft) +
      toInt(CSS.get(this.scrollbarXRail).marginRight);
    this.railYMarginHeight =
      toInt(CSS.get(this.scrollbarYRail).marginTop) +
      toInt(CSS.get(this.scrollbarYRail).marginBottom);

    // Hide scrollbars not to affect scrollWidth and scrollHeight
    CSS.set(this.scrollbarXRail, { display: 'none' });
    CSS.set(this.scrollbarYRail, { display: 'none' });

    updateGeometry(this);

    // Update top/left scroll to trigger events
    updateScroll(this, 'top', this.element.scrollTop);
    updateScroll(this, 'left', this.element.scrollLeft);

    CSS.set(this.scrollbarXRail, { display: '' });
    CSS.set(this.scrollbarYRail, { display: '' });
  }

  destroy() {
    if (!this.isInitialized) {
      return;
    }

    this.event.unbindAll();
    DOM.remove(this.scrollbarX);
    DOM.remove(this.scrollbarY);
    DOM.remove(this.scrollbarXRail);
    DOM.remove(this.scrollbarYRail);
    this.removePsClasses();

    // unset elements
    this.element = null;
    this.scrollbarX = null;
    this.scrollbarY = null;
    this.scrollbarXRail = null;
    this.scrollbarYRail = null;
  }

  removePsClasses() {
    for (let i = 0; i < this.element.classList.length; i++) {
      const className = this.element.classList[i];
      if (className === 'ps' || className.indexOf('ps-') === 0) {
        this.element.classList.remove(className);
      }
    }
  }
}
