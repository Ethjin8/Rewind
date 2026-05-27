import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import '../pages/Auth.css';
import MovieCarousel from '../components/MovieCarousel';

// Placeholder data — replace with real API responses from the backend.
// Shape mirrors a TMDB movie object. addedAt is app-specific (Unix ms timestamp).
const backlog = [
  {
    id: 1,
    title: 'The Thing',
    genres: [{ id: 27, name: 'Horror' }],
    release_date: '1982-06-25',
    overview: 'A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.',
    poster_path: null,
    vote_average: 8.1,
    runtime: 109,
    'watch/providers': { results: { US: {} } },
    addedAt: '2024-01-10',
  },
  {
    id: 2,
    title: 'Interstellar',
    genres: [{ id: 878, name: 'Science Fiction' }, { id: 18, name: 'Drama' }],
    release_date: '2014-11-07',
    overview: 'In a dystopian future where Earth has become near-uninhabitable, a team of astronauts embark on a mission to find a new home for humanity.',
    poster_path: null,
    vote_average: 8.4,
    runtime: 169,
    'watch/providers': { results: {} },
    addedAt: '2024-04-20',
  },
  {
    id: 3,
    title: 'Old unavailable movie',
    genres: [{ id: 18, name: 'Drama' }],
    release_date: '2001-03-15',
    overview: null,
    poster_path: null,
    vote_average: null,
    runtime: null,
    'watch/providers': { results: {} },
    addedAt: '2023-11-01',
  },
  {
    id: 4,
    title: 'Up',
    genres: [{ id: 16, name: 'Animation' }, { id: 12, name: 'Adventure' }],
    release_date: '2009-05-29',
    overview: null,
    poster_path: null,
    vote_average: 8.0,
    runtime: 96,
    'watch/providers': { results: { US: {} } },
    addedAt: '2024-05-15',
  },
  {
    id: 5,
    title: 'The Matrix',
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    release_date: '1999-03-31',
    overview: null,
    poster_path: null,
    vote_average: 8.2,
    runtime: 136,
    'watch/providers': { results: { US: {} } },
    addedAt: '2024-06-01',
  },
  {
    id: 6,
    title: 'Inception',
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    release_date: '2010-07-16',
    overview: null,
    poster_path: null,
    vote_average: 8.4,
    runtime: 148,
    'watch/providers': { results: {} },
    addedAt: '2024-06-10',
  },
  {
    id: 7,
    title: 'The Godfather',
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    release_date: '1972-03-24',
    overview: null,
    poster_path: null,
    vote_average: 8.7,
    runtime: 175,
    'watch/providers': { results: { US: {} } },
    addedAt: '2024-06-15',
  },
  {
    id: 8,
    title: 'Pulp Fiction',
    genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],
    release_date: '1994-09-10',
    overview: null,
    poster_path: null,
    vote_average: 8.5,
    runtime: 154,
    'watch/providers': { results: { US: {} } },
    addedAt: '2024-06-20',
  },
  {
    id: 9,
    title: 'The Shawshank Redemption',
    genres: [{ id: 18, name: 'Drama' }],
    release_date: '1994-09-23',
    overview: null,
    poster_path: null,
    vote_average: 8.7,
    runtime: 142,
    'watch/providers': { results: { US: {} } },
    addedAt: '2024-06-25',
  },
  {
    id: 10,
    title: 'The Dark Knight',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
    release_date: '2008-07-18',
    overview: null,
    poster_path: null,
    vote_average: 9.0,
    runtime: 152,
    'watch/providers': { results: {} },
    addedAt: '2024-06-30',
  },
  {
    id: 11,
    title: 'Fight Club',
    genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    release_date: '1999-10-15',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    poster_path: null,
    vote_average: 8.4,
    runtime: 139,
    'watch/providers': { results: {} },
    addedAt: '2024-07-01',
  },
];

const INITIAL_BACKLOG = backlog;

export default function Home() {
  const location = useLocation();
  const loginMsg = location.state?.message;
  const [backlogItems, setBacklogItems] = useState(INITIAL_BACKLOG);

  const availableBacklog = backlogItems.filter(
    (movie) => Object.keys(movie['watch/providers']?.results ?? {}).length > 0
  );

  const recommended = availableBacklog
    .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))[0];

  // Placeholder — will call the backend
  function handleWatched(id) {
    setBacklogItems((prev) => prev.filter((m) => m.id !== id));
  }

  // Placeholder — will call the backend
  function handleRemove(id) {
    setBacklogItems((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className="home-page">
      {loginMsg && <p className="toast-message success-message">{loginMsg}</p>}
      {recommended && (
        <section className="recommended-hero">
          <div className="recommended-text">
            <p className="hero-description">
              TODAY'S BACKLOG RECOMMENDATION
            </p>
            <h1>{recommended.title}</h1>
            <p className="recommended-info">
              {recommended.genres?.[0]?.name} · {recommended.release_date} · Saved since{' '}
              {recommended.addedAt}
            </p>

            <div className="hero-buttons">
              <button type="button">DONE</button>
              <button type="button">REMOVE</button>
            </div>
          </div>

          <div className="recommended-card">
            <img
              src={recommended.poster_path}
              alt={recommended.title}
              className="recommended-hero-image"
            />
          </div>
        </section>
      )}

      <section className="home-section">
        <MovieCarousel
          title="MY BACKLOG"
          movies={backlogItems}
          getActions={(movie) => [
            { text: 'Watched', onClick: () => handleWatched(movie.id) },
            { text: 'Remove',  onClick: () => handleRemove(movie.id)  },
          ]}
        />
        <MovieCarousel
          title="Available on my streaming services"
          movies={availableBacklog}
          getActions={(movie) => [
            { text: 'Watched', onClick: () => handleWatched(movie.id) },
            { text: 'Remove',  onClick: () => handleRemove(movie.id)  },
          ]}
        />
      </section>
    </main>
  );
}
