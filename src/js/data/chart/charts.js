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

import { element, typeCheckConfig } from "../../util/index";
import Data from "../../dom/data";
import Manipulator from "../../dom/manipulator";
import { DEFAULT_OPTIONS } from "./chartDefaults";
/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

import merge from "deepmerge";

const NAME = "chart";
const DATA_KEY = "te.chart";
const CLASSNAME_CHARTS = "chart";

const GENERATE_DATA = (options, type, defaultType) => {
  const mergeObjects = (target, source, options) => {
    const destination = target.slice();
    source.forEach((item, index) => {
      if (typeof destination[index] === "undefined") {
        destination[index] = options.cloneUnlessOtherwiseSpecified(
          item,
          options
        );
      } else if (options.isMergeableObject(item)) {
        destination[index] = merge(target[index], item, options);
      } else if (target.indexOf(item) === -1) {
        destination.push(item);
      }
    });
    return destination;
  };
  return merge(defaultType[type], options, {
    arrayMerge: mergeObjects,
  });
};

const DEFAULT_DARK_OPTIONS = {
  darkTicksColor: "#fff",
  darkLabelColor: "#fff",
  darkGridLinesColor: "#555",
  darkmodeOff: "undefined",
  darkMode: null,
  darkBgColor: "#262626",
  darkBgColorLight: "#fff",
  options: null,
};

const DARK_OPTIONS_TYPE = {
  darkTicksColor: "string",
  darkLabelColor: "string",
  darkGridLinesColor: "string",
  darkmodeOff: "(string|null)",
  darkMode: "(string|null)",
  darkBgColor: "string",
  darkBgColorLight: "string",
  options: "(object|null)",
};

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
//

class Chart {
  constructor(element, data, options = {}, darkOptions = {}) {
    this._waitForCharts(element, data, options, darkOptions);
  }

  async _getChartjs() {
    const {
      Chart: Chartjs,
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      SubTitle,
    } = await import("chart.js");
    Chartjs.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      SubTitle
    );

    return Chartjs;
  }

  async _getChartDataLabels() {
    const ChartDataLabels = await import("chartjs-plugin-datalabels");
    return ChartDataLabels;
  }

  async _waitForCharts(element, data, options = {}, darkOptions = {}) {
    this._Chartjs = await this._getChartjs();
    this._ChartDataLabels = await this._getChartDataLabels();
    this._element = element;
    this._data = data;
    this._options = options;
    this._type = data.type;
    this._canvas = null;
    this._chart = null;

    // handle mode change (dark- and lightmode)
    this._darkOptions = this._getDarkConfig(darkOptions);
    this._darkModeClassContainer = document.querySelector("html");
    this._prevConfig = null;
    this._observer = null;

    if (this._element) {
      Data.setData(element, DATA_KEY, this);
      Manipulator.addClass(this._element, CLASSNAME_CHARTS);
      this._chartConstructor();
    }

    if (this._darkOptions.darkmodeOff !== null) {
      // check mode on start
      const mode =
        this._darkOptions.darkMode === "dark"
          ? "dark"
          : this._darkOptions.darkMode === "light"
          ? "light"
          : this.systemColorMode;
      this._handleMode(mode);
      // observe darkmode class container change
      this._observer = new MutationObserver(this._observerCallback.bind(this));
      this._observer.observe(this._darkModeClassContainer, {
        attributes: true,
      });
    }
  }

  // Getters
  static get NAME() {
    return NAME;
  }

  get systemColorMode() {
    return (
      localStorage.theme ||
      (this._darkModeClassContainer.classList.contains("dark")
        ? "dark"
        : "light")
    );
  }

  // Public
  dispose() {
    this._observer.disconnect();
    Data.removeData(this._element, DATA_KEY);
    this._element = null;
  }

  update(data, config) {
    if (data) {
      this._data = { ...this._data, ...data };
      this._chart.data = this._data;
    }

    const configOptions = Object.prototype.hasOwnProperty.call(
      config,
      "options"
    )
      ? config
      : { options: { ...config } };

    this._options = merge(this._options, configOptions);

    this._chart.options = GENERATE_DATA(
      this._options,
      this._type,
      DEFAULT_OPTIONS
    ).options;

    this._chart.update();
  }

  setTheme(theme) {
    if ((theme !== "dark" && theme !== "light") || !this._data) {
      return;
    }
    this._handleMode(theme);
  }

  // Private
  _getDarkConfig(config) {
    let dataAttributes = {};
    const dataAttr = Manipulator.getDataAttributes(this._element);
    Object.keys(dataAttr).forEach(
      (key) => key.startsWith("dark") && (dataAttributes[key] = dataAttr[key])
    );

    dataAttributes = {
      ...DEFAULT_DARK_OPTIONS,
      ...dataAttributes,
    };

    const xyScale = {
      y: {
        ticks: {
          color: dataAttributes.darkTicksColor,
        },
        grid: {
          color: dataAttributes.darkGridLinesColor,
        },
      },
      x: {
        ticks: {
          color: dataAttributes.darkTicksColor,
        },
        grid: {
          color: dataAttributes.darkGridLinesColor,
        },
      },
    };

    const rScale = {
      r: {
        ticks: {
          color: dataAttributes.darkTicksColor,
          backdropColor: dataAttributes.darkBgColor,
        },
        grid: {
          color: dataAttributes.darkGridLinesColor,
        },
        pointLabels: {
          color: dataAttributes.darkTicksColor,
        },
      },
    };

    const radials = ["pie", "doughnut", "polarArea", "radar"];

    const scales = !radials.includes(this._type)
      ? xyScale
      : ["polarArea", "radar"].includes(this._type)
      ? rScale
      : {};

    const opt = {
      scales,
      plugins: {
        legend: {
          labels: {
            color: dataAttributes.darkLabelColor,
          },
        },
      },
    };

    // combine config
    config = {
      ...dataAttributes,
      options: {
        ...opt,
      },
      ...config,
    };

    typeCheckConfig(NAME, config, DARK_OPTIONS_TYPE);

    return config;
  }

  _chartConstructor() {
    if (this._data) {
      this._createCanvas();

      const options = GENERATE_DATA(this._options, this._type, DEFAULT_OPTIONS);
      const plugins = [];

      if (options.dataLabelsPlugin) {
        plugins.push(this._ChartDataLabels.default);
      }

      this._prevConfig = options;
      this._chart = new this._Chartjs(this._canvas, {
        ...this._data,
        ...options,
        plugins,
      });
    }
  }

  _createCanvas() {
    if (this._canvas) return;
    if (this._element.nodeName === "CANVAS") {
      this._canvas = this._element;
    } else {
      this._canvas = element("canvas");
      this._element.appendChild(this._canvas);
    }
  }

  _handleMode(systemColor) {
    if (systemColor === "dark") {
      this._changeDatasetBorderColor();
      this.update(null, this._darkOptions.options);
    } else {
      this._changeDatasetBorderColor(false);
      this._prevConfig && this.update(null, this._prevConfig);
    }
  }

  _observerCallback(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        this._handleMode(this.systemColorMode);
      }
    }
  }

  _changeDatasetBorderColor(dark = true) {
    [...this._data.data.datasets].forEach(
      (set) =>
        ["pie", "doughnut", "polarArea"].includes(this._type) &&
        (set.borderColor = dark
          ? this._darkOptions.darkBgColor
          : this._darkOptions.darkBgColorLight)
    );
  }

  static jQueryInterface(data, options, type) {
    return this.each(function () {
      let chartData = Data.getData(this, DATA_KEY);

      if (!chartData && /dispose/.test(data)) {
        return;
      }

      if (!chartData) {
        const chartOptions = options
          ? GENERATE_DATA(options, type, DEFAULT_OPTIONS)
          : DEFAULT_OPTIONS[type];

        chartData = new Chart(this, {
          ...data,
          ...chartOptions,
        });
      }

      if (typeof data === "string") {
        if (typeof chartData[data] === "undefined") {
          throw new TypeError(`No method named "${data}"`);
        }

        chartData[data](options, type);
      }
    });
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY);
  }

  static getOrCreateInstance(element, config = {}) {
    return (
      this.getInstance(element) ||
      new this(element, typeof config === "object" ? config : null)
    );
  }
}

export default Chart;
