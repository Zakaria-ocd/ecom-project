"use client";
import TotalProducts from "@/components/admin/TotalProducts";
import { Products } from "@/components/admin/products/Products";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <TotalProducts totalProducts={products.length} />
      <Products products={products} />
    </div>
  );
}
