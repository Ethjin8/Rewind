import { useRef, useState } from 'react';
import PosterCard from './PosterCard';
import './MovieCarousel.css';
import { hasSelectedStreamingService } from '../lib/checkAvailability';

function sortMovies(movies, order) {
  const sorted = [...movies];
  return order === 'oldest'
    ? sorted.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))
    : sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
}

function filterMovies(movies, nameQuery, genreQuery) {
  let result = movies;
  if (nameQuery.trim()) {
    const q = nameQuery.trim().toLowerCase();
    result = result.filter((m) => m.title?.toLowerCase().includes(q));
  }
  if (genreQuery.trim()) {
    const q = genreQuery.trim().toLowerCase();
    result = result.filter((m) =>
      m.genres?.some((g) => g.name.toLowerCase().includes(q))
    );
  }
  return result;
}

export default function MovieCarousel({ title, movies, getActions, emptyMessage }) {
  const rowRef = useRef(null);
  const [expanded, setExpanded]     = useState(false);
  const [sortOrder, setSortOrder]   = useState('latest');
  const [nameQuery, setNameQuery]   = useState('');
  const [genreQuery, setGenreQuery] = useState('');

  function scrollCarousel(direction) {
    rowRef.current?.scrollBy({ left: direction * 700, behavior: 'smooth' });
  }

  const visibleMovies = filterMovies(sortMovies(movies, sortOrder), nameQuery, genreQuery);
  const hasFilters = Boolean(nameQuery.trim() || genreQuery.trim());
  const isEmpty = visibleMovies.length === 0;
  const fallbackMessage = emptyMessage || 'No titles here yet.';
  const emptyStateMessage = movies.length === 0
    ? fallbackMessage
    : 'No titles match those filters.';

  const controlClass =
    'bg-transparent text-[#ede4c5] border-[3px] border-black box-border font-bold font-[Saira] text-sm px-[14px] py-[8px] outline-none';

  return (
    <section className="movie-section">
      <div className="movie-section-header">
        <h2>{title}</h2>

        <div className="flex items-stretch gap-2">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={controlClass}
            style={{ boxShadow: '4px 4px 0 black' }}
          >
            <option value="latest">Latest Added</option>
            <option value="oldest">Oldest Added</option>
          </select>

          <input
            type="text"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="Title..."
            className={`${controlClass} w-28 placeholder:text-[#ede4c580]`}
            style={{ boxShadow: '4px 4px 0 black' }}
          />

          <input
            type="text"
            value={genreQuery}
            onChange={(e) => setGenreQuery(e.target.value)}
            placeholder="Genre..."
            className={`${controlClass} w-28 placeholder:text-[#ede4c580]`}
            style={{ boxShadow: '4px 4px 0 black' }}
          />

          <button
            className="expand-button"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Collapse ↑' : 'Expand ↗'}
          </button>
        </div>
      </div>

      <div className={`carousel-shell ${expanded ? 'expanded' : ''} ${isEmpty ? 'empty' : ''}`}>
        {!expanded && !isEmpty && (
          <button className="carousel-arrow left-arrow" onClick={() => scrollCarousel(-1)}>‹</button>
        )}

        <div
          ref={rowRef}
          className={expanded ? 'movie-grid-expanded' : 'movie-carousel-row'}
        >
          {isEmpty ? (
            <div className="carousel-empty-state">
              <p>{emptyStateMessage}</p>
              {hasFilters && <span>Try a different title or genre.</span>}
            </div>
          ) : (
            visibleMovies.map((movie) => (
              <div key={movie.id} className={expanded ? '' : 'flex-none w-[170px]'}>
                <PosterCard
                  movie={movie}
                  dateAdded={movie.addedAt ? new Date(movie.addedAt).getTime() : undefined}
                  actions={getActions ? getActions(movie) : []}
                  showCircle={false}
                />
              </div>
            ))
          )}
        </div>

        {!expanded && !isEmpty && (
          <button className="carousel-arrow right-arrow" onClick={() => scrollCarousel(1)}>›</button>
        )}
      </div>
    </section>
  );
}
