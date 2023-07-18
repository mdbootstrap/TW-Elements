/* eslint-disable indent */
const ATTR_SORT_ICON = "data-te-datatable-sort-icon-ref";
const ATTR_HEADER_CHECKBOX = "data-te-datatable-header-checkbox-ref";

const columns = (
  columns,
  selectable,
  multi,
  bordered,
  sm,
  loading,
  sortIconTemplate,
  classes
) => {
  const checkboxHeader = multi
    ? `
  <th scope="col">
    <div class="${classes.checkboxHeaderWrapper}">
      <input
        class="${classes.checkboxHeader}"
        type="checkbox"
        value=""
        ${ATTR_HEADER_CHECKBOX}
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
        ? `<div class="${classes.sortIconWrapper}"><span class="${
            classes.sortIcon
          } ${loading ? "invisible" : ""}" data-te-sort="${
            column.field
          }" ${ATTR_SORT_ICON}>${sortIconTemplate}</span>`
        : ""
    } <span class="${column.sort ? "" : "ml-6"}">${
      column.label
    }</span></div></th>`;
  });

  return [selectable ? checkboxHeader : "", ...headers].join("\n");
};

export default columns;
