import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Collatz() {
  const [input, setInput] = useState('');
  const [sequence, setSequence] = useState([]);
  const [logScale, setLogScale] = useState(false);
  const [peaks, setPeaks] = useState([]);

  const generateSequence = (n) => {
    let result = [];
    while (n !== 1) {
      result.push(n);
      n = (n % 2 === 0) ? n / 2 : 3 * n + 1;
    }
    result.push(1);
    setSequence(result);
    findPeaks(result, 5); // find first 5 peaks
  };

  const findPeaks = (arr, limit) => {
    let peaksFound = [];
    for (let i = 1; i < arr.length - 1; i++) {
      if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) {
        peaksFound.push({ index: i, value: arr[i] });
        if (peaksFound.length === limit) break;
      }
    }
    setPeaks(peaksFound);
  };

  const handleSubmit = () => {
    const n = parseInt(input);
    if (!isNaN(n) && n > 0) generateSequence(n);
  };

  const peakMarkers = Array(sequence.length).fill(null);
  peaks.forEach(p => peakMarkers[p.index] = p.value);

  const data = {
    labels: sequence.map((_, i) => i),
    datasets: [
      {
        label: 'Collatz Sequence',
        data: sequence,
        borderColor: '#1e88e5',
        pointRadius: 0,
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Peaks',
        data: peakMarkers,
        pointRadius: 5,
        pointBackgroundColor: 'red',
        showLine: false
      }
    ]
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
        display: false
      },
      title: {
        display: true,
        text: 'Collatz Conjecture with Peak Markers',
        font: { size: 18 }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Step' },
        grid: { color: '#eee' }
      },
      y: {
        type: logScale ? 'logarithmic' : 'linear',
        min: 1,
        title: { display: true, text: logScale ? 'Value (log scale)' : 'Value' },
        grid: { color: '#eee' }
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Collatz Conjecture</h2>
      <p>Enter a number to generate and visualize its Collatz sequence and peak points:</p>
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

      {sequence.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <p>🔺 First {peaks.length} Peaks: {peaks.map(p => `${p.value} (at ${p.index})`).join(', ')}</p>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}
