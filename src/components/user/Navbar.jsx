"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, LucideSunMedium } from "lucide-react";
import { FaBrush, FaMoon, FaUserPlus } from "react-icons/fa";
import {
  FaArrowRightToBracket,
  FaGear,
  FaMoneyCheckDollar,
  FaUserGear,
} from "react-icons/fa6";

export default function Navbar({ cartProducts }) {
  const isLogged = true; // for testing
  const [selectedTheme, setSelectedTheme] = useState("");
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  function applyTheme(theme) {
    document.documentElement.classList.remove("dark");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    }
  }

  function changeTheme(theme) {
    if (typeof window === "undefined") return;
    if (theme === "light") {
      localStorage.setItem("theme", "light");
    } else if (theme === "dark") {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
    }
    setSelectedTheme(theme);
    applyTheme(theme);
  }

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setSelectedTheme(stored ?? "system");
    applyTheme(stored ?? "system");
    setMounted(true);

    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSystemIsDark(isDark);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full h-14 bg-white backdrop-blur-sm flex flex-row justify-between items-center px-3 py-1 border-b border-b-slate-400/30 transition-colors dark:bg-slate-900 dark:border-b-slate-400/30">
      <Link href={"/"}>
        <Logo className="w-8" fullLogo={true} />
      </Link>

      <div className="h-[38px] flex items-center ring-1 ring-gray-200 rounded-md transition-all focus-within:ring focus-within:ring-sky-200/50 bg-white dark:bg-slate-700 dark:ring-gray-700 dark:ring-1 dark:focus-within:ring-2 dark:focus-within:ring-blue-500/50">
        <input
          className="min-w-40 w-full h-full px-2 rounded-s-md outline-none transition-colors bg-white dark:bg-slate-800 dark:text-slate-100"
          type="text"
          placeholder="Search"
        />
      </div>

      <div className="flex flex-row items-center gap-12">
        <div className="flex flex-row items-center gap-4">
          <Link className="p-1" href="/user/wishlist" title="Wish list">
            <i className="fa-light fa-heart text-xl text-rose-400"></i>
          </Link>

          {mounted && (
            <Sheet>
              <SheetTrigger>
                <div className="p-1" title="Shopping cart">
                  <i className="fa-light fa-cart-shopping text-xl text-amber-400"></i>
                </div>
              </SheetTrigger>
              <SheetContent className="p-0 ">
                <SheetDescription></SheetDescription>
                <div className="h-full  w-full">
                  <h1 className="text-xl shadow-lg h-16 flex items-center font-bold pl-4 text-slate-800">
                    SHOPPING CART
                  </h1>

                  <ScrollArea className="h-[320px] rounded-none w-full px-4">
                    {cartProducts?.length > 0 &&
                      cartProducts.map((item) => (
                        <>
                          <div
                            key={item.id}
                            className="h-56 pt-4 border-b-2 w-full"
                          >
                            <Image
                              className="w-[40%] rounded-md h-[180px]"
                              src={item.image}
                              alt={item.name}
                              width={500}
                              height={300}
                            />
                          </div>
                          <div></div>
                        </>
                      ))}
                  </ScrollArea>
                  <div className=" ">smdlsmdl</div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1" title="Profile">
                <i className="fa-light fa-circle-user text-slate-400 text-2xl"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40 mr-4">
              <DropdownMenuLabel className="text-slate-700 dark:text-slate-200">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="text-slate-800 dark:text-slate-300">
                {isLogged ? (
                  <>
                    <DropdownMenuItem>
                      <FaUserGear className="text-slate-400 dark:text-slate-500" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FaMoneyCheckDollar className="text-slate-400 dark:text-slate-500" />
                      Billing
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <FaArrowRightToBracket className="text-slate-400 dark:text-slate-500" />
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FaUserPlus className="text-slate-400 dark:text-slate-500" />
                      Sign up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-slate-800 dark:text-slate-300">
                  <FaBrush className="text-slate-400 dark:text-slate-500" />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuItem className="text-slate-800 dark:text-slate-300">
                  <FaGear className="text-slate-400 dark:text-slate-500" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="text-slate-800 dark:text-slate-300">
                    <DropdownMenuItem
                      onClick={() => changeTheme("dark")}
                      className={`${
                        selectedTheme === "dark" &&
                        "bg-emerald-100 dark:bg-emerald-800/60"
                      } flex justify-between items-center`}
                    >
                      Dark
                      {selectedTheme === "dark" && <FaMoon />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeTheme("light")}
                      className={`${
                        selectedTheme === "light" &&
                        "bg-emerald-100 dark:bg-emerald-800/60"
                      } flex justify-between items-center`}
                    >
                      Light
                      {selectedTheme === "light" && <LucideSunMedium />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeTheme("system")}
                      className={`${
                        selectedTheme === "system" &&
                        "bg-emerald-100 dark:bg-emerald-800/60"
                      } flex justify-between items-center`}
                    >
                      System
                      {selectedTheme === "system" &&
                        mounted &&
                        (systemIsDark ? <FaMoon /> : <LucideSunMedium />)}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
