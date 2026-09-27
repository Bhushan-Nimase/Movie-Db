import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUpRight, Plus, Check, Play } from 'lucide-react';
import { useMovieContext } from '../contexts/MovieContext';
import { getBackdropUrl } from '../utils/images';
import { GENRE_MAP, fetchMovieVideos } from '../services/api';
import RatingRing from './RatingRing';
import TrailerModal from './TrailerModal';

export default function HeroCarousel({ movies }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovieContext();
  const textRef = useRef();
  const imgRef = useRef();

  // Trailer state for current hero movie
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [currentTrailerKey, setCurrentTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  const go = useCallback((i) => {
    setIdx((i + movies.length) % movies.length);
  }, [movies.length]);

  const resetTimer = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIdx(p => (p + 1) % movies.length), 7000);
  }, [movies.length]);

  useEffect(() => { resetTimer(); return () => clearInterval(timer.current); }, [resetTimer]);

  // crossfade text + image whenever the slide changes
  useLayoutEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    }
    if (imgRef.current) {
      gsap.fromTo(imgRef.current, { opacity: 0, scale: 1.045 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' });
    }
  }, [idx]);

  const handleDot = (i) => { go(i); resetTimer(); };

  const movie = movies[idx];
  const fav = movie ? isFavorite(movie.id) : false;
  const genres = (movie?.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3);
  const year = movie?.release_date?.split('-')[0];

  const handlePlayTrailer = async () => {
    if (!movie) return;
    setLoadingTrailer(true);
    try {
      const vids = await fetchMovieVideos(movie.id);
      const mainVid = vids.find(v => v.site === 'YouTube' && v.type === 'Trailer') || vids.find(v => v.site === 'YouTube');
      if (mainVid) {
        setCurrentTrailerKey(mainVid.key);
        setTrailerOpen(true);
      } else {
        navigate(`/movie/${movie.id}`);
      }
    } catch {
      navigate(`/movie/${movie.id}`);
    } finally {
      setLoadingTrailer(false);
    }
  };

  if (!movie) return null;

  return (
    <div style={{
      padding: '2.6rem 2.5rem 2.2rem',
      borderBottom: '1px solid var(--rule)',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 380px',
      gap: '2.8rem',
      alignItems: 'center',
    }}>
      {/* ── Text column ── */}
      <div ref={textRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', minWidth: 0 }}>
        <div className="eyebrow">
          Cover Story — Issue No. {String(idx + 1).padStart(2, '0')}
        </div>

        {/* Dynamic Syne Display Title with Kinetic Shimmer Hover */}
        <h1
          className="text-hover-shimmer"
          onClick={() => navigate(`/movie/${movie.id}`)}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.01,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
            cursor: 'pointer',
          }}
        >
          {movie.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <RatingRing value={movie.vote_average} size={34} />
          <span style={{ color: 'var(--rule-strong)' }}>—</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{year}</span>
          {genres.length > 0 && (
            <>
              <span style={{ color: 'var(--rule-strong)' }}>—</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                {genres.join(' / ')}
              </span>
            </>
          )}
        </div>

        <p className="clamp-3" style={{
          fontFamily: "var(--font-sans)",
          fontSize: '1.05rem',
          color: 'var(--ink-soft)',
          lineHeight: 1.65,
          maxWidth: 520,
        }}>{movie.overview}</p>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="hero-read-btn text-hover-lift"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px',
              border: '1px solid var(--ink)',
              background: 'var(--ink)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.25s',
            }}
          >
            Read Feature <ArrowUpRight size={14} />
          </button>

          <button
            onClick={handlePlayTrailer}
            disabled={loadingTrailer}
            className="text-hover-lift"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px',
              border: '1px solid var(--accent)',
              background: 'var(--accent)',
              color: '#fff',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.25s',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(211,24,50,0.25)',
            }}
          >
            <Play size={14} fill="#fff" /> {loadingTrailer ? 'Loading…' : 'Watch Trailer'}
          </button>

          <button
            onClick={() => toggleFavorite(movie)}
            className="text-hover-lift"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px',
              border: `1px solid ${fav ? 'var(--accent)' : 'var(--rule-strong)'}`,
              background: 'none',
              color: fav ? 'var(--accent)' : 'var(--ink)',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.25s',
            }}
          >
            {fav ? <Check size={14} /> : <Plus size={14} />}
            {fav ? 'On Shelf' : 'Add to Shelf'}
          </button>
        </div>
      </div>

      {/* ── Image column ── */}
      <div style={{ position: 'relative', aspectRatio: '4/5', width: '100%' }}>
        <style>{`.hero-read-btn:hover { background: var(--accent); border-color: var(--accent); }`}</style>

        <div ref={imgRef} style={{
          position: 'absolute', inset: 0,
          border: '1px solid var(--ink)',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(18,16,12,0.12)',
        }}>
          <img
            src={getBackdropUrl(movie)}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(15%) contrast(1.05)' }}
          />
        </div>
      </div>

      {/* Issue index tabs */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem', paddingTop: '0.5rem' }}>
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.74rem',
              letterSpacing: '0.05em',
              fontWeight: i === idx ? 700 : 400,
              color: i === idx ? 'var(--accent)' : 'var(--ink-faint)',
              borderBottom: i === idx ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: 4,
              transition: 'all 0.2s',
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      <TrailerModal
        isOpen={trailerOpen}
        videoKey={currentTrailerKey}
        title={movie.title}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  );
}
