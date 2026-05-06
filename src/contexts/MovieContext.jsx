import { useEffect, useState, createContext, useContext } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites")

        if (storedFavs) setFavorites(JSON.parse(storedFavs))
    }, [])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }

    const isFavorites = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFavorites,
        isFavorites
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}