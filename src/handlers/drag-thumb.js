import * as CSS from '../lib/css';
import * as DOM from '../lib/dom';
import cls, {
  addScrollingClass,
  removeScrollingClass,
} from '../lib/class-names';
import updateGeometry from '../update-geometry';
import { createEvent } from '../lib/util';

export default function(i) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail',
  ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail',
  ]);
}

function bindMouseScrollHandler(
  i,
  [
    containerHeight,
    contentHeight,
    pageY,
    railYHeight,
    scrollbarY,
    scrollbarYHeight,
    scrollTop,
    y,
    scrollbarYRail,
  ]
) {
  const element = i.element;
  const tag = y;

  let startingScrollTop = null;
  let startingMousePageY = null;
  let scrollBy = null;

  function mouseMoveHandler(e) {
    if (e.touches && e.touches[0]) {
      e[pageY] = e.touches[0].pageY;
    }
    element[scrollTop] =
      startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    e.preventDefault();
    element.dispatchEvent(createEvent(`ps-${tag}-drag-move`));
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail].classList.remove(cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    element.dispatchEvent(createEvent(`ps-${tag}-drag-end`));
  }

  function bindMoves(e, touchMode) {
    startingScrollTop = element[scrollTop];
    if (touchMode && e.touches) {
      e[pageY] = e.touches[0].pageY;
    }
    startingMousePageY = e[pageY];
    scrollBy =
      (i[contentHeight] - i[containerHeight]) /
      (i[railYHeight] - i[scrollbarYHeight]);
    if (!touchMode) {
      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
      e.preventDefault();
    } else {
      i.event.bind(i.ownerDocument, 'touchmove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'touchend', mouseUpHandler);
    }

    i[scrollbarYRail].classList.add(cls.state.clicking);

    e.stopPropagation();
  }

  i.event.bind(i[scrollbarY], 'mousedown', e => {
    bindMoves(e);
    element.dispatchEvent(createEvent(`ps-${tag}-drag-start`));
  });
  i.event.bind(i[scrollbarY], 'touchstart', e => {
    bindMoves(e, true);
    element.dispatchEvent(createEvent(`ps-${tag}-drag-start`));
  });
}
