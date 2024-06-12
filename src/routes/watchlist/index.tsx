import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { populateWatchlist, removeMovieId } from "../../lib/services/watchlist";
import { useState } from "react";
import ListItem from "./-components/ListItem";
import { Movie } from "../../lib/types/types";

export const Route = createFileRoute("/watchlist/")({
  component: () => <ListsPage />,
  loader: () => populateWatchlist(),
});

export default function ListsPage() {
  const watchlist = useLoaderData({
    from: "/watchlist/",
  });

  const [list, setList] = useState(watchlist || []);

  function handleRemove(id: number) {
    setList((prev) => prev.filter((movie) => movie.id !== id));
    removeMovieId(id);
  }

  return (
    <div className="container mx-auto max-w-[800px] py-10 px-4">
      <h1 className="mb-4 text-2xl font-bold md:mb-8 md:text-4xl text-white">
        Watchlist
      </h1>
      <ul className="space-y-4 max-h-[700px] overflow-y-auto">
        {list.map((movie: Movie) => (
          <ListItem key={movie.id} movie={movie} handleRemove={handleRemove} />
        ))}
      </ul>
    </div>
  );
}
