import * as CSS from '../lib/css';
import * as DOM from '../lib/dom';
import * as instances from './instances';
import updateGeometry from './update-geometry';
import updateScroll from './update-scroll';
import { toInt } from '../lib/util';

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
  CSS.set(i.scrollbarXRail, { display: 'block' });
  CSS.set(i.scrollbarYRail, { display: 'block' });
  i.railXMarginWidth =
    toInt(CSS.get(i.scrollbarXRail).marginLeft) +
    toInt(CSS.get(i.scrollbarXRail).marginRight);
  i.railYMarginHeight =
    toInt(CSS.get(i.scrollbarYRail).marginTop) +
    toInt(CSS.get(i.scrollbarYRail).marginBottom);

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  CSS.set(i.scrollbarXRail, { display: 'none' });
  CSS.set(i.scrollbarYRail, { display: 'none' });

  updateGeometry(element);

  // Update top/left scroll to trigger events
  updateScroll(element, 'top', element.scrollTop);
  updateScroll(element, 'left', element.scrollLeft);

  CSS.set(i.scrollbarXRail, { display: '' });
  CSS.set(i.scrollbarYRail, { display: '' });
}
