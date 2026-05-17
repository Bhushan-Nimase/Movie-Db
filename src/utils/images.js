const IMG_BASE = 'https://image.tmdb.org/t/p/';

// Poster — w342 for cards, w500 for bigger views
export function getPosterUrl(movie, size = 'w342') {
  if (movie?.poster_path) {
    return `${IMG_BASE}${size}${movie.poster_path}`;
  }
  // Absolute placeholder so it never resolves to a relative 404
  const text = encodeURIComponent(movie?.title?.slice(0, 15) || 'No Image');
  return `https://placehold.co/342x513/0f0f0f/666?text=${text}`;
}

// Backdrop — w1280 for hero, w780 for smaller
export function getBackdropUrl(movie, size = 'w1280') {
  if (movie?.backdrop_path) {
    return `${IMG_BASE}${size}${movie.backdrop_path}`;
  }
  if (movie?.poster_path) {
    return `${IMG_BASE}w780${movie.poster_path}`;
  }
  // 1x1 transparent pixel so <img> never gets an invalid src
  return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
}