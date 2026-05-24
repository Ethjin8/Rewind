const RAWG_BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

async function fetchRAWG(endpoint, params = {}) {
  const url = new URL(`${RAWG_BASE_URL}${endpoint}`);
  url.searchParams.append('key', API_KEY);

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) url.searchParams.append(key, val);
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`RAWG error: ${res.status}`);
  return res.json();
}

async function searchGames(query, page = 1) {
  return fetchRAWG('/games', { search: query, page, page_size: 20 });
}

async function getPopularGames(page = 1) {
  return fetchRAWG('/games', { ordering: '-rating', page, page_size: 20 });
}

async function getGameDetails(gameId) {
  return fetchRAWG(`/games/${gameId}`);
}

async function discoverGamesByGenre(genreSlug, page = 1) {
  return fetchRAWG('/games', { genres: genreSlug, ordering: '-rating', page, page_size: 20 });
}

async function getGenres() {
  return fetchRAWG('/genres');
}

module.exports = { searchGames, getPopularGames, getGameDetails, discoverGamesByGenre, getGenres };
