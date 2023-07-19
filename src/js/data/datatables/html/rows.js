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
const ATTR_ROW = "data-te-datatable-row-ref";
const ATTR_ROW_CHECKBOX = "data-te-datatable-row-checkbox-ref";
const ATTR_CELL = "data-te-datatable-cell-ref";

const rows = ({
  rows,
  columns,
  noFoundMessage,
  edit,
  selectable,
  loading,
  bordered,
  borderless,
  striped,
  hover,
  sm,
  classes,
}) => {
  const rowsTemplate = rows.map((row) => {
    const checkbox = `
      <td data-te-field="checkbox" class="${
        bordered ? `${classes.tableBordered} ${classes.borderColor}` : ""
      }">
        <div class="${classes.checkboxRowWrapper}">
          <input
            class="${classes.checkboxRow}"
            type="checkbox"
            value=""
            data-te-row-index="${row.rowIndex}"  ${ATTR_ROW_CHECKBOX}/>
        </div>
      </td>`;
    const innerRow = columns
      .map((column, i) => {
        const style = {};

        if (column.width) {
          style["min-width"] = `${column.width - 1}px`;
          style["max-width"] = `${column.width}px`;
          style.width = `${column.width}px`;
        }
        if (column.fixed) {
          const fixedOffset = columns
            .filter((cell, j) => cell.fixed === column.fixed && j < i)
            .reduce((a, b) => a + b.width, 0);

          style[
            column.fixed === "right" ? "right" : "left"
          ] = `${fixedOffset}px`;
        }

        const cssText = Object.keys(style)
          .map((property) => `${property}: ${style[property]}`)
          .join("; ");

        return `<td style="${cssText}" class="${classes.rowItem} ${
          classes.borderColor
        } ${edit ? `${classes.edit}` : ""} ${
          bordered ? `${classes.tableBordered}` : ""
        } ${sm ? `${classes.sm}` : ""} ${
          column.fixed ? `${classes.fixedHeader} ${classes.color}` : ""
        }" ${ATTR_CELL} data-te-field="${column.field}" ${
          edit && 'contenteditable="true"'
        }>${row[column.field]}</td>`;
      })
      .join("");

    return `<tr scope="row" class="${classes.row} ${classes.borderColor} ${
      classes.rowAnimation
    } ${striped ? `${classes.striped}` : ""} ${
      borderless ? `${classes.borderless}` : ""
    } ${hover ? `${classes.hoverRow}` : ""}" data-te-index="${
      row.rowIndex
    }" ${ATTR_ROW}>${selectable ? checkbox : ""}${innerRow}</tr>`;
  });

  return rows.length > 0 || loading
    ? rowsTemplate.join("\n")
    : `<tr class="${classes.noFoundMessageWrapper} ${classes.borderColor}"><td class="${classes.noFoundMessage}">${noFoundMessage}</td></tr>`;
};

export default rows;
