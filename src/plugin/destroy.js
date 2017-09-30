import * as DOM from '../lib/dom';
import * as instances from './instances';

function removePsClasses(element) {
  for (let i = 0; i < element.classList.length; i++) {
    const className = element.classList[i];
    if (className === 'ps' || className.indexOf('ps-') === 0) {
      element.classList.remove(className);
    }
  }
}

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
  removePsClasses(element);

  instances.remove(element);
}
