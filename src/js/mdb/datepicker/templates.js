/* eslint-disable indent */

import Manipulator from "../dom/manipulator";
import { element } from "../util";
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
} from "./date-utils";

const MODAL_CONTAINER_REF = "data-te-datepicker-modal-container-ref";
const BACKDROP_REF = "data-te-dropdown-backdrop-ref";
const DATE_TEXT_REF = "data-te-datepicker-date-text-ref";
const VIEW_REF = "data-te-datepicker-view-ref";
const PREVIOUS_BUTTON_REF = "data-te-datepicker-previous-button-ref";
const NEXT_BUTTON_REF = "data-te-datepicker-next-button-ref";
const OK_BUTTON_REF = "data-te-datepicker-ok-button-ref";
const CANCEL_BUTTON_REF = "data-te-datepicker-cancel-button-ref";
const CLEAR_BUTTON_REF = "data-te-datepicker-clear-button-ref";
const VIEW_CHANGE_BUTTON_REF = "data-te-datepicker-view-change-button-ref";

const MODAL_CONTAINER_CLASSES =
  "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[328px] h-[512px] bg-white rounded-[0.6rem] shadow-lg z-[1066] xs:max-md:landscape:w-[475px] xs:max-md:landscape:h-[360px] xs:max-md:landscape:flex-row";
const DATEPICKER_BACKDROP_CLASSES =
  "w-full h-full fixed top-0 right-0 left-0 bottom-0 bg-black/40 z-[1065]";
const DATEPICKER_MAIN_CLASSES = "relative h-full";
const DATEPICKER_HEADER_CLASSES =
  "xs:max-md:landscape:h-full h-[120px] px-6 bg-blue-500 flex flex-col rounded-t-lg";
const DATEPICKER_TITLE_CLASSES = "h-8 flex flex-col justify-end";
const DATEPICKER_TITLE_TEXT_CLASSES =
  "text-[10px] font-normal uppercase tracking-[1.7px] text-white";
const DATEPICKER_DATE_CLASSES =
  "xs:max-md:landscape:mt-24 h-[72px] flex flex-col justify-end";
const DATEPICKER_DATE_TEXT_CLASSES = "text-[34px] font-normal text-white";
const DATEPICKER_VIEW_CLASSES = "outline-none px-3";
const DATEPICKER_DATE_CONTROLS_CLASSES =
  "px-3 pt-2.5 pb-0 flex justify-between text-black/[64]";
const DATEPICKER_VIEW_CHANGE_BUTTON_CLASSES = `p-2.5 text-neutral-500 font-medium text-[0.9rem] rounded-xl shadow-none bg-transparent m-0 border-none hover:bg-neutral-200 focus:bg-neutral-200 after:content-[${""}] after:inline-block after:w-0 after:h-0 after:border-solid after:border-x-[5px] after:border-x-transparent after:border-t-[5px] after:m-0 after:ml-[5px] after:align-middle`;
const DATEPICKER_ARROW_CONTROLS_CLASSES = "mt-2.5";
const DATEPICKER_PREVIOUS_BUTTON_CLASSES = `relative p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-black/[64] bg-transparent mr-6 hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] after:top-0 after:left-0 after:right-0 after:bottom-0 after:absolute after:content-[${""}] after:m-[15.5px] after:border-0 after:border-solid after:border-current after:border-t-2 after:border-l-2 after:translate-x-[2px] after:-rotate-45`;
const DATEPICKER_NEXT_BUTTON_CLASSES = `relative p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-black/[64] bg-transparent hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] after:top-0 after:left-0 after:right-0 after:bottom-0 after:absolute after:content-[${""}] after:m-[15.5px] after:border-0 after:border-solid after:border-current after:border-t-2 after:border-r-2 after:translate-x-[-2px] after:rotate-45`;
const DATEPICKER_FOOTER_CLASSES =
  "h-14 flex absolute w-full bottom-0 justify-end items-center px-3";
const DATEPICKER_FOOTER_BTN_CLASSES =
  "bg-white text-blue-500 border-none cursor-pointer py-0 px-2.5 uppercase text-[0.8rem] leading-10 font-medium h-10 tracking-[.1rem] rounded-[10px] mb-2.5 hover:bg-neutral-200 focus:bg-neutral-200";
const DATEPICKER_CLEAR_BTN_CLASSES = "mr-auto";
const DATEPICKER_DAY_HEADING_CLASSES =
  "w-10 h-10 text-center text-[12px] font-normal";
const DATEPICKER_CELL_CLASSES =
  "text-center data-[te-datepicker-cell-disabled]:text-neutral-300 data-[te-datepicker-cell-disabled]:cursor-default data-[te-datepicker-cell-disabled]:pointer-events-none data-[te-datepicker-cell-disabled]:hover:cursor-default hover:cursor-pointer group";
const DATEPICKER_CELL_SMALL_CLASSES =
  "w-10 h-10 xs:max-md:landscape:w-8 xs:max-md:landscape:h-8";
const DATEPICKER_CELL_LARGE_CLASSES = "w-[76px] h-[42px]";
const DATEPICKER_CELL_CONTENT_CLASSES =
  "group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-neutral-300 group-[[data-te-datepicker-cell-selected]]:bg-blue-500 group-[[data-te-datepicker-cell-selected]]:text-white group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-neutral-100 group-[[data-te-datepicker-cell-focused]]:data-[te-datepicker-cell-selected]:bg-blue-500 group-[[data-te-datepicker-cell-current]]:border-solid group-[[data-te-datepicker-cell-current]]:border-black group-[[data-te-datepicker-cell-current]]:border";
const DATEPICKER_CELL_CONTENT_SMALL_CLASSES =
  "w-9 h-9 leading-9 rounded-[50%] text-[13px]";
const DATEPICKER_CELL_CONTENT_LARGE_CLASSES =
  "w-[72px] h-10 leading-10 py-[1px] px-0.5 rounded-[999px]";
const DATEPICKER_TABLE_CLASSES = "mx-auto w-[304px]";
const DATEPICKER_TOGGLE_BUTTON_CLASSES =
  "w-3.5 h-3.5 absolute outline-none border-none bg-transparent right-2.5 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-blue-500 focus:text-blue-500";

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
  const template = element("div");

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

  Manipulator.addMultiClass(template, MODAL_CONTAINER_CLASSES);
  template.setAttribute(MODAL_CONTAINER_REF, id);

  template.innerHTML = modalContent;

  return template;
}

export function getBackdropTemplate() {
  const backdrop = element("div");
  Manipulator.addMultiClass(backdrop, DATEPICKER_BACKDROP_CLASSES);
  backdrop.setAttribute(BACKDROP_REF, "");

  return backdrop;
}

export function createContainer() {
  const container = element("div");
  Manipulator.addMultiClass(container, MODAL_CONTAINER_CLASSES);
  container.setAttribute(MODAL_CONTAINER_REF, "");

  return container;
}

function createHeader(day, dayNumber, month, options) {
  return `
      <div class="${DATEPICKER_HEADER_CLASSES}">
        <div class="${DATEPICKER_TITLE_CLASSES}">
          <span class="${DATEPICKER_TITLE_TEXT_CLASSES}">${options.title}</span>
        </div>
        <div class="${DATEPICKER_DATE_CLASSES}">
          <span class="${DATEPICKER_DATE_TEXT_CLASSES}" ${DATE_TEXT_REF} >${options.weekdaysShort[dayNumber]}, ${options.monthsShort[month]} ${day}</span>
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
    <div class="${DATEPICKER_MAIN_CLASSES}">
      ${createControls(month, year, options)}
      <div class="${DATEPICKER_VIEW_CLASSES}" ${VIEW_REF} tabindex="0">
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
  if (options.view === "days") {
    viewTemplate = createDayViewTemplate(date, selectedDate, options);
  } else if (options.view === "months") {
    viewTemplate = createMonthViewTemplate(
      year,
      selectedYear,
      selectedMonth,
      options,
      monthsInRow
    );
  } else {
    viewTemplate = createYearViewTemplate(
      date,
      selectedYear,
      options,
      yearsInView,
      yearsInRow
    );
  }

  return viewTemplate;
}

function createControls(month, year, options) {
  return `
    <div class="${DATEPICKER_DATE_CONTROLS_CLASSES}">
      <button class="${DATEPICKER_VIEW_CHANGE_BUTTON_CLASSES}" aria-label="${options.switchToMultiYearViewLabel}" ${VIEW_CHANGE_BUTTON_REF}>
        ${options.monthsFull[month]} ${year}
      </button>
      <div class="${DATEPICKER_ARROW_CONTROLS_CLASSES}">
        <button class="${DATEPICKER_PREVIOUS_BUTTON_CLASSES}" aria-label="${options.prevMonthLabel}" ${PREVIOUS_BUTTON_REF}></button>
        <button class="${DATEPICKER_NEXT_BUTTON_CLASSES}" aria-label="${options.nextMonthLabel}" ${NEXT_BUTTON_REF}></button>
      </div>
    </div>
    `;
}

function createFooter(options) {
  return `
        <div class="${DATEPICKER_FOOTER_CLASSES}">
          <button class="${DATEPICKER_FOOTER_BTN_CLASSES} ${DATEPICKER_CLEAR_BTN_CLASSES}" aria-label="${options.clearBtnLabel}" ${CLEAR_BUTTON_REF}>${options.clearBtnText}</button>
          <button class="${DATEPICKER_FOOTER_BTN_CLASSES}" aria-label="${options.cancelBtnLabel}" ${CANCEL_BUTTON_REF}>${options.cancelBtnText}</button>
          <button class="${DATEPICKER_FOOTER_BTN_CLASSES}" aria-label="${options.okBtnLabel}" ${OK_BUTTON_REF}>${options.okBtnText}</button>
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
            return `<th class="${DATEPICKER_DAY_HEADING_CLASSES}" scope="col" aria-label="${options.weekdaysFull[i]}">${name}</th>`;
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
              class="${DATEPICKER_CELL_CLASSES} ${DATEPICKER_CELL_SMALL_CLASSES}"
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
                  class="${DATEPICKER_CELL_CONTENT_CLASSES} ${DATEPICKER_CELL_CONTENT_SMALL_CLASSES}"
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
      <table class="${DATEPICKER_TABLE_CLASSES}">
        <thead>
          ${tableHeadContent}
        </thead>
        <tbody>
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
        const date = createDate(
          year,
          isCurrentMonth ? month : nextMonth,
          dayNumber
        );

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

export function createMonthViewTemplate(
  year,
  selectedYear,
  selectedMonth,
  options,
  monthsInRow
) {
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
                <td class="${DATEPICKER_CELL_CLASSES} ${DATEPICKER_CELL_LARGE_CLASSES}" 
                data-te-month="${monthIndex}" data-te-year="${year}" aria-label="${month}, ${year}"
                ${
                  monthIndex === selectedMonth && year === selectedYear
                    ? "data-te-datepicker-cell-selected"
                    : ""
                }
                ${
                  monthIndex === currentMonth
                    ? "data-te-datepicker-cell-current"
                    : ""
                }
                >
                  <div class="${DATEPICKER_CELL_CONTENT_CLASSES} ${DATEPICKER_CELL_CONTENT_LARGE_CLASSES}">${month}</div>
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
      <table class="${DATEPICKER_TABLE_CLASSES}">
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
  yearsInRow
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
              <td class="${DATEPICKER_CELL_CLASSES} ${DATEPICKER_CELL_LARGE_CLASSES} aria-label="${year}" data-te-year="${year}"
              ${year === selectedYear ? "data-te-datepicker-cell-selected" : ""}
              ${year === currentYear ? "data-te-datepicker-cell-current" : ""}
              >
                <div class="${DATEPICKER_CELL_CONTENT_CLASSES} ${DATEPICKER_CELL_CONTENT_LARGE_CLASSES}">${year}</div>
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
      <table class="${DATEPICKER_TABLE_CLASSES}">
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

export function getToggleButtonTemplate(id) {
  return `
    <button id="${id}" type="button" class="${DATEPICKER_TOGGLE_BUTTON_CLASSES}" data-te-datepicker-toggle-button-ref data-te-datepicker-toggle-ref>
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z"/></svg>
    </button>
  `;
}
