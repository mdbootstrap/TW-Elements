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
            id="checkboxDefault" 
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
