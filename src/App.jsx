import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import NavBar from "./components/NavBar";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";
import CategoryPage from "./pages/CategoryPage";
import './css/index.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-fade">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <BrowserRouter>
        <Cursor />
        <NavBar />
        <AnimatedRoutes />
      </BrowserRouter>
    </MovieProvider>
  );
}
