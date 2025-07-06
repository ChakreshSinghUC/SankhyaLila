import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import { Scatter } from 'react-chartjs-2';
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
import * as THREE from 'three';
import './Leech.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function generateLeechLatticeProjection(dimensions = 3, numPoints = 200) {
  // Generate a simplified 2D/3D projection of Leech lattice points
  // The Leech lattice is 24-dimensional, so we project to lower dimensions
  const points = [];
  
  // Use characteristic vectors and their linear combinations
  const baseVectors = [
    [1, 0, 0], [0, 1, 0], [0, 0, 1],
    [1, 1, 0], [1, 0, 1], [0, 1, 1],
    [1, 1, 1], [2, 1, 0], [1, 2, 0],
    [2, 0, 1], [0, 2, 1], [1, 0, 2],
    [0, 1, 2], [2, 2, 1], [2, 1, 2],
    [1, 2, 2], [3, 1, 1], [1, 3, 1],
    [1, 1, 3], [2, 2, 2]
  ];
  
  for (let i = 0; i < numPoints; i++) {
    if (i < baseVectors.length) {
      const vec = baseVectors[i];
      points.push({
        x: vec[0],
        y: vec[1],
        z: dimensions >= 3 ? vec[2] : 0
      });
    } else {
      // Generate additional points through lattice combinations
      const scale = Math.floor(Math.random() * 3) + 1;
      const base1 = baseVectors[Math.floor(Math.random() * baseVectors.length)];
      const base2 = baseVectors[Math.floor(Math.random() * baseVectors.length)];
      
      points.push({
        x: scale * (base1[0] + base2[0]) / 2,
        y: scale * (base1[1] + base2[1]) / 2,
        z: dimensions >= 3 ? scale * (base1[2] + base2[2]) / 2 : 0
      });
    }
  }
  
  return points;
}

function generateKissingConfiguration() {
  // The famous kissing number problem: 24 spheres kissing a central sphere
  const points = [{ x: 0, y: 0, z: 0, type: 'central' }]; // Central sphere
  
  // 24 surrounding spheres arranged optimally using icosahedral symmetry
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const vertices = [
    // 12 vertices of icosahedron
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
  ];
  
  // Normalize and scale to kissing distance
  vertices.forEach(v => {
    const norm = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    points.push({
      x: 2 * v[0] / norm,
      y: 2 * v[1] / norm,
      z: 2 * v[2] / norm,
      type: 'kissing'
    });
  });
  
  // Add 12 more points for the complete 24-sphere configuration
  const additionalPoints = [
    [2, 0, 0], [-2, 0, 0], [0, 2, 0], [0, -2, 0], [0, 0, 2], [0, 0, -2],
    [1.4, 1.4, 0], [-1.4, 1.4, 0], [1.4, -1.4, 0], [-1.4, -1.4, 0],
    [1.4, 0, 1.4], [-1.4, 0, 1.4]
  ];
  
  additionalPoints.forEach(v => {
    points.push({ x: v[0], y: v[1], z: v[2], type: 'kissing' });
  });
  
  return points;
}

// 3D Visualization Components
function KissingSpheres({ points }) {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((point, index) => (
        <Sphere
          key={index}
          position={[point.x, point.y, point.z]}
          args={[point.type === 'central' ? 1 : 0.8]}
        >
          <meshStandardMaterial
            color={point.type === 'central' ? '#ff6b6b' : '#4ecdc4'}
            transparent
            opacity={0.8}
          />
        </Sphere>
      ))}
      {/* Add connection lines to central sphere */}
      {points.slice(1).map((point, index) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(point.x, point.y, point.z)
        ]);
        return (
          <line key={`line-${index}`} geometry={geometry}>
            <lineBasicMaterial color="#666" opacity={0.3} transparent />
          </line>
        );
      })}
    </group>
  );
}

function LatticePoints({ points }) {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((point, index) => (
        <Sphere
          key={index}
          position={[point.x, point.y, point.z]}
          args={[0.1]}
        >
          <meshStandardMaterial color="#3498db" />
        </Sphere>
      ))}
    </group>
  );
}

const Leech = () => {
  const [numPoints, setNumPoints] = useState(100);
  const [showKissing, setShowKissing] = useState(false);
  const [view3D, setView3D] = useState(true);

  const latticePoints = showKissing 
    ? generateKissingConfiguration()
    : generateLeechLatticeProjection(3, numPoints);

  const handlePointsChange = (e) => {
    const value = Math.max(1, Math.min(500, parseInt(e.target.value) || 100));
    setNumPoints(value);
  };

  const chartData = {
    datasets: [
      {
        label: showKissing ? 'Kissing Spheres (24)' : 'Leech Lattice Points',
        data: latticePoints.map(point => ({
          x: point.x,
          y: point.y
        })),
        backgroundColor: showKissing ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.6)',
        borderColor: showKissing ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: showKissing ? 6 : 3,
        pointHoverRadius: showKissing ? 8 : 5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = latticePoints[context.dataIndex];
            return `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'X Coordinate'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Y Coordinate'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: 'rgba(255, 206, 86, 0.8)'
      }
    }
  };

  return (
    <div className="leech-container">
      <div className="leech-content">
        <div className="header-section">
          <h2>Leech Lattice & Kissing Spheres</h2>
          <div className="compact-input-group">
            <input
              type="number"
              value={numPoints}
              onChange={handlePointsChange}
              className="compact-input"
              min="1"
              max="500"
              disabled={showKissing}
            />
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={showKissing}
                onChange={(e) => setShowKissing(e.target.checked)}
              />
              Kissing
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

        <div className="chart-container">
          {view3D ? (
            <div style={{ height: '400px', width: '100%' }}>
              <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <OrbitControls enableZoom={false} enablePan={false} />
                {showKissing ? (
                  <KissingSpheres points={latticePoints} />
                ) : (
                  <LatticePoints points={latticePoints} />
                )}
              </Canvas>
            </div>
          ) : (
            <Scatter data={chartData} options={chartOptions} />
          )}
        </div>

        <div className="info-section">
          <p>
            {showKissing ? (
              <>
                <strong>Kissing Number Problem:</strong> The maximum number of non-overlapping unit spheres 
                that can touch a central unit sphere in 3D space is 24. This optimal configuration is 
                closely related to the Leech lattice structure.
              </>
            ) : (
              <>
                <strong>Leech Lattice:</strong> A 24-dimensional even unimodular lattice with remarkable 
                properties. It's the densest known sphere packing in 24 dimensions and has deep connections 
                to sporadic groups, error-correcting codes, and the Monster group.
              </>
            )}
          </p>
          <p>
            <strong>Key Properties:</strong> {showKissing ? 
              "24 spheres optimally arranged, density ≈ 0.74048" : 
              `${numPoints} projected points, minimum distance = 2√2, automorphism group Co₀`
            }<br />
            <strong>Visualization:</strong> {view3D ? 
              (showKissing ? "Interactive 3D kissing spheres configuration" : "3D lattice point projection") : 
              "2D scatter plot projection"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leech;
