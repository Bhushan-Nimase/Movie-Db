import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Calendar } from "lucide-react";

import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
} from "../services/api";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Movie Details
      const movieData = await getMovieDetails(id);
      if (movieData.success === false) {
        throw new Error(movieData.status_message || "Failed to fetch movie details");
      }
      setMovie(movieData);

      // Cast
      const creditsData = await getMovieCredits(id);
      setCast(creditsData.cast?.slice(0, 8) || []);

      // Trailer
      const videoData = await getMovieVideos(id);

      const trailerVideo = videoData.results?.find(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube"
      );

      if (trailerVideo) {
        setTrailer(trailerVideo.key);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load movie details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
        <div className="text-2xl">{error || "Movie not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* Poster */}
        <div>
          <img
            src={`${IMAGE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            {movie.title}
          </h1>

          {/* Rating Runtime Release */}
          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" size={20} />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{movie.runtime} min</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{movie.release_date}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-3">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-red-600 px-4 py-2 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Overview
            </h2>

            <p className="text-gray-300 leading-7">
              {movie.overview}
            </p>
          </div>

          {/* Production Companies */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">
              Production Companies
            </h2>

            <div className="flex flex-wrap gap-3">
              {movie.production_companies?.map((company) => (
                <span
                  key={company.id}
                  className="bg-gray-800 px-4 py-2 rounded-lg"
                >
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-3xl font-bold mb-6">
            Trailer
          </h2>

          <div className="aspect-video rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer}`}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Cast */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-6">
          Top Cast
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {cast.map((actor) => (
            <div
              key={actor.id}
              className="bg-gray-900 rounded-2xl overflow-hidden hover:scale-105 transition duration-300"
            >
              <img
                src={
                  actor.profile_path
                    ? `${IMAGE_URL}${actor.profile_path}`
                    : "https://via.placeholder.com/300x450"
                }
                alt={actor.name}
                className="w-full h-72 object-cover"
              />

              <div className="p-3">
                <h3 className="font-semibold text-sm">
                  {actor.name}
                </h3>

                <p className="text-gray-400 text-xs mt-1">
                  {actor.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}