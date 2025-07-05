import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Collatz from './pages/Collatz';
import Goldbach from './pages/Goldbach';

function App() {
  return (
    <Router>
      <header>
        <h1>सांख्यलीला – SankhyaLila</h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
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
        </nav>
      </header>

      <main style={{ padding: '1rem 2rem' }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/collatz" element={<Collatz />} />
          <Route path="/goldbach" element={<Goldbach />} />
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
    </>
  );
}

function NotFound() {
  return <p>404 – Page not found</p>;
}

export default App;
