'use strict';

function positionChecker(borderOffset) {
  this.borderOffset = borderOffset;
}

/**
 * Return true if mouse cursor is near the top border of the element.
 *
 * @param  {Object}  Event
 * @param  {Object}  Container Element
 * @return {Boolean}
 */
positionChecker.prototype.isNearTopBorder = function (e, element) {
  var topPos = element.getBoundingClientRect().top + window.scrollY;
  var leftPos = element.getBoundingClientRect().left + window.scrollX;

  if (
    e.pageY <= topPos + Math.round(this.borderOffset * element.offsetHeight) &&
    e.pageY >= topPos &&
    e.pageX >= leftPos &&
    e.pageX <= leftPos + element.offsetWidth
  ) {
    return true;
  }

  return false;
};

/**
 * Return true if mouse cursor is near the top border of the element.
 *
 * @param  {Object}  Event
 * @param  {Object}  Container Element
 * @return {Boolean}
 */
positionChecker.prototype.isNearBottomBorder = function (e, element) {
  var bottomPos = element.getBoundingClientRect().bottom + window.scrollY;
  var leftPos = element.getBoundingClientRect().left + window.scrollX;

  if (
    e.pageY >= bottomPos - Math.round(this.borderOffset * element.offsetHeight) &&
    e.pageY <= bottomPos &&
    e.pageX >= leftPos &&
    e.pageX <= leftPos + element.offsetWidth
  ) {
    return true;
  }

  return false;
};

module.exports = positionChecker;
