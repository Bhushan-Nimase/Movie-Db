import MovieCard from "../Components/MovieCard";
import { useState, useEffect, useRef } from "react";
import { fetchPopularMovies, searchMovies } from "../services/api";
import { Search, Film, Sparkles } from "lucide-react";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Load movies whenever page or activeQuery changes
  useEffect(() => {
    const load = async () => {
      try {
        page === 1 ? setLoading(true) : setLoadingMore(true);

        const results = activeQuery
          ? await searchMovies(activeQuery, page)
          : await fetchPopularMovies(page);

        if (!results || results.length === 0) {
          setHasMore(false);
        } else {
          setMovies((prev) => (page === 1 ? results : [...prev, ...results]));
          setHasMore(results.length === 20);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    load();
  }, [page, activeQuery]);

  // Intersection Observer to trigger next page
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setActiveQuery(q);
  };

  const handleClear = () => {
    setSearchQuery("");
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setActiveQuery("");
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0f1629 50%, #0a0e1a 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Ambient blobs */}
      <div
        style={{
          position: "fixed", top: "-10%", left: "-5%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed", bottom: "10%", right: "-5%",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <div
          className="px-6 pt-28 pb-4"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        >
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold uppercase"
            style={{
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.25)",
              color: "#fbbf24", letterSpacing: "0.15em",
            }}
          >
            <Sparkles size={12} />
            Trending Now
          </div>

          <h1
            className="font-black leading-none tracking-tight"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontFamily: "'Bebas Neue', 'DM Sans', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #fbbf24 50%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.02em",
            }}
          >
            Discover Cinema
          </h1>

          <p
            className="mt-4 text-lg max-w-md mx-auto text-center"
            style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.01em" }}
          >
            Explore the world's greatest films — search, save, and fall in love with movies.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 w-full max-w-2xl"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div
              className="flex items-center"
              style={{
                width: "100%",
                background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                border: focused ? "1.5px solid rgba(251,191,36,0.6)" : "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "6px 6px 6px 20px",
                boxShadow: focused
                  ? "0 0 0 4px rgba(251,191,36,0.08), 0 20px 60px rgba(0,0,0,0.4)"
                  : "0 8px 32px rgba(0,0,0,0.3)",
                transition: "all 0.25s ease",
                backdropFilter: "blur(12px)",
              }}
            >
              <Search
                size={18}
                style={{
                  color: focused ? "#fbbf24" : "rgba(255,255,255,0.3)",
                  flexShrink: 0,
                  transition: "color 0.2s ease",
                }}
              />
              <input
                type="text"
                placeholder="Search for a movie, director, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="flex-1 bg-transparent outline-none"
                style={{ padding: "12px 16px", fontSize: "0.95rem", color: "white" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    background: "transparent", border: "none",
                    color: "rgba(255,255,255,0.35)", cursor: "pointer",
                    padding: "0 10px", fontSize: "20px", lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "#0a0e1a", border: "none", borderRadius: "11px",
                  padding: "12px 24px", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(251,191,36,0.3)",
                  transition: "all 0.2s ease", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 28px rgba(251,191,36,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(251,191,36,0.3)";
                }}
              >
                <Search size={15} />
                Search
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mt-6 text-center text-sm font-medium" style={{ color: "#f87171" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
            <Film size={36} style={{ color: "#fbbf24", animation: "spin 2s linear infinite" }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", letterSpacing: "0.05em" }}>
              Loading movies...
            </p>
          </div>
        ) : (
          <div className="px-6 py-14">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: "3px", height: "24px", background: "linear-gradient(180deg, #fbbf24, #f59e0b)", borderRadius: "2px" }} />
              <h2
                className="text-sm font-semibold uppercase"
                style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}
              >
                {activeQuery ? `Results for "${activeQuery}"` : "Popular Movies"} · {movies.length} loaded
              </h2>
            </div>

            {/* Grid */}
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {movies.map((movie, i) => (
                <div
                  key={`${movie.id}-${i}`}
                  style={{
                    animation: "fadeUp 0.4s ease both",
                    animationDelay: `${Math.min((i % 20) * 40, 400)}ms`,
                  }}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Invisible sentinel — watched by IntersectionObserver */}
            <div ref={sentinelRef} style={{ height: "40px", marginTop: "40px" }} />

            {/* Loading more */}
            {loadingMore && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Film size={28} style={{ color: "#fbbf24", animation: "spin 2s linear infinite" }} />
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", letterSpacing: "0.05em" }}>
                  Loading more...
                </p>
              </div>
            )}

            {/* End of list */}
            {!hasMore && movies.length > 0 && (
              <div className="flex items-center justify-center gap-4 py-10">
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                  YOU'VE SEEN IT ALL
                </p>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700;900&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Home;