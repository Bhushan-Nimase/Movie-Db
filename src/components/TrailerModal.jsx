import { useEffect } from 'react';
import { X, Film, Play } from 'lucide-react';

export default function TrailerModal({ isOpen, videoKey, videos = [], title, onClose, onSelectVideo }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 13, 10, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 920,
          background: 'var(--paper)',
          border: '1px solid var(--ink)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header bar */}
        <div style={{
          padding: '1rem 1.4rem',
          background: 'var(--ink)',
          color: 'var(--paper)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--rule-strong)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <Film size={16} color="var(--accent)" />
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--paper)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {title ? `${title} — Official Trailer` : 'Trailer Preview'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--paper)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              borderRadius: 4,
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player */}
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
          {videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              title={title || 'Trailer'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', gap: 10 }}>
              <Film size={36} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>No video preview available for this title.</p>
            </div>
          )}
        </div>

        {/* Video Selector list if multiple trailers exist */}
        {videos.length > 1 && (
          <div style={{ padding: '1rem 1.4rem', background: 'var(--paper2)', borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
              Available Clips & Trailers ({videos.length})
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {videos.map((vid) => {
                const isSelected = vid.key === videoKey;
                return (
                  <button
                    key={vid.id || vid.key}
                    onClick={() => onSelectVideo && onSelectVideo(vid.key)}
                    style={{
                      padding: '6px 12px',
                      background: isSelected ? 'var(--ink)' : 'var(--paper)',
                      color: isSelected ? 'var(--paper)' : 'var(--ink)',
                      border: `1px solid ${isSelected ? 'var(--ink)' : 'var(--rule-strong)'}`,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <Play size={10} fill={isSelected ? 'var(--accent)' : 'none'} color={isSelected ? 'var(--accent)' : 'currentColor'} />
                    {vid.name || vid.type}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
