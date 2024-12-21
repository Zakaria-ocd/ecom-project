"use client";
import { useState } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="h-full flex items-center py-1">
      <form
        onSubmit={handleSearch}
        className="flex items-center h-full rounded-md ring-1 ring-slate-300 transition-all focus-within:ring-sky-100 focus-within:ring-4"
      >
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="h-full px-2 rounded-l-md outline-none transition-all"
        />
        <button
          type="submit"
          aria-label="Search"
          className="h-full px-3 bg-slate-200/70 rounded-r-md hover:bg-slate-300/60 transition-colors"
        >
          <i className="fa-regular fa-search text-slate-400"></i>
        </button>
      </form>
    </div>
  );
};

export default Search;
