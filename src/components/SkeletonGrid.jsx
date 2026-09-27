const shimmer = {
  background: 'linear-gradient(90deg, var(--paper2) 25%, var(--rule) 50%, var(--paper2) 75%)',
  backgroundSize: '200%',
  animation: 'shimmer 1.5s infinite',
};

export default function SkeletonGrid({ count = 6 }) {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))',
        gap: '1.75rem 1.25rem',
      }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <div style={{ aspectRatio: '2/3', border: '1px solid var(--rule)', ...shimmer }} />
            <div style={{ paddingTop: 10 }}>
              <div style={{ height: 12, width: '85%', ...shimmer, marginBottom: 8 }} />
              <div style={{ height: 1, background: 'var(--rule)', marginBottom: 6 }} />
              <div style={{ height: 9, width: '45%', ...shimmer }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function LoadingMore() {
  return (
    <div style={{
      textAlign: 'center', padding: '2.5rem 0',
      fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: 'var(--ink-faint)',
    }}>
      — turning the page —
    </div>
  );
}
