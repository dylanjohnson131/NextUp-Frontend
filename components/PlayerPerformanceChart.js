import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PlayerPerformanceChart = ({ data }) => {
  // data: [{ label: 'Game 1', grade: 75 }, { label: 'Game 2', grade: 80 }, ...]
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Progression Grade',
        data: data.map(d => d.grade),
        fill: false,
        borderColor: '#06b6d4',
        backgroundColor: '#06b6d4',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#06b6d4',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Recent Performance',
        color: '#fff',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Grade: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' },
        title: {
          display: true,
          text: 'Grade',
          color: '#fff',
        },
      },
    },
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PlayerPerformanceChart;
