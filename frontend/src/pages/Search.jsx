import { useState } from 'react';
import PosterCard from '../components/PosterCard';
import mapMovie from '../lib/movieMapper';
import { authFetch } from '../lib/authFetch';
import { hasSelectedStreamingService } from '../lib/checkAvailability';
import './Search.css';

const MOVIE_GENRES_BY_ID = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  14: 'Fantasy',
  27: 'Horror',
  878: 'Science Fiction',
  53: 'Thriller',
};

const trendingMovies = createTrendingItems([
  ['Dune: Part Two', ['Science Fiction', 'Adventure']],
  ['Furiosa', ['Action', 'Adventure']],
  ['Challengers', ['Drama']],
  ['Civil War', ['Action', 'Drama']],
  ['The Fall Guy', ['Action', 'Comedy']],
  ['Inside Out 2', ['Animation', 'Comedy']],
  ['Kingdom of the Planet of the Apes', ['Science Fiction', 'Adventure']],
  ['Godzilla x Kong', ['Action', 'Science Fiction']],
  ['Twisters', ['Action', 'Thriller']],
  ['A Quiet Place: Day One', ['Horror', 'Science Fiction']],
  ['Deadpool & Wolverine', ['Action', 'Comedy']],
  ['Alien: Romulus', ['Horror', 'Science Fiction']],
  ['The Substance', ['Horror', 'Drama']],
  ['Longlegs', ['Horror', 'Crime']],
  ['Anora', ['Drama', 'Comedy']],
  ['Nosferatu', ['Horror', 'Fantasy']],
  ['Wicked', ['Fantasy']],
  ['Conclave', ['Drama', 'Thriller']],
  ['The Wild Robot', ['Animation', 'Adventure']],
  ['Gladiator II', ['Action', 'Drama']],
], 'movie');

const trendingShows = createTrendingItems([
  ['Shogun', ['Drama', 'Adventure']],
  ['Fallout', ['Science Fiction', 'Action']],
  ['The Bear', ['Drama', 'Comedy']],
  ['House of the Dragon', ['Fantasy', 'Drama']],
  ['The Boys', ['Action', 'Comedy']],
  ['Presumed Innocent', ['Crime', 'Drama']],
  ['Ripley', ['Crime', 'Drama']],
  ['Baby Reindeer', ['Drama']],
  ['True Detective', ['Crime', 'Drama']],
  ['The Penguin', ['Crime', 'Drama']],
  ['Slow Horses', ['Thriller', 'Comedy']],
  ['Only Murders in the Building', ['Comedy', 'Crime']],
  ['Mr. & Mrs. Smith', ['Action', 'Comedy']],
  ['Abbott Elementary', ['Comedy']],
  ['The Regime', ['Comedy', 'Drama']],
  ['Masters of the Air', ['Drama', 'Action']],
  ['X-Men 97', ['Animation', 'Action']],
  ['Industry', ['Drama']],
  ['Silo', ['Science Fiction', 'Drama']],
  ['Hacks', ['Comedy', 'Drama']],
], 'show');

function createTrendingItems(items, type) {
  return items.map(([title, genres], index) => ({
    id: `${type}-${index + 1}`,
    title,
    genres,
    type,
    rank: index + 1,
    year: index < 10 ? '2024' : '2025',
  }));
}

function searchMovies(movies, titleQuery, genreQuery) {
  let results = movies;
  if (titleQuery.trim()) {
    const q = titleQuery.trim().toLowerCase();
    results = results.filter((m) => m.title?.toLowerCase().includes(q));
  }
  if (genreQuery.trim()) {
    const q = genreQuery.trim().toLowerCase();
    results = results.filter((movie) => movieMatchesGenre(movie, q));
  }
  return results;
}

function movieMatchesGenre(movie, genreQuery) {
  if (movie.genre?.toLowerCase().includes(genreQuery)) return true;
  return movie.raw?.genre_ids?.some((id) =>
    MOVIE_GENRES_BY_ID[id]?.toLowerCase().includes(genreQuery)
  );
}

function filterTrendingItems(items, genreQuery) {
  if (!genreQuery.trim()) return items;
  const q = genreQuery.trim().toLowerCase();
  return items.filter((item) =>
    item.genres.some((genreName) => genreName.toLowerCase().includes(q))
  );
}

export default function Search() {
  const [title, setTitle]       = useState('');
  const [genre, setGenre]         = useState('');
  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  async function fetchMovieDetails(movieId) {
  const response = await authFetch(`/api/movies/${movieId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
}

  async function handleSearch(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    try {
      const response = await authFetch(`/api/movies/search?query=${encodeURIComponent(title.trim())}`);
      if (!response.ok) {
        throw new Error(`Search failed (${response.status})`);
      }

      
      const data = await response.json();

      const moviesWithDetails = await Promise.all(
  (data.results || []).map(async (movie) => {
    const detailsResponse = await authFetch(`/api/movies/${movie.id}`);

    if (!detailsResponse.ok) {
      return movie;
    }

    const details = await detailsResponse.json();

    return {
      ...movie,
      ...details,
    };
  })
);

      const backlogResponse = await authFetch('/api/backlog/sorted');
      const backlogData = backlogResponse.ok ? await backlogResponse.json() : [];

      const backlogIds = new Set(
        backlogData
          .filter((item) => item.type === 'movie')
          .map((item) => String(item.movie_show_id))
      );

      const mapped = moviesWithDetails
        .map(mapMovie)
        .filter(Boolean)
        .map((movie) => ({
          ...movie,
          inBacklog: backlogIds.has(String(movie.id)),
        }));

      setResults(searchMovies(mapped, '', genre));
      setSearched(true);
      
        } catch (searchError) {
          setResults([]);
          setSearched(true);
          setError(searchError.message);
        } finally {
          setSearchLoading(false);
        }
      }

  const filteredTrendingMovies = filterTrendingItems(trendingMovies, genre);
  const filteredTrendingShows = filterTrendingItems(trendingShows, genre);
  const isTitleSearch = Boolean(searched && title.trim());

  async function handleAddToBacklog(id) {
    // optimistic UI: mark as added immediately
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, inBacklog: true } : r)));
    try {
      const res = await authFetch(`/api/movies/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to add to backlog');
    } catch (err) {
      // rollback
      setResults((prev) => prev.map((r) => (r.id === id ? { ...r, inBacklog: false } : r)));
      alert(err.message || 'Failed to add to backlog');
    }
  }

  return (
    <main className="search-page">
      <section className="search-hero">
        <div className="search-hero-copy">
          <span className="search-icon" aria-hidden="true" />
          <h1>Explore</h1>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-field">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Search by title..."
            />
          </div>

          <div className="search-field">
            <label>Genre</label>
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="action, horror..."
            />
          </div>

          <button type="submit">
            Search
          </button>
        </form>
      </section>

      <section className="search-results-section">
        {isTitleSearch && (
          error ? (
            <p className="search-error">{error}</p>
          ) : results.length > 0 ? (
            <>
              <div className="search-section-header">
                <h2>Search results</h2>
                <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="search-results-grid">
                {results.map((item) => (
                  <PosterCard
                    key={item.id}
                    movie={item.raw}
                    showAvail={hasSelectedStreamingService(item.raw)}
                    inBacklog={!!item.inBacklog}
                    actions={[
                      {
                        text: item.inBacklog ? 'Added' : '+ Backlog',
                        added: !!item.inBacklog,
                        onClick: () => !item.inBacklog && handleAddToBacklog(item.id),
                      },
                    ]}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="search-empty-state">
              <h2>No results found</h2>
              <p>Try a different title or clear the genre filter.</p>
            </div>
          )
        )}
      </section>

      {!isTitleSearch && (
        <section className="trending-section">
          <TrendingRail title="Top 20 trending movies" items={filteredTrendingMovies} />
          <TrendingRail title="Top 20 trending shows" items={filteredTrendingShows} />
        </section>
      )}
    </main>
  );
}

function TrendingRail({ title, items }) {
  return (
    <section className="trending-rail">
      <div className="search-section-header">
        <h2>{title}</h2>
        <span>Placeholder UI</span>
      </div>
      <div className="trending-grid">
        {items.length > 0 ? (
          items.map((item) => (
            <article key={item.id} className="trending-card">
              <span className="trending-rank">{String(item.rank).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.type} · {item.year} · {item.genres.join(', ')}</p>
              </div>
            </article>
          ))
        ) : (
          <div className="trending-empty">No placeholder titles match that genre.</div>
        )}
      </div>
    </section>
  );
}