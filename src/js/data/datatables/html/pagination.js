/* eslint-disable indent */
const pagination = (
  { text, entries, entriesOptions, fullPagination, rowsText, allText, classes },
  loading,
  bordered
) => {
  const SELECTOR_SELECT = "data-te-datatable-select-ref";
  const SELECTOR_PAGINATION_NAV = "data-te-datatable-pagination-nav-ref";
  const SELECTOR_PAGINATION_RIGHT = "data-te-datatable-pagination-right-ref";
  const SELECTOR_PAGINATION_LEFT = "data-te-datatable-pagination-left-ref";
  const SELECTOR_PAGINATION_START = "data-te-datatable-pagination-start-ref";
  const SELECTOR_PAGINATION_END = "data-te-datatable-pagination-end-ref";
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
        ${loading ? "disabled" : ""} class="select" ${SELECTOR_SELECT}>
        ${options}
      </select>
    </div>
  </div>
  <div class="${classes.paginationNav} ${
    loading ? `${classes.loadingPaginationNav}` : ""
  }" ${SELECTOR_PAGINATION_NAV}>
  ${text}
  </div>
  <div class="${classes.paginationButtonsWrapper}">
    ${
      fullPagination
        ? `<button data-te-ripple-color="dark" class="${classes.paginationStartButton}" ${SELECTOR_PAGINATION_START}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          </button>`
        : ""
    }
    <button data-te-ripple-color="dark" class="${
      classes.paginationLeftButton
    }" ${SELECTOR_PAGINATION_LEFT}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
  </button>
    <button data-te-ripple-color="dark" class="${
      classes.paginationRightButton
    }" ${SELECTOR_PAGINATION_RIGHT}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
  </button>
    ${
      fullPagination
        ? `<button data-te-ripple-color="dark" class="${classes.paginationEndButton}" ${SELECTOR_PAGINATION_END}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          </button>`
        : ""
    }
  </div>
</div>
`;
};

export default pagination;
