"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import DarkModeToggle from "./DarkModeToggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const isLogged = true; // for testing

  return (
    <nav className="w-full">
      <div className="fixed top-0 z-50 w-full h-14 bg-white backdrop-blur-sm flex flex-row justify-between items-center px-3 py-1 border-b border-b-slate-400/30 transition-colors dark:bg-slate-900 dark:border-b-slate-400/30">
        <Link href={"/"}>
          <Logo className="w-9" />
        </Link>

        <div className="h-[38px] flex items-center ring-1 ring-gray-200 rounded-md transition-all focus-within:ring focus-within:ring-sky-200/50 bg-white dark:bg-slate-700 dark:ring-gray-700 dark:ring-1 dark:focus-within:ring-2 dark:focus-within:ring-blue-500/50">
          <input
            className="min-w-40 w-full h-full px-2 rounded-s-md outline-none transition-colors bg-white dark:bg-slate-800 dark:text-slate-100"
            type="text"
            placeholder="Search"
          />
          <button className="h-full bg-slate-100 flex justify-center items-center p-3 rounded-r-md transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/70">
            <i className="fa-regular fa-magnifying-glass text-slate-400 transition-colors dark:text-slate-300"></i>
          </button>
        </div>

        <div className="flex flex-row items-center gap-12">
          <DarkModeToggle />

          {isLogged ? (
            <div className="flex flex-row items-center gap-4">
              <Link className="p-1" href="/user/wishlist" title="Wish list">
                <i className="fa-light fa-heart text-xl text-rose-400"></i>
              </Link>

              <Sheet>
                <SheetTrigger>
                  <div className="p-1"  title="Shopping cart">
                    <i className="fa-light fa-cart-shopping text-xl text-amber-400"></i>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <div className="h-full w-full bg-slate-500">

                  </div>
                </SheetContent>
              </Sheet>

              <button className="p-1" title="Profile">
                <i className="fa-light fa-circle-user text-slate-400 text-2xl"></i>
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
