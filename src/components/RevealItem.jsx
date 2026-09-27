import { useEffect, useRef, useState } from 'react';

// Fades + slides a child up into view the first time it enters the viewport.
// Used to give grids (which grow via infinite scroll) a staggered reveal.
export default function RevealItem({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Safety fallback: guarantee visibility after brief delay even if IntersectionObserver is delayed or missed
    const fallbackTimer = setTimeout(() => {
      setVisible(true);
    }, delay + 180);

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return () => clearTimeout(fallbackTimer);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay);
          io.unobserve(el);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.01, rootMargin: '300px' }
    );
    io.observe(el);

    return () => {
      clearTimeout(fallbackTimer);
      io.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-item${visible ? ' is-visible' : ''}`}>
      {children}
    </div>
  );
}
