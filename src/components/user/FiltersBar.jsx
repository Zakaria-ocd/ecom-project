"use client";
import { motion } from "framer-motion";

export default function FiltersBar({
  selectedCategories,
  setSelectedCategories,
}) {
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
    <div className="w-full h-10 bg-slate-50 flex justify-between items-center text-sm text-slate-700 font-medium px-6 border-b z-10">
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
                <span>{item.name}</span>
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
      <button
        className="enabled:hover:text-rose-600 enabled:hover:bg-rose-100 px-2 py-1 rounded-md transition-colors text-slate-500 font-medium disabled:text-slate-400 disabled:cursor-not-allowed"
        disabled={selectedCategories.length === 0 ? true : false}
        onClick={() => setSelectedCategories([])}
      >
        Clear All
      </button>
    </div>
  );
}
