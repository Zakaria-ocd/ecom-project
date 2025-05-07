"use client";
import { useEffect, useState } from "react";

export default function Product({ productId }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    rating: 0,
    category_id: 2,
    seller_id: 2,
    created_at: "",
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${productId}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchImages() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/productImages/${productId}`
        );
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchProductWithImages() {
      await fetchProduct();
      await fetchImages();
    }
    fetchProductWithImages();
  }, [productId]);

  return (
    <>
      <div>
        <div></div>
        <div>
          <h1>{product.name}</h1>
          <h1>{product.description}</h1>
          <h1>{product.price}</h1>
          <h1>{product.quantity}</h1>
          <h1>{product.rating}</h1>
          <h1>{product.category_id}</h1>
          <h1>{product.seller_id}</h1>
          <h1>{product.created_at}</h1>
        </div>
      </div>
    </>
  );
}
