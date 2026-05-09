import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Calendar, Play, X, ChevronRight } from "lucide-react";

import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
} from "../services/api";

const IMAGE_URL = "https://image.tmdb.org/t/p/original";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [loading, setLoading] = useState(true);

  // Animation and Modal states
  const [isMounted, setIsMounted] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [details, credits, videos] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id)
        ]);
        setMovie(details);
        setCast(credits.cast?.slice(0, 8) || []);
        setTrailer(videos.results?.find(v => v.type === "Trailer" && v.site === "YouTube")?.key);

        // Trigger animations slightly after data loads
        setTimeout(() => setIsMounted(true), 100);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // Lock body scroll when trailer modal is open
  useEffect(() => {
    if (showTrailer) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [showTrailer]);

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-white selection:text-black font-sans relative">

      {/* --- BACKGROUND WITH SLOW ZOOM ANIMATION --- */}
      <div className="fixed inset-0 z-0">
        <div
          className={`absolute inset-0 bg-cover bg-[center_top] transition-transform duration-[10s] ease-out ${isMounted ? 'scale-100' : 'scale-110'}`}
          style={{ backgroundImage: `url(${IMAGE_URL}${movie.backdrop_path})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* --- MAIN CONTENT OVERLAY --- */}
      <div className="relative z-10 pt-[15vh] pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left: Poster Reveal */}
            <div className="lg:col-span-4 perspective-1000 hidden md:block">
              <div
                className={`transition-all duration-1000 ease-out transform ${isMounted ? 'opacity-100 translate-y-0 rotate-y-0' : 'opacity-0 translate-y-20 -rotate-y-12'}`}
              >
                <img
                  src={`${IMAGE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(255,255,255,0.15)] hover:ring-white/30"
                />
              </div>
            </div>

            {/* Right: Movie Info Reveal */}
            <div className="lg:col-span-8 flex flex-col justify-center">

              {/* Title */}
              <h1
                className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6 transition-all duration-1000 delay-100 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-500`}
              >
                {movie.title}
              </h1>

              {/* Quick Stats */}
              <div
                className={`flex flex-wrap items-center gap-6 text-sm md:text-base font-medium tracking-wide text-white/70 mb-10 transition-all duration-1000 delay-200 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <Star size={18} fill="currentColor" /> {movie.vote_average.toFixed(1)}
                </span>
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                <span className="flex items-center gap-1.5"><Clock size={18} /> {movie.runtime} min</span>
                <span className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                <span className="flex items-center gap-1.5"><Calendar size={18} /> {movie.release_date.split('-')[0]}</span>

                <div className="flex gap-2 ml-auto">
                  {movie.genres?.slice(0, 2).map(g => (
                    <span key={g.id} className="px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs uppercase tracking-wider">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <p
                className={`text-lg md:text-xl text-white/80 leading-relaxed font-light max-w-3xl mb-12 transition-all duration-1000 delay-300 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                {movie.overview}
              </p>

              {/* Actions */}
              <div
                className={`flex gap-6 transition-all duration-1000 delay-500 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="group relative px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-wider flex items-center gap-3 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <Play size={20} fill="black" />
                    <span>Play Trailer</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* --- ANIMATED CAST SCROLL --- */}
        <div
          className={`mt-32 w-full transition-all duration-1000 delay-700 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Starring Cast</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/5 to-transparent ml-8" />
          </div>

          <div className="flex gap-6 overflow-x-auto pb-12 pt-4 custom-scrollbar snap-x w-full">
            {/* Left alignment spacer */}
            <div className="shrink-0 w-0 md:w-6 xl:w-[calc((100vw-80rem)/2+1.5rem)]" />
            {cast.map((actor, index) => (
              <div
                key={actor.id}
                className={`snap-start flex-shrink-0 w-36 md:w-44 group transition-all duration-700 ease-out transform`}
                style={{
                  transitionDelay: `${800 + (index * 100)}ms`,
                  opacity: isMounted ? 1 : 0,
                  transform: isMounted ? 'translateY(0)' : 'translateY(40px)'
                }}
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 ring-1 ring-white/10 bg-white/5 shadow-lg group-hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] transition-all duration-500 group-hover:ring-white/30">
                  <img
                    src={actor.profile_path ? `${IMAGE_URL}${actor.profile_path}` : "https://via.placeholder.com/300"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={actor.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h4 className="font-bold text-white text-sm md:text-base truncate">{actor.name}</h4>
                <p className="text-xs text-white/50 truncate mt-1">{actor.character}</p>
              </div>
            ))}
            {/* Right alignment spacer */}
            <div className="shrink-0 w-0 md:w-6 xl:w-[calc((100vw-80rem)/2+1.5rem)]" />
          </div>
        </div>
      </div>

      {/* --- CINEMATIC TRAILER MODAL --- */}
      {trailer && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 transition-all duration-500 ease-in-out ${showTrailer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Dim Overlay */}
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={() => setShowTrailer(false)}
          />

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-6xl bg-black rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl transition-all duration-500 delay-100 ${showTrailer ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>
            <div className="aspect-video w-full">
              {showTrailer && ( // Only render iframe when modal is open to prevent background playing
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS for custom scrollbar and animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}