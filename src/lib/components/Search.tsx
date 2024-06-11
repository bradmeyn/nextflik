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

import MovieCardDialog from "./MovieCard";

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
        <div className="fixed top-0 left-0 z-50  h-full w-full bg-slate-900/30 flex justify-center  backdrop-blur-md  ">
          <div
            ref={searchContainer}
            className="mx-4 mt-20  md:min-w-[700px] rounded-xl overflow-hidden"
          >
            <div
              className="relative flex flex-1 items-center rounded-full"
              onClick={focusInput}
            >
              <input
                autoFocus
                ref={searchInput}
                placeholder="Search movies"
                className={`mx-auto w-full border border-blue-500 bg-slate-800 py-3 pl-12 text-base text-white outline-0 md:text-xl rounded-full mb-2`}
                onChange={handleChange}
              />
              <MagnifyingGlassIcon className="absolute ml-4 w-4 text-lg md:text-xl text-white mb-2" />
              <span
                className="absolute right-4 z-50 cursor-pointer text-xl text-white"
                onClick={closeSearch}
              ></span>
            </div>

            {movies?.length > 0 ? <ResultsDropdown movies={movies} /> : null}
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
      className="relative  ml-auto items-center gap-2 p-2 rounded-full text-slate-200 md:border border-slate-400 hover:border-blue-500 hover:text-white md:mx-8 md:ml-4 md:flex md:max-w-md md:flex-1  lg:max-w-xl "
      onClick={activateSearch}
    >
      <MagnifyingGlassIcon className=" w-5" />
      <span className="hidden md:static md:inline">Search movies</span>
    </button>
  );
}

function ResultsDropdown({ movies }: { movies: Movie[] }) {
  return (
    <ul
      className={
        "block max-h-[400px] w-full overflow-y-scroll rounded-xl bg-slate-900 space-y-4 p-4"
      }
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      {movies.map((movie) => (
        <MovieItem key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}

function MovieItem({ movie }: { movie: Movie }) {
  return (
    <li className="w-full ">
      <MovieCardDialog
        id={movie.id}
        title={movie.title}
        poster={movie.poster_path}
        isList
        rating={movie.vote_average}
      />
    </li>
  );
}
