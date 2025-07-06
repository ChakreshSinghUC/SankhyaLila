import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Collatz.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function generateCollatzSequence(n) {
  const sequence = [n];
  while (n !== 1) {
    if (n % 2 === 0) {
      n = n / 2;
    } else {
      n = 3 * n + 1;
    }
    sequence.push(n);
  }
  return sequence;
}

export default function Collatz() {
  const [input, setInput] = useState('');
  const [sequence, setSequence] = useState([]);
  const [logScale, setLogScale] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    // Auto-generate sequence if input is a valid positive number
    const n = parseInt(value);
    if (n > 0 && !isNaN(n)) {
      const seq = generateCollatzSequence(n);
      setSequence(seq);
    } else {
      setSequence([]);
    }
  };

  const handleSubmit = () => {
    const n = parseInt(input);
    if (n > 0) {
      const seq = generateCollatzSequence(n);
      setSequence(seq);
    } else {
      setSequence([]);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#2c3e50',
        bodyColor: '#2c3e50',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `Step: ${ctx.dataIndex}, Value: ${ctx.formattedValue}`
        }
      },
      legend: {
        display: true,
        labels: {
          font: { size: 12 },
          color: '#2c3e50'
        }
      },
      title: {
        display: true,
        text: 'Collatz Conjecture',
        font: { size: 14 },
        color: '#2c3e50'
      }
    },
    scales: {
      x: {
        min: 0,
        beginAtZero: true,
        suggestedMin: 0,
        ticks: { 
          precision: 0,
          font: { size: 10 },
          callback: function(value) {
            // Ensure no negative values are displayed
            return value < 0 ? '' : value;
          }
        },
        title: {
          display: true,
          text: 'Step',
          font: { size: 11 }
        },
        grid: { 
          color: '#e2e8f0',
          display: true
        }
      },
      y: {
        type: logScale ? 'logarithmic' : 'linear',
        min: logScale ? 1 : 0,
        beginAtZero: !logScale,
        suggestedMin: 0,
        ticks: {
          font: { size: 10 },
          callback: function(value) {
            // Ensure no negative values are displayed
            return value < 0 ? '' : value;
          }
        },
        title: {
          display: true,
          text: logScale ? 'Value (log)' : 'Value',
          font: { size: 11 }
        },
        grid: { 
          color: '#e2e8f0',
          display: true
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }
  };

  const data = {
    labels: sequence.map((_, index) => index),
    datasets: [
      {
        label: `Collatz sequence for ${input}`,
        data: sequence,
        borderColor: '#1e88e5',
        backgroundColor: 'rgba(30, 136, 229, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: '#1e88e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  return (
    <div className="collatz-container">
      <div className="collatz-content">
        <div className="header-section">
          <h2>Collatz Conjecture</h2>
          
          {/* Compact Input Controls - Top Right */}
          <div className="compact-input-group">
            <input
              type="number"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter number"
              min="1"
              className="compact-input"
            />
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={logScale}
                onChange={(e) => setLogScale(e.target.checked)}
              />
              Log
            </label>
          </div>
        </div>

        {/* Chart Section - Shows immediately when data is available */}
        {sequence.length > 0 && (
          <>
            <div className="chart-wrapper">
              <Line data={data} options={options} />
            </div>
            <div className="collatz-description">
              <p>
                <strong>Sequence length:</strong> {sequence.length} steps<br />
                <strong>Highest value:</strong> {Math.max(...sequence)}<br />
                <strong>Starting value:</strong> {sequence[0]} → ... → <strong>Final value:</strong> {sequence[sequence.length - 1]}
              </p>
            </div>
          </>
        )}

        {/* Background Information - Last */}
        <div className="collatz-info">
          <p>
            <strong>The Collatz Conjecture</strong> states that no matter what positive integer you start with,
            following these rules will always eventually reach 1:
          </p>
          <ul>
            <li>If the number is even, divide it by 2</li>
            <li>If the number is odd, multiply by 3 and add 1</li>
          </ul>
        </div>
      </div>
    </div>
  );
}