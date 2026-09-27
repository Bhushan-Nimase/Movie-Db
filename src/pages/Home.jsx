import { useState, useEffect } from 'react';
import { Key, AlertTriangle } from 'lucide-react';
import MovieCard from "../components/MovieCard";
import HeroCarousel from "../components/Hero";
import MyListRow from "../components/MyList";
import SkeletonGrid, { LoadingMore } from '../components/SkeletonGrid';
import GenreFilter from '../components/GenreFilter';
import RevealItem from '../components/RevealItem';
import useInfiniteMovies from '../utils/useInfiniteMovies';
import { fetchTrending, fetchPopular, fetchByGenre, fetchNowPlaying } from '../services/api';

// ── reusable section wrapper ───────────────────────────────────────
function Section({ eyebrow, title, children }) {
  return (
    <section style={{ padding: '2.2rem 2.5rem 0.25rem' }}>
      <div style={{ marginBottom: '1.2rem' }}>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <h2 style={{
          fontFamily: "var(--font-serif)", fontSize: '1.5rem',
          fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em',
        }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Grid({ movies }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '1.5rem 1.1rem' }}>
      {movies.map((m, i) => (
        <RevealItem key={m.id} delay={(i % 8) * 45}>
          <MovieCard movie={m} index={i} />
        </RevealItem>
      ))}
    </div>
  );
}

// ── inline error strip for a single section ────────────────────────
function SectionError({ message }) {
  return (
    <div style={{
      padding: '1rem 1.2rem', border: '1px solid var(--rule-strong)', background: 'var(--accent-soft)',
      fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-dim)', lineHeight: 1.7,
    }}>
      Couldn't load this section — {message}
    </div>
  );
}

// ── infinite scrolling section ───────────────────────────────────────
function InfiniteSection({ eyebrow, title, fetchPage, resetKey, extra }) {
  const { items, loading, error, sentinelRef } = useInfiniteMovies(fetchPage, resetKey);

  return (
    <Section eyebrow={eyebrow} title={title}>
      {extra}
      {items.length === 0 && loading ? (
        <SkeletonGrid count={12} />
      ) : items.length === 0 && error ? (
        <SectionError message={error} />
      ) : (
        <>
          <Grid movies={items} />
          {loading && <LoadingMore />}
          {error && items.length > 0 && <SectionError message={error} />}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </>
      )}
    </Section>
  );
}

// ── error banner for the whole page (missing/invalid key, network, etc) ──
function ApiErrorBanner({ error }) {
  const isKeyIssue = error?.code === 'MISSING_KEY' || error?.code === 'INVALID_KEY';
  return (
    <div style={{
      margin: '3rem 3rem 0', padding: '1.4rem 1.6rem',
      background: 'var(--accent-soft)', border: '1px solid var(--rule-strong)',
      display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {isKeyIssue ? <Key size={22} color="var(--accent)" /> : <AlertTriangle size={22} color="var(--accent)" />}
      </span>
      <div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 6 }}>
          {isKeyIssue ? 'TMDB API key problem' : 'Couldn\u2019t reach TMDB'}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-soft)', lineHeight: 1.8 }}>
          {error?.message || 'Something went wrong.'}
        </p>
        {isKeyIssue && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-soft)', lineHeight: 1.8, marginTop: 8 }}>
            Open <code style={{ background: 'var(--paper2)', padding: '1px 6px' }}>.env</code> in your project root, set:<br />
            <code style={{ background: 'var(--paper2)', padding: '2px 8px' }}>VITE_TMDB_API_KEY=your_api_key_here</code>
            <br />then fully stop and restart the dev server (<code style={{ background: 'var(--paper2)', padding: '1px 6px' }}>npm run dev</code>) —
            Vite only reads <code style={{ background: 'var(--paper2)', padding: '1px 6px' }}>.env</code> on startup.
          </p>
        )}
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────
export default function Home() {
  const [heroMovies, setHeroMovies] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState(28); // default: Action

  useEffect(() => {
    (async () => {
      try {
        const t = await fetchTrending(1);
        setHeroMovies(t.slice(0, 5));
      } catch (err) {
        setError(err);
      } finally {
        setHeroLoading(false);
      }
    })();
  }, []);

  if (error) return <div style={{ paddingTop: 32 }}><ApiErrorBanner error={error} /></div>;

  return (
    <div>
      {heroLoading ? (
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--rule)' }}>
          <span style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            LOADING ISSUE…
          </span>
        </div>
      ) : heroMovies.length > 0 ? (
        <HeroCarousel movies={heroMovies} />
      ) : null}

      {/* My List horizontal strip */}
      <Section eyebrow="Filed by You" title="My Shelf">
        <MyListRow />
      </Section>

      <div className="rule" style={{ margin: '1.6rem 2.5rem 0' }} />

      {/* Now Playing — infinite scroll */}
      <InfiniteSection
        eyebrow="In Theatres Now"
        title="Now Playing"
        fetchPage={fetchNowPlaying}
        resetKey="now-playing"
      />

      <div className="rule" style={{ margin: '0.6rem 2.5rem 0' }} />

      {/* Trending — infinite scroll */}
      <InfiniteSection
        eyebrow="This Week's Talk"
        title="Trending"
        fetchPage={fetchTrending}
        resetKey="trending"
      />

      <div className="rule" style={{ margin: '0.6rem 2.5rem 0' }} />

      {/* Popular — infinite scroll */}
      <InfiniteSection
        eyebrow="The Standing Favourites"
        title="Popular"
        fetchPage={fetchPopular}
        resetKey="popular"
      />

      <div className="rule" style={{ margin: '0.6rem 2.5rem 0' }} />

      {/* Browse by genre — infinite scroll, resets on genre change */}
      <InfiniteSection
        eyebrow="Pick a Section"
        title="Browse by Genre"
        fetchPage={(page) => fetchByGenre(genre, page)}
        resetKey={`genre-${genre}`}
        extra={<div style={{ marginBottom: '1.8rem' }}><GenreFilter active={genre} onSelect={(id) => setGenre(id ?? 28)} /></div>}
      />

      <footer style={{
        padding: '2.4rem 2.5rem', marginTop: '1.4rem', borderTop: '1px solid var(--rule)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--ink-faint)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
      }}>
        <span>© 2026 The Reel — Powered by TMDB</span>
        <span>Built by Bhushan Nimase</span>
      </footer>
    </div>
  );
}
