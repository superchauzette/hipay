import React from "react";
import { Bar } from "react-chartjs-2";

const data = (ca, salaries) => ({
  datasets: [
    {
      label: "Chiffre d'affaire",
      type: "line",
      data: ca,
      fill: false,
      borderColor: "#EC932F",
      backgroundColor: "#EC932F",
      pointBorderColor: "#EC932F",
      pointBackgroundColor: "#EC932F",
      pointHoverBackgroundColor: "#EC932F",
      pointHoverBorderColor: "#EC932F",
      yAxisID: "y-axis-2"
    },
    {
      type: "bar",
      label: "Salaires",
      data: salaries,
      fill: false,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      hoverBackgroundColor: "#71B37C",
      hoverBorderColor: "#71B37C",
      yAxisID: "y-axis-1"
    }
  ]
});

const options = {
  responsive: true,
  tooltips: {
    mode: "label"
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        labels: [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mail",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre"
        ],

        display: true,
        gridLines: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      },
      {
        type: "linear",
        display: true,
        position: "right",
        id: "y-axis-2",
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ]
  }
};

export const Chart = ({ ca, salaries }) => (
  <div>
    <Bar data={data(ca, salaries)} options={options} />
  </div>
);
