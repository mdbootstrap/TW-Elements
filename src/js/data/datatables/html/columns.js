/*
--------------------------------------------------------------------------
TW Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

If you would like to purchase a COMMERCIAL, non-AGPL license for TWE, please check out our pricing: https://tw-elements.com/pro/
--------------------------------------------------------------------------
*/

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
    } <span class="${column.sort ? "" : "pl-[18px]"}">${
      column.label
    }</span></div></th>`;
  });

  return [selectable ? checkboxHeader : "", ...headers].join("\n");
};

export default columns;
