const shimmer = {
  background: 'linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)',
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
        gap: 16,
      }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ aspectRatio: '2/3', ...shimmer }} />
            <div style={{ padding: '10px 12px 13px', background: 'var(--bg3)' }}>
              <div style={{ height: 10, borderRadius: 5, ...shimmer, marginBottom: 6 }} />
              <div style={{ height: 8, width: '50%', borderRadius: 5, ...shimmer }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
