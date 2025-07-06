import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei';
import { Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import * as THREE from 'three';
import './Sporadic.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const sporadicGroups = [
  { name: 'M₁₁', order: 7920, discovered: 1861, type: 'Mathieu', connections: ['M₁₂'] },
  { name: 'M₁₂', order: 95040, discovered: 1861, type: 'Mathieu', connections: ['M₁₁', 'M₂₂'] },
  { name: 'M₂₂', order: 443520, discovered: 1873, type: 'Mathieu', connections: ['M₁₂', 'M₂₃'] },
  { name: 'M₂₃', order: 10200960, discovered: 1873, type: 'Mathieu', connections: ['M₂₂', 'M₂₄'] },
  { name: 'M₂₄', order: 244823040, discovered: 1873, type: 'Mathieu', connections: ['M₂₃', 'Co₁'] },
  { name: 'J₁', order: 175560, discovered: 1968, type: 'Janko', connections: [] },
  { name: 'J₂', order: 604800, discovered: 1969, type: 'Janko', connections: [] },
  { name: 'J₃', order: 50232960, discovered: 1976, type: 'Janko', connections: [] },
  { name: 'J₄', order: 86775571046077562880, discovered: 1976, type: 'Janko', connections: ['M'] },
  { name: 'Co₁', order: 4157776806543360000, discovered: 1968, type: 'Conway', connections: ['M₂₄', 'Co₂', 'M'] },
  { name: 'Co₂', order: 42305421312000, discovered: 1969, type: 'Conway', connections: ['Co₁', 'Co₃'] },
  { name: 'Co₃', order: 495766656000, discovered: 1969, type: 'Conway', connections: ['Co₂'] },
  { name: 'Fi₂₂', order: 64561751654400, discovered: 1971, type: 'Fischer', connections: ['Fi₂₃'] },
  { name: 'Fi₂₃', order: 4089470473293004800, discovered: 1971, type: 'Fischer', connections: ['Fi₂₂', 'Fi₂₄\''] },
  { name: 'Fi₂₄\'', order: 1255205709190661721292800, discovered: 1971, type: 'Fischer', connections: ['Fi₂₃', 'B'] },
  { name: 'HS', order: 44352000, discovered: 1968, type: 'Higman-Sims', connections: [] },
  { name: 'McL', order: 898128000, discovered: 1969, type: 'McLaughlin', connections: [] },
  { name: 'He', order: 4030387200, discovered: 1969, type: 'Held', connections: [] },
  { name: 'Ru', order: 145926144000, discovered: 1973, type: 'Rudvalis', connections: [] },
  { name: 'Suz', order: 448345497600, discovered: 1969, type: 'Suzuki', connections: [] },
  { name: 'ON', order: 460815505920, discovered: 1976, type: 'O\'Nan', connections: [] },
  { name: 'HN', order: 273030912000000, discovered: 1976, type: 'Harada-Norton', connections: [] },
  { name: 'Ly', order: 51765179004000000, discovered: 1972, type: 'Lyons', connections: [] },
  { name: 'Th', order: 90745943887872000, discovered: 1976, type: 'Thompson', connections: [] },
  { name: 'B', order: 4154781481226426191177580544000000, discovered: 1973, type: 'Baby Monster', connections: ['Fi₂₄\'', 'M'] },
  { name: 'M', order: 808017424794512875886459904961710757005754368000000000, discovered: 1980, type: 'Monster', connections: ['Co₁', 'J₄', 'B'] }
];

// 3D Network Visualization Components
function GroupNode({ group, position, isSelected, onClick }) {
  const meshRef = useRef();
  const textRef = useRef();
  
  const getColor = (type) => {
    switch(type) {
      case 'Mathieu': return '#ff6b6b';
      case 'Janko': return '#4ecdc4';
      case 'Conway': return '#45b7d1';
      case 'Fischer': return '#96ceb4';
      case 'Monster': return '#9b59b6';
      case 'Baby Monster': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const size = Math.log10(Number(group.order)) / 10;

  useFrame((state, delta) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      <Sphere
        ref={meshRef}
        args={[size]}
      >
        <meshStandardMaterial
          color={getColor(group.type)}
          transparent
          opacity={isSelected ? 1 : 0.8}
          emissive={isSelected ? getColor(group.type) : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </Sphere>
      <Text
        ref={textRef}
        position={[0, size + 0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {group.name}
      </Text>
    </group>
  );
}

function NetworkConnections({ groups, positions }) {
  const connections = useMemo(() => {
    const lines = [];
    groups.forEach((group, index) => {
      group.connections.forEach(connName => {
        const connIndex = groups.findIndex(g => g.name === connName);
        if (connIndex !== -1 && connIndex > index) { // Avoid duplicate lines
          const start = positions[index];
          const end = positions[connIndex];
          lines.push({
            start: new THREE.Vector3(...start),
            end: new THREE.Vector3(...end)
          });
        }
      });
    });
    return lines;
  }, [groups, positions]);

  return (
    <>
      {connections.map((conn, index) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([conn.start, conn.end]);
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial color="#666" opacity={0.4} transparent />
          </line>
        );
      })}
    </>
  );
}

function SporadicNetwork({ groups, selectedGroup, onGroupSelect }) {
  const groupRef = useRef();
  
  // Position groups in 3D space based on their properties
  const positions = useMemo(() => {
    return groups.map((group, index) => {
      const orderLog = Math.log10(Number(group.order));
      const yearNorm = (group.discovered - 1860) / 120;
      
      // Arrange in a sphere with some clustering by type
      const typeOffset = {
        'Mathieu': { x: 0, y: 2, z: 0 },
        'Janko': { x: 2, y: 0, z: 2 },
        'Conway': { x: -2, y: 1, z: -1 },
        'Fischer': { x: 1, y: -2, z: 1 },
        'Monster': { x: 0, y: 0, z: -3 },
        'Baby Monster': { x: 0, y: -1, z: -2 }
      };
      
      const offset = typeOffset[group.type] || { x: 0, y: 0, z: 0 };
      const radius = 3;
      const angle = (index / groups.length) * 2 * Math.PI;
      
      return [
        radius * Math.cos(angle) + offset.x + (Math.random() - 0.5) * 0.5,
        radius * Math.sin(angle) * 0.5 + offset.y + yearNorm * 2,
        radius * Math.sin(angle) + offset.z + orderLog * 0.1
      ];
    });
  }, [groups]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <NetworkConnections groups={groups} positions={positions} />
      {groups.map((group, index) => (
        <GroupNode
          key={group.name}
          group={group}
          position={positions[index]}
          isSelected={selectedGroup === group.name}
          onClick={() => onGroupSelect(group.name)}
        />
      ))}
    </group>
  );
}

const Sporadic = () => {
  const [displayMode, setDisplayMode] = useState('orders');
  const [groupType, setGroupType] = useState('all');
  const [view3D, setView3D] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('M');

  const filteredGroups = groupType === 'all' 
    ? sporadicGroups 
    : sporadicGroups.filter(group => group.type.toLowerCase().includes(groupType.toLowerCase()));

  const handleGroupSelect = (groupName) => {
    setSelectedGroup(groupName);
  };

  const getChartData = () => {
    if (displayMode === 'orders') {
      return {
        labels: filteredGroups.map(group => group.name),
        datasets: [{
          label: 'Group Order (log₁₀)',
          data: filteredGroups.map(group => Math.log10(Number(group.order))),
          backgroundColor: filteredGroups.map(group => {
            switch(group.type) {
              case 'Mathieu': return 'rgba(255, 99, 132, 0.8)';
              case 'Janko': return 'rgba(54, 162, 235, 0.8)';
              case 'Conway': return 'rgba(255, 206, 86, 0.8)';
              case 'Fischer': return 'rgba(75, 192, 192, 0.8)';
              case 'Monster': return 'rgba(153, 102, 255, 0.8)';
              case 'Baby Monster': return 'rgba(255, 159, 64, 0.8)';
              default: return 'rgba(199, 199, 199, 0.8)';
            }
          }),
          borderColor: filteredGroups.map(group => {
            switch(group.type) {
              case 'Mathieu': return 'rgba(255, 99, 132, 1)';
              case 'Janko': return 'rgba(54, 162, 235, 1)';
              case 'Conway': return 'rgba(255, 206, 86, 1)';
              case 'Fischer': return 'rgba(75, 192, 192, 1)';
              case 'Monster': return 'rgba(153, 102, 255, 1)';
              case 'Baby Monster': return 'rgba(255, 159, 64, 1)';
              default: return 'rgba(199, 199, 199, 1)';
            }
          }),
          borderWidth: 1
        }]
      };
    } else {
      return {
        datasets: [{
          label: 'Discovery Timeline',
          data: filteredGroups.map(group => ({
            x: group.discovered,
            y: Math.log10(Number(group.order))
          })),
          backgroundColor: filteredGroups.map(group => {
            switch(group.type) {
              case 'Mathieu': return 'rgba(255, 99, 132, 0.8)';
              case 'Janko': return 'rgba(54, 162, 235, 0.8)';
              case 'Conway': return 'rgba(255, 206, 86, 0.8)';
              case 'Fischer': return 'rgba(75, 192, 192, 0.8)';
              case 'Monster': return 'rgba(153, 102, 255, 0.8)';
              case 'Baby Monster': return 'rgba(255, 159, 64, 0.8)';
              default: return 'rgba(199, 199, 199, 0.8)';
            }
          }),
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      };
    }
  };

  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const group = filteredGroups[context.dataIndex];
              return [
                `${group.name} (${group.type})`,
                `Order: ${group.order.toLocaleString()}`,
                `Discovered: ${group.discovered}`
              ];
            }
          }
        }
      }
    };

    if (displayMode === 'orders') {
      return {
        ...baseOptions,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sporadic Groups'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            title: {
              display: true,
              text: 'Group Order (log₁₀)'
            },
            min: 0
          }
        }
      };
    } else {
      return {
        ...baseOptions,
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Year Discovered'
            },
            min: 1860,
            max: 1985
          },
          y: {
            title: {
              display: true,
              text: 'Group Order (log₁₀)'
            },
            min: 0
          }
        }
      };
    }
  };

  return (
    <div className="sporadic-container">
      <div className="sporadic-content">
        <div className="header-section">
          <h2>Sporadic Groups</h2>
          <div className="compact-input-group">
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              className="compact-select"
            >
              <option value="all">All</option>
              <option value="mathieu">Mathieu</option>
              <option value="janko">Janko</option>
              <option value="conway">Conway</option>
              <option value="fischer">Fischer</option>
              <option value="monster">Monster</option>
            </select>
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={displayMode === 'timeline'}
                onChange={(e) => setDisplayMode(e.target.checked ? 'timeline' : 'orders')}
              />
              Timeline
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
              <Canvas camera={{ position: [8, 8, 8], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.4} />
                <OrbitControls enableZoom={false} enablePan={false} />
                <SporadicNetwork 
                  groups={filteredGroups} 
                  selectedGroup={selectedGroup}
                  onGroupSelect={handleGroupSelect}
                />
              </Canvas>
            </div>
          ) : (
            displayMode === 'orders' ? (
              <Bar data={getChartData()} options={getChartOptions()} />
            ) : (
              <Scatter data={getChartData()} options={getChartOptions()} />
            )
          )}
        </div>

        <div className="info-section">
          <p>
            <strong>Sporadic Groups:</strong> These are the 26 exceptional finite simple groups that don't 
            fit into the infinite families. They represent some of the most mysterious and beautiful 
            objects in mathematics, with connections to moonshine theory, string theory, and the Monster group.
          </p>
          <p>
            <strong>Selected:</strong> {view3D && selectedGroup ? 
              `${selectedGroup} - ${sporadicGroups.find(g => g.name === selectedGroup)?.type || 'Unknown'}` : 
              'None'
            }<br />
            <strong>Classification:</strong> {groupType === 'all' ? 
              `Showing all ${filteredGroups.length} sporadic groups. The Monster group has order ≈ 8×10⁵³!` :
              `Showing ${filteredGroups.length} ${groupType} group${filteredGroups.length > 1 ? 's' : ''}`
            }<br />
            <strong>Visualization:</strong> {view3D ? 
              'Interactive 3D network showing group relationships and relative sizes' : 
              `${displayMode === 'timeline' ? 'Discovery timeline' : 'Group orders'} chart`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sporadic;
