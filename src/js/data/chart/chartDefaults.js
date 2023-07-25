/*
--------------------------------------------------------------------------
Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
Copyright © 2023 MDBootstrap.com

Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
--------------------------------------------------------------------------
*/

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

export const DEFAULT_OPTIONS = {
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
