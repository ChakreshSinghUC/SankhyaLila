import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import './Fractals.css';

// 3D Fractal Components
function MandelbulbPoints({ iterations, detail }) {
  const positions = useMemo(() => {
    const points = [];
    const scale = 2;
    const step = scale / detail;
    
    for (let x = -scale; x <= scale; x += step) {
      for (let y = -scale; y <= scale; y += step) {
        for (let z = -scale; z <= scale; z += step) {
          // Mandelbulb formula with power 8
          let zx = x, zy = y, zz = z;
          let i = 0;
          
          for (i = 0; i < iterations; i++) {
            const r = Math.sqrt(zx*zx + zy*zy + zz*zz);
            if (r > 2) break;
            
            const theta = Math.atan2(Math.sqrt(zx*zx + zy*zy), zz);
            const phi = Math.atan2(zy, zx);
            const r8 = Math.pow(r, 8);
            
            const newZx = r8 * Math.sin(8*theta) * Math.cos(8*phi) + x;
            const newZy = r8 * Math.sin(8*theta) * Math.sin(8*phi) + y;
            const newZz = r8 * Math.cos(8*theta) + z;
            
            zx = newZx;
            zy = newZy;
            zz = newZz;
          }
          
          if (i === iterations) {
            points.push(x, y, z);
          }
        }
      }
    }
    
    return new Float32Array(points);
  }, [iterations, detail]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color="#ff4444" 
        size={0.02} 
        sizeAttenuation={true} 
        depthWrite={false} 
      />
    </Points>
  );
}

function JuliaSet3D({ iterations, detail, c }) {
  const positions = useMemo(() => {
    const points = [];
    const scale = 1.5;
    const step = scale / detail;
    
    for (let x = -scale; x <= scale; x += step) {
      for (let y = -scale; y <= scale; y += step) {
        for (let z = -scale; z <= scale; z += step) {
          let zx = x, zy = y, zz = z;
          let i = 0;
          
          for (i = 0; i < iterations; i++) {
            const r = zx*zx + zy*zy + zz*zz;
            if (r > 4) break;
            
            const newZx = zx*zx - zy*zy - zz*zz + c.x;
            const newZy = 2*zx*zy + c.y;
            const newZz = 2*zx*zz + c.z;
            
            zx = newZx;
            zy = newZy;
            zz = newZz;
          }
          
          if (i === iterations) {
            points.push(x, y, z);
          }
        }
      }
    }
    
    return new Float32Array(points);
  }, [iterations, detail, c]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color="#44ff44" 
        size={0.015} 
        sizeAttenuation={true} 
        depthWrite={false} 
      />
    </Points>
  );
}

function SierpinskiTetrahedron({ depth }) {
  const positions = useMemo(() => {
    const points = [];
    
    const generateTetrahedron = (v1, v2, v3, v4, level) => {
      if (level === 0) {
        points.push(...v1, ...v2, ...v3, ...v4);
        return;
      }
      
      // Midpoints
      const m12 = [(v1[0]+v2[0])/2, (v1[1]+v2[1])/2, (v1[2]+v2[2])/2];
      const m13 = [(v1[0]+v3[0])/2, (v1[1]+v3[1])/2, (v1[2]+v3[2])/2];
      const m14 = [(v1[0]+v4[0])/2, (v1[1]+v4[1])/2, (v1[2]+v4[2])/2];
      const m23 = [(v2[0]+v3[0])/2, (v2[1]+v3[1])/2, (v2[2]+v3[2])/2];
      const m24 = [(v2[0]+v4[0])/2, (v2[1]+v4[1])/2, (v2[2]+v4[2])/2];
      const m34 = [(v3[0]+v4[0])/2, (v3[1]+v4[1])/2, (v3[2]+v4[2])/2];
      
      // Recursive calls for 4 smaller tetrahedra
      generateTetrahedron(v1, m12, m13, m14, level - 1);
      generateTetrahedron(m12, v2, m23, m24, level - 1);
      generateTetrahedron(m13, m23, v3, m34, level - 1);
      generateTetrahedron(m14, m24, m34, v4, level - 1);
    };
    
    // Initial tetrahedron vertices
    const sqrt3 = Math.sqrt(3);
    const v1 = [1, 1, 1];
    const v2 = [1, -1, -1];
    const v3 = [-1, 1, -1];
    const v4 = [-1, -1, 1];
    
    generateTetrahedron(v1, v2, v3, v4, depth);
    
    return new Float32Array(points);
  }, [depth]);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent 
        color="#4444ff" 
        size={0.03} 
        sizeAttenuation={true} 
        depthWrite={false} 
      />
    </Points>
  );
}

function RotatingFractal({ children }) {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.x += delta * 0.1;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

const Fractals = () => {
  const [fractalType, setFractalType] = useState('mandelbulb');
  const [iterations, setIterations] = useState(8);
  const [detail, setDetail] = useState(30);

  const handleIterationsChange = (e) => {
    setIterations(parseInt(e.target.value));
  };

  const handleDetailChange = (e) => {
    setDetail(parseInt(e.target.value));
  };

  const juliaC = { x: -0.4, y: 0.6, z: 0.0 };

  return (
    <div className="fractals-container">
      <div className="fractals-content">
        <div className="header-section">
          <h2>3D Fractals</h2>
          <div className="compact-input-group">
            <select
              value={fractalType}
              onChange={(e) => setFractalType(e.target.value)}
              className="compact-select"
            >
              <option value="mandelbulb">Mandelbulb</option>
              <option value="julia3d">Julia 3D</option>
              <option value="sierpinski">Sierpinski</option>
            </select>
            <input
              type="range"
              min={fractalType === 'sierpinski' ? "1" : "4"}
              max={fractalType === 'sierpinski' ? "4" : "12"}
              value={iterations}
              onChange={handleIterationsChange}
              className="compact-slider"
            />
            <span className="iteration-display">{iterations}</span>
          </div>
        </div>

        <div className="chart-wrapper" style={{ height: '400px' }}>
          <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.4} />
            <OrbitControls enableZoom={false} enablePan={false} />
            
            <RotatingFractal>
              {fractalType === 'mandelbulb' && (
                <MandelbulbPoints iterations={iterations} detail={detail} />
              )}
              {fractalType === 'julia3d' && (
                <JuliaSet3D iterations={iterations} detail={detail} c={juliaC} />
              )}
              {fractalType === 'sierpinski' && (
                <SierpinskiTetrahedron depth={iterations} />
              )}
            </RotatingFractal>
          </Canvas>
        </div>

        <div className="fractal-description">
          <p>
            <strong>Fractal Type:</strong> {fractalType.charAt(0).toUpperCase() + fractalType.slice(1)}<br />
            <strong>Complexity:</strong> {fractalType === 'sierpinski' ? `Depth ${iterations}` : `${iterations} iterations`}<br />
            <strong>Rendering:</strong> 3D point cloud with automatic rotation
          </p>
        </div>

        <div className="fractal-info">
          <p>
            <strong>
              {fractalType === 'mandelbulb' && "3D Mandelbulb:"}
              {fractalType === 'julia3d' && "3D Julia Set:"}
              {fractalType === 'sierpinski' && "Sierpinski Tetrahedron:"}
            </strong>{' '}
            {fractalType === 'mandelbulb' && 
              "A 3D extension of the famous Mandelbrot set using spherical coordinates and power-8 iteration."
            }
            {fractalType === 'julia3d' && 
              "A three-dimensional Julia set created by extending the complex iteration to quaternions."
            }
            {fractalType === 'sierpinski' && 
              "A 3D fractal formed by recursively subdividing a tetrahedron, creating infinite self-similar structure."
            }
          </p>
          <ul>
            <li>Interactive 3D visualization with automatic rotation</li>
            <li>Real-time parameter adjustment</li>
            <li>GPU-accelerated point cloud rendering</li>
            <li>Self-similar structure at multiple scales</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Fractals;
