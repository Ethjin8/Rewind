// E: Movie Detail - Backlog/status toggles and backend wiring
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authFetch } from '../lib/authFetch';
import './MovieDetail.css';

function getPosterSrc(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/w500${path}`;
}

export default function MovieDetail({ movie, onClose, actions = [] }) {
  const [inBacklog, setInBacklog] = useState(false);
  const [watchStatus, setWatchStatus] = useState('not_started');

  useEffect(() => {
    if (movie) {
      setInBacklog(!!movie.inBacklog);
      setWatchStatus(movie.status || 'not_started');
    }
  }, [movie]);

  async function toggleBacklog() {
    if (!movie) return;
    const next = !inBacklog;
    setInBacklog(next);
    try {
      if (next) {
        const res = await authFetch(`/api/movies/${movie.id}`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to add to backlog');
      } else {
        const res = await authFetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove from backlog');
      }
    } catch (err) {
      setInBacklog(!next);
      alert(err.message || 'Backlog update failed');
    }
  }

  async function toggleWatched() {
    if (!movie) return;
    const next = watchStatus === 'completed' ? 'not_started' : 'completed';
    setWatchStatus(next);
    try {
      let res = await authFetch(`/api/backlog/status/${movie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (res.status === 404) {
        const addRes = await authFetch(`/api/movies/${movie.id}`, { method: 'POST' });
        if (!addRes.ok) throw new Error('Failed to add to backlog');
        res = await authFetch(`/api/backlog/status/${movie.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: next }),
        });
      }
      if (!res.ok) throw new Error('Failed to update status');
    } catch (err) {
      setWatchStatus((s) => (s === 'completed' ? 'not_started' : 'completed'));
      alert(err.message || 'Status update failed');
    }
  }

  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="movie-detail-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
        >
          X
        </button>

        <div className="modal-poster-wrap">
          {getPosterSrc(movie.poster_path) ? (
            <img
              className="movie-poster"
              src={getPosterSrc(movie.poster_path)}
              alt={movie.title}
            />
          ) : (
            <div className="modal-poster-placeholder">
              {movie.title}
            </div>
          )}
        </div>

        <div className="modal-info">
          <p className="modal-eyebrow">MOVIE DETAILS</p>

          <h2 className="movie-title">{movie.title}</h2>

          <div className="movie-chip-row">
            {movie.release_date  && <span>{movie.release_date}</span>}
            {movie.genres?.length > 0 && <span>{movie.genres.map(g => g.name).join(', ')}</span>}
            {movie.vote_average  != null && <span>{movie.vote_average}</span>}
            {movie.runtime       != null && <span>{movie.runtime}</span>}
          </div>

          <p className="movie-synopsis">
            {movie.overview || 'No synopsis available.'}
          </p>

          <div className="modal-actions">
            {actions.length > 0
              ? actions.map(({ text, onClick }) => (
                  <button key={text} type="button" onClick={() => { onClick(); onClose(); }}>
                    {text}
                  </button>
                ))
              : (
                <>
                  <button type="button" data-testid="modal-backlog-toggle" onClick={() => toggleBacklog()} aria-pressed={inBacklog}>
                    {inBacklog ? 'In Backlog' : '+ BACKLOG'}
                  </button>
                  <button type="button" data-testid="modal-watch-toggle" onClick={() => toggleWatched()} aria-pressed={watchStatus === 'completed'}>
                    {watchStatus === 'completed' ? 'Finished' : '✓ WATCHED'}
                  </button>
                </>
              )
            }
            {movie.id && (
              <Link to={`/movie/${movie.id}`} className="modal-details-link">
                View Full Details →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
