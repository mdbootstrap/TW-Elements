import * as instances from './instances';
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

export default function(element, userSettings) {
  element.classList.add('ps');

  // Create a plugin instance.
  var i = instances.add(
    element,
    typeof userSettings === 'object' ? userSettings : {}
  );

  i.settings.handlers.forEach(function(handlerName) {
    handlers[handlerName](element);
  });

  nativeScrollHandler(element);

  updateGeometry(element);
}
