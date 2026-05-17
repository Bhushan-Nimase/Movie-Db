import {
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cv_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const save = useCallback((list) => {
    setFavorites(list);
    localStorage.setItem("cv_favorites", JSON.stringify(list));
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((movie) => movie.id === id),
    [favorites]
  );

  const addToFavorites = useCallback(
    (movie) => {
      if (!favorites.some((m) => m.id === movie.id)) {
        save([...favorites, movie]);
      }
    },
    [favorites, save]
  );

  const removeFromFavorites = useCallback(
    (id) => {
      save(favorites.filter((movie) => movie.id !== id));
    },
    [favorites, save]
  );

  const toggleFavorite = useCallback(
    (movie) => {
      if (isFavorite(movie.id)) {
        removeFromFavorites(movie.id);
      } else {
        addToFavorites(movie);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  return (
    <MovieContext.Provider
      value={{
        favorites,
        isFavorite,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export const useMovieContext = () => useContext(MovieContext);