"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LucideSunMedium } from "lucide-react";
import { FaBrush, FaMoon } from "react-icons/fa";
import {
  FaGear,
  FaMoneyCheckDollar,
  FaUserGear,
  FaRightFromBracket,
} from "react-icons/fa6";
import { useSelector } from "react-redux";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { DialogTitle } from "../ui/dialog";
import ProfileImage from "./ProfileImage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "../ui/button";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { cart, totalPrice, removeItem, refreshCart, loading } = useCart();

  const [selectedTheme, setSelectedTheme] = useState("");
  const [systemIsDark, setSystemIsDark] = useState(false);
  const user = useSelector((state) => state.userReducer);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

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
    } else if (theme === "system") {
      localStorage.setItem("theme", "system");
    }
    setSelectedTheme(theme);
    applyTheme(theme);
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    setSelectedTheme(storedTheme);
    applyTheme(storedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mediaQuery.matches);

    const handleChange = (e) => {
      setSystemIsDark(e.matches);
      if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleRemoveFromCart = (cartItemId) => {
    removeItem(cartItemId);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    return user.username.charAt(0).toUpperCase();
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
          <TooltipProvider>
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Link
                  href="/user/login"
                  className="px-3 py-1.5 text-sm font-medium transition-colors text-blue-600 border border-blue-600 rounded hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
                >
                  Login
                </Link>
                <Link
                  href="/user/register"
                  className="px-3 py-1.5 mr-12 text-sm font-medium transition-colors text-white bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Sign Up
                </Link>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() =>
                        changeTheme(selectedTheme === "dark" ? "light" : "dark")
                      }
                      variant="ghost"
                      className="size-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {selectedTheme === "dark" ||
                      (selectedTheme === "system" && systemIsDark) ? (
                        <LucideSunMedium className="h-4 w-4 text-amber-300" />
                      ) : (
                        <FaMoon className="h-4 w-4 text-slate-700 dark:text-slate-400" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link className="p-1" href="/user/wishlist">
                  <i className="fa-light fa-heart text-xl text-rose-400"></i>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wishlist</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <Sheet>
                <TooltipTrigger asChild>
                  <SheetTrigger className="p-1 relative">
                    <i className="fa-light fa-cart-shopping text-xl text-amber-400"></i>
                    {cart?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </SheetTrigger>
                </TooltipTrigger>

                <SheetContent className="p-0">
                  <div className="h-full w-full flex flex-col">
                    <DialogTitle className="text-xl shadow-lg h-16 flex items-center font-bold pl-4 text-slate-800 dark:text-slate-200">
                      SHOPPING CART
                    </DialogTitle>

                    <ScrollArea className="flex-1 w-full px-4">
                      {loading ? (
                        <div className="py-10">
                          <LoadingSpinner text="Loading your cart..." />
                        </div>
                      ) : cart?.length > 0 ? (
                        cart.map((item) => (
                          <div
                            key={`${item.productId}-${
                              item.choice_value_id || "no-choice"
                            }`}
                            className="py-4 border-b border-gray-200 dark:border-gray-700 flex gap-4"
                          >
                            <div className="w-24 h-24 relative flex-shrink-0">
                              <Image
                                className="rounded-md object-cover"
                                src={
                                  item.image ||
                                  `http://localhost:8000/api/productImage/${
                                    item.product_id || item.productId
                                  }`
                                }
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
                                  ${item.price} x {item.quantity}
                                </p>
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
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
                          <p className="text-gray-500 dark:text-gray-400">
                            Your cart is empty
                          </p>
                        </div>
                      )}
                    </ScrollArea>

                    {cart?.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                            Total
                          </span>
                          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <Link
                          href={
                            isAuthenticated
                              ? "/user/checkout"
                              : "/user/login?redirect=checkout"
                          }
                        >
                          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            {isAuthenticated ? "Checkout" : "Login to Checkout"}
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <TooltipContent>
                <p>Shopping Cart</p>
              </TooltipContent>
            </Tooltip>
            {isAuthenticated && (
              <Tooltip>
                <DropdownMenu>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1">
                        <ProfileImage
                          imageUrl={
                            user?.image
                              ? `http://localhost:8000/api/users/image/${user.image}`
                              : null
                          }
                          previewUrl={null}
                          username={user?.username}
                          onImageChange={() => {}}
                        />
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile</p>
                  </TooltipContent>
                  <DropdownMenuContent className="min-w-40 mr-4">
                    <DropdownMenuLabel className="text-slate-700 dark:text-slate-200">
                      {`Welcome, ${user.username}`}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="text-slate-800 dark:text-slate-300">
                      <DropdownMenuItem asChild>
                        <Link href="/user/profile">
                          <FaUserGear className="mr-2 text-slate-400 dark:text-slate-500" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/user/orders">
                          <FaMoneyCheckDollar className="mr-2 text-slate-400 dark:text-slate-500" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        <FaRightFromBracket className="mr-2 text-slate-400 dark:text-slate-500" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-slate-800 dark:text-slate-300">
                        <FaBrush className="mr-2 text-slate-400 dark:text-slate-500" />
                        Theme
                      </DropdownMenuSubTrigger>
                      <DropdownMenuItem
                        asChild
                        className="text-slate-800 dark:text-slate-300"
                      >
                        <Link href="/user/settings">
                          <FaGear className="mr-2 text-slate-400 dark:text-slate-500" />
                          Settings
                        </Link>
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
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
}
