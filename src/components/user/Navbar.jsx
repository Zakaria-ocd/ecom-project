"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useState } from "react";
import FiltersBar from "./FiltersBar";

export default function Navbar() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const isLogged = true; // for testing

  const [selectedSort, setSelectedSort] = useState("Most Popular");
  const filters = {
    categories: [
      { id: 1, categorie: "Accessories" },
      { id: 2, categorie: "Shirts" },
      { id: 3, categorie: "Shoes" },
      { id: 4, categorie: "Jackets" },
      { id: 5, categorie: "Men" },
      { id: 6, categorie: "Women" },
    ],
    prices: [
      { id: 1, min: 0, max: 25, moreThan: 0 },
      { id: 2, min: 25, max: 50, moreThan: 0 },
      { id: 3, min: 50, max: 75, moreThan: 0 },
      { id: 4, min: 0, max: 0, moreThan: 75 },
    ],
    colors: [
      { id: 1, color: "White" },
      { id: 2, color: "Black" },
      { id: 3, color: "Blue" },
      { id: 4, color: "Brown" },
      { id: 5, color: "Green" },
      { id: 6, color: "Purple" },
      { id: 7, color: "Yellow" },
      { id: 8, color: "Orange" },
    ],
    sizes: [
      { id: 1, color: "XS" },
      { id: 2, color: "S" },
      { id: 3, color: "M" },
      { id: 4, color: "L" },
      { id: 5, color: "XL" },
      { id: 6, color: "2XL" },
      { id: 7, color: "3XL" },
    ],
  };

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
      <nav className="w-full h-16 flex flex-row justify-between items-center px-3 py-1 border-b z-10">
        <Logo className="w-10" />

        <div className="min-w-96 h-10 flex items-center ring-1 ring-gray-200 rounded-md transition-all focus-within:ring focus-within:ring-sky-200/50">
          <button
            className="relative w-auto h-full"
            onBlur={() => setDropdownVisibility(false)}
          >
            <div
              className="w-full h-full bg-slate-100 rounded-s-md cursor-pointer transition-colors hover:bg-slate-200 flex items-center space-x-1 px-3"
              onClick={() => setDropdownVisibility((value) => !value)}
            >
              <span className="text-slate-600 text-sm font-medium">
                Categories
              </span>
              <i className="fa-regular fa-angle-down text-slate-400 text-sm"></i>
            </div>
            <ul
              className={`absolute top-11 bg-slate-100/20 backdrop-blur-sm text-sm border rounded-md ${
                dropdownVisibility ? "visible" : "hidden"
              } shadow-lg shadow-slate-200 transition-all z-20`}
            >
              {filters.categories.map((item) => {
                const newSelectedCategories = selectedCategories.find(
                  (nsc) => nsc.id === item.id
                );
                return (
                  <li
                    key={item.id}
                    className={`${
                      newSelectedCategories
                        ? "text-emerald-500"
                        : "text-slate-700"
                    } w-full flex justify-between items-center space-x-2 py-1 px-3 hover:bg-slate-200/60 transition-colors cursor-pointer first:hover:rounded-t last:hover:rounded-b`}
                    value={item.id}
                    onClick={() => handleCategorieChange(item)}
                  >
                    <span className="pr-4">{item.categorie}</span>
                    {newSelectedCategories && (
                      <i className="fa-regular fa-check text-emerald-400 absolute right-2"></i>
                    )}
                  </li>
                );
              })}
            </ul>
          </button>
          <input
            className="min-w-40 w-full h-full px-2 outline-none"
            type="text"
            placeholder="Search"
          />
          <button className="h-full bg-slate-100 flex justify-center items-center p-3 rounded-r-md transition-colors hover:bg-slate-200">
            <i className="fa-regular fa-magnifying-glass text-slate-400"></i>
          </button>
        </div>

        {isLogged ? (
          <div className="flex flex-row items-center">
            <Link
              className="p-1 mx-2"
              href="/profile/wishlist"
              title="Wish list"
            >
              <i className="fa-light fa-heart text-xl text-rose-500"></i>
            </Link>
            <Link
              className="p-1 mx-2"
              href="/profile/cart"
              title="Shopping cart"
            >
              <i className="fa-light fa-cart-shopping text-xl text-amber-400"></i>
            </Link>
            <button className="p-1 mx-2" title="Profile">
              <i className="fa-light fa-circle-user text-slate-400 text-2xl"></i>
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-x-4">
            <div className="bg-gradient-to-br from-[rgb(255,211,0,1)] to-[rgb(231,53,53,1)] p-[2px] rounded-md">
              <Link
                className='relative z-0 flex items-center gap-2 overflow-hidden rounded-md px-4 py-1 font-semibold bg-white text-orange-500 transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-br before:from-[rgb(255,211,0,1)] before:to-[rgb(231,53,53,1)] before:transition-transform before:duration-500 before:content-[""] hover:scale-105 hover:text-white hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95'
                href="/user/login"
              >
                Login
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[rgb(255,211,0,1)] to-[rgb(231,53,53,1)] p-[2px] rounded-md">
              <Link
                className='relative z-0 flex items-center gap-2 overflow-hidden rounded-md px-4 py-1 font-semibold bg-white text-orange-500 transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-br before:from-[rgb(255,211,0,1)] before:to-[rgb(231,53,53,1)] before:transition-transform before:duration-500 before:content-[""] hover:scale-105 hover:text-white hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95'
                href="/admin/login"
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </nav>
      <FiltersBar
        selectedCategories={selectedCategories}
        setSelectedCategories={(value) => setSelectedCategories(value)}
        selectedSort={selectedSort}
        setSelectedSort={(value) => setSelectedSort(value)}
      />
    </>
  );
}
