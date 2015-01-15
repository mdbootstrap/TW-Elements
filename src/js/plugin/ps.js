/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var defaultSettings = require('./default-setting')
  , h = require('../lib/helper');

var incrementingId = 0;
var eventClassFactory = function () {
  var id = incrementingId++;
  return function (eventName) {
    var className = '.perfect-scrollbar-' + id;
    if (typeof eventName === 'undefined') {
      return className;
    } else {
      return eventName + className;
    }
  };
};

module.exports = function (element, settingOrCommand) {
  var settings = h.clone(defaultSettings);
  var $this = $(element);
  var isPluginAlive = function () { return !!$this; };
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
    if ($this.data('perfect-scrollbar-update')) {
      $this.data('perfect-scrollbar-update')();
    }
    return $this;
  }
  else if (command === 'destroy') {
    if ($this.data('perfect-scrollbar-destroy')) {
      $this.data('perfect-scrollbar-destroy')();
    }
    return $this;
  }

  if ($this.data('perfect-scrollbar')) {
    // if there's already perfect-scrollbar
    return $this.data('perfect-scrollbar');
  }


  // Or generate new perfectScrollbar

  $this.addClass('ps-container');

  var containerWidth;
  var containerHeight;
  var contentWidth;
  var contentHeight;

  var isRtl = $this.css('direction') === "rtl";
  var eventClass = eventClassFactory();
  var ownerDocument = element.ownerDocument || document;

  var $scrollbarXRail = $("<div class='ps-scrollbar-x-rail'>").appendTo($this);
  var $scrollbarX = $("<div class='ps-scrollbar-x'>").appendTo($scrollbarXRail);
  var scrollbarXActive;
  var scrollbarXWidth;
  var scrollbarXLeft;
  var scrollbarXBottom = h.toInt($scrollbarXRail.css('bottom'));
  var isScrollbarXUsingBottom = scrollbarXBottom === scrollbarXBottom; // !isNaN
  var scrollbarXTop = isScrollbarXUsingBottom ? null : h.toInt($scrollbarXRail.css('top'));
  var railBorderXWidth = h.toInt($scrollbarXRail.css('borderLeftWidth')) + h.toInt($scrollbarXRail.css('borderRightWidth'));
  var railXMarginWidth = h.toInt($scrollbarXRail.css('marginLeft')) + h.toInt($scrollbarXRail.css('marginRight'));
  var railXWidth;

  var $scrollbarYRail = $("<div class='ps-scrollbar-y-rail'>").appendTo($this);
  var $scrollbarY = $("<div class='ps-scrollbar-y'>").appendTo($scrollbarYRail);
  var scrollbarYActive;
  var scrollbarYHeight;
  var scrollbarYTop;
  var scrollbarYRight = h.toInt($scrollbarYRail.css('right'));
  var isScrollbarYUsingRight = scrollbarYRight === scrollbarYRight; // !isNaN
  var scrollbarYLeft = isScrollbarYUsingRight ? null : h.toInt($scrollbarYRail.css('left'));
  var railBorderYWidth = h.toInt($scrollbarYRail.css('borderTopWidth')) + h.toInt($scrollbarYRail.css('borderBottomWidth'));
  var railYMarginHeight = h.toInt($scrollbarYRail.css('marginTop')) + h.toInt($scrollbarYRail.css('marginBottom'));
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
    $this.scrollTop(scrollTop);
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
    $this.scrollLeft(scrollLeft);
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
      xRailOffset.left = $this.scrollLeft() + containerWidth - contentWidth;
    } else {
      xRailOffset.left = $this.scrollLeft();
    }
    if (isScrollbarXUsingBottom) {
      xRailOffset.bottom = scrollbarXBottom - $this.scrollTop();
    } else {
      xRailOffset.top = scrollbarXTop + $this.scrollTop();
    }
    $scrollbarXRail.css(xRailOffset);

    var railYOffset = {top: $this.scrollTop(), height: railYHeight};

    if (isScrollbarYUsingRight) {
      if (isRtl) {
        railYOffset.right = contentWidth - $this.scrollLeft() - scrollbarYRight - $scrollbarY.outerWidth();
      } else {
        railYOffset.right = scrollbarYRight - $this.scrollLeft();
      }
    } else {
      if (isRtl) {
        railYOffset.left = $this.scrollLeft() + containerWidth * 2 - contentWidth - scrollbarYLeft - $scrollbarY.outerWidth();
      } else {
        railYOffset.left = scrollbarYLeft + $this.scrollLeft();
      }
    }
    $scrollbarYRail.css(railYOffset);

    $scrollbarX.css({left: scrollbarXLeft, width: scrollbarXWidth - railBorderXWidth});
    $scrollbarY.css({top: scrollbarYTop, height: scrollbarYHeight - railBorderYWidth});
  }

  function updateGeometry() {
    // Hide scrollbars not to affect scrollWidth and scrollHeight
    $this.removeClass('ps-active-x');
    $this.removeClass('ps-active-y');

    containerWidth = settings.includePadding ? $this.innerWidth() : $this.width();
    containerHeight = settings.includePadding ? $this.innerHeight() : $this.height();
    contentWidth = $this.prop('scrollWidth');
    contentHeight = $this.prop('scrollHeight');

    if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
      scrollbarXActive = true;
      railXWidth = containerWidth - railXMarginWidth;
      scrollbarXWidth = getThumbSize(h.toInt(railXWidth * containerWidth / contentWidth));
      scrollbarXLeft = h.toInt($this.scrollLeft() * (railXWidth - scrollbarXWidth) / (contentWidth - containerWidth));
    } else {
      scrollbarXActive = false;
      scrollbarXWidth = 0;
      scrollbarXLeft = 0;
      $this.scrollLeft(0);
    }

    if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
      scrollbarYActive = true;
      railYHeight = containerHeight - railYMarginHeight;
      scrollbarYHeight = getThumbSize(h.toInt(railYHeight * containerHeight / contentHeight));
      scrollbarYTop = h.toInt($this.scrollTop() * (railYHeight - scrollbarYHeight) / (contentHeight - containerHeight));
    } else {
      scrollbarYActive = false;
      scrollbarYHeight = 0;
      scrollbarYTop = 0;
      $this.scrollTop(0);
    }

    if (scrollbarXLeft >= railXWidth - scrollbarXWidth) {
      scrollbarXLeft = railXWidth - scrollbarXWidth;
    }
    if (scrollbarYTop >= railYHeight - scrollbarYHeight) {
      scrollbarYTop = railYHeight - scrollbarYHeight;
    }

    updateCss();

    if (scrollbarXActive) {
      $this.addClass('ps-active-x');
    }
    if (scrollbarYActive) {
      $this.addClass('ps-active-y');
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
      $this.removeClass('ps-in-scrolling');
      $(ownerDocument).unbind(eventClass('mousemove'), mouseMoveHandler);
    };

    $scrollbarX.bind(eventClass('mousedown'), function (e) {
      currentPageX = e.pageX;
      currentLeft = $scrollbarX.position().left;
      $this.addClass('ps-in-scrolling');

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
      $this.removeClass('ps-in-scrolling');
      $(ownerDocument).unbind(eventClass('mousemove'), mouseMoveHandler);
    };

    $scrollbarY.bind(eventClass('mousedown'), function (e) {
      currentPageY = e.pageY;
      currentTop = $scrollbarY.position().top;
      $this.addClass('ps-in-scrolling');

      $(ownerDocument).bind(eventClass('mousemove'), mouseMoveHandler);
      $(ownerDocument).one(eventClass('mouseup'), mouseUpHandler);

      e.stopPropagation();
      e.preventDefault();
    });

    currentTop =
    currentPageY = null;
  }

  function shouldPreventWheel(deltaX, deltaY) {
    var scrollTop = $this.scrollTop();
    if (deltaX === 0) {
      if (!scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
        return !settings.wheelPropagation;
      }
    }

    var scrollLeft = $this.scrollLeft();
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
    var scrollTop = $this.scrollTop();
    var scrollLeft = $this.scrollLeft();
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
      if (!h.isWebKit && $this.find('select:focus').length > 0) {
        return;
      }

      var delta = getDeltaFromEvent(e);

      var deltaX = delta[0];
      var deltaY = delta[1];

      shouldPrevent = false;
      if (!settings.useBothWheelAxes) {
        // deltaX will only be used for horizontal scrolling and deltaY will
        // only be used for vertical scrolling - this is the default
        $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
        $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
      } else if (scrollbarYActive && !scrollbarXActive) {
        // only vertical scrollbar is active and useBothWheelAxes option is
        // active, so let's scroll vertical bar using both mouse wheel axes
        if (deltaY) {
          $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
        } else {
          $this.scrollTop($this.scrollTop() + (deltaX * settings.wheelSpeed));
        }
        shouldPrevent = true;
      } else if (scrollbarXActive && !scrollbarYActive) {
        // useBothWheelAxes and only horizontal bar is active, so use both
        // wheel axes for horizontal bar
        if (deltaX) {
          $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
        } else {
          $this.scrollLeft($this.scrollLeft() - (deltaY * settings.wheelSpeed));
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
      $this.bind(eventClass('wheel'), mousewheelHandler);
    } else if (typeof window.onmousewheel !== "undefined") {
      $this.bind(eventClass('mousewheel'), mousewheelHandler);
    }
  }

  function bindKeyboardHandler() {
    var hovered = false;
    $this.bind(eventClass('mouseenter'), function (e) {
      hovered = true;
    });
    $this.bind(eventClass('mouseleave'), function (e) {
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
          deltaY = $this.scrollTop();
        } else {
          deltaY = containerHeight;
        }
        break;
      default:
        return;
      }

      $this.scrollTop($this.scrollTop() - deltaY);
      $this.scrollLeft($this.scrollLeft() + deltaX);

      shouldPrevent = shouldPreventWheel(deltaX, deltaY);
      if (shouldPrevent) {
        e.preventDefault();
      }
    });
  }

  function bindRailClickHandler() {
    function stopPropagation(e) { e.stopPropagation(); }

    $scrollbarY.bind(eventClass('click'), stopPropagation);
    $scrollbarYRail.bind(eventClass('click'), function (e) {
      var halfOfScrollbarLength = h.toInt(scrollbarYHeight / 2);
      var positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength;
      var maxPositionTop = containerHeight - scrollbarYHeight;
      var positionRatio = positionTop / maxPositionTop;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }

      $this.scrollTop((contentHeight - containerHeight) * positionRatio);
    });

    $scrollbarX.bind(eventClass('click'), stopPropagation);
    $scrollbarXRail.bind(eventClass('click'), function (e) {
      var halfOfScrollbarLength = h.toInt(scrollbarXWidth / 2);
      var positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength;
      var maxPositionLeft = containerWidth - scrollbarXWidth;
      var positionRatio = positionLeft / maxPositionLeft;

      if (positionRatio < 0) {
        positionRatio = 0;
      } else if (positionRatio > 1) {
        positionRatio = 1;
      }

      $this.scrollLeft((contentWidth - containerWidth) * positionRatio);
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
          if (!isPluginAlive()) {
            clearInterval(scrollingLoop);
            return;
          }

          $this.scrollTop($this.scrollTop() + scrollDiff.top);
          $this.scrollLeft($this.scrollLeft() + scrollDiff.left);
          updateGeometry();
        }, 50); // every .1 sec
      }
    }
    function stopScrolling() {
      if (scrollingLoop) {
        clearInterval(scrollingLoop);
        scrollingLoop = null;
      }
      $this.removeClass('ps-in-scrolling');
      $this.removeClass('ps-in-scrolling');
    }

    var isSelected = false;
    $(ownerDocument).bind(eventClass('selectionchange'), function (e) {
      if ($.contains($this[0], getRangeNode())) {
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
        var containerOffset = $this.offset();
        var containerGeometry = {
          left: containerOffset.left,
          right: containerOffset.left + $this.outerWidth(),
          top: containerOffset.top,
          bottom: containerOffset.top + $this.outerHeight()
        };

        if (mousePosition.x < containerGeometry.left + 3) {
          scrollDiff.left = -5;
          $this.addClass('ps-in-scrolling');
        } else if (mousePosition.x > containerGeometry.right - 3) {
          scrollDiff.left = 5;
          $this.addClass('ps-in-scrolling');
        } else {
          scrollDiff.left = 0;
        }

        if (mousePosition.y < containerGeometry.top + 3) {
          if (containerGeometry.top + 3 - mousePosition.y < 5) {
            scrollDiff.top = -5;
          } else {
            scrollDiff.top = -20;
          }
          $this.addClass('ps-in-scrolling');
        } else if (mousePosition.y > containerGeometry.bottom - 3) {
          if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
            scrollDiff.top = 5;
          } else {
            scrollDiff.top = 20;
          }
          $this.addClass('ps-in-scrolling');
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
      $this.scrollTop($this.scrollTop() - differenceY);
      $this.scrollLeft($this.scrollLeft() - differenceX);

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
          if (!isPluginAlive()) {
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
      $this.bind(eventClass("touchstart"), touchStart);
      $this.bind(eventClass("touchmove"), touchMove);
      $this.bind(eventClass("touchend"), touchEnd);
    }

    if (supportsIePointer) {
      if (window.PointerEvent) {
        $(window).bind(eventClass("pointerdown"), globalTouchStart);
        $(window).bind(eventClass("pointerup"), globalTouchEnd);
        $this.bind(eventClass("pointerdown"), touchStart);
        $this.bind(eventClass("pointermove"), touchMove);
        $this.bind(eventClass("pointerup"), touchEnd);
      } else if (window.MSPointerEvent) {
        $(window).bind(eventClass("MSPointerDown"), globalTouchStart);
        $(window).bind(eventClass("MSPointerUp"), globalTouchEnd);
        $this.bind(eventClass("MSPointerDown"), touchStart);
        $this.bind(eventClass("MSPointerMove"), touchMove);
        $this.bind(eventClass("MSPointerUp"), touchEnd);
      }
    }
  }

  function bindScrollHandler() {
    $this.bind(eventClass('scroll'), function (e) {
      updateGeometry();
    });
  }

  function destroy() {
    $this.unbind(eventClass());
    $(window).unbind(eventClass());
    $(ownerDocument).unbind(eventClass());
    $this.data('perfect-scrollbar', null);
    $this.data('perfect-scrollbar-update', null);
    $this.data('perfect-scrollbar-destroy', null);
    $scrollbarX.remove();
    $scrollbarY.remove();
    $scrollbarXRail.remove();
    $scrollbarYRail.remove();

    // clean all variables
    $this =
    $scrollbarXRail =
    $scrollbarYRail =
    $scrollbarX =
    $scrollbarY =
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
    $this.data('perfect-scrollbar', $this);
    $this.data('perfect-scrollbar-update', updateGeometry);
    $this.data('perfect-scrollbar-destroy', destroy);
  }

  initialize();
};
