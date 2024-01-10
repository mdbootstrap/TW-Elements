/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

function normalizeData(val) {
  if (val === "true") {
    return true;
  }

  if (val === "false") {
    return false;
  }

  if (val === Number(val).toString()) {
    return Number(val);
  }

  if (val === "" || val === "null") {
    return null;
  }

  return val;
}

function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
}

const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-te-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-te-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = {};

    Object.keys(element.dataset)
      .filter((key) => key.startsWith("te"))
      .forEach((key) => {
        if (key.startsWith("teClass")) {
          return;
        }

        let pureKey = key.replace(/^te/, "");
        pureKey =
          pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });

    return attributes;
  },

  getDataClassAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = {
      ...element.dataset,
    };

    Object.keys(attributes)
      .filter((key) => key.startsWith("teClass"))
      .forEach((key) => {
        let pureKey = key.replace(/^teClass/, "");
        pureKey =
          pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(attributes[key]);
      });

    return attributes;
  },

  getDataAttribute(element, key) {
    return normalizeData(
      element.getAttribute(`data-te-${normalizeDataKey(key)}`)
    );
  },

  offset(element) {
    const rect = element.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  },

  position(element) {
    return {
      top: element.offsetTop,
      left: element.offsetLeft,
    };
  },

  style(element, style) {
    Object.assign(element.style, style);
  },

  toggleClass(element, classNameOrList) {
    if (!element) {
      return;
    }

    _classNameOrListToArray(classNameOrList).forEach((className) => {
      if (element.classList.contains(className)) {
        element.classList.remove(className);
      } else {
        element.classList.add(className);
      }
    });
  },

  addClass(element, classNameOrList) {
    _classNameOrListToArray(classNameOrList).forEach(
      (className) =>
        !element.classList.contains(className) &&
        element.classList.add(className)
    );
  },

  addStyle(element, style) {
    Object.keys(style).forEach((property) => {
      element.style[property] = style[property];
    });
  },

  removeClass(element, classNameOrList) {
    _classNameOrListToArray(classNameOrList).forEach(
      (className) =>
        element.classList.contains(className) &&
        element.classList.remove(className)
    );
  },

  hasClass(element, className) {
    return element.classList.contains(className);
  },

  maxOffset(element) {
    const rect = element.getBoundingClientRect();

    return {
      top:
        rect.top +
        Math.max(
          document.body.scrollTop,
          document.documentElement.scrollTop,
          window.scrollY
        ),
      left:
        rect.left +
        Math.max(
          document.body.scrollLeft,
          document.documentElement.scrollLeft,
          window.scrollX
        ),
    };
  },
};

function _classNameOrListToArray(classNameOrList) {
  if (typeof classNameOrList === "string") {
    return classNameOrList.split(" ");
  } else if (Array.isArray(classNameOrList)) {
    return classNameOrList;
  }

  return false;
}

export default Manipulator;
