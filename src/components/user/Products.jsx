"use client";
import { useEffect, useState } from "react";
import FiltersBar from "./FiltersBar";
import CategoriesSide from "./CategoriesSide";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useCart from "../../hooks/useCart";
import ProductCard from "./ProductCard";

// Product skeleton for better loading experience
const ProductSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-4 place-self-center">
      <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center overflow-hidden rounded-md shadow-lg bg-gray-100 animate-pulse">
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
};

export default function Products() {
  const { cart, addItem, removeItem, refreshCart } = useCart();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
  });
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
  });
  const [sortList, setSortList] = useState([]);
  const [pricesList, setPricesList] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [resultsList, setResultsList] = useState([]);

  // Helper function to check if an item is in cart
  const isItemInCart = (productId, selectedColor, selectedSize) => {
    return cart?.some(
      (item) =>
        item.productId === productId &&
        item.color?.id === selectedColor?.id &&
        item.size?.id === selectedSize?.id
    );
  };

  const handleRemoveFromCart = (item, selectedColor, selectedSize) => {
    return new Promise((resolve, reject) => {
      try {
        // If we have a direct item object from the cart with an ID, use that
        if (item && item.id) {
          removeItem(item.id);
          console.log(`Removed item from cart: ${item.id}`);

          // Always refresh the cart after removal to update the UI
          setTimeout(() => {
            refreshCart();
            console.log("Refreshing cart after removal");
            resolve();
          }, 300);

          return;
        }

        // Otherwise, we need to find the item in the cart based on the product and choices
        let cartItemId = null;

        // Find the cart item that matches this product and choice combination
        const cartItem = cart?.find((cartItem) => {
          if (cartItem.productId !== item.id) return false;

          // For items with choices, match the choice details
          if (selectedColor || selectedSize) {
            // Match by color
            if (selectedColor) {
              const hasMatchingColor = cartItem.choiceDetails?.some(
                (detail) =>
                  detail.type?.toLowerCase() === "color" &&
                  detail.value === selectedColor.name
              );
              if (!hasMatchingColor) return false;
            }

            // Match by size
            if (selectedSize) {
              const hasMatchingSize = cartItem.choiceDetails?.some(
                (detail) =>
                  detail.type?.toLowerCase() === "size" &&
                  detail.value === selectedSize.name
              );
              if (!hasMatchingSize) return false;
            }

            return true;
          }

          // For simple products without choices
          return !cartItem.choiceDetails || cartItem.choiceDetails.length === 0;
        });

        if (cartItem) {
          removeItem(cartItem.id);
          console.log(`Found and removed cart item: ${cartItem.id}`);

          // Always refresh the cart after removal to update the UI
          setTimeout(() => {
            refreshCart();
            console.log("Refreshing cart after removal");
            resolve();
          }, 300);
        } else {
          console.error("Could not find matching item in cart");
          toast.error("Could not find this item in your cart");
          reject(new Error("Could not find matching item in cart"));
        }
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
        toast.error(
          "Failed to remove from cart: " + (error.message || "Unknown error")
        );
        reject(error);
      }
    });
  };

  // Main function to fetch all products
  useEffect(() => {
    async function fetchProducts() {
      setProductsLoading(true);

      try {
        const response = await fetch("http://localhost:8000/api/showProducts");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status} ${response.statusText}`
          );
        }

        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products. Please try refreshing the page.");
      } finally {
        setProductsLoading(false);
      }
    }

    // Fetch products and initialize filter data
    fetchProducts();

    // Initialize filter data
    setFilters({
      categories: [
        { id: 1, name: "fashion" },
        { id: 2, name: "electronics" },
        { id: 3, name: "beauty" },
        { id: 4, name: "sport" },
        { id: 5, name: "toys" },
      ],
      colors: [
        { id: 1, name: "Red" },
        { id: 2, name: "Blue" },
        { id: 3, name: "Green" },
        { id: 4, name: "Black" },
        { id: 5, name: "White" },
      ],
      sizes: [
        { id: 1, name: "Small" },
        { id: 2, name: "Medium" },
        { id: 3, name: "Large" },
        { id: 4, name: "Extra Large" },
      ],
    });

    setSortList([
      { id: 1, name: "most popular" },
      { id: 2, name: "newest arrivals" },
      { id: 3, name: "best rating" },
    ]);

    setPricesList([
      { id: 1, name: 50 },
      { id: 2, name: 100 },
      { id: 3, name: 200 },
      { id: 4, name: 300 },
      { id: 5, name: 500 },
    ]);

    setRatingList([
      { id: 1, name: 1 },
      { id: 2, name: 2 },
      { id: 3, name: 3 },
      { id: 4, name: 4 },
      { id: 5, name: 5 },
    ]);

    setResultsList([
      { id: 1, name: 24 },
      { id: 2, name: 48 },
      { id: 3, name: 96 },
    ]);
  }, []);

  return (
    <div className="w-full max-w-screen bg-white flex flex-col items-center border-t border-white transition-colors dark:bg-slate-900 dark:border-t-slate-700">
      <div className="w-full z-0 bg-white flex justify-center items-center py-14 transition-colors dark:bg-slate-900">
        <p className="bg-white z-10 text-2xl text-slate-800 font-bold px-4 py-2 transition-colors dark:text-slate-100 dark:bg-slate-900">
          OUR PRODUCTS
        </p>
        <div className="absolute -z-0 w-96 h-0.5 bg-slate-800 transition-colors dark:bg-slate-300" />
      </div>

      <div className="w-full flex md:flex-row flex-col justify-between items-start px-4">
        <CategoriesSide
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        <div className="w-full bg-white flex flex-col gap-4 px-3 transition-colors dark:bg-slate-900">
          <FiltersBar
            pricesList={pricesList}
            ratingList={ratingList}
            sortList={sortList}
            resultsList={resultsList}
            selectedFilters={selectedFilters}
            setSelectedFilters={(value) => setSelectedFilters(value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8 sm:py-4">
            {productsLoading ? (
              // Show skeletons for initial product loading
              Array(8)
                .fill(0)
                .map((_, index) => <ProductSkeleton key={index} />)
            ) : products.length === 0 ? (
              // Show empty state when no products
              <div className="col-span-full flex flex-col items-center justify-center py-10">
                <div className="text-gray-400 mb-4 text-5xl">
                  <i className="fa-solid fa-box-open"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  No products found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              // Show products
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
