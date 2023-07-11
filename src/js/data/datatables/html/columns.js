/* eslint-disable indent */

const columns = (
  columns,
  selectable,
  multi,
  bordered,
  sm,
  loading,
  classes
) => {
  const SELECTOR_SORT_ICON = "data-te-datatable-sort-icon-ref";
  const SELECTOR_HEADER_CHECKBOX = "data-te-datatable-header-checkbox-ref";
  const checkboxHeader = multi
    ? `
  <th scope="col">
    <div class="${classes.checkboxHeaderWrapper}">
      <input
        class="${classes.checkboxHeader}"
        type="checkbox"
        value=""
        id="checkboxDefault" 
        ${SELECTOR_HEADER_CHECKBOX}
        />
    </div>
  </th>
  `
    : '<th scope="col"></th>';
  const headers = columns.map((column, i) => {
    const fixedOffset = column.fixed
      ? columns
          .filter((cell, j) => cell.fixed === column.fixed && j < i)
          .reduce((a, b) => a + b.width, 0)
      : null;
    return `<th class="${classes.column} ${
      bordered ? `${classes.tableBordered}` : ""
    } ${classes.borderColor} ${sm ? `${classes.sm}` : ""} ${
      column.fixed ? `${classes.fixedHeader} ${classes.color}` : ""
    } ${loading ? `${classes.loadingColumn}` : ""}" style="${
      column.fixed
        ? `${column.fixed === "right" ? "right" : "left"}: ${fixedOffset}px;`
        : ""
    }" scope="col">${
      column.sort
        ? `<div class="${classes.sortIconWrapper}"><svg data-te-sort="${
            column.field
          }" ${SELECTOR_SORT_ICON} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="${
            classes.sortIcon
          } ${loading ? "invisible" : ""}">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
             </svg>`
        : ""
    } <span class="${column.sort ? "" : "ml-6"}">${
      column.label
    }</span></div></th>`;
  });

  return [selectable ? checkboxHeader : "", ...headers].join("\n");
};

export default columns;
