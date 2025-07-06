import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Collatz from './pages/Collatz.jsx';
import Goldbach from './pages/Goldbach.jsx';
import Riemann from './pages/Riemann.jsx';
import Leech from './pages/Leech.jsx';
import Sporadic from './pages/Sporadic.jsx';
import Fractals from './pages/Fractals.jsx';
import PrimeSpiral from './pages/PrimeSpiral.jsx';
import ChaosTheory from './pages/ChaosTheory.jsx';
import Fibonacci from './pages/Fibonacci.jsx';
import GraphTheory from './pages/GraphTheory.jsx';

function App() {
  return (
    <Router>
      <header>
        <h1>सांख्यलीला – SankhyaLila</h1>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/collatz"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Collatz
          </NavLink>
          <NavLink
            to="/goldbach"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Goldbach
          </NavLink>
          <NavLink
            to="/riemann"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Riemann
          </NavLink>
          <NavLink
            to="/leech"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Leech
          </NavLink>
          <NavLink
            to="/sporadic"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Sporadic
          </NavLink>
          <NavLink
            to="/fractals"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Fractals
          </NavLink>
          <NavLink
            to="/prime-spiral"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Prime Spiral
          </NavLink>
          <NavLink
            to="/chaos"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Chaos
          </NavLink>
          <NavLink
            to="/fibonacci"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Fibonacci
          </NavLink>
          <NavLink
            to="/graph-theory"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
              textDecoration: isActive ? 'underline' : 'none',
            })}
          >
            Graphs
          </NavLink>
        </nav>
      </header>

      <main style={{ padding: '1rem 2rem' }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/collatz" element={<Collatz />} />
          <Route path="/goldbach" element={<Goldbach />} />
          <Route path="/riemann" element={<Riemann />} />
          <Route path="/leech" element={<Leech />} />
          <Route path="/sporadic" element={<Sporadic />} />
          <Route path="/fractals" element={<Fractals />} />
          <Route path="/prime-spiral" element={<PrimeSpiral />} />
          <Route path="/chaos" element={<ChaosTheory />} />
          <Route path="/fibonacci" element={<Fibonacci />} />
          <Route path="/graph-theory" element={<GraphTheory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

function Home() {
  return (
    <>
      <h2>Welcome to SankhyaLila</h2>
      <p>
        SankhyaLila (सांख्यलीला) is a digital playground for curious minds. Explore
        the beauty of numbers, patterns, and mathematical wonder through interactive
        visualizations.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <h3>🔢 Number Theory & Conjectures</h3>
        <p><strong>Collatz:</strong> The 3n+1 problem - will every sequence reach 1?</p>
        <p><strong>Goldbach:</strong> Can every even number be written as the sum of two primes?</p>
        <p><strong>Riemann:</strong> The million-dollar question about prime distribution</p>
        <p><strong>Prime Spiral:</strong> Discover hidden patterns in the Ulam spiral</p>
        
        <h3>🌟 Geometry & Nature</h3>
        <p><strong>Fibonacci:</strong> The golden ratio appears everywhere in nature</p>
        <p><strong>Fractals:</strong> Infinite complexity from simple rules</p>
        <p><strong>Leech Lattice:</strong> 24-dimensional sphere packing perfection</p>
        
        <h3>🎭 Chaos & Groups</h3>
        <p><strong>Chaos Theory:</strong> When simple rules create unpredictable beauty</p>
        <p><strong>Sporadic Groups:</strong> The rare gems of mathematical symmetry</p>
        <p><strong>Graph Theory:</strong> Explore networks, trees, and mathematical connections</p>
      </div>
    </>
  );
}

function NotFound() {
  return <p>404 – Page not found</p>;
}

export default App;
