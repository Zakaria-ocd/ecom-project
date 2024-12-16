'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="mb-6 h-full mr-4 mt-4">
      <form onSubmit={handleSearch} className="flex items-center space-x-2 h-full ">
        <input 
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="p-2 rounded border border-gray-300 ml-4"
        />
        <button
          type="submit"
          aria-label="Search"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </div>
  );
};

export default Search;
