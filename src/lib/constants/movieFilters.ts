export type MovieFilters = {
  genres: string[];
  userRating: number;
  releaseYear: {
    min: number;
    max: number;
  };
};

export type FilterOption = {
  value: string;
  label: string;
};

export const MOVIE_GENRES: FilterOption[] = [
  { value: "28", label: "Action" },
  { value: "12", label: "Adventure" },
  { value: "16", label: "Animation" },
  { value: "35", label: "Comedy" },
  { value: "80", label: "Crime" },
  { value: "18", label: "Drama" },
  { value: "14", label: "Fantasy" },
  { value: "27", label: "Horror" },
  { value: "10749", label: "Romance" },
  { value: "878", label: "Sci-Fi" },
  { value: "53", label: "Thriller" },
];

export const DECADES = [
  {
    value: {
      min: 1960,
      max: 1929,
    },
    label: "60s",
  },
  {
    value: {
      min: 1970,
      max: 1979,
    },
    label: "70s",
  },
  {
    value: {
      min: 1980,
      max: 1989,
    },
    label: "80s",
  },
  {
    value: {
      min: 1990,
      max: 1999,
    },
    label: "90s",
  },
  {
    value: {
      min: 2000,
      max: 2009,
    },
    label: "00s",
  },
  {
    value: {
      min: 2010,
      max: 2019,
    },
    label: "10s",
  },
  {
    value: {
      min: 2020,
      max: 2024,
    },
    label: "20s",
  },
];

export const defaultMovieFilters: MovieFilters = {
  genres: [],
  userRating: 0,
  releaseYear: {
    min: 0,
    max: 0,
  },
};
