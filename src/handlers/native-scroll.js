import updateGeometry from '../update-geometry';

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', () => updateGeometry(i));
}

export default function(i) {
  bindNativeScrollHandler(i.element, i);
}
