import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend
);

export default function Collatz() {
  const [input, setInput] = useState('');
  const [sequence, setSequence] = useState([]);
  const [logScale, setLogScale] = useState(false);
  const [showTrend, setShowTrend] = useState(true);
  const [peaks, setPeaks] = useState([]);

  const generateSequence = (n) => {
    let result = [];
    while (n !== 1) {
      result.push(n);
      n = (n % 2 === 0) ? n / 2 : 3 * n + 1;
    }
    result.push(1);
    setSequence(result);
    findGlobalMaxima(result);
  };

  const findGlobalMaxima = (arr) => {
    const peaksFound = [];
    let currentMax = -Infinity;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > currentMax) {
        currentMax = arr[i];
        peaksFound.push({ index: i, value: arr[i] });
      }
    }
    setPeaks(peaksFound);
  };

  const computeMovingAverage = (arr, windowSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(arr.length, i + Math.ceil(windowSize / 2));
      const slice = arr.slice(start, end);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      result.push(avg);
    }
    return result;
  };

  const handleSubmit = () => {
    const n = parseInt(input);
    if (!isNaN(n) && n > 0) generateSequence(n);
  };

  const peakMarkers = Array(sequence.length).fill(null);
  peaks.forEach(p => peakMarkers[p.index] = p.value);

  const trendLine = computeMovingAverage(sequence, 5);

  const datasets = [
    {
      label: 'Collatz Sequence',
      data: sequence,
      borderColor: '#1e88e5',
      pointRadius: 0,
      borderWidth: 2,
      fill: false
    },
    {
      label: 'New Global Maxima',
      data: peakMarkers,
      pointRadius: 5,
      pointBackgroundColor: 'red',
      showLine: false
    }
  ];

  if (showTrend) {
    datasets.push({
      label: 'Trend (Moving Avg)',
      data: trendLine,
      borderColor: 'gray',
      borderDash: [5, 5],
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false
    });
  }

  const data = {
    labels: sequence.map((_, i) => i),
    datasets: datasets
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `Step: ${ctx.dataIndex}, Value: ${ctx.formattedValue}`
        }
      },
      legend: {
        display: true
      },
      title: {
        display: true,
        text: 'Collatz Conjecture with Global Maxima and Trend',
        font: { size: 18 }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Step',
          font: { size: 14 }
        },
        grid: {
          color: '#eee'
        }
      },
      y: {
        type: logScale ? 'logarithmic' : 'linear',
        min: 1,
        title: {
          display: true,
          text: logScale ? 'Value (log scale)' : 'Value',
          font: { size: 14 }
        },
        grid: {
          color: '#eee'
        }
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Collatz Conjecture</h2>
      <p><strong>The Collatz Conjecture</strong> (also known as the 3x + 1 problem) was proposed by Lothar Collatz in 1937. It involves a simple rule: take any positive integer n. If n is even, divide it by 2; if n is odd, multiply it by 3 and add 1. Repeat the process with the resulting number. The conjecture asserts that this sequence will always reach 1, no matter which positive integer you start with.</p>
      <p>This conjecture has fascinated mathematicians for decades due to its deceptively simple definition yet chaotic and unpredictable behavior. Paul Erdős famously remarked, "Mathematics is not yet ready for such problems." Despite extensive computational verification for very large numbers, no general proof or counterexample has been found.</p>

      <p>Use the tool below to explore the Collatz sequence for any number, examine its peaks, and observe the trends.</p>

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="e.g. 27"
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>Plot</button>
      <label style={{ marginLeft: '20px' }}>
        <input
          type="checkbox"
          checked={logScale}
          onChange={() => setLogScale(!logScale)}
        />
        &nbsp;Use log scale
      </label>
      <label style={{ marginLeft: '20px' }}>
        <input
          type="checkbox"
          checked={showTrend}
          onChange={() => setShowTrend(!showTrend)}
        />
        &nbsp;Show trend line
      </label>

      {sequence.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <p>🔺 Global Maxima: {peaks.map(p => `${p.value} (at step ${p.index})`).join(', ')}</p>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}
