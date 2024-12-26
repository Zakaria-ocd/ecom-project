"use client";
import { motion } from "framer-motion";

export default function FiltersBar({ selectedFilter, setSelectedFilter }) {
  function handleFilterChange(filterKey, selectedItem) {
    setSelectedFilter((prev) => {
      const currentFilter = prev[filterKey];

      // Handle single-select and exclude it from display
      if (!Array.isArray(currentFilter)) {
        return prev; // No changes for single-select filters
      }

      // Handle multi-select
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
    <div className="w-full min-h-10 bg-slate-50 flex justify-between items-center gap-2 text-sm text-slate-700 font-medium px-6 border-b z-10">
      <div className="flex items-center space-x-3 py-2">
        <div className="flex items-center gap-3">
          {Object.keys(selectedFilter).map((filterKey) => {
            if (!Array.isArray(selectedFilter[filterKey])) return null;
            if (selectedFilter[filterKey].length === 0) return null;

            return (
              <div key={filterKey} className="w-fit flex items-center gap-2">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-1 pr-2 border-r border-slate-300"
                  style={{ width: "fit-content" }}
                >
                  <i className="fa-solid fa-filter text-slate-400"></i>
                  <span className="text-slate-500 capitalize">{filterKey}</span>
                </motion.div>

                <div className="flex flex-wrap gap-2">
                  {selectedFilter[filterKey].map((item) => (
                    <motion.div
                      key={`${filterKey}-${item.id}`}
                      layout
                      initial={{ scale: 0.5, opacity: 0, translateX: -50 }}
                      animate={{ scale: [0.5, 1], opacity: 1, translateX: 0 }}
                      className="bg-blue-100 text-blue-800 flex items-center space-x-1 px-1.5 py-px rounded-lg"
                    >
                      <span>{item.name}</span>
                      <button
                        className="flex items-center"
                        onClick={() => handleFilterChange(filterKey, item)}
                      >
                        <i className="fa-regular fa-xmark text-blue-500"></i>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="enabled:hover:text-rose-600 enabled:hover:bg-rose-100 min-w-[70px] py-1 rounded-md transition-colors text-slate-500 font-normal disabled:text-slate-400 disabled:cursor-not-allowed"
        disabled={Object.keys(selectedFilter).every(
          (key) =>
            !Array.isArray(selectedFilter[key]) ||
            selectedFilter[key].length === 0
        )}
        onClick={() =>
          setSelectedFilter((prev) =>
            Object.keys(prev).reduce((acc, key) => {
              acc[key] = Array.isArray(prev[key]) ? [] : prev[key];
              return acc;
            }, {})
          )
        }
      >
        Clear All
      </button>
    </div>
  );
}
