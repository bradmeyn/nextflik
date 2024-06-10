import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import Banner from "../lib/components/Banner";
import { getMovies } from "../lib/services/movies";
import Carousel from "../lib/components/Carousel";

async function getData() {
  const popularMoviesData = await getMovies("trending/movie/week", { page: 1 });
  const topRatedMoviesData = await getMovies("movie/top_rated", { page: 1 });
  const randomYear = Math.floor(Math.random() * 40) + 1970;
  const years = [
    randomYear - 10,
    randomYear - 5,
    randomYear,
    randomYear + 5,
    randomYear + 10,
  ];
  const randomYearMovies = await Promise.all(
    years.map((year) =>
      getMovies("discover/movie", { primary_release_year: year })
    )
  );
  const carouselData = [
    {
      title: "Popular Now",
      url: "trending/movie/week",
      data: popularMoviesData,
    },
    {
      title: "All Time Classics",
      url: "movie/top_rated",
      data: topRatedMoviesData,
    },
    ...randomYearMovies.map((data, i) => ({
      title: `Best of ${years[i]}`,
      url: `discover/movie&primary_release_year=${years[i]}`,
      data,
      year: years[i],
    })),
  ];

  return carouselData;
}

export const Route = createFileRoute("/")({
  component: Index,
  loader: () => getData(),
});

function Index() {
  const carouselData = useLoaderData({ from: "/" });

  return (
    <div className="container">
      <Banner movies={carouselData[0]?.data?.results ?? []} />

      {carouselData.map((collection) => (
        <Carousel key={collection.title} carouselData={collection} />
      ))}
    </div>
  );
}
