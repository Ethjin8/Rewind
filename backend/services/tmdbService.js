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
  const data = await fetchTMDB(`/movie/${movieId}`, {
    append_to_response: 'watch/providers,keywords,credits,release_dates'
  });

  if (data['watch/providers']?.results) {
    data['watch/providers'].results = {
      US: data['watch/providers'].results.US
    };
  }

  // finding US movie ratings
  const releases = data.release_dates?.results || [];
  const usRelease = releases.find((r) => r.iso_3166_1 === 'US');
  if (usRelease && Array.isArray(usRelease.release_dates) && usRelease.release_dates.length > 0) {
    // pick the first non-empty certification
    const cert = usRelease.release_dates.find((d) => d.certification && d.certification.trim());
    data.certification = cert ? cert.certification : '';
  } else {
    data.certification = '';
  }

  return data;
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

// Discovers movies by genre using TMDB's /discover/movie endpoint.
async function discoverMoviesByGenre(genreId, page = 1) {
  return fetchTMDB('/discover/movie', { with_genres: genreId, page });
}

// TV show functions
async function searchShows(query, page = 1) {
  return fetchTMDB('/search/tv', { query, page });
}

async function getPopularShows(page = 1) {
  return fetchTMDB('/tv/popular', { page });
}

async function getTrendingShows(timeWindow = 'week') {
  return fetchTMDB(`/trending/tv/${timeWindow}`);
}

async function getShowDetails(showId) {
  const data = await fetchTMDB(`/tv/${showId}`, {
    append_to_response: 'watch/providers,content_ratings,credits'
  });

  if (data['watch/providers']?.results) {
    data['watch/providers'].results = {
      US: data['watch/providers'].results.US
    };
  }

  const ratings = data.content_ratings?.results || [];
  const usRating = ratings.find((r) => r.iso_3166_1 === 'US');
  data.certification = usRating?.rating || '';
  
  data.runtime = data.episode_run_time?.[0]
    || data.last_episode_to_air?.runtime
    || null;

  return data;
}

async function discoverShowsByGenre(genreId, page = 1) {
  return fetchTMDB('/discover/tv', { with_genres: genreId, page });
}

module.exports = {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getTrendingMovies,
  getConfiguration,
  discoverMoviesByGenre,
  searchShows,
  getPopularShows,
  getTrendingShows,
  getShowDetails,
  discoverShowsByGenre,
};
