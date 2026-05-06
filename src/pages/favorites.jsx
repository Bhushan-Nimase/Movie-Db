import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../Components/MovieCard";
function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites && favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1>No Favorite movie yet</h1>
      <p>Start adding your favorite movie</p>
    </div>
  );
}

export default Favorites;
