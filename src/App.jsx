import "./App.css";
import Favorites from "./pages/favorites";
import Home from "./pages/home";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import Navbar from "./Components/NavBar";
function App() {
  return (
    <MovieProvider>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
