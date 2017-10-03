import * as CSS from '../lib/css';
import updateGeometry from '../update-geometry';
import updateScroll from '../update-scroll';

const childClass = 'ps__child';
const childConsumeClass = 'ps__child--consume';

export default function(i) {
  const element = i.element;

  let shouldPrevent = false;

  function shouldPreventDefault(deltaX, deltaY) {
    const scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (
        (scrollTop === 0 && deltaY > 0) ||
        (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }

    const scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (
        (scrollLeft === 0 && deltaX < 0) ||
        (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getDeltaFromEvent(e) {
    let deltaX = e.deltaX;
    let deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(deltaX, deltaY) {
    const child = element.querySelector(
      `textarea:hover, select[multiple]:hover, .${childClass}:hover`
    );

    if (child) {
      if (child.classList.contains(childConsumeClass)) {
        return true;
      }

      const styles = CSS.get(child);
      const overflow = [style.overflow, style.overflowX, style.overflowY].join(
        ''
      );

      if (!overflow.match(/(scroll|auto)/)) {
        // if not scrollable
        return false;
      }

      const maxScrollTop = child.scrollHeight - child.clientHeight;
      if (maxScrollTop > 0) {
        if (
          !(child.scrollTop === 0 && deltaY > 0) &&
          !(child.scrollTop === maxScrollTop && deltaY < 0)
        ) {
          return true;
        }
      }
      const maxScrollLeft = child.scrollLeft - child.clientWidth;
      if (maxScrollLeft > 0) {
        if (
          !(child.scrollLeft === 0 && deltaX < 0) &&
          !(child.scrollLeft === maxScrollLeft && deltaX > 0)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function mousewheelHandler(e) {
    const [deltaX, deltaY] = getDeltaFromEvent(e);

    if (shouldBeConsumedByChild(deltaX, deltaY)) {
      return;
    }

    let shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      updateScroll(
        i,
        'top',
        element.scrollTop - deltaY * i.settings.wheelSpeed
      );
      updateScroll(
        i,
        'left',
        element.scrollLeft + deltaX * i.settings.wheelSpeed
      );
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        updateScroll(
          i,
          'top',
          element.scrollTop - deltaY * i.settings.wheelSpeed
        );
      } else {
        updateScroll(
          i,
          'top',
          element.scrollTop + deltaX * i.settings.wheelSpeed
        );
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        updateScroll(
          i,
          'left',
          element.scrollLeft + deltaX * i.settings.wheelSpeed
        );
      } else {
        updateScroll(
          i,
          'left',
          element.scrollLeft - deltaY * i.settings.wheelSpeed
        );
      }
      shouldPrevent = true;
    }

    updateGeometry(i);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}
