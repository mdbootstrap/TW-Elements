/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var cls = require('../lib/class')
  , d = require('../lib/dom')
  , defaultSettings = require('./default-setting')
  , eventClassFactory = require('../lib/event-class')
  , h = require('../lib/helper');

module.exports = function (element, settingOrCommand) {
  var settings = h.clone(defaultSettings);
  var isPluginAlive = true;
  var command;

  if (typeof settingOrCommand === "object") {
    // If it's an object, it's a setting.
    settings = h.extend(settings, settingOrCommand);
  } else {
    // Unless, it may be a command.
    command = settingOrCommand;
  }

  // Catch options
  if (command === 'update') {
    if ($(element).data('perfect-scrollbar-update')) {
      $(element).data('perfect-scrollbar-update')();
    }
  }
  else if (command === 'destroy') {
    if ($(element).data('perfect-scrollbar-destroy')) {
      $(element).data('perfect-scrollbar-destroy')();
    }
  }

  if ($(element).data('perfect-scrollbar')) {
    // if there's already perfect-scrollbar
    return $(element).data('perfect-scrollbar');
  }


  // Or generate new perfectScrollbar

  cls.add(element, 'ps-container');

  var containerWidth;
  var containerHeight;
  var contentWidth;
  var contentHeight;

  var isRtl = d.css(element, 'direction') === "rtl";
  var eventClass = eventClassFactory();
  var ownerDocument = element.ownerDocument || document;

  var scrollbarXRail = d.appendTo(d.e('div', 'ps-scrollbar-x-rail'), element);
  var scrollbarX = d.appendTo(d.e('div', 'ps-scrollbar-x'), scrollbarXRail);
  var scrollbarXActive;
  var scrollbarXWidth;
  var scrollbarXLeft;
  var scrollbarXBottom = h.toInt(d.css(scrollbarXRail, 'bottom'));
  var isScrollbarXUsingBottom = scrollbarXBottom === scrollbarXBottom; // !isNaN
  var scrollbarXTop = isScrollbarXUsingBottom ? null : h.toInt(d.css(scrollbarXRail, 'top'));
  var railBorderXWidth = h.toInt(d.css(scrollbarXRail, 'borderLeftWidth')) + h.toInt(d.css(scrollbarXRail, 'borderRightWidth'));
  var railXMarginWidth = h.toInt(d.css(scrollbarXRail, 'marginLeft')) + h.toInt(d.css(scrollbarXRail, 'marginRight'));
  var railXWidth;

  var scrollbarYRail = d.appendTo(d.e('div', 'ps-scrollbar-y-rail'), element);
  var scrollbarY = d.appendTo(d.e('div', 'ps-scrollbar-y'), scrollbarYRail);
  var scrollbarYActive;
  var scrollbarYHeight;
  var scrollbarYTop;
  var scrollbarYRight = h.toInt(d.css(scrollbarYRail, 'right'));
  var isScrollbarYUsingRight = scrollbarYRight === scrollbarYRight; // !isNaN
  var scrollbarYLeft = isScrollbarYUsingRight ? null : h.toInt(d.css(scrollbarYRail, 'left'));
  var railBorderYWidth = h.toInt(d.css(scrollbarYRail, 'borderTopWidth')) + h.toInt(d.css(scrollbarYRail, 'borderBottomWidth'));
  var railYMarginHeight = h.toInt(d.css(scrollbarYRail, 'marginTop')) + h.toInt(d.css(scrollbarYRail, 'marginBottom'));
  var railYHeight;

  function updateScrollTop(currentTop, deltaY) {
    var newTop = currentTop + deltaY;
    var maxTop = containerHeight - scrollbarYHeight;

    if (newTop < 0) {
      scrollbarYTop = 0;
    } else if (newTop > maxTop) {
      scrollbarYTop = maxTop;
    } else {
      scrollbarYTop = newTop;
    }

    var scrollTop = h.toInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - scrollbarYHeight));
    element.scrollTop = scrollTop;
  }

  function updateScrollLeft(currentLeft, deltaX) {
    var newLeft = currentLeft + deltaX;
    var maxLeft = containerWidth - scrollbarXWidth;

    if (newLeft < 0) {
      scrollbarXLeft = 0;
    } else if (newLeft > maxLeft) {
      scrollbarXLeft = maxLeft;
    } else {
      scrollbarXLeft = newLeft;
    }

    var scrollLeft = h.toInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth));
    element.scrollLeft = scrollLeft;
  }

  function getThumbSize(thumbSize) {
    if (settings.minScrollbarLength) {
      thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
    }
    if (settings.maxScrollbarLength) {
      thumbSize = Math.min(thumbSize, settings.maxScrollbarLength);
    }
    return thumbSize;
  }

  function updateCss() {
    var xRailOffset = {width: railXWidth};
    if (isRtl) {
      xRailOffset.left = element.scrollLeft + containerWidth - contentWidth;
    } else {
      xRailOffset.left = element.scrollLeft;
    }
    if (isScrollbarXUsingBottom) {
      xRailOffset.bottom = scrollbarXBottom - element.scrollTop;
    } else {
      xRailOffset.top = scrollbarXTop + element.scrollTop;
    }
    d.css(scrollbarXRail, xRailOffset);

    var railYOffset = {top: element.scrollTop, height: railYHeight};

    if (isScrollbarYUsingRight) {
      if (isRtl) {
        railYOffset.right = contentWidth - element.scrollLeft - scrollbarYRight - scrollbarY.offsetWidth;
      } else {
        railYOffset.right = scrollbarYRight - element.scrollLeft;
      }
    } else {
      if (isRtl) {
        railYOffset.left = element.scrollLeft + containerWidth * 2 - contentWidth - scrollbarYLeft - scrollbarY.offsetWidth;
      } else {
        railYOffset.left = scrollbarYLeft + element.scrollLeft;
      }
    }
    d.css(scrollbarYRail, railYOffset);

    d.css(scrollbarX, {left: scrollbarXLeft, width: scrollbarXWidth - railBorderXWidth});
    d.css(scrollbarY, {top: scrollbarYTop, height: scrollbarYHeight - railBorderYWidth});
  }

  function updateGeometry() {
    // Hide scrollbars not to affect scrollWidth and scrollHeight
    cls.remove(element, 'ps-active-x');
    cls.remove(element, 'ps-active-y');

    containerWidth = settings.includePadding ? element.clientWidth : h.toInt(d.css(element, 'width'));
    containerHeight = settings.includePadding ? element.clientHeight : h.toInt(d.css(element, 'height'));
    contentWidth = element.scrollWidth;
    contentHeight = element.scrollHeight;

    if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
      scrollbarXActive = true;
      railXWidth = containerWidth - railXMarginWidth;
      scrollbarXWidth = getThumbSize(h.toInt(railXWidth * containerWidth / contentWidth));
      scrollbarXLeft = h.toInt(element.scrollLeft * (railXWidth - scrollbarXWidth) / (contentWidth - containerWidth));
    } else {
      scrollbarXActive = false;
      scrollbarXWidth = 0;
      scrollbarXLeft = 0;
      element.scrollLeft = 0;
    }

    if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
      scrollbarYActive = true;
      railYHeight = containerHeight - railYMarginHeight;
      scrollbarYHeight = getThumbSize(h.toInt(railYHeight * containerHeight / contentHeight));
      scrollbarYTop = h.toInt(element.scrollTop * (railYHeight - scrollbarYHeight) / (contentHeight - containerHeight));
    } else {
      scrollbarYActive = false;
      scrollbarYHeight = 0;
      scrollbarYTop = 0;
      element.scrollTop = 0;
    }

    if (scrollbarXLeft >= railXWidth - scrollbarXWidth) {
      scrollbarXLeft = railXWidth - scrollbarXWidth;
    }
    if (scrollbarYTop >= railYHeight - scrollbarYHeight) {
      scrollbarYTop = railYHeight - scrollbarYHeight;
    }

    updateCss();

    if (scrollbarXActive) {
      cls.add(element, 'ps-active-x');
    }
    if (scrollbarYActive) {
      cls.add(element, 'ps-active-y');
    }
  }

  function bindMouseScrollXHandler() {
    var currentLeft;
    var currentPageX;

    var mouseMoveHandler = function (e) {
      updateScrollLeft(currentLeft, e.pageX - currentPageX);
      updateGeometry();
      e.stopPropagation();
      e.preventDefault();
    };

    var mouseUpHandler = function (e) {
      cls.remove(element, 'ps-in-scrolling');
      $(ownerDocument).unbind(eventClass('mousemove'), mouseMoveHandler);
    };

    $(scrollbarX).bind(eventClass('mousedown'), function (e) {
      currentPageX = e.pageX;
      currentLeft = $(scrollbarX).position().left;
      cls.add(element, 'ps-in-scrolling');

      $(ownerDocument).bind(eventClass('mousemove'), mouseMoveHandler);
      $(ownerDocument).one(eventClass('mouseup'), mouseUpHandler);

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
      updateGeometry();
      e.stopPropagation();
      e.preventDefault();
    };

    var mouseUpHandler = function (e) {
      cls.remove(element, 'ps-in-scrolling');
      $(ownerDocument).unbind(eventClass('mousemove'), mouseMoveHandler);
    };

    $(scrollbarY).bind(eventClass('mousedown'), function (e) {
      currentPageY = e.pageY;
      currentTop = $(scrollbarY).position().top;
      cls.add(element, 'ps-in-scrolling');

      $(ownerDocument).bind(eventClass('mousemove'), mouseMoveHandler);
      $(ownerDocument).one(eventClass('mouseup'), mouseUpHandler);

      e.stopPropagation();
      e.preventDefault();
    });

    currentTop =
    currentPageY = null;
  }

  function shouldPreventWheel(deltaX, deltaY) {
    var scrollTop = element.scrollTop;
    if (deltaX === 0) {
      if (!scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
        return !settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
        return !settings.wheelPropagation;
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

      if (((deltaY < 0) && (scrollTop === contentHeight - containerHeight)) ||
          ((deltaY > 0) && (scrollTop === 0))) {
        return !settings.swipePropagation;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (((deltaX < 0) && (scrollLeft === contentWidth - containerWidth)) ||
          ((deltaX > 0) && (scrollLeft === 0))) {
        return !settings.swipePropagation;
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
      if (!h.isWebKit && element.querySelector('select:focus')) {
        return;
      }

      var delta = getDeltaFromEvent(e);

      var deltaX = delta[0];
      var deltaY = delta[1];

      shouldPrevent = false;
      if (!settings.useBothWheelAxes) {
        // deltaX will only be used for horizontal scrolling and deltaY will
        // only be used for vertical scrolling - this is the default
        element.scrollTop = element.scrollTop - (deltaY * settings.wheelSpeed);
        element.scrollLeft = element.scrollLeft + (deltaX * settings.wheelSpeed);
      } else if (scrollbarYActive && !scrollbarXActive) {
        // only vertical scrollbar is active and useBothWheelAxes option is
        // active, so let's scroll vertical bar using both mouse wheel axes
        if (deltaY) {
          element.scrollTop = element.scrollTop() - (deltaY * settings.wheelSpeed);
        } else {
          element.scrollTop = element.scrollTop() + (deltaX * settings.wheelSpeed);
        }
        shouldPrevent = true;
      } else if (scrollbarXActive && !scrollbarYActive) {
        // useBothWheelAxes and only horizontal bar is active, so use both
        // wheel axes for horizontal bar
        if (deltaX) {
          element.scrollLeft = element.scrollLeft() + (deltaX * settings.wheelSpeed);
        } else {
          element.scrollLeft = element.scrollLeft() - (deltaY * settings.wheelSpeed);
        }
        shouldPrevent = true;
      }

      updateGeometry();

      shouldPrevent = (shouldPrevent || shouldPreventWheel(deltaX, deltaY));
      if (shouldPrevent) {
        e.stopPropagation();
        e.preventDefault();
      }
    }

    if (typeof window.onwheel !== "undefined") {
      $(element).bind(eventClass('wheel'), mousewheelHandler);
    } else if (typeof window.onmousewheel !== "undefined") {
      $(element).bind(eventClass('mousewheel'), mousewheelHandler);
    }
  }

  function bindKeyboardHandler() {
    var hovered = false;
    $(element).bind(eventClass('mouseenter'), function (e) {
      hovered = true;
    });
    $(element).bind(eventClass('mouseleave'), function (e) {
      hovered = false;
    });

    var shouldPrevent = false;
    $(ownerDocument).bind(eventClass('keydown'), function (e) {
      if (e.isDefaultPrevented && e.isDefaultPrevented()) {
        return;
      }

      if (!hovered) {
        return;
      }

      var activeElement = document.activeElement ? document.activeElement : ownerDocument.activeElement;
      // go deeper if element is a webcomponent
      while (activeElement.shadowRoot) {
        activeElement = activeElement.shadowRoot.activeElement;
      }
      if ($(activeElement).is(":input,[contenteditable]")) {
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
          deltaY = -contentHeight;
        } else {
          deltaY = -containerHeight;
        }
        break;
      case 36: // home
        if (e.ctrlKey) {
          deltaY = element.scrollTop;
        } else {
          deltaY = containerHeight;
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
    function stopPropagation(e) { e.stopPropagation(); }

    $(scrollbarY).bind(eventClass('click'), stopPropagation);
    $(scrollbarYRail).bind(eventClass('click'), function (e) {
      var halfOfScrollbarLength = h.toInt(scrollbarYHeight / 2);
      var positionTop = e.pageY - $(scrollbarYRail).offset().top - halfOfScrollbarLength;
      var maxPositionTop = containerHeight - scrollbarYHeight;
      var positionRatio = positionTop / maxPositionTop;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }

      element.scrollTop = (contentHeight - containerHeight) * positionRatio;
    });

    $(scrollbarX).bind(eventClass('click'), stopPropagation);
    $(scrollbarXRail).bind(eventClass('click'), function (e) {
      var halfOfScrollbarLength = h.toInt(scrollbarXWidth / 2);
      var positionLeft = e.pageX - $(scrollbarXRail).offset().left - halfOfScrollbarLength;
      var maxPositionLeft = containerWidth - scrollbarXWidth;
      var positionRatio = positionLeft / maxPositionLeft;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }

      element.scrollLeft = (contentWidth - containerWidth) * positionRatio;
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
          if (!isPluginAlive) {
            clearInterval(scrollingLoop);
            return;
          }

          element.scrollTop = element.scrollTop + scrollDiff.top;
          element.scrollLeft = element.scrollLeft + scrollDiff.left;
          updateGeometry();
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
    $(ownerDocument).bind(eventClass('selectionchange'), function (e) {
      if ($.contains(element, getRangeNode())) {
        isSelected = true;
      } else {
        isSelected = false;
        stopScrolling();
      }
    });
    $(window).bind(eventClass('mouseup'), function (e) {
      if (isSelected) {
        isSelected = false;
        stopScrolling();
      }
    });

    $(window).bind(eventClass('mousemove'), function (e) {
      if (isSelected) {
        var mousePosition = {x: e.pageX, y: e.pageY};
        var containerOffset = $(element).offset();
        var containerGeometry = {
          left: containerOffset.left,
          right: containerOffset.left + element.offsetWidth,
          top: containerOffset.top,
          bottom: containerOffset.top + element.offsetHeight
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

      updateGeometry();
    }

    var startOffset = {};
    var startTime = 0;
    var speed = {};
    var easingLoop = null;
    var inGlobalTouch = false;
    var inLocalTouch = false;

    function globalTouchStart(e) {
      inGlobalTouch = true;
    }
    function globalTouchEnd(e) {
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
    function touchEnd(e) {
      if (!inGlobalTouch && inLocalTouch) {
        inLocalTouch = false;

        clearInterval(easingLoop);
        easingLoop = setInterval(function () {
          if (!isPluginAlive) {
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
      $(window).bind(eventClass("touchstart"), globalTouchStart);
      $(window).bind(eventClass("touchend"), globalTouchEnd);
      $(element).bind(eventClass("touchstart"), touchStart);
      $(element).bind(eventClass("touchmove"), touchMove);
      $(element).bind(eventClass("touchend"), touchEnd);
    }

    if (supportsIePointer) {
      if (window.PointerEvent) {
        $(window).bind(eventClass("pointerdown"), globalTouchStart);
        $(window).bind(eventClass("pointerup"), globalTouchEnd);
        $(element).bind(eventClass("pointerdown"), touchStart);
        $(element).bind(eventClass("pointermove"), touchMove);
        $(element).bind(eventClass("pointerup"), touchEnd);
      } else if (window.MSPointerEvent) {
        $(window).bind(eventClass("MSPointerDown"), globalTouchStart);
        $(window).bind(eventClass("MSPointerUp"), globalTouchEnd);
        $(element).bind(eventClass("MSPointerDown"), touchStart);
        $(element).bind(eventClass("MSPointerMove"), touchMove);
        $(element).bind(eventClass("MSPointerUp"), touchEnd);
      }
    }
  }

  function bindScrollHandler() {
    $(element).bind(eventClass('scroll'), function (e) {
      updateGeometry();
    });
  }

  function destroy() {
    $(element).unbind(eventClass());
    $(window).unbind(eventClass());
    $(ownerDocument).unbind(eventClass());
    $(element).data('perfect-scrollbar', null);
    $(element).data('perfect-scrollbar-update', null);
    $(element).data('perfect-scrollbar-destroy', null);
    $(scrollbarX).remove();
    $(scrollbarY).remove();
    $(scrollbarXRail).remove();
    $(scrollbarYRail).remove();

    // clean all variables
    scrollbarXActive =
    scrollbarYActive =
    containerWidth =
    containerHeight =
    contentWidth =
    contentHeight =
    scrollbarXWidth =
    scrollbarXLeft =
    scrollbarXBottom =
    isScrollbarXUsingBottom =
    scrollbarXTop =
    scrollbarYHeight =
    scrollbarYTop =
    scrollbarYRight =
    isScrollbarYUsingRight =
    scrollbarYLeft =
    isRtl =
    eventClass = null;

    isPluginAlive = false;
  }

  var supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
  var supportsIePointer = window.navigator.msMaxTouchPoints !== null;

  function initialize() {
    updateGeometry();
    bindScrollHandler();
    bindMouseScrollXHandler();
    bindMouseScrollYHandler();
    bindRailClickHandler();
    bindSelectionHandler();
    bindMouseWheelHandler();

    if (supportsTouch || supportsIePointer) {
      bindTouchHandler(supportsTouch, supportsIePointer);
    }
    if (settings.useKeyboard) {
      bindKeyboardHandler();
    }
    $(element).data('perfect-scrollbar', true);
    $(element).data('perfect-scrollbar-update', updateGeometry);
    $(element).data('perfect-scrollbar-destroy', destroy);
  }

  initialize();
};
