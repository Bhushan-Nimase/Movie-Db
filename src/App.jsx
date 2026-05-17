import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import NavBar from "./components/NavBar";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
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
