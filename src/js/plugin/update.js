/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var destroy = require('./destroy')
  , initialize = require('./initialize')
  , instances = require('./instances')
  , updateGeometry = require('./update-geometry');

module.exports = function (element) {
  var i = instances.get(element);

  if (!i.scrollbarXRail || !element.contains(i.scrollbarXRail) ||
      !i.scrollbarYRail || !element.contains(i.scrollbarYRail)) {
    // If there's something wrong in the plugin, re-initialise.
    destroy(element);
    initialize(element);
  } else {
    updateGeometry(element);
  }
};
