/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

exports.once = function (element, eventName, handler) {
  element.addEventListener(eventName, function (e) {
    element.removeEventListener(eventName, handler, false);
    handler(e);
  }, false);
};
