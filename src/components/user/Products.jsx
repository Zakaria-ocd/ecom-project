"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FiltersBar from "./FiltersBar";
import Rating from "../Rating";
import CategoriesSide from "./CategoriesSide";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [favoriteTransform, setFavoriteTransform] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
  });

  const [filters, setFilters] = useState({
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
  });
  const [sortList, setSortList] = useState([]);

  useEffect(() => {
    setProducts([
      {
        productId: 1,
        name: "Men Apple Watch",
        price: 120.0,
        image: "/assets/products/men-apple-watch.jpg",
        rating: 4.3,
      },
      {
        productId: 2,
        name: "Men Black Shoes",
        price: 155.0,
        image: "/assets/products/men-black-shoes.jpg",
        rating: 4.7,
      },
      {
        productId: 3,
        name: "Men Brown Shoes",
        price: 80.0,
        image: "/assets/products/men-brown-shoes.jpg",
        rating: 3.4,
      },
      {
        productId: 4,
        name: "Men T-Shirts",
        price: 140.0,
        image: "/assets/products/t-shirts.jpg",
        rating: 5,
      },
      {
        productId: 5,
        name: "Women Beige Pants",
        price: 185.0,
        image: "/assets/products/women-beige-pants.jpg",
        rating: 3.1,
      },
      {
        productId: 6,
        name: "Reafonbgates Pants",
        price: 75.0,
        image: "/assets/products/reafonbgates-pants.jpg",
        rating: 4.7,
      },
      {
        productId: 7,
        name: "Goumbik Brown Shoes",
        price: 135.0,
        image: "/assets/products/goumbik-brown-shoes.jpg",
        rating: 3.9,
      },
      {
        productId: 8,
        name: "Introspective design hat",
        price: 65.0,
        image: "/assets/products/introspective-design-hat.jpg",
        rating: 3.4,
      },
    ]);

    setSortList([
      { id: 1, name: "most popular" },
      { id: 2, name: "newest arrivals" },
      { id: 3, name: "best rating" },
    ]);

    setFilters({
      categories: [
        { id: 1, name: "fashion" },
        { id: 2, name: "electronics" },
        { id: 3, name: "beauty" },
        { id: 4, name: "sport" },
        { id: 5, name: "toys" },
      ],
      prices: [
        { id: 1, name: 50 },
        { id: 2, name: 100 },
        { id: 3, name: 200 },
        { id: 4, name: 300 },
        { id: 5, name: 500 },
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
    <div className="w-full max-w-screen bg-white flex flex-col items-center border-t border-white transition-colors dark:bg-slate-900 dark:border-t-slate-700">
      <div className="w-full z-0 bg-white flex justify-center items-center py-14 transition-colors dark:bg-slate-900">
        <p className="bg-white z-10 text-2xl text-slate-800 font-bold px-4 py-2 transition-colors dark:text-slate-100 dark:bg-slate-900">
          OUR PRODUCTS
        </p>
        <div className="absolute -z-0 w-96 h-0.5 bg-slate-800 transition-colors dark:bg-slate-300" />
      </div>

      <div className="w-full flex justify-between items-start">
        <CategoriesSide
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        <div className="w-full bg-white flex flex-col gap-4 transition-colors dark:bg-slate-900">
          <FiltersBar
            sortList={sortList}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 py-4 gap-10">
            {products.map((item) => {
              return (
                <div
                  key={item.productId}
                  className="w-64 sm:w-52 flex flex-col gap-4 place-self-center"
                >
                  <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center overflow-hidden rounded-md shadow-lg">
                    <Image
                      width={500}
                      height={300}
                      className="w-full h-full peer rounded-md"
                      src={item.image}
                      alt={item.name}
                    />
                    <i
                      className={`fa-${
                        favoriteTransform ? "solid" : "regular"
                      } fa-heart text-white absolute size-4 top-3 left-3 opacity-0 cursor-pointer peer-hover:opacity-100 ease-in-out duration-300 peer-hover:translate-x-0 hover:translate-x-0 -translate-x-8 hover:opacity-100 hover:text-rose-500`}
                      onMouseOver={() => setFavoriteTransform(true)}
                      onMouseOut={() => setFavoriteTransform(false)}
                    ></i>
                    <div className="absolute hover:translate-y-0 -translate-y-6 opacity-0 peer-hover:opacity-100 ease-in-out duration-500 peer-hover:translate-y-0 hover:opacity-100 flex flex-col h-24 justify-center gap-4">
                      <Link
                        className="w-32 hover:bg-[#222] duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800"
                        href={`/products/${item.productId}`}
                      >
                        <div className="h-16 w-full flex flex-col translate-y-px duration-300 ease-in-out hover:-translate-y-[30px]">
                          <div className="w-full h-1/2 flex justify-center items-center text-gray-900 dark:text-gray-200">
                            Quick view
                          </div>
                          <div className="w-full h-1/2 flex justify-center items-center text-white">
                            <i className="fa-light fa-eye"></i>
                          </div>
                        </div>
                      </Link>
                      <Link
                        className="w-32 hover:bg-[#222] duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800"
                        href={`/products/${item.productId}`}
                      >
                        <div className="h-16 w-full flex flex-col translate-y-px duration-300 ease-in-out hover:-translate-y-[30px]">
                          <div className="w-full h-1/2 flex justify-center items-center text-gray-900 dark:text-gray-200">
                            Quick shop
                          </div>
                          <div className="w-full h-1/2 flex justify-center items-center text-white">
                            <i className="fa-light fa-cart-plus"></i>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="relative w-full flex flex-col px-1">
                    <Link
                      className="w-fit text-gray-900 transition-colors font-semibold hover:underline dark:text-gray-200"
                      href={`/products/${item.productId}`}
                    >
                      {item.name}
                    </Link>
                    <div className="w-full flex justify-between items-center">
                      <p className="text-gray-600 transition-colors dark:text-gray-400">
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-700 transition-colors mt-px dark:text-gray-300">
                          {item.rating}
                        </p>
                        <Rating rating={item.rating} starClass="text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
