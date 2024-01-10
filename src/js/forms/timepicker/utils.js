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

/* eslint-disable consistent-return */
import EventHandler from "../../dom/event-handler";
import Manipulator from "../../dom/manipulator";

const ATTR_TIMEPICKER_DISABLED = "data-te-timepicker-disabled";
const ATTR_TIMEPICKER_ACTIVE = "data-te-timepicker-active";

const formatToAmPm = (date) => {
  if (date === "") return;
  let hours;
  let minutes;
  let amOrPm;
  let originalHours;

  if (isValidDate(date)) {
    hours = date.getHours();
    originalHours = hours;
    minutes = date.getMinutes();
    hours %= 12;
    if (originalHours === 0 && hours === 0) {
      amOrPm = "AM";
    }

    hours = hours || 12;

    if (amOrPm === undefined) {
      amOrPm = Number(originalHours) >= 12 ? "PM" : "AM";
    }

    minutes = minutes < 10 ? `0${minutes}` : minutes;
  } else {
    [hours, minutes, amOrPm] = takeValue(date, false);
    originalHours = hours;

    hours %= 12;
    if (originalHours === 0 && hours === 0) {
      amOrPm = "AM";
    }
    hours = hours || 12;

    if (amOrPm === undefined) {
      amOrPm = Number(originalHours) >= 12 ? "PM" : "AM";
    }
  }

  return {
    hours,
    minutes,
    amOrPm,
  };
};

const isValidDate = (date) => {
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !Number.isNaN(date)
  );
};

const formatNormalHours = (date) => {
  if (date === "") return;

  let hours;
  let minutes;

  if (!isValidDate(date)) {
    [hours, minutes] = takeValue(date, false);
  } else {
    hours = date.getHours();
    minutes = date.getMinutes();
  }

  minutes = Number(minutes) < 10 ? `0${Number(minutes)}` : minutes;

  return {
    hours,
    minutes,
  };
};

const toggleClassHandler = (event, selector, classes) => {
  return EventHandler.on(document, event, selector, ({ target }) => {
    if (target.hasAttribute(ATTR_TIMEPICKER_ACTIVE)) return;

    const allElements = document.querySelectorAll(selector);

    allElements.forEach((element) => {
      if (!element.hasAttribute(ATTR_TIMEPICKER_ACTIVE)) return;

      Manipulator.removeClass(element, classes.opacity);
      element.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
    });

    Manipulator.addClass(target, classes.opacity);
    target.setAttribute(ATTR_TIMEPICKER_ACTIVE, "");
  });
};

const findMousePosition = (
  { clientX, clientY, touches },
  object,
  isMobile = false
) => {
  const { left, top } = object.getBoundingClientRect();
  let obj = {};
  if (!isMobile || !touches) {
    obj = {
      x: clientX - left,
      y: clientY - top,
    };
  } else if (isMobile && Object.keys(touches).length > 0) {
    obj = {
      x: touches[0].clientX - left,
      y: touches[0].clientY - top,
    };
  }

  return obj;
};

const checkBrowser = () => {
  const isBrowserMatched =
    (navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 2 &&
      /MacIntel/.test(navigator.platform)) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  return isBrowserMatched;
};

const takeValue = (element, isInput = true) => {
  if (isInput) return element.value.replace(/:/gi, " ").split(" ");

  return element.replace(/:/gi, " ").split(" ");
};

const compareTimes = (time1, time2) => {
  const [time1Hour, time1Minutes, time1maxTimeFormat] = takeValue(time1, false);
  const [time2Hour, time2Minutes, time2maxTimeFormat] = takeValue(time2, false);

  const bothFormatsEqual = time1maxTimeFormat === time2maxTimeFormat;
  const condition =
    (time1maxTimeFormat === "PM" && time2maxTimeFormat === "AM") ||
    (bothFormatsEqual && time1Hour > time2Hour) ||
    time1Minutes > time2Minutes;

  return condition;
};

const getCurrentTime = () => {
  const date = new Date();
  const currentHours = date.getHours();
  const currentMinutes = date.getMinutes();

  const currentTime = `${currentHours}:${
    currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes
  }`;

  return currentTime;
};

const setMinTime = (minTime, disabledPast, format12) => {
  if (!disabledPast) {
    return minTime;
  }
  let currentTime = getCurrentTime();

  if (format12) {
    currentTime = `${formatToAmPm(currentTime).hours}:${
      formatToAmPm(currentTime).minutes
    } ${formatToAmPm(currentTime).amOrPm}`;
  }
  if (
    (minTime !== "" && compareTimes(currentTime, minTime)) ||
    minTime === ""
  ) {
    minTime = currentTime;
  }
  return minTime;
};

const setMaxTime = (maxTime, disabledFuture, format12) => {
  if (!disabledFuture) return maxTime;

  let currentTime = getCurrentTime();

  if (format12) {
    currentTime = `${formatToAmPm(currentTime).hours}:${
      formatToAmPm(currentTime).minutes
    } ${formatToAmPm(currentTime).amOrPm}`;
  }

  if (
    (maxTime !== "" && !compareTimes(currentTime, maxTime)) ||
    maxTime === ""
  ) {
    maxTime = currentTime;
  }

  return maxTime;
};

const checkValueBeforeAccept = (
  { format12, maxTime, minTime, disablePast, disableFuture },
  input,
  hourHeader
) => {
  const minute = takeValue(input)[1];

  minTime = setMinTime(minTime, disablePast, format12);
  maxTime = setMaxTime(maxTime, disableFuture, format12);

  const [maxTimeHour, maxTimeMin, maxTimeFormat] = takeValue(maxTime, false);
  const [minTimeHour, minTimeMin, minTimeFormat] = takeValue(minTime, false);

  if (maxTimeFormat !== undefined || minTimeFormat !== undefined)
    return [hourHeader, minute];

  if (
    maxTimeHour !== "" &&
    minTimeHour === "" &&
    Number(hourHeader) > Number(maxTimeHour)
  )
    return;

  if (
    maxTimeHour === "" &&
    minTimeHour !== "" &&
    maxTimeMin === undefined &&
    minTimeMin !== "" &&
    Number(hourHeader) < Number(minTimeHour)
  )
    return;

  return [hourHeader, minute];
};

const _verifyMaxTimeHourAndAddDisabledClass = (
  tips,
  maxTimeHour,
  classes,
  format12
) => {
  tips.forEach((tip) => {
    maxTimeHour = maxTimeHour === "12" && format12 ? "0" : maxTimeHour;
    if (
      tip.textContent === "00" ||
      Number(tip.textContent === "12" && format12 ? "0" : tip.textContent) >
        maxTimeHour
    ) {
      Manipulator.addClass(tip, classes.tipsDisabled);
      tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
    }
  });
};

const _verifyMinTimeHourAndAddDisabledClass = (
  tips,
  minTimeHour,
  classes,
  format12
) => {
  tips.forEach((tip) => {
    minTimeHour = minTimeHour === "12" && format12 ? "0" : minTimeHour;
    if (
      tip.textContent !== "00" &&
      Number(tip.textContent === "12" && format12 ? "0" : tip.textContent) <
        Number(minTimeHour)
    ) {
      Manipulator.addClass(tip, classes.tipsDisabled);
      tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
    }
  });
};

const _isHourDisabled = (selectedHour, timeHour, format12, operator) => {
  if (timeHour === "12" || timeHour === "24") {
    return;
  }

  const hourChange = format12 ? 12 : 24;

  if (operator === "max") {
    return (
      (Number(selectedHour) === hourChange ? 0 : Number(selectedHour)) >
      Number(timeHour)
    );
  }
  return (
    (Number(selectedHour) === hourChange ? 0 : Number(selectedHour)) <
    Number(timeHour)
  );
};

const _verifyMaxTimeMinutesTipsAndAddDisabledClass = (
  tips,
  maxMinutes,
  maxHour,
  currHour,
  classes,
  format12
) => {
  tips.forEach((tip) => {
    if (
      _isHourDisabled(currHour, maxHour, format12, "max") ||
      (Number(tip.textContent) > maxMinutes &&
        Number(currHour) === Number(maxHour))
    ) {
      Manipulator.addClass(tip, classes.tipsDisabled);
      tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
    }
  });
};

const _verifyMinTimeMinutesTipsAndAddDisabledClass = (
  tips,
  minMinutes,
  minHour,
  currHour,
  classes,
  format12
) => {
  tips.forEach((tip) => {
    if (
      _isHourDisabled(currHour, minHour, format12, "min") ||
      (Number(tip.textContent) < minMinutes &&
        Number(currHour) === Number(minHour))
    ) {
      Manipulator.addClass(tip, classes.tipsDisabled);
      tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
    }
  });
};

const _convertHourToNumber = (string) => {
  if (string.startsWith("0")) return Number(string.slice(1));

  return Number(string);
};

export {
  checkBrowser,
  findMousePosition,
  formatNormalHours,
  formatToAmPm,
  toggleClassHandler,
  checkValueBeforeAccept,
  takeValue,
  compareTimes,
  setMinTime,
  setMaxTime,
  _verifyMinTimeHourAndAddDisabledClass,
  _verifyMaxTimeMinutesTipsAndAddDisabledClass,
  _verifyMinTimeMinutesTipsAndAddDisabledClass,
  _verifyMaxTimeHourAndAddDisabledClass,
  _convertHourToNumber,
};
