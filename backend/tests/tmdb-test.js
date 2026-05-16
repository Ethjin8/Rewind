// run node test/tmdb-test.js to see the data it outputs


require('dotenv').config();

const tmdb = require('../services/tmdbService');

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

function printValue(label, value) {
  if (Array.isArray(value)) {
    console.log(`${label}: [${value.slice(0, 5).map((item) => JSON.stringify(item)).join(', ')}${value.length > 5 ? ', ...' : ''}]`);
    return;
  }

  if (value && typeof value === 'object') {
    console.log(`${label}: ${JSON.stringify(value, null, 2)}`);
    return;
  }

  console.log(`${label}: ${value}`);
}

function getMovieAccessMap(movie) {
  return {
    adult: movie.adult,
    backdrop_path: movie.backdrop_path,
    genre_ids: movie.genre_ids,
    id: movie.id,
    title: movie.title,
    original_language: movie.original_language,
    original_title: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    softcore: movie.softcore,
    video: movie.video,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
  };
}

function getMovieDetailsAccessMap(movie) {
  return {
    adult: movie.adult,
    backdrop_path: movie.backdrop_path,
    belongs_to_collection: movie.belongs_to_collection,
    budget: movie.budget,
    genres: movie.genres,
    homepage: movie.homepage,
    id: movie.id,
    imdb_id: movie.imdb_id,
    origin_country: movie.origin_country,
    original_language: movie.original_language,
    original_title: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    production_companies: movie.production_companies,
    production_countries: movie.production_countries,
    release_date: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    softcore: movie.softcore,
    spoken_languages: movie.spoken_languages,
    status: movie.status,
    tagline: movie.tagline,
    title: movie.title,
    video: movie.video,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    watch_providers: movie['watch/providers'],
    keywords: movie.keywords,
  };
}

function getConfigAccessMap(config) {
  return {
    images: {
      base_url: config.images?.base_url,
      secure_base_url: config.images?.secure_base_url,
      backdrop_sizes: config.images?.backdrop_sizes,
      logo_sizes: config.images?.logo_sizes,
      poster_sizes: config.images?.poster_sizes,
      profile_sizes: config.images?.profile_sizes,
      still_sizes: config.images?.still_sizes,
    },
    change_keys: config.change_keys,
  };
}

async function main() {
  printSection('TMDB smoke test');

  const search = await tmdb.searchMovies('avatar');
  const popular = await tmdb.getPopularMovies();
  const trending = await tmdb.getTrendingMovies();
  const details = await tmdb.getMovieDetails(550);
  const config = await tmdb.getConfiguration();

  printSection('Search movies: /search/movie');
  printValue('results.length', search.results?.length ?? 0);
  printValue('first result access map', getMovieAccessMap(search.results?.[0] || {}));

  printSection('Popular movies: /movie/popular');
  printValue('results.length', popular.results?.length ?? 0);
  printValue('first result access map', getMovieAccessMap(popular.results?.[0] || {}));

  printSection('Trending movies: /trending/movie/week');
  printValue('results.length', trending.results?.length ?? 0);
  printValue('first result access map', getMovieAccessMap(trending.results?.[0] || {}));

  printSection('Movie details: /movie/:id');
  printValue('details.title', details.title);
  printValue('details access map', getMovieDetailsAccessMap(details));

  printSection('Configuration: /configuration');
  printValue('config access map', getConfigAccessMap(config));

  printSection('Useful access examples');
  console.log('search result title -> search.results[0].title');
  console.log('search poster path -> search.results[0].poster_path');
  console.log('movie runtime -> details.runtime');
  console.log('movie genres -> details.genres');
  console.log('watch providers -> details["watch/providers"]');
  console.log('image base URL -> config.images.secure_base_url');
  console.log('poster sizes -> config.images.poster_sizes');
}

main().catch((error) => {
  console.error('TMDB smoke test failed:');
  console.error(error);
  process.exit(1);
});
