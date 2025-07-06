import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Logo from './components/Logo.jsx';
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
      <header className="app-header">
        <div className="header-content">
          <div className="title-container">
            <Logo size={50} />
            <div>
              <h1>सांख्यलीला – SankhyaLila</h1>
              <div className="subtitle">Mathematical Beauty Through Interactive Exploration</div>
            </div>
          </div>
          <nav>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/collatz"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Collatz
            </NavLink>
            <NavLink
              to="/goldbach"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Goldbach
            </NavLink>
            <NavLink
              to="/riemann"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Riemann
            </NavLink>
            <NavLink
              to="/prime-spiral"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Prime Spiral
            </NavLink>
            <NavLink
              to="/fibonacci"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Fibonacci
            </NavLink>
            <NavLink
              to="/fractals"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Fractals
            </NavLink>
            <NavLink
              to="/chaos"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Chaos
            </NavLink>
            <NavLink
              to="/graph-theory"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Networks
            </NavLink>
            <NavLink
              to="/leech"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Leech
            </NavLink>
            <NavLink
              to="/sporadic"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Groups
            </NavLink>
          </nav>
        </div>
      </header>

      <main>
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
    <div className="home-container">
      <h2 className="home-title">Welcome to SankhyaLila</h2>
      <p className="home-description">
        SankhyaLila (सांख्यलीला) is a digital playground for curious minds. Explore
        the beauty of numbers, patterns, and mathematical wonder through interactive
        visualizations that bring abstract concepts to life.
      </p>
      
      <div className="feature-grid">
        <div className="feature-category">
          <h3 className="category-title">
            <span className="category-emoji">🔢</span>
            Number Theory & Conjectures
          </h3>
          <div className="feature-item">
            <div className="feature-name">Collatz Conjecture</div>
            <div className="feature-description">The 3n+1 problem - will every sequence reach 1?</div>
          </div>
          <div className="feature-item">
            <div className="feature-name">Goldbach's Conjecture</div>
            <div className="feature-description">Can every even number be written as the sum of two primes?</div>
          </div>
          <div className="feature-item">
            <div className="feature-name">Riemann Hypothesis</div>
            <div className="feature-description">The million-dollar question about prime distribution</div>
          </div>
          <div className="feature-item">
            <div className="feature-name">Prime Spiral</div>
            <div className="feature-description">Discover hidden patterns in the Ulam spiral</div>
          </div>
        </div>
        
        <div className="feature-category">
          <h3 className="category-title">
            <span className="category-emoji">🌟</span>
            Geometry & Nature
          </h3>
          <div className="feature-item">
            <div className="feature-name">Fibonacci & Golden Ratio</div>
            <div className="feature-description">The golden ratio appears everywhere in nature</div>
          </div>
          <div className="feature-item">
            <div className="feature-name">Fractals</div>
            <div className="feature-description">Infinite complexity from simple rules</div>
          </div>
          <div className="feature-item">
            <div className="feature-name">Leech Lattice</div>
            <div className="feature-description">24-dimensional sphere packing perfection</div>
          </div>
        </div>
        
        <div className="feature-category">
          <h3 className="category-title">
            <span className="category-emoji">🎭</span>
            Chaos & Networks
          </h3>
          <div className="feature-item">
            <div className="feature-name">Chaos Theory</div>
            <div className="feature-description">When simple rules create unpredictable beauty</div>
          </div>
          <div className="feature-item">
            <div className="feature-name">Sporadic Groups</div>
            <div className="feature-description">The rare gems of mathematical symmetry</div>
          </div>
          <div className="feature-item">
            <div className="feature-name">Graph Theory</div>
            <div className="feature-description">Explore networks, trees, and mathematical connections</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h2>404 – Page Not Found</h2>
      <p>The mathematical concept you're looking for doesn't exist in this universe.</p>
    </div>
  );
}

export default App;
