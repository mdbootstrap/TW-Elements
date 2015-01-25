/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var destroy = require('./destroy')
  , initialize = require('./initialize')
  , update = require('./update');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy
};
