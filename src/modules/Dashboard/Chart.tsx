import React from "react";
import { Bar } from "react-chartjs-2";
import { isMobile } from "react-device-detect";
import { max } from "lodash";
import { red, blue } from "../Theme";

const data = (ca, salaries) => ({
  datasets: [
    {
      label: "Chiffre d'affaires",
      type: "line",
      data: ca,
      fill: false,
      borderColor: red,
      backgroundColor: red,
      pointBorderColor: red,
      pointBackgroundColor: red,
      pointHoverBackgroundColor: red,
      pointHoverBorderColor: red,
      yAxisID: "y-axis-2"
    },
    {
      type: "bar",
      label: "Rémunération",
      data: salaries,
      fill: false,
      backgroundColor: blue,
      borderColor: blue,
      hoverBackgroundColor: blue,
      hoverBorderColor: blue,
      yAxisID: "y-axis-1"
    }
  ]
});

const options = (ca, salaries) => {
  const maxValue = max([...ca, ...salaries]) + 1000;
  return {
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
            "Mai",
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
          stacked: true,
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
          gridLines: {
            display: false
          },
          labels: {
            show: true
          },
          ticks: {
            beginAtZero: true,
            max: maxValue,
            min: 0
          }
        },
        {
          stacked: true,
          type: "linear",
          display: true,
          position: "right",
          id: "y-axis-2",
          gridLines: {
            display: false
          },
          labels: {
            show: true
          },
          ticks: {
            beginAtZero: true,
            max: maxValue,
            min: 0
          }
        }
      ]
    }
  };
};

export const Chart = ({ ca, salaries }) => (
  <div>
    <Bar
      height={isMobile ? 200 : 150}
      data={data(ca, salaries)}
      options={options(ca, salaries)}
    />
  </div>
);
