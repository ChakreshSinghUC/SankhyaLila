import React, { useState, useRef, useEffect } from 'react';
import './PrimeSpiral.css';

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function generateUlamSpiral(size) {
  const spiral = [];
  const center = Math.floor(size / 2);
  const grid = Array(size).fill().map(() => Array(size).fill(0));
  
  let x = center, y = center;
  let dx = 0, dy = -1;
  let num = 1;
  
  for (let i = 0; i < size * size; i++) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      grid[y][x] = num;
      spiral.push({
        x: x - center,
        y: y - center,
        number: num,
        isPrime: isPrime(num)
      });
    }
    
    if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
      [dx, dy] = [-dy, dx];
    }
    
    x += dx;
    y += dy;
    num++;
  }
  
  return spiral;
}

function generatePrimeGaps(limit) {
  const primes = [];
  const gaps = [];
  
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  
  for (let i = 1; i < primes.length; i++) {
    gaps.push({
      prime: primes[i],
      gap: primes[i] - primes[i-1],
      index: i
    });
  }
  
  return gaps;
}

export default function PrimeSpiral() {
  const canvasRef = useRef(null);
  const [size, setSize] = useState(101);
  const [showGaps, setShowGaps] = useState(false);
  const [highlightPattern, setHighlightPattern] = useState('primes');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSizeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 201) {
      setSize(value % 2 === 0 ? value + 1 : value); // Ensure odd size
    }
  };

  const drawSpiral = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const canvasSize = Math.min(400, window.innerWidth - 40);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      
      const spiral = generateUlamSpiral(size);
      const cellSize = canvasSize / size;
      const center = canvasSize / 2;
      
      spiral.forEach(point => {
        const screenX = center + point.x * cellSize;
        const screenY = center + point.y * cellSize;
        
        if (highlightPattern === 'primes' && point.isPrime) {
          ctx.fillStyle = point.number === 2 ? '#ff4757' : '#3742fa';
          ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
        } else if (highlightPattern === 'composites' && !point.isPrime && point.number > 1) {
          ctx.fillStyle = '#ffa502';
          ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
        } else if (highlightPattern === 'twins') {
          // Twin primes
          if (point.isPrime && (isPrime(point.number + 2) || isPrime(point.number - 2))) {
            ctx.fillStyle = '#2ed573';
            ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
          }
        }
        
        // Draw number if size is small enough
        if (size <= 31 && cellSize > 12) {
          ctx.fillStyle = '#2c2c2c';
          ctx.font = `${Math.max(8, cellSize/3)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(point.number.toString(), screenX, screenY);
        }
      });
      
      setIsGenerating(false);
    }, 10);
  };

  useEffect(() => {
    drawSpiral();
  }, [size, highlightPattern]);

  useEffect(() => {
    drawSpiral();
  }, []);

  const primeCount = Math.floor(size * size * 0.15); // Approximate
  const gaps = showGaps ? generatePrimeGaps(size * size) : [];

  return (
    <div className="prime-spiral-container">
      <div className="prime-spiral-content">
        <div className="header-section">
          <h2>Prime Spirals (Ulam Spiral)</h2>
          
          <div className="compact-input-group">
            <input
              type="number"
              value={size}
              onChange={handleSizeChange}
              placeholder="Grid size"
              min="11"
              max="201"
              step="2"
              className="compact-input"
            />
            <select
              value={highlightPattern}
              onChange={(e) => setHighlightPattern(e.target.value)}
              className="compact-select"
            >
              <option value="primes">Primes</option>
              <option value="composites">Composites</option>
              <option value="twins">Twin Primes</option>
            </select>
            <label className="compact-checkbox">
              <input
                type="checkbox"
                checked={showGaps}
                onChange={(e) => setShowGaps(e.target.checked)}
              />
              Gaps
            </label>
          </div>
        </div>

        <div className="canvas-container">
          <canvas 
            ref={canvasRef}
            className="spiral-canvas"
            style={{ opacity: isGenerating ? 0.5 : 1 }}
          />
          {isGenerating && (
            <div className="generating-overlay">
              <div className="spinner"></div>
              <span>Generating spiral...</span>
            </div>
          )}
        </div>

        {showGaps && (
          <div className="gaps-info">
            <h3>Prime Gaps Analysis</h3>
            <p>
              <strong>Largest gap in range:</strong> {gaps.length > 0 ? Math.max(...gaps.map(g => g.gap)) : 0}<br />
              <strong>Average gap:</strong> {gaps.length > 0 ? (gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length).toFixed(2) : 0}<br />
              <strong>Twin prime pairs:</strong> {gaps.filter(g => g.gap === 2).length}
            </p>
          </div>
        )}

        <div className="prime-spiral-info">
          <p>
            <strong>The Ulam Spiral</strong> was discovered by mathematician Stanisław Ulam in 1963. 
            When integers are arranged in a spiral pattern and primes are highlighted, remarkable 
            diagonal patterns emerge that reveal hidden structures in prime distribution.
          </p>
          <ul>
            <li><strong>Blue squares:</strong> Prime numbers</li>
            <li><strong>Red square:</strong> The prime number 2</li>
            <li><strong>Green squares:</strong> Twin primes (when selected)</li>
            <li><strong>Orange squares:</strong> Composite numbers (when selected)</li>
          </ul>
          <p>
            <strong>Current grid:</strong> {size}×{size} = {size * size} numbers, 
            approximately {primeCount} primes expected.
          </p>
        </div>
      </div>
    </div>
  );
}
