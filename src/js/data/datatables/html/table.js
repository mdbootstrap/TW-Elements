/* eslint-disable indent */
import paginationTemplate from "./pagination";
import generateColumns from "./columns";
import generateRows from "./rows";

const tableTemplate = ({
  columns,
  rows,
  noFoundMessage,
  edit,
  multi,
  selectable,
  loading,
  loadingMessage,
  pagination,
  bordered,
  borderless,
  striped,
  hover,
  fixedHeader,
  sm,
  classes,
}) => {
  const SELECTOR_BODY = "data-te-datatable-inner-ref";
  const SELECTOR_HEADER = "data-te-datatable-header-ref";
  const rowsTemplate = generateRows({
    rows,
    columns,
    noFoundMessage,
    edit,
    loading,
    selectable,
    bordered,
    borderless,
    striped,
    hover,
    sm,
    classes,
  });
  const columnsTemplate = generateColumns(
    columns,
    selectable,
    multi,
    bordered,
    sm,
    loading,
    classes
  );

  const table = `
<div class="${classes.color}" ${SELECTOR_BODY}>
  <table class="${classes.table}">
    <thead class="${classes.tableHeader} ${
    bordered ? `${classes.tableBordered}` : ""
  } ${borderless ? `${classes.borderless}` : ""} ${
    classes.borderColor
  }" ${SELECTOR_HEADER}>
      <tr>
        ${columnsTemplate}
      </tr>
    </thead>
    <tbody class="${fixedHeader ? `${classes.fixedHeaderBody}` : ""}">
      ${loading ? "" : rowsTemplate}
    </tbody>
  </table>
</div>
${
  loading
    ? `
  <div class="${classes.loadingItemsWrapper}">
    <div class="${classes.loadingProgressBarWrapper}">
      <div class="${classes.loadingProgressBar}"></div>
    </div>
  </div>
<p class="${classes.loadingMessage}">${loadingMessage}</p>
`
    : ""
}
${pagination.enable ? paginationTemplate(pagination, loading, bordered) : ""}
  `;

  return { table, rows: rowsTemplate, column: columnsTemplate };
};

export default tableTemplate;
