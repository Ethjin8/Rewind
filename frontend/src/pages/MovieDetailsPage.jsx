import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mapMovie from '../lib/movieMapper';
import { authFetch } from '../lib/authFetch';

const STATUS_LABELS = {
  not_started: 'Not started',
  completed: 'Finished',
};

function normalizeStatus(status) {
  return status === 'completed' ? 'completed' : 'not_started';
}

function getStatusLabel(status) {
  return STATUS_LABELS[normalizeStatus(status)];
}

function useFetchMovie(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadMovie() {
      try {
        setLoading(true);
        setError('');

        const response = await authFetch(`/api/movies/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to load movie (${response.status})`);
        }

        const data = await response.json();
        if (cancelled) return;

        const normalized = mapMovie(data);
        setMovie(normalized);
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
          setMovie(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadMovie();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { loading, movie, error };
}



const TABS = ['Details', 'Cast', 'IMDB'];

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, movie, error } = useFetchMovie(id);
  const [activeTab, setActiveTab] = useState('Details');
  const [watchStatus, setWatchStatus] = useState('not_started');

  const [inBacklog, setInBacklog] = useState(false);

  useEffect(() => {
    if (movie) {
      setWatchStatus(normalizeStatus(movie.status));
    }
  }, [movie]);

  // Load per-user backlog/status for this movie (if authenticated)
  useEffect(() => {
    let cancelled = false;
    async function loadUserStatus() {
      try {
        const res = await authFetch(`/api/movies/${id}/status`);
        if (!res.ok) return;
        const rows = await res.json();
        if (cancelled) return;
        if (rows && rows[0]) {
          setInBacklog(true);
          setWatchStatus(normalizeStatus(rows[0].status));
        } else {
          setInBacklog(false);
        }
      } catch (err) {
        // ignore silently
      }
    }

    if (id) loadUserStatus();
    return () => { cancelled = true; };
  }, [id]);

  const isFinished = watchStatus === 'completed';

  async function handleToggleStatus() {
    if (!movie) return;
    const next = watchStatus === 'completed' ? 'not_started' : 'completed';
    setWatchStatus(next); // optimistic
    try {
      const res = await authFetch(`/api/backlog/status/${movie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('Failed to update status');
    } catch (err) {
      // rollback
      setWatchStatus((s) => (s === 'completed' ? 'not_started' : 'completed'));
      alert(err.message || 'Status update failed');
    }
  }

  async function handleToggleBacklog() {
    if (!movie) return;
    const next = !inBacklog;
    setInBacklog(next); // optimistic
    try {
      if (next) {
        const res = await authFetch(`/api/movies/${movie.id}`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to add to backlog');
      } else {
        const res = await authFetch(`/api/movies/${movie.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove from backlog');
      }
    } catch (err) {
      setInBacklog(!next); // rollback
      alert(err.message || 'Backlog update failed');
    }
  }

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  // error handling
  if (error) return <p className="p-6 text-white">{error}</p>;
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
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-52 shrink-0 object-cover border-2 border-white shadow-[12px_12px_0_rgba(0,0,0,0.5)]"
            />
          ) : (
            <div className="w-52 aspect-[2/3] shrink-0 object-cover border-2 border-white shadow-[12px_12px_0_rgba(0,0,0,0.5)] bg-black/30 flex items-center justify-center px-4 text-center text-sm text-[#ede4c5]">
              No poster available
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col gap-4 text-left pt-2">
            <h1 className="text-5xl font-black uppercase leading-none text-white">
              {movie.title}
            </h1>

            {/* Detail chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'year', value: movie.year },
                { label: 'cert', value: movie.certification || movie.rating || (movie.adult ? '18+' : '') },
                { label: 'length', value: movie.length },
                { label: 'genre', value: movie.genre },
              ].map((item, idx) => (
                item.value ? (
                  <span
                    key={`${item.label}-${idx}`}
                    className="border-2 border-[#ede4c5] px-3 py-0.5 text-sm font-bold text-[#ede4c5] shadow-[3px_3px_0_rgba(0,0,0,0.4)]"
                  >
                    {item.value}
                  </span>
                ) : null
              ))}
            </div>

            <p className="text-sm leading-relaxed text-gray-300 max-w-md">
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 mt-auto">
              <button
                type="button"
                onClick={handleToggleBacklog}
                aria-pressed={inBacklog}
                data-testid="add-to-backlog"
                className={`px-5 py-2 font-bold border-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-all ${inBacklog ? 'bg-[#ede4c5] text-black border-[#ede4c5]' : 'bg-transparent text-[#ede4c5] border-[#ede4c5]'}`}
              >
                {inBacklog ? 'In Backlog' : '+ Backlog'}
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                data-testid="status-toggle"
                aria-pressed={isFinished}
                className={`px-5 py-2 font-bold border-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-all ${
                  isFinished
                    ? 'bg-[#ede4c5] text-black border-[#ede4c5]'
                    : 'bg-transparent text-[#ede4c5] border-[#ede4c5]'
                }`}
              >
                {isFinished ? 'Finished' : 'Not started'}
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
              <div className="text-sm text-gray-300 space-y-3">
                <p>
                  <strong>Status:</strong> {getStatusLabel(watchStatus)}
                  <span className="ml-2 text-xs uppercase tracking-[0.2em] text-[#ede4c5]/70">local only</span>
                </p>
                <p><strong>Runtime:</strong> {movie.length}</p>
                <p><strong>Genres:</strong> {movie.genre}</p>
                <p><strong>Rating:</strong> {movie.certification || (movie.vote_average ? `${movie.vote_average} / 10` : 'N/A')}</p>
                {movie.homepage && (
                  <p><a href={movie.homepage} target="_blank" rel="noreferrer" className="underline">Official site</a></p>
                )}
                <p className="text-sm text-gray-400">{movie.synopsis}</p>
              </div>
            )}

            {activeTab === 'Cast' && (
              <div className="text-sm text-gray-300">
                {movie.credits?.cast?.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {movie.credits.cast.slice(0, 12).map((c) => (
                      <li key={c.id || c.cast_id} className="py-1">
                        <strong>{c.name}</strong> as {c.character}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No cast information available.</p>
                )}
              </div>
            )}

            {activeTab === 'IMDB' && (
              <div className="text-sm text-gray-300">
                {movie.imdbUrl ? (
                  <a href={movie.imdbUrl} target="_blank" rel="noreferrer" className="underline">Open on IMDB</a>
                ) : (
                  <p className="text-gray-400">No IMDB link available.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
