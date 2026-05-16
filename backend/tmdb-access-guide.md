## 1) Search movies
Endpoint: `tmdb.searchMovies('avatar')`

Response access:
- `search.results` -> array of movie results
- `search.results[0].title` -> movie title
- `search.results[0].poster_path` -> poster image path
- `search.results[0].overview` -> short description
- `search.results[0].release_date` -> release date
- `search.results[0].genre_ids` -> list of genre IDs
- `search.results[0].vote_average` -> average rating
- `search.results[0].vote_count` -> vote total
- `search.results[0].popularity` -> popularity score
- `search.results[0].adult` -> adult-content flag
- `search.results[0].backdrop_path` -> backdrop image path
- `search.results[0].id` -> TMDB movie id
- `search.results[0].original_language` -> original language code
- `search.results[0].original_title` -> original title
- `search.results[0].video` -> video flag
- `search.results[0].softcore` -> TMDB-provided softcore flag when present

## 2) Popular movies
Endpoint: `tmdb.getPopularMovies()`

Response access:
- `popular.results` -> array of movie results
- Same access pattern as `search.results[0]` for each movie item

## 3) Trending movies
Endpoint: `tmdb.getTrendingMovies()`

Response access:
- `trending.results` -> array of movie results
- Same access pattern as `search.results[0]` for each movie item

## 4) Movie details
Endpoint: `tmdb.getMovieDetails(550)`

Response access:
- `details.title` -> movie title
- `details.overview` -> full description
- `details.runtime` -> runtime in minutes
- `details.release_date` -> release date
- `details.genres` -> array of genre objects
- `details.genres[i].name` -> genre name
- `details.homepage` -> official site
- `details.imdb_id` -> IMDb id
- `details.budget` -> production budget
- `details.revenue` -> box office revenue
- `details.status` -> release status
- `details.tagline` -> tagline
- `details.poster_path` -> poster image path
- `details.backdrop_path` -> backdrop image path
- `details.production_companies` -> production company list
- `details.production_countries` -> production country list
- `details.spoken_languages` -> language list
- `details.belongs_to_collection` -> collection info
- `details.vote_average` -> average rating
- `details.vote_count` -> number of votes
- `details['watch/providers']` -> streaming provider data
- `details.keywords` -> keyword data
- `details.softcore` -> TMDB-provided flag when present

## 5) Configuration
Endpoint: `tmdb.getConfiguration()`

Response access:
- `config.images.base_url` -> image base URL
- `config.images.secure_base_url` -> secure image base URL
- `config.images.backdrop_sizes` -> allowed backdrop image sizes
- `config.images.logo_sizes` -> allowed logo image sizes
- `config.images.poster_sizes` -> allowed poster image sizes
- `config.images.profile_sizes` -> allowed profile image sizes
- `config.images.still_sizes` -> allowed still image sizes
- `config.change_keys` -> list of fields TMDB tracks for changes

## 6) Practical examples
- Poster URL: `config.images.secure_base_url + 'w342' + movie.poster_path`
- Backdrop URL: `config.images.secure_base_url + 'w780' + movie.backdrop_path`
- Genre names: `details.genres.map((genre) => genre.name)`
- Watch provider info: `details['watch/providers'].results.US`

## 7) Script output
The smoke test script prints:
- result counts for search, popular, and trending
- a field access map for a sample result
- a field access map for movie details
- a field access map for configuration
