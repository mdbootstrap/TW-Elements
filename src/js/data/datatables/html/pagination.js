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
