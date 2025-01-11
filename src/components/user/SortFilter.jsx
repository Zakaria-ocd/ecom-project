"use client";
import { useState, useEffect, useRef } from "react";
import DropdownMenu from "./DropdownMenu";
import { motion } from "framer-motion";

export default function SortFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
}) {
  const [sortVisibility, setSortVisibility] = useState(false);

  const dropdownsRef = useRef(null);

  const handleDropdownToggle = () => {
    setSortVisibility((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownsRef.current).forEach((key) => {
        if (
          dropdownsRef.current[key] &&
          !dropdownsRef.current[key].contains(event.target)
        ) {
          setSortVisibility((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-1/4 bg-white/95 flex items-center text-sm font-semibold text-slate-700 p-6 border-y backdrop-blur-sm transition-colors dark:bg-slate-800/95 dark:border-y-slate-700">
      <div className="flex flex-col">
        {Object.keys(selectedFilter).map((key) => {
          return (
            <div
              key={key}
              className="relative flex flex-col items-center space-y-6 px-4"
              ref={(el) => (dropdownsRef.current = el)}
            >
              <button
                className="flex items-center space-x-1 rounded-md group transition-colors"
                onClick={handleDropdownToggle}
              >
                <span className="text-slate-600 font-medium capitalize transition-colors group-hover:text-slate-700 dark:text-slate-200 dark:group-hover:text-slate-300">
                  {key}
                </span>
                {selectedFilter[key].length !== 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="size-5 bg-slate-200 text-slate-600 rounded-md dark:bg-slate-600 dark:text-slate-200 dark:group-hover:text-slate-300 transition-colors"
                  >
                    {selectedFilter[key].length}
                  </motion.span>
                )}
                <i className="fa-regular fa-angle-down text-slate-400 transition-colors group-hover:text-slate-500 dark:text-slate-200 dark:group-hover:text-slate-400"></i>
              </button>
              <DropdownMenu
                selectedFilter={selectedFilter[key]}
                setSelectedFilter={(value) =>
                  setSelectedFilter({ ...selectedFilter, [key]: value })
                }
                filterVisibility={sortVisibility[key]}
                filter={filters[key]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
