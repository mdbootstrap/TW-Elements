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
