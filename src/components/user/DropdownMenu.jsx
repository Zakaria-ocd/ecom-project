import { motion, AnimatePresence } from "framer-motion";

export default function DropdownMenu({
  selectedFilter,
  setSelectedFilter,
  filterVisibility,
  filter,
  isSingleSelect = false,
  filterName,
}) {
  function handleFilterChange(selectedItem) {
    if (isSingleSelect) {
      setSelectedFilter(selectedItem.id);
    } else {
      const isFilterSelected = selectedFilter.find(
        (item) => item.id === selectedItem.id
      );
      const updatedFilters = isFilterSelected
        ? selectedFilter.filter((item) => item.id !== selectedItem.id)
        : [...selectedFilter, selectedItem];
      setSelectedFilter(updatedFilters);
    }
  }

  return (
    <AnimatePresence>
      {filterVisibility && (
        <motion.ul
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: {
              opacity: 0,
              y: -10,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
            exit: {
              opacity: 0,
              y: -10,
            },
          }}
          transition={{
            duration: 0.2,
          }}
          className={`absolute ${filterName === "sorts" && "-left-2"} ${
            filterName === "sizes" && "-right-2"
          } bg-white flex flex-col border rounded-lg shadow-lg z-20`}
        >
          {filter.map((item) => {
            const isSelected = isSingleSelect
              ? selectedFilter === item.id
              : selectedFilter.some((sf) => sf.id === item.id);

            return (
              <li
                key={item.id}
                className={`${
                  isSelected ? "text-emerald-500" : "text-slate-500"
                } w-full flex items-center text-start px-3 py-1.5 text-nowrap font-medium cursor-pointer first:rounded-t-lg last:rounded-b-lg hover:bg-slate-200/60 transition-all`}
                onClick={() => handleFilterChange(item)}
              >
                {isSelected && (
                  <i className="fa-solid fa-check text-emerald-400 absolute left-1.5"></i>
                )}
                <span className="pl-2.5 pr-2.5">{item.name}</span>
              </li>
            );
          })}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}