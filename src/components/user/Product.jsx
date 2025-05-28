"use client";
import Image from "next/image";
import Link from "next/link";
import Rating from "../Rating";
import QuantityCalculator from "../QuantityCalculator";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import useCart from "@/hooks/useCart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Product() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { addItem, cart, removeItem } = useCart();
  const { isAuthenticated } = useSelector((state) => state.userReducer);

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [choices, setChoices] = useState([]);
  const [choicesLoading, setChoicesLoading] = useState(true);
  const [availableAttributes, setAvailableAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Selected variant/choice
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const [isInCart, setIsInCart] = useState(false);

  function handleQuantityChange(productId, choiceId, newQuantity) {
    // Make sure quantity doesn't exceed available stock
    const maxQuantity =
      choices.length > 0 && selectedChoice
        ? selectedChoice.quantity
        : product?.quantity || 0;

    if (newQuantity > maxQuantity) {
      toast.error("Cannot exceed available stock", {
        description: `Only ${maxQuantity} items available`,
        duration: 2000,
      });
      return;
    }

    setQuantity(newQuantity);
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleThumbnailError = (imageId) => {
    setThumbnailErrors((prev) => ({
      ...prev,
      [imageId]: true,
    }));
  };

  const addProductToCart = async () => {
    if (addingToCart) return;

    setAddingToCart(true);

    try {
      if (!product) {
        toast.error("Product not found");
        return;
      }

      // Get the currently selected choice
      const choiceValueId = selectedChoice ? selectedChoice.id : null;

      // Create the cart item object
      const cartItem = {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: selectedChoice ? selectedChoice.price : product.price,
        image: `http://localhost:8000/api/image/${images[currentImageIndex]}`,
        quantity: quantity,
        choiceDetails: selectedChoice
          ? selectedChoice.typeValues.map((tv) => ({
              type: tv.type?.name || "Option",
              value: tv.value,
              colorCode: tv.colorCode,
            }))
          : [],
        choice_value_id: choiceValueId,
      };

      // Use the updated addItem function that will trigger notifications
      await addItem(cartItem, quantity, choiceValueId);
      setIsInCart(true);
      // No need for additional toast as addItem already shows one
    } catch (error) {
      toast.error(error?.message || "Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const checkIfInCart = useCallback(() => {
    if (!product || !cart) return false;

    if (choices.length > 0 && selectedChoice) {
      // Check if this specific choice is in cart
      return cart.some(
        (item) =>
          item.product_id === product.id &&
          item.choice_value_id === selectedChoice.id
      );
    } else {
      // Check if the product (without choices) is in cart
      return cart.some(
        (item) => item.product_id === product.id && !item.choice_value_id
      );
    }
  }, [product, choices, selectedChoice, cart]);

  useEffect(() => {
    setIsInCart(checkIfInCart());
  }, [checkIfInCart, product?.id, selectedChoice?.id]);

  // Select a choice based on the selected attributes/filters
  const selectChoice = () => {
    if (choices.length === 0) return;

    // Find a choice that matches all selected filters
    const selected = choices.find((choice) => {
      return Object.entries(selectedFilters).every(([typeName, value]) => {
        if (!value) return true;

        return choice.typeValuePairs.some(
          (pair) => pair.typeName === typeName && pair.value === value
        );
      });
    });

    if (selected) {
      setSelectedChoice(selected);
    } else {
      setSelectedChoice(null);
    }
  };

  // Group choices by attribute types
  const groupChoicesByAttribute = () => {
    const attributeGroups = {};

    choices.forEach((choice) => {
      choice.typeValuePairs.forEach((pair) => {
        if (!attributeGroups[pair.typeName]) {
          attributeGroups[pair.typeName] = new Set();
        }
        attributeGroups[pair.typeName].add(pair.value);
      });
    });

    // Convert Sets to Arrays
    const result = {};
    Object.keys(attributeGroups).forEach((key) => {
      result[key] = Array.from(attributeGroups[key]);
    });

    return result;
  };

  useEffect(() => {
    if (choices.length > 0) {
      setAvailableAttributes(groupChoicesByAttribute());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices]);

  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      selectChoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);

  useEffect(() => {
    async function fetchProduct() {
      setProductLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${productId}`
        );
        const data = await response.json();
        setProduct(data.data);

        // Fetch category if available
        if (data.data?.category_id) {
          fetchCategory(data.data.category_id);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setProductLoading(false);
      }
    }

    async function fetchCategory(categoryId) {
      setCategoryLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/categories/${categoryId}`
        );

        if (response.ok) {
          const categoryData = await response.json();
          setCategory(categoryData.data);
        } else {
          setCategory({ id: categoryId, name: `Category #${categoryId}` });
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        setCategory({ id: categoryId, name: `Category #${categoryId}` });
      } finally {
        setCategoryLoading(false);
      }
    }

    async function fetchChoices() {
      setChoicesLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${productId}/choices`
        );
        const data = await response.json();
        setChoices(data.data);

        // If there are choices, select the first one by default
        if (data.data.length > 0) {
          const firstChoice = data.data[0];

          // Extract the filters from the first choice
          const initialFilters = {};
          firstChoice.typeValuePairs.forEach((pair) => {
            initialFilters[pair.typeName.toLowerCase()] = pair.value;
          });

          // Set the initial filters which will trigger selectChoice
          setSelectedFilters(initialFilters);
          setSelectedChoice(firstChoice);
        }
      } catch (error) {
        console.error("Error fetching choices:", error);
      } finally {
        setChoicesLoading(false);
      }
    }

    async function fetchImages() {
      setImagesLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/productImages/${productId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch product images: ${response.status}`);
        }

        const imageIds = await response.json();
        setImages(imageIds);
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      } finally {
        setImagesLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
      fetchChoices();
      fetchImages();
    }
  }, [productId]);

  const removeFromCart = async (cartItemId) => {
    if (cart && cart.length > 0) {
      try {
        await removeItem(cartItemId);
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error("Failed to remove item from cart");
      }
    }
  };

  // Display loading state
  if (productLoading) {
    return (
      <div className="container py-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex gap-1 items-center text-sm text-gray-500 mb-6">
            <Skeleton className="h-4 w-20" />
            <ChevronRight className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <ChevronRight className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-7 w-1/3" />

              <div className="py-4">
                <Skeleton className="h-10 w-full max-w-xs mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>

              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10">
      <div className="w-full px-20">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6 overflow-x-auto pb-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            {category && !categoryLoading && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/categories/${category.id}`}>
                    {category.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {product?.name || "Product Details"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-6 lg:gap-10">
          <div className="relative w-[45%]">
            {imagesLoading ? (
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ) : images.length > 0 ? (
              <div className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={`http://localhost:8000/api/image/${images[currentImageIndex]}`}
                  alt={product?.name || "Product image"}
                  fill
                  className="object-contain"
                  unoptimized
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white dark:bg-black/50 dark:hover:bg-black/80"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white dark:bg-black/50 dark:hover:bg-black/80"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {!imagesLoading && images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((imageId, idx) => (
                  <button
                    key={imageId}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      currentImageIndex === idx
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => selectImage(idx)}
                  >
                    {thumbnailErrors[imageId] ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <Image
                        src={`http://localhost:8000/api/image/${imageId}`}
                        fill
                        className="object-cover"
                        alt={`Product thumbnail ${idx + 1}`}
                        unoptimized
                        onError={() => handleThumbnailError(imageId)}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-[55%]">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {choices.length > 0 &&
                selectedChoice &&
                (selectedChoice.quantity > 10 ? (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                  >
                    In Stock
                  </Badge>
                ) : selectedChoice.quantity <= 10 &&
                  selectedChoice.quantity > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                  >
                    Low Stock
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400"
                  >
                    Out of Stock
                  </Badge>
                ))}
            </div>

            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl transition-colors dark:text-white">
              {product?.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <Rating rating={product?.rating || 0} />
              <p className="text-sm font-medium text-slate-500 transition-colors dark:text-slate-400">
                ({product?.rating || "0.0"})
              </p>
            </div>

            <p className="mt-6 text-3xl font-bold text-slate-900 transition-colors dark:text-white">
              ${selectedChoice?.price}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {availableAttributes.color && (
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-slate-800 font-medium transition-colors dark:text-slate-100 capitalize">
                    Colors:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <TooltipProvider>
                      {availableAttributes.color.map((value) => {
                        const colorCode =
                          choices
                            .find((c) =>
                              c.typeValuePairs.some(
                                (p) =>
                                  p.typeName === "color" && p.value === value
                              )
                            )
                            ?.typeValuePairs.find((p) => p.typeName === "color")
                            ?.colorCode || value;

                        return (
                          <Tooltip key={value}>
                            <TooltipTrigger asChild>
                              <button
                                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                                  selectedFilters.color === value &&
                                  "ring-2 ring-offset-2 ring-blue-500"
                                }`}
                                style={{
                                  backgroundColor: colorCode,
                                }}
                                onClick={() =>
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    color: prev.color === value ? null : value,
                                  }))
                                }
                              ></button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{value}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </TooltipProvider>
                  </div>
                </div>
              )}

              {availableAttributes.size && (
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-slate-800 font-medium transition-colors dark:text-slate-100 capitalize">
                    Sizes:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <TooltipProvider>
                      {availableAttributes.size.map((value) => (
                        <Tooltip key={value}>
                          <TooltipTrigger asChild>
                            <button
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-sm font-medium ${
                                selectedFilters.size === value
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-slate-800 border border-slate-300 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:border-blue-500"
                              }`}
                              onClick={() =>
                                setSelectedFilters((prev) => ({
                                  ...prev,
                                  size: prev.size === value ? null : value,
                                }))
                              }
                            >
                              {value.toUpperCase()}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{value}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                </div>
              )}

              {Object.entries(availableAttributes)
                .filter(([attr]) => attr !== "color" && attr !== "size")
                .map(([attributeName, values]) => (
                  <div key={attributeName} className="flex flex-col gap-1 mt-4">
                    <p className="text-slate-800 font-medium transition-colors dark:text-slate-100 capitalize">
                      {attributeName}:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {values.map((value) => (
                        <button
                          key={value}
                          className={`${
                            selectedFilters[attributeName] === value
                              ? "bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                          } px-3 py-1.5 text-sm font-medium capitalize rounded-md border transition-all`}
                          onClick={() =>
                            setSelectedFilters((prev) => ({
                              ...prev,
                              [attributeName]:
                                prev[attributeName] === value ? null : value,
                            }))
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                className={`w-fit h-10 text-white font-medium rounded-lg text-sm px-4 flex items-center justify-center gap-2 ${
                  addingToCart ||
                  (choices.length > 0 && !selectedChoice) ||
                  (choices.length > 0 &&
                    selectedChoice &&
                    selectedChoice.quantity <= 0) ||
                  (choices.length === 0 &&
                    (!product?.quantity || product.quantity <= 0))
                    ? "bg-blue-600 opacity-70 cursor-not-allowed"
                    : isInCart
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={addProductToCart}
                disabled={
                  addingToCart ||
                  (choices.length > 0 && !selectedChoice) ||
                  (choices.length > 0 &&
                    selectedChoice &&
                    selectedChoice.quantity <= 0) ||
                  (choices.length === 0 &&
                    (!product?.quantity || product.quantity <= 0))
                }
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : isInCart ? (
                  <>
                    <i className="fa-solid fa-check mr-1"></i>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-cart-plus"></i>
                    Add to Cart
                  </>
                )}
              </button>
              <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Quantity:
                </span>
                <QuantityCalculator
                  productId={product?.id}
                  choiceValueId={selectedChoice?.id}
                  itemQuantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  max={
                    choices.length > 0 && selectedChoice
                      ? selectedChoice.quantity
                      : product?.quantity || 0
                  }
                />
              </div>

              <button className="w-10 h-10 flex items-center justify-center text-rose-500 bg-white rounded-lg border border-rose-500 hover:bg-rose-50 dark:bg-gray-900 dark:border-rose-500/60 dark:hover:bg-rose-900/20">
                <i className="fa-regular fa-heart"></i>
              </button>
            </div>

            {/* Category badges below add to cart */}
            {category && !categoryLoading && (
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Category:
                </p>
                <Link
                  href={`/categories/${category.id}`}
                  className="w-fit flex items-center gap-2 group"
                >
                  <Badge
                    variant="secondary"
                    className="group-hover:bg-slate-200 group-hover:text-slate-800 transition-colors"
                  >
                    <i className="fa-regular fa-folder mr-2" />
                    {category.name}
                  </Badge>
                </Link>
              </div>
            )}

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Description
              </h3>
              <div className="text-slate-600 dark:text-slate-300">
                {product?.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p className="italic text-slate-500 dark:text-slate-400">
                    No description available for this product.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
