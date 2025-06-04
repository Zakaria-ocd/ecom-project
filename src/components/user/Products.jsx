"use client";
import { useEffect, useState, useCallback } from "react";
import FiltersBar from "./FiltersBar";
import CategoriesSide from "./CategoriesSide";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useCart from "../../hooks/useCart";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { DialogTitle } from "../ui/dialog";
import { FaStar } from "react-icons/fa6";

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

const FiltersSkeleton = () => {
  return (
    <div className="min-w-56 max-w-56 flex flex-col items-start">
      <ul className="w-full flex flex-col gap-3 px-2 my-2">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-slate-50/80 rounded-lg border dark:bg-slate-800/80"
          >
            <div className="px-3.5 py-2">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="px-3 pb-3">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default function Products() {
  const { cart, removeItem, refreshCart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filtersError, setFiltersError] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    prices: [],
    colors: [],
    sizes: [],
    rating: null,
  });
  const [filters, setFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
  });
  const [sortList] = useState([
    { id: 1, name: "most popular", value: "popular" },
    { id: 2, name: "newest arrivals", value: "newest" },
    { id: 3, name: "price: low to high", value: "price_asc" },
    { id: 4, name: "price: high to low", value: "price_desc" },
    { id: 5, name: "best rating", value: "rating" },
  ]);
  const [pricesList] = useState([
    { id: 1, name: 50 },
    { id: 2, name: 100 },
    { id: 3, name: 200 },
    { id: 4, name: 300 },
    { id: 5, name: 500 },
  ]);
  const [ratingList] = useState([
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
    { id: 5, name: 5 },
  ]);
  const [resultsList] = useState([
    { id: 1, name: 24 },
    { id: 2, name: 48 },
    { id: 3, name: 96 },
  ]);
  const [sortBy, setSortBy] = useState("newest");
  const [resultsPerPage, setResultsPerPage] = useState(48);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const isItemInCart = (productId, selectedColor, selectedSize) => {
    return cart?.some(
      (item) =>
        item.productId === productId &&
        item.color?.id === selectedColor?.id &&
        item.size?.id === selectedSize?.id
    );
  };

  const handleFiltersChange = (filterKey, selectedItem) => {
    setSelectedFilters((prev) => {
      let updatedFilter = [...prev[filterKey]];
      const itemIndex = updatedFilter.findIndex(
        (item) => item.id === selectedItem.id
      );

      if (itemIndex >= 0) {
        updatedFilter.splice(itemIndex, 1);
      } else {
        updatedFilter.push(selectedItem);
      }

      return { ...prev, [filterKey]: updatedFilter };
    });
  };

  const handleSingleFilterChange = (filterKey, selectedItem) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: selectedItem,
    }));
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption.value);
  };

  const handleResultsPerPageChange = (option) => {
    setResultsPerPage(option.name);
    setCurrentPage(1);
  };

  const handleRemoveFromCart = (item, selectedColor, selectedSize) => {
    return new Promise((resolve, reject) => {
      try {
        if (item && item.id) {
          removeItem(item.id);
          console.log(`Removed item from cart: ${item.id}`);

          setTimeout(() => {
            refreshCart();
            console.log("Refreshing cart after removal");
            resolve();
          }, 300);

          return;
        }

        let cartItemId = null;

        const cartItem = cart?.find((cartItem) => {
          if (cartItem.productId !== item.id) return false;

          if (selectedColor || selectedSize) {
            if (selectedColor) {
              const hasMatchingColor = cartItem.choiceDetails?.some(
                (detail) =>
                  detail.type?.toLowerCase() === "color" &&
                  detail.value === selectedColor.name
              );
              if (!hasMatchingColor) return false;
            }

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

          return !cartItem.choiceDetails || cartItem.choiceDetails.length === 0;
        });

        if (cartItem) {
          removeItem(cartItem.id);
          console.log(`Found and removed cart item: ${cartItem.id}`);

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

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:8000/api/categories");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to load categories:", error);
      return [];
    }
  }

  async function fetchChoices() {
    try {
      const response = await fetch(
        "http://localhost:8000/api/available-choices"
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch choices: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const colorType = data.availableTypes.find(
        (type) => type.name.toLowerCase() === "color"
      );

      const sizeType = data.availableTypes.find(
        (type) => type.name.toLowerCase() === "size"
      );

      const colors = colorType
        ? data.availableValues[colorType.id]?.map((color) => ({
            id: color.id,
            name: color.value,
            type: "color",
          })) || []
        : [];

      const sizes = sizeType
        ? data.availableValues[sizeType.id]?.map((size) => ({
            id: size.id,
            name: size.value,
            type: "size",
          })) || []
        : [];

      return { colors, sizes };
    } catch (error) {
      console.error("Failed to load choices:", error);
      return { colors: [], sizes: [] };
    }
  }

  const applyFilters = useCallback(async () => {
    setIsFiltering(true);

    try {
      const params = new URLSearchParams();

      if (selectedFilters.categories.length > 0) {
        params.append(
          "categories",
          selectedFilters.categories.map((c) => c.id).join(",")
        );
      }

      if (selectedFilters.colors.length > 0) {
        params.append(
          "colors",
          selectedFilters.colors.map((c) => c.id).join(",")
        );
      }

      if (selectedFilters.sizes.length > 0) {
        params.append(
          "sizes",
          selectedFilters.sizes.map((s) => s.id).join(",")
        );
      }

      if (selectedFilters.prices.length > 0) {
        const minPrice = Math.min(...selectedFilters.prices.map((p) => p.name));
        params.append("min_price", minPrice);
      }

      if (selectedFilters.rating) {
        params.append("min_rating", selectedFilters.rating.name);
      }

      if (sortBy) {
        params.append("sort", sortBy);
      }

      params.append("page", currentPage);
      params.append("per_page", resultsPerPage);

      const response = await fetch(
        `http://localhost:8000/api/filter-products?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch filtered products: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      setFilteredProducts(data.data || []);
      setTotalProducts(data.meta?.total || 0);
    } catch (error) {
      console.error("Error filtering products:", error);
      toast.error("Failed to apply filters. Please try again.");

      applyLocalFilters();
    } finally {
      setIsFiltering(false);
    }
  }, [selectedFilters, sortBy, currentPage, resultsPerPage]);

  const applyLocalFilters = () => {
    if (!products || products.length === 0) return;

    let filtered = [...products];

    if (selectedFilters.categories.length > 0) {
      const categoryIds = selectedFilters.categories.map((c) => c.id);
      filtered = filtered.filter((product) =>
        categoryIds.includes(product.category_id)
      );
    }

    if (selectedFilters.colors.length > 0) {
      filtered = filtered.filter((product) => {
        const productColors = product.colors || [];
        return selectedFilters.colors.some((selectedColor) =>
          productColors.some(
            (productColor) => productColor.id === selectedColor.id
          )
        );
      });
    }

    if (selectedFilters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        const productSizes = product.sizes || [];
        return selectedFilters.sizes.some((selectedSize) =>
          productSizes.some((productSize) => productSize.id === selectedSize.id)
        );
      });
    }

    if (selectedFilters.prices.length > 0) {
      const priceThresholds = selectedFilters.prices
        .map((p) => p.name)
        .sort((a, b) => a - b);
      const minPrice = Math.min(...priceThresholds);

      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price || 0);
        return price >= minPrice;
      });
    }

    if (selectedFilters.rating) {
      const minRating = selectedFilters.rating.name;
      filtered = filtered.filter((product) => {
        const rating = parseFloat(product.rating || 0);
        return rating >= minRating;
      });
    }

    filtered = sortProducts(filtered, sortBy);

    setTotalProducts(filtered.length);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const paginatedProducts = filtered.slice(
      startIndex,
      startIndex + resultsPerPage
    );

    setFilteredProducts(paginatedProducts);
  };

  const sortProducts = (products, sortOption) => {
    return [...products].sort((a, b) => {
      switch (sortOption) {
        case "price_asc":
          return parseFloat(a.price || 0) - parseFloat(b.price || 0);
        case "price_desc":
          return parseFloat(b.price || 0) - parseFloat(a.price || 0);
        case "rating":
          return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
        case "popular":
          return parseFloat(b.sales || 0) - parseFloat(a.sales || 0);
        case "newest":
        default:
          return b.id - a.id;
      }
    });
  };

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadAllData = async () => {
    setFiltersLoading(true);
    setProductsLoading(true);
    setFiltersError(false);

    try {
      const productsResponse = await fetch(
        "http://localhost:8000/api/showProducts"
      );

      if (!productsResponse.ok) {
        throw new Error(
          `Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`
        );
      }

      const productsData = await productsResponse.json();
      setProducts(productsData);

      setFilteredProducts(productsData);
      setTotalProducts(productsData.length);

      const [categories, choicesResult] = await Promise.all([
        fetchCategories(),
        fetchChoices(),
      ]);

      if (!categories?.length) {
        console.warn("No categories found or categories API failed");
      }

      const { colors = [], sizes = [] } = choicesResult || {};

      setFilters({
        categories: categories || [],
        colors: colors || [],
        sizes: sizes || [],
      });
    } catch (error) {
      console.error("Failed to load products or filters:", error);
      toast.error("Failed to load products. Please try refreshing the page.");
      setFiltersError(true);
    } finally {
      setProductsLoading(false);
      setFiltersLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const renderFilterError = () => (
    <div className="min-w-56 max-w-56 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
      <p className="text-red-600 dark:text-red-400 text-sm mb-3">
        Failed to load filters
      </p>
      <Button
        size="sm"
        onClick={loadAllData}
        variant="outline"
        className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/30"
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </Button>
    </div>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(totalProducts / resultsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 mb-4">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            size="sm"
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageToShow;
            if (totalPages <= 5) {
              pageToShow = i + 1;
            } else if (currentPage <= 3) {
              pageToShow = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageToShow = totalPages - 4 + i;
            } else {
              pageToShow = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageToShow}
                variant={currentPage === pageToShow ? "default" : "outline"}
                onClick={() => setCurrentPage(pageToShow)}
                size="sm"
              >
                {pageToShow}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const activeFiltersCount =
    selectedFilters.categories.length +
    selectedFilters.colors.length +
    selectedFilters.sizes.length +
    selectedFilters.prices.length +
    (selectedFilters.rating ? 1 : 0);

  return (
    <div className="w-full max-w-screen bg-white flex flex-col items-center border-t border-white transition-colors dark:bg-slate-900 dark:border-t-slate-700">
      <div className="w-full z-0 bg-white flex justify-center items-center py-10 md:py-14 transition-colors dark:bg-slate-900">
        <p className="bg-white z-10 text-xl md:text-2xl text-slate-800 font-bold px-4 py-2 transition-colors dark:text-slate-100 dark:bg-slate-900">
          OUR PRODUCTS
        </p>
        <div className="absolute -z-0 w-64 md:w-96 h-0.5 bg-slate-800 transition-colors dark:bg-slate-300" />
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-start px-2 md:px-4 max-w-7xl mx-auto mb-8">
        <div className="hidden md:block">
          {filtersError ? (
            renderFilterError()
          ) : filtersLoading ? (
            <FiltersSkeleton />
          ) : (
            <CategoriesSide
              filters={filters}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          )}
        </div>

        <div className="w-full md:hidden mb-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-medium rounded-full w-4 h-4 inline-flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <div className="h-full flex flex-col">
                  <DialogTitle className="p-4 border-b font-medium">
                    <div className="text-lg">Filters</div>
                  </DialogTitle>
                  <div className="flex-1 overflow-auto p-4">
                    {filtersError ? (
                      <div className="p-4">
                        <p className="text-red-500 mb-2">
                          Failed to load filters
                        </p>
                        <Button
                          onClick={loadAllData}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Retry
                        </Button>
                      </div>
                    ) : filtersLoading ? (
                      <div className="p-4 space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-3">Categories</h3>
                          <div className="space-y-2">
                            {filters.categories.map((category) => (
                              <div
                                key={category.id}
                                className="flex items-center"
                              >
                                <Button
                                  variant="ghost"
                                  className={`w-full justify-start px-2 py-1 h-auto text-sm ${
                                    selectedFilters.categories.some(
                                      (c) => c.id === category.id
                                    )
                                      ? "bg-primary/10 text-primary"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleFiltersChange("categories", category)
                                  }
                                >
                                  {category.name}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {filters.colors.length > 0 && (
                          <>
                            <div>
                              <h3 className="font-medium mb-3">Colors</h3>
                              <div className="flex flex-wrap gap-2">
                                {filters.colors.map((color) => (
                                  <Button
                                    key={color.id}
                                    variant={
                                      selectedFilters.colors.some(
                                        (c) => c.id === color.id
                                      )
                                        ? "default"
                                        : "outline"
                                    }
                                    className="rounded-full h-8 px-3"
                                    onClick={() =>
                                      handleFiltersChange("colors", color)
                                    }
                                  >
                                    {color.name}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Separator />
                          </>
                        )}

                        {filters.sizes.length > 0 && (
                          <>
                            <div>
                              <h3 className="font-medium mb-3">Sizes</h3>
                              <div className="flex flex-wrap gap-2">
                                {filters.sizes.map((size) => (
                                  <Button
                                    key={size.id}
                                    variant={
                                      selectedFilters.sizes.some(
                                        (s) => s.id === size.id
                                      )
                                        ? "default"
                                        : "outline"
                                    }
                                    className="min-w-[40px]"
                                    onClick={() =>
                                      handleFiltersChange("sizes", size)
                                    }
                                  >
                                    {size.name}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Separator />
                          </>
                        )}

                        <div>
                          <h3 className="font-medium mb-3">Price</h3>
                          <div className="flex flex-wrap gap-2">
                            {pricesList.map((price) => (
                              <Button
                                key={price.id}
                                variant={
                                  selectedFilters.prices.some(
                                    (p) => p.id === price.id
                                  )
                                    ? "default"
                                    : "outline"
                                }
                                className="text-sm"
                                onClick={() =>
                                  handleFiltersChange("prices", price)
                                }
                              >
                                ${price.name}+
                              </Button>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-3">Rating</h3>
                          <div className="space-y-2">
                            {ratingList.map((rating) => (
                              <div
                                key={rating.id}
                                className="flex items-center"
                              >
                                <Button
                                  variant="ghost"
                                  className={`w-full justify-start text-sm ${
                                    selectedFilters.rating?.id === rating.id
                                      ? "bg-primary/10 text-primary"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSingleFilterChange(
                                      "rating",
                                      selectedFilters.rating?.id === rating.id
                                        ? null
                                        : rating
                                    )
                                  }
                                >
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`text-amber-400 ${
                                        i < rating.name
                                          ? "opacity-100"
                                          : "opacity-30"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-1">& Up</span>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t p-4">
                    <Button
                      className="w-full"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Show Results
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {activeFiltersCount > 0 && (
            <div className="overflow-x-auto pb-1">
              <div className="flex items-center gap-2">
                {selectedFilters.categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFiltersChange("categories", category)}
                    className="py-1 px-3 rounded-full text-xs whitespace-nowrap bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800"
                  >
                    {category.name}
                    <X />
                  </Button>
                ))}
                {selectedFilters.colors.map((color) => (
                  <Button
                    key={color.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFiltersChange("colors", color)}
                    className="py-1 px-3 rounded-full text-xs whitespace-nowrap bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800"
                  >
                    {color.name}
                    <X />
                  </Button>
                ))}
                {selectedFilters.sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFiltersChange("sizes", size)}
                    className="py-1 px-3 rounded-full text-xs whitespace-nowrap bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800"
                  >
                    {size.name}
                    <X />
                  </Button>
                ))}
                {selectedFilters.prices.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedFilters((prev) => ({ ...prev, prices: [] }))
                    }
                    className="py-1 px-3 rounded-full text-xs whitespace-nowrap bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-800"
                  >
                    Price filters
                    <X />
                  </Button>
                )}
                {selectedFilters.rating && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSingleFilterChange("rating", null)}
                    className="py-1 px-3 rounded-full text-xs whitespace-nowrap bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800"
                  >
                    {selectedFilters.rating.name}
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-amber-400 ${
                            i < selectedFilters.rating.name
                              ? "opacity-100"
                              : "opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                    <X />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:flex-1 bg-white flex flex-col gap-4 px-2 md:px-3 md:ml-6 transition-colors dark:bg-slate-900">
          <FiltersBar
            pricesList={pricesList}
            ratingList={ratingList}
            sortList={sortList}
            resultsList={resultsList}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            onSortChange={handleSortChange}
            onResultsChange={handleResultsPerPageChange}
            onRatingChange={(rating) =>
              handleSingleFilterChange("rating", rating)
            }
            onPriceChange={(price) => handleFiltersChange("prices", price)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 py-4 md:py-8">
            {productsLoading || isFiltering ? (
              Array(8)
                .fill(0)
                .map((_, index) => <ProductSkeleton key={index} />)
            ) : filteredProducts.length === 0 ? (
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
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))
            )}
          </div>

          {renderPagination()}
        </div>
      </div>
    </div>
  );
}
