import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming } from '../services/api';
import MovieCard from '../components/MovieCard';
import RevealItem from '../components/RevealItem';
import SkeletonGrid from '../components/SkeletonGrid';
import useInfiniteMovies from '../utils/useInfiniteMovies';

const CATEGORY_CONFIG = {
  trending: {
    title: "Trending This Week",
    eyebrow: "The Talk of Cinema",
    description: "Discover the most discussed, highly watched, and buzzworthy films across the globe this week.",
    fetcher: fetchTrending,
  },
  popular: {
    title: "Popular Movies",
    eyebrow: "The Standing Favourites",
    description: "The most popular releases right now, rated and viewed by millions of movie lovers worldwide.",
    fetcher: fetchPopular,
  },
  'top-rated': {
    title: "Top Rated All-Time",
    eyebrow: "Cinematic Masterpieces",
    description: "Timeless classics, critically acclaimed masterpieces, and highest audience rated films of all time.",
    fetcher: fetchTopRated,
  },
  upcoming: {
    title: "Upcoming Releases",
    eyebrow: "Coming Soon To Theatres",
    description: "Get a sneak peek at upcoming blockbusters, indie gems, and theatrical releases arriving soon.",
    fetcher: fetchUpcoming,
  },
};

export default function CategoryPage() {
  const { type = 'popular' } = useParams();
  const config = CATEGORY_CONFIG[type] || CATEGORY_CONFIG.popular;

  const { items, loading, error, sentinelRef } = useInfiniteMovies(config.fetcher, type);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <div style={{ padding: '2.5rem', minHeight: '85vh' }}>
      {/* Category Header */}
      <div style={{ marginBottom: '2.2rem', paddingBottom: '1.4rem', borderBottom: '1px solid var(--rule)' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          {config.eyebrow}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
          fontWeight: 700,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
        }}>
          {config.title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.92rem',
          color: 'var(--ink-soft)',
          maxWidth: 620,
          marginTop: 8,
          lineHeight: 1.6,
        }}>
          {config.description}
        </p>
      </div>

      {/* Movies Grid */}
      {items.length === 0 && loading ? (
        <SkeletonGrid count={16} />
      ) : items.length === 0 && error ? (
        <div style={{
          padding: '2rem',
          background: 'var(--accent-soft)',
          border: '1px solid var(--rule-strong)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-dim)',
        }}>
          Error loading {config.title}: {error}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '1.5rem 1.1rem' }}>
            {items.map((movie, i) => (
              <RevealItem key={`${movie.id}-${i}`} delay={(i % 10) * 35}>
                <MovieCard movie={movie} index={i} />
              </RevealItem>
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2.5rem 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>
              Loading more titles…
            </div>
          )}

          <div ref={sentinelRef} style={{ height: 20 }} />
        </>
      )}
    </div>
  );
}
