import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import Plot from 'react-plotly.js';
import * as THREE from 'three';
import './GraphTheory.css';

// Graph generators
function generateCompleteGraph(n) {
  const nodes = [];
  const edges = [];
  
  // Create nodes in a circle
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    nodes.push({
      id: i,
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2,
      z: 0
    });
  }
  
  // Create all possible edges
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({ from: i, to: j });
    }
  }
  
  return { nodes, edges };
}

function generatePlatonicGraph(type) {
  switch (type) {
    case 'tetrahedron':
      return {
        nodes: [
          { id: 0, x: 1, y: 1, z: 1 },
          { id: 1, x: -1, y: -1, z: 1 },
          { id: 2, x: -1, y: 1, z: -1 },
          { id: 3, x: 1, y: -1, z: -1 }
        ],
        edges: [
          { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
          { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 }
        ]
      };
    
    case 'cube':
      return {
        nodes: [
          { id: 0, x: -1, y: -1, z: -1 }, { id: 1, x: 1, y: -1, z: -1 },
          { id: 2, x: 1, y: 1, z: -1 }, { id: 3, x: -1, y: 1, z: -1 },
          { id: 4, x: -1, y: -1, z: 1 }, { id: 5, x: 1, y: -1, z: 1 },
          { id: 6, x: 1, y: 1, z: 1 }, { id: 7, x: -1, y: 1, z: 1 }
        ],
        edges: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 },
          { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 4 },
          { from: 0, to: 4 }, { from: 1, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 }
        ]
      };
    
    case 'octahedron':
      return {
        nodes: [
          { id: 0, x: 1, y: 0, z: 0 }, { id: 1, x: -1, y: 0, z: 0 },
          { id: 2, x: 0, y: 1, z: 0 }, { id: 3, x: 0, y: -1, z: 0 },
          { id: 4, x: 0, y: 0, z: 1 }, { id: 5, x: 0, y: 0, z: -1 }
        ],
        edges: [
          { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }, { from: 0, to: 5 },
          { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 1, to: 5 },
          { from: 2, to: 4 }, { from: 2, to: 5 }, { from: 3, to: 4 }, { from: 3, to: 5 }
        ]
      };
    
    default:
      return generateCompleteGraph(4);
  }
}

function generateRandomGraph(n, p) {
  const nodes = [];
  const edges = [];
  
  // Create nodes randomly positioned
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: i,
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 2
    });
  }
  
  // Create edges with probability p
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < p) {
        edges.push({ from: i, to: j });
      }
    }
  }
  
  return { nodes, edges };
}

function generateTreeGraph(depth) {
  const nodes = [];
  const edges = [];
  let nodeId = 0;
  
  function addNode(x, y, z, level) {
    const id = nodeId++;
    nodes.push({ id, x, y, z, level });
    return id;
  }
  
  function generateLevel(parentId, parentX, parentY, parentZ, level, maxLevel, width) {
    if (level > maxLevel) return;
    
    const children = level === 1 ? 3 : 2; // Root has 3 children, others have 2
    const spacing = width / (children + 1);
    
    for (let i = 0; i < children; i++) {
      const childX = parentX - width/2 + spacing * (i + 1);
      const childY = parentY - 1.5;
      const childZ = parentZ + (Math.random() - 0.5) * 0.5;
      
      const childId = addNode(childX, childY, childZ, level);
      edges.push({ from: parentId, to: childId });
      
      generateLevel(childId, childX, childY, childZ, level + 1, maxLevel, width * 0.7);
    }
  }
  
  const rootId = addNode(0, 0, 0, 0);
  generateLevel(rootId, 0, 0, 0, 1, depth, 4);
  
  return { nodes, edges };
}

// 3D Graph Component
function Graph3D({ graph, colorScheme = 'default' }) {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  const getNodeColor = (node) => {
    switch (colorScheme) {
      case 'level':
        const level = node.level || 0;
        return `hsl(${level * 60}, 70%, 60%)`;
      case 'degree':
        // This would need degree calculation
        return '#4ecdc4';
      default:
        return '#ff6b6b';
    }
  };

  return (
    <group ref={groupRef}>
      {/* Render edges */}
      {graph.edges.map((edge, index) => {
        const fromNode = graph.nodes.find(n => n.id === edge.from);
        const toNode = graph.nodes.find(n => n.id === edge.to);
        
        if (!fromNode || !toNode) return null;
        
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z),
          new THREE.Vector3(toNode.x, toNode.y, toNode.z)
        ]);
        
        return (
          <line key={`edge-${index}`} geometry={geometry}>
            <lineBasicMaterial color="#666" opacity={0.6} transparent />
          </line>
        );
      })}
      
      {/* Render nodes */}
      {graph.nodes.map((node) => (
        <Sphere
          key={`node-${node.id}`}
          position={[node.x, node.y, node.z]}
          args={[0.1]}
        >
          <meshStandardMaterial color={getNodeColor(node)} />
        </Sphere>
      ))}
    </group>
  );
}

export default function GraphTheory() {
  const [graphType, setGraphType] = useState('complete');
  const [nodeCount, setNodeCount] = useState(6);
  const [edgeProbability, setEdgeProbability] = useState(0.3);
  const [platonicType, setPlatonicType] = useState('cube');
  const [treeDepth, setTreeDepth] = useState(3);
  const [view3D, setView3D] = useState(true);
  const [showProperties, setShowProperties] = useState(false);

  const handleNodeCountChange = (e) => {
    const value = Math.max(3, Math.min(15, parseInt(e.target.value) || 6));
    setNodeCount(value);
  };

  const handleEdgeProbabilityChange = (e) => {
    setEdgeProbability(parseFloat(e.target.value));
  };

  // Generate current graph
  let currentGraph;
  switch (graphType) {
    case 'complete':
      currentGraph = generateCompleteGraph(nodeCount);
      break;
    case 'random':
      currentGraph = generateRandomGraph(nodeCount, edgeProbability);
      break;
    case 'platonic':
      currentGraph = generatePlatonicGraph(platonicType);
      break;
    case 'tree':
      currentGraph = generateTreeGraph(treeDepth);
      break;
    default:
      currentGraph = generateCompleteGraph(6);
  }

  // Calculate graph properties
  const numNodes = currentGraph.nodes.length;
  const numEdges = currentGraph.edges.length;
  const maxEdges = (numNodes * (numNodes - 1)) / 2;
  const density = maxEdges > 0 ? (numEdges / maxEdges) : 0;

  // Prepare 2D visualization data
  const networkData = [{
    type: 'scatter',
    mode: 'markers+text',
    x: currentGraph.nodes.map(n => n.x),
    y: currentGraph.nodes.map(n => n.y),
    text: currentGraph.nodes.map(n => n.id.toString()),
    textposition: 'middle center',
    marker: {
      size: 20,
      color: currentGraph.nodes.map(n => n.level || 0),
      colorscale: 'Viridis',
      line: { width: 2, color: '#333' }
    },
    name: 'Nodes'
  }];

  // Add edges for 2D view
  currentGraph.edges.forEach(edge => {
    const fromNode = currentGraph.nodes.find(n => n.id === edge.from);
    const toNode = currentGraph.nodes.find(n => n.id === edge.to);
    
    if (fromNode && toNode) {
      networkData.push({
        type: 'scatter',
        mode: 'lines',
        x: [fromNode.x, toNode.x],
        y: [fromNode.y, toNode.y],
        line: { color: '#666', width: 2 },
        showlegend: false,
        hoverinfo: 'skip'
      });
    }
  });

  const networkLayout = {
    autosize: true,
    margin: { l: 30, r: 30, t: 30, b: 30 },
    xaxis: { 
      showgrid: false, 
      zeroline: false, 
      showticklabels: false,
      scaleanchor: 'y',
      scaleratio: 1
    },
    yaxis: { 
      showgrid: false, 
      zeroline: false, 
      showticklabels: false 
    },
    showlegend: false,
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)'
  };

  return (
    <div className="graph-theory-container">
      <div className="graph-theory-content">
        <div className="header-section">
          <h2>Graph Theory & Networks</h2>
          
          <div className="compact-input-group">
            <select
              value={graphType}
              onChange={(e) => setGraphType(e.target.value)}
              className="compact-select"
            >
              <option value="complete">Complete</option>
              <option value="random">Random</option>
              <option value="platonic">Platonic</option>
              <option value="tree">Tree</option>
            </select>
            
            {graphType === 'complete' || graphType === 'random' ? (
              <input
                type="number"
                value={nodeCount}
                onChange={handleNodeCountChange}
                className="compact-input"
                min="3"
                max="15"
              />
            ) : null}
            
            {graphType === 'random' && (
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={edgeProbability}
                onChange={handleEdgeProbabilityChange}
                className="compact-slider"
              />
            )}
            
            {graphType === 'platonic' && (
              <select
                value={platonicType}
                onChange={(e) => setPlatonicType(e.target.value)}
                className="compact-select"
              >
                <option value="tetrahedron">Tetrahedron</option>
                <option value="cube">Cube</option>
                <option value="octahedron">Octahedron</option>
              </select>
            )}
            
            {graphType === 'tree' && (
              <input
                type="range"
                min="2"
                max="5"
                value={treeDepth}
                onChange={(e) => setTreeDepth(parseInt(e.target.value))}
                className="compact-slider"
              />
            )}
            
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
                checked={showProperties}
                onChange={(e) => setShowProperties(e.target.checked)}
              />
              Stats
            </label>
          </div>
        </div>

        <div className="visualization-container">
          {view3D ? (
            <div style={{ height: '400px', width: '100%' }}>
              <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <OrbitControls enableZoom={true} enablePan={true} />
                <Graph3D graph={currentGraph} colorScheme="level" />
              </Canvas>
            </div>
          ) : (
            <Plot
              data={networkData}
              layout={networkLayout}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '400px' }}
            />
          )}
        </div>

        {showProperties && (
          <div className="graph-properties">
            <h3>Graph Properties</h3>
            <div className="properties-grid">
              <div className="property-item">
                <strong>Nodes:</strong> {numNodes}
              </div>
              <div className="property-item">
                <strong>Edges:</strong> {numEdges}
              </div>
              <div className="property-item">
                <strong>Density:</strong> {(density * 100).toFixed(1)}%
              </div>
              <div className="property-item">
                <strong>Max Edges:</strong> {maxEdges}
              </div>
              {graphType === 'random' && (
                <div className="property-item">
                  <strong>Edge Probability:</strong> {(edgeProbability * 100).toFixed(0)}%
                </div>
              )}
              {graphType === 'tree' && (
                <div className="property-item">
                  <strong>Tree Depth:</strong> {treeDepth}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="graph-description">
          <p>
            <strong>Current graph:</strong> {
              graphType === 'complete' ? `Complete graph K${nodeCount}` :
              graphType === 'random' ? `Random graph (n=${nodeCount}, p=${edgeProbability})` :
              graphType === 'platonic' ? `${platonicType} graph` :
              `Tree (depth ${treeDepth})`
            }<br />
            <strong>Structure:</strong> {numNodes} nodes, {numEdges} edges, {(density * 100).toFixed(1)}% density<br />
            <strong>Visualization:</strong> {view3D ? 'Interactive 3D network' : '2D network layout'}
          </p>
        </div>

        <div className="graph-theory-info">
          <p>
            <strong>Graph Theory</strong> studies networks of connected objects. Graphs consist of 
            vertices (nodes) connected by edges, modeling everything from social networks to 
            molecular structures to transportation systems.
          </p>
          <ul>
            <li><strong>Complete Graph:</strong> Every pair of vertices is connected</li>
            <li><strong>Random Graph:</strong> Edges exist with independent probability p</li>
            <li><strong>Platonic Graphs:</strong> Vertices and edges of Platonic solids</li>
            <li><strong>Tree:</strong> Connected acyclic graph (no cycles)</li>
            <li><strong>Density:</strong> Ratio of existing edges to maximum possible edges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
