// Circular percentage ring, in the spirit of TMDB's score badge —
// re-themed with our editorial ink/paper palette instead of a dark chip.
export default function RatingRing({ value = 0, size = 40, stroke = 3 }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / 10) * 100)));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  const color = pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--gold)' : 'var(--accent-dim)';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="var(--paper)" stroke="var(--rule)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="butt"
          strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      <span style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)',
        fontSize: size * 0.28,
      }}>
        {pct}
      </span>
    </div>
  );
}
