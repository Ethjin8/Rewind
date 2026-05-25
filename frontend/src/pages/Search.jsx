import { useState } from 'react';
import PosterCard from '../components/PosterCard';

// Placeholder data — replace handleSearch with a real API call.
// Shape mirrors a TMDB movie object.
const ALL_MOVIES = [
  { id: 1,   title: 'Fight Club',                 genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],             release_date: '1999-10-15', overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.', poster_path: null, vote_average: 8.4, runtime: 139, 'watch/providers': { results: {} } },
  { id: 2,   title: 'Interstellar',                genres: [{ id: 878, name: 'Science Fiction' }, { id: 18, name: 'Drama' }],      release_date: '2014-11-07', overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', poster_path: null, vote_average: 8.4, runtime: 169, 'watch/providers': { results: {} } },
  { id: 3,   title: 'The Dark Knight',             genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],               release_date: '2008-07-18', overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.', poster_path: null, vote_average: 9.0, runtime: 152, 'watch/providers': { results: {} } },
  { id: 4,   title: 'Pulp Fiction',                genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],             release_date: '1994-09-10', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', poster_path: null, vote_average: 8.5, runtime: 154, 'watch/providers': { results: {} } },
  { id: 5,   title: 'The Matrix',                  genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],    release_date: '1999-03-31', overview: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.', poster_path: null, vote_average: 8.2, runtime: 136, 'watch/providers': { results: {} } },
  { id: 6,   title: 'Inception',                   genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],    release_date: '2010-07-16', overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', poster_path: null, vote_average: 8.4, runtime: 148, 'watch/providers': { results: {} } },
  { id: 7,   title: 'The Godfather',               genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],               release_date: '1972-03-24', overview: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.', poster_path: null, vote_average: 8.7, runtime: 175, 'watch/providers': { results: {} } },
  { id: 8,   title: 'The Shawshank Redemption',    genres: [{ id: 18, name: 'Drama' }],                                           release_date: '1994-09-23', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', poster_path: null, vote_average: 8.7, runtime: 142, 'watch/providers': { results: {} } },
  { id: 9,   title: 'The Thing',                   genres: [{ id: 27, name: 'Horror' }, { id: 878, name: 'Science Fiction' }],    release_date: '1982-06-25', overview: 'A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.', poster_path: null, vote_average: 8.1, runtime: 109, 'watch/providers': { results: {} } },
  { id: 10,  title: 'Alien',                       genres: [{ id: 27, name: 'Horror' }, { id: 878, name: 'Science Fiction' }],    release_date: '1979-05-25', overview: 'The crew of a commercial spacecraft encounters a deadly extraterrestrial creature.', poster_path: null, vote_average: 8.1, runtime: 117, 'watch/providers': { results: {} } },
  { id: 11,  title: 'Blade Runner 2049',           genres: [{ id: 878, name: 'Science Fiction' }, { id: 18, name: 'Drama' }],     release_date: '2017-10-06', overview: 'A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard.', poster_path: null, vote_average: 7.9, runtime: 164, 'watch/providers': { results: {} } },
  { id: 12,  title: 'Get Out',                     genres: [{ id: 27, name: 'Horror' }, { id: 53, name: 'Thriller' }],            release_date: '2017-02-24', overview: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness proves to be more real than imagined.', poster_path: null, vote_average: 7.7, runtime: 104, 'watch/providers': { results: {} } },
  { id: 13,  title: 'Parasite',                    genres: [{ id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }], release_date: '2019-05-30', overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', poster_path: null, vote_average: 8.5, runtime: 132, 'watch/providers': { results: {} } },
  { id: 14,  title: 'Mad Max: Fury Road',          genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],           release_date: '2015-05-15', overview: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.', poster_path: null, vote_average: 7.9, runtime: 120, 'watch/providers': { results: {} } },
  { id: 15,  title: 'Spirited Away',               genres: [{ id: 16, name: 'Animation' }, { id: 12, name: 'Adventure' }],        release_date: '2001-07-20', overview: 'A young girl wanders into a world ruled by gods, witches, and spirits where humans are changed into beasts.', poster_path: null, vote_average: 8.5, runtime: 125, 'watch/providers': { results: {} } },
];

function searchMovies(movies, titleQuery, genreQuery) {
  let results = movies;
  if (titleQuery.trim()) {
    const q = titleQuery.trim().toLowerCase();
    results = results.filter((m) => m.title?.toLowerCase().includes(q));
  }
  if (genreQuery.trim()) {
    const q = genreQuery.trim().toLowerCase();
    results = results.filter((m) =>
      m.genres?.some((g) => g.name.toLowerCase().includes(q))
    );
  }
  return results;
}

export default function Search() {
  const [title, setTitle]     = useState('');
  const [genre, setGenre]     = useState('');
  const [results, setResults] = useState(ALL_MOVIES);

  function handleSearch(e) {
    e.preventDefault();
    // TODO: replace with a real API call; assign the response to setResults().
    setResults(searchMovies(ALL_MOVIES, title, genre));
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
              placeholder="action, horror..."
              className="flex-1 px-4 py-3 bg-[#1e2a38] text-white border-2 border-[#ede4c5] placeholder:text-gray-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="self-start px-8 py-3 bg-[#ede4c5] text-black font-bold border-2 border-[#ede4c5] shadow-[4px_4px_0_black] hover:shadow-[6px_6px_0_black] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
          >
            Search
          </button>

        </form>

        {results.length > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {results.map((movie) => (
              <PosterCard
                key={movie.id}
                movie={movie}
                actions={[
                  { text: '+ Backlog', onClick: () => console.log('Add to backlog:', movie.id) },
                ]}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-left">No results found.</p>
        )}

      </div>
    </div>
  );
}
