import axios, { AxiosResponse } from "axios";
import { Movie } from "../types/types";

type DiscoverParams = {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  primary_release_year?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "vote_average.gte"?: number;
};

const movieService = axios.create({
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    language: "en-AU",
    sort_by: "revenue.desc",
    append_to_response: "credits",
    "vote_count.gte": 1000,
    include_adult: false,
  },
});

export type MovieData = {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
};

export async function getMovies(
  url: string,
  params?: DiscoverParams
): Promise<MovieData> {
  console.log("fetching movies");
  console.log(params);

  const queryString = new URLSearchParams({
    ...movieService.defaults.params,
    ...params,
  }).toString();
  console.log(`Full query string: ${queryString}`);
  try {
    const response: AxiosResponse<MovieData> = await movieService.get(url, {
      params,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return {
      page: 0,
      total_pages: 0,
      total_results: 0,
      results: [],
    };
  }
}

export const getMovie = async (movieId: number) => {
  try {
    const response: AxiosResponse<Movie> = await movieService.get(
      `movie/${movieId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Fetch movies by search query (navbar)
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response: AxiosResponse<{ results: Movie[] }> =
      await movieService.get(`/search/movie?query=${query}`);

    return response.data.results || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
