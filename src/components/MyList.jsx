import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../contexts/MovieContext';
import { getPosterUrl } from '../utils/images';
import { X } from 'lucide-react';

export default function MyListRow() {
  const { favorites = [], removeFromFavorites } = useMovieContext();
  const navigate = useNavigate();

  const validFavorites = favorites.filter((m) => m && m.id);

  if (validFavorites.length === 0) {
    return (
      <div style={{
        padding: '0.5rem 0',
        color: 'var(--ink-faint)',
        fontFamily: "var(--font-sans)",
        fontSize: '0.9rem',
      }}>
        Your shelf is empty — tap the heart icon on any entry to file it here.
      </div>
    );
  }

  return (
    <div
      className="mylist-scroll"
      style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}
    >
      <style>{`
        .mylist-scroll::-webkit-scrollbar { height: 3px; }
        .mylist-scroll::-webkit-scrollbar-thumb { background: var(--rule-strong); }
        .mylist-item-wrap:hover .mylist-rm { opacity: 1 !important; }
        .mylist-item-wrap .mylist-poster { opacity: 0.9; transition: opacity 0.3s, transform 0.3s; }
        .mylist-item-wrap:hover .mylist-poster { opacity: 1; transform: scale(1.03); }
        .mylist-item-wrap:hover .mylist-frame { border-color: var(--ink); }
      `}</style>

      {validFavorites.map((m) => (
        <div key={m.id} className="mylist-item-wrap" style={{ flexShrink: 0, width: 108, scrollSnapAlign: 'start', position: 'relative' }}>
          <div
            className="mylist-frame"
            onClick={() => navigate(`/movie/${m.id}`)}
            style={{ border: '1px solid var(--rule)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.25s' }}
          >
            <img src={getPosterUrl(m)} alt={m.title || m.name || 'Movie poster'} className="mylist-poster"
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }} />
            <div style={{
              padding: '6px 7px 8px', fontFamily: 'var(--font-serif)', fontSize: '0.72rem', fontWeight: 600,
              color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              background: 'var(--paper-raised)', borderTop: '1px solid var(--rule)',
            }}>
              {m.title || m.name || 'Untitled'}
            </div>
          </div>

          <button
            className="mylist-rm"
            onClick={(e) => { e.stopPropagation(); removeFromFavorites(m.id); }}
            style={{
              position: 'absolute', top: 6, right: 6, width: 22, height: 22,
              background: 'var(--ink)', border: 'none', color: 'var(--paper)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
            }}
          >
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}
