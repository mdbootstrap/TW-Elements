/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var incrementingId = 0;
module.exports = function () {
  var id = incrementingId++;
  return function (eventName) {
    var className = '.perfect-scrollbar-' + id;
    if (typeof eventName === 'undefined') {
      return className;
    } else {
      return eventName + className;
    }
  };
};
