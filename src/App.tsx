import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import mergedData from "../export/dist/export-2024-04-03_00:15:31:442296677/merged_data.json";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState } from "react";
import regression from "regression";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      type: "linear" as const,
      display: true,
      position: "left" as const,
    },
    y1: {
      type: "linear" as const,
      display: true,
      position: "right" as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

function deriveRelation(m1, b1, m2, b2) {
  // Solves for x in terms of y1 from the first function: y1 = m1*x + b1
  // x = (y1 - b1) / m1

  // Substitutes x in the second function to get y2 in terms of y1: y2 = m2*((y1 - b1) / m1) + b2
  // Simplifies to: y2 = (m2/m1)*y1 + (b2 - (m2*b1)/m1)

  const slope = m2 / m1;
  const intercept = b2 - (m2 * b1) / m1;

  // Return the derived function as an object
  return {
    slope: slope,
    intercept: intercept,
    evaluate: function (y1) {
      return this.slope * y1 + this.intercept;
    }
  };
}

const regressionOptions = {
  order: 2,
  precision: 5,
}

const labels = mergedData.map((x) => x.year);

const carbonLabels = mergedData.map((x) => x.carbon_dioxide_ppm[0]);
const carbonRegressionData = carbonLabels.map(function (element, index) {
  return [Number(labels[index]), element];
});
const carbonRegression = regression.linear(carbonRegressionData, regressionOptions);

const acidityLabels = mergedData.map((x) => x.hawaii_acidity[0].hawaii_ph);
const acidityRegressionData = acidityLabels.map(function (element, index) {
  return [Number(labels[index]), element];
});
const acidityRegression = regression.linear(acidityRegressionData, regressionOptions);

const degreeLabels = mergedData.map((x) => x.global_sea_year_anomaly_farenheit);
const degreeRegressionData = degreeLabels.map(function (element, index) {
  return [Number(labels[index]), element];
});
const degreeRegression = regression.linear(degreeRegressionData, regressionOptions);

const mouleLabels = mergedData.map((x) => x.mollusc_density_square_meter);
const mouleRegressionData = mouleLabels.map(function (element, index) {
  return [Number(labels[index]), element];
});
const mouleRegression = regression.linear(mouleRegressionData, regressionOptions);

const labels2 = [...labels, ...labels.map((x) => String(Number(x) + 30))];

console.log(carbonRegression, acidityRegression);

const degreePredi = labels2.map((x: string) => degreeRegression.predict(Number(x))[1]);
const phPredi = labels2.map((x: string) => acidityRegression.predict(Number(x))[1]);
const carbonPredi = labels2.map((x: string) => carbonRegression.predict(Number(x))[1]);
const moulePredi = labels2.map((x: string) => mouleRegression.predict(Number(x))[1]);

export const data = {
  labels,
  datasets: [
    {
      label: "Carbon Dioxidre (ppm)",
      data: carbonLabels,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
      tension: 0.4
    },
    {
      label: "Farenheit",
      data: degreeLabels,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
      tension: 0.4
    },
    {
      label: "Ph",
      data: acidityLabels,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
      tension: 0.4
    },
    {
      label: "Mollusk (density per square/meter)",
      data: mouleLabels,
      borderColor: "rgb(242, 142, 234)",
      backgroundColor: "rgba(242, 142, 234, 0.5)",
      yAxisID: "y",
      tension: 0.4
    },
    {
      label: "Carbon Dioxidre (ppm)",
      data: carbonLabels,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y1",
      tension: 0.4
    },
    {
      label: "Carbon Dioxidre (ppm) Prediction",
      data: carbonPredi,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
      borderDash: [1, 1],
    },
    {
      label: "Carbon Dioxidre (ppm) Prediction",
      data: carbonPredi,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y1",
      borderDash: [1, 1],
    },
    {
      label: "Farenheit",
      data: degreeLabels,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
      tension: 0.4
    },
    {
      label: "Farenheit Prediction",
      data: degreePredi,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
      borderDash: [1, 1],
    },
    {
      label: "Farenheit Prediction",
      data: degreePredi,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
      borderDash: [1, 1],
    },
    {
      label: "Ph",
      data: acidityLabels,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
      tension: 0.4
    },
    {
      label: "Ph",
      data: acidityLabels,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
      tension: 0.4
    },
    {
      label: "Ph Prediction",
      data: phPredi,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
      borderDash: [1, 1],
    },
    {
      label: "Ph Prediction",
      data: phPredi,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
      borderDash: [1, 1],
    },
    {
      label: "Mollusk",
      data: mouleLabels,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
      tension: 0.4
    },
    {
      label: "Mollusk (density per square/meter)",
      data: mouleLabels,
      borderColor: "rgb(242, 142, 234)",
      backgroundColor: "rgba(242, 142, 234, 0.5)",
      yAxisID: "y1",
      tension: 0.4
    },
    {
      label: "Mollusk (density per square/meter) Prediction",
      data: moulePredi,
      borderColor: "rgb(242, 142, 234)",
      backgroundColor: "rgba(242, 142, 234, 0.5)",
      yAxisID: "y",
      borderDash: [1, 1],
    },
    {
      label: "Mollusk (density per square/meter) Prediction",
      data: moulePredi,
      borderColor: "rgb(242, 142, 234)",
      backgroundColor: "rgba(242, 142, 234, 0.5)",
      yAxisID: "y1",
      borderDash: [1, 1],
    },
  ],
};

export default function App() {
  const [data1, setData1] = React.useState("");
  const [data2, setData2] = React.useState("");
  const [checked, setChecked] = useState(false);

  const [displayData, setDisplayData] = React.useState({
    labels: [],
    datasets: [],
  });

  const [changeFactor, setChangeFactor] = React.useState(100);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    updatePrevisions();
  };

  const updatePrevisions = () => {
    if (checked && displayData.datasets.length === 4) {
      setDisplayData((prevData) => ({
        labels: data.labels,
        datasets: [prevData.datasets[0], prevData.datasets[1]], // Remove the first dataset
      }));
    } else {
      const newDatasets = data.datasets.find(
        (dataset) =>
          dataset.label === displayData.datasets[0].label + " Prediction" && dataset.yAxisID === displayData.datasets[0].yAxisID
      );

      const newDatasets2 = data.datasets.find(
        (dataset) =>
          dataset.label === displayData.datasets[1].label + " Prediction" && dataset.yAxisID === displayData.datasets[1].yAxisID
      );
      setDisplayData((prevData) => ({
        labels: labels2,
        datasets: [prevData.datasets[0], prevData.datasets[1], newDatasets, newDatasets2], // Replace the first dataset
      }));
    }
  };

  const handleChange1 = (event: SelectChangeEvent) => {
    setData1(event.target.value as string);
    const newDataset = data.datasets.find(
      (dataset) =>
        dataset.label === event.target.value && dataset.yAxisID === "y"
    );
    if (newDataset) {
      setDisplayData((prevData) => ({
        labels: data.labels,
        datasets: [newDataset, prevData.datasets[1]], // Replace the first dataset
      }));
    }
  };

  const handleChange2 = (event: SelectChangeEvent) => {
    setData2(event.target.value as string);
    const newDataset = data.datasets.find(
      (dataset) =>
        dataset.label === event.target.value && dataset.yAxisID === "y1"
    );
    if (newDataset) {
      setDisplayData((prevData) => ({
        labels: data.labels,
        datasets: [prevData.datasets[0], newDataset], // Replace the second dataset
      }));
    }
  };

  const changePercentagePredi = (percentage: number) => {
    setChangeFactor(percentage);
    const coef = percentage / 100;

    if (!data1 || !data2 || !checked) {
      return;
    }

    const prediDataset1 = data.datasets.find(
      (dataset) => dataset.label === data1 + " Prediction" && dataset.yAxisID === "y"
    );

    const prediDataset2 = data.datasets.find(
      (dataset) => dataset.label === data2 + " Prediction" && dataset.yAxisID === "y1"
    );

    let predi1 = null
    let predi2 = null
    let regression1 = null
    let regression2 = null

    if (prediDataset1?.label.includes("Carbon")) {
      predi1 = carbonPredi;
      regression1 = carbonRegression;
    } else if (prediDataset1?.label.includes("Ph")) {
      predi1 = phPredi;
      regression1 = acidityRegression;
    } else if (prediDataset1?.label.includes("Farenheit")) {
      predi1 = degreePredi;
      regression1 = degreeRegression;
    } else if (prediDataset1?.label.includes("Mollusk")) {
      predi1 = moulePredi;
      regression1 = mouleRegression;
    }

    if (prediDataset2?.label.includes("Ph")) {
      predi2 = phPredi;
      regression2 = acidityRegression;
    } else if (prediDataset2?.label.includes("Carbon")) {
      predi2 = carbonPredi;
      regression2 = carbonRegression;
    } else if (prediDataset2?.label.includes("Farenheit")) {
      predi2 = degreePredi;
      regression2 = degreeRegression;
    } else if (prediDataset2?.label.includes("Mollusk")) {
      predi2 = moulePredi;
      regression2 = mouleRegression;
    }

    const derive = deriveRelation(regression1.equation[0], regression1.equation[1], regression2.equation[0], regression2.equation[1])

    prediDataset1.data = predi1.map((x: number) => x * coef);
    prediDataset2.data = prediDataset1.data.map((x, index) => predi2[index] + ((Math.abs(predi1[index] - x)) * derive.slope));

    setDisplayData(
      (prevData) => ({
        labels: labels2,
        datasets: [prevData.datasets[0], prevData.datasets[1], prediDataset1, prediDataset2],
      }));
  }

  const selectData1 = [
    data.datasets[0].label,
    data.datasets[1].label,
    data.datasets[2].label,
    data.datasets[3].label,
  ];

  const selectData2 = [
    data.datasets[0].label,
    data.datasets[1].label,
    data.datasets[2].label,
    data.datasets[3].label,
  ];

  return (
    <>
      <div className="flex flex-col w-full justify-center gap-3 items-center">
        <div className="wave-container">
          <div class="sun">
          </div>
          <div class="wave-01"></div>
          <div class="wave-02"></div>
          <div class="wave-03"></div>
        </div>
        <div className="water-text flex flex-col justify-center items-center">
          <h2>Repercussion of pollution on the Oceans and its Biodiversity</h2>
          <h2>Repercussion of pollution on the Oceans and its Biodiversity</h2>
          <h1 className="mt-4 text-7xl bg-transparent text-transparent select-none">Repercussion of pollution on the Oceans and its Biodiversity</h1>
        </div>
        <div className="w-11/12 flex flex-row gap-2 justify-center items-center">
          <div className="w-8/12 flex flex-row gap-2 justify-center items-center">
            <div className="w-full bg-red-100 border-2 border-red-200 pt-4 p-2 rounded-lg ">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Graph Data 1</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={data1}
                  label="Data 1"
                  onChange={handleChange1}
                >
                  {selectData1.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="w-full bg-blue-100 border-2 border-blue-200 pt-4 p-2 rounded-lg ">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Graph Data 2</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={data2}
                  label="Data 2"
                  onChange={handleChange2}
                >
                  {selectData2.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-slate-100 rounded-md my-2 p-2 text-sm font-semibold text-slate-700">
            <div className="flex flex-row gap-1 justify-center items-center px-2 pt-1">
              <label className="" htmlFor="percentagePredi">Percentage for Prediction</label>
              <input className=" font-light background-none text-center w-14 rounded" id="percentagePredi" type="number" defaultValue={changeFactor} onChange={(event) => {
                changePercentagePredi(Number(event.target.value));
              }} placeholder="100" min={1} max={1000} />
              %
            </div>
            <div className="flex flex-row justify-center items-center">
              <Checkbox checked={checked} onChange={handleChange} />
              Display predictions
            </div>
          </div>
        </div>
        <div className="w-9/12 border-2 border-gray-200 bg-white p-8 rounded-xl">
          <Line updateMode="resize" options={options} data={displayData} />
        </div>
      </div>
    </>
  );
}
