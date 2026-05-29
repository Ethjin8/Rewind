import { Link } from 'react-router-dom';
import './MovieDetail.css';

function getPosterSrc(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/w500${path}`;
}

function detailPath(movie) {
  const isShow = movie.type === 'show' || movie.media_type === 'tv';
  return isShow ? `/show/${movie.id}` : `/movie/${movie.id}`;
}

export default function MovieDetail({ movie, onClose, actions = [] }) {
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
          <p className="modal-eyebrow">{movie.type === 'show' || movie.media_type === 'tv' ? 'SHOW DETAILS' : 'MOVIE DETAILS'}</p>

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
            {actions.map(({ text, onClick }) => (
              <button key={text} type="button" onClick={onClick}>
                {text}
              </button>
            ))}
            {movie.id && (
              <Link to={detailPath(movie)} className="modal-details-link">
                View Full Details →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
