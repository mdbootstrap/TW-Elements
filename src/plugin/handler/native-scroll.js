import * as instances from '../instances';
import updateGeometry from '../update-geometry';

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function() {
    updateGeometry(element);
  });
}

export default function(element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
}
