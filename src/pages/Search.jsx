import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, RefreshCw, SlidersHorizontal, Film, Play, Star, Calendar, Flame, Sparkles } from 'lucide-react';
import { fetchAdvancedSearch, GENRES_LIST } from '../services/api';
import MovieCard from '../components/MovieCard';
import RevealItem from '../components/RevealItem';
import SkeletonGrid from '../components/SkeletonGrid';
import TrailerModal from '../components/TrailerModal';

const QUICK_SEARCHES = [
  { label: 'Top 2026 Hits', query: '', genre: '', year: '2026', rating: '' },
  { label: 'Masterpieces (8.0+)', query: '', genre: '', year: '', rating: '8' },
  { label: 'Sci-Fi Epic', query: '', genre: '878', year: '', rating: '' },
  { label: 'Horror Night', query: '', genre: '27', year: '', rating: '' },
  { label: '90s Classics', query: '', genre: '', year: '1990s', rating: '7' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params initialization
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';
  const initialYear = searchParams.get('year') || '';
  const initialRating = searchParams.get('rating') || '';
  const initialSort = searchParams.get('sort') || 'popularity.desc';

  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [year, setYear] = useState(initialYear);
  const [rating, setRating] = useState(initialRating);
  const [sortBy, setSortBy] = useState(initialSort);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Trailer modal state
  const [activeTrailer, setActiveTrailer] = useState(null);

  const debounceTimer = useRef();

  const loadData = useCallback(async (isNewSearch = true, currentPage = 1) => {
    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      let yearParam = year;
      if (year === '2020s') yearParam = '2022';
      else if (year === '1990s') yearParam = '1995';

      const data = await fetchAdvancedSearch({
        query,
        genre,
        year: yearParam,
        rating,
        sortBy,
        page: currentPage,
      });

      if (isNewSearch) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
    } catch (err) {
      setError(err?.message || 'Failed to search movies.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, genre, year, rating, sortBy]);

  // Sync URL search params
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (genre) params.genre = genre;
    if (year) params.year = year;
    if (rating) params.rating = rating;
    if (sortBy !== 'popularity.desc') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [query, genre, year, rating, sortBy, setSearchParams]);

  // Trigger search on filter changes with debounce
  useEffect(() => {
    setPage(1);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadData(true, 1);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [query, genre, year, rating, sortBy, loadData]);

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(false, nextPage);
    }
  };

  const clearAllFilters = () => {
    setQuery('');
    setGenre('');
    setYear('');
    setRating('');
    setSortBy('popularity.desc');
  };

  const applyQuickSearch = (qs) => {
    setQuery(qs.query);
    setGenre(qs.genre);
    setYear(qs.year);
    setRating(qs.rating);
  };

  const activeFilterCount = [genre, year, rating, sortBy !== 'popularity.desc', query].filter(Boolean).length;

  return (
    <div style={{ padding: '2.5rem', minHeight: '85vh' }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          Database Search & Discovery
        </div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.8vw, 3rem)',
          fontWeight: 700,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
        }}>
          Archive Search
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-soft)', marginTop: 4 }}>
          Search TMDB database with advanced filters by genre, rating score, year, and popularity sorting.
        </p>
      </div>

      {/* ── Search Input & Quick Chips ── */}
      <div style={{
        background: 'var(--paper-raised)',
        border: '1px solid var(--rule-strong)',
        padding: '1.4rem 1.6rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      }}>
        {/* Input row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '2px solid var(--rule-strong)',
          paddingBottom: '0.6rem',
          marginBottom: '1.2rem',
        }}>
          <SearchIcon size={20} color="var(--accent)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type movie title, franchise, or keyword…"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              color: 'var(--ink)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick search tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Quick Presets:
          </span>
          {QUICK_SEARCHES.map((qs) => (
            <button
              key={qs.label}
              onClick={() => applyQuickSearch(qs)}
              style={{
                padding: '4px 12px',
                background: 'var(--paper2)',
                border: '1px solid var(--rule-strong)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--ink-soft)',
                cursor: 'pointer',
                borderRadius: 4,
                transition: 'all 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.fontWeight = '700';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--paper2)';
                e.currentTarget.style.color = 'var(--ink-soft)';
                e.currentTarget.style.fontWeight = '400';
              }}
            >
              {qs.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Advanced Filter Toolbar ── */}
      <div style={{
        background: 'var(--paper2)',
        border: '1px solid var(--rule-strong)',
        padding: '1.2rem 1.4rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '1.2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600 }}>
          <SlidersHorizontal size={15} color="var(--accent)" /> FILTERS
        </div>

        {/* Genre filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>
            Genre
          </label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              padding: '6px 12px',
              background: 'var(--paper)',
              border: '1px solid var(--rule-strong)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--ink)',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            <option value="">All Genres</option>
            {GENRES_LIST.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>
            Release Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: '6px 12px',
              background: 'var(--paper)',
              border: '1px solid var(--rule-strong)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--ink)',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2020s">2020s Era</option>
            <option value="1990s">1990s Era</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>
            Min Rating
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={{
              padding: '6px 12px',
              background: 'var(--paper)',
              border: '1px solid var(--rule-strong)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--ink)',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            <option value="">Any Score</option>
            <option value="8">8.0+ Masterpiece</option>
            <option value="7">7.0+ High Acclaim</option>
            <option value="6">6.0+ Good Watch</option>
          </select>
        </div>

        {/* Sort order */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-faint)', textTransform: 'uppercase' }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              background: 'var(--paper)',
              border: '1px solid var(--rule-strong)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--ink)',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rating</option>
            <option value="primary_release_date.desc">Release Date (Newest)</option>
            <option value="title.asc">Title (A-Z)</option>
          </select>
        </div>

        {/* Reset button */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              marginTop: 'auto',
              padding: '7px 14px',
              background: 'none',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 4,
            }}
          >
            <RefreshCw size={12} /> Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* ── Results Info Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        paddingBottom: '0.8rem',
        borderBottom: '1px solid var(--rule)',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
          Found <strong style={{ color: 'var(--ink)' }}>{totalResults.toLocaleString()}</strong> results
          {query && <span> for "<strong style={{ color: 'var(--accent)' }}>{query}</strong>"</span>}
        </div>

        {loading && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>
            Searching database…
          </div>
        )}
      </div>

      {/* ── Results Grid ── */}
      {loading ? (
        <SkeletonGrid count={16} />
      ) : error ? (
        <div style={{
          padding: '2.5rem',
          background: 'var(--accent-soft)',
          border: '1px solid var(--rule-strong)',
          textAlign: 'center',
          color: 'var(--accent-dim)',
          fontFamily: 'var(--font-mono)',
        }}>
          <p style={{ marginBottom: 10 }}>{error}</p>
          <button
            onClick={() => loadData(true, 1)}
            style={{ padding: '8px 16px', background: 'var(--ink)', color: 'var(--paper)', border: 'none', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      ) : movies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ink-soft)' }}>
          <Film size={48} strokeWidth={1} color="var(--ink-faint)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--ink)', marginBottom: 8 }}>
            No Matching Movies Found
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            Try broadening your search keywords or removing some filters.
          </p>
          <button
            onClick={clearAllFilters}
            style={{
              padding: '10px 20px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '1.5rem 1.1rem' }}>
            {movies.map((m, i) => (
              <RevealItem key={`${m.id}-${i}`} delay={(i % 10) * 35}>
                <MovieCard movie={m} index={i} />
              </RevealItem>
            ))}
          </div>

          {/* Load More Button */}
          {page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: '12px 32px',
                  background: loadingMore ? 'var(--paper2)' : 'var(--accent)',
                  color: '#000',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: loadingMore ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                  fontWeight: 700,
                  borderRadius: 4,
                }}
              >
                {loadingMore ? 'Loading More Movies…' : `Load More (${totalResults - movies.length} Remaining)`}
              </button>
            </div>
          )}
        </>
      )}

      {/* Trailer modal if triggered */}
      {activeTrailer && (
        <TrailerModal
          isOpen={Boolean(activeTrailer)}
          videoKey={activeTrailer.key}
          title={activeTrailer.title}
          onClose={() => setActiveTrailer(null)}
        />
      )}
    </div>
  );
}
