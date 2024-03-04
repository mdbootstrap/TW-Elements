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
    element.setAttribute(`data-twe-${normalizeDataKey(key)}`, value);
  },

  removeDataAttribute(element, key) {
    element.removeAttribute(`data-twe-${normalizeDataKey(key)}`);
  },

  getDataAttributes(element) {
    if (!element) {
      return {};
    }

    const attributes = {};

    Object.keys(element.dataset)
      .filter((key) => key.startsWith("twe"))
      .forEach((key) => {
        if (key.startsWith("tweClass")) {
          return;
        }

        let pureKey = key.replace(/^twe/, "");
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
      .filter((key) => key.startsWith("tweClass"))
      .forEach((key) => {
        let pureKey = key.replace(/^tweClass/, "");
        pureKey =
          pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(attributes[key]);
      });

    return attributes;
  },

  getDataAttribute(element, key) {
    return normalizeData(
      element.getAttribute(`data-twe-${normalizeDataKey(key)}`)
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
