/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var ps = require('./plugin/ps');

$.fn.perfectScrollbar = function (settingOrCommand) {
  return this.each(function () {
    ps(this, settingOrCommand);
    return $(this);
  });
};
