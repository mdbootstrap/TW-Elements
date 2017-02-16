'use strict';

var updateScroll = require('../update-scroll');
var PositionChecker = require('./mouse-drag/position-checker.js');

/**
 * Drag handler is for scrolling the container when we are dragging something in it.
 * When we drag something to the edge of the container, for example to the top then it should scroll up.
 * When we drag something to the bottom it should scroll down.
 *
 * @TODO Better scroll speed. For now it's a fixed number (30pixels every 30 milliseconds). It should
 * be something more fancy, like calculating from content size.
 * @TODO only vertical scrolling is available for now, horizontal needs to be added
 * @TODO when dragging something to different container scrolling does not work.
 * @TODO This is more a prototype that production version. It needs much more testing and improvements.
 *
 * @param  {[type]}
 * @return {[type]}
 */
function bindMouseDragHandler(element) {

  // Scroll frequency - for example scroll will run every 30 milliseconds.
  var scrollEvery = 30;

  /**
   * How big move should be done every iteration (in pixels)
   * @type {Number}
   */
  var movePixels = 30;

  /**
   * Currently active scroll direction. False if nothing is scrolling, string if there is something.
   * @type {Boolean|String}
   */
  var currentScrollDirection = false;

  /**
   * How large is the field that triggers scrolling.
   * For example 0.1 means that it's 0.1 * container height from border.
   * @type {Number}
   */
  var borderOffset = 0.1;

  /**
   * If currently something is being dragged
   * @type {Boolean}
   */
  var isDragging = false;

  /**
   * If scroll function should be launched.
   * This is used to stop scrolling.
   * @type {Boolean}
   */
  var shouldScroll = false;

  /**
   * Position checker object have methods that return boolean value if the mouse is in the
   * position when particular scroll direction should be launched.
   *
   * @type {PositionChecker}
   */
  var positionChecker = new PositionChecker(borderOffset);

  /**
   * Scroll method will scroll in the given direction and run itself after scrollEvery time.
   * it will work until shouldScroll is true.
   *
   * @param  {Object} Event
   * @param  {Object} Container Element
   * @param  {String} Scroll direction, for example: "top"
   */
  function scroll(e, element, direction) {

    // Stop whole scrolling process if isDragging is false
    if (shouldScroll === false) {
      return;
    }

    switch (direction) {
    case 'top':
      updateScroll(element, 'top', element.scrollTop - movePixels);
      break;
    case 'bottom':
      updateScroll(element, 'top', element.scrollTop + movePixels);
      break;
    }

    setTimeout(
    function () {
      scroll(e, element, direction);
    }, scrollEvery);
  }

  /**
   * Stops the scrolling.
   */
  function stopScrolling() {
    shouldScroll = false;
    currentScrollDirection = false;
  }

  /**
   *
   * Stops scrolling if there is one running and then starts it again.
   *
   * @param  {Object} Event
   * @param  {Object} Container Element
   * @param  {String} Direction
   */
  function startScrolling(e, element, direction) {

    // Stop any previous scrolling
    stopScrolling();

    // Setup
    shouldScroll = true;
    currentScrollDirection = direction;

    // Start scroll function. It should be delayed so the stopScrolling method will finish
    setTimeout(function () {
      scroll(e, element, direction);
    }, scrollEvery * 3);
  }

  /**
   * Drag Listener.
   *
   * Sets isDragging to true. This event is because we need to detect when mouse is dragging something.
   */
  element.addEventListener('drag', function () {
    // console.log("Drag");
    isDragging = true;
  });

  /**
   * Dragend Listener.
   * This is necessary to detect when we should stop scrolling even if the mouse is in
   * the position where it should scroll in some direction.
   */
  element.addEventListener('dragend',
  function () {
    isDragging = false;
    stopScrolling();
  });

  /**
   * Drop Listener.
   * This is necessary to detect when we should stop scrolling even if the mouse is in
   * the position where it should scroll in some direction.
   * Added as dragend is not always trigerred.
   */
  element.addEventListener('drop',
  function () {
    isDragging = false;
    stopScrolling();
  });

  /**
   * Because firefox does not have mouse position in a drag event I needed to use something else.
   * If isDragging is set to true then this method will start scrolling.
   *
   * @param  {Object} Event
   */
  element.addEventListener('dragover', function (e) {

    var newScrollDirection = false;

    // Stop scrolling if we stop dragging something
    if (isDragging === false && shouldScroll === true) {
      stopScrolling();
    }

    // Do nothing if we aren't scrolling anything and not dragging.
    // This is just in case really.
    if (isDragging === false) {
      return;
    }

    // Set the scroll direction or stop scrolling if there is no valid direction.
    if (positionChecker.isNearTopBorder(e, element)) {
      newScrollDirection = 'top';
    } else if (positionChecker.isNearBottomBorder(e, element)) {
      newScrollDirection = 'bottom';
    } else if (shouldScroll === true) {
      stopScrolling();
      return;
    }

    // Start  scrolling if the new direction is different from the current one.
    // This is to prevent starting again when we move a mouse for example on the top border only.
    if (newScrollDirection !== currentScrollDirection) {
      startScrolling(e, element, newScrollDirection);
    }

  }, true);
}

module.exports = function (element) {
  bindMouseDragHandler(element);
};
