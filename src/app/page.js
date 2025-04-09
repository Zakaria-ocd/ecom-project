"use client";
import HeroSection from "@/components/user/HeroSection";
import Navbar from "@/components/user/Navbar";
import Products from "@/components/user/Products";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <div className="w-full">
      <Navbar />
      <HeroSection />
      <Products />
    </div>
  );
}
