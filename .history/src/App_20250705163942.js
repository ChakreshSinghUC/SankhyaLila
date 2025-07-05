import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Collatz from './pages/Collatz';

function App() {
  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <h1>सांख्यलीला – SankhyaLila</h1>
        <nav>
          <Link to="/collatz">Collatz</Link>
        </nav>

        <Routes>
          <Route path="/collatz" element={<Collatz />} />
          <Route path="/" element={<p>Welcome to SankhyaLila!</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
