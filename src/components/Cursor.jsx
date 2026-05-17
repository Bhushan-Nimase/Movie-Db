import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef();
  const ringRef = useRef();

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', move);

    let raf;
    const tick = () => {
      if (dotRef.current)  { dotRef.current.style.left  = mx + 'px'; dotRef.current.style.top  = my + 'px'; }
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = rx + 'px'; ringRef.current.style.top = ry + 'px'; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
