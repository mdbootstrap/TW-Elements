/* eslint-disable consistent-return */
import EventHandler from "../../dom/event-handler";

const ATTR_TIMEPICKER_DISABLED = "data-te-timepicker-disabled";
const ATTR_TIMEPICKER_ACTIVE = "data-te-timepicker-active";

const CLASSES_TIPS_DISABLED = [
  "text-[#b3afaf]",
  "pointer-events-none",
  "bg-transparent",
];
const CLASS_OPACITY = ["!opacity-100"];

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
    if (hours === 0) {
      amOrPm = "AM";
    }

    hours = hours || 12;

    if (amOrPm === undefined) {
      amOrPm = hours === 12 ? "PM" : "AM";
    }

    minutes = minutes < 10 ? `0${minutes}` : minutes;
  } else {
    [hours, minutes, amOrPm] = takeValue(date, false);
    originalHours = hours;

    hours %= 12;
    if (hours === 0) {
      amOrPm = "AM";
    }
    hours = hours || 12;

    if (amOrPm === undefined) {
      amOrPm = originalHours >= 12 ? "PM" : "AM";
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

const toggleClassHandler = (event, classes) => {
  return EventHandler.on(document, event, classes, ({ target }) => {
    if (target.hasAttribute(ATTR_TIMEPICKER_ACTIVE)) return;

    const allElements = document.querySelectorAll(classes);

    allElements.forEach((element) => {
      if (!element.hasAttribute(ATTR_TIMEPICKER_ACTIVE)) return;

      element.classList.remove(...CLASS_OPACITY);
      element.removeAttribute(ATTR_TIMEPICKER_ACTIVE);
    });

    target.classList.add(...CLASS_OPACITY);
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

const _verifyMaxTimeHourAndAddDisabledClass = (tips, maxTimeHour) => {
  tips.forEach((tip) => {
    if (tip.textContent === "00" || Number(tip.textContent) > maxTimeHour) {
      tip.classList.add(...CLASSES_TIPS_DISABLED);
      tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
    }
  });
};

const _verifyMinTimeHourAndAddDisabledClass = (tips, minTimeHour) => {
  tips.forEach((tip) => {
    if (tip.textContent !== "00" && Number(tip.textContent) < minTimeHour) {
      tip.classList.add(...CLASSES_TIPS_DISABLED);
      tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
    }
  });
};

const _verifyMaxTimeMinutesTipsAndAddDisabledClass = (
  tips,
  maxMinutes,
  maxHour,
  currHour
) => {
  tips.forEach((tip) => {
    if (
      Number(tip.textContent) > maxMinutes &&
      Number(currHour) === Number(maxHour)
    ) {
      tip.classList.add(...CLASSES_TIPS_DISABLED);
      tip.setAttribute(ATTR_TIMEPICKER_DISABLED, "");
    }
  });
};

const _verifyMinTimeMinutesTipsAndAddDisabledClass = (
  tips,
  minMinutes,
  minHour,
  currHour
) => {
  tips.forEach((tip) => {
    if (
      Number(tip.textContent) < minMinutes &&
      Number(currHour) === Number(minHour)
    ) {
      tip.classList.add(...CLASSES_TIPS_DISABLED);
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
