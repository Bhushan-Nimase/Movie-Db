import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Plus, Check } from 'lucide-react';
import { useMovieContext } from '../contexts/MovieContext';
import { fetchMovieDetail, GENRE_MAP } from '../services/api';
import { getBackdropUrl, getPosterUrl } from '../utils/images';
import MovieCard from "../components/MovieCard";

const NAV_H = 64;

export default function MovieDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, favorites } = useMovieContext();
  const [movie,   setMovie]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);
    fetchMovieDetail(id)
      .then(data => setMovie(data))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, [id]);

  // ── Loading ──
  if (loading) return (
    <div style={{ paddingTop: NAV_H, height:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:'var(--muted)', fontFamily:"'JetBrains Mono',monospace", fontSize:'0.8rem', letterSpacing:'0.1em' }}>
        LOADING…
      </span>
    </div>
  );

  // ── Error ──
  if (error || !movie) return (
    <div style={{ paddingTop: NAV_H, textAlign:'center', padding:'8rem 3rem', color:'var(--muted)' }}>
      <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🎬</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", color:'var(--text)', marginBottom:8 }}>Movie not found</h2>
      <p style={{ fontSize:'0.85rem', marginBottom:'1.5rem' }}>{error || 'Could not load this movie.'}</p>
      <button onClick={() => navigate('/')} style={{
        padding:'10px 24px', borderRadius:10, border:'1px solid var(--border2)',
        background:'rgba(255,255,255,0.06)', color:'var(--text)',
        cursor:'pointer', fontSize:'0.85rem',
      }}>← Go Home</button>
    </div>
  );

  const fav    = isFavorite(movie.id);
  const genres = movie.genres || [];
  const year   = movie.release_date?.split('-')[0];
  const rating = movie.vote_average?.toFixed(1);
  const cast   = movie.credits?.cast?.slice(0, 10) || [];
  const director = movie.credits?.crew?.find(c => c.job === 'Director');
  const backdropUrl = getBackdropUrl(movie);

  return (
    <div>
      {/* ── Backdrop hero ── */}
      <div style={{ position:'relative', height:'75vh', minHeight:500, overflow:'hidden' }}>
        {backdropUrl && (
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:`url('${backdropUrl}')`,
            backgroundSize:'cover', backgroundPosition:'center 15%',
          }} />
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.5) 55%, rgba(8,8,8,0.1) 100%)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(8,8,8,1) 0%, transparent 45%)' }} />
        <div style={{ position:'absolute', top:0, left:0, right:0, height:130, background:'linear-gradient(to bottom, rgba(8,8,8,0.7), transparent)' }} />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position:'absolute', top: NAV_H + 20, left:'3rem',
            display:'flex', alignItems:'center', gap:8,
            background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
            border:'1px solid var(--border)', borderRadius:10,
            color:'var(--text)', padding:'8px 16px',
            cursor:'pointer', fontSize:'0.82rem', fontFamily:"'DM Sans',sans-serif",
            transition:'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='var(--accent)'; e.currentTarget.style.color='#000'; e.currentTarget.style.borderColor='var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(0,0,0,0.55)'; e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--border)'; }}
        >
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      {/* ── Detail body ── */}
      <div style={{ padding:'0 3rem 4rem', marginTop:-130, position:'relative', zIndex:2 }}>
        <div style={{ display:'flex', gap:'2.5rem', alignItems:'flex-start', flexWrap:'wrap' }}>

          {/* Poster */}
          <div style={{ flexShrink:0 }}>
            <img
              src={getPosterUrl(movie, 'w342')}
              alt={movie.title}
              style={{
                width:200, borderRadius:14,
                border:'1px solid var(--border2)',
                boxShadow:'0 20px 60px rgba(0,0,0,0.7)',
                display:'block',
              }}
            />
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:260, paddingTop:80 }}>

            {/* Genre pills */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1rem' }}>
              {genres.map(g => (
                <span key={g.id} style={{
                  padding:'3px 12px', borderRadius:20, fontSize:'0.7rem', fontWeight:600,
                  background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.22)',
                  color:'var(--accent)', letterSpacing:'0.05em',
                }}>{g.name}</span>
              ))}
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily:"'Syne',sans-serif",
              fontSize:'clamp(2rem, 5vw, 3.2rem)',
              fontWeight:800, lineHeight:1.05,
              letterSpacing:'-0.03em', color:'#fff',
              marginBottom:'0.75rem',
            }}>
              {movie.title}
              {movie.tagline && (
                <span style={{ display:'block', fontSize:'0.95rem', fontWeight:400, color:'var(--muted)', marginTop:8, letterSpacing:0 }}>
                  "{movie.tagline}"
                </span>
              )}
            </h1>

            {/* Stats */}
            <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.2rem' }}>
              {[
                { label:'Rating',  value: `★ ${rating}`,          gold: true },
                { label:'Year',    value: year },
                movie.runtime && { label:'Runtime', value:`${movie.runtime} min` },
                movie.vote_count && { label:'Votes',   value:`${(movie.vote_count/1000).toFixed(1)}K` },
                director && { label:'Director', value: director.name },
              ].filter(Boolean).map(({ label, value, gold }) => (
                <div key={label} style={{ display:'flex', flexDirection:'column', gap:3 }}>
                  <span style={{ fontSize:'0.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</span>
                  <span style={{ fontSize:'0.9rem', fontWeight:600, color: gold ? 'var(--accent)' : 'var(--text)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Overview */}
            <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.58)', lineHeight:1.78, marginBottom:'1.5rem', maxWidth:580 }}>
              {movie.overview}
            </p>

            {/* Actions */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button
                onClick={() => toggleFavorite(movie)}
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  padding:'11px 24px', borderRadius:10, border:'none',
                  background: fav ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'var(--accent)',
                  color: fav ? '#fff' : '#0a0a0a',
                  fontFamily:"'Syne',sans-serif", fontSize:'0.88rem', fontWeight:700,
                  cursor:'pointer', transition:'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity='0.85'; e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }}
              >
                {fav ? <><Check size={15} /> In My List</> : <><Plus size={15} /> Add to My List</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <div style={{ marginTop:'3rem' }}>
            <h2 style={{
              fontFamily:"'Syne',sans-serif", fontSize:'1.1rem', fontWeight:700,
              color:'var(--text)', marginBottom:'1.2rem',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{ display:'block', width:3, height:18, background:'var(--accent)', borderRadius:2 }} />
              Cast
            </h2>
            <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:8 }}>
              {cast.map(person => (
                <div key={person.id} style={{ flexShrink:0, textAlign:'center', width:82 }}>
                  <div style={{
                    width:64, height:64, borderRadius:'50%', overflow:'hidden',
                    border:'1px solid var(--border)', margin:'0 auto 6px',
                    background:'var(--bg4)',
                  }}>
                    {person.profile_path
                      ? <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        />
                      : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)', fontSize:'1.3rem' }}>👤</div>
                    }
                  </div>
                  <div style={{ fontSize:'0.65rem', fontWeight:600, color:'var(--text)', lineHeight:1.3 }}>{person.name}</div>
                  <div style={{ fontSize:'0.6rem', color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', width:'100%' }}>{person.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── My List at bottom of detail page ── */}
        {favorites.length > 0 && (
          <div style={{ marginTop:'3.5rem' }}>
            <div style={{ height:1, background:'var(--border)', marginBottom:'2.5rem' }} />
            <h2 style={{
              fontFamily:"'Syne',sans-serif", fontSize:'1.1rem', fontWeight:700,
              color:'var(--text)', marginBottom:'1.2rem',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{ display:'block', width:3, height:18, background:'var(--accent)', borderRadius:2 }} />
              My List
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(158px, 1fr))', gap:16 }}>
              {favorites.map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
