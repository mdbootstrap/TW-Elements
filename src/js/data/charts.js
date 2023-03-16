import {
  Chart as Chartjs,
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
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  element,
  getjQuery,
  onDOMContentLoaded,
  typeCheckConfig,
} from "../util/index";
import Data from "../dom/data";
import Manipulator from "../dom/manipulator";
import SelectorEngine from "../dom/selector-engine";

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

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const merge = require("deepmerge");

const NAME = "chart";
const DATA_KEY = "te.chart";
const CLASSNAME_CHARTS = "chart";

// Default options
const DEFAULT_LEGEND_COLOR = {
  plugins: {
    legend: {
      labels: {
        color: "rgb(102,102,102)",
      },
    },
  },
};

const DEFAULT_OPTIONS = {
  line: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.0)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2,
          tension: 0.0,
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgb(59, 112, 202)",
        },
      },
      responsive: true,
      legend: {
        display: true,
      },
      tooltips: {
        intersect: false,
        mode: "index",
      },
      datasets: {
        borderColor: "red",
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
        y: {
          stacked: false,
          grid: {
            borderDash: [2],
            drawBorder: false,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
      },
    },
  },
  bar: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      backgroundColor: "rgb(59, 112, 202)",
      borderWidth: 0,
      responsive: true,
      legend: {
        display: true,
      },
      tooltips: {
        intersect: false,
        mode: "index",
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
        y: {
          stacked: true,
          grid: {
            borderDash: [2],
            drawBorder: false,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
      },
    },
  },
  pie: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      elements: {
        arc: { backgroundColor: "rgb(59, 112, 202)" },
      },
      responsive: true,
      legend: {
        display: true,
      },
    },
  },
  doughnut: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      elements: {
        arc: { backgroundColor: "rgb(59, 112, 202)" },
      },
      responsive: true,
      legend: {
        display: true,
      },
    },
  },
  polarArea: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      elements: {
        arc: { backgroundColor: "rgba(59, 112, 202, 0.5)" },
      },
      responsive: true,
      legend: {
        display: true,
      },
    },
  },
  radar: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.5)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2,
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgb(59, 112, 202)",
        },
      },
      responsive: true,
      legend: {
        display: true,
      },
    },
  },
  scatter: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.5)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2,
          tension: 0.0,
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgba(59, 112, 202, 0.5)",
        },
      },
      responsive: true,
      legend: {
        display: true,
      },
      tooltips: {
        intersect: false,
        mode: "index",
      },
      datasets: {
        borderColor: "red",
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
        y: {
          stacked: false,
          grid: {
            borderDash: [2],
            drawBorder: false,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
      },
    },
  },
  bubble: {
    options: {
      ...DEFAULT_LEGEND_COLOR,
      elements: {
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgba(59, 112, 202, 0.5)",
        },
      },
      responsive: true,
      legend: {
        display: true,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
        y: {
          grid: {
            borderDash: [2],
            drawBorder: false,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)",
          },
        },
      },
    },
  },
};

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
  darkBgColor: "#262626",
  options: null,
};

const DARK_OPTIONS_TYPE = {
  darkTicksColor: "string",
  darkLabelColor: "string",
  darkGridLinesColor: "string",
  darkmodeOff: "(string|null)",
  darkBgColor: "string",
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
      this._handleMode(this.systemColorMode);
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
      (window.matchMedia("(prefers-color-scheme: dark)").matches
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

    this._prevConfig = this._chart.options;

    this._options = { ...this._options, ...config };
    this._chart.options = merge(this._chart.options, this._options);
    this._chart.update();
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
        plugins.push(ChartDataLabels);
      }

      this._chart = new Chartjs(this._canvas, {
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
        (set.borderColor = dark ? this._darkOptions.darkBgColor : "#fff")
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

/**
 * ------------------------------------------------------------------------
 * Data Api implementation - auto initialization
 * ------------------------------------------------------------------------
 */

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

SelectorEngine.find("[data-te-chart]").forEach((el) => {
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
    return new Chart(el, {
      ...dataAttr,
      ...DEFAULT_OPTIONS[dataAttr.type],
    });
  }
  return null;
});

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 * add .chart to jQuery only if jQuery is present
 */

onDOMContentLoaded(() => {
  const $ = getjQuery();

  if ($) {
    const JQUERY_NO_CONFLICT = $.fn[NAME];
    $.fn[NAME] = Chart.jQueryInterface;
    $.fn[NAME].Constructor = Chart;
    $.fn[NAME].noConflict = () => {
      $.fn[NAME] = JQUERY_NO_CONFLICT;
      return Chart.jQueryInterface;
    };
  }
});

export default Chart;
