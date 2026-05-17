import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import NavBar from './Components/NavBar';
import Cursor from './Components/Cursor';
import Home from './pages/home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/favorites';
import './css/index.css';

export default function App() {
  return (
    <MovieProvider>
      <BrowserRouter>
        <Cursor />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </MovieProvider>
  );
}
