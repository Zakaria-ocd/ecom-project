"use client";
import Image from "next/image";
import appleWatch from "@/../public/assets/products/men-apple-watch.jpg";
import blackShoes from "@/../public/assets/products/men-black-shoes.jpg"
import brownShoes from "@/../public/assets/products/men-brown-shoes.jpg"
import tShirts from "@/../public/assets/products/t-shirts.jpg"
import beigePants from "@/../public/assets/products/women-beige-pants.jpg"
import Link from "next/link";
import { motion } from "framer-motion";
export default function Products() {
  return (
    <>
      <div className="w-full flex flex-col items-center ">
        <div className="flex justify-between items-center w-96">
          <div className="h-[2px] bg-black w-16 "></div>
          <p className="text-2xl font-semibold ">OUR PRODUCTS</p>
          <div className="h-[2px] bg-black w-16 "></div>
        </div>
        <div className="w-full  justify-evenly p-16 flex-wrap gap-y-12   flex ">
          <div className="h-[350px] flex flex-col justify-between w-64">
            <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
              <Image
                className=" w-full peer h-full"
                src={appleWatch}
                alt="Product Image"
              />
              <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
                <i className="fa-light fa-heart"></i>{" "}
              </div>
              <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq view</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-light fa-eye"></i>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq Shop</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-regular text-[18px] fa-cart-shopping"></i>{" "}
                      </div>
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
          <div className="h-[350px] flex flex-col justify-between w-64">
            <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
              <Image
                className=" w-full peer h-full"
                src={tShirts}
                alt="Product Image"
              />
              <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
                <i className="fa-light fa-heart"></i>{" "}
              </div>
              <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq view</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-light fa-eye"></i>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq Shop</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-regular text-[18px] fa-cart-shopping"></i>{" "}
                      </div>
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
          <div className="h-[350px] flex flex-col justify-between w-64">
            <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
              <Image
                className=" w-full peer h-full"
                src={blackShoes}
                alt="Product Image"
              />
              <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
                <i className="fa-light fa-heart"></i>{" "}
              </div>
              <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq view</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-light fa-eye"></i>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq Shop</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-regular text-[18px] fa-cart-shopping"></i>{" "}
                      </div>
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
          <div className="h-[350px] flex flex-col justify-between w-64">
            <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
              <Image
                className=" w-full peer h-full"
                src={brownShoes}
                alt="Product Image"
              />
              <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
                <i className="fa-light fa-heart"></i>{" "}
              </div>
              <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq view</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-light fa-eye"></i>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq Shop</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-regular text-[18px] fa-cart-shopping"></i>{" "}
                      </div>
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
          <div className="h-[350px] flex flex-col justify-between w-64">
            <div className="w-full  relative h-72 flex flex-col justify-center items-center ">
              <Image
                className=" w-full peer h-full"
                src={beigePants}
                alt="Product Image"
              />
              <div className="absolute top-2  left-3 text-white opacity-0 hover:opacity-100 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500">
                <i className="fa-light fa-heart"></i>{" "}
              </div>
              <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out ease-in-out peer-hover:duration-500 duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq view</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-light fa-eye"></i>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                  href={"#"}
                >
                  <div className="h-20  w-full  flex flex-col ">
                    <div className="w-full  h-1/2 group-hover:-translate-y-6 group-hover:duration-500 duration-300 ease-in-out group-hover:ease-in-out  flex justify-center ">
                      <span>Quiq Shop</span>
                    </div>
                    <div className="w-full opacity-0      translate-y-0   h-1/2  group-hover:duration-300 duration-500 ease-in-out group-hover:ease-in-out group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                      <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 group-hover:ease-in-out duration-700 ease-in-out w-full h-full bg-slate-400">
                        <i className="fa-regular text-[18px] fa-cart-shopping"></i>{" "}
                      </div>
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
        </div>
      </div>
    </>
  );
}
