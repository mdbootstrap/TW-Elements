'use strict';

var instances = require('../instances');
var updateGeometry = require('../update-geometry');


function bindWindowScrollHandler(element, i) {
  i.event.bind(window, 'scroll', function () {
    updateGeometry(element);
  });
}

module.exports = function (element) {
  var i = instances.get(element);
  bindWindowScrollHandler(element, i);
};
