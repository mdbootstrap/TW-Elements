/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var ps = require('../plugin/ps')
  , psInstances = require('../plugin/instances');

$.fn.perfectScrollbar = function (settingOrCommand) {
  return this.each(function () {
    if (typeof settingOrCommand === 'object' ||
        typeof settingOrCommand === 'undefined') {
      // If it's an object or none, initialize.
      var settings = settingOrCommand;

      if (!psInstances.get(this)) {
        ps.initialize(this, settings);
      }
    } else {
      // Unless, it may be a command.
      var command = settingOrCommand;

      if (command === 'update') {
        ps.update(this);
      } else if (command === 'destroy') {
        ps.destroy(this);
      }
    }

    return $(this);
  });
};
