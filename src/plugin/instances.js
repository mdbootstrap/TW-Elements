import * as _ from '../lib/helper';
import * as DOM from '../lib/dom';
import EventManager from '../lib/event-manager';
import guid from '../lib/guid';

var defaultSettings = () => ({
  handlers: ['click-rail', 'drag-scrollbar', 'keyboard', 'wheel', 'touch'],
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

var instances = {};

function Instance(element, userSettings) {
  var i = this;

  i.settings = defaultSettings();
  for (var key in userSettings) {
    i.settings[key] = userSettings[key];
  }

  i.containerWidth = null;
  i.containerHeight = null;
  i.contentWidth = null;
  i.contentHeight = null;

  i.isRtl = DOM.css(element, 'direction') === 'rtl';
  i.isNegativeScroll = (function() {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  i.negativeScrollAdjustment = i.isNegativeScroll
    ? element.scrollWidth - element.clientWidth
    : 0;
  i.event = new EventManager();
  i.ownerDocument = element.ownerDocument || document;

  i.scrollbarXRail = DOM.appendTo(DOM.create('div', 'ps__rail-x'), element);
  i.scrollbarX = DOM.appendTo(
    DOM.create('div', 'ps__thumb-x'),
    i.scrollbarXRail,
  );
  i.scrollbarX.setAttribute('tabindex', 0);
  i.scrollbarXActive = null;
  i.scrollbarXWidth = null;
  i.scrollbarXLeft = null;
  i.scrollbarXBottom = _.toInt(DOM.css(i.scrollbarXRail, 'bottom'));
  i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
  i.scrollbarXTop = i.isScrollbarXUsingBottom
    ? null
    : _.toInt(DOM.css(i.scrollbarXRail, 'top'));
  i.railBorderXWidth =
    _.toInt(DOM.css(i.scrollbarXRail, 'borderLeftWidth')) +
    _.toInt(DOM.css(i.scrollbarXRail, 'borderRightWidth'));
  // Set rail to display:block to calculate margins
  DOM.css(i.scrollbarXRail, 'display', 'block');
  i.railXMarginWidth =
    _.toInt(DOM.css(i.scrollbarXRail, 'marginLeft')) +
    _.toInt(DOM.css(i.scrollbarXRail, 'marginRight'));
  DOM.css(i.scrollbarXRail, 'display', '');
  i.railXWidth = null;
  i.railXRatio = null;

  i.scrollbarYRail = DOM.appendTo(DOM.create('div', 'ps__rail-y'), element);
  i.scrollbarY = DOM.appendTo(
    DOM.create('div', 'ps__thumb-y'),
    i.scrollbarYRail,
  );
  i.scrollbarY.setAttribute('tabindex', 0);
  i.scrollbarYActive = null;
  i.scrollbarYHeight = null;
  i.scrollbarYTop = null;
  i.scrollbarYRight = _.toInt(DOM.css(i.scrollbarYRail, 'right'));
  i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
  i.scrollbarYLeft = i.isScrollbarYUsingRight
    ? null
    : _.toInt(DOM.css(i.scrollbarYRail, 'left'));
  i.scrollbarYOuterWidth = i.isRtl ? _.outerWidth(i.scrollbarY) : null;
  i.railBorderYWidth =
    _.toInt(DOM.css(i.scrollbarYRail, 'borderTopWidth')) +
    _.toInt(DOM.css(i.scrollbarYRail, 'borderBottomWidth'));
  DOM.css(i.scrollbarYRail, 'display', 'block');
  i.railYMarginHeight =
    _.toInt(DOM.css(i.scrollbarYRail, 'marginTop')) +
    _.toInt(DOM.css(i.scrollbarYRail, 'marginBottom'));
  DOM.css(i.scrollbarYRail, 'display', '');
  i.railYHeight = null;
  i.railYRatio = null;
}

function getId(element) {
  return element.getAttribute('data-ps-id');
}

function setId(element, id) {
  element.setAttribute('data-ps-id', id);
}

function removeId(element) {
  element.removeAttribute('data-ps-id');
}

export function add(element, userSettings) {
  var newId = guid();
  setId(element, newId);
  instances[newId] = new Instance(element, userSettings);
  return instances[newId];
}

export function remove(element) {
  delete instances[getId(element)];
  removeId(element);
}

export function get(element) {
  return instances[getId(element)];
}
