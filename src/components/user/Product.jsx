"use client";
import Image from "next/image";
import Link from "next/link";
import Rating from "../Rating";
import QuantityCalculator from "../QuantityCalculator";
import { useEffect, useState } from "react";

export default function Product({ productId }) {
  const [product, setProduct] = useState({
    id: 1,
    name: "Apple iMac 24, Apple M1, CPU 8-core, 256GB SSD, 8GB Memory, Mac OS, Silver",
    image: "/assets/cart-products/imac-front-light.svg",
    price: 1249.99,
    rating: 3.6,
    quantity: 1,
    reviews: 345,
    addedToCart: false,
    addedToFavorites: false,
    description: [
      "Studio quality three mic array for crystal clear calls and voice recordings. Six-speaker sound system for a remarkably robust and high-quality audio experience. Up to 256GB of ultrafast SSD storage.",
      "Two Thunderbolt USB 4 ports and up to two USB 3 ports. Ultrafast Wi-Fi 6 and Bluetooth 5.0 wireless. Color matched Magic Mouse with Magic Keyboard or Magic Keyboard with Touch ID.",
    ],
  });

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedFilters, setSelectedFilters] = useState({
    color: "",
    size: "",
  });

  function handleQuantityChange(_, newQuantity) {
    setProduct({ ...product, quantity: newQuantity });
  }

  useEffect(() => {
    setColors(["green", "silver", "gold", "black"]);

    setSizes(["sm", "md", "lg", "xl"]);
  }, []);

  return (
    <section className="h-full mt-14 flex items-center py-8 border-b bg-white md:py-16 transition-colors dark:bg-gray-900 dark:border-b-slate-700 antialiased">
      <div className="max-w-screen-xl flex items-center px-8 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="relative shrink-0 max-w-md lg:max-w-lg mx-auto">
            <Image
              width={500}
              height={300}
              className="w-full sticky top-24"
              src={product.image}
              alt="product image"
            />
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <div className="w-fit bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 mb-3 rounded-md transition-colors dark:bg-emerald-900 dark:text-emerald-300">
              In stock
            </div>

            <h1 className="text-xl font-semibold text-slate-900 transition-colors sm:text-2xl dark:text-white">
              {product.name}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Rating rating={product.rating} />
                <p className="text-sm font-medium leading-none text-slate-500 transition-colors dark:text-slate-400">
                  ({product.rating})
                </p>
                <Link
                  href="#"
                  className="text-sm font-medium leading-none text-blue-600 underline transition-colors hover:no-underline dark:text-blue-500"
                >
                  {product.reviews} Reviews
                </Link>
              </div>
            </div>

            <p className="mt-7 text-2xl font-extrabold text-slate-900 transition-colors sm:text-3xl dark:text-white">
              ${product.price}
            </p>

            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:flex-wrap">
              {product.addedToCart ? (
                <button
                  className="w-full sm:w-fit h-10 text-blue-800 mt-4 sm:mt-0 bg-blue-100 hover:bg-blue-200 font-medium rounded-lg text-sm px-4 border border-blue-300 flex items-center justify-center gap-2 transition-colors dark:bg-blue-700/10 dark:text-blue-500 dark:border-blue-500/60 dark:hover:bg-blue-700/20"
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      addedToCart: !prev.addedToCart,
                    }))
                  }
                >
                  <i className="fa-regular fa-check"></i>
                  Added to cart
                </button>
              ) : (
                <button
                  className="w-full sm:w-fit h-10 text-white mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 flex items-center justify-center gap-2"
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      addedToCart: !prev.addedToCart,
                    }))
                  }
                >
                  <i className="fa-regular fa-cart-plus"></i>
                  Add to cart
                </button>
              )}

              {product.addedToFavorites ? (
                <button
                  className="w-full sm:w-fit h-10 flex items-center justify-center gap-2 px-4 mt-4 sm:mt-0 text-sm font-medium text-rose-600 transition-colors bg-rose-100 rounded-lg border border-rose-300 hover:bg-rose-200 dark:bg-rose-700/10 dark:text-rose-500 dark:border-rose-500/60 dark:hover:bg-rose-700/20"
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      addedToFavorites: !prev.addedToFavorites,
                    }))
                  }
                >
                  <i className="fa-regular fa-check"></i>
                  Added to favorites
                </button>
              ) : (
                <button
                  className="w-full sm:w-fit h-10 flex items-center justify-center gap-2 px-4 mt-4 sm:mt-0 text-sm font-medium text-rose-500 transition-colors bg-white rounded-lg border border-rose-500 hover:bg-rose-100 dark:bg-gray-900 dark:text-rose-500 dark:border-rose-500/60 dark:hover:bg-rose-700/20"
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      addedToFavorites: !prev.addedToFavorites,
                    }))
                  }
                >
                  <i className="fa-regular fa-heart"></i>
                  Add to favorites
                </button>
              )}

              {product.addedToCart && (
                <div className="w-full sm:w-fit h-10 mt-4 sm:mt-0 flex justify-center items-center gap-3 px-4 bg-slate-50 border border-slate-300 rounded-lg transition-colors dark:bg-gray-800/70 dark:border-slate-600">
                  <p className="text-slate-800 text-sm font-medium transition-colors dark:text-slate-200">
                    Quantity
                  </p>
                  <QuantityCalculator
                    key={product.id}
                    itemId={product.id}
                    itemQuantity={product.quantity}
                    onQuantityChange={handleQuantityChange}
                  />
                </div>
              )}
            </div>

            <hr className="my-6 md:my-8 border-slate-200 transition-colors dark:border-slate-600" />

            <div className="flex flex-col sm:flex-row lg:justify-between gap-5 sm:gap-14 lg:gap-0">
              <div className="flex flex-col gap-2">
                <p className="text-slate-800 font-semibold transition-colors dark:text-slate-100">Color</p>
                <div className="flex items-center gap-2">
                  {colors.map((item, index) => (
                    <button
                      key={index}
                      className={`${
                        selectedFilters.color === item
                          ? "bg-blue-200 text-blue-800 border-blue-400 hover:bg-blue-200/70 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-800/95"
                          : "bg-slate-50 text-slate-500 border-slate-300 hover:bg-slate-200/70 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-600/95"
                      } text-sm font-medium capitalize rounded-lg px-2 py-1 border transition-colors`}
                      onClick={() =>
                        setSelectedFilters((prev) => ({ ...prev, color: item }))
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-slate-800 font-semibold transition-colors dark:text-slate-100">Size</p>
                <div className="flex items-center gap-2">
                  {sizes.map((item, index) => (
                    <button
                      key={index}
                      className={`${
                        selectedFilters.size === item
                        ? "bg-blue-200 text-blue-800 border-blue-400 hover:bg-blue-200/70 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-800/95"
                        : "bg-slate-50 text-slate-500 border-slate-300 hover:bg-slate-200/70 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-600/95"
                      } text-sm font-medium uppercase rounded-lg px-2 py-1 border transition-colors`}
                      onClick={() =>
                        setSelectedFilters((prev) => ({ ...prev, size: item }))
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr className="my-6 md:my-8 border-slate-200 transition-colors dark:border-slate-600" />

            {product.description.map((item, index) => {
              return (
                <p
                  key={index}
                  className="mb-6 text-slate-500 dark:text-slate-400"
                >
                  {item}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
