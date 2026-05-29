import { useState } from 'react';
import PosterCard from '../components/PosterCard';
import './WatchHistory.css';

// Placeholder data — replace with real API responses from the backend.
// Shape mirrors a TMDB movie object. watchedAt is app-specific (Unix ms timestamp).
const initialItems = [
  { id: 1, title: 'placeholder 1', genres: [{ id: 878, name: 'Science Fiction' }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1704844800000 },
  { id: 2, title: 'placeholder 2', genres: [{ id: 18,  name: 'Drama'           }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1706918400000 },
  { id: 3, title: 'placeholder 3', genres: [{ id: 12,  name: 'Adventure'       }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1710460800000 },
  { id: 4, title: 'placeholder 4', genres: [{ id: 878, name: 'Science Fiction' }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1713744000000 },
  { id: 5, title: 'placeholder 5', genres: [{ id: 27,  name: 'Horror'          }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1716326400000 },
  { id: 6, title: 'placeholder 6', genres: [{ id: 35,  name: 'Comedy'          }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1719004800000 },
  { id: 7, title: 'placeholder 7', genres: [{ id: 28,  name: 'Action'          }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1721683200000 },
  { id: 8, title: 'placeholder 8', genres: [{ id: 14,  name: 'Fantasy'         }], release_date: null, overview: null, poster_path: null, vote_average: null, runtime: null, 'watch/providers': { results: {} }, watchedAt: 1724352000000 },
];

// Groups an already-sorted array into [{ label, items }] by month or year.
// Order of groups follows the order of the input array.
function groupItems(sortedItems, groupBy) {
  const groups = [];
  const seen = new Map();

  for (const item of sortedItems) {
    const date = new Date(item.watchedAt);
    const key = groupBy === 'year'
      ? `${date.getFullYear()}`
      : `${date.getFullYear()}-${date.getMonth()}`;
    const label = groupBy === 'year'
      ? `${date.getFullYear()}`
      : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!seen.has(key)) {
      seen.set(key, { label, items: [] });
      groups.push(seen.get(key));
    }
    seen.get(key).items.push(item);
  }

  return groups;
}

export default function WatchHistory() {
  const [items, setItems] = useState(initialItems);
  const [sortOrder, setSortOrder] = useState('latest');
  const [groupBy, setGroupBy] = useState('month');

  const sortedItems = [...items].sort((a, b) =>
    sortOrder === 'latest' ? b.watchedAt - a.watchedAt : a.watchedAt - b.watchedAt
  );

  const groups = groupItems(sortedItems, groupBy);

  // Placeholder — will eventually call the backend
  function handleMoveToBacklog(id) {
    if (!window.confirm('Move this to your backlog?')) return;
    setItems(items.filter((item) => item.id !== id));
  }

  // Placeholder — will eventually call the backend
  function handleRemove(id) {
    if (!window.confirm('Remove this from your watch history?')) return;
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <main className="watch-history-page">
      <section className="watch-history-header">
        <div>
          <p>Completed queue</p>
          <h1>Watch History</h1>
        </div>
        <div className="history-controls">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">Latest Watched</option>
            <option value="oldest">First Watched</option>
          </select>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="month">Group by Month</option>
            <option value="year">Group by Year</option>
          </select>
        </div>
      </section>

      <section className="history-groups">
        {groups.map(({ label, items: groupItems }) => (
          <div key={label} className="history-group">
            <div className="history-group-header">
              <span>{label}</span>
              <strong>{groupItems.length} watched</strong>
            </div>

            <div className="history-grid">
              {groupItems.map((item) => (
                <PosterCard
                  key={item.id}
                  movie={item}
                  dateAdded={item.watchedAt}
                  actions={[
                    { text: 'Move to Backlog', onClick: () => handleMoveToBacklog(item.id) },
                    { text: 'Remove',          onClick: () => handleRemove(item.id) },
                  ]}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
