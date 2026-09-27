import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Film, Heart, X, ChevronDown, SlidersHorizontal, Star } from "lucide-react";
import { searchMovies, GENRES_LIST } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import logo from "../assets/logo.png";

export default function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);

  const { favorites } = useMovieContext();
  const debounce = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();
  const genreRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setGenreOpen(false);
    setQuery("");
    setResults([]);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (genreRef.current && !genreRef.current.contains(e.target)) {
        setGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (val) => {
    setQuery(val);
    clearTimeout(debounce.current);
    if (!val.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      const res = await searchMovies(val);
      setResults(res.slice(0, 6));
      setOpen(true);
    }, 300);
  };

  const handleSelect = (id) => {
    navigate(`/movie/${id}`);
    setOpen(false);
    setQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NAV_LINKS = [
    { path: "/", label: "Home" },
    { path: "/category/trending", label: "Trending" },
    { path: "/category/popular", label: "Popular" },
    { path: "/category/top-rated", label: "Top Rated" },
    { path: "/category/upcoming", label: "Upcoming" },
    { path: "/search", label: "DB Search", icon: SlidersHorizontal },
  ];

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 500,
      height: scrolled ? "64px" : "var(--nav-h)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2.5rem",
      background: "var(--paper)",
      borderBottom: scrolled ? "1px solid var(--rule-strong)" : "1px solid var(--rule)",
      boxShadow: scrolled ? "0 12px 32px rgba(6, 11, 23, 0.7)" : "none",
      transition: "height 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.35s ease",
      backdropFilter: "blur(12px)",
    }}>
      {/* ── Brand Logo & Title ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src={logo} alt="The Reel" style={{ width: scrolled ? 26 : 32, height: scrolled ? 26 : 32, objectFit: "contain", transition: "all 0.25s" }} />
          <span
            className="text-hover-shimmer"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            The Reel<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </Link>
      </div>

      {/* ── Desktop Navigation Links ── */}
      <ul style={{
        display: "flex",
        gap: "1.8rem",
        listStyle: "none",
        alignItems: "center",
        margin: 0,
        padding: 0,
      }} className="nav-desktop-links">
        {NAV_LINKS.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <Link
              to={path}
              className={`animated-underline ${isActive(path) ? 'active-link' : ''}`}
              style={{
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                fontSize: "0.76rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isActive(path) ? "var(--ink)" : "var(--ink-faint)",
                borderBottom: isActive(path) ? "2px solid var(--accent)" : "2px solid transparent",
                paddingBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "color 0.2s, border-color 0.2s",
                fontWeight: isActive(path) ? 700 : 500,
              }}
            >
              {Icon && <Icon size={12} color={isActive(path) ? "var(--accent)" : "currentColor"} />}
              {label}
            </Link>
          </li>
        ))}

        {/* Genres Dropdown */}
        <li style={{ position: "relative" }} ref={genreRef}>
          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="animated-underline"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "0.76rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: genreOpen ? "var(--ink)" : "var(--ink-faint)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              paddingBottom: 4,
              fontWeight: 500,
            }}
          >
            Genres <ChevronDown size={12} style={{ transform: genreOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {genreOpen && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: 0,
              width: 320,
              background: "var(--paper-raised)",
              border: "1px solid var(--rule-strong)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 12px",
              zIndex: 600,
            }}>
              {GENRES_LIST.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    navigate(`/search?genre=${g.id}`);
                    setGenreOpen(false);
                  }}
                  style={{
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "6px 9px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.74rem",
                    color: "var(--ink-soft)",
                    cursor: "pointer",
                    borderRadius: 4,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.color = "#000";
                    e.currentTarget.style.fontWeight = "700";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "var(--ink-soft)";
                    e.currentTarget.style.fontWeight = "500";
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </li>
      </ul>

      {/* ── Search & Watchlist Tools ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.4rem" }}>
        {/* Instant Search Bar */}
        <div style={{ position: "relative" }} ref={searchRef}>
          <form onSubmit={handleSearchSubmit} style={{
            display: "flex", alignItems: "center", gap: 8,
            borderBottom: "1px solid var(--rule-strong)",
            padding: "4px 2px",
          }}>
            <Search size={14} color="var(--accent)" />
            <input
              type="text"
              value={query}
              placeholder="Search movies, cast, genres…"
              onChange={(e) => handleInput(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                width: 170,
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
                style={{ background: "none", border: "none", color: "var(--ink-faint)", cursor: "pointer", display: "flex" }}
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {open && results.length > 0 && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              right: 0,
              width: 320,
              background: "var(--paper-raised)",
              border: "1px solid var(--rule-strong)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              zIndex: 600,
            }}>
              {results.map((m) => {
                const poster = m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : null;
                const year = m.release_date?.split("-")[0];
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelect(m.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--rule)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    {poster ? (
                      <img src={poster} alt="" style={{ width: 34, height: 48, objectFit: "cover", flexShrink: 0, border: "1px solid var(--rule)" }} />
                    ) : (
                      <div style={{ width: 34, height: 48, background: "var(--paper2)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Film size={14} color="var(--ink-faint)" />
                      </div>
                    )}
                    <div style={{ overflow: "hidden", flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {m.title}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                        {year && <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ink-faint)" }}>{year}</span>}
                        {m.vote_average > 0 && (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            <Star size={10} fill="var(--accent)" /> {m.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "var(--accent)",
                  color: "#000",
                  border: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                Full Search Results for "{query}" →
              </button>
            </div>
          )}
        </div>

        {/* My Shelf / Favorites Button */}
        <Link
          to="/favorites"
          aria-label="My shelf"
          className="text-hover-lift"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: isActive("/favorites") ? "var(--accent)" : "var(--ink)",
            textDecoration: "none",
            position: "relative",
            fontFamily: "var(--font-mono)",
            fontSize: "0.74rem",
            fontWeight: 600,
          }}
        >
          <Heart size={18} strokeWidth={1.8} fill={isActive("/favorites") ? "var(--accent)" : "none"} />
          <span style={{ textTransform: "uppercase", letterSpacing: "0.06em" }} className="shelf-label">Shelf</span>
          {favorites.length > 0 && (
            <span style={{
              background: "var(--accent)",
              color: "#000",
              borderRadius: "50%",
              fontSize: "0.65rem",
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}>
              {favorites.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
