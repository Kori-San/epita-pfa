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
import regression from 'regression';

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

const regressionOptions = {
  order: 2,
  precision: 5,
} 

const labels = mergedData.map((x) => x.year);

const carbonLabels = mergedData.map((x) => x.carbon_dioxide_ppm[0]);
const carbonRegressionData = carbonLabels.map(function(element, index) {
  return [Number(labels[index]), element];
});
const carbonRegression = regression.linear(carbonRegressionData, regressionOptions);

const acidityLabels = mergedData.map((x) => x.hawaii_acidity[0].hawaii_ph);
const acidityRegressionData = acidityLabels.map(function(element, index) {
  return [Number(labels[index]), element];
});
const acidityRegression = regression.linear(acidityRegressionData, regressionOptions);

const degreeLabels = mergedData.map((x) => x.global_sea_year_anomaly_farenheit);
const degreeRegressionData = degreeLabels.map(function(element, index) {
  return [Number(labels[index]), element];
});
const degreeRegression = regression.linear(degreeRegressionData, regressionOptions);

const mouleLabels = mergedData.map((x) => x.mollusc_density_square_meter);
const mouleRegressionData = mouleLabels.map(function(element, index) {
  return [Number(labels[index]), element];
});
const mouleRegression = regression.linear(mouleRegressionData, regressionOptions);

const labels2 =  [...labels, ...labels.map((x) => String(Number(x) + 30))];

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
      label: "Molusk (density per square/meter)",
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
      label: "Molusk",
      data: mouleLabels,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
      tension: 0.4
    },
    {
      label: "Molusk (density per square/meter)",
      data: mouleLabels,
      borderColor: "rgb(242, 142, 234)",
      backgroundColor: "rgba(242, 142, 234, 0.5)",
      yAxisID: "y1",
      tension: 0.4
    },    
    {
      label: "Molusk (density per square/meter) Prediction",
      data: moulePredi,
      borderColor: "rgb(242, 142, 234)",
      backgroundColor: "rgba(242, 142, 234, 0.5)",
      yAxisID: "y",
      borderDash: [1, 1],
    },
    {
      label: "Molusk (density per square/meter) Prediction",
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

console.log(data.datasets.find(
        (dataset) =>
          dataset.label === "Ph Prediction"
      ).data = phPredi.map(x => x / 2));
  
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
    <div className="flex flex-col w-full justify-center items-center">
      <div className="mt-8 w-11/12 flex flex-col justify-center items-center">
        <div className="w-full flex flex-row gap-2 justify-center items-center">
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
        <div>
          <Checkbox checked={checked} onChange={handleChange} />
          Display predictions
        </div>
        </div>
      <div className="w-10/12">
        <Line options={options} data={displayData} />
      </div>
    </div>
    </>
  );
}
