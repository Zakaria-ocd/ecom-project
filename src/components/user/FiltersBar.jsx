"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FiltersBar({
  sortList,
  selectedFilters,
  setSelectedFilters,
}) {
  const [selectedSort, setSelectedSort] = useState("most popular");

  function handleFilterChange(filterKey, selectedItem) {
    setSelectedFilters((prev) => {
      const updatedFilter = prev[filterKey].filter(
        (item) => item.id !== selectedItem.id
      );

      return { ...prev, [filterKey]: updatedFilter };
    });
  }

  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-2 text-slate-700 px-3 p-2 border-y transition-colors bg-slate-50 dark:bg-gray-900 dark:border-y-slate-700">
        <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold pr-2 py-0.5 border-r border-slate-300 pointer-events-none transition-colors dark:text-slate-300 dark:border-r-slate-600">
          <i className="fa-solid fa-sort"></i>
          Quick Sort
        </div>
        <div className="flex items-center gap-2">
          {sortList.map((item) => {
            return (
              <button
                key={item.id}
                className={`${
                  item.name === selectedSort
                    ? "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:border-indigo-600 dark:hover:bg-indigo-500 dark:hover:border-indigo-500"
                    : "bg-white text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:border-slate-500"
                } text-sm font-medium capitalize px-3 py-1 border rounded-full transition-colors hover:border-indigo-600`}
                onClick={() => setSelectedSort(item.name)}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full min-h-10 flex justify-between items-center gap-2 text-sm font-medium px-3 py-2 border-b transition-colors bg-slate-50 dark:bg-gray-900 dark:border-y-slate-700">
        <div className="flex flex-wrap gap-1.5">
          <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold mr-0.5 pr-2 py-0.5 border-r border-slate-300 pointer-events-none transition-colors dark:text-slate-300 dark:border-r-slate-600">
            <i className="fa-solid fa-filter"></i>
            Filters
          </div>
          {Object.keys(selectedFilters).reduce((acc, filterKey) => {
            return acc + selectedFilters[filterKey].length;
          }, 0) > 1 && (
            <button
              className="bg-rose-100 flex items-center gap-1 text-rose-600 px-1.5 py-px rounded-lg transition-colors hover:text-rose-700 hover:bg-rose-200 dark:bg-rose-900 dark:text-rose-300 dark:hover:bg-rose-800 dark:hover:text-rose-200"
              onClick={() =>
                setSelectedFilters((prev) =>
                  Object.keys(prev).reduce((acc, key) => {
                    acc[key] = prev[key] && [];
                    return acc;
                  }, {})
                )
              }
            >
              <span>Clear all filters</span>
              <i className="fa-regular fa-xmark text-rose-600 transition-colors dark:text-rose-400"></i>
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
                key={`${filterKey}-${item.id}`}
                initial={{ opacity: 0, translateX: -10 }}
                animate={{ opacity: 1, translateX: 0 }}
                className="bg-blue-100 text-blue-800 flex items-center gap-1 capitalize px-1.5 py-px rounded-lg transition-colors group dark:bg-blue-900 dark:text-blue-300"
                onClick={() => handleFilterChange(filterKey, item)}
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
