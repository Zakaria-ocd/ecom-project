"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { toast } from "sonner";

export function Products() {
  const [products, setProducts] = useState([]);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      setProducts(updatedProducts);
      toast.success(data.message);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        const data = await response.json();

        setProducts(data.data);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleDeleteProduct={handleDeleteProduct}
          />
        ))}
      </div>
    </>
  );
}
