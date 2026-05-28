import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import '../pages/Auth.css';
import MovieCarousel from '../components/MovieCarousel';
import { authFetch } from '../lib/authFetch';

const INITIAL_BACKLOG = [];

function getPosterSrc(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/w500${path}`;
}

export default function Home() {
  const location = useLocation();
  const loginMsg = location.state?.message;
  const [backlogItems, setBacklogItems] = useState(() =>
    INITIAL_BACKLOG.map((m) => ({ ...m, status: m.status || 'not_started', removed: false }))
  );
  const [availableItems, setAvailableItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await authFetch('/api/backlog/full');
        if (!res.ok) throw new Error('Failed to load backlog');
        const data = await res.json();
        if (!mounted) return;
        setBacklogItems(data.map((m) => ({ ...m, status: m.status || 'not_started', removed: false })));

        const aRes = await authFetch('/api/backlog/available');
        if (aRes.ok) {
          const aData = await aRes.json();
          if (!mounted) return;
          setAvailableItems(aData || []);
        }
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const availableBacklog = availableItems.length > 0
    ? availableItems
    : backlogItems.filter((movie) => !movie.removed && Object.keys(movie['watch/providers']?.results ?? {}).length > 0);

  const recommended = availableBacklog
    .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))[0];

  // Toggle watched state and persist
  async function handleWatched(id) {
    setBacklogItems((prev) => prev.map((m) => (m.id === id ? { ...m, status: m.status === 'completed' ? 'not_started' : 'completed' } : m)));
    const movie = backlogItems.find((m) => m.id === id);
    const nextStatus = movie?.status === 'completed' ? 'not_started' : 'completed';
    try {
      // Try to PATCH status first
      let res = await authFetch(`/api/backlog/status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.status === 404) {
        // Not in backlog yet — add then patch
        const addRes = await authFetch(`/api/movies/${id}`, { method: 'POST' });
        if (!addRes.ok) throw new Error('Failed to add to backlog');
        res = await authFetch(`/api/backlog/status/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        });
      }
      if (!res.ok) throw new Error('Failed to update watched status');
    } catch (err) {
      // rollback local change
      setBacklogItems((prev) => prev.map((m) => (m.id === id ? { ...m, status: m.status === 'completed' ? 'not_started' : 'completed' } : m)));
      alert(err.message || 'Failed to update watched status');
    }
  }

  // Toggle removed state and persist
  async function handleRemove(id) {
    setBacklogItems((prev) => prev.map((m) => (m.id === id ? { ...m, removed: !m.removed } : m)));
    const movie = backlogItems.find((m) => m.id === id);
    const willRemove = !(movie?.removed);
    try {
      if (willRemove) {
        const res = await authFetch(`/api/movies/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove from backlog');
      } else {
        const res = await authFetch(`/api/movies/${id}`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to restore to backlog');
      }
    } catch (err) {
      // rollback
      setBacklogItems((prev) => prev.map((m) => (m.id === id ? { ...m, removed: movie?.removed } : m)));
      alert(err.message || 'Failed to update backlog removal');
    }
  }

  return (
    <main className="home-page">
      {loginMsg && <p className="toast-message success-message">{loginMsg}</p>}
      {loading && <p className="toast-message">Loading backlog…</p>}
      {error && <p className="toast-message error-message">{error}</p>}
      {recommended && (
        <section className="recommended-hero">
          <div className="recommended-text">
            <p className="hero-description">
              TODAY'S BACKLOG RECOMMENDATION
            </p>
            <h1>{recommended.title}</h1>
              <p className="recommended-info">
                {recommended.genres?.[0]?.name} · {recommended.release_date || recommended.releaseDate || ''} · Saved since{' '}
                {new Date(recommended.date_added || recommended.addedAt || recommended.addedAt).toLocaleDateString()}
              </p>

              <p className="recommended-synopsis">
                {recommended.overview ? recommended.overview : 'No synopsis available.'}
              </p>

              <div className="hero-buttons">
                <button type="button">DONE</button>
                <button type="button">REMOVE</button>
              </div>
          </div>

          <div className="recommended-card">
            <img
              src={getPosterSrc(recommended.poster_path)}
              alt={recommended.title}
              className="recommended-hero-image"
            />
          </div>
        </section>
      )}

      <section className="home-section">
        <MovieCarousel
          title="MY BACKLOG"
          movies={backlogItems.filter((m) => !m.removed)}
          getActions={(movie) => [
            { text: movie.status === 'completed' ? 'Undo Watched' : 'Watched', onClick: () => handleWatched(movie.id) },
            { text: movie.removed ? 'Restore' : 'Remove',  onClick: () => handleRemove(movie.id)  },
          ]}
        />
        <MovieCarousel
          title="Available on my streaming services"
          movies={availableBacklog}
          getActions={(movie) => [
            { text: movie.status === 'completed' ? 'Undo Watched' : 'Watched', onClick: () => handleWatched(movie.id) },
            { text: movie.removed ? 'Restore' : 'Remove',  onClick: () => handleRemove(movie.id)  },
          ]}
        />
      </section>
    </main>
  );
}
