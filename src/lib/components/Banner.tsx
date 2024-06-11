import { Movie } from "../types/types";

import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

type Props = {
  movies: Movie[];
};

export default function Banner({ movies }: Props) {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const moveLeft = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setFeaturedIndex((prev) => prev + -1);
  };

  const moveRight = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setFeaturedIndex((prev) => {
      if (prev === movies.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredIndex !== movies.length - 1) {
        moveRight();
      } else {
        setFeaturedIndex(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredIndex, movies.length]);

  return (
    <>
      <div className=" text-white">
        <div className="custom-shadow  mx-auto mb-3 flex h-[180px] md:h-[300px] lg:h-[320px] w-full overflow-clip rounded relative">
          {movies.map((movie, i) => (
            <div
              key={movie.id}
              className={`min-w-full rounded bg-cover bg-no-repeat text-left transition-transform duration-500 ease-in-out hover:cursor-pointer p-4`}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                transform: `translateX(-${featuredIndex * 100}%)`,
              }}
            >
              <div className="flex h-full items-center justify-between">
                {featuredIndex !== 0 ? (
                  <SliderButton
                    onClick={moveLeft}
                    icon={
                      <ChevronLeftIcon className="w-8 text-lg md:text-4xl" />
                    }
                  />
                ) : null}

                <div className="flex w-full ">
                  <img
                    className=" w-[100px] rounded  md:w-[150px]  lg:w-[160px] xl:ml-6"
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title ?? ""}
                  />

                  <div
                    className={`transition-[opacity,transform] duration-1000 ease-in-out xl:ml-5 ${
                      featuredIndex === i
                        ? "translate-x-8 opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <h1
                      className={`mb-4 max-w-sm pt-1 text-2xl font-bold text-white sm:text-3xl md:pt-4 md:text-4xl lg:text-5xl `}
                    >
                      {movie.title}
                    </h1>

                    <div className="text-md flex items-center md:text-2xl ">
                      <StarIcon className="mr-2 w-5 text-yellow-400" />
                      <span className="text-slate-100">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {featuredIndex !== movies.length - 1 ? (
                  <SliderButton
                    onClick={moveRight}
                    icon={
                      <ChevronRightIcon className="w-8 text-lg md:text-4xl" />
                    }
                  />
                ) : null}
              </div>
            </div>
          ))}
          <FeaturedButtons
            movies={movies}
            featuredIndex={featuredIndex}
            setFeaturedIndex={setFeaturedIndex}
          />
        </div>
      </div>
    </>
  );
}

type FeaturedButtonsProps = {
  movies: Movie[];
  featuredIndex: number;
  setFeaturedIndex: (index: number) => void;
};

function FeaturedButtons({
  movies,
  featuredIndex,
  setFeaturedIndex,
}: FeaturedButtonsProps) {
  return (
    <ul className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 transform md:flex">
      {movies.map((movie, i) => (
        <li key={movie.id}>
          <button
            disabled={featuredIndex === i}
            onClick={(e) => {
              e.preventDefault();
              setFeaturedIndex(i);
            }}
            className={`mx-2 rounded-full  p-[5px] hover:bg-slate-100 ${
              featuredIndex === i ? "bg-slate-100" : "bg-slate-500"
            }`}
          ></button>
        </li>
      ))}
    </ul>
  );
}

type SliderButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: JSX.Element;
};

function SliderButton({ onClick, icon }: SliderButtonProps) {
  return (
    <button
      onClick={onClick}
      className="z-10 h-full hidden md:block p-2 text-slate-400 hover:text-white md:p-2"
    >
      {icon}
    </button>
  );
}
