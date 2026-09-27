import { GENRE_MAP } from '../services/api';

// Curated order — the ones people actually browse by first
const GENRE_ORDER = [28, 35, 18, 27, 10749, 878, 53, 16, 12, 9648, 14, 80];

export default function GenreFilter({ active, onSelect }) {
  const genres = GENRE_ORDER.map(id => ({ id, name: GENRE_MAP[id] })).filter(g => g.name);

  return (
    <div
      className="genre-filter-scroll"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        overflowX: 'auto',
        paddingBottom: 4,
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <style>{`
        .genre-filter-scroll::-webkit-scrollbar { height: 0; }
        .genre-tab { position: relative; white-space: nowrap; padding-bottom: 12px; }
        .genre-tab::after {
          content: '';
          position: absolute; left: 0; right: 0; bottom: -1px;
          height: 2px; background: var(--accent);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.34,1.3,0.64,1);
        }
        .genre-tab.is-active::after,
        .genre-tab:hover::after { transform: scaleX(1); }
      `}</style>

      {genres.map(g => {
        const isActive = active === g.id;
        return (
          <button
            key={g.id}
            className={`genre-tab${isActive ? ' is-active' : ''}`}
            onClick={() => onSelect(isActive ? null : g.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--ink)' : 'var(--ink-faint)',
              fontWeight: isActive ? 600 : 400,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--ink-soft)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--ink-faint)'; }}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}
