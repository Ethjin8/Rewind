const TMDB_BASE_URL = 'https://api.themoviedb.org/3'; // 
const API_KEY = process.env.TMDB_API_KEY; // make sure that you have a TMDB API key in .env if this isn't working


// calls TMDB : endpoint = a path like "/search/movie", "/movie/550" , params optional
async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  
  Object.entries(params).forEach(([key, val]) => {
    if (val) url.searchParams.append(key, val);
  });

  const response = await fetch(url);
  if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
  return response.json();
}

// Searches TMDB for movies that match a title query.
async function searchMovies(query, page = 1) {
  return fetchTMDB('/search/movie', { query, page });
}

// Returns detailed information for one movie, including watch providers and keywords.
async function getMovieDetails(movieId) {
  return fetchTMDB(`/movie/${movieId}`, { 
    append_to_response: 'watch/providers,keywords'
  });
}

// Returns TMDB's list of popular movies.
async function getPopularMovies(page = 1) {
  return fetchTMDB('/movie/popular', { page });
}

// Returns TMDB's trending movies for the requested time window.
async function getTrendingMovies(timeWindow = 'week') {
  return fetchTMDB(`/trending/movie/${timeWindow}`);
}

// Returns TMDB's image and configuration metadata.
async function getConfiguration() {
  return fetchTMDB('/configuration');
}

module.exports = {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getTrendingMovies,
  getConfiguration,
};
