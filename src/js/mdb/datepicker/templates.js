/* eslint-disable indent */

import Manipulator from '../dom/manipulator';
import { element } from '../util';
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
} from './date-utils';

export function getDatepickerTemplate(
  date,
  selectedDate,
  selectedYear,
  selectedMonth,
  options,
  monthsInRow,
  yearsInView,
  yearsInRow,
  id
) {
  const month = getMonth(date);
  const year = getYear(date);
  const day = getDate(date);
  const dayNumber = getDayNumber(date);
  const template = element('div');

  const modalContent = `
      ${createHeader(day, dayNumber, month, options)}
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
        yearsInRow
      )}
    `;

  Manipulator.addClass(template, 'datepicker-modal-container');
  Manipulator.addClass(template, `datepicker-modal-container-${id}`);

  template.innerHTML = modalContent;

  return template;
}

export function getBackdropTemplate() {
  const backdrop = element('div');
  Manipulator.addClass(backdrop, 'datepicker-backdrop');

  return backdrop;
}

export function createContainer() {
  const container = element('div');
  Manipulator.addClass(container, '.datepicker-modal-container');

  return container;
}

function createHeader(day, dayNumber, month, options) {
  return `
      <div class="datepicker-header">
        <div class="datepicker-title">
          <span class="datepicker-title-text">${options.title}</span>
        </div>
        <div class="datepicker-date">
          <span class="datepicker-date-text">${options.weekdaysShort[dayNumber]}, ${options.monthsShort[month]} ${day}</span>
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
  yearsInRow
) {
  const mainContentTemplate = `
    <div class="datepicker-main">
      ${createControls(month, year, options)}
      <div class="datepicker-view" tabindex="0">
        ${createViewTemplate(
          date,
          year,
          selectedDate,
          selectedYear,
          selectedMonth,
          options,
          monthsInRow,
          yearsInView,
          yearsInRow
        )}
      </div>
      ${createFooter(options)}
    </div>
  `;

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
  yearsInRow
) {
  let viewTemplate;
  if (options.view === 'days') {
    viewTemplate = createDayViewTemplate(date, selectedDate, options);
  } else if (options.view === 'months') {
    viewTemplate = createMonthViewTemplate(year, selectedYear, selectedMonth, options, monthsInRow);
  } else {
    viewTemplate = createYearViewTemplate(date, selectedYear, options, yearsInView, yearsInRow);
  }

  return viewTemplate;
}

function createControls(month, year, options) {
  return `
    <div class="datepicker-date-controls">
      <button class="datepicker-view-change-button" aria-label="${options.switchToMultiYearViewLabel}">
        ${options.monthsFull[month]} ${year}
      </button>
      <div class="datepicker-arrow-controls">
        <button class="datepicker-previous-button" aria-label="${options.prevMonthLabel}"></button>
        <button class="datepicker-next-button" aria-label="${options.nextMonthLabel}"></button>
      </div>
    </div>
    `;
}

function createFooter(options) {
  return `
        <div class="datepicker-footer">
          <button class="datepicker-footer-btn datepicker-clear-btn" aria-label="${options.clearBtnLabel}">${options.clearBtnText}</button>
          <button class="datepicker-footer-btn datepicker-cancel-btn" aria-label="${options.cancelBtnLabel}">${options.cancelBtnText}</button>
          <button class="datepicker-footer-btn datepicker-ok-btn" aria-label="${options.okBtnLabel}">${options.okBtnText}</button>
        </div>
      `;
}

export function createDayViewTemplate(date, selectedDate, options) {
  const dates = getDatesArray(date, selectedDate, options);
  const dayNames = options.weekdaysNarrow;

  const tableHeadContent = `
      <tr>
        ${dayNames
          .map((name, i) => {
            return `<th class="datepicker-day-heading" scope="col" aria-label="${options.weekdaysFull[i]}">${name}</th>`;
          })
          .join('')}
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
              class="datepicker-cell datepicker-small-cell datepicker-day-cell
              ${day.currentMonth ? '' : 'disabled'} ${day.disabled ? 'disabled' : ''}
              ${day.isToday && 'current'} ${day.isSelected && 'selected'}"
              data-mdb-date="${getYear(day.date)}-${getMonth(day.date)}-${getDate(day.date)}"
              aria-label="${day.date}"
              aria-selected="${day.isSelected}">
                <div
                  class="datepicker-cell-content datepicker-small-cell-content"
                  style="${day.currentMonth ? 'display: block' : 'display: none'}">
                  ${day.dayNumber}
                  </div>
              </td>
            `;
            })
            .join('')}
        </tr>
      `;
    })
    .join('');

  return `
      <table class="datepicker-table">
        <thead>
          ${tableHeadContent}
        </thead>
        <tbody class="datepicker-table-body">
         ${tableBodyContent}
        </tbody>
      </table>
    `;
}

function getDatesArray(activeDate, selectedDate, options) {
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
          isSelected: selectedDate && isSameDate(date, selectedDate),
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
          isSelected: selectedDate && isSameDate(date, selectedDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
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
        const date = createDate(year, isCurrentMonth ? month : nextMonth, dayNumber);

        week.push({
          date,
          currentMonth: isCurrentMonth,
          isSelected: selectedDate && isSameDate(date, selectedDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
        });
        dayNumber++;
      }
    }
    dates.push(week);
  }

  return dates;
}

export function createMonthViewTemplate(year, selectedYear, selectedMonth, options, monthsInRow) {
  const months = getMonthsArray(options, monthsInRow);
  const currentMonth = getMonth(getToday());

  const tableBodyContent = `
      ${months
        .map((row) => {
          return `
          <tr>
            ${row
              .map((month) => {
                const monthIndex = options.monthsShort.indexOf(month);
                return `
                <td class="datepicker-cell datepicker-large-cell datepicker-month-cell ${
                  monthIndex === selectedMonth && year === selectedYear ? 'selected' : ''
                } ${
                  monthIndex === currentMonth ? 'current' : ''
                }" data-mdb-month="${monthIndex}" data-mdb-year="${year}" aria-label="${month}, ${year}">
                  <div class="datepicker-cell-content datepicker-large-cell-content">${month}</div>
                </td>
              `;
              })
              .join('')}
          </tr>
        `;
        })
        .join('')}
    `;

  return `
      <table class="datepicker-table">
        <tbody class="datepicker-table-body">
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

export function createYearViewTemplate(date, selectedYear, options, yearsInView, yearsInRow) {
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
              <td class="datepicker-cell datepicker-large-cell datepicker-year-cell ${
                year === selectedYear ? 'selected' : ''
              } ${
                year === currentYear ? 'current' : ''
              }" aria-label="${year}" data-mdb-year="${year}">
                <div class="datepicker-cell-content datepicker-large-cell-content">${year}</div>
              </td>
            `;
            })
            .join('')}
        </tr>
      `;
      })
      .join('')}
  `;

  return `
      <table class="datepicker-table">
        <tbody class="datepicker-table-body">
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

export function getToggleButtonTemplate(id) {
  return `
    <button id="${id}" type="button" class="datepicker-toggle-button" data-mdb-toggle="datepicker">
      <i class="far fa-calendar datepicker-toggle-icon"></i>
    </button>
  `;
}
