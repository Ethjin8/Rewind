import { useState } from 'react';
import PosterCard from '../components/PosterCard';

// Placeholder results — replaced by real API response
const PLACEHOLDER_RESULTS = [
  { id: 101, title: 'Result 1' },
  { id: 102, title: 'Result 2' },
  { id: 103, title: 'Result 3' },
  { id: 104, title: 'Result 4' },
  { id: 105, title: 'Result 5' },
  { id: 106, title: 'Result 6' },
];

export default function Search() {
  const [title, setTitle]       = useState('');
  const [genre, setGenre]         = useState('');
  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    // TODO: replace with real API call using title, genre
    setResults(PLACEHOLDER_RESULTS);
    setSearched(true);
  }

  return (
    <div className="min-h-screen bg-[#273445] font-['Saira'] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-black uppercase text-white mb-8 text-left">Search</h1>

        <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-10">

          <div className="flex gap-0">
            <label className="w-28 bg-[#ede4c5] text-black font-bold px-4 flex items-center justify-center border-2 border-r-0 border-[#ede4c5] text-sm shrink-0">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Search by title..."
              className="flex-1 px-4 py-3 bg-[#1e2a38] text-white border-2 border-[#ede4c5] placeholder:text-gray-500 outline-none"
            />
          </div>

          <div className="flex gap-0">
            <label className="w-28 bg-[#ede4c5] text-black font-bold px-4 flex items-center justify-center border-2 border-r-0 border-[#ede4c5] text-sm shrink-0">
              Genre
            </label>
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="action, adventure... "
              className="flex-1 px-4 py-3 bg-[#1e2a38] text-white border-2 border-[#ede4c5] placeholder:text-gray-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="self-start px-8 py-3 bg-[#ede4c5] text-black font-bold border-2 border-[#ede4c5] shadow-[4px_4px_0_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Search
          </button>

        </form>

        {/* Results */}
        {searched && (
          results.length > 0 ? (
            <div>
              <p className="text-[#ede4c5] text-sm font-bold mb-4 text-left">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-5 gap-6">
                {results.map((item) => (
                  <PosterCard
                    key={item.id}
                    movieId={item.id}
                    title={item.title}
                    actions={[
                      { text: '+ Backlog', onClick: () => console.log('Add to backlog:', item.id) },
                    ]}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-left">No results found.</p>
          )
        )}

      </div>
    </div>
  );
}
