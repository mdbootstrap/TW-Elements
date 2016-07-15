'use strict';

var destroy = require('./plugin/destroy');
var initialize = require('./plugin/initialize');
var update = require('./plugin/update');
var enable = require('./plugin/enable');
var disable = require('./plugin/disable');

module.exports = {
  initialize: initialize,
  update: update,
  destroy: destroy,
  enable: enable,
  disable: disable
};
