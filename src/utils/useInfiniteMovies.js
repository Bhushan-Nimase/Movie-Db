import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Handles paginated fetching + "load more on scroll" for a grid of movies.
 *
 * fetchPage(page)  -> should return an array of movie objects for that page
 * resetKey         -> changing this (e.g. a genre id) clears the list and starts over
 */
export default function useInfiniteMovies(fetchPage, resetKey) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const pageRef     = useRef(1);
  const doneRef     = useRef(false);
  const busyRef     = useRef(false);
  const fetchRef    = useRef(fetchPage);
  const sentinelRef = useRef(null);

  fetchRef.current = fetchPage;

  const loadMore = useCallback(async () => {
    if (busyRef.current || doneRef.current) return;
    busyRef.current = true;
    setLoading(true);

    try {
      const results = await fetchRef.current(pageRef.current);
      if (!results || results.length === 0) {
        doneRef.current = true;
      } else {
        pageRef.current += 1;
        setItems(prev => {
          const seen = new Set(prev.map(m => m.id));
          return [...prev, ...results.filter(m => !seen.has(m.id))];
        });
      }
    } catch (err) {
      doneRef.current = true;
      setError(err.message || 'Could not load titles.');
    }

    setLoading(false);
    busyRef.current = false;
  }, []);

  // reset + load page 1 whenever resetKey changes
  useEffect(() => {
    setItems([]);
    setError(null);
    pageRef.current = 1;
    doneRef.current = false;
    busyRef.current = false;
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // observe the sentinel — load the next page once it scrolls into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, items.length]);

  return { items, loading, error, sentinelRef };
}
