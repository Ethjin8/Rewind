import './MovieCarousel.css';
import './MovieDetail.css';

import './MovieDetail.css';

export default function MovieDetail({ movie, onClose }) {
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
          {movie.posterUrl ? (
            <img
              className="movie-poster"
              src={movie.posterUrl}
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
            {movie.year && <span>{movie.year}</span>}
            {movie.genre && <span>{movie.genre}</span>}
            {movie.rating && <span>{movie.rating}</span>}
            {movie.length && <span>{movie.length}</span>}
          </div>

          <p className="movie-synopsis">
            {movie.synopsis || 'Synopsis will be populated from the API.'}
          </p>

          <p className="movie-availability">
            {movie.available
              ? 'Available on your streaming services'
              : 'Not available on your streaming services'}
          </p>

          <div className="modal-actions">
            <button type="button">+ BACKLOG</button>
            <button type="button">✓ WATCHED</button>
          </div>
        </div>
      </div>
    </div>
  );
}