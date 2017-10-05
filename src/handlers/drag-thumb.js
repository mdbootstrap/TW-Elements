import * as CSS from '../lib/css';
import * as DOM from '../lib/dom';
import updateGeometry from '../update-geometry';
import updateScroll from '../update-scroll';
import { toInt } from '../lib/util';

export default function(i) {
  bindMouseScrollXHandler(i);
  bindMouseScrollYHandler(i);
}

function scrollingClasses(axis) {
  return axis
    ? ['ps--scrolling-' + axis]
    : ['ps--scrolling-x', 'ps--scrolling-y'];
}

function bindMouseScrollXHandler(i) {
  const element = i.element;

  let currentLeft = null;
  let currentPageX = null;

  function updateScrollLeft(deltaX) {
    const newLeft = currentLeft + deltaX * i.railXRatio;
    const maxLeft =
      Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) +
      i.railXRatio * (i.railXWidth - i.scrollbarXWidth);

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    const scrollLeft =
      toInt(
        i.scrollbarXLeft *
          (i.contentWidth - i.containerWidth) /
          (i.containerWidth - i.railXRatio * i.scrollbarXWidth)
      ) - i.negativeScrollAdjustment;
    updateScroll(i, 'left', scrollLeft);
  }

  function mouseMoveHandler(e) {
    updateScrollLeft(e.pageX - currentPageX);
    updateGeometry(i);
    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    scrollingClasses('x').forEach(c => element.classList.remove(c));
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  i.event.bind(i.scrollbarX, 'mousedown', e => {
    currentPageX = e.pageX;
    currentLeft = toInt(CSS.get(i.scrollbarX).left) * i.railXRatio;
    scrollingClasses('x').forEach(c => element.classList.add(c));

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}

function bindMouseScrollYHandler(i) {
  const element = i.element;

  let currentTop = null;
  let currentPageY = null;

  function updateScrollTop(deltaY) {
    const newTop = currentTop + deltaY * i.railYRatio;
    const maxTop =
      Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) +
      i.railYRatio * (i.railYHeight - i.scrollbarYHeight);

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    const scrollTop = toInt(
      i.scrollbarYTop *
        (i.contentHeight - i.containerHeight) /
        (i.containerHeight - i.railYRatio * i.scrollbarYHeight)
    );
    updateScroll(i, 'top', scrollTop);
  }

  function mouseMoveHandler(e) {
    updateScrollTop(e.pageY - currentPageY);
    updateGeometry(i);
    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    scrollingClasses('y').forEach(c => element.classList.remove(c));
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  i.event.bind(i.scrollbarY, 'mousedown', e => {
    currentPageY = e.pageY;
    currentTop = toInt(CSS.get(i.scrollbarY).top) * i.railYRatio;
    scrollingClasses('y').forEach(c => element.classList.add(c));

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}
