"use client";
import Image from "next/image";
import appleWatch from "@/../public/assets/products/men-apple-watch.jpg";
import blackShoes from "@/../public/assets/products/men-black-shoes.jpg";
import brownShoes from "@/../public/assets/products/men-brown-shoes.jpg";
import tShirts from "@/../public/assets/products/t-shirts.jpg";
import beigePants from "@/../public/assets/products/women-beige-pants.jpg";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [favouriteTransform, setFavouriteTransform] = useState(false);

  useEffect(() => {
    setProducts([
      {
        productId: 1,
        name: "Men Apple Watch",
        price: 120.0,
        image: appleWatch,
      },
      {
        productId: 2,
        name: "Men Black Shoes",
        price: 120.0,
        image: blackShoes,
      },
      {
        productId: 3,
        name: "Men Brown Shoes",
        price: 120.0,
        image: brownShoes,
      },
      {
        productId: 4,
        name: "Men T-Shirts",
        price: 120.0,
        image: tShirts,
      },
      {
        productId: 5,
        name: "Women Beige Pants",
        price: 120.0,
        image: beigePants,
      },
    ]);
  }, []);

  return (
    <div className="w-full max-w-screen bg-slate-50 flex flex-col gap-14 items-center py-14">
      <div className="flex justify-between items-center w-96">
        <div className="h-0.5 bg-slate-800 w-16" />
        <p className="text-2xl text-slate-800 font-bold">OUR PRODUCTS</p>
        <div className="h-0.5 bg-slate-800 w-16" />
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-10 gap-10">
        {products.map((item) => {
          return (
            <div
              key={item.productId}
              className="w-64 sm:w-52 flex flex-col gap-3 place-self-center"
            >
              <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center">
                <Image
                  className=" w-full h-full peer shadow-lg rounded-sm"
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
                  <Link
                    className="w-32 hover:bg-zinc-800/90 backdrop-blur-sm duration-500 overflow-hidden h-9 rounded-xl bg-white/90"
                    href={`/products/${item.productId.toString()}`}
                  >
                    <div className="h-16 w-full flex flex-col translate-y-0 duration-300 ease-in-out hover:-translate-y-[30px]">
                      <div className="w-full h-1/2 flex justify-center items-center text-slate-900">
                        Quick view
                      </div>
                      <div className="w-full h-1/2 flex justify-center items-center text-white">
                        <i className="fa-light fa-eye"></i>
                      </div>
                    </div>
                  </Link>
                  <Link
                    className="w-32 hover:bg-zinc-800/90 backdrop-blur-sm duration-500 overflow-hidden h-9 rounded-xl bg-white/90"
                    href={`/products/${item.productId.toString()}`}
                  >
                    <div className="h-16 w-full flex flex-col translate-y-0 duration-300 ease-in-out hover:-translate-y-[30px]">
                      <div className="w-full h-1/2 flex justify-center items-center text-slate-900">
                        Quick shop
                      </div>
                      <div className="w-full h-1/2 flex justify-center items-center text-white">
                        <i className="fa-light fa-cart-shopping"></i>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col px-1">
                <Link
                  className="text-slate-900 font-semibold"
                  href={`/products/${item.productId.toString()}`}
                >
                  {item.name}
                </Link>
                <p className="text-gray-500">${item.price}</p>
              </div>
            </div>
          );
        })}
        {/* <div className="h-[350px] flex flex-col justify-between">
          <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
            <Image
              className=" w-full peer h-full"
              src={tShirts}
              alt="Product Image"
            />
            <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
              <i className="fa-light fa-heart"></i>
            </div>
            <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick view</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-eye"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick shop</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-regular text-[18px] fa-cart-shopping"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col ">
            <div>
              <a className="font-semibold" href="#">
                Men Apple Watch
              </a>
            </div>
            <p className="text-gray-600/80">$120.00</p>
          </div>
        </div>
        <div className="h-[350px] flex flex-col justify-between">
          <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
            <Image
              className=" w-full peer h-full"
              src={blackShoes}
              alt="Product Image"
            />
            <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
              <i className="fa-light fa-heart"></i>
            </div>
            <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick view</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-eye"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick shop</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-regular text-[18px] fa-cart-shopping"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col ">
            <div>
              <a className="font-semibold" href="#">
                Men Apple Watch
              </a>
            </div>
            <p className="text-gray-600/80">$120.00</p>
          </div>
        </div>
        <div className="h-[350px] flex flex-col justify-between">
          <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
            <Image
              className=" w-full peer h-full"
              src={brownShoes}
              alt="Product Image"
            />
            <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
              <i className="fa-light fa-heart"></i>
            </div>
            <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick view</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-eye"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick shop</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-cart-shopping"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col ">
            <div>
              <a className="font-semibold" href="#">
                Men Apple Watch
              </a>
            </div>
            <p className="text-gray-600/80">$120.00</p>
          </div>
        </div>
        <div className="h-[350px] flex flex-col justify-between">
          <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
            <Image
              className=" w-full peer h-full"
              src={beigePants}
              alt="Product Image"
            />
            <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
              <i className="fa-light fa-heart"></i>
            </div>
            <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick view</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-eye"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick shop</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-cart-shopping"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col ">
            <div>
              <a className="font-semibold" href="#">
                Men Apple Watch
              </a>
            </div>
            <p className="text-gray-600/80">$120.00</p>
          </div>
        </div>
        <div className="h-[350px] flex flex-col justify-between">
          <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
            <Image
              className=" w-full peer h-full"
              src={beigePants}
              alt="Product Image"
            />
            <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
              <i className="fa-light fa-heart"></i>
            </div>
            <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick view</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-eye"></i>
                  </div>
                </div>
              </Link>
              <Link
                className="w-32 hover:bg-zinc-800/100 duration-500  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full  h-1/2 group-hover:-translate-y-6 duration-500  ease-in-out   flex justify-center ">
                    <span>Quick shop</span>
                  </div>
                  <div className="w-full   flex justify-center items-center    translate-y-0   h-1/2  duration-300 ease-in-out  group-hover:text-white text-black  group-hover:-translate-y-12   ">
                    <i className="fa-light fa-cart-shopping"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="flex flex-col ">
            <div>
              <a className="font-semibold" href="#">
                Men Apple Watch
              </a>
            </div>
            <p className="text-gray-600/80">$120.00</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
