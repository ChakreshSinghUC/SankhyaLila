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

  const generateSequence = (n) => {
    let result = [];
    while (n !== 1) {
      result.push(n);
      n = (n % 2 === 0) ? n / 2 : 3 * n + 1;
    }
    result.push(1);
    setSequence(result);
  };

  const handleSubmit = () => {
    const n = parseInt(input);
    if (!isNaN(n) && n > 0) generateSequence(n);
  };

  const maxValue = Math.max(...sequence);
  const maxIndex = sequence.indexOf(maxValue);

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
        label: 'Peak',
        data: Array.from({ length: sequence.length }, (_, i) =>
          i === maxIndex ? maxValue : null
        ),
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
        text: 'Collatz Conjecture Visualization',
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
        title: {
          display: true,
          text: logScale ? 'Value (log scale)' : 'Value',
          font: { size: 14 }
        },
        grid: {
          color: '#eee'
        },
        min: 1
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Collatz Conjecture</h2>
      <p>Enter a number to generate and visualize its Collatz sequence:</p>
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
          <p>
            🔺 Peak value: <strong>{maxValue}</strong> at step {maxIndex}
          </p>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}
