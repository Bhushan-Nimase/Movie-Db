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
      <div
        style={{
          padding: '1rem 3rem',
          color: 'var(--muted)',
          fontSize: '0.82rem',
          fontStyle: 'italic',
        }}
      >
        No movies in your list yet — hit the ♡ on any card to save one.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        paddingBottom: 8,
        scrollSnapType: 'x mandatory',
      }}
      className="mylist-scroll"
    >
      <style>{`
        .mylist-scroll::-webkit-scrollbar{height:3px}
        .mylist-scroll::-webkit-scrollbar-track{background:var(--bg2)}
        .mylist-scroll::-webkit-scrollbar-thumb{background:var(--accent);border-radius:2px}
        .mylist-item-wrap:hover .mylist-rm{opacity:1!important}
      `}</style>

      {validFavorites.map((m) => (
        <div
          key={m.id}
          className="mylist-item-wrap"
          style={{
            flexShrink: 0,
            width: 110,
            scrollSnapAlign: 'start',
            position: 'relative',
          }}
        >
          <div
            onClick={() => navigate(`/movie/${m.id}`)}
            style={{
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'transform 0.25s, border-color 0.25s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <img
              src={getPosterUrl(m)}
              alt={m.title || m.name || 'Movie poster'}
              style={{
                width: '100%',
                aspectRatio: '2/3',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            <div
              style={{
                padding: '6px 8px 8px',
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.78)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: 'var(--bg3)',
              }}
            >
              {m.title || m.name || 'Untitled'}
            </div>
          </div>

          <button
            className="mylist-rm"
            onClick={(e) => {
              e.stopPropagation();
              removeFromFavorites(m.id);
            }}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.75)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
          >
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  );
}