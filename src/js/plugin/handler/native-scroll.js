'use strict';

var instances = require('../instances');
var cls = require('../../lib/class');
var updateGeometry = require('../update-geometry');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function (e) {
    var currentClasses = cls.list(element);
    if (currentClasses.indexOf("ps-disabled") !== -1) {
      e.preventDefault();
      return;
    }

    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};
