import Instance from './instance';
import updateGeometry from './update-geometry';

import clickRail from './handler/click-rail';
import dragScrollbar from './handler/drag-scrollbar';
import keyboard from './handler/keyboard';
import wheel from './handler/mouse-wheel';
import touch from './handler/touch';
import nativeScrollHandler from './handler/native-scroll';

// Handlers
var handlers = {
  'click-rail': clickRail,
  'drag-scrollbar': dragScrollbar,
  keyboard,
  wheel,
  touch,
};

export default function(element, userSettings = {}) {
  const i = new Instance(element, userSettings);

  i.settings.handlers.forEach(handlerName => handlers[handlerName](i));

  nativeScrollHandler(i);
  updateGeometry(i);

  return i;
}
