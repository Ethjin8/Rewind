import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Placeholder — replace with a real fetch to /api/movies/:id which returns a TMDB movie object.
function useFetchMovie(id) {
  return {
    loading: false,
    movie: {
      id,
      title: 'Movie Title',
      release_date: '2024-01-01',
      runtime: 135,
      genres: [{ id: 878, name: 'Science Fiction' }],
      overview: 'Synopsis will be populated from the API.',
      poster_path: '/testposter.webp',
      vote_average: null,
      imdb_id: null,
      'watch/providers': { results: {} },
    },
  };
}

// Placeholder
function handleAddToBacklog(id) {
  console.log('Add to backlog:', id);
}

// Placeholder
function handleAddToWatched(id) {
  console.log('Add to watched:', id);
}

const TABS = ['Details', 'Cast', 'IMDB'];

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, movie } = useFetchMovie(id);
  const [activeTab, setActiveTab] = useState('Details');

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (!movie)  return <p className="p-6 text-white">Movie not found.</p>;

  return (
    <div className="min-h-screen bg-[#273445] font-['Saira']">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-bold border-2 border-[#ede4c5] px-3 py-1 text-[#ede4c5] shadow-[4px_4px_0_#ede4c5] hover:shadow-[6px_6px_0_#ede4c5] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all bg-transparent"
        >
          ← Back
        </button>

        {/* Top section: poster + info */}
        <div className="flex gap-8 mb-0">

          {/* Poster */}
          {movie.poster_path && (
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-52 shrink-0 object-cover border-2 border-white shadow-[12px_12px_0_rgba(0,0,0,0.5)]"
            />
          )}

          {/* Info */}
          <div className="flex flex-col gap-4 text-left pt-2">
            <h1 className="text-5xl font-black uppercase leading-none text-white">
              {movie.title}
            </h1>

            {/* Detail chips */}
            <div className="flex flex-wrap gap-2">
              {[
                movie.release_date,
                movie.genres?.map(g => g.name).join(', '),
                movie.vote_average,
                movie.runtime,
              ]
                .filter((val) => val != null && val !== '')
                .map((val) => (
                  <span
                    key={val}
                    className="border-2 border-[#ede4c5] px-3 py-0.5 text-sm font-bold text-[#ede4c5] shadow-[3px_3px_0_rgba(0,0,0,0.4)]"
                  >
                    {val}
                  </span>
                ))}
            </div>

            <p className="text-sm leading-relaxed text-gray-300 max-w-md">
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => handleAddToBacklog(movie.id)}
                className="px-5 py-2 bg-[#ede4c5] text-black font-bold border-2 border-[#ede4c5] shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                + Backlog
              </button>
              <button
                onClick={() => handleAddToWatched(movie.id)}
                className="px-5 py-2 bg-transparent text-[#ede4c5] font-bold border-2 border-[#ede4c5] shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 active:bg-[#ede4c5] active:text-black transition-all"
              >
                ✓ Watched
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex border-b-2 border-[#ede4c5]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 font-bold border-2 border-b-0 text-sm -mb-[2px] transition-all hover:-translate-y-0.5 active:translate-y-0.5
                  ${activeTab === tab
                    ? 'bg-[#ede4c5] text-black border-[#ede4c5]'
                    : 'bg-transparent text-[#ede4c5] border-[#ede4c5] hover:bg-white/10'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="border-2 border-t-0 border-[#ede4c5] p-6 bg-[#1e2a38] shadow-[6px_6px_0_rgba(0,0,0,0.4)]">
            {activeTab === 'Details' && (
              <p className="text-sm text-gray-400">Details</p>
            )}
            {activeTab === 'Cast' && (
              // Cast comes from a separate TMDB credits endpoint (/movie/:id/credits)
              <p className="text-sm text-gray-400">Cast information</p>
            )}
            {activeTab === 'IMDB' && (
              movie.imdb_id
                ? <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#ede4c5] underline"
                  >
                    https://www.imdb.com/title/{movie.imdb_id}
                  </a>
                : <p className="text-sm text-gray-400">No IMDB link available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
