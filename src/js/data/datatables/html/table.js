/* eslint-disable indent */
import paginationTemplate from "./pagination";
import generateColumns from "./columns";
import generateRows from "./rows";

const ATTR_BODY = "data-te-datatable-inner-ref";
const ATTR_HEADER = "data-te-datatable-header-ref";

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
  sortIconTemplate,
  classes,
}) => {
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
    sortIconTemplate,
    classes
  );

  const table = `
<div class="${classes.color}" ${ATTR_BODY}>
  <table class="${classes.table}">
    <thead class="${classes.tableHeader} ${
    bordered ? `${classes.tableBordered}` : ""
  } ${borderless ? `${classes.borderless}` : ""} ${
    classes.borderColor
  }" ${ATTR_HEADER}>
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
