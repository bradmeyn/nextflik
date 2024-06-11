import { SetStateAction, useState, type Dispatch } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  MOVIE_GENRES,
  DECADES,
  FilterOption,
  defaultMovieFilters,
  type MovieFilters,
} from "../../../lib/constants/movieFilters";

export function FilterDialog({
  filters,
  setFilters,
}: {
  filters: MovieFilters;
  setFilters: Dispatch<SetStateAction<MovieFilters>>;
}) {
  const [tempFilters, setTempFilters] = useState(filters);
  const [isOpen, setIsOpen] = useState(false);
  const [filtersUpdated, setFiltersUpdated] = useState(false);

  function resetFilters() {
    setTempFilters(defaultMovieFilters);
    setFiltersUpdated(true);
  }

  function applyFilters() {
    setFilters(tempFilters);
    setIsOpen(false);
    setFiltersUpdated(false);
  }

  function handleClose() {
    setTempFilters(filters);
    setIsOpen(false);
    setFiltersUpdated(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex gap-2 mb-4 items-center p-1 px-4 rounded-full  border border-slate-500 text-white hover:border-blue-500"
      >
        <AdjustmentsHorizontalIcon className="w-6 text-white" />{" "}
        <span>Filters</span>
      </button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50 bg-gray-900 bg-opacity-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed top-10 flex w-full max-w-[600px]  items-center justify-center left-1/2 -translate-x-1/2 rounded-xl">
          <DialogPanel className=" space-y-4 text-white bg-slate-900 p-6 relative ">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-bold text-2xl">
                Movie filters
              </DialogTitle>

              <button
                onClick={handleClose}
                className="text-red p-2 hover:bg-slate-600 rounded absolute right-4 top-4"
              >
                <XMarkIcon className="w-6" />
              </button>
            </div>
            <div className="space-y-8">
              <GenreFilters
                selectedFilters={tempFilters.genres}
                setFilters={(filters) => {
                  setTempFilters({ ...tempFilters, genres: filters });
                  setFiltersUpdated(true);
                }}
                filterOptions={MOVIE_GENRES}
              />
              <RatingFilter
                rating={tempFilters.userRating}
                setRating={(rating) => {
                  setTempFilters({ ...tempFilters, userRating: rating });
                  setFiltersUpdated(true);
                }}
              />

              <ReleaseYearFilter
                releaseYear={tempFilters.releaseYear}
                setReleaseYear={(value: { min: number; max: number }) => {
                  setTempFilters({ ...tempFilters, releaseYear: value });
                  setFiltersUpdated(true);
                }}
              />
            </div>
            <div className="flex gap-2 pt-6">
              <button
                disabled={!filtersUpdated}
                className="py-2 px-4 bg-blue-500 rounded-full min-w-[120px] disabled:cursor-not-allowed disabled:bg-blue-500/30 disabled:text-white/30 "
                onClick={applyFilters}
              >
                Apply
              </button>
              <button
                className="py-2 px-4  rounded-full min-w-[120px] hover:text-blue-500 "
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

type GenreFiltersProps = {
  selectedFilters: string[];
  setFilters: (filters: string[]) => void;
  filterOptions: FilterOption[];
};

export function GenreFilters({
  selectedFilters,
  setFilters,
  filterOptions,
}: GenreFiltersProps) {
  function handleChange(value: string) {
    if (selectedFilters.includes(value)) {
      setFilters(selectedFilters.filter((f) => f !== value));
    } else {
      setFilters([...selectedFilters, value]);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Genres</h2>
        <button className="text-sm text-gray-500">Clear</button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {filterOptions.map((f) => (
          <div key={f.label} className="flex items-center gap-1">
            <button
              id={"genre-" + f.value}
              className={`cursor-pointer text-sm rounded-full border py-1 px-2 ${selectedFilters.includes(f.value) ? " border-blue-500 text-blue-500" : " text-slate-50 border-slate-500 hover:border-blue-500"}`}
              onClick={() => handleChange(f.value)}
              aria-pressed={selectedFilters.includes(f.value)}
            >
              {f.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

type RatingFilterProps = {
  rating: number;
  setRating: (rating: number) => void;
};

export function RatingFilter({ rating, setRating }: RatingFilterProps) {
  function handleClick(value: number) {
    if (rating === value) {
      setRating(0);
    } else {
      setRating(value);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">User Rating</h2>
      <div className="flex w-full">
        {[...Array(10).keys()].map((i) => (
          <button
            key={i + 1}
            className={`px-2 py-1 border text-sm flex-1 ${rating >= i + 1 ? "border-blue-500 text-blue-500" : "border-slate-500"} ${i + 1 === 1 ? "rounded-l-full" : ""} ${i + 1 === 10 ? "rounded-r-full" : ""}`}
            onClick={() => handleClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

type ReleaseFilterProps = {
  releaseYear: { min: number; max: number };
  setReleaseYear: (value: { min: number; max: number }) => void;
};

export function ReleaseYearFilter({
  releaseYear,
  setReleaseYear,
}: ReleaseFilterProps) {
  function handleChange(value: { min: number; max: number }) {
    if (releaseYear.min === value.min && releaseYear.max === value.max) {
      setReleaseYear({ min: 1950, max: new Date().getFullYear() });
    } else {
      setReleaseYear(value);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Release Year</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {DECADES.map((d) => (
          <button
            key={d.label}
            id={"decade-" + d.label}
            className={`cursor-pointer text-sm rounded-full border py-1 px-2 ${releaseYear.min === d.value.min && releaseYear.max === d.value.max ? " border-blue-500 text-blue-500" : " text-slate-50 border-slate-500 hover:border-blue-500"}`}
            onClick={() => handleChange(d.value)}
            aria-pressed={
              releaseYear.min === d.value.min && releaseYear.max === d.value.max
            }
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className=" grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="minYear"
            className="block text-sm font-semibold text-slate-300 mb-1"
          >
            Min Year
          </label>
          <input
            type="number"
            id="minYear"
            min={1950}
            max={new Date().getFullYear()}
            value={releaseYear.min}
            className="w-full p-2 rounded-lg  text-lg border border-slate-500 bg-gray-800 bg-transparent"
            onChange={(e) =>
              setReleaseYear({ ...releaseYear, min: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label
            htmlFor="maxYear"
            className="block text-sm font-semibold text-slate-300 mb-1"
          >
            Max Year
          </label>
          <input
            type="number"
            id="maxYear"
            min={1950}
            max={new Date().getFullYear()}
            value={releaseYear.max}
            className="w-full p-2 rounded-lg text-lg  border border-slate-500 bg-transparent bg-gray-800"
            onChange={(e) =>
              setReleaseYear({ ...releaseYear, max: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
}
