"use client";
import { Toaster } from "@/components/ui/sonner";
import store from "@/store";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";

function getPageTitle(pathname) {
  const exactTitles = {
    "/": "Home",
    "/products": "Products",
    "/categories": "Categories",
    "/user/cart": "Shopping Cart",
    "/user/checkout": "Checkout",
    "/user/login": "Customer Login",
    "/user/register": "Create Account",
    "/user/profile": "My Profile",
    "/user/wishlist": "Wishlist",
    "/user/orders": "My Orders",
    "/admin/login": "Admin Login",
    "/admin": "Admin Dashboard",
    "/admin/dashboard": "Admin Dashboard",
    "/admin/analytics": "Analytics",
    "/admin/categories": "Manage Categories",
    "/admin/categories/create": "Create Category",
    "/admin/products": "Manage Products",
    "/admin/products/create": "Create Product",
    "/admin/orders": "Manage Orders",
    "/admin/users": "Manage Users",
    "/admin/users/create": "Create User",
  };

  if (exactTitles[pathname]) {
    return exactTitles[pathname];
  }

  if (/^\/products\/[^/]+$/.test(pathname)) return "Product Details";
  if (/^\/categories\/[^/]+$/.test(pathname)) return "Category Products";
  if (/^\/user\/orders\/[^/]+$/.test(pathname)) return "Order Details";
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) return "Order Details";
  if (/^\/admin\/products\/edit\/[^/]+$/.test(pathname)) return "Edit Product";
  if (/^\/admin\/products\/[^/]+$/.test(pathname)) return "Product Details";
  if (/^\/admin\/categories\/edit\/[^/]+$/.test(pathname)) return "Edit Category";
  if (/^\/admin\/categories\/[^/]+$/.test(pathname)) return "Category Details";
  if (/^\/admin\/users\/edit\/[^/]+$/.test(pathname)) return "Edit User";
  if (/^\/admin\/users\/[^/]+$/.test(pathname)) return "User Details";

  return "3Z Shop";
}

export default function App({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    document.title = `${getPageTitle(pathname)} | 3Z Shop`;
  }, [pathname]);

  return (
    <Provider store={store}>
      {mounted && children}
      <Toaster />
    </Provider>
  );
}
