// src/components/MovieCarousel.jsx
import { useRef, useState } from 'react';
import './MovieCarousel.css';

export default function MovieCarousel({ title, movies, onRemove }) {
  const rowRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  function scrollCarousel(direction) {
    rowRef.current?.scrollBy({
      left: direction * 700,
      behavior: 'smooth',
    });
  }

  return (
    <section className="movie-section">
      <div className="movie-section-header">
        <h2>{title}</h2>
        <button
          className="expand-button"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Collapse ↑' : 'Expand ↗'}
        </button>
      </div>

      <div className={`carousel-shell ${expanded ? 'expanded' : ''}`}>
        {!expanded && (
          <button
            className="carousel-arrow left-arrow"
            onClick={() => scrollCarousel(-1)}
          >
            ‹
          </button>
        )}

        <div
          ref={rowRef}
          className={expanded ? 'movie-grid-expanded' : 'movie-carousel-row'}
        >
          {movies.map((movie) => (
            <article key={movie.id} className="movie-card">
              <div className="poster-frame">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} />
                ) : (
                  <div className="poster-placeholder">
                    {movie.title}
                  </div>
                )}
              </div>

              <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-tags">
                  {movie.year && <span>{movie.year} / </span>}
                  {movie.genre && <span>{movie.genre}</span>}
                </div>

                {onRemove && (
                  <button
                    className="remove-button"
                    onClick={() => onRemove(movie.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {!expanded && (
          <button
            className="carousel-arrow right-arrow"
            onClick={() => scrollCarousel(1)}
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}