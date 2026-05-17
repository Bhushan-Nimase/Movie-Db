import { useMovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import { Heart } from 'lucide-react';

const NAV_H = 64;

export default function Favorites() {
  const { favorites } = useMovieContext();

  return (
    <div style={{ paddingTop: NAV_H, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '4rem 3rem 2.5rem',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid (from h1.html) */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.72rem', color: 'var(--accent)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'block', width: 20, height: 1, background: 'var(--accent)' }} />
            My Collection
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800, lineHeight: 1.0,
            letterSpacing: '-0.03em', color: 'var(--text)',
            marginBottom: '0.6rem',
          }}>
            My List
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
            {favorites.length
              ? `${favorites.length} movie${favorites.length !== 1 ? 's' : ''} saved`
              : 'Your saved movies will appear here'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '2.5rem 3rem 4rem' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--muted)' }}>
            <Heart size={48} style={{ margin: '0 auto 1.2rem', opacity: 0.3, display: 'block' }} />
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              Nothing saved yet
            </h3>
            <p style={{ fontSize: '0.85rem' }}>Browse movies and tap ♡ to add them here</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))', gap: 16 }}>
            {favorites.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>

      <footer style={{
        padding: '2rem 3rem',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--muted)', fontSize: '0.78rem',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span>© 2025 CineVault — Powered by TMDB</span>
        <span>Built by Bhushan Nimase</span>
      </footer>
    </div>
  );
}
