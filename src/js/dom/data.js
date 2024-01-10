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

/*
------------------------------------------------------------------------
Constants
------------------------------------------------------------------------
*/

const mapData = (() => {
  const storeData = {};
  let id = 1;
  return {
    set(element, key, data) {
      if (typeof element[key] === "undefined") {
        element[key] = {
          key,
          id,
        };
        id++;
      }

      storeData[element[key].id] = data;
    },
    get(element, key) {
      if (!element || typeof element[key] === "undefined") {
        return null;
      }

      const keyProperties = element[key];
      if (keyProperties.key === key) {
        return storeData[keyProperties.id];
      }

      return null;
    },
    delete(element, key) {
      if (typeof element[key] === "undefined") {
        return;
      }

      const keyProperties = element[key];
      if (keyProperties.key === key) {
        delete storeData[keyProperties.id];
        delete element[key];
      }
    },
  };
})();

const Data = {
  setData(instance, key, data) {
    mapData.set(instance, key, data);
  },
  getData(instance, key) {
    return mapData.get(instance, key);
  },
  removeData(instance, key) {
    mapData.delete(instance, key);
  },
};

export default Data;
