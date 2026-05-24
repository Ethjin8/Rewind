import './MovieCarousel.css';
import './MovieDetail.css';

export default function MovieDetail({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="movie-detail-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <img className="movie-poster" src={movie.posterUrl} alt={movie.title} />
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
        >
          X
        </button>

        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-synopsis">
            {movie.synopsis}
        </p>
        <div className="movie-description">
        <p>
          {movie.year} · {movie.genre}
        </p>

        <p>
          {movie.available
            ? 'Available on your streaming services'
            : 'Not available on your streaming services'}
        </p>
        </div>
      </div>
    </div>
  );
}