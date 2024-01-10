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

export function getDate(date) {
  return date.getDate();
}

export function getDayNumber(date) {
  return date.getDay();
}

export function getMonth(date) {
  return date.getMonth();
}

export function getYear(date) {
  return date.getFullYear();
}

export function getFirstDayOfWeek(year, month, options) {
  const firstDayIndex = options.startDay;
  const sundayIndex = firstDayIndex > 0 ? 7 - firstDayIndex : 0;
  const date = new Date(year, month);
  const index = date.getDay() + sundayIndex;
  const newIndex = index >= 7 ? index - 7 : index;
  return newIndex;
}

export function getDaysInMonth(date) {
  return getMonthEnd(date).getDate();
}

export function getMonthEnd(date) {
  return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getToday() {
  return new Date();
}

export function addYears(date, years) {
  return addMonths(date, years * 12);
}

export function addMonths(date, months) {
  const month = createDate(
    date.getFullYear(),
    date.getMonth() + months,
    date.getDate()
  );
  const dayOfPreviousMonth = getDate(date);
  const dayOfNewMonth = getDate(month);

  // Solution for edge cases, like moving from a month with a greater number
  // of days than the destination month. For example, when we move from 31 Mar 2020 to
  // February, createDate(2020, 2, 31) will return 2 Mar 2020, not the desired 29 Feb 2020.
  // We need to use setDate(0) to move back to the last day of the previous month (29 Feb 2020)
  if (dayOfPreviousMonth !== dayOfNewMonth) {
    month.setDate(0);
  }

  return month;
}

export function addDays(date, days) {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function createDate(year, month, day) {
  const result = new Date(year, month, day);

  // In js native date years from 0 to 99 are treated as abbreviation
  // for dates like 19xx
  if (year >= 0 && year < 100) {
    result.setFullYear(result.getFullYear() - 1900);
  }
  return result;
}

export function convertStringToDate(dateString) {
  const dateArr = dateString.split("-");
  const year = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];

  return createDate(year, month, day);
}

export function isValidDate(date) {
  return !Number.isNaN(date.getTime());
}

export function compareDates(date1, date2) {
  return (
    getYear(date1) - getYear(date2) ||
    getMonth(date1) - getMonth(date2) ||
    getDate(date1) - getDate(date2)
  );
}

export function isSameDate(date1, date2) {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return date1.getTime() === date2.getTime();
}

export function getYearsOffset(activeDate, yearsInView) {
  const activeYear = getYear(activeDate);
  const yearsDifference = activeYear - getStartYear();
  return modulo(yearsDifference, yearsInView);
}

function modulo(a, b) {
  return ((a % b) + b) % b;
}

export function getStartYear(yearsInView, minDate, maxDate) {
  let startYear = 0;

  if (maxDate) {
    const maxYear = getYear(maxDate);
    startYear = maxYear - yearsInView + 1;
  } else if (minDate) {
    startYear = getYear(minDate);
  }

  return startYear;
}

export function isDateDisabled(
  date,
  minDate,
  maxDate,
  filter,
  disabledPast,
  disabledFuture
) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const isBeforeMin = minDate && compareDates(date, minDate) <= -1;
  const isAfterMax = maxDate && compareDates(date, maxDate) >= 1;

  const isDisabledPast = disabledPast && compareDates(date, currentDate) <= -1;
  const isDisabledFuture =
    disabledFuture && compareDates(date, currentDate) >= 1;

  const isDisabled = filter && filter(date) === false;

  return (
    isBeforeMin ||
    isAfterMax ||
    isDisabled ||
    isDisabledPast ||
    isDisabledFuture
  );
}

export function isMonthDisabled(
  month,
  year,
  minDate,
  maxDate,
  disabledPast,
  disabledFuture
) {
  const currentDate = new Date();
  const maxYear = maxDate && getYear(maxDate);
  const maxMonth = maxDate && getMonth(maxDate);
  const minYear = minDate && getYear(minDate);
  const minMonth = minDate && getMonth(minDate);
  const currentYear = getYear(currentDate);
  const currentMonth = getMonth(currentDate);

  const isMonthAndYearAfterMax =
    maxMonth &&
    maxYear &&
    (year > maxYear || (year === maxYear && month > maxMonth));

  const isMonthAndYearBeforeMin =
    minMonth &&
    minYear &&
    (year < minYear || (year === minYear && month < minMonth));

  const isMonthAndYearDisabledPast =
    disabledPast &&
    (year < currentYear || (year === currentYear && month < currentMonth));
  const isMonthAndYearDisabledFuture =
    disabledFuture &&
    (year > currentYear || (year === currentYear && month > currentMonth));

  return (
    isMonthAndYearAfterMax ||
    isMonthAndYearBeforeMin ||
    isMonthAndYearDisabledPast ||
    isMonthAndYearDisabledFuture
  );
}

export function isYearDisabled(
  year,
  minDate,
  maxDate,
  disabledPast,
  disabledFuture
) {
  const min = minDate && getYear(minDate);
  const max = maxDate && getYear(maxDate);
  const currentYear = getYear(new Date());

  const isAfterMax = max && year > max;
  const isBeforeMin = min && year < min;
  const isDisabledPast = disabledPast && year < currentYear;
  const isDisabledFuture = disabledFuture && year > currentYear;

  return isAfterMax || isBeforeMin || isDisabledPast || isDisabledFuture;
}

export function isNextDateDisabled(
  disabledFuture,
  activeDate,
  view,
  yearsInView,
  minDate,
  maxDate,
  lastYearInView,
  firstYearInView
) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  if (disabledFuture && maxDate && compareDates(maxDate, currentDate) < 0) {
    maxDate = currentDate;
  } else if (disabledFuture) {
    maxDate = currentDate;
  }
  return (
    maxDate &&
    areDatesInSameView(
      activeDate,
      maxDate,
      view,
      yearsInView,
      minDate,
      maxDate,
      lastYearInView,
      firstYearInView
    )
  );
}

export function isPreviousDateDisabled(
  disabledPast,
  activeDate,
  view,
  yearsInView,
  minDate,
  maxDate,
  lastYearInView,
  firstYearInView
) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  if (disabledPast && minDate && compareDates(minDate, currentDate) < 0) {
    minDate = currentDate;
  } else if (disabledPast) {
    minDate = currentDate;
  }
  return (
    minDate &&
    areDatesInSameView(
      activeDate,
      minDate,
      view,
      yearsInView,
      minDate,
      maxDate,
      lastYearInView,
      firstYearInView
    )
  );
}

export function areDatesInSameView(
  date1,
  date2,
  view,
  yearsInView,
  minDate,
  maxDate,
  lastYearInView,
  firstYearInView
) {
  if (view === "days") {
    return (
      getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2)
    );
  }

  if (view === "months") {
    return getYear(date1) === getYear(date2);
  }

  if (view === "years") {
    return (
      getYear(date2) >= firstYearInView && getYear(date2) <= lastYearInView
    );
  }

  return false;
}
