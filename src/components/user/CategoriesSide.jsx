"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CategoriesSide({
  filters,
  selectedFilters,
  setSelectedFilters,
}) {
  const [filtersVisibility, setFiltersVisibility] = useState({
    categories: false,
    colors: false,
    sizes: false,
  });

  function handleFiltersChange(filterKey, selectedItem) {
    setSelectedFilters((prev) => {
      const currentFilter = prev[filterKey];
      const isSelected = currentFilter.some(
        (item) => item.id === selectedItem.id
      );
      const updatedFilter = isSelected
        ? currentFilter.filter((item) => item.id !== selectedItem.id)
        : [...currentFilter, selectedItem];

      return { ...prev, [filterKey]: updatedFilter };
    });
  }

  return (
    <div className="min-w-56 max-w-56 flex flex-col items-start">
      <ul className="w-full flex flex-col gap-3 px-2 my-2">
        {Object.keys(filters).map((filterKey, index) => {
          return (
            <div
              key={`${filterKey}-${index}`}
              className="bg-slate-50 border rounded-lg transition-colors dark:bg-slate-800 dark:border-slate-600"
            >
              <li key={filterKey} className="relative w-full">
                <button
                  className="w-full flex justify-between items-center text-slate-700 text-sm font-bold capitalize px-3.5 py-2 rounded-md transition-colors hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-300"
                  onClick={() =>
                    setFiltersVisibility((prev) => ({
                      ...prev,
                      [filterKey]: !prev[filterKey],
                    }))
                  }
                >
                  {filterKey}
                  <i
                    className={`fa-regular fa-angle-up transition-transform duration-300 ${
                      filtersVisibility[filterKey] ? "rotate-0" : "-rotate-180"
                    }`}
                  ></i>
                </button>
                {!filtersVisibility[filterKey] &&
                  selectedFilters[filterKey].length !== 0 && (
                    <button
                      className="w-full flex items-center flex-wrap gap-1 pb-3 px-3"
                      onClick={() =>
                        setFiltersVisibility((prev) => ({
                          ...prev,
                          [filterKey]: !prev[filterKey],
                        }))
                      }
                    >
                      {selectedFilters[filterKey].map((item) => {
                        return (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            key={`${filterKey}-${item.id}`}
                            className="bg-emerald-100 text-xs text-emerald-600 capitalize font-medium px-1.5 py-px rounded-lg transition-colors dark:bg-emerald-900 dark:text-emerald-300"
                          >
                            {item.name}
                          </motion.span>
                        );
                      })}
                    </button>
                  )}
                <motion.div
                  className="w-full px-2 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: filtersVisibility[filterKey] ? "auto" : 0,
                    opacity: filtersVisibility[filterKey] ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ul className="flex flex-col gap-1 mb-2">
                    {filters[filterKey].map((item) => {
                      const isSelected = selectedFilters[filterKey].find(
                        (sp) => item.id === sp.id
                      );

                      return (
                        <li
                          key={item.id}
                          className={`${
                            isSelected
                              ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 hover:text-emerald-700 dark:bg-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-600 dark:hover:text-emerald-100"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                          } w-full text-sm font-medium rounded-lg group transition-colors`}
                        >
                          <button
                            className="w-full flex justify-between items-center capitalize text-start px-2 py-1"
                            onClick={() => handleFiltersChange(filterKey, item)}
                          >
                            {filterKey === "prices"
                              ? "$" + item.name + "+"
                              : item.name}
                            <i
                              className={`${
                                isSelected
                                  ? "text-emerald-500 transition-colors dark:text-emerald-300"
                                  : "text-emerald-400 opacity-0 transition-all group-hover:opacity-100 dark:text-emerald-500"
                              } fa-solid fa-check`}
                            ></i>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
