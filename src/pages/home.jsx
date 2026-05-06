import MovieCard from "../Components/MovieCard";
import { useState, useEffect } from "react";
import { fetchPopularMovies, searchMovies } from "../services/api";
import "../css/home.css";
function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setmovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadmovies = async () => {
      try {
        const popularMovies = await fetchPopularMovies();
        setmovies(popularMovies);
      } catch (err) {
        console.log(err)
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadmovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return
    if (loading) return
    try {
      const searchResult = await searchMovies(searchQuery)
      setmovies(searchResult)
      setError(null)
    } catch (err) {
      console.log(err)
      setError("Failed to load movies")
    } finally {
      setLoading(false)
    }
    setSearchQuery("");
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
