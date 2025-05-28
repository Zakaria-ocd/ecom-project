"use client";
import HeroSection from "@/components/user/HeroSection";
import Navbar from "@/components/user/Navbar";
import Products from "@/components/user/Products";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <HeroSection />
      <Products />
    </div>
  );
}
