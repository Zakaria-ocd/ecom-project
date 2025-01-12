"use client";
import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
import CategoriesBar from "./CategoriesBar";
import FiltersBar from "./FiltersBar";
import Rating from "../Rating";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { easeInOut, motion } from "framer-motion";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [favouriteTransform, setFavouriteTransform] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState({
    sorts: 1,
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
  });
  const [filters, setFilters] = useState({
    sorts: [],
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
  });
  const [productColors, setProductColors] = useState("");
  useEffect(() => {
    setProducts([
      {
        productId: 1,
        name: "Men Apple Watch",
        price: 120.0,
        image: "/assets/products/men-apple-watch.jpg",
        rating: 4.3,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
      {
        productId: 2,
        name: "Men Black Shoes",
        price: 155.0,
        image: "/assets/products/t-shirts.jpg",
        rating: 4.7,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
      {
        productId: 3,
        name: "Men Brown Shoes",
        price: 80.0,
        image: "/assets/products/reafonbgates-pants.jpg",
        rating: 3.4,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
      {
        productId: 4,
        name: "Men T-Shirts",
        price: 140.0,
        image: "/assets/products/men-brown-shoes.jpg",
        rating: 5,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
      {
        productId: 5,
        name: "Women Beige Pants",
        price: 185.0,
        image: "/assets/products/men-black-shoes.jpg",
        rating: 3.1,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
      {
        productId: 6,
        name: "Reafonbgates Pants",
        price: 75.0,
        image: "/assets/products/introspective-design-hat.jpg",
        rating: 4.7,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
      {
        productId: 7,
        name: "Goumbik Brown Shoes",
        price: 135.0,
        image: "/assets/products/goumbik-brown-shoes.jpg",
        rating: 3.9,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
      {
        productId: 8,
        name: "introspectivedsgn-hat.jpg",
        price: 65.0,
        image: "/assets/products/women-beige-pants.jpg",
        rating: 3.4,
        colors: [
          { name: "Red", colorCode: "#FF0000" },
          { name: "Green", colorCode: "#00FF00" },
          { name: "Blue", colorCode: "#0000FF" },
        ],
      },
    ]);

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
    <div className="w-full max-w-screen bg-slate-50 flex flex-col items-center py-14 transition-colors dark:bg-slate-900">
      <div className="flex justify-between items-center w-96 mb-14">
        <div className="h-0.5 bg-slate-800 w-16 transition-colors dark:bg-slate-300" />
        <p className="text-2xl text-slate-800 font-bold transition-colors dark:text-slate-100">
          OUR PRODUCTS
        </p>
        <div className="h-0.5 bg-slate-800 w-16 transition-colors dark:bg-slate-300" />
      </div>

      <CategoriesBar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filters={filters}
      />
      <FiltersBar
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-10 gap-10">
        {products.map((item) => {
          return (
            <div
              key={item.productId}
              className="w-64 sm:w-52 flex flex-col gap-4 place-self-center"
            >
              <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center overflow-hidden">
                <Image
                  width={500}
                  height={300}
                  className="w-full h-full peer rounded-sm"
                  src={item.image}
                  alt={item.name}
                />
                <i
                  className={`fa-${
                    favouriteTransform ? "solid" : "regular"
                  } fa-heart text-white absolute size-4 top-3 left-3 opacity-0 cursor-pointer peer-hover:opacity-100 ease-in-out duration-300 peer-hover:translate-x-0 hover:translate-x-0 -translate-x-8 hover:opacity-100 hover:text-rose-500`}
                  onMouseOver={() => setFavouriteTransform(true)}
                  onMouseOut={() => setFavouriteTransform(false)}
                ></i>
                <div className="absolute hover:translate-y-0 -translate-y-6 opacity-0 peer-hover:opacity-100 ease-in-out duration-500 peer-hover:translate-y-0 hover:opacity-100 flex flex-col h-24 justify-center gap-4">
                  <Dialog>
                    <DialogTrigger>
                      {" "}
                      <div
                        className="w-32 hover:bg-[#222] duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800 dark:hover:bg-zinc-900"
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
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <VisuallyHidden>
                        <DialogTitle></DialogTitle>
                      </VisuallyHidden>
                      <div className="w-full absolute h-full flex">
                        <Image
                          className="w-1/2 h-full"
                          src={item.image}
                          alt={item.name}
                          width={500}
                          height={300}
                        ></Image>
                        <div className="p-8 w-1/2 flex flex-col gap-3">
                          <div className=" w-full justify-between h-[3.25rem] flex flex-col ">
                            <div className="text-gray-900 transition-colors font-extrabold dark:text-gray-200">
                              {item.name}
                            </div>
                            <div className="w-full flex justify-between items-center">
                              <p className="text-gray-600 transition-colors dark:text-gray-400">
                                ${item.price}
                              </p>
                              <div className="flex items-center gap-1">
                                <p className="text-sm text-gray-700 transition-colors mt-px dark:text-gray-300">
                                  {item.rating}
                                </p>
                                <Rating
                                  rating={item.rating}
                                  starClass="text-sm"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-[#878787] text-[0.85rem] transition-colors dark:text-gray-500">
                            adipisicing elit. Ullam placeat molestiae vero iusto
                            ut, quos ipsam omnis ipsum dicta nobis nemo
                            quooriosam odio non maxime expedita.
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="font-extrabold flex  text-gray-900 text-xs">
                              COLOR <div>:{productColors}</div>
                            </div>
                            <div>
                              <motion.div
                              style={{
                                border:"3px",
                                borderColor:"#94a3b8"}}
                                className="w-7 h-7 cursor-pointer flex justify-center items-center   rounded-full relative "
                                transition={{ ease: "easeInOut", duration: 3 }}
                                whileHover={{ borderColor: "black" }}
                              >
                                <div className="w-6 h-6 absolute  bg-black rounded-full"></div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Link
                    className="w-32 hover:bg-[#222] duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800 dark:hover:bg-zinc-900"
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
                  className="text-gray-900 transition-colors font-semibold dark:text-gray-200"
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
  );
}
