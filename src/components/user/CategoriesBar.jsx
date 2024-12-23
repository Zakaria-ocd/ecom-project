"use client";
import { useState, useEffect, useRef } from "react";
import DropdownMenu from "./DropdownMenu";
import FiltersBar from "./FiltersBar";

export default function CategoriesBar({
  selectedFilter,
  setSelectedFilter,
  filters,
}) {
  const [dropdownsVisibility, setDropdownsVisibility] = useState({
    sorts: false,
    categories: false,
    prices: false,
    colors: false,
    sizes: false,
  });

  const dropdownsRef = useRef({
    sorts: null,
    categories: null,
    prices: null,
    colors: null,
    sizes: null,
  });

  const dropdownsName = ["categories", "prices", "colors", "sizes"];

  const handleDropdownToggle = (key) => {
    setDropdownsVisibility((prev) => ({
      ...Object.keys(prev).reduce((acc, k) => {
        acc[k] = k === key ? !prev[k] : false;
        return acc;
      }, {}),
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownsRef.current).forEach((key) => {
        if (
          dropdownsRef.current[key] &&
          !dropdownsRef.current[key].contains(event.target)
        ) {
          setDropdownsVisibility((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="w-full h-10 bg-slate-50 flex justify-between items-center text-sm font-semibold text-slate-700 px-6 border-b z-10">
        <div
          className="relative flex flex-col items-center space-y-6"
          ref={(el) => (dropdownsRef.current.sorts = el)}
        >
          <button
            className="flex items-center space-x-1 rounded-md transition-colors group"
            onClick={() => handleDropdownToggle("sorts")}
          >
            <span className="text-slate-600 font-medium transition-colors group-hover:text-slate-700">
              Sort by
            </span>
            <i className="fa-regular fa-angle-down text-slate-400 transition-colors group-hover:text-slate-500"></i>
          </button>
          <DropdownMenu
            selectedFilter={selectedFilter.sorts}
            setSelectedFilter={(value) =>
              setSelectedFilter({ ...selectedFilter, sorts: value })
            }
            filterVisibility={dropdownsVisibility.sorts}
            filter={filters.sorts}
            isSingleSelect={true}
            filterName={"sorts"}
          />
        </div>
        <div className="flex">
          {dropdownsName.map((key, index) => (
            <div
              key={key}
              className={`relative flex flex-col items-center space-y-7
                ${dropdownsName.length - 1 === index ? "pl-4" : "px-4"}
                ${index !== 0 && "border-l border-slate-300/70"}`}
              ref={(el) => (dropdownsRef.current[key] = el)}
            >
              <button
                className="flex items-center space-x-1 rounded-md group transition-colors"
                onClick={() => handleDropdownToggle(key)}
              >
                <span className="text-slate-600 font-medium capitalize transition-colors group-hover:text-slate-700">
                  {key}
                </span>
                {key !== "prices" && (
                  <span className="size-5 bg-slate-200 text-slate-600 rounded-md">
                    {selectedFilter[key].length}
                  </span>
                )}
                <i className="fa-regular fa-angle-down text-slate-400 transition-colors group-hover:text-slate-500"></i>
              </button>
              <DropdownMenu
                selectedFilter={selectedFilter[key]}
                setSelectedFilter={(value) =>
                  setSelectedFilter({ ...selectedFilter, [key]: value })
                }
                filterVisibility={dropdownsVisibility[key]}
                filter={filters[key]}
                isSingleSelect={key === "prices"}
                filterName={key}
              />
            </div>
          ))}
        </div>
      </div>
      <FiltersBar
        selectedCategories={selectedFilter.categories}
        setSelectedCategories={(value) =>
          setSelectedFilter({ ...selectedFilter, categories: value })
        }
      />
    </>
  );
}
