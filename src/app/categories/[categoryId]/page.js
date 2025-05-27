"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CategoryProducts from "@/components/user/CategoryProducts";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      if (!categoryId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/categories/${categoryId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch category: ${response.status}`);
        }
        const data = await response.json();
        setCategory(data.data);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategory();
  }, [categoryId]);

  return (
    <CategoryProducts
      categoryId={categoryId}
      category={category}
      setCategory={setCategory}
      loading={loading}
    />
  );
}
