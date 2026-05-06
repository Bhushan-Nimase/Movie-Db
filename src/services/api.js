const API_KEY = "7228b7e3d72422f453b6337ef7072771";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
    const responce = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    
    const data = await responce.json();
    return data.results;
};

export const searchMovies = async (query) => {
    const responce = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    );
    const data = await responce.json();
    return data.results;
};
