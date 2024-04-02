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
import mergedData from "../export/dist/export-2024-03-25_13-03-12-714847546/merged_data.json";
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
      display: true,
      text: "Chart.js Line Chart - Multi Axis",
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

const labels = mergedData.map((x) => x.year);

const carbonLabels = mergedData.map((x) => x.carbon_dioxide_ppm[0]);

const acidityLabels = mergedData.map((x) => x.hawaii_acidity[0].hawaii_ph);

const degreeLabels = mergedData.map((x) => x.global_sea_year_anomaly_farenheit);

const labels2 =  [...labels, ...labels.map((x) => String(Number(x) + 30))];

const farenheit = (x: string) => (171 / 7250) * Number(x) - 135579 / 2900;
const ph = (x: string) => -(1 / 725) * Number(x) + 31471 / 2900;
const carbon = (x: string) => (1391 / 725) * Number(x) - 2008997 / 580;

const degreePredi = labels2.map((x: string) => farenheit(x));
const phPredi = labels2.map((x: string) => ph(x));
const carbonPredi = labels2.map((x: string) => carbon(x));


export const data = {
  labels,
  datasets: [
    {
      label: "Carbon Dioxidre (ppm)",
      data: carbonLabels,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Farenheit",
      data: degreeLabels,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Ph",
      data: acidityLabels,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Carbon Dioxidre (ppm)",
      data: carbonLabels,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y1",
    },
    {
      label: "Ph",
      data: acidityLabels,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
    },
    {
      label: "Farenheit",
      data: degreeLabels,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
    },
    {
      label: "Farenheit Prediction",
      data: degreePredi,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Farenheit Prediction",
      data: degreePredi,
      borderColor: "rgb(10, 50, 150)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
    },
    
    {
      label: "Ph Prediction",
      data: phPredi,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Ph Prediction",
      data: phPredi,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
    },
    {
      label: "Carbon Dioxidre (ppm) Prediction",
      data: carbonPredi,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Carbon Dioxidre (ppm) Prediction",
      data: carbonPredi,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y1",
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
      let newDatasets = data.datasets.find(
        (dataset) =>
          dataset.label === displayData.datasets[0].label + " Prediction" && dataset.yAxisID === displayData.datasets[0].yAxisID
      );

      let newDatasets2 = data.datasets.find(
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

  const selectData1 = [
    data.datasets[0].label,
    data.datasets[1].label,
    data.datasets[2].label,
  ];
  const selectData2 = [
    data.datasets[0].label,
    data.datasets[1].label,
    data.datasets[2].label,
  ];
  return (
    <>
      <Box sx={{ minWidth: 120 }}>
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
        <Checkbox checked={checked} onChange={handleChange} />
        Display predictions
      </Box>
      <Line options={options} data={displayData} />
    </>
  );
}
