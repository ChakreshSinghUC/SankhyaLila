import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Riemann.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function riemannZetaZeros(limit = 20) {
  // First few non-trivial zeros of the Riemann zeta function (imaginary parts)
  const zeros = [
    14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
    37.586178, 40.918719, 43.327073, 48.005151, 49.773832,
    52.970321, 56.446247, 59.347044, 60.831778, 65.112544,
    67.079810, 69.546401, 72.067158, 75.704690, 77.144840
  ];
  
  return zeros.slice(0, limit).map((im, index) => ({
    x: 0.5, // Critical line Re(s) = 1/2
    y: im,
    label: `Zero ${index + 1}: 1/2 + ${im.toFixed(6)}i`
  }));
}

function criticalLinePoints(count = 100) {
  const points = [];
  for (let i = 0; i <= count; i++) {
    const t = (i / count) * 80; // Up to imaginary part 80
    points.push({
      x: 0.5,
      y: t
    });
  }
  return points;
}

function generateRiemannSurface(gridSize = 30) {
  // Generate a 3D surface showing |ζ(s)| in the critical strip
  const x = []; // Real part
  const y = []; // Imaginary part  
  const z = []; // |ζ(s)|
  
  for (let i = 0; i <= gridSize; i++) {
    const xRow = [];
    const yRow = [];
    const zRow = [];
    
    for (let j = 0; j <= gridSize; j++) {
      const re = 0.1 + (i / gridSize) * 0.8; // 0.1 to 0.9
      const im = (j / gridSize) * 30; // 0 to 30
      
      // Simplified approximation of |ζ(s)| magnitude
      let magnitude = 1;
      if (re < 0.5) {
        magnitude = Math.exp(-(0.5 - re) * 5) * (1 + Math.sin(im * 0.5) * 0.3);
      } else {
        magnitude = Math.exp(-(re - 0.5) * 2) * (1 + Math.sin(im * 0.3) * 0.2);
      }
      
      // Add some oscillation around zeros
      const zeroInfluence = riemannZetaZeros(20).reduce((acc, zero) => {
        const dist = Math.abs(im - zero.y);
        if (dist < 2 && Math.abs(re - 0.5) < 0.1) {
          return acc * Math.exp(-1 / (dist + 0.1));
        }
        return acc;
      }, 1);
      
      magnitude *= zeroInfluence;
      
      xRow.push(re);
      yRow.push(im);
      zRow.push(Math.max(0, magnitude));
    }
    
    x.push(xRow);
    y.push(yRow);
    z.push(zRow);
  }
  
  return { x, y, z };
}

export default function Riemann() {
  const [input, setInput] = useState('10');
  const [zeros, setZeros] = useState([]);
  const [showCriticalLine, setShowCriticalLine] = useState(true);
  const [view3D, setView3D] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    const n = parseInt(value);
    if (n > 0 && n <= 20 && !isNaN(n)) {
      const zeroPoints = riemannZetaZeros(n);
      setZeros(zeroPoints);
    } else {
      setZeros([]);
    }
  };

  React.useEffect(() => {
    const zeroPoints = riemannZetaZeros(10);
    setZeros(zeroPoints);
  }, []);

  const datasets = [];
  
  if (showCriticalLine) {
    datasets.push({
      label: 'Critical Line (Re = 1/2)',
      data: criticalLinePoints(),
      backgroundColor: 'rgba(200, 200, 200, 0.3)',
      borderColor: 'rgba(150, 150, 150, 0.8)',
      pointRadius: 1,
      showLine: true,
      tension: 0
    });
  }

  if (zeros.length > 0) {
    datasets.push({
      label: 'Riemann Zeta Zeros',
      data: zeros,
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointRadius: 6,
      pointHoverRadius: 8
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'point',
      intersect: false
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const point = zeros[ctx.dataIndex];
            return point ? point.label : `(${ctx.parsed.x}, ${ctx.parsed.y})`;
          }
        }
      },
      legend: {
        display: true,
        labels: {
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Riemann Hypothesis Visualization',
        font: { size: 14 }
      }
    },
    scales: {
      x: {
        min: 0,
        max: 1,
        beginAtZero: true,
        ticks: {
          font: { size: 10 }
        },
        title: {
          display: true,
          text: 'Real Part',
          font: { size: 11 }
        },
        grid: { 
          color: '#eee',
          display: true
        }
      },
      y: {
        min: 0,
        beginAtZero: true,
        ticks: {
          font: { size: 10 }
        },
        title: {
          display: true,
          text: 'Imaginary Part',
          font: { size: 11 }
        },
        grid: { 
          color: '#eee',
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
    datasets: datasets
  };

  // 3D surface data for Plotly
  const riemannSurface = generateRiemannSurface(25);
  const plot3DData = [
    {
      type: 'surface',
      x: riemannSurface.x,
      y: riemannSurface.y,
      z: riemannSurface.z,
      colorscale: 'Viridis',
      showscale: true,
      opacity: 0.8,
      name: '|ζ(s)|'
    },
    // Add zeros as scatter points
    {
      type: 'scatter3d',
      mode: 'markers',
      x: zeros.map(() => 0.5),
      y: zeros.map(z => z.y),
      z: zeros.map(() => 0),
      marker: {
        size: 8,
        color: 'red',
        symbol: 'circle'
      },
      name: 'Zeros',
      hovertemplate: 'Zero: %{y:.3f}i<extra></extra>'
    }
  ];

  const plot3DLayout = {
    autosize: true,
    margin: { l: 0, r: 0, t: 30, b: 0 },
    scene: {
      xaxis: { 
        title: 'Real Part',
        range: [0.1, 0.9]
      },
      yaxis: { 
        title: 'Imaginary Part',
        range: [0, 30]
      },
      zaxis: { 
        title: '|ζ(s)|',
        range: [0, 3]
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.2 }
      }
    },
    showlegend: false
  };

  return (
    <div className="riemann-container">
      <div className="riemann-content">
        <div className="header-section">
          <h2>Riemann Hypothesis</h2>
          
          <div className="compact-input-group">
            <input
              type="number"
              value={input}
              onChange={handleInputChange}
              placeholder="Zeros count"
              min="1"
              max="20"
              className="compact-input"
            />
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={showCriticalLine}
                onChange={(e) => setShowCriticalLine(e.target.checked)}
              />
              Line
            </label>
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={view3D}
                onChange={(e) => setView3D(e.target.checked)}
              />
              3D
            </label>
          </div>
        </div>

        {zeros.length > 0 && (
          <>
            <div className="chart-wrapper">
              {view3D ? (
                <Plot
                  data={plot3DData}
                  layout={plot3DLayout}
                  config={{
                    displayModeBar: false,
                    responsive: true
                  }}
                  style={{ width: '100%', height: '400px' }}
                />
              ) : (
                <Scatter data={data} options={options} />
              )}
            </div>
            <div className="riemann-description">
              <p>
                <strong>Zeros displayed:</strong> {zeros.length}<br />
                <strong>All zeros shown are on the critical line:</strong> Re(s) = 1/2<br />
                <strong>Pattern:</strong> {view3D ? 
                  'The 3D surface shows |ζ(s)| magnitude with zeros as valleys' : 
                  'The zeros appear to follow a mysterious distribution'
                }
              </p>
            </div>
          </>
        )}

        <div className="riemann-info">
          <p>
            <strong>The Riemann Hypothesis</strong> states that all non-trivial zeros of the 
            Riemann zeta function have real part equal to 1/2. This is one of the most 
            important unsolved problems in mathematics.
          </p>
          <ul>
            <li>The critical line is where Re(s) = 1/2</li>
            <li>All computed zeros lie exactly on this line</li>
            <li>The hypothesis has been verified for the first 10 trillion zeros</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
