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
