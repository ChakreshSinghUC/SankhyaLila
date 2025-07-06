import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Plot from 'react-plotly.js';
import * as THREE from 'three';
import './ChaosTheory.css';

// Lorenz attractor parameters
const SIGMA = 10;
const RHO = 28;
const BETA = 8/3;

function generateLorenzAttractor(steps = 5000, dt = 0.01, x0 = 1, y0 = 1, z0 = 1) {
  const points = [];
  let x = x0, y = y0, z = z0;
  
  for (let i = 0; i < steps; i++) {
    const dx = SIGMA * (y - x);
    const dy = x * (RHO - z) - y;
    const dz = x * y - BETA * z;
    
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    
    points.push({ x, y, z, t: i * dt });
  }
  
  return points;
}

function generateLogisticMap(r, x0 = 0.5, iterations = 1000) {
  const points = [];
  let x = x0;
  
  for (let i = 0; i < iterations; i++) {
    points.push({ n: i, x: x, r: r });
    x = r * x * (1 - x);
  }
  
  return points;
}

function generateBifurcationDiagram(rMin = 2.5, rMax = 4.0, steps = 1000, iterations = 300, skipTransient = 200) {
  const points = [];
  
  for (let i = 0; i <= steps; i++) {
    const r = rMin + (i / steps) * (rMax - rMin);
    let x = 0.5; // Initial condition
    
    // Skip transient behavior
    for (let j = 0; j < skipTransient; j++) {
      x = r * x * (1 - x);
    }
    
    // Collect steady-state values
    for (let j = 0; j < iterations - skipTransient; j++) {
      x = r * x * (1 - x);
      points.push({ r, x });
    }
  }
  
  return points;
}

// 3D Lorenz Attractor Component
function LorenzAttractor3D({ points, colorByTime = true }) {
  const lineRef = useRef();
  
  useEffect(() => {
    if (lineRef.current && points.length > 0) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(points.length * 3);
      const colors = new Float32Array(points.length * 3);
      
      points.forEach((point, i) => {
        positions[i * 3] = point.x * 0.1;     // Scale down for better viewing
        positions[i * 3 + 1] = point.y * 0.1;
        positions[i * 3 + 2] = point.z * 0.1;
        
        if (colorByTime) {
          const t = i / points.length;
          colors[i * 3] = 1 - t;     // Red component
          colors[i * 3 + 1] = t;     // Green component
          colors[i * 3 + 2] = 0.5;   // Blue component
        } else {
          colors[i * 3] = 0.2;
          colors[i * 3 + 1] = 0.8;
          colors[i * 3 + 2] = 1;
        }
      });
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      lineRef.current.geometry = geometry;
    }
  }, [points, colorByTime]);
  
  return (
    <line ref={lineRef}>
      <lineBasicMaterial vertexColors transparent opacity={0.8} linewidth={2} />
    </line>
  );
}

export default function ChaosTheory() {
  const [view3D, setView3D] = useState(true);
  const [showBifurcation, setShowBifurcation] = useState(false);
  const [rValue, setRValue] = useState(3.7);
  const [sensitivity, setSensitivity] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRChange = (e) => {
    setRValue(parseFloat(e.target.value));
  };

  // Generate data
  const lorenzPoints = generateLorenzAttractor(3000, 0.01);
  const logisticPoints = generateLogisticMap(rValue, 0.5, 500);
  const bifurcationPoints = showBifurcation ? generateBifurcationDiagram(2.5, 4.0, 800, 200) : [];
  
  // Sensitivity analysis - two trajectories with slightly different initial conditions
  const lorenzPoints2 = sensitivity ? generateLorenzAttractor(3000, 0.01, 1.001, 1.001, 1.001) : [];

  // 3D Plotly data for Lorenz attractor
  const lorenz3DData = [
    {
      type: 'scatter3d',
      mode: 'lines',
      x: lorenzPoints.map(p => p.x),
      y: lorenzPoints.map(p => p.y),
      z: lorenzPoints.map(p => p.z),
      line: {
        color: lorenzPoints.map((_, i) => i),
        colorscale: 'Viridis',
        width: 3
      },
      name: 'Lorenz Attractor'
    }
  ];

  if (sensitivity && lorenzPoints2.length > 0) {
    lorenz3DData.push({
      type: 'scatter3d',
      mode: 'lines',
      x: lorenzPoints2.map(p => p.x),
      y: lorenzPoints2.map(p => p.y),
      z: lorenzPoints2.map(p => p.z),
      line: {
        color: 'red',
        width: 3
      },
      name: 'Sensitive Trajectory'
    });
  }

  const plot3DLayout = {
    autosize: true,
    margin: { l: 0, r: 0, t: 30, b: 0 },
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.2 }
      }
    },
    showlegend: false
  };

  // 2D Bifurcation diagram data
  const bifurcationData = [{
    type: 'scattergl',
    mode: 'markers',
    x: bifurcationPoints.map(p => p.r),
    y: bifurcationPoints.map(p => p.x),
    marker: {
      size: 1,
      color: 'blue',
      opacity: 0.6
    },
    name: 'Bifurcation Diagram'
  }];

  const bifurcationLayout = {
    autosize: true,
    margin: { l: 50, r: 50, t: 30, b: 50 },
    xaxis: { title: 'Parameter r' },
    yaxis: { title: 'Population x' },
    showlegend: false
  };

  // Logistic map time series
  const logisticData = [{
    type: 'scatter',
    mode: 'lines+markers',
    x: logisticPoints.map(p => p.n),
    y: logisticPoints.map(p => p.x),
    line: { color: '#e74c3c', width: 2 },
    marker: { size: 4 },
    name: `Logistic Map (r=${rValue})`
  }];

  const logisticLayout = {
    autosize: true,
    margin: { l: 50, r: 50, t: 30, b: 50 },
    xaxis: { title: 'Iteration n' },
    yaxis: { title: 'Population x' },
    showlegend: false
  };

  return (
    <div className="chaos-container">
      <div className="chaos-content">
        <div className="header-section">
          <h2>Chaos Theory & Strange Attractors</h2>
          
          <div className="compact-input-group">
            <input
              type="range"
              min="2.5"
              max="4.0"
              step="0.01"
              value={rValue}
              onChange={handleRChange}
              className="compact-slider"
            />
            <span className="r-value">r={rValue}</span>
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={view3D}
                onChange={(e) => setView3D(e.target.checked)}
              />
              3D
            </label>
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={showBifurcation}
                onChange={(e) => setShowBifurcation(e.target.checked)}
              />
              Bifurcation
            </label>
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={sensitivity}
                onChange={(e) => setSensitivity(e.target.checked)}
              />
              Sensitive
            </label>
          </div>
        </div>

        <div className="visualization-grid">
          {/* Main 3D/2D Lorenz Visualization */}
          <div className="main-viz">
            {view3D ? (
              <div style={{ height: '400px', width: '100%' }}>
                <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[10, 10, 10]} intensity={0.8} />
                  <OrbitControls enableZoom={true} enablePan={true} />
                  <LorenzAttractor3D points={lorenzPoints} />
                  {sensitivity && <LorenzAttractor3D points={lorenzPoints2} colorByTime={false} />}
                </Canvas>
              </div>
            ) : showBifurcation ? (
              <Plot
                data={bifurcationData}
                layout={bifurcationLayout}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%', height: '400px' }}
              />
            ) : (
              <Plot
                data={lorenz3DData}
                layout={plot3DLayout}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%', height: '400px' }}
              />
            )}
          </div>

          {/* Logistic Map Time Series */}
          {!showBifurcation && (
            <div className="secondary-viz">
              <Plot
                data={logisticData}
                layout={logisticLayout}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%', height: '200px' }}
              />
            </div>
          )}
        </div>

        <div className="chaos-description">
          <p>
            <strong>Current state:</strong> {
              showBifurcation ? 
                'Bifurcation diagram showing the onset of chaos' :
                `Lorenz attractor ${view3D ? '(3D)' : '(2D projection)'} with logistic map r=${rValue}`
            }<br />
            <strong>Behavior:</strong> {
              rValue < 3 ? 'Stable fixed point' :
              rValue < 1 + Math.sqrt(6) ? 'Periodic oscillation' :
              rValue < 3.57 ? 'Period-doubling cascade' :
              'Chaotic dynamics'
            }<br />
            {sensitivity && (
              <>
                <br />
                <strong>Sensitivity:</strong> Two trajectories with tiny initial difference (0.001) diverge exponentially
              </>
            )}
          </p>
        </div>

        <div className="chaos-info">
          <p>
            <strong>Chaos Theory</strong> studies deterministic systems that exhibit highly sensitive 
            dependence on initial conditions - the famous "butterfly effect." The Lorenz attractor 
            and logistic map are classic examples showing how simple equations can produce complex, 
            unpredictable behavior.
          </p>
          <ul>
            <li><strong>Lorenz System:</strong> dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz</li>
            <li><strong>Logistic Map:</strong> x₍ₙ₊₁₎ = rx₍ₙ₎(1-x₍ₙ₎)</li>
            <li><strong>Strange Attractor:</strong> Bounded set with fractal structure</li>
            <li><strong>Bifurcation:</strong> Qualitative change in dynamics as parameters vary</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
