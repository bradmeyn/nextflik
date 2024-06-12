import { Movie } from "../../../lib/types/types";
import { StarIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function ListItem({
  movie,
  handleRemove,
}: {
  movie: Movie;
  handleRemove: (id: number) => void;
}) {
  const cast = movie.credits?.cast
    .splice(0, 4)
    .map((cast) => cast.name)
    .join(", ");

  const director = movie.credits?.crew
    .filter((crew) => crew.job === "Director")
    .map((director) => director.name)
    .join(", ");

  const moviePoster = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;

  return (
    <div
      className="bg-cover bg-top bg-no-repeat max-h-[400px] max-w-[800px] mx-auto rounded-lg relative overflow-hidden shadow-lg  "
      style={{
        backgroundImage: `linear-gradient(rgba(16, 23, 42, 0.8), rgba(16, 23, 42, 0.8)), url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`,
      }}
    >
      <div className="flex items-center gap-4 md:gap-8 p-4">
        <div className="w-[120px] sm:w-[150px] md:w-[160px]">
          <img src={moviePoster} alt={movie.title + " poster"} />
        </div>
        <div className="flex justify-between w-full">
          <div>
            <h1 className="mb-2 text-xl font-bold text-white  max-w-[1000px]">
              {movie.original_title}
            </h1>
            <p className=" mb-2 text-sm text-slate-300">
              <span>
                {new Date(movie.release_date).getFullYear()} &#183;{" "}
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m &#183;{" "}
              </span>
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
            <div className="text-md mb-2 flex items-center gap-2">
              <StarIcon className="w-6 text-yellow-400" />
              <span className="text-white">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="w-full md:block">
              <TextBlock title="Director" paragraph={director} />
              <TextBlock title="Cast" paragraph={cast} />
            </div>
          </div>
          <button
            className=" bg-red-500 p-2 rounded-full size-10 hover:bg-red-700"
            onClick={() => handleRemove(movie.id)}
          >
            <TrashIcon className="w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TextBlock({ title, paragraph }: { title: string; paragraph: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-md mb-1 font-bold text-white ">{title}</h2>
      <p className="text-sm text-slate-300">{paragraph}</p>
    </div>
  );
}
