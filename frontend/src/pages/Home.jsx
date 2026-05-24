import './Home.css';

import MovieCarousel from '../components/MovieCarousel';

const backlog = [
  {
    id: 1,
    title: 'The Thing',
    genre: 'Horror',
    year: 1982,
    addedAt: '2024-01-10',
    available: true,
  },
  {
    id: 2,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    year: 2014,
    addedAt: '2024-04-20',
    available: true,
  },
  {
    id: 3,
    title: 'Old unavailable movie',
    genre: 'Drama',
    year: 2001,
    addedAt: '2023-11-01',
    available: false,
  },
  { id: 4,
    title: 'Up',
    genre: 'Animation',
    year: 2009,
    addedAt: '2024-05-15',
    available: true,
  },
  { id: 5,
    title: 'The Matrix',
    genre: 'Sci-Fi',
    year: 1999,
    addedAt: '2024-06-01',
    available: true,
  },
  { id: 6,
    title: 'Inception',
    genre: 'Sci-Fi',
    year: 2010,
    addedAt: '2024-06-10',
    available: false,
  },
  { id: 7,
    title: 'The Godfather',
    genre: 'Crime',
    year: 1972,
    addedAt: '2024-06-15',
    available: true,
  },
  { id: 8,
    title: 'Pulp Fiction',
    genre: 'Crime',
    year: 1994,
    addedAt: '2024-06-20',
    available: true,
  },
  { id: 9,
    title: 'The Shawshank Redemption',
    genre: 'Drama',
    year: 1994,
    addedAt: '2024-06-25',
    available: true,
  },
  { id: 10,
    title: 'The Dark Knight',
    genre: 'Action',
    year: 2008,
    addedAt: '2024-06-30',
    available: false,
  },
  { id: 11,
    title: 'Fight Club',
    genre: 'Drama',
    year: 1999,
    addedAt: '2024-07-01',
    available: true,
  }
];

const trending = ['Dune', 'Everything Everywhere All At Once', 'Parasite'];

export default function Home() {
  const recommended = backlog
    .filter((movie) => movie.available)
    .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))[0];

  return (
    <main className="home-page">
      {recommended && (
        <section className="recommended-hero">
          <div className="recommended-text">
            <p className="hero-description">
              TODAY'S BACKLOG RECOMMENDATION
            </p>
            <h1>{recommended.title}</h1>

            <p className="recommended-info">
              {recommended.genre} · {recommended.year} · Saved since{' '}
              {recommended.addedAt}
            </p>

            <div className="hero-buttons">
              <button type="button">DONE</button>
              <button type="button" className="secondary-button">
                REMOVE
              </button>
            </div>
          </div>

          <div className="recommended-card">
            <div className="poster-placeholder">
              <span>{recommended.title}</span>
            </div>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="section-heading">
          <p>{backlog.length} saved</p>
        </div>
        <MovieCarousel
          title="MY BACKLOG"
          movies={backlog}
        />
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2>Trending</h2>
          <p>Popular now</p>
        </div>

        <MovieCarousel
          title="Trending"
          movies={trending}
        />
      </section>
    </main>
  );
}

/* Old code below:
export default function Home() {
  return (
    <main className="home-page">

      <h1 className="text-2xl mb-6">Home</h1>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-3">Recommended For You</h2>
        <div className="grid grid-cols-3 gap-4">
          {['placeholder 1', 'placeholder 2', 'placeholder 3'].map((title) => (
            <div key={title} className="border border-gray-200 rounded p-4 text-sm text-gray-400">
              {title}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Trending</h2>
        <div className="grid grid-cols-3 gap-4">
          {['placeholder 1', 'placeholder 2', 'placeholder 3'].map((title) => (
            <div key={title} className="border border-gray-200 rounded p-4 text-sm text-gray-400">
              {title}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}



const backlog = [
  {
    id: 1,
    title: 'The Thing',
    genre: 'Horror',
    year: 1982,
    addedAt: '2024-01-10',
    available: true,
    poster: 'https://via.placeholder.com/220x330',
  },
  {
    id: 2,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    year: 2014,
    addedAt: '2024-04-20',
    available: true,
    poster: 'https://via.placeholder.com/220x330',
  },
  {
    id: 3,
    title: 'Old unavailable movie',
    genre: 'Drama',
    year: 2001,
    addedAt: '2023-11-01',
    available: false,
    poster: 'https://via.placeholder.com/220x330',
  },
];

export default function Home() {
  const recommended = backlog
    .filter((item) => item.available)
    .sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))[0];

  return (
    <main className="home-page">
      {recommended && (
        <section className="dig-hero">
          <div className="dig-poster-wrap">
            <img
              src={recommended.poster}
              alt={recommended.title}
              className="dig-poster"
            />
          </div>

          <div className="dig-info">
            <p className="dig-label">DIG IT UP</p>
            <h1>{recommended.title}</h1>
            <p className="dig-meta">
              {recommended.genre} · {recommended.year} · saved since {recommended.addedAt}
            </p>

            <div className="dig-actions">
              <button>DONE</button>
              <button className="outline-button">REMOVE</button>
            </div>
          </div>
        </section>
      )}

      <section className="backlog-section">
        <div className="section-heading">
          <h2>MY BACKLOG</h2>
          <p>{backlog.length} saved</p>
        </div>

        <div className="poster-grid">
          {backlog.map((item) => (
            <div className="poster-card" key={item.id}>
              <img src={item.poster} alt={item.title} />
              <h3>{item.title}</h3>
              <p>Saved {item.addedAt}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

*/