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
