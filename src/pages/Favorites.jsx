import { useMovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';
import RevealItem from '../components/RevealItem';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const { favorites } = useMovieContext();

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '3.2rem 2.5rem 2rem', borderBottom: '1px solid var(--rule)' }}>
        <div className="eyebrow" style={{ marginBottom: '1rem' }}>
          Filed by You
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 700, lineHeight: 1.0,
          letterSpacing: '-0.02em', color: 'var(--ink)',
          marginBottom: '0.7rem',
        }}>
          My Shelf
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontSize: '0.82rem' }}>
          {favorites.length
            ? `${favorites.length} title${favorites.length !== 1 ? 's' : ''} on file`
            : 'Titles you save will be archived here'}
        </p>
      </div>

      {/* Grid */}
      <div style={{ padding: '2.2rem 2.5rem 3rem' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--ink-faint)' }}>
            <Heart size={40} style={{ margin: '0 auto 1.2rem', opacity: 0.4, display: 'block' }} strokeWidth={1.4} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
              Nothing filed yet
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Browse titles and tap the heart icon on any entry to file it here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '1.5rem 1.1rem' }}>
            {favorites.map((m, i) => (
              <RevealItem key={m.id} delay={(i % 8) * 45}>
                <MovieCard movie={m} index={i} />
              </RevealItem>
            ))}
          </div>
        )}
      </div>

      <footer style={{
        padding: '2.4rem 2.5rem', borderTop: '1px solid var(--rule)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--ink-faint)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
      }}>
        <span>© 2026 The Reel — Powered by TMDB</span>
        <span>Built by Bhushan Nimase</span>
      </footer>
    </div>
  );
}
