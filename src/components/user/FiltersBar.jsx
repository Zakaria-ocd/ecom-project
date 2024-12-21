"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FiltersBar({
  selectedCategories,
  setSelectedCategories,
  selectedSort,
  setSelectedSort,
}) {
  const [sortVisibility, setSortVisibility] = useState(false);
  const sortList = ["Most Popular", "Best Rating", "Low Price", "Newest"];

  function handleCategorieChange(selectedCategorie) {
    const isCategorieSelected = selectedCategories.find(
      (item) => item.id === selectedCategorie.id
    );
    let filteredCategories;
    if (isCategorieSelected) {
      filteredCategories = selectedCategories.filter(
        (item) => item.id !== selectedCategorie.id
      );
    } else {
      filteredCategories = [...selectedCategories, { ...selectedCategorie }];
    }
    setSelectedCategories(filteredCategories);
  }

  return (
    <>
      <div className="w-full h-10 bg-slate-50 flex justify-between items-center text-sm font-semibold text-slate-700 px-6 border-b z-10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 pointer-events-none">
            <i className="fa-solid fa-filter text-slate-400"></i>
            <span className="text-slate-500">Filters</span>
          </div>
          <span className="w-px h-5 bg-slate-300"></span>
          <div className="flex items-center space-x-3">
            {selectedCategories.map((item) => {
              return (
                <motion.div
                  layout
                  initial={{ scale: 0.5, opacity: 0, translateX: -30 }}
                  animate={{ scale: [0.5, 1], opacity: 1, translateX: 0 }}
                  key={item.id}
                  className="bg-blue-100 text-blue-800 flex items-center space-x-1 px-1.5 py-px rounded-lg"
                >
                  <span>{item.categorie}</span>
                  <button
                    className="flex items-center"
                    onClick={() => handleCategorieChange(item)}
                  >
                    <i className="fa-regular fa-xmark text-blue-500"></i>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="enabled:hover:text-rose-600 enabled:hover:bg-rose-100 px-2 py-1 rounded-md transition-colors text-slate-500 font-medium disabled:text-slate-400 disabled:cursor-not-allowed"
            disabled={selectedCategories.length === 0 ? true : false}
            onClick={() => setSelectedCategories([])}
          >
            Clear All
          </button>
          <button className="relative" onBlur={() => setSortVisibility(false)}>
            <div
              className="flex items-center space-x-1 hover:text-slate-600 rounded-md transition-colors"
              onClick={() => setSortVisibility((value) => !value)}
            >
              <span>Sort by</span>
              <i className="fa-regular fa-angle-down text-slate-400"></i>
            </div>
            <ul
              className={`${
                sortVisibility ? "flex" : "hidden"
              } absolute top-6 right-0 bg-slate-100/20 backdrop-blur-sm flex-col border rounded-lg shadow-lg z-20`}
            >
              {sortList.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={`${
                      selectedSort === item
                        ? "text-slate-800"
                        : "text-slate-400"
                    } w-full text-start px-3 py-1.5 text-nowrap font-medium cursor-pointer first:rounded-t-lg last:rounded-b-lg hover:bg-slate-200/60`}
                    onClick={() => setSelectedSort(item)}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </button>
        </div>
      </div>
    </>
  );
}
