"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";
import useCart from "@/hooks/useCart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Product skeleton for loading state
const ProductSkeleton = () => (
  <div className="w-full flex flex-col gap-4 place-self-center">
    <div className="w-full relative h-72 flex flex-col justify-center items-center overflow-hidden rounded-md shadow-lg bg-gray-100 animate-pulse">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="w-full flex flex-col px-1 gap-2">
      <Skeleton className="h-5 w-3/4" />
      <div className="w-full flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  </div>
);

export default function CategoryProducts({
  categoryId,
  category,
  setCategory,
  loading: categoryLoading,
}) {
  const { cart, removeItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch products for the category
  useEffect(() => {
    if (!categoryId) return;

    async function fetchProductsByCategory() {
      setLoading(true);
      try {
        // Use the dedicated API endpoint for products by category
        const response = await fetch(
          `http://localhost:8000/api/categories/${categoryId}/products`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        const categoryProducts = data.products || [];

        // If category wasn't provided separately, use the one from the response
        if (!category && data.category) {
          setCategory(data.category);
        }

        setTotalProducts(categoryProducts.length);

        // Sort products based on sortBy value
        const sortedProducts = [...categoryProducts].sort((a, b) => {
          switch (sortBy) {
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            case "name-asc":
              return a.name.localeCompare(b.name);
            case "name-desc":
              return b.name.localeCompare(a.name);
            case "rating-desc":
              return b.rating - a.rating;
            default:
              // "newest" - sort by id descending as a proxy for newest
              return b.id - a.id;
          }
        });

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsByCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sortBy]);

  // Helper function to check if an item is in the cart
  const isItemInCart = (productId) => {
    if (!cart) return false;
    return cart.some((item) => item.productId === productId);
  };

  // Handle removing from cart
  const handleRemoveFromCart = (product, selectedColor, selectedSize) => {
    try {
      // Get the choice value ID either from passed parameters or from the product choices
      let choiceValueId = null;

      // If color or size is provided, use them to determine choice ID
      if (selectedColor || selectedSize) {
        // If we have both color and size, prefer the one that's not null
        if (selectedColor) {
          choiceValueId = selectedColor.id;
          console.log(`Using color choice ID: ${choiceValueId}`);
        } else if (selectedSize) {
          choiceValueId = selectedSize.id;
          console.log(`Using size choice ID: ${choiceValueId}`);
        }
      }

      // Debug what's being passed to removeItem
      console.log("Removing item with:", {
        productId: product.id,
        choiceValueId,
      });

      // Remove the item from cart with the appropriate choice ID
      removeItem(product.id, choiceValueId);

      // Refresh cart immediately
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  // No category found
  if (!categoryLoading && !category) {
    return (
      <div className="container py-10">
        <div className="w-full max-w-6xl mx-auto">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Category Not Found</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-6 dark:text-gray-400">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="w-full mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>
              {categoryLoading ? "Loading..." : category?.name || "Category"}
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <div className="mb-8">
          <div className="text-3xl font-bold mb-2">
            {categoryLoading ? (
              <Skeleton className="h-9 w-48" />
            ) : (
              category?.name || "Products"
            )}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {categoryLoading ? (
              <Skeleton className="h-5 w-96" />
            ) : (
              category?.description || `Browse all products in this category`
            )}
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              `${totalProducts} product${totalProducts !== 1 ? "s" : ""} found`
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px] h-9 bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleRemoveFromCart={handleRemoveFromCart}
                isItemInCart={isItemInCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">
              There are no products in this category yet.
            </p>
            <Link
              href="/products"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Browse all products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
