import { useState } from 'react';
import { Heart, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../contexts/MovieContext';
import { getPosterUrl } from '../utils/images';
import { GENRE_MAP } from '../services/api';
import RatingRing from './RatingRing';

export default function MovieCard({ movie, index }) {
  const { isFavorite, toggleFavorite } = useMovieContext();
  const navigate = useNavigate();
  const [popped, setPopped] = useState(false);
  const favorite = isFavorite(movie.id);
  const posterUrl = getPosterUrl(movie);
  const year   = movie.release_date?.split('-')[0];
  const genre  = GENRE_MAP[movie.genre_ids?.[0]];
  const catalogNo = String((index ?? 0) + 1).padStart(3, '0');

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
    setPopped(true);
    setTimeout(() => setPopped(false), 420);
  };

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <style>{`
        .movie-card .poster-img { opacity: 0.95; transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .movie-card:hover .poster-img { opacity: 1; transform: scale(1.06); }
        .movie-card .card-title-rule { transform: scaleX(0); transform-origin: left; transition: transform 0.35s cubic-bezier(0.34,1.3,0.64,1); }
        .movie-card:hover .card-title-rule { transform: scaleX(1); }
        .movie-card .poster-frame { border-color: var(--rule); transition: border-color 0.25s, box-shadow 0.3s; }
        .movie-card:hover .poster-frame { border-color: var(--ink); box-shadow: 0 12px 30px rgba(18,16,12,0.14); }
        .movie-card .fav-btn { opacity: 0; transform: translateY(-4px); transition: opacity 0.2s, transform 0.2s; }
        .movie-card:hover .fav-btn, .movie-card .fav-btn.is-fav { opacity: 1; transform: translateY(0); }
        .movie-card .hover-panel { opacity: 0; transform: translateY(10px); transition: opacity 0.3s ease, transform 0.3s ease; }
        .movie-card:hover .hover-panel { opacity: 1; transform: translateY(0); }
        .movie-card:hover .card-movie-title { color: var(--accent); }
      `}</style>

      {/* ── Poster frame ── */}
      <div
        className="poster-frame"
        style={{
          position: 'relative',
          aspectRatio: '2/3',
          overflow: 'hidden',
          border: '1px solid var(--rule)',
          background: 'var(--paper2)',
        }}
      >
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="poster-img"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Catalog number placard */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          background: 'var(--paper)',
          padding: '4px 8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--ink-soft)',
          letterSpacing: '0.03em',
        }}>
          No. {catalogNo}
        </div>

        {/* Fav button */}
        <button
          onClick={handleFav}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`fav-btn${favorite ? ' is-fav' : ''}`}
          style={{
            position: 'absolute', top: 0, right: 0,
            width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer',
            background: favorite ? 'var(--accent)' : 'var(--paper)',
          }}
        >
          <Heart
            size={13}
            fill={favorite ? '#fff' : 'none'}
            color={favorite ? '#fff' : 'var(--ink)'}
            strokeWidth={1.75}
            className={popped ? 'heart-pop' : ''}
          />
        </button>

        {/* Rating ring */}
        {movie.vote_average > 0 && (
          <div style={{ position: 'absolute', left: 7, bottom: 7, zIndex: 2 }}>
            <RatingRing value={movie.vote_average} size={32} />
          </div>
        )}

        {/* Hover panel */}
        <div className="hover-panel" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(17,15,10,0.94) 0%, rgba(17,15,10,0.75) 42%, rgba(17,15,10,0) 75%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '14px 10px 10px',
        }}>
          {movie.overview && (
            <p className="clamp-3" style={{
              fontFamily: "var(--font-sans)",
              fontSize: '0.72rem', lineHeight: 1.45, color: '#F1EDE1',
              marginBottom: 8,
            }}>{movie.overview}</p>
          )}
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', fontWeight: 600,
          }}>
            View Feature <ArrowUpRight size={11} />
          </span>
        </div>
      </div>

      {/* ── Caption with Syne Display font ── */}
      <div style={{ paddingTop: 9 }}>
        <h3 className="clamp-2 card-movie-title" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.94rem', fontWeight: 700,
          color: 'var(--ink)', lineHeight: 1.22,
          marginBottom: 4,
          transition: 'color 0.2s ease',
        }}>{movie.title}</h3>

        <div className="card-title-rule" style={{ height: 1, background: 'var(--accent)', marginBottom: 5 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-faint)', letterSpacing: '0.02em' }}>
            {year}
          </span>
          {genre && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              {genre}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
