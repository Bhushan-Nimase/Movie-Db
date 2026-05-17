import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Film, Heart, X } from "lucide-react";
import { searchMovies } from "../services/api";
import logo from "../assets/logo.png";

const NAV_H = 64;

const S = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: NAV_H,
    zIndex: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2.5rem",
    background: "rgba(8,8,8,0.88)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "1.25rem",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "var(--text)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  links: {
    display: "flex",
    gap: "2rem",
    listStyle: "none",
    alignItems: "center",
  },
  link: {
    color: "var(--muted)",
    textDecoration: "none",
    fontSize: "0.8rem",
    fontWeight: 500,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    transition: "color 0.2s",
  },
  right: { display: "flex", alignItems: "center", gap: "1rem" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "7px 13px",
    transition: "border-color 0.2s",
    position: "relative",
  },
};

export default function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounce = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();

  useEffect(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, [location.pathname]);

  const handleInput = (val) => {
    setQuery(val);
    clearTimeout(debounce.current);
    if (!val.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchMovies(val);
        const list = res.length
          ? res
          : DEMO.filter((m) =>
              m.title.toLowerCase().includes(val.toLowerCase()),
            );
        setResults(list.slice(0, 6));
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleSelect = (id) => {
    navigate(`/movie/${id}`);
    setOpen(false);
    setQuery("");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={S.nav}>
      {/* Logo */}
      <Link to="/" style={S.logo}>
        <img
          src={logo}
          alt="Ash"
          style={{
            width: 42,
            height: 42,
            objectFit: "contain",
          }}
        />
      </Link>

      {/* Links */}
      <ul style={S.links}>
        {[
          ["/", "Home"],
          ["/favorites", "My List"],
        ].map(([path, label]) => (
          <li key={path}>
            <Link
              to={path}
              style={{
                ...S.link,
                color: isActive(path) ? "var(--text)" : "var(--muted)",
                borderBottom: isActive(path)
                  ? "1px solid var(--accent)"
                  : "1px solid transparent",
                paddingBottom: 2,
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Search + avatar */}
      <div style={S.right}>
        {/* Search dropdown */}
        <div style={S.searchBox} ref={searchRef}>
          <Search size={14} color="var(--muted)" />
          <input
            type="text"
            value={query}
            placeholder="Search movies…"
            onChange={(e) => handleInput(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              width: 190,
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <X size={13} />
            </button>
          )}

          {/* Dropdown */}
          {open && results.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: "var(--bg3)",
                border: "1px solid var(--border2)",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                zIndex: 600,
              }}
            >
              {results.map((m) => {
                const poster = m.poster_path
                  ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                  : null;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelect(m.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {poster ? (
                      <img
                        src={poster}
                        alt=""
                        style={{
                          width: 32,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 32,
                          height: 48,
                          borderRadius: 4,
                          background: "var(--bg4)",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Film size={14} color="var(--muted)" />
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {m.title}
                      </div>
                      <div
                        style={{ fontSize: "0.7rem", color: "var(--muted)" }}
                      >
                        {m.release_date?.split("-")[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* My List icon */}
        <Link
          to="/favorites"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isActive("/favorites") ? "var(--accent)" : "var(--muted)",
            transition: "color 0.2s, border-color 0.2s",
            textDecoration: "none",
          }}
        >
          <Heart
            size={16}
            fill={isActive("/favorites") ? "var(--accent)" : "none"}
          />
        </Link>
      </div>
    </nav>
  );
}
