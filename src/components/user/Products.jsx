"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FiltersBar from "./FiltersBar";
import Rating from "../Rating";
import CategoriesSide from "./CategoriesSide";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Products({ cartProducts, setCartProducts }) {
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
    colors: [],
    sizes: [],
  });
  const [sortList, setSortList] = useState([]);
  const [pricesList, setPricesList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [resultsList, setResultsList] = useState([]);

  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: "Men Apple Watch",
        price: 120.0,
        image: "/assets/products/men-apple-watch.jpg",
        rating: 4.3,
        colors: [
          { id: 1, name: "Red", colorCode: "#FF0000", selected: true },
          { id: 2, name: "Green", colorCode: "#00FF00", selected: false },
          { id: 3, name: "Blue", colorCode: "#0000FF", selected: false },
        ],
        sizes: [
          { id: 1, name: "M", selected: true },
          { id: 2, name: "L", selected: false },
          { id: 3, name: "XS", selected: false },
        ],
      },
      {
        id: 2,
        name: "Men Black Shoes",
        price: 155.0,
        image: "/assets/products/men-black-shoes.jpg",
        rating: 4.7,
        colors: [
          { id: 4, name: "Gray", colorCode: "#808080", selected: true },
          { id: 9, name: "Cyan", colorCode: "#00FFFF", selected: false },
          { id: 12, name: "Magenta", colorCode: "#FF00FF", selected: false },
        ],
        sizes: [
          { id: 1, name: "M", selected: true },
          { id: 2, name: "L", selected: false },
        ],
      },
      {
        id: 3,
        name: "Men Brown Shoes",
        price: 80.0,
        image: "/assets/products/men-brown-shoes.jpg",
        rating: 3.4,
        colors: [
          { id: 11, name: "Violet", colorCode: "#EE82EE", selected: true },
          { id: 55, name: "Peach", colorCode: "#FFDAB9", selected: false },
          { id: 100, name: "Coral", colorCode: "#FF7F50", selected: false },
        ],
        sizes: [
          { id: 1, name: "M", selected: true },
          { id: 2, name: "L", selected: false },
          { id: 3, name: "2XL", selected: false },
          { id: 4, name: "XS", selected: false },
        ],
      },
      {
        id: 4,
        name: "Men T-Shirts",
        price: 140.0,
        image: "/assets/products/t-shirts.jpg",
        rating: 5,
        colors: [
          { id: 18, name: "Mint", colorCode: "#98FF98", selected: true },
          { id: 17, name: "Crimson", colorCode: "#DC143C", selected: false },
        ],
        sizes: [
          { id: 1, name: "M", selected: true },
          { id: 2, name: "L", selected: false },
          { id: 3, name: "S", selected: false },
          { id: 4, name: "XS", selected: false },
        ],
      },
      {
        id: 5,
        name: "Women Beige Pants",
        price: 185.0,
        image: "/assets/products/women-beige-pants.jpg",
        rating: 3.1,
        colors: [
          { id: 27, name: "Gold", colorCode: "#FFD700", selected: true },
          { id: 29, name: "Silver", colorCode: "#C0C0C0", selected: false },
          { id: 30, name: "Beige", colorCode: "#F5F5DC", selected: false },
        ],
        sizes: [
          { id: 1, name: "M", selected: true },
          { id: 2, name: "XS", selected: false },
        ],
      },
      {
        id: 6,
        name: "Reafonbgates Pants",
        price: 75.0,
        image: "/assets/products/reafonbgates-pants.jpg",
        rating: 4.7,
        colors: [
          { id: 622, name: "Turquoise", colorCode: "#40E0D0", selected: true },
          { id: 697, name: "Indigo", colorCode: "#4B0082", selected: false },
          { id: 498, name: "Violet", colorCode: "#EE82EE", selected: false },
        ],
        sizes: [
          { id: 1, name: "M", selected: true },
          { id: 2, name: "3XL", selected: false },
          { id: 3, name: "XS", selected: false },
        ],
      },
      {
        id: 7,
        name: "Goumbik Brown Shoes",
        price: 135.0,
        image: "/assets/products/goumbik-brown-shoes.jpg",
        rating: 3.9,
        colors: [
          { id: 73, name: "Peach", colorCode: "#FFDAB9", selected: true },
          { id: 816, name: "Coral", colorCode: "#FF7F50", selected: false },
        ],
        sizes: [{ id: 1, name: "XL", selected: true }],
      },
      {
        id: 8,
        name: "Introspective design hat",
        price: 65.0,
        image: "/assets/products/introspective-design-hat.jpg",
        rating: 3.4,
        colors: [
          { id: 800, name: "Blue", colorCode: "#0000FF", selected: true },
          { id: 811, name: "Black", colorCode: "#000000", selected: false },
          { id: 922, name: "White", colorCode: "#FFFFFF", selected: false },
        ],
        sizes: [
          { id: 1, name: "M", selected: true },
          { id: 2, name: "2XL", selected: false },
          { id: 3, name: "XS", selected: false },
        ],
      },
    ]);

    setFilters({
      categories: [
        { id: 1, name: "fashion" },
        { id: 2, name: "electronics" },
        { id: 3, name: "beauty" },
        { id: 4, name: "sport" },
        { id: 5, name: "toys" },
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

    setSortList([
      { id: 1, name: "most popular" },
      { id: 2, name: "newest arrivals" },
      { id: 3, name: "best rating" },
    ]);

    setPricesList([
      { id: 1, name: 50 },
      { id: 2, name: 100 },
      { id: 3, name: 200 },
      { id: 4, name: 300 },
      { id: 5, name: 500 },
    ]);

    setRatingList([
      { id: 1, name: 1 },
      { id: 2, name: 2 },
      { id: 3, name: 3 },
      { id: 4, name: 4 },
      { id: 5, name: 5 },
    ]);

    setResultsList([
      { id: 1, name: 24 },
      { id: 2, name: 48 },
      { id: 3, name: 96 },
    ]);
  }, []);

  const [productsQuantity, setProductsQuantity] = useState(1);
  return (
    <div className="w-full max-w-screen bg-white flex flex-col items-center border-t border-white transition-colors dark:bg-slate-900 dark:border-t-slate-700">
      <div className="w-full z-0 bg-white flex justify-center items-center py-14 transition-colors dark:bg-slate-900">
        <p className="bg-white z-10 text-2xl text-slate-800 font-bold px-4 py-2 transition-colors dark:text-slate-100 dark:bg-slate-900">
          OUR PRODUCTS
        </p>
        <div className="absolute -z-0 w-96 h-0.5 bg-slate-800 transition-colors dark:bg-slate-300" />
      </div>

      <div className="w-full flex md:flex-row flex-col justify-between items-start px-4">
        <CategoriesSide
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        <div className="w-full bg-white flex flex-col gap-4 px-3 transition-colors dark:bg-slate-900">
          <FiltersBar
            pricesList={pricesList}
            ratingList={ratingList}
            sortList={sortList}
            resultsList={resultsList}
            selectedFilters={selectedFilters}
            setSelectedFilters={(value) => setSelectedFilters(value)}
          />

          <div className="flex flex-wrap justify-center sm:justify-around lg:justify-between py-8 sm:py-4 gap-10">
            {products.map((item) => {
              return (
                <div
                  key={item.id}
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
                      } fa-heart text-white absolute name-4 top-3 left-3 opacity-0 cursor-pointer peer-hover:opacity-100 ease-in-out duration-300 peer-hover:translate-x-0 hover:translate-x-0 -translate-x-8 hover:opacity-100 hover:text-rose-500`}
                      onMouseOver={() => setFavoriteTransform(true)}
                      onMouseOut={() => setFavoriteTransform(false)}
                    ></i>
                    <div className="absolute hover:translate-y-0 -translate-y-6 opacity-0 peer-hover:opacity-100 ease-in-out duration-500 peer-hover:translate-y-0 hover:opacity-100 flex flex-col h-24 justify-center gap-4">
                      <Dialog
                        onOpenChange={(open) => {
                          if (!open) {
                            setProductsQuantity(1);
                            setProducts((prevProducts) =>
                              prevProducts.map((product) =>
                                product.id === item.id
                                  ? {
                                      ...product,
                                      colors: product.colors.map((color, i) =>
                                        i === 0
                                          ? { ...color, selected: true }
                                          : { ...color, selected: false }
                                      ),
                                      sizes: product.sizes.map((size, i) =>
                                        i === 0
                                          ? { ...size, selected: true }
                                          : { ...size, selected: false }
                                      ),
                                    }
                                  : product
                              )
                            );
                          }
                        }}
                      >
                        <DialogTrigger>
                          <div className="w-32 hover:hover:bg-zinc-900 duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800 dark:hover:bg-zinc-900">
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
                            <DialogTitle>
                              Product Details: {item.name}
                            </DialogTitle>
                          </VisuallyHidden>
                          <DialogDescription></DialogDescription>
                          <div className="w-full absolute h-full flex">
                            <Image
                              className="w-1/2 h-full"
                              src={item.image}
                              alt={item.name}
                              width={500}
                              height={300}
                            />
                            <div className="p-8 w-1/2 flex flex-col gap-[26px]">
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
                                      starClass="text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="text-[#878787] text-[0.85rem] transition-colors dark:text-gray-500">
                                adipisicing elit. Ullam placeat molestiae vero
                                iusto ut, quos ipsam omnis ipsum dicta nobis
                                nemo quooriosam odio non maxime expedita.
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="font-extrabold flex   text-gray-900 text-xs">
                                  COLOR:
                                  <div className="w-0.5"></div>
                                  {item.colors.map((color) => {
                                    if (color.selected) {
                                      return color.name;
                                    }
                                  })}
                                </div>
                                <div className="flex wf-full gap-2">
                                  {item.colors.map((color, index) => {
                                    return (
                                      <motion.div
                                        key={index}
                                        className="w-8 h-8 cursor-pointer p-0 m-0 flex justify-center items-center rounded-full  "
                                        style={{
                                          borderWidth: "0.4px",
                                          borderStyle: "solid",
                                          borderColor: color.selected
                                            ? "#000"
                                            : "rgb(200, 200, 200)",
                                        }}
                                        whileHover={{
                                          borderColor: "#000",
                                        }}
                                        transition={{
                                          ease: "easeInOut",
                                          duration: 0.3,
                                        }}
                                        onClick={() => {
                                          setProducts((prevProducts) =>
                                            prevProducts.map((product) => {
                                              if (product.id === item.id) {
                                                return {
                                                  ...product,
                                                  colors: product.colors.map(
                                                    (colorItem) => ({
                                                      ...colorItem,
                                                      selected:
                                                        colorItem.id ===
                                                        color.id,
                                                    })
                                                  ),
                                                };
                                              }
                                              return product;
                                            })
                                          );
                                        }}
                                      >
                                        <div
                                          style={{
                                            backgroundColor: color.colorCode,
                                          }}
                                          className="w-7 h-7  rounded-full"
                                        ></div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="font-extrabold flex  text-gray-900 text-xs">
                                  Size:
                                  <div className="w-0.5"></div>
                                  {item.sizes.map((size) => {
                                    if (size.selected) {
                                      return size.name;
                                    }
                                  })}
                                </div>
                                <div className="flex w-full gap-2">
                                  {item.sizes.map((size, index) => {
                                    return (
                                      <motion.div
                                        key={index}
                                        className="w-8 h-8 hover:bg-[rgb(33, 30, 30)] hover:text-white  transition-colors duration-300   cursor-pointer flex justify-center items-center rounded-full  "
                                        style={{
                                          borderWidth: "1px",
                                          borderStyle: "solid",
                                          backgroundColor: size.selected
                                            ? "rgb(33, 30, 30)"
                                            : "white",
                                          color: size.selected
                                            ? "white"
                                            : "rgb(33, 30, 30)",
                                        }}
                                        whileHover={{
                                          backgroundColor: "rgb(33, 30, 30)",
                                          color: "white",
                                        }}
                                        transition={{
                                          ease: "easeInOut",
                                          duration: 2,
                                        }}
                                        onClick={() => {
                                          setProducts((prevProducts) =>
                                            prevProducts.map((product) => {
                                              if (product.id === item.id) {
                                                return {
                                                  ...product,
                                                  sizes: product.sizes.map(
                                                    (sizeItem) => ({
                                                      ...sizeItem,
                                                      selected:
                                                        sizeItem.id === size.id,
                                                    })
                                                  ),
                                                };
                                              }
                                              return product;
                                            })
                                          );
                                        }}
                                      >
                                        <div className="text-[0.9rem]">
                                          {size.name}
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="w-full flex items-center gap-3">
                                {!cartProducts.find((c) => c.id == item.id) ? (
                                  <button
                                    onClick={() => {
                                      // localStorage.setItem(
                                      //   "cartProducts",
                                      //   JSON.stringify(
                                      //     cartProducts?.find(
                                      //       (c) => c.id == item.id
                                      //     )
                                      //       ? cartProducts.map((cart) => {
                                      //           if (cart.id == item.id) {
                                      //             return {
                                      //               ...cart,
                                      //               color: item.colors.find(
                                      //                 (color) => color.selected
                                      //               ),
                                      //               size: item.sizes.find(
                                      //                 (size) => size.selected
                                      //               ),
                                      //               quantity:
                                      //                 Number(productsQuantity),
                                      //             };
                                      //           } else {
                                      //             return {
                                      //               ...cart,
                                      //               color: item.colors.find(
                                      //                 (color) => color.selected
                                      //               ),
                                      //               size: item.sizes.find(
                                      //                 (size) => size.selected
                                      //               ),
                                      //             };
                                      //           }
                                      //         })
                                      //       : [
                                      //           ...cartItems,
                                      //           {
                                      //             ...item,
                                      //             quantity:
                                      //               Number(productsQuantity),
                                      //           },
                                      //         ]
                                      //   )
                                      // );
                                      setCartProducts((prv) => {
                                        if (!prv.find((c) => c.id == item.id)) {
                                          const {
                                            id,
                                            name,
                                            price,
                                            rating,
                                            image,
                                          } = item;
                                          return [
                                            ...prv,
                                            {
                                              id,
                                              name,
                                              price,
                                              rating,
                                              image,
                                              color: item.colors.find(
                                                (color) => color.selected
                                              ),
                                              size: item.sizes.find(
                                                (size) => size.selected
                                              ),
                                              quantity: 1,
                                            },
                                          ];
                                        } else {
                                          return cartProducts;
                                        }
                                      });
                                    }}
                                    className=" rounded-3xl flex justify-center items-center bg-cyan-400 w-36 duration-300 ease-in-out hover:bg-cyan-500 h-9 "
                                  >
                                    <p className="text-white text-[0.9rem]">
                                      ADD TO CART
                                    </p>
                                  </button>
                                ) : (
                                  <button className=" rounded-md flex justify-center items-center bg-rose-300/80 border border-rose-400 w-40 duration-300 ease-in-out hover:bg-cyan-500 h-9 ">
                                    <p className="text-white ">
                                      Remove from cart
                                    </p>
                                  </button>
                                )}
                                <div className="w-9 border-black cursor-pointer group  duration-300 ease-in-out hover:border-cyan-500 h-9 flex justify-center items-center rounded-full border ">
                                  <i className="fa-light duration-300 ease-in-out text-sm fa-heart  group-hover:text-cyan-500"></i>
                                </div>
                              </div>
                              <div className="w-full flex justify-center h-full items-center">
                                <motion.div
                                  whileTap={{
                                    border: "1px solid rgb(6 182 212)",
                                    borderRadius: "6px",
                                  }}
                                  transition={{
                                    ease: "easeInOut",
                                    duration: "0.3",
                                  }}
                                  className="flex w-52 h-10 justify-center hover:text-cyan-500 cursor-pointer group  items-center gap-[6px]"
                                >
                                  <p className="font-bold group-hover:text-cyan-500 text-slate-900 text-[1.2rem]">
                                    View full details
                                  </p>
                                  <i className="fa-solid fa-arrow-right-long w-6 group-hover:translate-x-2 ease-in-out duration-300"></i>{" "}
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger>
                          <div
                            className="w-32 hover:bg-[#222] duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800"
                            href={`/products/${item.id}`}
                          >
                            <div className="h-16 w-full flex flex-col translate-y-px duration-300 ease-in-out hover:-translate-y-[30px]">
                              <div className="w-full h-1/2 flex justify-center items-center text-gray-900 dark:text-gray-200">
                                Quick shop
                              </div>
                              <div className="w-full h-1/2 flex justify-center items-center text-white">
                                <i className="fa-light fa-cart-plus"></i>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="w-[28%]  h-[80%] rounded">
                          <VisuallyHidden>
                            <DialogTitle>
                              Product Details: {item.name}
                            </DialogTitle>
                          </VisuallyHidden>
                          <div className="w-full  flex absolute h-full gap-4 flex-col p-5">
                            <div className="w-full items-start  flex gap-6 justify-start h-[30%] ">
                              <Image
                                className="w-[100px] rounded-sm h-[120px]"
                                src={item.image}
                                alt={item.name}
                                width={500}
                                height={300}
                              />
                              <div className="  justify-between h-[3.25rem] flex flex-col ">
                                <p className="text-gray-900 transition-colors font-extrabold dark:text-gray-200">
                                  {item.name}
                                </p>
                                <p className="text-gray-600 transition-colors dark:text-gray-400">
                                  ${item.price}
                                </p>
                              </div>
                            </div>
                            <div className="w-full flex justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="font-extrabold text-[15px] flex   text-slate-900 ">
                                  COLOR:
                                  <div className="w-0.5"></div>
                                  {item.colors.map((color) => {
                                    if (color.selected) {
                                      return color.name;
                                    }
                                  })}
                                </div>
                                <div className="flex wf-full gap-2">
                                  {item.colors.map((color, index) => {
                                    return (
                                      <motion.div
                                        key={index}
                                        className="w-8 h-8 cursor-pointer p-0 m-0 flex justify-center items-center rounded-full  "
                                        style={{
                                          borderWidth: "0.4px",
                                          borderStyle: "solid",
                                          borderColor: color.selected
                                            ? "#000"
                                            : "rgb(200, 200, 200)",
                                        }}
                                        whileHover={{
                                          borderColor: "#000",
                                        }}
                                        transition={{
                                          ease: "easeInOut",
                                          duration: 0.3,
                                        }}
                                        onClick={() => {
                                          setProducts((prevProducts) =>
                                            prevProducts.map((product) => {
                                              if (product.id === item.id) {
                                                return {
                                                  ...product,
                                                  colors: product.colors.map(
                                                    (colorItem) => ({
                                                      ...colorItem,
                                                      selected:
                                                        colorItem.id ===
                                                        color.id,
                                                    })
                                                  ),
                                                };
                                              }
                                              return product;
                                            })
                                          );
                                        }}
                                      >
                                        <div
                                          style={{
                                            backgroundColor: color.colorCode,
                                          }}
                                          className="w-7 h-7  rounded-full"
                                        ></div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="w-full flex justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="font-extrabold flex text-[15px]  text-gray-900 text-xs">
                                  Size:
                                  <div className="w-0.5"></div>
                                  {item.sizes.map((size) => {
                                    if (size.selected) {
                                      return size.name;
                                    }
                                  })}
                                </div>
                                <div className="flex w-full gap-2">
                                  {item.sizes.map((size, index) => {
                                    return (
                                      <motion.div
                                        key={index}
                                        className="w-8 h-8 hover:bg-[rgb(33, 30, 30)] hover:text-white  transition-colors duration-300   cursor-pointer flex justify-center items-center rounded-full  "
                                        style={{
                                          borderWidth: "1px",
                                          borderStyle: "solid",
                                          backgroundColor: size.selected
                                            ? "rgb(33, 30, 30)"
                                            : "white",
                                          color: size.selected
                                            ? "white"
                                            : "rgb(33, 30, 30)",
                                        }}
                                        whileHover={{
                                          backgroundColor: "rgb(33, 30, 30)",
                                          color: "white",
                                        }}
                                        transition={{
                                          ease: "easeInOut",
                                          duration: 2,
                                        }}
                                        onClick={() => {
                                          setProducts((prevProducts) =>
                                            prevProducts.map((product) => {
                                              if (product.id === item.id) {
                                                return {
                                                  ...product,
                                                  sizes: product.sizes.map(
                                                    (sizeItem) => ({
                                                      ...sizeItem,
                                                      selected:
                                                        sizeItem.id === size.id,
                                                    })
                                                  ),
                                                };
                                              }
                                              return product;
                                            })
                                          );
                                        }}
                                      >
                                        <div className="text-[0.9rem]">
                                          {size.name}
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center gap-4">
                              <div className="border px-3 flex justify-between items-center  rounded-3xl border-black w-32 h-9 ">
                                <i
                                  onClick={() => {
                                    setProductsQuantity((prv) =>
                                      prv > 1 ? prv - 1 : prv
                                    );
                                  }}
                                  className="fa-solid  hover:text-cyan-500 fa-minus cursor-pointer"
                                ></i>
                                <input
                                  className="w-7  text-center outline-none"
                                  value={productsQuantity}
                                  // onChange={(e) => {
                                  //   setProductsQuantity(e.currentTarget.value)
                                  // }}
                                  onChange={() => {}}
                                  type={"text"}
                                />
                                <i
                                  onClick={() => {
                                    setProductsQuantity((prv) =>
                                      prv < 100 ? prv + 1 : prv
                                    );
                                  }}
                                  className="fa-solid fa-plus cursor-pointer  hover:text-cyan-500"
                                ></i>
                              </div>
                              <button className=" rounded-3xl flex justify-center items-center bg-cyan-400 w-72 font-bold duration-300 ease-in-out hover:bg-cyan-500 h-10 ">
                                <p className="text-white text-[0.9rem]">
                                  ADD TO CART
                                </p>
                              </button>
                            </div>
                            <div className="w-full h-full flex justify-center items-center">
                              <div className="w-full flex justify-center h-full items-center">
                                <motion.div
                                  whileTap={{
                                    border: "1px solid rgb(6 182 212)",
                                    borderRadius: "6px",
                                  }}
                                  transition={{
                                    ease: "easeInOut",
                                    duration: "0.3",
                                  }}
                                  className="flex w-48 h-9 justify-center hover:text-cyan-500 cursor-pointer group  items-center gap-[6px]"
                                >
                                  <p className="font-bold group-hover:text-cyan-500 text-slate-900 text-[1.1rem]">
                                    View full details
                                  </p>
                                  <i className="fa-solid fa-arrow-right-long w-6 group-hover:translate-x-2 ease-in-out duration-300"></i>{" "}
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="relative w-full flex flex-col px-1">
                    <Link
                      className="w-fit text-gray-900 transition-colors font-semibold hover:underline dark:text-gray-200"
                      href={`/products/${item.id}`}
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
