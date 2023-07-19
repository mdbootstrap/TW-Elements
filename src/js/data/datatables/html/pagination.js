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
const ATTR_SELECT = "data-te-datatable-select-ref";
const ATTR_PAGINATION_NAV = "data-te-datatable-pagination-nav-ref";
const ATTR_PAGINATION_RIGHT = "data-te-datatable-pagination-right-ref";
const ATTR_PAGINATION_LEFT = "data-te-datatable-pagination-left-ref";
const ATTR_PAGINATION_START = "data-te-datatable-pagination-start-ref";
const ATTR_PAGINATION_END = "data-te-datatable-pagination-end-ref";

const pagination = (
  {
    text,
    entries,
    entriesOptions,
    fullPagination,
    rowsText,
    allText,
    paginationStartIconTemplate,
    paginationLeftIconTemplate,
    paginationRightIconTemplate,
    paginationEndIconTemplate,
    classes,
  },
  loading,
  bordered
) => {
  const options = entriesOptions
    .map((option) => {
      if (option === "All") {
        return `<option value="${option}" ${
          option === entries ? "selected" : ""
        }>${allText}</option>`;
      }
      return `<option value="${option}" ${
        option === entries ? "selected" : ""
      }>${option}</option>`;
    })
    .join("\n");

  return `
<div class="${classes.pagination} ${
    bordered ? `${classes.paginationBordered}` : ""
  } ${classes.borderColor} ${classes.color}">
  <div class="${classes.selectItemsWrapper}">  
    <p class="${classes.paginationRowsText} ${
    loading ? `${classes.loadingPaginationRowsText}` : ""
  }">${rowsText}</p>
    <div class="${classes.selectWrapper} ${
    loading ? `${classes.loadingPaginationSelectWrapper}` : ""
  }">
      <select name="entries"
        ${loading ? "disabled" : ""} class="select" ${ATTR_SELECT}>
        ${options}
      </select>
    </div>
  </div>
  <div class="${classes.paginationNav} ${
    loading ? `${classes.loadingPaginationNav}` : ""
  }" ${ATTR_PAGINATION_NAV}>
  ${text}
  </div>
  <div class="${classes.paginationButtonsWrapper}">
    ${
      fullPagination
        ? `<button data-te-ripple-init data-te-ripple-color="dark" class="${classes.paginationStartButton}" ${ATTR_PAGINATION_START}>
           ${paginationStartIconTemplate}
          </button>`
        : ""
    }
    <button data-te-ripple-init data-te-ripple-color="dark" class="${
      classes.paginationLeftButton
    }" ${ATTR_PAGINATION_LEFT}>
      ${paginationLeftIconTemplate}
  </button>
    <button data-te-ripple-init data-te-ripple-color="dark" class="${
      classes.paginationRightButton
    }" ${ATTR_PAGINATION_RIGHT}>
      ${paginationRightIconTemplate}
  </button>
    ${
      fullPagination
        ? `<button data-te-ripple-init data-te-ripple-color="dark" class="${classes.paginationEndButton}" ${ATTR_PAGINATION_END}>
           ${paginationEndIconTemplate}
          </button>`
        : ""
    }
  </div>
</div>
`;
};

export default pagination;
