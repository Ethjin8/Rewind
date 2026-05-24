import { useRef, useState } from 'react';
import PosterCard from './PosterCard';
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
            <div
              key={movie.id}
              className={expanded ? '' : 'flex-none w-[170px]'}
            >
              <PosterCard
                movie={movie}
                dateAdded={movie.addedAt ? new Date(movie.addedAt).getTime() : undefined}
                actions={
                  onRemove
                    ? [{ text: 'Remove', onClick: () => onRemove(movie.id) }]
                    : []
                }
              />
            </div>
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
