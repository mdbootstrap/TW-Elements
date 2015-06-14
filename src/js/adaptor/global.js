/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var ps = require('../main');

if (typeof define === 'function' && define.amd) {
  // AMD
  define(ps);
} else {
  // Add to a global object.
  window.PerfectScrollbar = ps;
  if (typeof window.Ps === 'undefined') {
    window.Ps = ps;
  }
}
