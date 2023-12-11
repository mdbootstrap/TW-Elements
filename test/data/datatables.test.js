/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { jQueryMock } from "../mocks";
import SelectorEngine from "../../src/js/dom/selector-engine";
import Manipulator from "../../src/js/dom/manipulator";
import EventHandler from "../../src/js/dom/event-handler";
import initTE from "../../src/js/autoinit/index.js";

global.ResizeObserver = require("resize-observer-polyfill");
jest.mock("../../src/js/forms/select/index.js");

let Datatable = require("../../src/js/data/datatables").default;

const NAME = "datatable";
const DATA_KEY = `te.${NAME}`;

const CLASSNAME_FIXED_CELL = "fixed-cell";
const SELECTOR_SORT_ICON = "[data-te-datatable-sort-icon-ref]";
const SELECTOR_LOADING_TEXT = "[data-te-datatable-message-ref]";
const SELECTOR_PAGINATION = "[data-te-datatable-pagination-ref]";
const SELECTOR_PAGINATION_RIGHT = "[data-te-datatable-pagination-right-ref]";
const SELECTOR_PAGINATION_LEFT = "[data-te-datatable-pagination-left-ref]";
const SELECTOR_PAGINATION_START = "[data-te-datatable-pagination-start-ref]";
const SELECTOR_PAGINATION_END = "[data-te-datatable-pagination-end-ref]";
const SELECTOR_HEADER = "[data-te-datatable-header-ref] th";
const SELECTOR_BODY = "[data-te-datatable-inner-ref]";
const SELECTOR_SELECT = "[data-te-datatable-select-ref]";
const SELECTOR_CELL = "tbody tr td";
const SELECTOR_LOADER = "[data-te-datatable-loader-ref]";
const SELECTOR_ROW = "tbody tr";
const SELECTOR_HEADER_CHECKBOX = "[data-te-datatable-header-checkbox-ref]";
const SELECTOR_ROW_CHECKBOX = "[data-te-datatable-row-checkbox-ref]";

const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_SELECTED = `selectRows${EVENT_KEY}`;
const EVENT_ROW_CLICKED = `rowClick${EVENT_KEY}`;

const EVENT_VALUE_CHANGED_SELECT = "valueChange.te.select";

const DEFAULT_OPTIONS = {
  defaultValue: "-",
};

const dataExample = {
  columns: ["Name", "Position", "Office", "Age", "Start date", "Salary"],
  rows: [
    [
      "Tiger Nixon",
      "System Architect",
      "	Edinburgh",
      61,
      "2011/04/25",
      "$320,800",
    ],
    [
      "Sonya Frost",
      "Software Engineer",
      "Edinburgh",
      23,
      "2008/12/13",
      "$103,600",
    ],
    ["Jena Gaines", "Office Manager", "London", 30, "2008/12/19", "$90,560"],
    ["Quinn Flynn", "Support Lead", "Edinburgh", 22, "2013/03/03", "$342,000"],
    [
      "Charde Marshall",
      "Regional Director",
      "San Francisco",
      36,
      "2008/10/16",
      "$470,600",
    ],
    [
      "Haley Kennedy",
      "Senior Marketing Designer",
      "London",
      43,
      "2012/12/18",
      "$313,500",
    ],
    [
      "Tatyana Fitzpatrick",
      "Regional Director",
      "London",
      19,
      "2010/03/17",
      "$385,750",
    ],
    [
      "Michael Silva",
      "Marketing Designer",
      "London",
      66,
      "2012/11/27",
      "$198,500",
    ],
    [
      "Paul Byrd",
      "Chief Financial Officer (CFO)",
      "New York",
      64,
      "2010/06/09",
      "$725,000",
    ],
    [
      "Gloria Little",
      "Systems Administrator",
      "New York",
      59,
      "2009/04/10",
      "$237,500",
    ],
    ["Jonas Alexander", "Developer", "San Francisco", "30", "2010/07/14", "86"],
    [
      "Shad Decker",
      "Regional Director",
      "Edinburgh",
      "51",
      "2008/11/13",
      "183",
    ],
    [
      "Michael Bruce",
      "Javascript Developer",
      "Singapore",
      "29",
      "2011/06/27",
      "183",
    ],
    ["Donna Snider", "Customer Support", "New York", "27", "2011/01/25", "112"],
  ],
};

describe("Datatable", () => {
  let table;
  const [body] = document.getElementsByTagName("body");

  beforeEach(() => {
    table = document.createElement("div");
    table.setAttribute("ID", "test-table");
    body.appendChild(table);
  });

  afterEach(() => {
    body.removeChild(table);
  });

  it("should return the name of the component", () => {
    expect(Datatable.NAME).toEqual(NAME);
  });

  describe("initialization", () => {
    it("should initialize table with data-te-datatable-init attribute & remove an instance on dispose", () => {
      table.setAttribute("data-te-datatable-init", "");

      jest.resetModules();

      const Datatable = require("../../src/js/data/datatables").default; // eslint-disable-line global-require
      const initMDB = require("../../src/js/autoinit/index.js").default; // eslint-disable-line global-require
      initMDB({ Datatable });

      const instance = Datatable.getInstance(table);

      expect(instance).toBeTruthy();

      instance.dispose();

      expect(Datatable.getInstance(table)).toBe(null);
    });

    it("should initialize table", () => {
      const instance = new Datatable(table);

      expect(instance).toBeTruthy();

      instance.dispose();

      expect(Datatable.getInstance(table)).toBe(null);
    });

    it("should not set data without an element", () => {
      const instance = new Datatable();

      expect(instance._element).toBeFalsy();
    });

    it("should return existing instance", () => {
      const instance = new Datatable(table, { columns: ["Test1", "Test2"] });

      table.classList.add("datatable");

      jest.resetModules();

      require("../../src/js/data/datatables"); // eslint-disable-line global-require

      expect(Datatable.getInstance(table).columns).toHaveLength(2);

      instance.dispose();
    });
  });

  describe("parsing rows & columns", () => {
    it("should format columns (string)", () => {
      const instance = new Datatable(table, {
        columns: ["Test 1", "Test 2"],
      });

      // Columns

      const [firstCol, secondCol] = instance.columns;

      expect(firstCol.field).toEqual("field_0");
      expect(firstCol.label).toEqual("Test 1");
      expect(firstCol.sort).toBe(true);

      expect(secondCol.field).toEqual("field_1");
      expect(secondCol.label).toEqual("Test 2");
      expect(secondCol.sort).toBe(true);

      instance.dispose();
    });

    it("should format columns (object)", () => {
      const instance = new Datatable(table, {
        columns: [
          {
            label: "Test 3",
            field: "test3",
            sort: false,
          },
          {
            label: "Test 4",
          },
        ],
      });

      const [firstCol, second] = instance.columns;

      expect(firstCol.field).toEqual("test3");
      expect(firstCol.label).toEqual("Test 3");
      expect(firstCol.sort).toBe(false);

      expect(second.field).toEqual("field_1");
      expect(second.label).toEqual("Test 4");
      expect(second.sort).toBe(true);

      instance.dispose();
    });

    it("should return emty row when data type is incorrect", () => {
      const instance = new Datatable(table, {
        columns: [
          {
            label: "Test 3",
            field: "test3",
            sort: false,
          },
          {
            label: "Test 4",
          },
        ],
        rows: ["Test 1"],
      });

      expect(typeof instance.rows[0]).toEqual("object");

      instance.dispose();
    });

    it("should format rows (string)", () => {
      const columns = [
        {
          label: "Test 1",
          field: "test_1",
        },
        {
          label: "Test 2",
          field: "test_2",
        },
      ];

      const instance = new Datatable(table, {
        columns,
        rows: [["value 1", "value 2"], ["value 3"]],
      });

      // Rows

      const [firstRow, secondRow] = instance.rows;

      expect(firstRow.test_1).toEqual("value 1");
      expect(firstRow.test_2).toEqual("value 2");

      expect(secondRow.test_1).toEqual("value 3");
      expect(secondRow.test_2).toEqual(DEFAULT_OPTIONS.defaultValue);

      instance.dispose();
    });

    it("should format rows (object)", () => {
      const columns = [
        {
          label: "Test 1",
          field: "test_1",
        },
        {
          label: "Test 2",
          field: "test_2",
        },
      ];

      const instance = new Datatable(
        table,
        {
          columns,
          rows: [
            { test_1: "value 4" },
            { test_1: "value 5", test_2: "value 6" },
          ],
        },
        {
          defaultValue: "test",
        }
      );

      const [firstRow, secondRow] = instance.rows;

      expect(firstRow.test_1).toEqual("value 4");
      expect(firstRow.test_2).toEqual("test");

      expect(secondRow.test_1).toEqual("value 5");
      expect(secondRow.test_2).toEqual("value 6");

      instance.dispose();
    });

    it("should not replace number 0 with default value", () => {
      const columns = [
        {
          label: "Test 1",
          field: "test_1",
        },
        {
          label: "Test 2",
          field: "test_2",
        },
      ];

      const instance = new Datatable(
        table,
        {
          columns,
          rows: [{ test_1: "value 4" }, { test_1: "value 5", test_2: 0 }],
        },
        {
          defaultValue: "test",
        }
      );

      const [firstRow, secondRow] = instance.rows;

      expect(firstRow.test_1).toEqual("value 4");
      expect(firstRow.test_2).toEqual("test");

      expect(secondRow.test_1).toEqual("value 5");
      expect(secondRow.test_2).toEqual(0);

      instance.dispose();
    });

    it("should parse HTML rows & columns", () => {
      table.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Value 1</td>
            <td>Value 2</td>
          </tr>
          <tr>
            <td>Value 3</td>
            <td>Value 4</td>
          </tr>
        </tbody>
      </table>
      `;

      const instance = new Datatable(table);

      expect(instance.columns).toHaveLength(2);

      const [col] = instance.columns;

      expect(col.label).toEqual("Column 1");
      expect(col.field).toEqual("field_0");

      expect(instance.rows).toHaveLength(2);

      const [row] = instance.rows;

      expect(row.field_0).toEqual("Value 1");
      expect(row.field_1).toEqual("Value 2");
    });
  });

  describe("sorting", () => {
    it("should sort rows by column", () => {
      const instance = new Datatable(table, {
        columns: ["Column 1", "Column 2"],
        rows: [
          ["A", 12],
          ["M", 1],
          ["M", 3],
        ],
      });

      const icons = SelectorEngine.find(SELECTOR_SORT_ICON, table);

      const [sortIcon1, sortIcon2] = icons;
      const [sortHeader1, sortHeader2] = icons.map(
        (icon) => SelectorEngine.parents(icon, "th")[0]
      );

      sortHeader2.dispatchEvent(new MouseEvent("click"));

      expect(sortIcon2.classList.contains("opacity-100")).toBeTruthy();

      expect(instance.computedRows[0].field_1).toEqual(1);

      sortHeader2.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("A");

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(sortIcon2.classList.contains("opacity-100")).toBeFalsy();
      expect(sortIcon1.classList.contains("opacity-100")).toBeTruthy();

      expect(instance.computedRows[0].field_0).toEqual("A");

      instance.dispose();
    });

    it("should sort on render", () => {
      const instance = new Datatable(
        table,
        {
          columns: [{ label: "Column 1", field: "col_1" }, "Column 2"],
          rows: [
            ["A", 12],
            ["M", 1],
            ["D", 3],
          ],
        },
        {
          sortField: "col_1",
          sortOrder: "desc",
        }
      );

      const [firstIcon] = SelectorEngine.find(SELECTOR_SORT_ICON, table);

      expect(firstIcon.classList.contains("opacity-100")).toBe(true);
      expect(firstIcon.style.transform).toEqual("rotate(180deg)");

      const firstColValues = instance.computedRows.map((row) => row["col_1"]);

      expect(firstColValues[0]).toEqual("M");
      expect(firstColValues[1]).toEqual("D");
      expect(firstColValues[2]).toEqual("A");

      instance.dispose();
    });

    it("should return to an unsorted state on a third click event", () => {
      const instance = new Datatable(table, {
        columns: ["Column 1", "Column 2"],
        rows: [
          ["C", 12],
          ["B", 1],
          ["M", 3],
        ],
      });

      const [sortIcon1] = SelectorEngine.find(SELECTOR_SORT_ICON, table);
      const [sortHeader1] = SelectorEngine.parents(sortIcon1, "th");

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("B");

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("M");

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("C");

      instance.dispose();
    });

    it("should sort and be case insensitive", () => {
      const instance = new Datatable(table, {
        columns: ["Column 1", "Column 2"],

        rows: [
          ["C", 12],
          ["B", 1],
          ["M", 3],
          ["d", 1],
          ["M", 3],
        ],
      });

      const [sortIcon1] = SelectorEngine.find(SELECTOR_SORT_ICON, table);
      const [sortHeader1] = SelectorEngine.parents(sortIcon1, SELECTOR_HEADER);

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("B");
      expect(instance.computedRows[1].field_0).toEqual("C");
      expect(instance.computedRows[2].field_0).toEqual("d");

      instance.dispose();
    });

    it("should toggle between asc and desc when no sort disabled", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Column 1", "Column 2"],
          rows: [
            ["C", 12],
            ["B", 1],
            ["M", 3],
          ],
        },
        {
          forceSort: true,
        }
      );

      const [sortIcon1] = SelectorEngine.find(SELECTOR_SORT_ICON, table);
      const [sortHeader1] = SelectorEngine.parents(sortIcon1, "th");

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("B");

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("M");

      sortHeader1.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows[0].field_0).toEqual("B");

      instance.dispose();
    });
  });

  describe("searching", () => {
    it("should search for a phrase in all columns", () => {
      const instance = new Datatable(table, {
        columns: ["Category", "University", "Articles"],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
        ],
      });

      instance.search("si");

      expect(instance.computedRows).toHaveLength(2);

      instance.search("");

      expect(instance.computedRows).toHaveLength(3);

      instance.dispose();
    });

    it("should search for a phrase in one selected column", () => {
      const instance = new Datatable(table, {
        columns: ["Category", "University", "Articles"],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
        ],
      });

      instance.search("si", "field_0");

      expect(instance.computedRows).toHaveLength(1);

      instance.dispose();
    });

    it("should search for a phrase in several selected columns", () => {
      const instance = new Datatable(table, {
        columns: ["Category", "University", "Articles"],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
        ],
      });

      instance.search("r", ["field_0", "field_1"]);

      expect(instance.computedRows).toHaveLength(2);

      instance.dispose();
    });

    it("should display no found message", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
          ],
        },
        { noFoundMessage: "test message" }
      );

      instance.search("Caltech");

      const tableBody = SelectorEngine.findOne("tbody", table);
      expect(tableBody.innerHTML).toEqual(
        '<tr class="border-b border-neutral-200 dark:border-neutral-500"><td class="pl-2 py-3 font-light text-sm dark:text-neutral-300">test message</td></tr>'
      );
      instance.dispose();
    });

    it("should update pagination buttons state after search", () => {
      const instance = new Datatable(table, dataExample);

      const right = SelectorEngine.findOne(SELECTOR_PAGINATION_RIGHT, table);

      instance.search("ke");

      expect(instance.computedRows).toHaveLength(3);
      expect(right.disabled).toEqual(true);

      instance.search("ke*&");

      expect(instance.computedRows).toHaveLength(0);
      expect(right.disabled).toEqual(true);

      instance.search("");

      expect(instance.computedRows).toHaveLength(10);
      expect(right.disabled).toEqual(false);

      instance.dispose();
    });

    it("should not include html tags in the results", () => {
      const instance = new Datatable(table, {
        columns: ["Name", "Position", "Office", "Age", "Start date", "Salary"],
        rows: [
          [
            "Tiger Nixon",
            "System Architect",
            "	Edinburgh",
            61,
            "2011/04/25",
            "$320,800",
          ],
          [
            "Sonya Frost",
            '<a href="/abc">Test link 1</a>',
            "Edinburgh",
            23,
            "2008/12/13",
            "$103,600",
          ],
          [
            "Jena Gaines",
            "Office Manager",
            "London",
            30,
            "2008/12/19",
            "$90,560",
          ],
          [
            "Quinn Flynn",
            "Support Lead",
            "Edinburgh",
            22,
            "2013/03/03",
            "$342,000",
          ],
          [
            "Charde Marshall",
            "Regional Director",
            "San Francisco",
            36,
            "2008/10/16",
            "$470,600",
          ],
          [
            "Haley Kennedy",
            "Senior Marketing Designer",
            "London",
            43,
            "2012/12/18",
            "$313,500",
          ],
          [
            '<a href="/abc">Test link 2</a>',
            "Regional Director",
            "London",
            19,
            "2010/03/17",
            "$385,750",
          ],
          [
            "Michael Silva",
            "Marketing Designer",
            "London",
            66,
            "2012/11/27",
            "$198,500",
          ],
          [
            "Paul Byrd",
            "Chief Financial Officer (CFO)",
            "New York",
            64,
            "2010/06/09",
            "$725,000",
          ],
          [
            "Gloria Little",
            "Systems Administrator",
            "New York",
            59,
            "2009/04/10",
            "$237,500",
          ],
          [
            "Jonas Alexander",
            "Developer",
            "San Francisco",
            "30",
            "2010/07/14",
            "86",
          ],
          [
            "Shad Decker",
            "Regional Director",
            "Edinburgh",
            "51",
            "2008/11/13",
            "183",
          ],
          [
            "Michael Bruce",
            "Javascript Developer",
            "Singapore",
            "29",
            "2011/06/27",
            "183",
          ],
          [
            "Donna Snider",
            "Customer Support",
            "New York",
            "27",
            "2011/01/25",
            "112",
          ],
        ],
      });

      instance.search("test");

      expect(instance.computedRows).toHaveLength(2);

      instance.search("href");

      expect(instance.computedRows).toHaveLength(0);

      instance.dispose();
    });

    it("should search when pagination false", () => {
      const instance = new Datatable(table, {
        columns: ["Category", "University", "Articles"],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
        ],
      });
      instance._options.pagination = false;

      instance.search("si");

      expect(instance.computedRows).toHaveLength(2);

      instance.search("");

      expect(instance.computedRows).toHaveLength(3);

      instance.dispose();
    });

    it("should scroll to the top after search when maxHeight is set", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          maxHeight: 100,
        }
      );

      const tableBody = SelectorEngine.findOne(SELECTOR_BODY, table);
      tableBody.scrollTop = 100;
      instance.search("xyz");

      expect(tableBody.scrollTop).toEqual(0);

      instance.dispose();
    });
  });

  describe("cell formatting", () => {
    it("should add custom class to cells in the first column", () => {
      const instance = new Datatable(table, {
        columns: [
          {
            label: "Category",
            field: "category",
            format: (cell) => {
              Manipulator.addClass(cell, "test-cell-class");
            },
          },
          { label: "University", field: "university" },
          { label: "Articles", field: "articles" },
        ],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
        ],
      });

      const cells = SelectorEngine.find(SELECTOR_CELL, table);

      cells.forEach((cell) => {
        const field = Manipulator.getDataAttribute(cell, "field");

        if (field === "category") {
          expect(Manipulator.hasClass(cell, "test-cell-class")).toBe(true);
        }
      });

      instance.dispose();
    });
  });

  describe("pagination", () => {
    it("should render paginated datatable", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          pagination: true,
          entries: 2,
        }
      );

      const tableBody = SelectorEngine.findOne("tbody", table);
      const rows = SelectorEngine.find("tr", tableBody);
      expect(rows).toHaveLength(2);
      expect(SelectorEngine.findOne(SELECTOR_PAGINATION, table)).toBeTruthy();

      instance.dispose();
    });

    it("should render datatable without pagination", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          pagination: false,
          entries: 4,
        }
      );

      const tableBody = SelectorEngine.findOne("tbody", table);
      const rows = SelectorEngine.find("tr", tableBody);
      expect(rows).toHaveLength(6);
      expect(SelectorEngine.findOne(SELECTOR_PAGINATION, table)).toBeFalsy();

      instance._renderRows();
      expect(SelectorEngine.findOne(SELECTOR_PAGINATION, table)).toBeFalsy();

      instance.dispose();
    });

    it("should be able to change active page", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
          ],
        },
        {
          pagination: true,
          entries: 2,
        }
      );

      const right = SelectorEngine.findOne(SELECTOR_PAGINATION_RIGHT, table);
      const left = SelectorEngine.findOne(SELECTOR_PAGINATION_LEFT, table);

      const tableBody = SelectorEngine.findOne("tbody", table);
      let rows = SelectorEngine.find("tr", tableBody);
      expect(rows).toHaveLength(2);
      expect(left.hasAttribute("disabled")).toEqual(true);

      right.dispatchEvent(new MouseEvent("click"));

      rows = SelectorEngine.find("tr", tableBody);
      expect(rows).toHaveLength(2);
      expect(right.getAttribute("disabled")).toEqual(null);
      expect(left.getAttribute("disabled")).toEqual(null);

      right.dispatchEvent(new MouseEvent("click"));

      expect(instance.computedRows.length).toBe(1);
      expect(left.getAttribute("disabled")).toEqual(null);
      expect(right.hasAttribute("disabled")).toEqual(true);

      instance.dispose();
    });

    it("should update a number of visible entries", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          pagination: true,
          entries: 4,
        }
      );

      const tableBody = SelectorEngine.findOne("tbody", table);

      const select = SelectorEngine.findOne(SELECTOR_SELECT, table);

      select.value = "10";

      select.dispatchEvent(new CustomEvent(EVENT_VALUE_CHANGED_SELECT));

      const rows = SelectorEngine.find("tr", tableBody);
      expect(rows).toHaveLength(6);

      instance.dispose();
    });

    it("should update active page on entries change", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          pagination: true,
          entries: 4,
        }
      );

      const select = SelectorEngine.findOne(SELECTOR_SELECT, table);

      const right = SelectorEngine.findOne(SELECTOR_PAGINATION_RIGHT);
      const left = SelectorEngine.findOne(SELECTOR_PAGINATION_LEFT);

      right.dispatchEvent(new MouseEvent("click"));

      expect(instance._activePage).toEqual(1);

      select.value = "10";

      select.dispatchEvent(new CustomEvent(EVENT_VALUE_CHANGED_SELECT));

      expect(instance._activePage).toEqual(0);
      expect(right.hasAttribute("disabled")).toEqual(true);
      expect(left.hasAttribute("disabled")).toEqual(true);

      instance.dispose();
    });

    it("should render full pagination", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          pagination: true,
          entries: 2,
          fullPagination: true,
        }
      );

      const start = SelectorEngine.findOne(SELECTOR_PAGINATION_START);
      const end = SelectorEngine.findOne(SELECTOR_PAGINATION_END);

      expect(start).toBeTruthy();
      expect(end).toBeTruthy();

      end.dispatchEvent(new MouseEvent("click"));
      expect(instance._activePage).toEqual(2);

      start.dispatchEvent(new MouseEvent("click"));
      expect(instance._activePage).toEqual(0);

      instance.dispose();
    });

    it("should render All entries", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          pagination: true,
          entries: "All",
        }
      );

      const tableBody = SelectorEngine.findOne("tbody", table);
      const rows = SelectorEngine.find("tr", tableBody);
      expect(rows).toHaveLength(24);
      expect(SelectorEngine.findOne(SELECTOR_PAGINATION, table)).toBeTruthy();

      const right = SelectorEngine.findOne(SELECTOR_PAGINATION_RIGHT, table);

      expect(right.hasAttribute("disabled")).toEqual(true);

      instance.dispose();
    });

    it("should translate allText", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
            ["Mathematics", "Imerial College", 12],
          ],
        },
        {
          pagination: true,
          entriesOptions: [10, 25, 50, "All"],
          allText: "Wszystkie",
        }
      );

      const select = SelectorEngine.findOne(SELECTOR_SELECT, table);
      const selectChildren = select.children;

      expect(selectChildren[3].textContent).toBe("Wszystkie");

      instance.dispose();
    });
  });

  it("should display proper rows amount info", () => {
    const instance = new Datatable(table, {
      columns: ["Category", "University", "Articles"],
    });
    expect(instance.navigationText == `0 ${instance._options.ofText} 0`).toBe(
      true
    );

    instance.update({ rows: ["Category", "University", "Articles"] });
    expect(instance.navigationText == "1 - 3 of 3").toBe(true);

    instance.update({ rows: [] });
    expect(instance.navigationText == `0 ${instance._options.ofText} 0`).toBe(
      true
    );

    instance.dispose();
  });

  describe("edit", () => {
    it("should add contenteditable attribute to all entries", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          edit: true,
        }
      );

      SelectorEngine.find(SELECTOR_CELL, table).forEach((cell) => {
        expect(cell.attributes.contenteditable.value).toEqual("true");
      });

      instance.dispose();
    });

    it("should update rows after edit (row: array)", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          edit: true,
        }
      );

      const [cell] = SelectorEngine.find(SELECTOR_CELL, table);

      expect(cell.textContent).toEqual("Mathematics");

      cell.textContent = "Mathematics & Science";

      const event = new Event("input", { bubbles: true });

      cell.dispatchEvent(event);

      expect(instance._rows[0][0]).toEqual("Mathematics & Science");

      instance.dispose();
    });

    it("should update rows after edit (row: object)", () => {
      const instance = new Datatable(
        table,
        {
          columns: [
            { label: "Category", field: "category" },
            { label: "University", field: "university" },
            { label: "Articles", field: "articles" },
          ],
          rows: [
            {
              category: "Mathematics",
              university: "Imerial College",
              articles: 12,
            },
            {
              category: "Astronomy",
              university: "Cambridge University",
              articles: 1,
            },
            { category: "Physics", university: "MIT", articles: 3 },
          ],
        },
        {
          edit: true,
        }
      );

      const [cell] = SelectorEngine.find(SELECTOR_CELL, table);

      expect(cell.textContent).toEqual("Mathematics");

      cell.textContent = "Mathematics & Science";

      const event = new Event("input", { bubbles: true });

      cell.dispatchEvent(event);

      expect(instance._rows[0].category).toEqual("Mathematics & Science");

      instance.dispose();
    });

    it("should add event listeners after rows update", () => {
      const instance = new Datatable(
        table,
        {
          columns: [
            { label: "Category", field: "category" },
            { label: "University", field: "university" },
            { label: "Articles", field: "articles" },
          ],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          edit: true,
          entries: 3,
        }
      );

      instance._setupEditable = jest.fn();

      instance._changeActivePage(1);

      expect(instance._setupEditable).toHaveBeenCalled();
    });
  });

  describe("select", () => {
    it("should render checkboxes", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
        }
      );

      expect(SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table)).toHaveLength(6);

      instance.dispose();
    });

    it("should should add active class to a selected row", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
        }
      );

      const checkbox = SelectorEngine.findOne(SELECTOR_ROW_CHECKBOX, table);
      const row = SelectorEngine.findOne(SELECTOR_ROW, table);
      checkbox.checked = true;

      checkbox.dispatchEvent(new Event("input", { bubbles: true }));
      expect(row.classList.contains("active")).toBe(true);

      checkbox.checked = false;

      checkbox.dispatchEvent(new Event("input", { bubbles: true }));
      expect(row.classList.contains("active")).toBe(false);

      instance.dispose();
    });

    it("should allow only one row to be selected", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
        }
      );

      const [checkbox1, checkbox2] = SelectorEngine.find(
        SELECTOR_ROW_CHECKBOX,
        table
      );
      checkbox1.checked = true;
      const event = new Event("input", { bubbles: true });

      checkbox1.dispatchEvent(event);

      expect(instance._selected).toHaveLength(1);
      expect(instance._selected[0]).toEqual(0);

      checkbox2.checked = true;
      checkbox2.dispatchEvent(event);

      expect(instance._selected).toHaveLength(1);
      expect(instance._selected[0]).toEqual(1);

      checkbox2.checked = false;
      checkbox2.dispatchEvent(event);

      expect(instance._selected).toHaveLength(0);

      instance.dispose();
    });

    it("should emit selected rows", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
        }
      );

      const mock = jest.fn();

      table.addEventListener(EVENT_SELECTED, mock);

      const [checkbox1] = SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table);

      checkbox1.checked = true;
      checkbox1.dispatchEvent(new Event("input", { bubbles: true }));

      expect(mock).toHaveBeenCalled();

      instance.dispose();
    });

    it("should render selected rows after content update", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
          entries: 3,
        }
      );

      const mock = jest.fn();

      table.addEventListener(EVENT_SELECTED, mock);

      const [checkbox1] = SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table);

      checkbox1.checked = true;
      checkbox1.dispatchEvent(new Event("input", { bubbles: true }));

      instance._changeActivePage(1);

      expect(instance._selected).toHaveLength(1);
      SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table).forEach((checkbox) => {
        expect(checkbox.checked).toBe(false);
      });

      instance._changeActivePage(0);

      expect(SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table)[0].checked).toBe(
        true
      );

      instance.dispose();
    });
  });

  describe("multi select", () => {
    it("should render checkboxes", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
          multi: true,
        }
      );

      expect(SelectorEngine.find(SELECTOR_HEADER_CHECKBOX, table)).toHaveLength(
        1
      );
      expect(SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table)).toHaveLength(6);

      instance.dispose();
    });

    it("should allow multiple rows to be selected", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
          multi: true,
        }
      );

      const [checkbox1, checkbox2] = SelectorEngine.find(
        SELECTOR_ROW_CHECKBOX,
        table
      );
      checkbox1.checked = true;
      const event = new Event("input", { bubbles: true });

      checkbox1.dispatchEvent(event);

      expect(instance._selected).toHaveLength(1);
      expect(instance._selected[0]).toEqual(0);

      checkbox2.checked = true;
      checkbox2.dispatchEvent(event);

      expect(instance._selected).toHaveLength(2);
      expect(instance._selected[1]).toEqual(1);

      checkbox2.checked = false;
      checkbox2.dispatchEvent(event);

      expect(instance._selected).toHaveLength(1);
      expect(instance._selected[0]).toEqual(0);

      instance.dispose();
    });

    it("should select/unselect all entries", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
          multi: true,
          entries: 3,
        }
      );

      const headerCheckbox = SelectorEngine.findOne(
        SELECTOR_HEADER_CHECKBOX,
        table
      );

      headerCheckbox.checked = true;

      headerCheckbox.dispatchEvent(new Event("input", { bubbles: true }));

      SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table).forEach((checkbox) => {
        expect(checkbox.checked).toBe(true);
      });

      expect(instance._selected).toHaveLength(6);

      headerCheckbox.checked = false;

      headerCheckbox.dispatchEvent(new Event("input", { bubbles: true }));

      SelectorEngine.find(SELECTOR_ROW_CHECKBOX, table).forEach((checkbox) => {
        expect(checkbox.checked).toBe(false);
      });

      instance.dispose();
    });
  });

  describe("clickable rows", () => {
    it("should emit custom event on row click", () => {
      const mockFn = jest.fn();

      EventHandler.on(table, EVENT_ROW_CLICKED, mockFn);

      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          clickableRows: true,
        }
      );

      const firstRow = SelectorEngine.findOne(SELECTOR_ROW, table);

      EventHandler.trigger(firstRow, "click");

      expect(mockFn).toHaveBeenCalled();

      expect(mockFn).toHaveBeenCalledTimes(1);

      instance.dispose();

      EventHandler.trigger(firstRow, "click");

      expect(mockFn).toHaveBeenCalledTimes(1);

      EventHandler.off(table, EVENT_ROW_CLICKED);
    });

    it("should not emit custom event on checkbox click", () => {
      const mockFn = jest.fn();

      EventHandler.on(table, EVENT_ROW_CLICKED, mockFn);

      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          selectable: true,
          clickableRows: true,
        }
      );

      const firstRow = SelectorEngine.findOne(SELECTOR_ROW, table);
      const checkbox = SelectorEngine.findOne(SELECTOR_ROW_CHECKBOX, firstRow);

      EventHandler.trigger(checkbox, "click");

      expect(mockFn).not.toHaveBeenCalled();

      instance.dispose();

      EventHandler.off(table, EVENT_ROW_CLICKED);
    });
  });

  describe("updating & async behaviour", () => {
    it("should update columns and rows", () => {
      const instance = new Datatable(table);

      instance.update({
        columns: ["Category", "University", "Articles"],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
          ["Architecture", "ATH Zurich", 12],
          ["Computer Science", "Cambridge University", 10],
          ["Astrophysics", "Cambridge University", 4],
        ],
      });

      expect(SelectorEngine.find(SELECTOR_ROW, table)).toHaveLength(6);

      instance.dispose();
    });

    it("should update options & change styles", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          bordered: true,
          striped: true,
          hover: true,
        }
      );
      const thead = SelectorEngine.findOne(
        "[data-te-datatable-header-ref]",
        table
      );
      const row = SelectorEngine.findOne(SELECTOR_ROW, table);

      expect(thead.classList.contains("border")).toBe(true);
      expect(row.classList.contains("[&:nth-child(odd)]:bg-neutral-50")).toBe(
        true
      );
      expect(row.classList.contains("hover:bg-neutral-100")).toBe(true);

      instance.dispose();
    });

    it("should display loading message", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
          ],
        },
        {
          loading: true,
          loadingMessage: "Test loading...",
        }
      );

      expect(SelectorEngine.findOne(SELECTOR_LOADER, table)).toBeTruthy();
      expect(
        SelectorEngine.findOne(SELECTOR_LOADING_TEXT, table).innerHTML
      ).toEqual("Test loading...");
      expect(SelectorEngine.find(SELECTOR_ROW, table)).toHaveLength(0);

      instance.update(
        {
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        { loading: false }
      );

      expect(SelectorEngine.findOne(SELECTOR_LOADER, table)).toBeFalsy();
      expect(SelectorEngine.find(SELECTOR_ROW, table)).toHaveLength(6);

      instance.dispose();
    });

    it("should be disabled while loading", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
          ],
        },
        {
          loading: true,
        }
      );

      expect(SelectorEngine.findOne(SELECTOR_LOADER, table)).toBeTruthy();
      expect(
        SelectorEngine.findOne(SELECTOR_LOADING_TEXT, table).innerHTML
      ).toEqual("Loading results...");
      expect(SelectorEngine.find(SELECTOR_ROW, table)).toHaveLength(0);

      instance.update(null, { loading: false });

      expect(SelectorEngine.findOne(SELECTOR_LOADER, table)).toBeFalsy();
      expect(SelectorEngine.find(SELECTOR_ROW, table)).toHaveLength(2);

      instance.dispose();
    });

    it("method update should update sort field and order", () => {
      const data = {
        columns: [
          "Category",
          "University",
          { label: "Articles", field: "articles" },
        ],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 15],
          ["Astronomy", "Cambridge University", 1],
        ],
      };
      const instance = new Datatable(table, data, {
        loading: true,
      });

      expect(instance._options.sortField).toBeNull();
      expect(instance._options.sortOrder).toBe("asc");

      instance.update(null, {
        loading: false,
        forceSort: true,
        sortField: "articles",
        sortOrder: "desc",
      });

      expect(instance._options.sortField).toBe("articles");
      expect(instance._options.sortOrder).toBe("desc");
      expect(
        SelectorEngine.find(
          `${SELECTOR_ROW} [data-te-field="articles"]`,
          table
        )[0].innerHTML
      ).toBe("15");

      instance.dispose();
    });

    it("should jump to given page", () => {
      const instance = new Datatable(table, dataExample);

      expect(instance._activePage).toBe(0);

      instance.setActivePage(1);

      expect(instance._activePage).toBe(1);

      instance.dispose();
    });
  });

  describe("scrolling", () => {
    it("should set max height & max width (number)", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          maxHeight: 200,
          maxWidth: 400,
        }
      );

      const tableBody = SelectorEngine.findOne(SELECTOR_BODY, table);
      expect(tableBody.style["max-height"]).toEqual("200px");
      expect(tableBody.style["max-width"]).toEqual("400px");

      instance.dispose();
    });

    it("should set max height & max width (string)", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          maxHeight: "100%",
          maxWidth: "300px",
        }
      );

      const tableBody = SelectorEngine.findOne(SELECTOR_BODY, table);
      expect(tableBody.style["max-height"]).toEqual("100%");
      expect(tableBody.style["max-width"]).toEqual("300px");

      instance.dispose();
    });

    it("should set a fixed header", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {
          fixedHeader: true,
        }
      );

      const header = SelectorEngine.findOne(
        "[data-te-datatable-header-ref]",
        table
      );

      expect(header.classList.contains("sticky")).toBe(true);

      instance.dispose();
    });

    it("should set fixed columns", () => {
      const instance = new Datatable(table, {
        columns: [
          { label: "Category", field: "test", fixed: true, width: 150 },
          { label: "University", field: "test-2", fixed: true, width: 10 },
          { label: "Articles" },
        ],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
          ["Architecture", "ATH Zurich", 12],
          ["Computer Science", "Cambridge University", 10],
          ["Astrophysics", "Cambridge University", 4],
        ],
      });

      SelectorEngine.find('[data-mdb-field="test"]').forEach((cell) => {
        expect(cell.classList.contains("fixed-cell"));
        expect(cell.style.maxWidth).toEqual("150px");
      });

      SelectorEngine.find('[data-mdb-field="test-2"]').forEach((cell) => {
        expect(cell.classList.contains("fixed-cell"));
        expect(cell.style.maxWidth).toEqual("10px");
        expect(cell.style.left).toEqual("150px");
      });

      instance.dispose();
    });

    it("should set fixed columns (right)", () => {
      const instance = new Datatable(table, {
        columns: [
          { label: "Category", field: "test", fixed: "right", width: 150 },
          { label: "University", field: "test-2", fixed: "right", width: 10 },
          { label: "Articles" },
        ],
        rows: [
          ["Mathematics", "Imerial College", 12],
          ["Astronomy", "Cambridge University", 1],
          ["Physics", "MIT", 3],
          ["Architecture", "ATH Zurich", 12],
          ["Computer Science", "Cambridge University", 10],
          ["Astrophysics", "Cambridge University", 4],
        ],
      });

      SelectorEngine.find('[data-te-field="test"]').forEach((cell) => {
        expect(cell.classList.contains("fixed-cell"));
        expect(cell.style.maxWidth).toEqual("150px");
      });

      SelectorEngine.find('[data-te-field="test-2"]').forEach((cell) => {
        expect(cell.classList.contains("fixed-cell"));
        expect(cell.style.maxWidth).toEqual("10px");
        expect(cell.style.right).toEqual("150px");
      });

      instance.dispose();
    });
  });

  describe("class customization", () => {
    it("should sets custom classes", () => {
      const instance = new Datatable(
        table,
        {
          columns: ["Category", "University", "Articles"],
          rows: [
            ["Mathematics", "Imerial College", 12],
            ["Astronomy", "Cambridge University", 1],
            ["Physics", "MIT", 3],
            ["Architecture", "ATH Zurich", 12],
            ["Computer Science", "Cambridge University", 10],
            ["Astrophysics", "Cambridge University", 4],
          ],
        },
        {},
        { borderColor: "border-red-900 dark:border-green-200" }
      );
      const thead = SelectorEngine.findOne(
        "[data-te-datatable-header-ref]",
        table
      );

      expect(thead.classList.contains("border-red-900")).toBe(true);
      expect(thead.classList.contains("dark:border-green-200")).toBe(true);

      instance.dispose();
    });
  });

  describe("jQueryInterface", () => {
    it("should register jQuery methods", () => {
      jest.resetModules();
      jest.mock("../../src/js/dom/event-handler");
      table.setAttribute("data-te-datatable-init", "");

      const mock = { ...jQueryMock };
      window.jQuery = mock;

      const Datatable = require("../../src/js/data/datatables").default; // eslint-disable-line global-require
      const initMDB = require("../../src/js/autoinit/index.js").default; // eslint-disable-line global-require
      initMDB({ Datatable });

      expect(mock.fn.datatable).toBeTruthy();

      expect(typeof mock.fn.datatable.noConflict()).toBe("function");
      window.jQuery = null;
    });

    it("should initialize a datatable", () => {
      jest.mock("../../src/js/dom/event-handler");

      jest.resetModules();

      require("../../src/js/data/datatables").default; // eslint-disable-line global-require

      jQueryMock.fn.datatable = Datatable.jQueryInterface;
      jQueryMock.elements = [table];

      jQueryMock.fn.datatable.call(jQueryMock);

      const instance = Datatable.getInstance(table);

      expect(instance).toBeTruthy();

      jQueryMock.fn.datatable.call(jQueryMock);

      expect(Datatable.getInstance(table)).toEqual(instance);

      instance.dispose();
    });

    it("should call public methods", () => {
      jQueryMock.fn.datatable = Datatable.jQueryInterface;
      jQueryMock.elements = [table];

      jQueryMock.fn.datatable.call(jQueryMock);

      const instance = Datatable.getInstance(table);

      instance.search = jest.fn();

      jQueryMock.fn.datatable.call(jQueryMock, "search");

      expect(instance.search).toHaveBeenCalled();

      expect(() => jQueryMock.fn.datatable.call(jQueryMock, "test")).toThrow();

      jQueryMock.fn.datatable.call(jQueryMock, "dispose");

      expect(Datatable.getInstance(table)).toBe(null);

      expect(() =>
        jQueryMock.fn.datatable.call(jQueryMock, "dispose")
      ).not.toThrow();
    });
  });
});
