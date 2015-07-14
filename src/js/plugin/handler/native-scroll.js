/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var instances = require('../instances')
  , updateGeometry = require('../update-geometry')
  , updateCssBottom = require('../update-css-bottom');

function bindNativeScrollHandler(element, i) {
  i.event.bind(element, 'scroll', function () {
    updateGeometry(element);
  });

  if (i.settings.fixedScrollX) {
    window.addEventListener("scroll", function () {
      updateCssBottom(element, i);
    });
  }
}

module.exports = function (element) {
  var i = instances.get(element);
  bindNativeScrollHandler(element, i);
};
