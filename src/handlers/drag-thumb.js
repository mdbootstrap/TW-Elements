import * as CSS from '../lib/css';
import * as DOM from '../lib/dom';
import updateGeometry from '../update-geometry';
import updateScroll from '../update-scroll';
import { toInt } from '../lib/util';

export default function(i) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'railXRatio',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollbarXRail',
    'scrollbarXLeft',
    'left',
  ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'railYRatio',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollbarYRail',
    'scrollbarYTop',
    'top',
  ]);
}

function bindMouseScrollHandler(
  i,
  [
    containerHeight,
    contentHeight,
    pageY,
    railYHeight,
    railYRatio,
    scrollbarY,
    scrollbarYHeight,
    scrollbarYRail,
    scrollbarYTop,
    top,
  ]
) {
  const element = i.element;

  let currentTop = null;
  let currentPageY = null;

  function updateScrollTop(deltaY) {
    const newTop = currentTop + deltaY * i[railYRatio];
    const maxTop =
      Math.max(0, i[scrollbarYRail].getBoundingClientRect()[top]) +
      i[railYRatio] * (i[railYHeight] - i[scrollbarYHeight]);

    if (newTop < 0) {
      i[scrollbarYTop] = 0;
    } else if (newTop > maxTop) {
      i[scrollbarYTop] = maxTop;
    } else {
      i[scrollbarYTop] = newTop;
    }

    const scrollTop = toInt(
      i[scrollbarYTop] *
        (i[contentHeight] - i[containerHeight]) /
        (i[containerHeight] - i[railYRatio] * i[scrollbarYHeight])
    );
    updateScroll(i, top, scrollTop);
  }

  function mouseMoveHandler(e) {
    updateScrollTop(e[pageY] - currentPageY);
    updateGeometry(i);
    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  i.event.bind(i[scrollbarY], 'mousedown', e => {
    currentPageY = e[pageY];
    currentTop = toInt(CSS.get(i[scrollbarY])[top]) * i[railYRatio];

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    e.stopPropagation();
    e.preventDefault();
  });
}
