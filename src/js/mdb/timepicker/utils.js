/* eslint-disable consistent-return */
import EventHandler from '../dom/event-handler';
import Manipulator from '../dom/manipulator';

// eslint-disable-next-line import/prefer-default-export
const formatToAmPm = (date) => {
  if (date === '') return;
  let hours;
  let minutes;
  let amOrPm;

  if (isValidDate(date)) {
    hours = date.getHours();
    minutes = date.getMinutes();
    hours %= 12;
    if (hours === 0) {
      amOrPm = 'AM';
    }
    hours = hours || 12;

    if (amOrPm === undefined) {
      amOrPm = hours >= 12 ? 'PM' : 'AM';
    }
    minutes = minutes < 10 ? `0${minutes}` : minutes;
  } else {
    [hours, minutes, amOrPm] = takeValue(date, false);

    hours %= 12;
    if (hours === 0) {
      amOrPm = 'AM';
    }
    hours = hours || 12;

    if (amOrPm === undefined) {
      amOrPm = hours >= 12 ? 'PM' : 'AM';
    }
  }

  return {
    hours,
    minutes,
    amOrPm,
  };
};

const isValidDate = (date) => {
  // eslint-disable-next-line no-restricted-globals
  return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
};

const toggleClassHandler = (event, classes) => {
  return EventHandler.on(document, event, classes, ({ target }) => {
    if (!Manipulator.hasClass(target, 'active')) {
      const allElements = document.querySelectorAll(classes);

      allElements.forEach((element) => {
        if (Manipulator.hasClass(element, 'active')) {
          Manipulator.removeClass(element, 'active');
        }
      });

      Manipulator.addClass(target, 'active');
    }
  });
};

const findMousePosition = ({ clientX, clientY, touches }, object, isMobile = false) => {
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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const takeValue = (element, isInput = true) => {
  let valueInput;
  if (isInput) {
    valueInput = element.value.replace(/:/gi, ' ');
  } else {
    valueInput = element.replace(/:/gi, ' ');
  }

  return valueInput.split(' ');
};

export { checkBrowser, findMousePosition, formatToAmPm, toggleClassHandler, takeValue };
