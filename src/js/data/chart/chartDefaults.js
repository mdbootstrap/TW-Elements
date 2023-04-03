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
