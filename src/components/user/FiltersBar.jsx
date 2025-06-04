"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, X } from "lucide-react";
import { FaStar } from "react-icons/fa";

export default function FiltersBar({
  pricesList,
  ratingList,
  sortList,
  resultsList,
  selectedFilters,
  setSelectedFilters,
  onSortChange,
  onResultsChange,
  onRatingChange,
  onPriceChange,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    sort: false,
    results: false,
    price: false,
    rating: false,
  });

  const [selectedSort, setSelectedSort] = useState(sortList[1]);
  const [selectedResults, setSelectedResults] = useState(resultsList[1]);

  useEffect(() => {
    onSortChange && onSortChange(selectedSort);
    onResultsChange && onResultsChange(selectedResults);
  }, []);

  function handleFiltersChange(filterKey, selectedItem) {
    setSelectedFilters((prev) => {
      const updatedFilter = prev[filterKey].filter(
        (item) => item.id !== selectedItem.id
      );

      return { ...prev, [filterKey]: updatedFilter };
    });
  }

  function handleSortSelect(option) {
    const sortOption = sortList.find((item) => item.id === option);
    if (sortOption) {
      setSelectedSort(sortOption);
      onSortChange && onSortChange(sortOption);
    }
  }

  function handleResultsSelect(option) {
    const resultsOption = resultsList.find((item) => item.id === option);
    if (resultsOption) {
      setSelectedResults(resultsOption);
      onResultsChange && onResultsChange(resultsOption);
    }
  }

  function handleRatingSelect(option) {
    const ratingOption = ratingList.find((item) => item.id === option);
    if (ratingOption) {
      if (selectedFilters.rating?.id === ratingOption.id) {
        onRatingChange && onRatingChange(null);
      } else {
        onRatingChange && onRatingChange(ratingOption);
      }
    }
  }

  function handlePriceToggle(price) {
    onPriceChange && onPriceChange(price);
  }

  return (
    <div className="w-full min-h-10 hidden md:flex flex-col items-stretch gap-2 text-sm font-medium py-1 transition-colors">
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
                  const isSelected = selectedFilters.prices?.some(
                    (item) => item.id === price.id
                  );
                  return (
                    <div
                      key={price.id}
                      onClick={() => handlePriceToggle(price)}
                      className={`${
                        isSelected
                          ? "text-emerald-600 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-300 dark:bg-emerald-900 dark:hover:bg-emerald-800"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      } relative flex items-center py-1 pl-6 cursor-pointer hover:outline-none`}
                    >
                      {isSelected && (
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
                  value={selectedFilters.rating?.id || null}
                  onValueChange={handleRatingSelect}
                >
                  {ratingList.map((item) => {
                    const isSelected = selectedFilters.rating?.id === item.id;
                    return (
                      <DropdownMenuRadioItem
                        key={item.id}
                        value={item.id}
                        customIcon={
                          <FaStar size={10} className="text-transparent" />
                        }
                        className={`${
                          isSelected &&
                          "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800"
                        } pl-5 cursor-pointer group`}
                      >
                        <FaStar
                          size={10}
                          className={`${
                            isSelected
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
                  onValueChange={handleSortSelect}
                >
                  {sortList.map((item) => (
                    <DropdownMenuRadioItem
                      key={item.id}
                      value={item.id}
                      className="capitalize"
                    >
                      {item.name}
                    </DropdownMenuRadioItem>
                  ))}
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
                  onValueChange={handleResultsSelect}
                >
                  {resultsList.map((item) => (
                    <DropdownMenuRadioItem key={item.id} value={item.id}>
                      {item.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-wrap justify-start items-center gap-2">
        {selectedFilters.categories.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onClick={() => handleFiltersChange("categories", item)}
            className="px-3 py-1.5 rounded-full text-sm bg-sky-100 text-sky-700 flex items-center gap-1 cursor-pointer hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-800/50"
          >
            {item.name}
            <svg
              className="w-3 h-3 text-sm"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        ))}
        {selectedFilters.colors.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onClick={() => handleFiltersChange("colors", item)}
            className="px-3 py-1.5 rounded-full text-sm bg-orange-100 text-orange-700 flex items-center gap-1 cursor-pointer hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-800/50"
          >
            {item.name}
            <svg
              className="w-3 h-3 text-sm"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        ))}
        {selectedFilters.sizes.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onClick={() => handleFiltersChange("sizes", item)}
            className="px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-700 flex items-center gap-1 cursor-pointer hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-800/50"
          >
            {item.name}
            <svg
              className="w-3 h-3 text-sm"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        ))}
        {selectedFilters.prices.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onClick={() => onPriceChange(item)}
            className="px-3 py-1.5 rounded-full text-sm bg-indigo-100 text-indigo-700 flex items-center gap-1 cursor-pointer hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
          >
            ${item.name}+
            <svg
              className="w-3 h-3 text-sm"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        ))}
        {selectedFilters.rating && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            onClick={() => onRatingChange(null)}
            className="px-3 py-1.5 rounded-full text-sm bg-amber-100 text-amber-700 flex items-center gap-1 cursor-pointer hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-800/50"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={`text-amber-400 ${
                  i < selectedFilters.rating.name ? "opacity-100" : "opacity-30"
                }`}
              />
            ))}
            <svg
              className="w-3 h-3 text-sm"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
