import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Play, DollarSign, Calendar, Clock, Award, Globe, Film, Sparkles, Share2, Key, User } from 'lucide-react';
import { useMovieContext } from '../contexts/MovieContext';
import { fetchMovieDetail, fetchRecommendations } from '../services/api';
import { getBackdropUrl, getPosterUrl } from '../utils/images';
import MovieCard from "../components/MovieCard";
import RatingRing from "../components/RatingRing";
import RevealItem from "../components/RevealItem";
import WatchProviders from "../components/WatchProviders";
import TrailerModal from "../components/TrailerModal";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, favorites } = useMovieContext();

  const [movie, setMovie] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trailer Modal state
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeVideoKey, setActiveVideoKey] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMovie(null);
    window.scrollTo(0, 0);

    fetchMovieDetail(id)
      .then(data => {
        setMovie(data);
        const vids = data.videos?.results || [];
        const mainVid = vids.find(v => v.site === 'YouTube' && v.type === 'Trailer') || vids.find(v => v.site === 'YouTube');
        if (mainVid) setActiveVideoKey(mainVid.key);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));

    fetchRecommendations(id).then(setRecs).catch(() => setRecs([]));
  }, [id]);

  if (loading) return (
    <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
        LOADING ARCHIVE FILE…
      </span>
    </div>
  );

  if (error || !movie) return (
    <div style={{ textAlign: 'center', padding: '8rem 3rem', color: 'var(--ink-soft)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        {error?.code === 'INVALID_KEY' || error?.code === 'MISSING_KEY' ? (
          <Key size={48} color="var(--accent)" />
        ) : (
          <Film size={48} color="var(--accent)" />
        )}
      </div>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)', marginBottom: 8 }}>
        {error?.code === 'INVALID_KEY' || error?.code === 'MISSING_KEY' ? 'API Key Problem' : 'Entry Not Found'}
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '1.5rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
        {error?.message || 'Could not load details for this title.'}
      </p>
      <button onClick={() => navigate('/')} style={{
        padding: '10px 24px', border: '1px solid var(--ink)', background: 'none', color: 'var(--ink)',
        cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
      }}>← Back to Archive</button>
    </div>
  );

  const fav = isFavorite(movie.id);
  const genres = movie.genres || [];
  const year = movie.release_date?.split('-')[0];
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const crew = movie.credits?.crew || [];
  const directors = crew.filter(c => c.job === 'Director');
  const writers = crew.filter(c => c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Author').slice(0, 3);
  const backdropUrl = getBackdropUrl(movie);

  const certObj = movie.release_dates?.results?.find(r => r.iso_3166_1 === 'US') || movie.release_dates?.results?.[0];
  const certification = certObj?.release_dates?.find(d => d.certification)?.certification;

  const formatCurrency = (val) => {
    if (!val || val === 0) return '—';
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Billion`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)} Million`;
    return `$${val.toLocaleString()}`;
  };

  const videosList = (movie.videos?.results || []).filter(v => v.site === 'YouTube');
  const primaryTrailer = videosList.find(v => v.type === 'Trailer') || videosList[0];

  const keywordsList = movie.keywords?.keywords || movie.keywords?.results || [];

  return (
    <div>
      {/* ── Backdrop strip ── */}
      <div style={{ position: 'relative', height: '52vh', minHeight: 380, overflow: 'hidden', borderBottom: '1px solid var(--rule)' }}>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(25%) contrast(1.08)' }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,9,8,0.25), rgba(10,9,8,0.88) 100%)' }} />

        {/* Top Back & Share Actions */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '2.5rem', right: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--paper)', border: '1px solid var(--rule-strong)',
              color: 'var(--ink)', padding: '8px 16px',
              cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.76rem',
              letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: 4,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {primaryTrailer && (
            <button
              onClick={() => {
                setActiveVideoKey(primaryTrailer.key);
                setTrailerModalOpen(true);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--accent)', border: '1px solid var(--accent)',
                color: '#000', padding: '8px 18px',
                cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.76rem',
                letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700,
                boxShadow: '0 4px 14px rgba(224,169,109,0.3)', borderRadius: 4,
              }}
            >
              <Play size={14} fill="#000" /> Watch Trailer
            </button>
          )}
        </div>
      </div>

      {/* ── Main Detail Container ── */}
      <div style={{ padding: '2.2rem 2.5rem 4rem' }}>
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Poster Card */}
          <div style={{ flexShrink: 0, marginTop: -140, position: 'relative', zIndex: 10 }}>
            <img
              src={getPosterUrl(movie, 'w500')}
              alt={movie.title}
              style={{ width: 220, border: '1px solid var(--rule-strong)', display: 'block', background: 'var(--paper)', boxShadow: '0 12px 32px rgba(0,0,0,0.5)', borderRadius: 6 }}
            />
            
            {/* Quick Shelf Button below poster */}
            <button
              onClick={() => toggleFavorite(movie)}
              style={{
                width: '100%', marginTop: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px', border: `1px solid ${fav ? 'var(--accent)' : 'var(--rule-strong)'}`,
                background: fav ? 'var(--accent)' : 'var(--paper-raised)',
                color: fav ? '#000' : 'var(--ink)',
                fontFamily: 'var(--font-mono)', fontSize: '0.76rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700, borderRadius: 4,
              }}
            >
              {fav ? <><Check size={14} /> On Shelf</> : <><Plus size={14} /> Add to Shelf</>}
            </button>
          </div>

          {/* Core Info Details */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div className="eyebrow" style={{ marginBottom: '0.6rem' }}>
              Full Feature Record
            </div>

            {/* Genre pills + Certification tag */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
              {certification && (
                <span style={{
                  padding: '3px 8px', fontSize: '0.68rem', fontWeight: 700,
                  border: '1px solid var(--accent)', fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)', letterSpacing: '0.04em', borderRadius: 2,
                }}>
                  {certification}
                </span>
              )}
              {genres.map(g => (
                <Link key={g.id} to={`/search?genre=${g.id}`} style={{ textDecoration: 'none' }}>
                  <span style={{
                    padding: '3px 11px', fontSize: '0.68rem', fontWeight: 500,
                    border: '1px solid var(--rule-strong)', fontFamily: 'var(--font-mono)',
                    color: 'var(--ink-soft)', letterSpacing: '0.04em', textTransform: 'uppercase',
                    display: 'inline-block', borderRadius: 2,
                  }}>{g.name}</span>
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800, lineHeight: 1.04,
              letterSpacing: '-0.02em', color: 'var(--ink)',
              marginBottom: '0.5rem',
            }}>
              {movie.title}
            </h1>

            {movie.tagline && (
              <p style={{ fontFamily: "var(--font-sans)", fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--ink-soft)', marginBottom: '1.4rem' }}>
                "{movie.tagline}"
              </p>
            )}

            {/* Key stats banner */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.6rem', padding: '1rem 0', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
              {movie.vote_average > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RatingRing value={movie.vote_average} size={46} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TMDB Score</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                      {movie.vote_count ? `${movie.vote_count.toLocaleString()} votes` : '—'}
                    </span>
                  </div>
                </div>
              )}

              {[
                { label: 'Release Date', value: movie.release_date || '—' },
                movie.runtime && { label: 'Runtime', value: `${movie.runtime} min` },
                directors.length > 0 && { label: 'Director', value: directors.map(d => d.name).join(', ') },
                movie.status && { label: 'Status', value: movie.status },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Overview */}
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.96rem', color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 680 }}>
              {movie.overview}
            </p>

            {/* Additional Info Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem',
              background: 'var(--paper2)',
              padding: '1.2rem',
              border: '1px solid var(--rule-strong)',
              borderRadius: 6,
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Budget</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)' }}>{formatCurrency(movie.budget)}</div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Revenue</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent)' }}>{formatCurrency(movie.revenue)}</div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Original Language</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase' }}>
                  {movie.original_language || 'EN'}
                </div>
              </div>

              {writers.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>Written By</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>
                    {writers.map(w => w.name).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── WHERE SHOULD I WATCH THIS MOVIE SECTION ── */}
        <div style={{ marginTop: '3.5rem' }}>
          <WatchProviders providersData={movie['watch/providers']?.results} />
        </div>

        {/* ── TRAILERS & VIDEOS GALLERY ── */}
        {videosList.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700,
              color: 'var(--ink)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Play size={18} color="var(--accent)" fill="var(--accent)" /> Video Trailers & Teasers ({videosList.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {videosList.slice(0, 3).map((vid) => (
                <div key={vid.id} style={{ border: '1px solid var(--rule-strong)', background: '#000', position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${vid.key}`}
                      title={vid.name || 'Trailer'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: '8px 12px', background: 'var(--paper2)', borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {vid.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '2px 6px', background: 'var(--paper-raised)', color: 'var(--ink)' }}>
                      {vid.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CAST & CREW SECTION ── */}
        {cast.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700,
              color: 'var(--ink)', marginBottom: '1.2rem',
            }}>Featured Cast</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1.2rem' }}>
              {cast.map(person => (
                <div key={person.id} style={{
                  background: 'var(--paper-raised)',
                  border: '1px solid var(--rule-strong)',
                  padding: '12px 10px',
                  textAlign: 'center',
                  borderRadius: 6,
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
                    border: '1px solid var(--rule-strong)', margin: '0 auto 8px', background: 'var(--paper2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {person.profile_path
                      ? <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={26} color="var(--ink-faint)" />
                    }
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{person.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--ink-faint)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {person.character || 'Cast'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KEYWORDS / TAGS ── */}
        {keywordsList.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10 }}>
              Archive Keywords & Topics
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {keywordsList.slice(0, 15).map(kw => (
                <Link
                  key={kw.id}
                  to={`/search?q=${encodeURIComponent(kw.name)}`}
                  style={{
                    padding: '4px 10px',
                    background: 'var(--paper2)',
                    border: '1px solid var(--rule-strong)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--ink-soft)',
                    textDecoration: 'none',
                    borderRadius: 4,
                  }}
                >
                  #{kw.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── RECOMMENDATIONS ── */}
        {recs.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <div className="rule" style={{ marginBottom: '2.5rem' }} />
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700,
              color: 'var(--ink)', marginBottom: '1.2rem',
            }}>Recommended Movies</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '1.5rem 1.1rem' }}>
              {recs.slice(0, 12).map((m, i) => (
                <RevealItem key={m.id} delay={(i % 8) * 45}>
                  <MovieCard movie={m} index={i} />
                </RevealItem>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal Popup */}
      <TrailerModal
        isOpen={trailerModalOpen}
        videoKey={activeVideoKey}
        videos={videosList}
        title={movie.title}
        onClose={() => setTrailerModalOpen(false)}
        onSelectVideo={(key) => setActiveVideoKey(key)}
      />
    </div>
  );
}
