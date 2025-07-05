import React, { useState } from 'react';

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
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const n = parseInt(input);
    if (isNaN(n)) {
      setError('Please enter a valid number.');
      setPairs([]);
      return;
    }

    if (n > 2 && n % 2 === 0) {
      setPairs(findGoldbachPairs(n));
      setError('');
    } else {
      setError('Please enter an even number greater than 2.');
      setPairs([]);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Goldbach Conjecture</h2>
      <p>
        <strong>The Goldbach Conjecture</strong> proposes that every even integer
        greater than 2 can be expressed as the sum of two prime numbers. Though
        unproven, it has been computationally verified for very large numbers.
      </p>

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Enter even number"
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        Find Pairs
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>
      )}

      {pairs.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Goldbach Pairs for {input} (Total: {pairs.length}):</h4>
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
