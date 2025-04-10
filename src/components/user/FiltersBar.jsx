"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { FaStar } from "react-icons/fa";

export default function FiltersBar({
  pricesList,
  ratingList,
  sortList,
  resultsList,
  selectedFilters,
  setSelectedFilters,
}) {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedRating, setSelectedRating] = useState({
    id: 1,
    name: 1,
  });
  const [selectedSort, setSelectedSort] = useState({
    id: 1,
    name: "most popular",
  });
  const [selectedResults, setSelectedResults] = useState({
    id: 2,
    name: 48,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState({
    sort: false,
    results: false,
    price: false,
    rating: false,
  });

  function handleFiltersChange(filterKey, selectedItem) {
    setSelectedFilters((prev) => {
      const updatedFilter = prev[filterKey].filter(
        (item) => item.id !== selectedItem.id
      );

      return { ...prev, [filterKey]: updatedFilter };
    });
  }

  function handlePriceChange(price) {
    const isPriceSelected = selectedPrices.find((item) => item.id === price.id);
    if (isPriceSelected) {
      setSelectedPrices((prv) => [
        ...prv.filter((item) => item.id !== price.id),
      ]);
    } else {
      setSelectedPrices((prv) => [...prv, price]);
    }
  }

  return (
    <div className="w-full min-h-10 flex flex-col items-stretch gap-2 text-sm font-medium py-1 transition-colors">
      <div className="w-full h-16 flex justify-between items-center">
        <div className="h-full flex items-center gap-3">
          <div className="h-full flex flex-col justify-between">
            <div className="text-slate-600 transition-colors dark:text-slate-400">
              Filters
            </div>
            <DropdownMenu
              onOpenChange={(open) =>
                setIsDropdownOpen((prv) => ({ ...prv, price: open }))
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-1 px-3 transition-colors dark:text-white"
                >
                  <span className="text-slate-800 font-medium capitalize transition-colors dark:text-slate-300">
                    Price
                  </span>
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      isDropdownOpen.price ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {pricesList.map((price) => {
                  const newPrice = selectedPrices.find(
                    (item) => item.id === price.id
                  );
                  return (
                    <div
                      key={price.id}
                      checked={newPrice}
                      onClick={() => {
                        handlePriceChange(price);
                      }}
                      className={`${
                        newPrice
                          ? "text-emerald-600 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-300 dark:bg-emerald-900 dark:hover:bg-emerald-800"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      } relative flex items-center py-1 pl-6 cursor-pointer hover:outline-none`}
                    >
                      {newPrice && (
                        <Check size={18} className="absolute left-1" />
                      )}
                      ${price.name}+
                    </div>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="h-full flex flex-col justify-between">
            <div className="text-slate-600"></div>
            <DropdownMenu
              onOpenChange={(open) =>
                setIsDropdownOpen((prv) => ({ ...prv, rating: open }))
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-1 px-3 transition-colors dark:text-white"
                >
                  <span className="text-slate-800 font-medium capitalize transition-colors dark:text-slate-300">
                    Rating
                  </span>
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      isDropdownOpen.rating ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selectedRating.id}
                  onValueChange={(e) => {
                    const newRating = ratingList.find((item) => item.id === e);
                    if (newRating) {
                      setSelectedRating(newRating);
                    }
                  }}
                >
                  {ratingList.map((item) => {
                    const newRating = selectedRating.id == item.id;
                    return (
                      <DropdownMenuRadioItem
                        key={item.id}
                        value={item.id}
                        customIcon={
                          <FaStar size={10} className="text-transparent" />
                        }
                        className={`${
                          newRating &&
                          "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800"
                        } pl-5 cursor-pointer group`}
                      >
                        <FaStar
                          size={10}
                          className={`${
                            newRating
                              ? "text-emerald-500 dark:group-hover:text-emerald-400"
                              : "text-slate-500 dark:group-hover:text-slate-400"
                          } absolute left-1.5 transition-colors`}
                        />
                        {item.name} stars
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="h-full flex items-center gap-3">
          <div className="h-full flex flex-col justify-between">
            <div className="text-slate-600 transition-colors dark:text-slate-400">
              Sort by
            </div>
            <DropdownMenu
              onOpenChange={(open) =>
                setIsDropdownOpen((prv) => ({ ...prv, sort: open }))
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-1 px-3 transition-colors dark:text-white"
                >
                  <span className="text-slate-800 font-medium capitalize transition-colors dark:text-slate-300">
                    {selectedSort.name}
                  </span>
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      isDropdownOpen.sort ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selectedSort.id}
                  onValueChange={(e) => {
                    const newSort = sortList.find((item) => item.id === e);
                    if (newSort) {
                      setSelectedSort(newSort);
                    }
                  }}
                >
                  {sortList.map((item) => {
                    const newSort = selectedSort.id == item.id;
                    return (
                      <DropdownMenuRadioItem
                        key={item.id}
                        value={item.id}
                        customIcon={
                          <Check size={18} className="text-transparent" />
                        }
                        className={`${
                          newSort &&
                          "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800"
                        } relative pl-6 cursor-pointer group`}
                      >
                        {newSort && (
                          <Check size={18} className="absolute left-1" />
                        )}
                        {item.name}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="h-full flex flex-col justify-between">
            <div className="text-slate-600 transition-colors dark:text-slate-400">
              Results
            </div>
            <DropdownMenu
              onOpenChange={(open) =>
                setIsDropdownOpen((prv) => ({ ...prv, results: open }))
              }
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex gap-1 px-3 transition-colors dark:text-white"
                >
                  <span className="text-slate-800 font-medium capitalize transition-colors dark:text-slate-300">
                    {selectedResults.name}
                  </span>
                  <ChevronDown
                    className={`ml-2 transition-transform ${
                      isDropdownOpen.results ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selectedResults.id}
                  onValueChange={(e) => {
                    const newResults = resultsList.find(
                      (item) => item.id === e
                    );
                    if (newResults) {
                      setSelectedResults(newResults);
                    }
                  }}
                >
                  {resultsList.map((item) => {
                    const newResult = selectedResults.id == item.id;
                    return (
                      <DropdownMenuRadioItem
                        key={item.id}
                        value={item.id}
                        customIcon={
                          <Check size={18} className="text-transparent" />
                        }
                        className={`${
                          newResult &&
                          "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800"
                        } relative pl-6 cursor-pointer group`}
                      >
                        {newResult && (
                          <Check size={18} className="absolute left-1" />
                        )}
                        {item.name}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 py-1">
        <div className="h-6 flex items-center flex-wrap gap-2">
          {Object.keys(selectedFilters).reduce((acc, filterKey) => {
            return (
              acc +
              (selectedFilters[filterKey]
                ? selectedFilters[filterKey].length
                : 0)
            );
          }, 0) > 0 && (
            <button
              className="bg-rose-100 flex items-center gap-1 text-rose-600 text-nowrap px-1.5 py-px rounded-lg transition-colors hover:bg-rose-200/80 hover:text-rose-700 dark:bg-rose-900 dark:text-rose-300 dark:hover:bg-rose-800/70 group"
              onClick={() =>
                setSelectedFilters((prev) =>
                  Object.keys(prev).reduce((acc, key) => {
                    acc[key] = [];
                    return acc;
                  }, {})
                )
              }
            >
              <span className="group-hover:underline">Clear all filters</span>
              <i className="fa-regular fa-xmark text-rose-600 text-nowrap transition-colors group-hover:text-rose-700 dark:text-rose-400 dark:group-hover:text-rose-400"></i>
            </button>
          )}
          {Object.keys(selectedFilters).map((filterKey) => {
            if (
              !Array.isArray(selectedFilters[filterKey]) ||
              selectedFilters[filterKey].length === 0
            )
              return null;

            return selectedFilters[filterKey].map((item) => (
              <motion.button
                layout
                key={`${filterKey}-${item.id}`}
                initial={{ opacity: 0, translateX: -10 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
                className="bg-blue-100 text-blue-800 flex items-center gap-1 capitalize px-1.5 py-px rounded-lg transition-colors hover:bg-blue-200/80 group dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800/60"
                onClick={() => handleFiltersChange(filterKey, item)}
              >
                <span className="group-hover:underline">{item.name}</span>
                <i className="fa-regular fa-xmark text-blue-500 transition-colors dark:text-blue-400"></i>
              </motion.button>
            ));
          })}
        </div>
      </div>
    </div>
  );
}
