import { useState, useEffect } from 'react';
import MovieCard from "../components/MovieCard";
import HeroCarousel from "../components/Hero";
import MyListRow from "../components/MyList";
import SkeletonGrid from '../components/SkeletonGrid';
import { fetchTrending, fetchPopular } from '../services/api';

// ── reusable section wrapper ───────────────────────────────────────
function Section({ title, children }) {
  return (
    <section style={{ padding: '2.5rem 3rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.4rem' }}>
        <h2 style={{
          fontFamily:"'Syne',sans-serif", fontSize:'1.15rem',
          fontWeight:700, color:'var(--text)',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ display:'block', width:3, height:18, background:'var(--accent)', borderRadius:2 }} />
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Grid({ movies }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(158px, 1fr))', gap:16 }}>
      {movies.map(m => <MovieCard key={m.id} movie={m} />)}
    </div>
  );
}

// ── API key missing banner ─────────────────────────────────────────
function NoKeyBanner() {
  return (
    <div style={{
      margin:'2rem 3rem 0', padding:'1.2rem 1.5rem',
      background:'rgba(212,168,83,0.08)', border:'1px solid rgba(212,168,83,0.25)',
      borderRadius:12, display:'flex', gap:12, alignItems:'flex-start',
    }}>
      <span style={{ fontSize:'1.3rem' }}>🔑</span>
      <div>
        <p style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--accent)', marginBottom:4 }}>
          TMDB API key missing
        </p>
        <p style={{ fontSize:'0.82rem', color:'rgba(212,168,83,0.75)', lineHeight:1.6 }}>
          Open <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4 }}>.env</code> in
          your project root and add:<br/>
          <code style={{ background:'rgba(255,255,255,0.08)', padding:'2px 8px', borderRadius:4 }}>
            VITE_TMDB_KEY=your_api_key_here
          </code>
          <br/>Then restart the dev server with <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4 }}>npm run dev</code>.
        </p>
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────
export default function Home() {
  const [trending,  setTrending]  = useState([]);
  const [popular,   setPopular]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [t, p] = await Promise.all([fetchTrending(), fetchPopular()]);
        setTrending(t);
        setPopular(p);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const heroMovies = trending.slice(0, 5);

  // ── no API key ──
  if (error === 'NO_KEY') return (
    <div style={{ paddingTop: 64 }}>
      <NoKeyBanner />
    </div>
  );

  // ── other error ──
  if (error) return (
    <div style={{ paddingTop: 64, textAlign:'center', padding:'6rem 3rem', color:'var(--muted)' }}>
      <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>⚠️</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", color:'var(--text)', marginBottom:8 }}>Something went wrong</h2>
      <p style={{ fontSize:'0.85rem' }}>{error} — check your API key in .env and restart the server.</p>
    </div>
  );

  return (
    <div>
      {/* Hero carousel — full viewport height */}
      {loading ? (
        <div style={{ height:'100vh', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'var(--muted)', fontFamily:"'JetBrains Mono',monospace", fontSize:'0.8rem', letterSpacing:'0.1em' }}>
            LOADING…
          </span>
        </div>
      ) : heroMovies.length > 0 ? (
        <HeroCarousel movies={heroMovies} />
      ) : null}

      {/* My List horizontal strip */}
      <Section title="My List">
        <MyListRow />
      </Section>

      <div style={{ height:1, background:'var(--border)', margin:'0 3rem' }} />

      {/* Trending grid */}
      <Section title="Trending This Week">
        {loading ? <SkeletonGrid count={6} /> : <Grid movies={trending.slice(0, 12)} />}
      </Section>

      <div style={{ height:1, background:'var(--border)', margin:'0 3rem' }} />

      {/* Popular grid */}
      <Section title="Popular Movies">
        {loading ? <SkeletonGrid count={6} /> : <Grid movies={popular.slice(0, 12)} />}
      </Section>

      <footer style={{
        padding:'2rem 3rem', borderTop:'1px solid var(--border)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        color:'var(--muted)', fontSize:'0.78rem',
        fontFamily:"'JetBrains Mono',monospace",
      }}>
        <span>© 2025 MovieDB — Powered by TMDB</span>
        <span>Built by Bhushan Nimase</span>
      </footer>
    </div>
  );
}
