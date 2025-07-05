import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Collatz from './pages/Collatz';

function App() {
  return (
    <Router>
      <header>
        <h1>सांख्यलीला – SankhyaLila</h1>
        <nav>
          <NavLink
            to="/"
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
        </nav>
      </header>

      <main style={{ padding: '1rem 2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collatz" element={<Collatz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

function Home() {
  return (
    <>
      <h2>Welcome to
