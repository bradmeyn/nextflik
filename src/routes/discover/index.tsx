import { useEffect, useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import useDebounce from "../../lib/hooks/useDebounce";
import { getMovies } from "../../lib/services/movies";
import { FilterDialog } from "./-components/Filters";
import Spinner from "../../lib/components/Spinner";
import {
  type MovieFilters,
  defaultMovieFilters,
} from "../../lib/constants/movieFilters";
import { Movie } from "../../lib/types/types";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import MovieCardDialog from "../../lib/components/MovieCard";

export const Route = createFileRoute("/discover/")({
  component: () => <DiscoverPage />,
  loader: () => getMovies("movie/popular", { page: 1 }),
});

export default function DiscoverPage() {
  const popularMoviesData = useLoaderData({
    from: "/discover/",
  });
  const [movies, setMovies] = useState<Movie[]>(
    popularMoviesData?.results ?? []
  );
  const [filters, setFilters] = useState<MovieFilters>(defaultMovieFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter changes => fetch new data
  const debouncedFilters: MovieFilters = useDebounce(filters, 500); // Debounce filter changes

  useEffect(() => {
    console.log("fetching movies");

    const params = {
      page: 1,
      with_genres: debouncedFilters.genres.join(","),
      "primary_release_date.gte": debouncedFilters.releaseYear.min
        ? `${debouncedFilters.releaseYear.min}-01-01`
        : undefined,
      "primary_release_date.lte": debouncedFilters.releaseYear.max
        ? `${debouncedFilters.releaseYear.max}-12-31`
        : undefined,
      "vote_average.gte": debouncedFilters.userRating,
    };

    async function fetchMovies() {
      setIsLoading(true);

      // Fetch first page
      let data = await getMovies("discover/movie", params);
      let allMovies = data.results;

      // Update params to fetch second page
      params.page = 2;
      data = await getMovies("discover/movie", params);
      allMovies = [...allMovies, ...data.results]; // Combine results from both pages

      setMovies(allMovies);
      setPage(data.page);
      setIsLoading(false);
    }

    fetchMovies();
  }, [debouncedFilters]);

  return (
    <div className="container py-10 ">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <FilterDialog filters={filters} setFilters={setFilters} />
          {movies?.length > 0 ? (
            <>
              <div className="relative mb-10 flex justify-center flex-wrap gap-4 ">
                {movies.map((movie, i) => (
                  <MovieCardDialog
                    key={i}
                    id={movie.id}
                    title={movie.title}
                    poster={movie.poster_path}
                  />
                ))}
              </div>
              {isLoadingMore ? (
                <Spinner />
              ) : (
                <button
                  className="py-2 px-4 mx-auto border rounded-full border-slate-500 hover:border-blue-500  text-white font-semibold flex items-center justify-center gap-1 text-lg"
                  onClick={() => {
                    setIsLoadingMore(true);
                    getMovies("discover/movie", {
                      page: page + 1,
                      with_genres: filters.genres.join(","),
                      "primary_release_date.gte": filters.releaseYear.min
                        ? `${filters.releaseYear.min}-01-01`
                        : undefined,
                      "primary_release_date.lte": filters.releaseYear.max
                        ? `${filters.releaseYear.max}-12-31`
                        : undefined,
                      "vote_average.gte": filters.userRating,
                    }).then((data) => {
                      setMovies([...movies, ...data.results]);
                      setPage(data.page);
                      setIsLoadingMore(false);
                    });
                  }}
                >
                  <span>Load more</span>
                  <ArrowDownIcon className="w-5 inline ml-2" />
                </button>
              )}
            </>
          ) : (
            <p className="text-xl text-slate-300 text-center mt-10">
              No movies found. Try some other filters
            </p>
          )}
        </>
      )}
    </div>
  );
}
