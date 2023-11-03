import { element } from "../../util/index";
import Manipulator from "../../dom/manipulator";
import { sanitizeHtml, DefaultWhitelist } from "../../util/sanitizer";

const AUTOCOMPLETE_DROPDOWN_REF = "data-te-autocomplete-dropdown-ref";
const AUTOCOMPLETE_ITEMS_LIST_REF = "data-te-autocomplete-items-list-ref";
const AUTOCOMPLETE_ITEM_REF = "data-te-autocomplete-item-ref";
const AUTOCOMPLETE_LOADER_REF = "data-te-autocomplete-loader-ref";

export function getDropdownTemplate(settings, classes) {
  const { id, items, width, options } = settings;

  const dropdownContainer = element("div");

  Manipulator.addClass(dropdownContainer, classes.dropdownContainer);

  Manipulator.addStyle(dropdownContainer, { width: `${width}px` });
  dropdownContainer.setAttribute("id", id);

  const dropdown = element("div");
  dropdown.setAttribute(AUTOCOMPLETE_DROPDOWN_REF, "");
  Manipulator.addClass(dropdown, classes.dropdown);

  const itemsList = element("ul");
  const listHeight = options.listHeight;

  itemsList.setAttribute(AUTOCOMPLETE_ITEMS_LIST_REF, "");
  Manipulator.addClass(itemsList, classes.autocompleteList);
  Manipulator.addClass(itemsList, classes.scrollbar);

  Manipulator.addStyle(itemsList, { maxHeight: `${listHeight}px` });
  itemsList.setAttribute("role", "listbox");

  const itemsListTemplate = getItemsTemplate(items, options);

  itemsList.innerHTML = itemsListTemplate;

  dropdown.appendChild(itemsList);
  dropdownContainer.appendChild(dropdown);

  return dropdownContainer;
}

export function getItemsTemplate(items = [], options, itemClasses) {
  const displayValue = options.displayValue;
  const itemContent = options.itemContent;
  return `
    ${items
      .map((item, index) => {
        const content =
          typeof itemContent === "function"
            ? sanitizeHtml(itemContent(item), DefaultWhitelist, null)
            : displayValue(item);
        return `<li data-te-index="${index}" role="option" class="${itemClasses}" ${AUTOCOMPLETE_ITEM_REF} >${content}</li>`;
      })
      .join("")}
  `;
}

export function getLoaderTemplate(classes) {
  const container = element("div");
  container.setAttribute(AUTOCOMPLETE_LOADER_REF, "");
  Manipulator.addClass(container, classes.autocompleteLoader);

  Manipulator.addClass(container, classes.spinnerIcon);

  container.setAttribute("role", "status");

  const content = `<span class="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">Loading...</span>`;
  container.innerHTML = content;

  return container;
}

export function getNoResultsTemplate(message, classes) {
  return `<li class="${classes.autocompleteItem}">${message}</li>`;
}
