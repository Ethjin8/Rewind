import { useState, useEffect } from 'react';
import PosterCard from '../components/PosterCard';
import mapMovie from '../lib/movieMapper';
import { authFetch } from '../lib/authFetch';
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

export default function Search() {
  const [title, setTitle]       = useState('');
  const [genre, setGenre]         = useState('');
  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingShows, setTrendingShows] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState('');

  useEffect(() => {
    async function fetchTrending() {
      try {
        const [moviesRes, showsRes] = await Promise.all([
          authFetch('/api/movies/trending'),
          authFetch('/api/shows/trending'),
        ]);
        if (!moviesRes.ok || !showsRes.ok) throw new Error('Failed to load trending');
        const [moviesData, showsData] = await Promise.all([moviesRes.json(), showsRes.json()]);
        setTrendingMovies((moviesData.results || []).map(mapMovie).filter(Boolean));
        setTrendingShows((showsData.results || []).map(mapMovie).filter(Boolean));
      } catch (err) {
        setTrendingError(err.message);
      } finally {
        setTrendingLoading(false);
      }
    }
    fetchTrending();
  }, []);

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
      const mapped = (data.results || []).map(mapMovie).filter(Boolean);
      setResults(searchMovies(mapped, '', genre));
      setSearched(true);
    } catch (searchError) {
      setResults([]);
      setSearched(true);
      setError(searchError.message);
    }
  }

  const genreQ = genre.trim().toLowerCase();
  const filteredTrendingMovies = genreQ
    ? trendingMovies.filter((m) => movieMatchesGenre(m, genreQ))
    : trendingMovies;
  const filteredTrendingShows = genreQ
    ? trendingShows.filter((m) => movieMatchesGenre(m, genreQ))
    : trendingShows;
  const isTitleSearch = Boolean(searched && title.trim());

  async function handleAddToBacklog(id) {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, inBacklog: true } : r)));
    try {
      const res = await authFetch(`/api/movies/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to add to backlog');
    } catch (err) {
      setResults((prev) => prev.map((r) => (r.id === id ? { ...r, inBacklog: false } : r)));
      alert(err.message || 'Failed to add to backlog');
    }
  }

  async function handleAddTrending(id, type) {
    const setter = type === 'show' ? setTrendingShows : setTrendingMovies;
    setter((prev) => prev.map((r) => (r.id === id ? { ...r, inBacklog: true } : r)));
    try {
      const endpoint = type === 'show' ? `/api/shows/${id}` : `/api/movies/${id}`;
      const res = await authFetch(endpoint, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to add to backlog');
    } catch (err) {
      setter((prev) => prev.map((r) => (r.id === id ? { ...r, inBacklog: false } : r)));
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
          {trendingLoading ? (
            <p className="trending-loading">Loading trending...</p>
          ) : trendingError ? (
            <p className="search-error">{trendingError}</p>
          ) : (
            <>
              <TrendingRail
                title="Trending movies"
                items={filteredTrendingMovies}
                onAddToBacklog={(id) => handleAddTrending(id, 'movie')}
              />
              <TrendingRail
                title="Trending shows"
                items={filteredTrendingShows}
                onAddToBacklog={(id) => handleAddTrending(id, 'show')}
              />
            </>
          )}
        </section>
      )}
    </main>
  );
}

function TrendingRail({ title, items, onAddToBacklog }) {
  return (
    <section className="trending-rail">
      <div className="search-section-header">
        <h2>{title}</h2>
      </div>
      {items.length > 0 ? (
        <div className="search-results-grid">
          {items.map((item) => (
            <PosterCard
              key={item.id}
              movie={{ ...item.raw, title: item.title }}
              actions={[
                {
                  text: '+ Backlog',
                  added: !!item.inBacklog,
                  onClick: () => !item.inBacklog && onAddToBacklog(item.id),
                },
              ]}
            />
          ))}
        </div>
      ) : (
        <div className="trending-empty">No trending titles match that genre.</div>
      )}
    </section>
  );
}
