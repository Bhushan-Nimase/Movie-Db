import { Heart, Star, Calendar } from "lucide-react";
import { useMovieContext } from "../contexts/MovieContext";

function MovieCard({ movie }) {
  const { isFavorites, addToFavorites, removeFavorites } = useMovieContext();
  const favorite = isFavorites(movie.id);

  function handleFavoriteClick(e) {
    e.preventDefault();
    if (favorite) {
      removeFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.jpg";

  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.split("-")[0];

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        borderRadius: "16px",
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        transition:
          "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
        e.currentTarget.style.boxShadow =
          "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(251,191,36,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
      }}
    >
      {/* Poster */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            display: "block",
          }}
          className="group-hover:scale-105"
        />

        {/* Gradient overlay — always faintly visible at bottom, full on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,14,26,0.98) 0%, rgba(10,14,26,0.5) 35%, transparent 65%)",
            opacity: 0,
            transition: "opacity 0.35s ease",
          }}
          className="group-hover:opacity-100"
        />

        {/* Subtle bottom fade always on */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(to top, rgba(17,24,39,1) 0%, transparent 100%)",
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "all 0.25s ease",
            background: favorite
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "rgba(0,0,0,0.55)",
            boxShadow: favorite
              ? "0 4px 16px rgba(239,68,68,0.45)"
              : "0 2px 8px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            if (!favorite) {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #ef4444, #dc2626)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(239,68,68,0.45)";
            }
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            if (!favorite) {
              e.currentTarget.style.background = "rgba(0,0,0,0.55)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
            }
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Heart size={15} fill={favorite ? "white" : "none"} color="white" />
        </button>

        {/* Rating badge — top left */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            borderRadius: "8px",
            padding: "4px 8px",
            border: "1px solid rgba(251,191,36,0.25)",
          }}
        >
          <Star size={11} fill="#fbbf24" color="#fbbf24" />
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: "700",
              color: "#fbbf24",
              letterSpacing: "0.02em",
            }}
          >
            {rating}
          </span>
        </div>

        {/* Movie Info — slides up on hover */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px",
            transform: "translateY(8px)",
            opacity: 0,
            transition: "all 0.35s cubic-bezier(0.34,1.3,0.64,1)",
          }}
          className="group-hover:translate-y-0 group-hover:opacity-100"
        >
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: "700",
              color: "#ffffff",
              lineHeight: 1.3,
              marginBottom: "8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              letterSpacing: "0.01em",
            }}
          >
            {movie.title}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={11} style={{ color: "rgba(255,255,255,0.4)" }} />
            <span
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.45)",
                fontWeight: "500",
              }}
            >
              {year}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div style={{ padding: "12px 14px 14px" }}>
        <h3
          style={{
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "rgba(255,255,255,0.9)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "0.01em",
            marginBottom: "4px",
          }}
        >
          {movie.title}
        </h3>
        <span
          style={{
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.35)",
            fontWeight: "500",
          }}
        >
          {year}
        </span>
      </div>
    </div>
  );
}

export default MovieCard;
