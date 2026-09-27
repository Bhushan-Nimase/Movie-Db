const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE    = "https://api.themoviedb.org/3";

// ── Core fetch helper — surfaces real TMDB errors instead of swallowing them ──
async function tmdbFetch(path) {
  if (!API_KEY) {
    const err = new Error('No TMDB API key found in .env (VITE_TMDB_API_KEY).');
    err.code = 'MISSING_KEY';
    throw err;
  }

  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE}${path}${sep}api_key=${API_KEY}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    const err = new Error(data.status_message || `TMDB request failed (${res.status})`);
    err.code = data.status_code === 7 ? 'INVALID_KEY' : 'API_ERROR';
    err.status = res.status;
    throw err;
  }
  return data;
}

// ── Popular movies ─────────────────────────────────────────────────
export const fetchPopular = async (page = 1) => {
  const data = await tmdbFetch(`/movie/popular?page=${page}`);
  return data.results || [];
};

// ── Trending this week ─────────────────────────────────────────────
export const fetchTrending = async (page = 1) => {
  const data = await tmdbFetch(`/trending/movie/week?page=${page}`);
  return data.results || [];
};

// ── Now playing ─────────────────────────────────────────────────────
export const fetchNowPlaying = async (page = 1) => {
  const data = await tmdbFetch(`/movie/now_playing?page=${page}`);
  return data.results || [];
};

// ── Top rated ─────────────────────────────────────────────────────
export const fetchTopRated = async (page = 1) => {
  const data = await tmdbFetch(`/movie/top_rated?page=${page}`);
  return data.results || [];
};

// ── Upcoming ───────────────────────────────────────────────────────
export const fetchUpcoming = async (page = 1) => {
  const data = await tmdbFetch(`/movie/upcoming?page=${page}`);
  return data.results || [];
};

// ── Movie detail (credits, videos, watch providers, keywords, release dates) ──
export const fetchMovieDetail = async (id) => {
  return tmdbFetch(`/movie/${id}?append_to_response=credits,videos,watch/providers,keywords,release_dates,similar`);
};

// ── Watch Providers (Where to Watch) ───────────────────────────────
export const fetchWatchProviders = async (id) => {
  const data = await tmdbFetch(`/movie/${id}/watch/providers`);
  return data.results || {};
};

// ── Movie Videos & Trailers ─────────────────────────────────────────
export const fetchMovieVideos = async (id) => {
  const data = await tmdbFetch(`/movie/${id}/videos`);
  return data.results || [];
};

// ── Recommendations ("More Like This") ─────────────────────────────
export const fetchRecommendations = async (id, page = 1) => {
  const data = await tmdbFetch(`/movie/${id}/recommendations?page=${page}`);
  return data.results || [];
};

// ── Discover by genre ──────────────────────────────────────────────
export const fetchByGenre = async (genreId, page = 1) => {
  const data = await tmdbFetch(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
  return data.results || [];
};

// ── Simple Search ──────────────────────────────────────────────────
export const searchMovies = async (query, page = 1) => {
  if (!query.trim()) return [];
  const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  return data.results || [];
};

// ── Advanced Search & Filter ──────────────────────────────────────
export const fetchAdvancedSearch = async ({
  query = "",
  genre = "",
  year = "",
  rating = "",
  sortBy = "popularity.desc",
  page = 1
}) => {
  if (query.trim()) {
    const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
    let results = data.results || [];

    if (genre) {
      const gId = Number(genre);
      results = results.filter(m => m.genre_ids?.includes(gId));
    }
    if (year) {
      results = results.filter(m => m.release_date?.startsWith(year));
    }
    if (rating) {
      const minR = Number(rating);
      results = results.filter(m => m.vote_average >= minR);
    }

    return {
      results,
      total_results: data.total_results || results.length,
      total_pages: data.total_pages || 1
    };
  } else {
    let params = `sort_by=${sortBy}&page=${page}`;
    if (genre) params += `&with_genres=${genre}`;
    if (year) params += `&primary_release_year=${year}`;
    if (rating) params += `&vote_average.gte=${rating}&vote_count.gte=50`;

    const data = await tmdbFetch(`/discover/movie?${params}`);
    return {
      results: data.results || [],
      total_results: data.total_results || 0,
      total_pages: data.total_pages || 1
    };
  }
};

// ── Genre ID → name map ───────────────────────────────────────────
export const GENRE_MAP = {
  28:    "Action",
  12:    "Adventure",
  16:    "Animation",
  35:    "Comedy",
  80:    "Crime",
  99:    "Documentary",
  18:    "Drama",
  10751: "Family",
  14:    "Fantasy",
  36:    "History",
  27:    "Horror",
  10402: "Music",
  9648:  "Mystery",
  10749: "Romance",
  878:   "Sci-Fi",
  10770: "TV Movie",
  53:    "Thriller",
  10752: "War",
  37:    "Western",
};

// ── Full Genre List for Selectors ─────────────────────────────────
export const GENRES_LIST = [
  { id: 28,    name: "Action" },
  { id: 12,    name: "Adventure" },
  { id: 16,    name: "Animation" },
  { id: 35,    name: "Comedy" },
  { id: 80,    name: "Crime" },
  { id: 99,    name: "Documentary" },
  { id: 18,    name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14,    name: "Fantasy" },
  { id: 36,    name: "History" },
  { id: 27,    name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648,  name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878,   name: "Sci-Fi" },
  { id: 53,    name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37,    name: "Western" },
];
