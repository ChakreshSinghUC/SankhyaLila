import React, { useState } from 'react';
import './Goldbach.css'; // New CSS file for styles

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function findGoldbachPairs(even) {
  const pairs = [];
  for (let i = 2; i <= even / 2; i++) {
    if (isPrime(i) && isPrime(even - i)) {
      pairs.push([i, even - i]);
    }
  }
  return pairs;
}

export default function Goldbach() {
  const [input, setInput] = useState('');
  const [pairs, setPairs] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const n = parseInt(input);
    if (n > 2 && n % 2 === 0) {
      const foundPairs = findGoldbachPairs(n);
      setPairs(foundPairs);
      setMessage(`${foundPairs.length} pair(s) found for ${n}.`);
    } else {
      setPairs([]);
      setMessage('Please enter an even number greater than 2.');
    }
  };

  return (
    <div className="goldbach-container">
      <h2>Goldbach Conjecture</h2>
      <p>
        <strong>The Goldbach Conjecture</strong> proposes that every even integer greater than 2 
        can be expressed as the sum of two prime numbers.
      </p>

      <div className="input-group">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter even number"
        />
        <button onClick={handleSubmit}>Find Pairs</button>
      </div>

      {message && <p className="message"><strong>{message}</strong></p>}

      {pairs.length > 0 && (
        <div className="pair-list">
          <h4>Goldbach Pairs for {input}:</h4>
          <ul>
            {pairs.map(([a, b], index) => (
              <li key={index}>{a} + {b} = {input}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
