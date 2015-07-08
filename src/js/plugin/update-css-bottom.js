/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('../lib/dom');

module.exports = function (element, i) {
  var xRailOffset = {bottom: 0};
  // distance scrolled
  var scrolled = window.scrollY + window.innerHeight;
  // distance from the top of the page to the bottom of the element
  var elementBottom = (element.getBoundingClientRect().top + document.body.scrollTop) + element.offsetHeight;

  // if user has not scrolled beyond the element
  if (scrolled < elementBottom) { // position xRail to the bottom of the element
    xRailOffset.bottom = (Math.abs(scrolled - elementBottom));
  }

  d.css(i.scrollbarXRail, xRailOffset);
};
