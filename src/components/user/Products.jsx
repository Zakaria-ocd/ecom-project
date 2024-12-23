"use client";
import Image from "next/image";
import product from "../../public/assets/products/24913.jpg";
import Link from "next/link";
import { motion } from "framer-motion";
export default function Products() {
  return (
    <>
      <div className="w-full p-24 flex justify-between">
        <div className="h-[350px] flex flex-col justify-between w-64">
          <div className="w-full relative h-72 flex flex-col justify-center items-center ">
            <Image
              className=" w-full peer h-full"
              src={product}
              alt="Product Image"
            />
            <div className="absolute opacity-0 hover:opacity-100 hover:translate-y-0  -translate-y-6 peer-hover:opacity-100 peer-hover:ease-in-out peer-hover:duration-500 peer-hover:translate-y-0  flex flex-col h-24 justify-evenly">
              <Link
                className="w-32  overflow-hidden group pt-1.5     h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full h-1/2 group-hover:-translate-y-6 group-hover:duration-500  flex justify-center ">
                    <span>Quiq view</span>
                  </div>
                  <div className="w-full opacity-0    translate-y-0 duration-1000 ease-in-out  h-1/2 group-hover:ease-in-out group-hover:duration-300 group-hover:opacity-100  group-hover:-translate-y-12   text-white ">
                    <div className="flex justify-center   items-center absolute bg-zinc-800/0 group-hover:bg-zinc-800/100 group-hover:duration-700 w-full h-full bg-slate-400">
                      <i className="fa-light fa-eye"></i>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                className="w-32 overflow-hidden  group pt-1.5    h-9  rounded-xl bg-white"
                href={"#"}
              >
                <div className="h-20  w-full  flex flex-col ">
                  <div className="w-full h-1/2 group-hover:-translate-y-6 group-hover:duration-500  flex justify-center ">
                    <span>Quiq Shop</span>
                  </div>
                  <div className="w-full opacity-0 h-1/2 group-hover:ease-in-out group-hover:duration-300 group-hover:opacity-100 duration- group-hover:-translate-y-12  bg-black text-white flex justify-center items-center">
                    <i className="fa-light fa-eye"></i>
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
    </>
  );
}
