/* Copyright (c) 2015 Hyunje Alex Jun and other contributors
 * Licensed under the MIT License
 */
'use strict';

var d = require('./dom');

exports.toInt = function (x) {
  if (typeof x === 'string') {
    return parseInt(x, 10);
  } else {
    return ~~x;
  }
};

exports.isWebKit = 'WebkitAppearance' in document.documentElement.style;

exports.clone = function (obj) {
  if (obj === null) {
    return null;
  } else if (typeof obj === 'object') {
    var result = {};
    for (var key in obj) {
      result[key] = this.clone(obj[key]);
    }
    return result;
  } else {
    return obj;
  }
};

exports.extend = function (original, source) {
  var result = this.clone(original);
  for (var key in source) {
    result = this.clone(source[key]);
  }
  return result;
};

exports.isEditable = function (el) {
  return d.matches(el, "input,[contenteditable]") ||
         d.matches(el, "select,[contenteditable]") ||
         d.matches(el, "textarea,[contenteditable]") ||
         d.matches(el, "button,[contenteditable]");
};
