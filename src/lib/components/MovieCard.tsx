import { XMarkIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogPanel } from "@headlessui/react";
import { StarIcon, BookmarkIcon } from "@heroicons/react/24/solid";
import { getMovie } from "../services/movies";
import { useState } from "react";
import { type Movie } from "../types/types";

export default function MovieCardDialog({
  id,
  title,
  poster,
  isList = false,
  rating,
}: {
  id: number;
  title: string;
  poster: string;
  isList?: boolean;
  rating?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const src = `https://image.tmdb.org/t/p/w200${poster}`;

  async function handleOpen() {
    setIsOpen(true);
    setIsLoading(true);
    const response = await getMovie(id);
    setIsLoading(false);
    const movie = response?.data;
    if (movie) {
      setMovie(movie);
    }
  }

  return (
    <>
      <button onClick={handleOpen} className="flex gap-4">
        <button
          className={
            "card-shadow relative rounded min-w-[80px]  w-[80px] md:w-[100px] lg:w-[160px] hover:cursor-pointer hover:outline hover:outline-white "
          }
        >
          <img className="h-auto rounded" src={src} alt={title} />
        </button>
        {isList ? (
          <div
            className="bg-slate-900 inline p-4 flex-1 text-left"
            onClick={handleOpen}
          >
            <h1 className="text-xl md:text-2xl text-white mb-4 font-bold">
              {title}
            </h1>
            {rating ? (
              <div className="flex items-center gap-2">
                <StarIcon className="w-8 text-yellow-400" />
                <span className="text-white text-xl">{rating.toFixed(1)}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 bg-gray-900 bg-opacity-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="text-white bg-slate-900 relative m-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-red p-2 hover:bg-slate-600 rounded absolute top-2 right-2 "
            >
              <XMarkIcon className="w-6" />
            </button>
            <div>
              {isLoading ? (
                <Skeleton title={title} poster={src} />
              ) : movie ? (
                <MovieDialogBody movie={movie} poster={src} />
              ) : null}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

function MovieDialogBody({ movie }: { movie: Movie; poster: string }) {
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
      className="bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(16, 23, 42, 0.8), rgba(16, 23, 42, 0.8)), url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`,
      }}
    >
      <div className="container mx-auto flex flex-col gap-4 p-4 md:max-w-[1000px]">
        <div className="flex gap-4 md:gap-8">
          <div className="">
            <img
              className="rounded w-[150px] md:w-[200px] lg:w-[300px] xl:w-[400px]"
              src={moviePoster}
              alt={movie.title + " poster"}
            />
          </div>

          <div>
            <h1 className="mb-2 text-xl font-bold text-white md:text-3xl max-w-[1000px]">
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

            <p className="text-md mb-3 italic text-slate-300 md:text-lg">
              {movie.tagline}
            </p>

            <WatchlistButton id={movie.id} />

            <div className="hidden w-full md:block">
              <TextBlock title="Overview" paragraph={movie.overview} />
              <TextBlock title="Director" paragraph={director} />
              <TextBlock title="Cast" paragraph={cast} />
            </div>
          </div>
        </div>

        <div className="w-full md:hidden">
          <TextBlock title="Overview" paragraph={movie.overview} />
          <div className="flex flex-wrap">
            <TextBlock title="Director" paragraph={director} />
            <TextBlock title="Cast" paragraph={cast} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextBlock({ title, paragraph }: { title: string; paragraph: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-md mb-1 font-bold text-white md:text-lg">{title}</h2>
      <p className="text-sm text-slate-300">{paragraph}</p>
    </div>
  );
}

function Skeleton({ title, poster }: { title: string; poster: string }) {
  return (
    <div className="flex md:flex-row gap-4 md:gap-8 p-8">
      <div className="">
        <img
          className="w-full rounded bg-gray-300"
          src={poster}
          alt={title + " poster"}
        />
      </div>
      <div>
        <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl ">
          {title}
        </h1>

        <div className="mb-4">
          <div className="animate-pulse w-1/2 bg-slate-400 h-5 mb-2 rounded"></div>
          <div className="animate-pulse w-full mb-2 bg-slate-400 h-5 rounded"></div>
          <div className="animate-pulse w-full mb-2 bg-slate-400 h-5 rounded"></div>
        </div>

        <div>
          <div className="animate-pulse w-1/2 bg-slate-400 h-5 mb-2 rounded"></div>
          <div className="animate-pulse w-full mb-2 bg-slate-400 h-5 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function WatchlistButton({ id }: { id: number }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 my-2 rounded-full text-slate-200 md:border border-slate-400 hover:border-blue-500 hover:text-white  md:max-w-md md:flex-1  lg:max-w-xl ">
      <BookmarkIcon className="w-5" />
      <span className="hidden md:static md:inline">Add to Watchlist</span>
    </button>
  );
}
