import { getMovie } from "./movies";
import { Movie } from "../types/types";

export function getMovieIds(): number[] {
  const movieIds = localStorage.getItem("movieIds");
  console.log("movie ids", movieIds);
  return movieIds ? JSON.parse(movieIds) : [];
}

export function addMovieId(id: number): void {
  const movieIds = getMovieIds();
  console.log("add ");
  movieIds.push(id);
  localStorage.setItem("movieIds", JSON.stringify(movieIds));
}

export function removeMovieId(id: number): void {
  let movieIds = getMovieIds();
  movieIds = movieIds.filter((movieId) => movieId !== id);
  localStorage.setItem("movieIds", JSON.stringify(movieIds));
}

export async function populateWatchlist(): Promise<Movie[]> {
  const movieIds = getMovieIds();
  const movies = await Promise.all(movieIds.map((id) => getMovie(id)));
  return movies as Movie[];
}
