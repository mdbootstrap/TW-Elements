import * as _ from '../lib/helper';
import * as DOM from '../lib/dom';
import * as instances from './instances';
import updateGeometry from './update-geometry';
import updateScroll from './update-scroll';

export default function(element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  i.negativeScrollAdjustment = i.isNegativeScroll
    ? element.scrollWidth - element.clientWidth
    : 0;

  // Recalculate rail margins
  DOM.css(i.scrollbarXRail, 'display', 'block');
  DOM.css(i.scrollbarYRail, 'display', 'block');
  i.railXMarginWidth =
    _.toInt(DOM.css(i.scrollbarXRail, 'marginLeft')) +
    _.toInt(DOM.css(i.scrollbarXRail, 'marginRight'));
  i.railYMarginHeight =
    _.toInt(DOM.css(i.scrollbarYRail, 'marginTop')) +
    _.toInt(DOM.css(i.scrollbarYRail, 'marginBottom'));

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  DOM.css(i.scrollbarXRail, 'display', 'none');
  DOM.css(i.scrollbarYRail, 'display', 'none');

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  DOM.css(i.scrollbarXRail, 'display', '');
  DOM.css(i.scrollbarYRail, 'display', '');
}
