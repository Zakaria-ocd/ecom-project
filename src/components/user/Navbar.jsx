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
import { LucideSunMedium } from "lucide-react";
import { FaBrush, FaMoon, FaUserPlus } from "react-icons/fa";
import {
  FaArrowRightToBracket,
  FaGear,
  FaMoneyCheckDollar,
  FaUserGear,
} from "react-icons/fa6";

export default function Navbar({ cartProducts, setCartProducts }) {
  const isLogged = true; // for testing
  const [selectedTheme, setSelectedTheme] = useState("");
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate total price whenever cart changes
    const total = cartProducts?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    setTotalPrice(total);
  }, [cartProducts]);

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

    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSystemIsDark(isDark);
  }, []);

  const removeFromCart = (productId) => {
    setCartProducts(prev => prev.filter(item => item.id !== productId));
  };

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

          <Sheet>
            <SheetTrigger>
              <div className="p-1 relative" title="Shopping cart">
                <i className="fa-light fa-cart-shopping text-xl text-amber-400"></i>
                {cartProducts?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartProducts.length}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="p-0">
              <div className="h-full w-full flex flex-col">
                <h1 className="text-xl shadow-lg h-16 flex items-center font-bold pl-4 text-slate-800 dark:text-slate-200">
                  SHOPPING CART
                </h1>

                <ScrollArea className="flex-1 w-full px-4">
                  {cartProducts?.length > 0 ? (
                    cartProducts.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 border-b border-gray-200 dark:border-gray-700 flex gap-4"
                      >
                        <div className="w-24 h-24 relative flex-shrink-0">
                          <Image
                            className="rounded-md object-cover"
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 96px) 100vw, 96px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {item.name}
                          </h3>
                          {item.color && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Color: {item.color.name}
                            </p>
                          )}
                          {item.size && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Size: {item.size.name}
                            </p>
                          )}
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              ${item.price} × {item.quantity}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                    </div>
                  )}
                </ScrollArea>

                {cartProducts?.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base font-medium text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

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
