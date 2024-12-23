"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";
import CategoriesBar from "./CategoriesBar";

export default function Navbar() {
  const [selectedFilter, setSelectedFilter] = useState({
    sorts: 1,
    categories: [],
    prices: 1,
    colors: [],
    sizes: [],
  });
  const isLogged = true; // for testing

  const [filters, setFilters] = useState({
    sorts: [],
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
  });

  useEffect(() => {
    setFilters({
      sorts: [
        { id: 1, name: "Most Popular" },
        { id: 2, name: "Newest Arrivals" },
        { id: 3, name: "Best Rating" },
      ],
      categories: [
        { id: 1, name: "T-shirts" },
        { id: 2, name: "Jackets" },
        { id: 3, name: "Boots" },
        { id: 4, name: "Man" },
        { id: 5, name: "Woman" },
      ],
      prices: [
        { id: 1, name: "All prices" },
        { id: 2, name: "Less than $50" },
        { id: 3, name: "$50 - $100" },
        { id: 4, name: "$100 - $200" },
        { id: 5, name: "$200 - $300" },
        { id: 6, name: "More than $300" },
      ],
      colors: [
        { id: 1, name: "Red" },
        { id: 2, name: "Blue" },
        { id: 3, name: "Green" },
        { id: 4, name: "Black" },
        { id: 5, name: "White" },
      ],
      sizes: [
        { id: 1, name: "Small" },
        { id: 2, name: "Medium" },
        { id: 3, name: "Large" },
        { id: 4, name: "Extra Large" },
      ],
    });
  }, []);

  return (
    <nav>
      <div className="w-full h-16 flex flex-row justify-between items-center px-3 py-1 border-b z-10">
        <Logo className="w-10" />

        <div className="min-w-96 h-10 flex items-center ring-1 ring-gray-200 rounded-md transition-all focus-within:ring focus-within:ring-sky-200/50">
          <input
            className="min-w-40 w-full h-full px-2 rounded-md outline-none"
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
      </div>
      <CategoriesBar
        selectedFilter={selectedFilter}
        setSelectedFilter={(value) => setSelectedFilter(value)}
        filters={filters}
      />
    </nav>
  );
}
