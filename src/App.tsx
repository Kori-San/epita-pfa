import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
import mergedData from '../export/dist/export-2024-03-25_13-03-12-714847546/merged_data.json';

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
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart - Multi Axis',
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

/*
const labelsArray = mergedData.map((x) => x.hawaii_acidity.map((y) => y.hawaii_decimal_year));
let labels: any[] = [];
labelsArray.forEach(array =>{
  labels = labels.concat(array)
})

const carbonArray = mergedData.map((x) => x.hawaii_acidity.map((y) => y.hawaii_carbon_dioxide));
let carbonLabels: any[] = [];
carbonArray.forEach(array =>{
  carbonLabels = carbonLabels.concat(array)
})

const acidityArray = mergedData.map((x) => x.hawaii_acidity.map((y) => y.hawaii_ph));
let acidityLabels: any[] = [];
acidityArray.forEach(array =>{
  acidityLabels = acidityLabels.concat(array)
})
*/

const labels = mergedData.map((x) => x.year);

const carbonLabels = mergedData.map((x) => x.carbon_dioxide_ppm[0]);

const acidityLabels = mergedData.map((x) => x.hawaii_acidity[0].hawaii_ph);


export const data = {
  labels,
  datasets: [
    {
      label: 'Carbon Dioxidre (ppm)',
      data: carbonLabels,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      yAxisID: 'y',
    },
    {
      label: 'Ph',
      data: acidityLabels,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      yAxisID: 'y1',
    },
  ],
};

export default function App() {
  return <Line options={options} data={data} />;
}
