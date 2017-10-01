import * as CSS from '../../lib/css';
import * as DOM from '../../lib/dom';
import updateGeometry from '../update-geometry';
import updateScroll from '../update-scroll';
import { toInt } from '../../lib/util';

function scrollingClasses(axis) {
  return axis
    ? ['ps--scrolling-' + axis]
    : ['ps--scrolling-x', 'ps--scrolling-y'];
}

function startScrolling(element, axis) {
  var classes = scrollingClasses(axis);
  for (var i = 0; i < classes.length; i++) {
    element.classList.add(classes[i]);
  }
}

function stopScrolling(element, axis) {
  var classes = scrollingClasses(axis);
  for (var i = 0; i < classes.length; i++) {
    element.classList.remove(classes[i]);
  }
}

function bindMouseScrollXHandler(element, i) {
  var currentLeft = null;
  var currentPageX = null;

  function updateScrollLeft(deltaX) {
    var newLeft = currentLeft + deltaX * i.railXRatio;
    var maxLeft =
      Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) +
      i.railXRatio * (i.railXWidth - i.scrollbarXWidth);

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft =
      toInt(
        i.scrollbarXLeft *
          (i.contentWidth - i.containerWidth) /
          (i.containerWidth - i.railXRatio * i.scrollbarXWidth)
      ) - i.negativeScrollAdjustment;
    updateScroll(i, 'left', scrollLeft);
  }

  var mouseMoveHandler = function(e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(i);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function() {
    stopScrolling(element, 'x');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarX, 'mousedown', function(e) {
    currentPageX = e.pageX;
    currentLeft = toInt(CSS.get(i.scrollbarX).left) * i.railXRatio;
    startScrolling(element, 'x');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(element, i) {
  var currentTop = null;
  var currentPageY = null;

  function updateScrollTop(deltaY) {
    var newTop = currentTop + deltaY * i.railYRatio;
    var maxTop =
      Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) +
      i.railYRatio * (i.railYHeight - i.scrollbarYHeight);

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = toInt(
      i.scrollbarYTop *
        (i.contentHeight - i.containerHeight) /
        (i.containerHeight - i.railYRatio * i.scrollbarYHeight)
    );
    updateScroll(i, 'top', scrollTop);
  }

  var mouseMoveHandler = function(e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(i);
    e.stopPropagation();
    e.preventDefault();
  };

  var mouseUpHandler = function() {
    stopScrolling(element, 'y');
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  };

  i.event.bind(i.scrollbarY, 'mousedown', function(e) {
    currentPageY = e.pageY;
    currentTop = toInt(CSS.get(i.scrollbarY).top) * i.railYRatio;
    startScrolling(element, 'y');

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

export default function(i) {
  bindMouseScrollXHandler(i.element, i);
  bindMouseScrollYHandler(i.element, i);
}
