"use client";
import { Toaster } from "@/components/ui/sonner";
import store from "@/store";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";

export default function App({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <Provider store={store}>
      {mounted && children}
      <Toaster position="top-right" richColors />
    </Provider>
  );
}
