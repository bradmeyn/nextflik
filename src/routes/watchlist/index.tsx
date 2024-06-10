import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/watchlist/")({
  component: () => <ListsPage />,
});

export default function ListsPage() {
  return (
    <div className="container mx-auto max-w-[800px] py-10 px-4">
      <h1 className="mb-4 text-2xl font-bold md:mb-8 md:text-4xl">My Lists</h1>
      {/* <Lists lists={lists} /> */}
    </div>
  );
}
