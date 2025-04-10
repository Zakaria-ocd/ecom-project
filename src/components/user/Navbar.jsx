"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Sheet, SheetContent, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
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

export default function Navbar({ cartProducts }) {
  const isLogged = true; // for testing

  
  function enableDarkMode() {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  }

  function enableLightMode() {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
  }

  function enableSystemMode() {
    localStorage.removeItem("theme");
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  }

  return (
    <nav className="sticky top-0 z-50 w-full h-14 bg-white backdrop-blur-sm flex flex-row justify-between items-center px-3 py-1 border-b border-b-slate-400/30 transition-colors dark:bg-slate-900 dark:border-b-slate-400/30">
      <Link href={"/"}>
        <Logo className="w-8" />
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

                <ScrollArea className="h-[320px] rounded-none  w-full   px-4 ">
                  {
                    cartProducts?.length > 0 &&
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1" title="Profile">
                <i className="fa-light fa-circle-user text-slate-400 text-2xl"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-40 mr-4">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <button onClick={enableDarkMode}>Dark</button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button onClick={enableLightMode}>Light</button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button onClick={enableSystemMode}>System</button>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
