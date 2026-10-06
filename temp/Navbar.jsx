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
import {
  BadgeDollarSign,
  Heart,
  LogOut,
  LucideSunMedium,
  Menu,
  Moon,
  Paintbrush,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  UserRoundCog,
  X,
} from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
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

  const toggleSearchBar = () => {
    setSearchBarOpen(!searchBarOpen);
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
    setSearchBarOpen(false);
  };

  const ShoppingCartContent = () => (
    <div className="h-full w-full flex flex-col">
      <DialogTitle className="text-xl shadow-lg h-16 flex items-center font-bold pl-4 text-slate-800 dark:text-slate-200">
        Shopping Cart
      </DialogTitle>

      <ScrollArea className="flex-1 w-full px-4">
        {loading ? (
          <div className="py-10">
            <LoadingSpinner text="Loading your cart..." />
          </div>
        ) : cart?.length > 0 ? (
          cart.map((item) => (
            <div
              key={`${item.productId}-${item.choice_value_id || "no-choice"}`}
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
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
            Your cart is empty
          </p>
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
            onClick={handleNavigation}
            className="w-full"
          >
            <button className="w-full bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors">
              {isAuthenticated ? "Checkout" : "Login to Checkout"}
            </button>
          </Link>
        </div>
      )}
    </div>
  );

  const ThemeToggleButton = () => (
    <Button
      onClick={() => changeTheme(selectedTheme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon"
      className="hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {selectedTheme === "dark" ||
      (selectedTheme === "system" && systemIsDark) ? (
        <LucideSunMedium className="h-4 w-4 text-amber-300" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-400" />
      )}
    </Button>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white px-3 sm:px-4 border-b border-b-slate-400/30 transition-colors dark:bg-slate-900 dark:border-b-slate-400/30">
      <div className="flex justify-between items-center h-14">
        <div className="flex items-center">
          <Link href={"/"} onClick={handleNavigation}>
            <Logo className="w-8" fullLogo={true} />
          </Link>
        </div>

        <div className="hidden md:flex items-center">
          <div className="h-[38px] w-60 md:w-72 lg:w-80 relative flex items-center ring-1 ring-gray-200 rounded-md transition-all focus-within:ring focus-within:ring-sky-200/50 bg-white dark:bg-slate-700 dark:ring-gray-700 dark:ring-1 dark:focus-within:ring-2 dark:focus-within:ring-blue-500/50">
            <input
              className="w-full h-full px-2 rounded-s-md outline-none transition-colors bg-white dark:bg-slate-800 dark:text-slate-100"
              type="text"
              placeholder="Search"
            />
            <button className="h-full bg-slate-100 flex justify-center items-center p-3 rounded-r-md transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/70">
              <Search className="h-4 w-4 text-slate-400 transition-colors dark:text-slate-300" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <TooltipProvider>
            {!isAuthenticated && (
              <>
                <Link
                  href="/user/login"
                  className="px-3 py-1.5 text-sm font-medium transition-colors text-cyan-600 border border-cyan-600 rounded hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20"
                >
                  Login
                </Link>
                <Link
                  href="/user/register"
                  className="px-3 py-1.5 mr-2 text-sm font-medium transition-colors text-white bg-cyan-600 rounded hover:bg-cyan-700 dark:bg-blue-500 dark:hover:bg-cyan-600"
                >
                  Sign Up
                </Link>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ThemeToggleButton />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/user/wishlist" onClick={handleNavigation}>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5 text-rose-400" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wishlist</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <Sheet>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-5 w-5 text-amber-400" />
                      {cart?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>

                <SheetContent className="p-0 dark:border-slate-700">
                  <ShoppingCartContent />
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-transparent rounded-full"
                      >
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
                      </Button>
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
                        <Link href="/user/profile" onClick={handleNavigation}>
                          <UserRoundCog className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/user/orders" onClick={handleNavigation}>
                          <BadgeDollarSign className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-slate-800 dark:text-slate-300">
                        <Paintbrush className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        Theme
                      </DropdownMenuSubTrigger>
                      <DropdownMenuItem
                        asChild
                        className="text-slate-800 dark:text-slate-300"
                      >
                        <Link href="/user/settings" onClick={handleNavigation}>
                          <Settings className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
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
                            {selectedTheme === "dark" && <Moon />}
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
                              (systemIsDark ? <Moon /> : <LucideSunMedium />)}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearchBar}
            aria-label="Search"
            className="text-slate-600 dark:text-slate-300"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/user/wishlist" onClick={handleNavigation}>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5 text-rose-400" />
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 text-amber-400" />
                {cart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent className="p-0 dark:border-slate-700">
              <ShoppingCartContent />
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            className="text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {searchBarOpen && (
        <div className="md:hidden px-2 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="h-[38px] flex items-center ring-1 ring-gray-200 rounded-md transition-all focus-within:ring focus-within:ring-sky-200/50 bg-white dark:bg-slate-700 dark:ring-gray-700 dark:ring-1 dark:focus-within:ring-2 dark:focus-within:ring-blue-500/50">
            <input
              className="w-full h-full px-2 rounded-s-md outline-none transition-colors bg-white dark:bg-slate-800 dark:text-slate-100"
              type="text"
              placeholder="Search"
            />
            <button className="h-full bg-slate-100 flex justify-center items-center p-3 rounded-r-md transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/70">
              <Search className="h-4 w-4 text-slate-400 transition-colors dark:text-slate-300" />
            </button>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="md:hidden px-2 py-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {!isAuthenticated ? (
            <>
              <Link
                href="/user/login"
                onClick={handleNavigation}
                className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                href="/user/register"
                onClick={handleNavigation}
                className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Sign Up
              </Link>

              <div className="flex items-center justify-between px-3 py-2 mt-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                <span>Theme</span>
                <ThemeToggleButton />
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-2 flex items-center">
                <ProfileImage
                  imageUrl={
                    user?.image
                      ? `http://localhost:8000/api/users/image/${user.image}`
                      : null
                  }
                  previewUrl={null}
                  username={user?.username}
                  onImageChange={() => {}}
                  className="w-8 h-8"
                />
                <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">
                  {user.username}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/user/profile"
                  onClick={handleNavigation}
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <UserRoundCog className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  Profile
                </Link>
                <Link
                  href="/user/orders"
                  onClick={handleNavigation}
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <BadgeDollarSign className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  Orders
                </Link>
                <Link
                  href="/user/settings"
                  onClick={handleNavigation}
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Settings className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  Settings
                </Link>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <div className="flex items-center">
                    <Paintbrush className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    Theme
                  </div>
                  <div>
                    <ThemeToggleButton />
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    logout();
                    handleNavigation();
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
