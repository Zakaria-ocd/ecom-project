"use client";

import HeroSection from "@/components/user/HeroSection";
import Navbar from "@/components/user/Navbar";
import Products from "@/components/user/Products";
import { useEffect, useState } from "react";

export default function Home() {
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    setCartProducts(
      JSON.parse(localStorage.getItem("cartProducts"))?.length > 0 ?
        JSON.parse(localStorage.getItem("cartProducts")):[]
    );
  }, []);
  useEffect(()=>{
     localStorage.setItem(
        "cartProducts",
        JSON.stringify(cartProducts))
  },[cartProducts])
  return (
    <div className="w-full">
      <Navbar cartProducts={cartProducts} setCartProducts={setCartProducts} />
      <HeroSection />
      <Products cartProducts={cartProducts} setCartProducts={setCartProducts} />
    </div>
  );
}
