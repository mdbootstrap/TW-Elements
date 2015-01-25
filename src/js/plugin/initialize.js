/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , d = require('../lib/dom')
  , evt = require('../lib/event')
  , h = require('../lib/helper')
  , instances = require('./instances')
  , updateGeometry = require('./update');

module.exports = function (element, userSettings) {
  userSettings = typeof userSettings === 'object' ? userSettings : {};

  cls.add(element, 'ps-container');

  // Create a plugin instance.
  var i = instances.add(element);

  i.settings = h.extend(i.settings, userSettings);

  function updateScrollTop(currentTop, deltaY) {
    var newTop = currentTop + deltaY;
    var maxTop = i.containerHeight - i.scrollbarYHeight;

    if (newTop < 0) {
      i.scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      i.scrollbarYTop = maxTop;
    } else {
      i.scrollbarYTop = newTop;
    }

    var scrollTop = h.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - i.scrollbarYHeight));
    element.scrollTop = scrollTop;
  }

  function updateScrollLeft(currentLeft, deltaX) {
    var newLeft = currentLeft + deltaX;
    var maxLeft = i.containerWidth - i.scrollbarXWidth;

    if (newLeft < 0) {
      i.scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      i.scrollbarXLeft = maxLeft;
    } else {
      i.scrollbarXLeft = newLeft;
    }

    var scrollLeft = h.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - i.scrollbarXWidth));
    element.scrollLeft = scrollLeft;
  }

  function bindMouseScrollXHandler() {
    var currentLeft;
    var currentPageX;

    var mouseMoveHandler = function (e) {
      updateScrollLeft(currentLeft, e.pageX - currentPageX);
      updateGeometry(element);
      e.stopPropagation();
      e.preventDefault();
    };

    var mouseUpHandler = function () {
      cls.remove(element, 'ps-x');
      cls.remove(element, 'ps-in-scrolling');
      $(i.ownerDocument).unbind(i.eventClass('mousemove'), mouseMoveHandler);
    };

    $(i.scrollbarX).bind(i.eventClass('mousedown'), function (e) {
      currentPageX = e.pageX;
      currentLeft = h.toInt(d.css(i.scrollbarX, 'left'));
      cls.add(element, 'ps-in-scrolling');
      cls.add(element, 'ps-x');

      $(i.ownerDocument).bind(i.eventClass('mousemove'), mouseMoveHandler);
      evt.once(i.ownerDocument, 'mouseup', mouseUpHandler);

      e.stopPropagation();
      e.preventDefault();
    });

    currentLeft =
    currentPageX = null;
  }

  function bindMouseScrollYHandler() {
    var currentTop;
    var currentPageY;

    var mouseMoveHandler = function (e) {
      updateScrollTop(currentTop, e.pageY - currentPageY);
      updateGeometry(element);
      e.stopPropagation();
      e.preventDefault();
    };

    var mouseUpHandler = function () {
      cls.remove(element, 'ps-y');
      cls.remove(element, 'ps-in-scrolling');
      $(i.ownerDocument).unbind(i.eventClass('mousemove'), mouseMoveHandler);
    };

    $(i.scrollbarY).bind(i.eventClass('mousedown'), function (e) {
      currentPageY = e.pageY;
      currentTop = h.toInt(d.css(i.scrollbarY, 'top'));
      cls.add(element, 'ps-in-scrolling');
      cls.add(element, 'ps-y');

      $(i.ownerDocument).bind(i.eventClass('mousemove'), mouseMoveHandler);
      evt.once(i.ownerDocument, 'mouseup', mouseUpHandler);

      e.stopPropagation();
      e.preventDefault();
    });

    currentTop =
    currentPageY = null;
  }

  function shouldPreventWheel(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function shouldPreventSwipe(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !i.settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !i.settings.swipePropagation;
      }
    }

    return true;
  }

  function bindMouseWheelHandler() {
    var shouldPrevent = false;

    function getDeltaFromEvent(e) {
      var deltaX = e.originalEvent.deltaX;
      var deltaY = -1 * e.originalEvent.deltaY;

      if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
        // OS X Safari
        deltaX = -1 * e.originalEvent.wheelDeltaX / 6;
        deltaY = e.originalEvent.wheelDeltaY / 6;
      }

      if (e.originalEvent.deltaMode && e.originalEvent.deltaMode === 1) {
        // Firefox in deltaMode 1: Line scrolling
        deltaX *= 10;
        deltaY *= 10;
      }

      if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = e.originalEvent.wheelDelta;
      }

      return [deltaX, deltaY];
    }

    function mousewheelHandler(e) {
      // FIXME: this is a quick fix for the select problem in FF and IE.
      // If there comes an effective way to deal with the problem,
      // this lines should be removed.
      if (!h.env.isWebKit && element.querySelector('select:focus')) {
        return;
      }

      var delta = getDeltaFromEvent(e);

      var deltaX = delta[0];
      var deltaY = delta[1];

      shouldPrevent = false;
      if (!i.settings.useBothWheelAxes) {
        // deltaX will only be used for horizontal scrolling and deltaY will
        // only be used for vertical scrolling - this is the default
        element.scrollTop = element.scrollTop - (deltaY * i.settings.wheelSpeed);
        element.scrollLeft = element.scrollLeft + (deltaX * i.settings.wheelSpeed);
      } else if (i.scrollbarYActive && !i.scrollbarXActive) {
        // only vertical scrollbar is active and useBothWheelAxes option is
        // active, so let's scroll vertical bar using both mouse wheel axes
        if (deltaY) {
          element.scrollTop = element.scrollTop() - (deltaY * i.settings.wheelSpeed);
        } else {
          element.scrollTop = element.scrollTop() + (deltaX * i.settings.wheelSpeed);
        }
        shouldPrevent = true;
      } else if (i.scrollbarXActive && !i.scrollbarYActive) {
        // useBothWheelAxes and only horizontal bar is active, so use both
        // wheel axes for horizontal bar
        if (deltaX) {
          element.scrollLeft = element.scrollLeft() + (deltaX * i.settings.wheelSpeed);
        } else {
          element.scrollLeft = element.scrollLeft() - (deltaY * i.settings.wheelSpeed);
        }
        shouldPrevent = true;
      }

      updateGeometry(element);

      shouldPrevent = (shouldPrevent || shouldPreventWheel(deltaX, deltaY));
      if (shouldPrevent) {
        e.stopPropagation();
        e.preventDefault();
      }
    }

    if (typeof window.onwheel !== "undefined") {
      $(element).bind(i.eventClass('wheel'), mousewheelHandler);
    } else if (typeof window.onmousewheel !== "undefined") {
      $(element).bind(i.eventClass('mousewheel'), mousewheelHandler);
    }
  }

  function bindKeyboardHandler() {
    var hovered = false;
    $(element).bind(i.eventClass('mouseenter'), function () {
      hovered = true;
    });
    $(element).bind(i.eventClass('mouseleave'), function () {
      hovered = false;
    });

    var shouldPrevent = false;
    $(i.ownerDocument).bind(i.eventClass('keydown'), function (e) {
      if (e.isDefaultPrevented && e.isDefaultPrevented()) {
        return;
      }

      if (!hovered) {
        return;
      }

      var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
      // go deeper if element is a webcomponent
      while (activeElement.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }
      if (h.isEditable(activeElement)) {
        return;
      }

      var deltaX = 0;
      var deltaY = 0;

      switch (e.which) {
      case 37: // left
        deltaX = -30;
        break;
      case 38: // up
        deltaY = 30;
        break;
      case 39: // right
        deltaX = 30;
        break;
      case 40: // down
        deltaY = -30;
        break;
      case 33: // page up
        deltaY = 90;
        break;
      case 32: // space bar
      case 34: // page down
        deltaY = -90;
        break;
      case 35: // end
        if (e.ctrlKey) {
          deltaY = -i.contentHeight;
        } else {
          deltaY = -i.containerHeight;
        }
        break;
      case 36: // home
        if (e.ctrlKey) {
          deltaY = element.scrollTop;
        } else {
          deltaY = i.containerHeight;
        }
        break;
      default:
        return;
      }

      element.scrollTop = element.scrollTop - deltaY;
      element.scrollLeft = element.scrollLeft + deltaX;

      shouldPrevent = shouldPreventWheel(deltaX, deltaY);
      if (shouldPrevent) {
        e.preventDefault();
      }
    });
  }

  function bindRailClickHandler() {
    var stopPropagation = window.Event.prototype.stopPropagation.bind;

    $(i.scrollbarY).bind(i.eventClass('click'), stopPropagation);
    $(i.scrollbarYRail).bind(i.eventClass('click'), function (e) {
      var halfOfScrollbarLength = h.toInt(i.scrollbarYHeight / 2);
      var positionTop = e.pageY - i.scrollbarYRail.offsetTop - halfOfScrollbarLength;
      var maxPositionTop = i.containerHeight - i.scrollbarYHeight;
      var positionRatio = positionTop / maxPositionTop;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }

      element.scrollTop = (i.contentHeight - i.containerHeight) * positionRatio;
    });

    $(i.scrollbarX).bind(i.eventClass('click'), stopPropagation);
    $(i.scrollbarXRail).bind(i.eventClass('click'), function (e) {
      var halfOfScrollbarLength = h.toInt(i.scrollbarXWidth / 2);
      var positionLeft = e.pageX - i.scrollbarXRail.offsetLeft - halfOfScrollbarLength;
      var maxPositionLeft = i.containerWidth - i.scrollbarXWidth;
      var positionRatio = positionLeft / maxPositionLeft;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }

      element.scrollLeft = (i.contentWidth - i.containerWidth) * positionRatio;
    });
  }

  function bindSelectionHandler() {
    function getRangeNode() {
      var selection = window.getSelection ? window.getSelection() :
                      document.getSlection ? document.getSlection() : {rangeCount: 0};
      if (selection.rangeCount === 0) {
        return null;
      } else {
        return selection.getRangeAt(0).commonAncestorContainer;
      }
    }

    var scrollingLoop = null;
    var scrollDiff = {top: 0, left: 0};
    function startScrolling() {
      if (!scrollingLoop) {
        scrollingLoop = setInterval(function () {
          if (!instances.get(element)) {
            clearInterval(scrollingLoop);
            return;
          }

          element.scrollTop = element.scrollTop + scrollDiff.top;
          element.scrollLeft = element.scrollLeft + scrollDiff.left;
          updateGeometry(element);
        }, 50); // every .1 sec
      }
    }
    function stopScrolling() {
      if (scrollingLoop) {
        clearInterval(scrollingLoop);
        scrollingLoop = null;
      }
      cls.remove(element, 'ps-in-scrolling');
      cls.remove(element, 'ps-in-scrolling');
    }

    var isSelected = false;
    $(i.ownerDocument).bind(i.eventClass('selectionchange'), function () {
      if ($.contains(element, getRangeNode())) {
        isSelected = true;
      } else {
        isSelected = false;
        stopScrolling();
      }
    });
    $(window).bind(i.eventClass('mouseup'), function () {
      if (isSelected) {
        isSelected = false;
        stopScrolling();
      }
    });

    $(window).bind(i.eventClass('mousemove'), function (e) {
      if (isSelected) {
        var mousePosition = {x: e.pageX, y: e.pageY};
        var containerGeometry = {
          left: element.offsetLeft,
          right: element.offsetLeft + element.offsetWidth,
          top: element.offsetTop,
          bottom: element.offsetTop + element.offsetHeight
        };

        if (mousePosition.x < containerGeometry.left + 3) {
          scrollDiff.left = -5;
          cls.add(element, 'ps-in-scrolling');
        } else if (mousePosition.x > containerGeometry.right - 3) {
          scrollDiff.left = 5;
          cls.add(element, 'ps-in-scrolling');
        } else {
          scrollDiff.left = 0;
        }

        if (mousePosition.y < containerGeometry.top + 3) {
          if (containerGeometry.top + 3 - mousePosition.y < 5) {
            scrollDiff.top = -5;
          } else {
            scrollDiff.top = -20;
          }
          cls.add(element, 'ps-in-scrolling');
        } else if (mousePosition.y > containerGeometry.bottom - 3) {
          if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
            scrollDiff.top = 5;
          } else {
            scrollDiff.top = 20;
          }
          cls.add(element, 'ps-in-scrolling');
        } else {
          scrollDiff.top = 0;
        }

        if (scrollDiff.top === 0 && scrollDiff.left === 0) {
          stopScrolling();
        } else {
          startScrolling();
        }
      }
    });
  }

  function bindTouchHandler(supportsTouch, supportsIePointer) {
    function applyTouchMove(differenceX, differenceY) {
      element.scrollTop = element.scrollTop - differenceY;
      element.scrollLeft = element.scrollLeft() - differenceX;

      updateGeometry(element);
    }

    var startOffset = {};
    var startTime = 0;
    var speed = {};
    var easingLoop = null;
    var inGlobalTouch = false;
    var inLocalTouch = false;

    function globalTouchStart() {
      inGlobalTouch = true;
    }
    function globalTouchEnd() {
      inGlobalTouch = false;
    }

    function getTouch(e) {
      if (e.originalEvent.targetTouches) {
        return e.originalEvent.targetTouches[0];
      } else {
        // Maybe IE pointer
        return e.originalEvent;
      }
    }
    function shouldHandle(e) {
      var event = e.originalEvent;
      if (event.targetTouches && event.targetTouches.length === 1) {
        return true;
      }
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== event.MSPOINTER_TYPE_MOUSE) {
        return true;
      }
      return false;
    }
    function touchStart(e) {
      if (shouldHandle(e)) {
        inLocalTouch = true;

        var touch = getTouch(e);

        startOffset.pageX = touch.pageX;
        startOffset.pageY = touch.pageY;

        startTime = (new Date()).getTime();

        if (easingLoop !== null) {
          clearInterval(easingLoop);
        }

        e.stopPropagation();
      }
    }
    function touchMove(e) {
      if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
        var touch = getTouch(e);

        var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

        var differenceX = currentOffset.pageX - startOffset.pageX;
        var differenceY = currentOffset.pageY - startOffset.pageY;

        applyTouchMove(differenceX, differenceY);
        startOffset = currentOffset;

        var currentTime = (new Date()).getTime();

        var timeGap = currentTime - startTime;
        if (timeGap > 0) {
          speed.x = differenceX / timeGap;
          speed.y = differenceY / timeGap;
          startTime = currentTime;
        }

        if (shouldPreventSwipe(differenceX, differenceY)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    }
    function touchEnd() {
      if (!inGlobalTouch && inLocalTouch) {
        inLocalTouch = false;

        clearInterval(easingLoop);
        easingLoop = setInterval(function () {
          if (!instances.get(element)) {
            clearInterval(easingLoop);
            return;
          }

          if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
            clearInterval(easingLoop);
            return;
          }

          applyTouchMove(speed.x * 30, speed.y * 30);

          speed.x *= 0.8;
          speed.y *= 0.8;
        }, 10);
      }
    }

    if (supportsTouch) {
      $(window).bind(i.eventClass("touchstart"), globalTouchStart);
      $(window).bind(i.eventClass("touchend"), globalTouchEnd);
      $(element).bind(i.eventClass("touchstart"), touchStart);
      $(element).bind(i.eventClass("touchmove"), touchMove);
      $(element).bind(i.eventClass("touchend"), touchEnd);
    }

    if (supportsIePointer) {
      if (window.PointerEvent) {
        $(window).bind(i.eventClass("pointerdown"), globalTouchStart);
        $(window).bind(i.eventClass("pointerup"), globalTouchEnd);
        $(element).bind(i.eventClass("pointerdown"), touchStart);
        $(element).bind(i.eventClass("pointermove"), touchMove);
        $(element).bind(i.eventClass("pointerup"), touchEnd);
      } else if (window.MSPointerEvent) {
        $(window).bind(i.eventClass("MSPointerDown"), globalTouchStart);
        $(window).bind(i.eventClass("MSPointerUp"), globalTouchEnd);
        $(element).bind(i.eventClass("MSPointerDown"), touchStart);
        $(element).bind(i.eventClass("MSPointerMove"), touchMove);
        $(element).bind(i.eventClass("MSPointerUp"), touchEnd);
      }
    }
  }

  function bindScrollHandler() {
    $(element).bind(i.eventClass('scroll'), function () {
      updateGeometry(element);
    });
  }

  function initialize() {
    updateGeometry(element);
    bindScrollHandler();
    bindMouseScrollXHandler();
    bindMouseScrollYHandler();
    bindRailClickHandler();
    bindSelectionHandler();
    bindMouseWheelHandler();

    if (h.env.supportsTouch || h.env.supportsIePointer) {
      bindTouchHandler(h.env.supportsTouch, h.env.supportsIePointer);
    }
    if (i.settings.useKeyboard) {
      bindKeyboardHandler();
    }
  }

  initialize();
};
