//const API_KEY = "7228b7e3d72422f453b6337ef7072771";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE    = "https://api.themoviedb.org/3";

// ── Popular movies ─────────────────────────────────────────────────
export const fetchPopular = async (page = 1) => {
  try {
    const res  = await fetch(`${BASE}/movie/popular?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("fetchPopular:", err);
    return [];
  }
};

// ── Trending this week ─────────────────────────────────────────────
export const fetchTrending = async () => {
  try {
    const res  = await fetch(`${BASE}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("fetchTrending:", err);
    return [];
  }
};

// ── Top rated ─────────────────────────────────────────────────────
export const fetchTopRated = async (page = 1) => {
  try {
    const res  = await fetch(`${BASE}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("fetchTopRated:", err);
    return [];
  }
};

// ── Upcoming ───────────────────────────────────────────────────────
export const fetchUpcoming = async (page = 1) => {
  try {
    const res  = await fetch(`${BASE}/movie/upcoming?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("fetchUpcoming:", err);
    return [];
  }
};

// ── Movie detail (genres, runtime, tagline) ────────────────────────
export const fetchMovieDetail = async (id) => {
  try {
    const res = await fetch(
      `${BASE}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    return res.json();
  } catch (err) {
    console.error("fetchMovieDetail:", err);
    return null;
  }
};

// ── Credits (cast + crew) ──────────────────────────────────────────
export const getMovieCredits = async (id) => {
  try {
    const res = await fetch(`${BASE}/movie/${id}/credits?api_key=${API_KEY}`);
    return res.json();
  } catch (err) {
    console.error("getMovieCredits:", err);
    return { cast: [] };
  }
};

// ── Videos (trailers) ─────────────────────────────────────────────
export const getMovieVideos = async (id) => {
  try {
    const res = await fetch(`${BASE}/movie/${id}/videos?api_key=${API_KEY}`);
    return res.json();
  } catch (err) {
    console.error("getMovieVideos:", err);
    return { results: [] };
  }
};

// ── Search ────────────────────────────────────────────────────────
export const searchMovies = async (query, page = 1) => {
  if (!query.trim()) return [];
  try {
    const res  = await fetch(
      `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("searchMovies:", err);
    return [];
  }
};

// ── Genre ID → name map ───────────────────────────────────────────
export const GENRE_MAP = {
  28:  "Action",    12: "Adventure", 16: "Animation",
  35:  "Comedy",    80: "Crime",     18: "Drama",
  14:  "Fantasy",   27: "Horror",    10749: "Romance",
  878: "Sci-Fi",    53: "Thriller",  10402: "Music",
  9648:"Mystery",   36: "History",   10751: "Family",
};
