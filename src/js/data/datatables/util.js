/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

const sort = ({ rows, field, order }) => {
  const sorted = rows.sort((a, b) => {
    let fieldA = a[field];
    let fieldB = b[field];

    if (typeof fieldA === "string") {
      fieldA = fieldA.toLowerCase();
    }
    if (typeof fieldB === "string") {
      fieldB = fieldB.toLowerCase();
    }

    if (fieldA < fieldB) {
      return order === "desc" ? 1 : -1;
    }
    if (fieldA > fieldB) {
      return order === "desc" ? -1 : 1;
    }
    return 0;
  });

  return sorted;
};

const search = (rows, search, column) => {
  if (!search) return rows;

  const match = (entry) => {
    const div = document.createElement("div");
    div.innerHTML = entry;
    entry = div.textContent || div.innerText || "";

    return entry.toString().toLowerCase().match(search.toLowerCase());
  };

  return rows.filter((row) => {
    if (column && typeof column === "string") {
      return match(row[column]);
    }

    let values = Object.values(row);

    if (column && Array.isArray(column)) {
      values = Object.keys(row)
        .filter((key) => column.includes(key))
        .map((key) => row[key]);
    }

    return (
      values.filter((value) => {
        return match(value);
      }).length > 0
    );
  });
};

const paginate = ({ rows, entries, activePage }) => {
  const firstVisibleEntry = activePage * entries;
  return rows.slice(firstVisibleEntry, firstVisibleEntry + Number(entries));
};

export { sort, search, paginate };
