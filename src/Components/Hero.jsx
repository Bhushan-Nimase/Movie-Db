import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMovieContext } from '../contexts/MovieContext';
import { getPosterUrl, getBackdropUrl } from '../utils/images';
import { GENRE_MAP } from '../services/api';

export default function HeroCarousel({ movies }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovieContext();

  const go = useCallback((i) => {
    setIdx((i + movies.length) % movies.length);
  }, [movies.length]);

  const resetTimer = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIdx(p => (p + 1) % movies.length), 7000);
  }, [movies.length]);

  useEffect(() => { resetTimer(); return () => clearInterval(timer.current); }, [resetTimer]);

  const handleNav = (dir) => { go(idx + dir); resetTimer(); };
  const handleDot = (i) => { go(i); resetTimer(); };

  const movie = movies[idx];
  const fav = movie ? isFavorite(movie.id) : false;
  const genres = (movie?.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3);
  const year = movie?.release_date?.split('-')[0];
  const rating = movie?.vote_average?.toFixed(1);

  if (!movie) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', minHeight: 600, overflow: 'hidden' }}>

      {/* Background slides */}
      {movies.map((m, i) => (
        <div key={m.id} style={{
          position: 'absolute', inset: 0,
          opacity: i === idx ? 1 : 0,
          transition: 'opacity 0.9s ease',
          pointerEvents: i === idx ? 'auto' : 'none',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${getBackdropUrl(m)}')`,
            backgroundSize: 'cover', backgroundPosition: 'center 20%',
            transform: i === idx ? 'scale(1)' : 'scale(1.04)',
            transition: 'transform 8s ease',
          }} />
        </div>
      ))}

      {/* Overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.65) 45%, rgba(8,8,8,0.1) 75%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.4) 20%, transparent 50%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        padding: '0 3.5rem 5.5rem',
        maxWidth: 640,
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        {/* Tag line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem', color: 'var(--accent)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ display: 'block', width: 18, height: 1, background: 'var(--accent)' }} />
            #{idx + 1} Trending
          </span>
          {genres.map(g => (
            <span key={g} style={{
              padding: '2px 10px', borderRadius: 20,
              background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.22)',
              fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)',
              letterSpacing: '0.05em',
            }}>{g}</span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
          fontWeight: 800, lineHeight: 1.0,
          letterSpacing: '-0.03em', color: '#fff',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>{movie.title}</h1>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: '#d4a853', fontSize: '0.88rem' }}>
            ★ {rating}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{year}</span>
          {movie.vote_count && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                {(movie.vote_count / 1000).toFixed(0)}K votes
              </span>
            </>
          )}
        </div>

        {/* Overview */}
        <p className="clamp-3" style={{
          fontSize: '0.88rem', color: 'rgba(255,255,255,0.52)',
          lineHeight: 1.75, maxWidth: 480,
        }}>{movie.overview}</p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', borderRadius: 10, border: 'none',
              background: 'var(--accent)',
              color: '#0a0a0a',
              fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent2)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,168,83,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Play size={15} fill="currentColor" />
            More Info
          </button>
          <button
            onClick={() => toggleFavorite(movie)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 22px', borderRadius: 10,
              border: `1px solid ${fav ? 'rgba(212,168,83,0.5)' : 'var(--border2)'}`,
              background: fav ? 'rgba(212,168,83,0.1)' : 'rgba(255,255,255,0.06)',
              color: fav ? 'var(--accent)' : 'var(--text)',
              fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = fav ? 'rgba(212,168,83,0.18)' : 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = fav ? 'rgba(212,168,83,0.1)' : 'rgba(255,255,255,0.06)'; }}
          >
            {fav ? <Check size={15} /> : <Plus size={15} />}
            {fav ? 'In My List' : 'My List'}
          </button>
        </div>
      </div>

      {/* ── Thumbnail strip (right side) ── */}
      <div style={{
        position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {movies.map((m, i) => (
          <div
            key={m.id}
            onClick={() => handleDot(i)}
            style={{
              width: 58, height: 82, borderRadius: 8, overflow: 'hidden',
              border: `2px solid ${i === idx ? 'var(--accent)' : 'transparent'}`,
              opacity: i === idx ? 1 : 0.38,
              cursor: 'pointer', transition: 'all 0.3s',
              backgroundImage: `url('${getPosterUrl(m)}')`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (i !== idx) e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { if (i !== idx) e.currentTarget.style.opacity = '0.38'; }}
          />
        ))}
      </div>

      {/* ── Prev / Next arrows ── */}
      {[[-1, ChevronLeft, 'left'], [1, ChevronRight, 'right']].map(([dir, Icon, side]) => (
        <button key={side} onClick={() => handleNav(dir)} style={{
          position: 'absolute', top: '50%', [side]: '1.5rem',
          transform: 'translateY(-50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = 'white'; }}
        >
          <Icon size={20} />
        </button>
      ))}

      {/* ── Dot indicators ── */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '3rem',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        {movies.map((_, i) => (
          <div key={i} onClick={() => handleDot(i)} style={{
            width: i === idx ? 22 : 6, height: 6,
            borderRadius: 3,
            background: i === idx ? 'var(--accent)' : 'rgba(255,255,255,0.22)',
            cursor: 'pointer', transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}
