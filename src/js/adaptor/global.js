/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var ps = require('../main');

window.PerfectScrollbar = ps;
if (typeof window.Ps === 'undefined') {
  window.Ps = ps;
}
