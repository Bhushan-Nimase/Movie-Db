import { Heart, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../contexts/MovieContext';
import { getPosterUrl } from '../utils/images';

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useMovieContext();
  const navigate = useNavigate();
  const favorite = isFavorite(movie.id);
  const posterUrl = getPosterUrl(movie);
  const rating = movie.vote_average?.toFixed(1);
  const year   = movie.release_date?.split('-')[0];

  return (
    <div
      className="group"
      onClick={() => navigate(`/movie/${movie.id}`)}
      style={{
        borderRadius: 14,
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.3s',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform   = 'translateY(-6px) scale(1.02)';
        e.currentTarget.style.boxShadow   = '0 20px 50px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,168,83,0.25)';
        e.currentTarget.style.borderColor = 'rgba(212,168,83,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform   = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow   = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* ── Poster ── */}
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
          className="group-hover-scale"
          onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />

        {/* Hover dark gradient */}
        <div className="card-hover-overlay" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.45) 38%, transparent 65%)',
          opacity: 0, transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }} />

        {/* Static bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '38%',
          background: 'linear-gradient(to top, var(--bg3) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Rating badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          display: 'flex', alignItems: 'center', gap: 3,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          borderRadius: 7, padding: '3px 7px',
          border: '1px solid rgba(212,168,83,0.3)',
        }}>
          <Star size={10} fill="#d4a853" color="#d4a853" />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#d4a853', letterSpacing: '0.02em' }}>
            {rating}
          </span>
        </div>

        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(movie); }}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 34, height: 34, borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', backdropFilter: 'blur(8px)',
            transition: 'all 0.25s ease',
            background: favorite ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'rgba(0,0,0,0.55)',
            boxShadow: favorite ? '0 4px 16px rgba(239,68,68,0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => {
            if (!favorite) { e.currentTarget.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.4)'; }
            e.currentTarget.style.transform = 'scale(1.12)';
          }}
          onMouseLeave={e => {
            if (!favorite) { e.currentTarget.style.background = 'rgba(0,0,0,0.55)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'; }
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Heart size={14} fill={favorite ? 'white' : 'none'} color="white" />
        </button>

        {/* Hover info — slides up */}
        <div className="card-info" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 12px',
          transform: 'translateY(8px)', opacity: 0,
          transition: 'all 0.32s cubic-bezier(0.34,1.3,0.64,1)',
        }}>
          <h3 className="clamp-2" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 5 }}>
            {movie.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={10} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.42)', fontWeight: 500 }}>{year}</span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '10px 12px 13px' }}>
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.82rem', fontWeight: 700,
          color: 'rgba(255,255,255,0.88)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          letterSpacing: '0.01em', marginBottom: 3,
        }}>{movie.title}</h3>
        <span style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 500 }}>
          {year}{rating ? ` · ★ ${rating}` : ''}
        </span>
      </div>

      {/* CSS hover tricks via injected style */}
      <style>{`
        .group:hover .card-hover-overlay { opacity: 1 !important; }
        .group:hover .card-info { transform: translateY(0) !important; opacity: 1 !important; }
      `}</style>
    </div>
  );
}
