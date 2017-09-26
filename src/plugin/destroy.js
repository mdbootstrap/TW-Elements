import * as _ from '../lib/helper';
import * as DOM from '../lib/dom';
import * as instances from './instances';

export default function(element) {
  var i = instances.get(element);

  if (!i) {
    return;
  }

  i.event.unbindAll();
  DOM.remove(i.scrollbarX);
  DOM.remove(i.scrollbarY);
  DOM.remove(i.scrollbarXRail);
  DOM.remove(i.scrollbarYRail);
  _.removePsClasses(element);

  instances.remove(element);
}
