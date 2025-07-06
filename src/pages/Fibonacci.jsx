import React, { useState, useRef, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './Fibonacci.css';

function generateFibonacci(n) {
  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i-1] + sequence[i-2]);
  }
  return sequence;
}

function generateGoldenRatioConvergence(n) {
  const fib = generateFibonacci(n);
  const ratios = [];
  
  for (let i = 2; i < fib.length; i++) {
    const ratio = fib[i] / fib[i-1];
    ratios.push({ n: i, ratio, error: Math.abs(ratio - 1.618033988749) });
  }
  
  return ratios;
}

function generateFibonacciSpiral(turns = 8) {
  const fib = generateFibonacci(turns + 2);
  const points = [];
  let x = 0, y = 0;
  let direction = 0; // 0: right, 1: up, 2: left, 3: down
  
  for (let i = 0; i < turns; i++) {
    const size = fib[i + 2];
    const steps = Math.max(20, size * 2);
    
    for (let j = 0; j <= steps; j++) {
      const t = j / steps;
      const angle = (Math.PI / 2) * t + (Math.PI / 2) * direction;
      const radius = size * t;
      
      points.push({
        x: x + radius * Math.cos(angle),
        y: y + radius * Math.sin(angle),
        turn: i,
        size: size
      });
    }
    
    // Move to next square position
    switch (direction) {
      case 0: // right
        x += size;
        y += size;
        break;
      case 1: // up
        x -= size;
        y += size;
        break;
      case 2: // left
        x -= size;
        y -= size;
        break;
      case 3: // down
        x += size;
        y -= size;
        break;
    }
    
    direction = (direction + 1) % 4;
  }
  
  return points;
}

function generatePhyllotaxisPattern(n = 500, angle = 137.5) {
  const points = [];
  const goldenAngle = 137.507764; // degrees
  const usedAngle = angle || goldenAngle;
  
  for (let i = 0; i < n; i++) {
    const theta = (usedAngle * i) * (Math.PI / 180);
    const r = Math.sqrt(i);
    
    points.push({
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
      i: i,
      angle: usedAngle
    });
  }
  
  return points;
}

function generateFibonacciMatrix(n) {
  // Generate matrix powers to show Fibonacci relationships
  const matrices = [];
  let a = 1, b = 1, c = 1, d = 0; // Start with [[1,1],[1,0]]
  
  for (let i = 1; i <= n; i++) {
    matrices.push({
      power: i,
      a, b, c, d,
      fib_n: b,
      fib_n_plus_1: a
    });
    
    // Matrix multiplication: [[1,1],[1,0]]^i * [[1,1],[1,0]]
    const newA = a + c;
    const newB = b + d;
    const newC = a;
    const newD = b;
    
    a = newA;
    b = newB;
    c = newC;
    d = newD;
  }
  
  return matrices;
}

export default function Fibonacci() {
  const [fibCount, setFibCount] = useState(20);
  const [spiralTurns, setSpiralTurns] = useState(8);
  const [phyllotaxisCount, setPhyllotaxisCount] = useState(300);
  const [phyllotaxisAngle, setPhyllotaxisAngle] = useState(137.5);
  const [showPhyllotaxis, setShowPhyllotaxis] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const handleFibCountChange = (e) => {
    const value = Math.max(3, Math.min(50, parseInt(e.target.value) || 20));
    setFibCount(value);
  };

  const handleAngleChange = (e) => {
    setPhyllotaxisAngle(parseFloat(e.target.value));
  };

  // Generate data
  const fibSequence = generateFibonacci(fibCount);
  const goldenRatios = generateGoldenRatioConvergence(fibCount);
  const spiralPoints = generateFibonacciSpiral(spiralTurns);
  const phyllotaxisPoints = generatePhyllotaxisPattern(phyllotaxisCount, phyllotaxisAngle);
  const fibMatrices = showMatrix ? generateFibonacciMatrix(Math.min(fibCount, 15)) : [];

  // Chart data for Fibonacci sequence
  const fibData = [{
    type: 'bar',
    x: fibSequence.map((_, i) => i),
    y: fibSequence,
    marker: {
      color: fibSequence.map((_, i) => `hsl(${(i * 30) % 360}, 70%, 60%)`),
      line: { width: 1, color: '#333' }
    },
    name: 'Fibonacci Numbers'
  }];

  const fibLayout = {
    autosize: true,
    margin: { l: 60, r: 30, t: 30, b: 60 },
    xaxis: { title: 'n' },
    yaxis: { title: 'F(n)', type: 'log' },
    showlegend: false
  };

  // Golden ratio convergence
  const ratioData = [{
    type: 'scatter',
    mode: 'lines+markers',
    x: goldenRatios.map(r => r.n),
    y: goldenRatios.map(r => r.ratio),
    line: { color: '#f39c12', width: 3 },
    marker: { size: 6 },
    name: 'F(n)/F(n-1)'
  }, {
    type: 'scatter',
    mode: 'lines',
    x: [2, fibCount],
    y: [1.618033988749, 1.618033988749],
    line: { color: '#e74c3c', width: 2, dash: 'dash' },
    name: 'φ = 1.618...'
  }];

  const ratioLayout = {
    autosize: true,
    margin: { l: 60, r: 30, t: 30, b: 60 },
    xaxis: { title: 'n' },
    yaxis: { title: 'Ratio F(n)/F(n-1)' },
    showlegend: false
  };

  // Fibonacci spiral
  const spiralData = [{
    type: 'scatter',
    mode: 'lines',
    x: spiralPoints.map(p => p.x),
    y: spiralPoints.map(p => p.y),
    line: {
      color: spiralPoints.map(p => p.turn),
      colorscale: 'Viridis',
      width: 4
    },
    name: 'Fibonacci Spiral'
  }];

  const spiralLayout = {
    autosize: true,
    margin: { l: 30, r: 30, t: 30, b: 30 },
    xaxis: { title: '', showgrid: false, zeroline: false, showticklabels: false },
    yaxis: { title: '', showgrid: false, zeroline: false, showticklabels: false },
    showlegend: false,
    aspectratio: { x: 1, y: 1 }
  };

  // Phyllotaxis pattern
  const phyllotaxisData = [{
    type: 'scatter',
    mode: 'markers',
    x: phyllotaxisPoints.map(p => p.x),
    y: phyllotaxisPoints.map(p => p.y),
    marker: {
      size: phyllotaxisPoints.map(p => Math.max(3, 8 - p.i/100)),
      color: phyllotaxisPoints.map(p => p.i),
      colorscale: 'Viridis',
      opacity: 0.8
    },
    name: `Phyllotaxis (${phyllotaxisAngle.toFixed(1)}°)`
  }];

  const phyllotaxisLayout = {
    autosize: true,
    margin: { l: 30, r: 30, t: 30, b: 30 },
    xaxis: { title: '', showgrid: false, zeroline: false, showticklabels: false },
    yaxis: { title: '', showgrid: false, zeroline: false, showticklabels: false },
    showlegend: false,
    aspectratio: { x: 1, y: 1 }
  };

  return (
    <div className="fibonacci-container">
      <div className="fibonacci-content">
        <div className="header-section">
          <h2>Fibonacci & Golden Ratio</h2>
          
          <div className="compact-input-group">
            <input
              type="number"
              value={fibCount}
              onChange={handleFibCountChange}
              placeholder="Count"
              min="3"
              max="50"
              className="compact-input"
            />
            {showPhyllotaxis && (
              <input
                type="range"
                min="120"
                max="150"
                step="0.1"
                value={phyllotaxisAngle}
                onChange={handleAngleChange}
                className="compact-slider"
              />
            )}
            {showPhyllotaxis && (
              <span className="angle-value">{phyllotaxisAngle.toFixed(1)}°</span>
            )}
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={showPhyllotaxis}
                onChange={(e) => setShowPhyllotaxis(e.target.checked)}
              />
              Nature
            </label>
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={showMatrix}
                onChange={(e) => setShowMatrix(e.target.checked)}
              />
              Matrix
            </label>
          </div>
        </div>

        <div className="visualization-grid">
          {/* Fibonacci sequence */}
          <div className="chart-section">
            <h3>Fibonacci Sequence</h3>
            <Plot
              data={fibData}
              layout={fibLayout}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '250px' }}
            />
          </div>

          {/* Golden ratio convergence */}
          <div className="chart-section">
            <h3>Golden Ratio Convergence</h3>
            <Plot
              data={ratioData}
              layout={ratioLayout}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '250px' }}
            />
          </div>

          {/* Fibonacci spiral or Phyllotaxis */}
          <div className="chart-section">
            <h3>{showPhyllotaxis ? 'Phyllotaxis Pattern' : 'Fibonacci Spiral'}</h3>
            <Plot
              data={showPhyllotaxis ? phyllotaxisData : spiralData}
              layout={showPhyllotaxis ? phyllotaxisLayout : spiralLayout}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '350px' }}
            />
          </div>
        </div>

        {/* Matrix representation */}
        {showMatrix && fibMatrices.length > 0 && (
          <div className="matrix-section">
            <h3>Matrix Powers & Fibonacci</h3>
            <div className="matrix-grid">
              {fibMatrices.slice(0, 8).map((matrix, i) => (
                <div key={i} className="matrix-item">
                  <div className="matrix-power">[[1,1],[1,0]]^{matrix.power}</div>
                  <div className="matrix-result">
                    [[{matrix.a},{matrix.b}],[{matrix.c},{matrix.d}]]
                  </div>
                  <div className="matrix-fib">F({matrix.power}) = {matrix.fib_n}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="fibonacci-description">
          <p>
            <strong>Sequence:</strong> F({fibCount-1}) = {fibSequence[fibCount-1]?.toLocaleString()}<br />
            <strong>Golden Ratio:</strong> φ ≈ {goldenRatios[goldenRatios.length-1]?.ratio.toFixed(8)}<br />
            <strong>Current angle:</strong> {showPhyllotaxis ? `${phyllotaxisAngle.toFixed(1)}° (optimal: 137.5°)` : 'Fibonacci spiral based on squares'}
          </p>
        </div>

        <div className="fibonacci-info">
          <p>
            <strong>The Fibonacci Sequence</strong> appears throughout nature, from flower petals 
            to spiral galaxies. Each number is the sum of the two preceding ones: F(n) = F(n-1) + F(n-2).
          </p>
          <ul>
            <li><strong>Golden Ratio:</strong> φ = (1 + √5)/2 ≈ 1.618033988749...</li>
            <li><strong>Spiral:</strong> Constructed from squares with Fibonacci side lengths</li>
            <li><strong>Phyllotaxis:</strong> Plant leaf arrangement using golden angle ≈ 137.5°</li>
            <li><strong>Matrix Form:</strong> [[F(n+1),F(n)],[F(n),F(n-1)]] = [[1,1],[1,0]]^n</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
