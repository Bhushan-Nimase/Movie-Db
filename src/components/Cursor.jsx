import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      const target = e.target.closest('a, button, .movie-card, select, input');
      setIsHovered(Boolean(target));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrame;
    const animate = () => {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* Sleek Minimal Precision Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          background: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          margin: '-3px 0 0 -3px',
          transition: 'transform 0.05s linear, opacity 0.2s ease',
        }}
      />

      {/* Subtle Fluid Minimal Follower Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? 34 : 22,
          height: isHovered ? 34 : 22,
          margin: isHovered ? '-17px 0 0 -17px' : '-11px 0 0 -11px',
          border: `1px solid ${isHovered ? 'var(--accent)' : 'var(--ink-faint)'}`,
          opacity: isHovered ? 0.85 : 0.45,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'width 0.22s ease-out, height 0.22s ease-out, margin 0.22s ease-out, border 0.22s ease-out, opacity 0.22s ease-out',
          background: isHovered ? 'var(--accent-soft)' : 'transparent',
        }}
      />
    </>
  );
}
