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

import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";
import { DEFAULT_OPTIONS } from "../data/chart/chartDefaults";

const chartsCallback = (component, initSelector) => {
  // eslint-disable-next-line consistent-return
  const IS_COMPLEX = (data) => {
    return (
      (data[0] === "{" && data[data.length - 1] === "}") ||
      (data[0] === "[" && data[data.length - 1] === "]")
    );
  };

  const CONVERT_DATA_TYPE = (data) => {
    if (typeof data !== "string") return data;
    if (IS_COMPLEX(data)) {
      return JSON.parse(data.replace(/'/g, '"'));
    }
    return data;
  };

  const PARSE_DATA = (data) => {
    const dataset = {};
    Object.keys(data).forEach((property) => {
      if (property.match(/dataset.*/)) {
        const chartProperty = property
          .slice(7, 8)
          .toLowerCase()
          .concat(property.slice(8));
        dataset[chartProperty] = CONVERT_DATA_TYPE(data[property]);
      }
    });
    return dataset;
  };

  SelectorEngine.find(initSelector).forEach((el) => {
    if (
      Manipulator.getDataAttribute(el, "chart") !== "bubble" &&
      Manipulator.getDataAttribute(el, "chart") !== "scatter"
    ) {
      const dataSet = Manipulator.getDataAttributes(el);
      const dataAttr = {
        data: {
          datasets: [PARSE_DATA(dataSet)],
        },
      };
      if (dataSet.chart) {
        dataAttr.type = dataSet.chart;
      }
      if (dataSet.labels) {
        dataAttr.data.labels = JSON.parse(dataSet.labels.replace(/'/g, '"'));
      }
      return new component(el, {
        ...dataAttr,
        ...DEFAULT_OPTIONS[dataAttr.type],
      });
    }
    return null;
  });
};

export { chartsCallback };
