import { useState } from 'react';
import PosterCard from '../components/PosterCard';

// Placeholder data — replace with real API responses from the backend.
// Shape mirrors a TMDB movie object. addedAt is app-specific (Unix ms timestamp).
const initialItems = [
  {
    id: 1,
    title: 'placeholder 1',
    genres: [{ id: 878, name: 'Science Fiction' }],
    release_date: null,
    overview: null,
    poster_path: null,
    vote_average: null,
    runtime: null,
    'watch/providers': { results: {} },
    addedAt: 1,
  },
  {
    id: 2,
    title: 'placeholder 2',
    genres: [{ id: 18, name: 'Drama' }],
    release_date: null,
    overview: null,
    poster_path: null,
    vote_average: null,
    runtime: null,
    'watch/providers': { results: {} },
    addedAt: 1019331,
  },
  {
    id: 3,
    title: 'placeholder 3',
    genres: [{ id: 12, name: 'Adventure' }],
    release_date: null,
    overview: null,
    poster_path: null,
    vote_average: null,
    runtime: null,
    'watch/providers': { results: {} },
    addedAt: 17100010,
  },
  {
    id: 4,
    title: 'what kind of awesome is this?',
    genres: [{ id: 878, name: 'Science Fiction' }],
    release_date: null,
    overview: null,
    poster_path: null,
    vote_average: null,
    runtime: null,
    'watch/providers': { results: {} },
    addedAt: 193813519,
  },
];

export default function Backlog() {
  const [items, setItems] = useState(initialItems);
  const [sortOrder, setSortOrder] = useState('latest');

  const sortedItems = [...items].sort((a, b) =>
    sortOrder === 'latest' ? b.addedAt - a.addedAt : a.addedAt - b.addedAt
  );

  function handleDelete(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl">DEPRECATED </h1>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="latest">Latest Added</option>
          <option value="oldest">First Added</option>
        </select>
      </div>

      {sortedItems.length > 0 && (
        <div className="w-2/3 mx-auto mb-6 flex gap-6">
          <img
            src="/testposter.webp"
            alt={sortedItems[0].title}
            className="w-48 object-cover shrink-0"
          />
          <div className="flex flex-col justify-end gap-2 text-left">
            <p className="text-2xl">{sortedItems[0].title}</p>
            <p className="text-sm text-gray-400">
              Added {new Date(sortedItems[0].addedAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(sortedItems[0].id)}
              className="w-fit px-4 py-1 bg-black text-white text-sm font-bold border-2 border-black shadow-[4px_4px_0_#555] hover:shadow-[6px_6px_0_#555] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="w-2/3 mx-auto grid grid-cols-4 gap-3">
        {sortedItems.map((movie) => (
          <PosterCard
            key={movie.id}
            movie={movie}
            dateAdded={movie.addedAt}
            actions={[{ text: 'Remove', onClick: () => handleDelete(movie.id) }]}
          />
        ))}
      </div>
    </div>
  );
}
