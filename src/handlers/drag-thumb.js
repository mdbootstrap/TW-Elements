import * as CSS from '../lib/css';
import * as DOM from '../lib/dom';
import cls, {
  addScrollingClass,
  removeScrollingClass,
} from '../lib/class-names';
import updateGeometry from '../update-geometry';
import { toInt } from '../lib/util';

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

  let startingScrollTop = null;
  let startingMousePageY = null;
  let scrollBy = null;

  function mouseMoveHandler(e) {
    let pageY_ = e[pageY];
    if (e.touches && e.touches[0]) {
      pageY_ = e.touches[0].pageY;
    }
    element[scrollTop] =
      startingScrollTop + scrollBy * (pageY_ - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail].classList.remove(cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  function bindMoves(e, touchMode) {
    startingScrollTop = element[scrollTop];
    let pageY_ = e[pageY];
    if (touchMode && e.touches) {
      pageY_ = e.touches[0].pageY;
    }
    startingMousePageY = pageY_;
    scrollBy =
      (i[contentHeight] - i[containerHeight]) /
      (i[railYHeight] - i[scrollbarYHeight]);
    if (!touchMode) {
      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
      e.preventDefault();
    } else {
      i.event.bind(i.ownerDocument, 'touchmove', mouseMoveHandler);
    }

    i[scrollbarYRail].classList.add(cls.state.clicking);

    e.stopPropagation();
  }

  i.event.bind(i[scrollbarY], 'mousedown', e => {
    bindMoves(e);
  });
  i.event.bind(i[scrollbarY], 'touchstart', e => {
    bindMoves(e, true);
  });
}
