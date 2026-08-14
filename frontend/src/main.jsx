import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('recent-pincodes') || '[]'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('recent-pincodes', JSON.stringify(recent));
  }, [recent]);

  async function searchPin(value = pincode) {
    const pin = value.trim();
    setError('');
    setResult(null);

    if (!/^\d{6}$/.test(pin)) {
      setError('Please enter exactly 6 digits.');
      return;
    }

    setPincode(pin);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/pincode/${pin}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Lookup failed.');

      setResult(data);
      setRecent((items) => [pin, ...items.filter((item) => item !== pin)].slice(0, 5));
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchPin();
  }

  return (
    <main className="page-shell">
      <nav className="nav">
        <div className="brand">Pincode Explorer</div>
      </nav>

      <section className="hero">
        <div className="eyebrow">POSTAL LOOKUP</div>
        <h1>Find the <span>area</span> behind a PIN code.</h1>
        <p>Search a Bangalore PIN code to instantly see its post offices, area names and postal details.</p>

        <form className="search-box" onSubmit={handleSubmit}>
          <div className="pin-input-wrap">
            <span>⌕</span>
            <input
              aria-label="Bangalore PIN code"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6-digit PIN code"
              value={pincode}
              onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Explore'}</button>
        </form>

        <div className="quick-row">
          <span>Try:</span>
          {["560001", "560034", "560066", "560100"].map((pin) => (
            <button key={pin} onClick={() => searchPin(pin)}>{pin}</button>
          ))}
        </div>
      </section>

      <section className="content">
        {error && <div className="message error">{error}</div>}

        {result && (
          <div className="results">
            <div className="result-heading">
              <div>
                <div className="eyebrow">RESULT</div>
                <h2>{result.pincode}</h2>
              </div>
              <div className="count-badge">{result.areaCount} area{result.areaCount !== 1 ? 's' : ''} found</div>
            </div>

            <div className="area-grid">
              {result.areas.map((area) => (
                <article className="area-card" key={`${area.name}-${area.pinCode}`}>
                  <div className="card-top">
                    <span className="pin-dot">●</span>
                    <span className="office-type">{area.branchType || 'Post Office'}</span>
                  </div>
                  <h3>{area.name}</h3>
                  <p>{area.district} · {area.state}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {!result && !error && !loading && (
          <div className="empty-state">
            <p>Enter a PIN code above to discover the associated postal areas.</p>
          </div>
        )}
      </section>

      <footer>By Pavithra · Built for Bangalore postal exploration</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
