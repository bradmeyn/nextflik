import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { type Movie } from "../types/types";
import { searchMovies } from "../services/movies";
import useOutsideClick from "../hooks/useOutsideClick";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { StarIcon } from "@heroicons/react/24/solid";

export default function Search() {
  const [modalActive, setModalActive] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchContainer = useRef(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const getMovies = useCallback(async () => {
    if (searchQuery.trim().length > 0) {
      const data = await searchMovies(searchQuery);
      setMovies(data);
    } else {
      setMovies([]);
    }
  }, [searchQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value.trim());
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      getMovies();
    } else {
      setMovies([]);
    }
  }, [searchQuery, getMovies]);

  useOutsideClick(searchContainer, () => {
    if (modalActive) {
      closeSearch();
    }
  });

  const focusInput = () => {
    searchInput.current?.focus();
  };

  const closeSearch = () => {
    setModalActive(false);
  };

  const activateSearch = (e: MouseEvent) => {
    e.stopPropagation();
    setModalActive(true);
  };

  return (
    <>
      {modalActive ? (
        <div className="fixed top-0 left-0 z-50  h-full w-full bg-slate-900/30  backdrop-blur-md  ">
          <div
            ref={searchContainer}
            className=" mx-10 mt-20 md:mx-auto md:max-w-3xl "
          >
            <div
              className="relative flex flex-1 items-center rounded"
              onClick={focusInput}
            >
              <input
                autoFocus
                ref={searchInput}
                placeholder="Search movies"
                className={`mx-auto w-full border border-blue-500 bg-slate-800 py-3 pl-12 text-lg text-white outline-0 md:text-xl ${
                  movies.length > 0 ? "rounded-t-full" : "rounded-full"
                }`}
                onChange={handleChange}
              />
              <MagnifyingGlassIcon className="absolute ml-4 w-5 text-lg md:text-xl text-white" />
              <span
                className="absolute right-4 z-50 cursor-pointer text-xl text-white"
                onClick={closeSearch}
              ></span>
            </div>
            <div className="m-4 rounded bg-slate-900 md:max-h-[600px]">
              {movies?.length > 0 ? <ResultsDropdown movies={movies} /> : null}
            </div>
          </div>
        </div>
      ) : (
        <SearchButton activateSearch={activateSearch} />
      )}
    </>
  );
}

function SearchButton({
  activateSearch,
}: {
  activateSearch: (e: MouseEvent) => void;
}) {
  return (
    <button
      className="relative  ml-auto items-center gap-2 p-2 px-4 text-slate-200 md:border border-slate-400 hover:border-blue-500 rounded-full hover:text-white md:mx-8 md:ml-4 md:flex md:max-w-md md:flex-1  lg:max-w-xl "
      onClick={activateSearch}
    >
      <MagnifyingGlassIcon className=" w-5" />
      <span className="hidden md:static md:inline">Search movies</span>
    </button>
  );
}

function ResultsDropdown({ movies }: { movies: Movie[] }) {
  return (
    <ul className={"block max-h-[300px]  w-full overflow-y-scroll"}>
      {movies.map((movie) => (
        <MovieItem key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}

function MovieItem({ movie }: { movie: Movie }) {
  const moviePoster = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
  return (
    <li className="flex items-center gap-8 rounded border border-transparent bg-slate-800 p-3 hover:border-white">
      <div className="flex gap-8 ">
        <div className="w-20">
          <img
            className="rounded"
            src={moviePoster}
            alt={movie.title + " poster" ?? ""}
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white">{movie.title}</h3>

          <p className=" mb-2 text-sm text-slate-300">
            <span>
              {new Date(movie.release_date).getFullYear()} &#183;{" "}
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m &#183;{" "}
            </span>
          </p>

          <div className="text-md mb-2 flex items-center gap-2">
            <StarIcon className="w-4 text-yellow-400" />
            <span className="text-white">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
