/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

/* eslint-disable indent */

import Manipulator from "../../dom/manipulator";
import { element } from "../../util";
import {
  getYear,
  getMonth,
  getDate,
  getDayNumber,
  getFirstDayOfWeek,
  addMonths,
  getDaysInMonth,
  createDate,
  isSameDate,
  getToday,
  getYearsOffset,
  isDateDisabled,
  isMonthDisabled,
  isYearDisabled,
} from "./date-utils";

const MODAL_CONTAINER_REF = "data-te-datepicker-modal-container-ref";
const DROPDOWN_CONTAINER_REF = "data-te-datepicker-dropdown-container-ref";
const BACKDROP_REF = "data-te-dropdown-backdrop-ref";
const DATE_TEXT_REF = "data-te-datepicker-date-text-ref";
const VIEW_REF = "data-te-datepicker-view-ref";
const PREVIOUS_BUTTON_REF = "data-te-datepicker-previous-button-ref";
const NEXT_BUTTON_REF = "data-te-datepicker-next-button-ref";
const OK_BUTTON_REF = "data-te-datepicker-ok-button-ref";
const CANCEL_BUTTON_REF = "data-te-datepicker-cancel-button-ref";
const CLEAR_BUTTON_REF = "data-te-datepicker-clear-button-ref";
const VIEW_CHANGE_BUTTON_REF = "data-te-datepicker-view-change-button-ref";

export function getDatepickerTemplate(
  date,
  selectedDate,
  selectedYear,
  selectedMonth,
  options,
  monthsInRow,
  yearsInView,
  yearsInRow,
  id,
  classes
) {
  const month = getMonth(date);
  const year = getYear(date);
  const day = getDate(date);
  const dayNumber = getDayNumber(date);
  const template = element("div");
  const inlineContent = `
        ${createMainContent(
          date,
          month,
          year,
          selectedDate,
          selectedYear,
          selectedMonth,
          options,
          monthsInRow,
          yearsInView,
          yearsInRow,
          classes
        )}
    `;
  const modalContent = `
      ${createHeader(day, dayNumber, month, options, classes)}
      ${createMainContent(
        date,
        month,
        year,
        selectedDate,
        selectedYear,
        selectedMonth,
        options,
        monthsInRow,
        yearsInView,
        yearsInRow,
        classes
      )}
    `;

  if (options.inline) {
    Manipulator.addClass(template, classes.datepickerDropdownContainer);
    template.setAttribute(DROPDOWN_CONTAINER_REF, id);

    template.innerHTML = inlineContent;
  } else {
    Manipulator.addClass(template, classes.modalContainer);
    template.setAttribute(MODAL_CONTAINER_REF, id);

    template.innerHTML = modalContent;
  }

  return template;
}

export function getBackdropTemplate(backdropClasses) {
  const backdrop = element("div");
  Manipulator.addClass(backdrop, backdropClasses);
  backdrop.setAttribute(BACKDROP_REF, "");

  return backdrop;
}

export function createContainer(modalContainerClasses) {
  const container = element("div");
  Manipulator.addClass(container, modalContainerClasses);
  container.setAttribute(MODAL_CONTAINER_REF, "");

  return container;
}

function createHeader(day, dayNumber, month, options, classes) {
  return `
      <div class="${classes.datepickerHeader}" data-te-datepicker-header>
        <div class="${classes.datepickerTitle}">
          <span class="${classes.datepickerTitleText}">${options.title}</span>
        </div>
        <div class="${classes.datepickerDate}">
          <span class="${classes.datepickerDateText}" ${DATE_TEXT_REF} >${options.weekdaysShort[dayNumber]}, ${options.monthsShort[month]} ${day}</span>
        </div>
      </div>
    `;
}

function createMainContent(
  date,
  month,
  year,
  selectedDate,
  selectedYear,
  selectedMonth,
  options,
  monthsInRow,
  yearsInView,
  yearsInRow,
  classes
) {
  let mainContentTemplate;
  if (options.inline) {
    mainContentTemplate = `
    <div class="${classes.datepickerMain}">
      ${createControls(month, year, options, classes)}
      <div class="${classes.datepickerView}" ${VIEW_REF} tabindex="0">
        ${createViewTemplate(
          date,
          year,
          selectedDate,
          selectedYear,
          selectedMonth,
          options,
          monthsInRow,
          yearsInView,
          yearsInRow,
          classes
        )}
      </div>
    </div>
  `;
  } else {
    mainContentTemplate = `
    <div class="${classes.datepickerMain}">
      ${createControls(month, year, options, classes)}
      <div class="${classes.datepickerView}" ${VIEW_REF} tabindex="0">
        ${createViewTemplate(
          date,
          year,
          selectedDate,
          selectedYear,
          selectedMonth,
          options,
          monthsInRow,
          yearsInView,
          yearsInRow,
          classes
        )}
      </div>
      ${createFooter(options, classes)}
    </div>
  `;
  }

  return mainContentTemplate;
}

function createViewTemplate(
  date,
  year,
  selectedDate,
  selectedYear,
  selectedMonth,
  options,
  monthsInRow,
  yearsInView,
  yearsInRow,
  classes
) {
  let viewTemplate;
  if (options.view === "days") {
    viewTemplate = createDayViewTemplate(date, selectedDate, options, classes);
  } else if (options.view === "months") {
    viewTemplate = createMonthViewTemplate(
      year,
      selectedYear,
      selectedMonth,
      options,
      monthsInRow,
      classes
    );
  } else {
    viewTemplate = createYearViewTemplate(
      date,
      selectedYear,
      options,
      yearsInView,
      yearsInRow,
      classes
    );
  }

  return viewTemplate;
}

function createControls(month, year, options, classes) {
  return `
    <div class="${classes.datepickerDateControls}">
      <button class="${classes.datepickerViewChangeButton}" aria-label="${
    options.switchToMultiYearViewLabel
  }" ${VIEW_CHANGE_BUTTON_REF}>
        ${options.monthsFull[month]} ${year} ${createViewChangeButtonIcon(
    options,
    classes
  )}
      </button>
      <div class="${classes.datepickerArrowControls}">
        <button class="${classes.datepickerPreviousButton}" aria-label="${
    options.prevMonthLabel
  }" ${PREVIOUS_BUTTON_REF}>${options.changeMonthIconTemplate}</button>
        <button class="${classes.datepickerNextButton}" aria-label="${
    options.nextMonthLabel
  }" ${NEXT_BUTTON_REF}>${options.changeMonthIconTemplate}</button>
      </div>
    </div>
    `;
}

export function createViewChangeButtonIcon(options, classes) {
  return `
  <span class="${classes.datepickerViewChangeIcon}">
  ${options.viewChangeIconTemplate}
  </span>
  `;
}

function createFooter(options, classes) {
  const okBtn = `<button class="${classes.datepickerFooterBtn}" aria-label="${options.okBtnLabel}" ${OK_BUTTON_REF}>${options.okBtnText}</button>`;
  const cancelButton = `<button class="${classes.datepickerFooterBtn}" aria-label="${options.cancelBtnLabel}" ${CANCEL_BUTTON_REF}>${options.cancelBtnText}</button>`;
  const clearButton = `<button class="${classes.datepickerFooterBtn} ${classes.datepickerClearBtn}" aria-label="${options.clearBtnLabel}" ${CLEAR_BUTTON_REF}>${options.clearBtnText}</button>`;

  return `
        <div class="${classes.datepickerFooter}">
          
        ${options.removeClearBtn ? "" : clearButton}
        ${options.removeCancelBtn ? "" : cancelButton}
        ${options.removeOkBtn ? "" : okBtn}
        </div>
      `;
}

export function createDayViewTemplate(date, headerDate, options, classes) {
  const dates = getDatesArray(date, headerDate, options);
  const dayNames = options.weekdaysNarrow;

  const tableHeadContent = `
      <tr>
        ${dayNames
          .map((name, i) => {
            return `<th class="${classes.datepickerDayHeading}" scope="col" aria-label="${options.weekdaysFull[i]}">${name}</th>`;
          })
          .join("")}
      </tr>
    `;

  const tableBodyContent = dates
    .map((week) => {
      return `
        <tr>
          ${week
            .map((day) => {
              return `
              <td
              class="${classes.datepickerCell} ${classes.datepickerCellSmall}"
              data-te-date="${getYear(day.date)}-${getMonth(
                day.date
              )}-${getDate(day.date)}"
              aria-label="${day.date}"
              aria-selected="${day.isSelected}"
              ${day.isSelected ? "data-te-datepicker-cell-selected" : ""}
              ${
                !day.currentMonth || day.disabled
                  ? "data-te-datepicker-cell-disabled"
                  : ""
              }
              ${day.isToday ? "data-te-datepicker-cell-current" : ""}
              >
                <div
                  class="${classes.datepickerCellContent} ${
                classes.datepickerCellContentSmall
              }"
                  style="${
                    day.currentMonth ? "display: block" : "display: none"
                  }"
                  >
                  ${day.dayNumber}
                  </div>
              </td>
            `;
            })
            .join("")}
        </tr>
      `;
    })
    .join("");

  return `
      <table class="${classes.datepickerTable}">
        <thead>
          ${tableHeadContent}
        </thead>
        <tbody>
         ${tableBodyContent}
        </tbody>
      </table>
    `;
}

function getDatesArray(activeDate, headerDate, options) {
  const dates = [];

  const month = getMonth(activeDate);
  const previousMonth = getMonth(addMonths(activeDate, -1));
  const nextMonth = getMonth(addMonths(activeDate, 1));
  const year = getYear(activeDate);

  const firstDay = getFirstDayOfWeek(year, month, options);
  const daysInMonth = getDaysInMonth(activeDate);
  const daysInPreviousMonth = getDaysInMonth(addMonths(activeDate, -1));
  const daysInWeek = 7;

  let dayNumber = 1;
  let isCurrentMonth = false;
  for (let i = 1; i < daysInWeek; i++) {
    const week = [];
    if (i === 1) {
      // First week
      const previousMonthDay = daysInPreviousMonth - firstDay + 1;
      // Previous month
      for (let j = previousMonthDay; j <= daysInPreviousMonth; j++) {
        const date = createDate(year, previousMonth, j);

        week.push({
          date,
          currentMonth: isCurrentMonth,
          isSelected: headerDate && isSameDate(date, headerDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
        });
      }

      isCurrentMonth = true;
      // Current month
      const daysLeft = daysInWeek - week.length;
      for (let j = 0; j < daysLeft; j++) {
        const date = createDate(year, month, dayNumber);

        week.push({
          date,
          currentMonth: isCurrentMonth,
          isSelected: headerDate && isSameDate(date, headerDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
          disabled: isDateDisabled(
            date,
            options.min,
            options.max,
            options.filter,
            options.disablePast,
            options.disableFuture
          ),
        });
        dayNumber++;
      }
    } else {
      // Rest of the weeks
      for (let j = 1; j < 8; j++) {
        if (dayNumber > daysInMonth) {
          // Next month
          dayNumber = 1;
          isCurrentMonth = false;
        }
        const date = createDate(
          year,
          isCurrentMonth ? month : nextMonth,
          dayNumber
        );

        week.push({
          date,
          currentMonth: isCurrentMonth,
          isSelected: headerDate && isSameDate(date, headerDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
          disabled: isDateDisabled(
            date,
            options.min,
            options.max,
            options.filter,
            options.disablePast,
            options.disableFuture
          ),
        });
        dayNumber++;
      }
    }
    dates.push(week);
  }

  return dates;
}

export function createMonthViewTemplate(
  year,
  selectedYear,
  selectedMonth,
  options,
  monthsInRow,
  classes
) {
  const months = getMonthsArray(options, monthsInRow);
  const currentMonth = getMonth(getToday());
  const currentYear = getYear(getToday());

  const tableBodyContent = `
      ${months
        .map((row) => {
          return `
          <tr>
            ${row
              .map((month) => {
                const monthIndex = options.monthsShort.indexOf(month);
                return `
                <td class="${classes.datepickerCell} ${
                  classes.datepickerCellLarge
                }"
                ${
                  isMonthDisabled(
                    monthIndex,
                    year,
                    options.min,
                    options.max,
                    options.disablePast,
                    options.disableFuture
                  )
                    ? "data-te-datepicker-cell-disabled"
                    : ""
                }
                
                data-te-month="${monthIndex}" data-te-year="${year}" aria-label="${month}, ${year}"
                ${
                  monthIndex === selectedMonth && year === selectedYear
                    ? "data-te-datepicker-cell-selected"
                    : ""
                }
                ${
                  monthIndex === currentMonth && year === currentYear
                    ? "data-te-datepicker-cell-current"
                    : ""
                }" data-te-month="${monthIndex}" data-te-year="${year}" aria-label="${month}, ${year}">
                  <div class="${classes.datepickerCellContent} ${
                  classes.datepickerCellContentLarge
                }">${month}</div>
                </td>
              `;
              })
              .join("")}
          </tr>
        `;
        })
        .join("")}
    `;

  return `
      <table class="${classes.datepickerTable}">
        <tbody>
         ${tableBodyContent}
        </tbody>
      </table>
    `;
}

function getMonthsArray(options, monthsInRow) {
  const months = [];

  let row = [];

  for (let i = 0; i < options.monthsShort.length; i++) {
    row.push(options.monthsShort[i]);

    if (row.length === monthsInRow) {
      const monthsRow = row;
      months.push(monthsRow);
      row = [];
    }
  }

  return months;
}

export function createYearViewTemplate(
  date,
  selectedYear,
  options,
  yearsInView,
  yearsInRow,
  classes
) {
  const years = getYearsArray(date, yearsInView, yearsInRow);
  const currentYear = getYear(getToday());

  const tableBodyContent = `
    ${years
      .map((row) => {
        return `
        <tr>
          ${row
            .map((year) => {
              return `
              <td class="${classes.datepickerCell} ${
                classes.datepickerCellLarge
              }"  aria-label="${year}" data-te-year="${year}"
              ${
                isYearDisabled(
                  year,
                  options.min,
                  options.max,
                  options.disablePast,
                  options.disableFuture
                )
                  ? "data-te-datepicker-cell-disabled"
                  : ""
              }
              ${year === selectedYear ? "data-te-datepicker-cell-selected" : ""}
              ${year === currentYear ? "data-te-datepicker-cell-current" : ""}
              >
                <div class="${classes.datepickerCellContent} ${
                classes.datepickerCellContentLarge
              }">${year}</div>
              </td>
            `;
            })
            .join("")}
        </tr>
      `;
      })
      .join("")}
  `;

  return `
      <table class="${classes.datepickerTable}">
        <tbody>
        ${tableBodyContent}
        </tbody>
      </table>
    `;
}

function getYearsArray(date, yearsInView, yearsInRow) {
  const years = [];
  const activeYear = getYear(date);
  const yearsOffset = getYearsOffset(date, yearsInView);

  const firstYearInView = activeYear - yearsOffset;

  let row = [];

  for (let i = 0; i < yearsInView; i++) {
    row.push(firstYearInView + i);

    if (row.length === yearsInRow) {
      const yearsRow = row;
      years.push(yearsRow);
      row = [];
    }
  }

  return years;
}

export function getToggleButtonTemplate(id, toggleBtnClasses) {
  return `
    <button id="${id}" type="button" class="${toggleBtnClasses}" data-te-datepicker-toggle-button-ref data-te-datepicker-toggle-ref>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
      </svg>  
    </button>
  `;
}
