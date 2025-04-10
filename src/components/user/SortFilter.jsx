"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SortFilter({
  selectedFilter,
  setSelectedFilter,
  sortList,
}) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedFilter(option);
    setDropdownVisible(false);
  };

  return (
    <div className="relative bg-white flex items-center transition-colors dark:bg-slate-800"
            ref={dropdownRef}>
      <button
        className="w-full h-full flex items-center justify-between gap-1 text-slate-800 text-sm font-semibold px-2 rounded-md group transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-slate-400"
        onClick={handleDropdownToggle}
      >
        Sorted by:
        <span className="text-slate-600 font-medium capitalize transition-colors group-hover:text-slate-700 dark:text-slate-200 dark:group-hover:text-slate-300">
          {selectedFilter.name}
        </span>
        <i className="fa-regular fa-angle-down"></i>
      </button>

      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full z-10 bg-white mt-px shadow-lg rounded-md dark:bg-slate-800"
          >
            <ul className="flex flex-col items-start">
              {sortList.map((option) => (
                <li
                  key={option.id}
                  className={`w-full px-3 py-2 cursor-pointer first:rounded-t-md last:rounded-b-md transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 ${
                    selectedFilter?.id === option.id
                      ? "bg-emerald-200 text-emerald-700 dark:bg-emerald-700"
                      : "text-slate-600"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
