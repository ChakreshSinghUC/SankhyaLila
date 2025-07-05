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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Collatz Conjecture</h2>
      <p>Enter a number to explore its Collatz sequence:</p>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>Plot</button>

      {sequence.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <Line
            data={{
              labels: sequence.map((_, i) => i),
              datasets: [{
                label: 'Collatz Sequence',
                data: sequence,
                borderColor: '#1e88e5',
                pointRadius: 0,
                borderWidth: 2,
                fill: false
              }]
            }}
            options={{
              responsive: true,
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
