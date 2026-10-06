"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Rating from "../Rating";
import { motion } from "framer-motion";
import useCart from "@/hooks/useCart";
import { isAuthenticated } from "@/lib/auth";
import QuantityCalculator from "../QuantityCalculator";
import { groupProductChoicesByAttribute } from "@/lib/productChoices";
import {
  ArrowRight,
  CircleX,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  LoaderCircle,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductCard({ product, handleRemoveFromCart }) {
  const { addItem, updateQuantity, cart, refreshCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [allImageIds, setAllImageIds] = useState([]);
  const [mainImageStates, setMainImageStates] = useState({
    currentImageId: null,
    loaded: false,
    error: false,
  });
  const [qvImageStates, setQvImageStates] = useState({
    currentImageId: null,
    loaded: false,
    error: false,
  });
  const [qsImageStates, setQsImageStates] = useState({
    currentImageId: null,
    loaded: false,
    error: false,
  });
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [productChoices, setProductChoices] = useState([]);
  const [loadingChoices, setLoadingChoices] = useState(false);
  const [activePrice, setActivePrice] = useState(product.price || 0);
  const [activeQuantity, setActiveQuantity] = useState(product.quantity || 0);
  const [removingFromCart, setRemovingFromCart] = useState(false);

  const handleImageNavigation = (section, direction) => {
    const setState = {
      main: setMainImageStates,
      qv: setQvImageStates,
      qs: setQsImageStates,
    }[section];

    const currentId = {
      main: mainImageStates.currentImageId,
      qv: qvImageStates.currentImageId,
      qs: qsImageStates.currentImageId,
    }[section];

    setState((prev) => ({
      ...prev,
      loaded: false,
      error: false,
      currentImageId: getNewImageId(currentId, direction),
    }));
  };

  const getNewImageId = (currentId, direction) => {
    const currentIndex = allImageIds.indexOf(currentId);
    if (direction === "next") {
      return allImageIds[(currentIndex + 1) % allImageIds.length];
    }
    return allImageIds[
      (currentIndex - 1 + allImageIds.length) % allImageIds.length
    ];
  };

  useEffect(() => {
    if (!product?.id) {
      setAllImageIds([]);
      setMainImageStates((prev) => ({ ...prev, currentImageId: null }));
      return;
    }

    const fetchProductImages = async () => {
      setLoadingThumbnails(true);

      try {
        const response = await fetch(
          `http://localhost:8000/api/productImages/${product.id}`,
        );

        if (!response.ok)
          throw new Error(`Failed to fetch images: ${response.status}`);

        const imageIds = await response.json();

        if (imageIds.length > 0) {
          setAllImageIds(imageIds);
        }
      } catch (error) {
        console.error("Error loading product images:", error);
      } finally {
        setLoadingThumbnails(false);
      }
    };

    fetchProductImages();
  }, [product.id]);

  useEffect(() => {
    if (!product?.id) return;

    const fetchProductChoices = async () => {
      setLoadingChoices(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${product.id}/choices`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch choices: ${response.status}`);
        }

        const responseData = await response.json();

        const data = responseData.data || responseData;

        if (data && Array.isArray(data)) {
          setProductChoices(data);

          const processed = groupProductChoicesByAttribute(data).map(
            (type) => ({
              ...type,
              values: type.values.map((value) => ({
                ...value,
                quantity: data
                  .filter((choice) =>
                    choice.typeValuePairs?.some((pair) =>
                      value.valueIds.includes(pair.valueId),
                    ),
                  )
                  .reduce(
                    (total, choice) => total + Number(choice.quantity || 0),
                    0,
                  ),
              })),
            }),
          );
          setProductTypes(processed);

          const firstAvailableChoice = data.find(
            (choice) => choice.quantity > 0,
          );
          const defaultColor = firstAvailableChoice?.typeValuePairs.find(
            (pair) => pair.typeName?.toLowerCase().includes("color"),
          );
          const defaultOtherType = firstAvailableChoice?.typeValuePairs.find(
            (pair) => !pair.typeName?.toLowerCase().includes("color"),
          );

          setSelectedColor(
            defaultColor
              ? {
                  id: defaultColor.valueId,
                  valueIds: [defaultColor.valueId],
                  name: defaultColor.value,
                  typeName: defaultColor.typeName,
                  colorCode:
                    defaultColor.colorCode ||
                    getColorForValue(defaultColor.value),
                }
              : null,
          );
          setSelectedSize(
            defaultOtherType
              ? {
                  id: defaultOtherType.valueId,
                  valueIds: [defaultOtherType.valueId],
                  name: defaultOtherType.value,
                  typeName: defaultOtherType.typeName,
                }
              : null,
          );

          if (firstAvailableChoice) {
            setSelectedChoiceId(firstAvailableChoice.choice_value_id);
            setActivePrice(firstAvailableChoice.price);
            setActiveQuantity(firstAvailableChoice.quantity);
          } else {
            setActivePrice(product.price || 0);
            setActiveQuantity(0);
            setSelectedChoiceId(null);
            if (processed.length > 0) {
              toast.error("Product unavailable", {
                description: "All variations of this product are out of stock",
                duration: 3000,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product choices:", error);

        toast.error("Could not load product options", {
          description: "Please try again later",
          duration: 3000,
        });

        setActivePrice(product.price || 0);
        setActiveQuantity(product.quantity || 0);
        setProductChoices([]);
        setProductTypes([]);
      } finally {
        setLoadingChoices(false);
      }
    };

    fetchProductChoices();
  }, [product.id, product.price, product.quantity]);

  const validateChoiceCombination = useCallback(() => {
    const selectedOptions = [selectedColor, selectedSize].filter(Boolean);

    if (productTypes.length === 0) {
      return {
        valid: true,
        price: product.price || 0,
        quantity: product.quantity || 0,
        choiceId: null,
        message: null,
      };
    }

    if (selectedOptions.length === 0) {
      return {
        valid: false,
        price: product.price || 0,
        quantity: 0,
        choiceId: null,
        message: "Please select an option for this product",
      };
    }

    const exactMatchingChoice = productChoices.find(
      (choice) =>
        choice.typeValuePairs?.length === selectedOptions.length &&
        choice.typeValuePairs.every((pair) => {
          const typeName = pair.typeName?.toLowerCase() || "";
          const selectedOption = typeName.includes("color")
            ? selectedColor
            : selectedSize?.typeName.toLowerCase() === typeName
              ? selectedSize
              : null;

          return selectedOption?.valueIds?.includes(pair.valueId);
        }),
    );

    if (exactMatchingChoice) {
      return {
        valid: true,
        price: exactMatchingChoice.price ?? product.price ?? 0,
        quantity: exactMatchingChoice.quantity || 0,
        choiceId: exactMatchingChoice.choice_value_id,
        message: null,
      };
    }

    return {
      valid: false,
      price: product.price || 0,
      quantity: 0,
      choiceId: null,
      message: "Please select a valid combination of options",
    };
  }, [
    selectedColor,
    selectedSize,
    product,
    productChoices,
    productTypes.length,
  ]);

  useEffect(() => {
    const validation = validateChoiceCombination();

    setActivePrice(validation.price);
    setActiveQuantity(validation.quantity);
    setSelectedChoiceId(validation.choiceId);
  }, [
    selectedColor,
    selectedSize,
    product.price,
    product.quantity,
    validateChoiceCombination,
  ]);

  const generateCartItemId = (productId, selectedColor, selectedSize) => {
    return `${productId}-${selectedColor?.id || "no-color"}-${
      selectedSize?.id || "no-size"
    }`;
  };

  const findCartItem = () => {
    if (!cart || !Array.isArray(cart)) {
      return null;
    }

    return cart.find((item) => {
      if (item.productId !== product.id && item.product_id !== product.id)
        return false;

      if (selectedChoiceId && item.choice_value_id) {
        return selectedChoiceId === item.choice_value_id;
      }

      const isSimpleProduct =
        (!item.choiceDetails || item.choiceDetails.length === 0) &&
        !selectedColor &&
        !selectedSize;

      if (isSimpleProduct) {
        return true;
      }

      if (selectedColor && selectedSize) {
        const hasMatchingColor = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "color" &&
            detail.value === selectedColor.name,
        );

        const hasMatchingSize = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "size" &&
            detail.value === selectedSize.name,
        );

        return hasMatchingColor && hasMatchingSize;
      }

      if (selectedColor && !selectedSize) {
        const hasMatchingColor = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "color" &&
            detail.value === selectedColor.name,
        );

        const hasSizeDetail = item.choiceDetails?.some(
          (detail) => detail.type?.toLowerCase() === "size",
        );

        return hasMatchingColor && !hasSizeDetail;
      }

      if (!selectedColor && selectedSize) {
        const hasMatchingSize = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "size" &&
            detail.value === selectedSize.name,
        );

        const hasColorDetail = item.choiceDetails?.some(
          (detail) => detail.type?.toLowerCase() === "color",
        );

        return hasMatchingSize && !hasColorDetail;
      }

      return false;
    });
  };

  const isProductInCart = () => {
    if (!cart || !Array.isArray(cart)) return false;

    return cart.some((item) => {
      if (item.productId !== product.id && item.product_id !== product.id)
        return false;

      if (selectedChoiceId && item.choice_value_id) {
        return selectedChoiceId === item.choice_value_id;
      }

      const isSimpleProduct =
        (!item.choiceDetails || item.choiceDetails.length === 0) &&
        !selectedColor &&
        !selectedSize;

      if (isSimpleProduct) {
        return true;
      }

      if (selectedColor || selectedSize) {
        if (selectedColor && selectedSize) {
          const hasMatchingColor = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "color" &&
              detail.value === selectedColor.name,
          );

          const hasMatchingSize = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "size" &&
              detail.value === selectedSize.name,
          );

          return hasMatchingColor && hasMatchingSize;
        }

        if (selectedColor && !selectedSize) {
          const hasMatchingColor = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "color" &&
              detail.value === selectedColor.name,
          );

          const hasSizeDetail = item.choiceDetails?.some(
            (detail) => detail.type?.toLowerCase() === "size",
          );

          return hasMatchingColor && !hasSizeDetail;
        }

        if (!selectedColor && selectedSize) {
          const hasMatchingSize = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "size" &&
              detail.value === selectedSize.name,
          );

          const hasColorDetail = item.choiceDetails?.some(
            (detail) => detail.type?.toLowerCase() === "color",
          );

          return hasMatchingSize && !hasColorDetail;
        }
      }

      return false;
    });
  };

  const handleAddToCart = (item) => {
    if (!item || activePrice <= 0) {
      toast.error("Cannot add to cart", {
        description: "This product is not available for purchase",
        duration: 3000,
      });
      return;
    }

    if (activeQuantity <= 0) {
      toast.error("Cannot add to cart", {
        description: "This product is out of stock",
        duration: 3000,
      });
      return;
    }

    if (productTypes.length > 0) {
      const validChoice = validateChoiceCombination();
      if (!validChoice.valid) {
        toast.error("Invalid product selection", {
          description:
            validChoice.message ||
            "Please select a valid combination of options",
          duration: 3000,
        });
        return;
      }

      if (validChoice.choiceId) {
        setSelectedChoiceId(validChoice.choiceId);
      }
    }

    const imageId =
      mainImageStates.currentImageId ||
      (allImageIds.length > 0 ? allImageIds[0] : null);

    if (!imageId) {
      console.warn("No image ID available for product", item.id);
    }

    const cartItem = {
      id: generateCartItemId(item.id, selectedColor, selectedSize),
      productId: item.id,
      name: item.name,
      price: activePrice,
      rating: item.rating,
      image: imageId
        ? `http://localhost:8000/api/productImage/${item.id}`
        : null,
      quantity: quantity,
      choice_value_id: selectedChoiceId,
      choiceDetails: [],
    };

    console.log("Adding to cart with choice_value_id:", selectedChoiceId);

    if (selectedColor) {
      if (!cartItem.choiceDetails) cartItem.choiceDetails = [];
      cartItem.choiceDetails.push({
        type: "color",
        value: selectedColor.name,
      });
      cartItem.color = {
        name: selectedColor.name,
        colorCode: selectedColor.colorCode,
      };
    }

    if (selectedSize) {
      if (!cartItem.choiceDetails) cartItem.choiceDetails = [];
      cartItem.choiceDetails.push({
        type: "size",
        value: selectedSize.name,
      });
      cartItem.size = {
        name: selectedSize.name,
      };
    }

    try {
      addItem(cartItem, quantity, selectedChoiceId);
    } catch (error) {
      console.error("Failed to add to cart:", error);

      if (!error.handled) {
        toast.error(
          "Failed to add to cart: " + (error.message || "Unknown error"),
        );
      }
    }
  };

  const handleQuantityChange = (productId, choiceValueId, newQuantity) => {
    setQuantity(newQuantity);

    if (isProductInCart()) {
      const cartItem = findCartItem();

      if (cartItem) {
        updateQuantity(cartItem.id, cartItem.choice_value_id, newQuantity);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      refreshCart();
    }
  }, [refreshCart]);

  useEffect(() => {}, [cart, product.id, selectedChoiceId]);

  const renderImage = () => {
    if (loadingThumbnails) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      );
    }

    if (mainImageStates.error || !mainImageStates.currentImageId) {
      return (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-2"
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
          <p className="text-gray-600 font-medium">Image not found</p>
        </div>
      );
    }

    return (
      <>
        <Image
          width={200}
          height={100}
          className="w-full h-full peer rounded-md object-cover"
          src={`http://localhost:8000/api/image/${mainImageStates.currentImageId}`}
          alt={product.name || "Product image"}
          crossOrigin="anonymous"
          loading="lazy"
          onLoad={() =>
            setMainImageStates((prev) => ({ ...prev, loaded: true }))
          }
          onError={() =>
            setMainImageStates((prev) => ({ ...prev, error: true }))
          }
        />

        {allImageIds.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-opacity duration-300">
            {allImageIds.map((imgId, idx) => (
              <button
                key={`thumb-${imgId}-${idx}`}
                onClick={() =>
                  setMainImageStates((prev) => ({
                    ...prev,
                    currentImageId: imgId,
                    loaded: false,
                  }))
                }
                className={`w-8 h-8 rounded overflow-hidden border-2 ${
                  imgId === mainImageStates.currentImageId
                    ? "border-blue-500"
                    : "border-white/70"
                }`}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={`http://localhost:8000/api/image/${imgId}`}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                    onLoad={() =>
                      setMainImageStates((prev) => ({ ...prev, loaded: true }))
                    }
                    onError={() =>
                      setMainImageStates((prev) => ({ ...prev, error: true }))
                    }
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  const renderOptions = () => {
    if (loadingChoices) {
      return (
        <div className="mt-2">
          <Skeleton className="h-4 w-20 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      );
    }

    if (!productTypes || productTypes.length === 0) return null;

    try {
      return (
        <div className="space-y-3 mt-4">
          {productTypes.map((type) => (
            <div key={`type-${type.id}`} className="flex flex-col gap-1">
              <p className="text-slate-800 font-medium dark:text-slate-100 capitalize text-sm">
                {type.name}:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {type.values.map((value) => {
                  const isColor = type.name.toLowerCase().includes("color");

                  if (isColor) {
                    return (
                      <TooltipProvider key={`value-${value.id}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`w-7 h-7 rounded-full border ${
                                selectedColor?.valueIds?.some((id) =>
                                  value.valueIds.includes(id),
                                )
                                  ? value.quantity <= 0
                                    ? "ring-2 ring-offset-1 ring-red-500 border-gray-400"
                                    : "ring-2 ring-offset-1 ring-blue-500 border-gray-400"
                                  : value.quantity <= 0
                                    ? "border-gray-300 opacity-50"
                                    : "border-gray-300 hover:border-gray-400"
                              } transition-all`}
                              style={{
                                backgroundColor:
                                  value.colorCode ||
                                  getColorForValue(value.value),
                              }}
                              onClick={() =>
                                handleChoiceSelection(type.id, value)
                              }
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="px-3 py-1.5">
                            <p>{value.value}</p>
                            {value.price && (
                              <p className="text-xs text-gray-500">
                                ${value.price}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  } else {
                    return (
                      <button
                        key={`value-${value.id}`}
                        className={`${
                          selectedSize?.valueIds?.some((id) =>
                            value.valueIds.includes(id),
                          )
                            ? value.quantity <= 0
                              ? "bg-red-100 text-red-800 border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                              : "bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900 dark:text-blue-300 dark:border-cyan-700"
                            : value.quantity <= 0
                              ? "bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700"
                              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                        } px-3 py-1.5 text-sm font-medium capitalize rounded-md border transition-all`}
                        onClick={() => handleChoiceSelection(type.id, value)}
                        title={
                          value.quantity <= 0
                            ? `${value.value} (Out of stock)`
                            : ""
                        }
                      >
                        {value.value}
                        {value.quantity <= 10 && value.quantity > 0 && (
                          <span className="ml-1 text-xs text-amber-600">
                            ({value.quantity} left)
                          </span>
                        )}
                        {value.quantity <= 0 && (
                          <span className="ml-1 text-xs text-red-500">
                            (Out of stock)
                          </span>
                        )}
                      </button>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error("Error rendering product options:", error);
      return null;
    }
  };

  const getColorForValue = (value) => {
    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
      }
      return hash;
    };

    const hash = Math.abs(hashCode(String(value)));
    const h = hash % 360;
    return `hsl(${h}, 70%, 80%)`;
  };

  const inCart = useMemo(() => {
    const result = isProductInCart();

    return result;
  }, [product.id, selectedChoiceId, cart, selectedColor, selectedSize]);

  const renderCartButton = () => {
    if (loadingChoices) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="w-16 h-9" />
          <Skeleton className="w-32 h-9" />
        </div>
      );
    }

    if (activePrice <= 0 || activeQuantity <= 0) {
      return (
        <button
          disabled
          className="relative w-full rounded-lg bg-gray-300 px-6 py-2.5 text-gray-500 cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <CircleX className="h-4 w-4" />
            <span className="text-sm font-medium">
              {activePrice <= 0 ? "Not Available" : "Out of Stock"}
            </span>
          </span>
        </button>
      );
    }

    if (removingFromCart) {
      return (
        <button
          disabled
          className="relative w-full rounded-lg bg-gray-500 px-6 py-2.5 text-white cursor-wait"
        >
          <span className="flex items-center justify-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Removing...</span>
          </span>
        </button>
      );
    }

    if (inCart) {
      return (
        <button
          onClick={async () => {
            const cartItem = findCartItem();
            if (cartItem) {
              try {
                setRemovingFromCart(true);

                await handleRemoveFromCart(
                  cartItem,
                  selectedColor,
                  selectedSize,
                );
              } catch (error) {
                console.error("Error removing item:", error);
                toast.error("Failed to remove item from cart");
              } finally {
                setRemovingFromCart(false);
              }
            } else {
              console.error("Failed to find item in cart to remove");
              toast.error("Could not find this item in your cart");
            }
          }}
          className="group relative w-full overflow-hidden rounded-lg bg-red-500 px-6 py-2.5 transition-all duration-300 ease-in-out hover:bg-red-600"
        >
          <span className="relative flex items-center justify-center gap-2 text-white">
            <Trash2 className="h-4 w-4" />
            <span className="text-sm font-medium">Remove from Cart</span>
          </span>
          <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-red-700 text-white duration-300 group-hover:translate-y-0">
            <Trash2 className="h-4 w-4" />
          </span>
        </button>
      );
    }

    return (
      <div className="w-full flex items-center gap-2">
        <div className="w-1/2 flex items-center justify-center gap-4 border border-gray-300 rounded-lg p-2 dark:border-gray-700">
          <p className="text-gray-500">Quantity</p>
          <QuantityCalculator
            productId={product.id}
            choiceValueId={selectedChoiceId}
            itemQuantity={quantity}
            onQuantityChange={handleQuantityChange}
            max={activeQuantity}
          />
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          className="group relative overflow-hidden w-1/2 rounded-lg bg-cyan-600 px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-cyan-700"
        >
          <span className="relative flex items-center justify-center gap-2 text-white">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">Add to Cart</span>
          </span>
          <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-blue-800 text-white duration-300 group-hover:translate-y-0">
            <ShoppingCart className="h-4 w-4" />
          </span>
        </button>
      </div>
    );
  };

  useEffect(() => {
    setActiveQuantity((prev) => prev);
  }, [selectedColor, selectedSize, product.id, selectedChoiceId, cart]);

  useEffect(() => {
    if (Array.isArray(allImageIds) && allImageIds.length > 0) {
      setMainImageStates((prev) => ({
        ...prev,
        currentImageId: allImageIds[0],
      }));
      setQvImageStates((prev) => ({ ...prev, currentImageId: allImageIds[0] }));
      setQsImageStates((prev) => ({ ...prev, currentImageId: allImageIds[0] }));
    }
  }, [allImageIds]);

  const handleChoiceSelection = (typeId, value) => {
    console.log(value);
    const type = productTypes.find((t) => t.id === typeId);
    if (!type) return;

    const typeName = type.name.toLowerCase();
    const isColorType = typeName.includes("color");
    const typeValueIds = value.valueIds;

    if (
      isColorType &&
      selectedColor?.valueIds?.some((id) => typeValueIds.includes(id))
    ) {
      setSelectedColor(null);

      if (!selectedSize) {
        setSelectedChoiceId(null);
      }
      return;
    }

    if (
      !isColorType &&
      selectedSize?.valueIds?.some((id) => typeValueIds.includes(id))
    ) {
      setSelectedSize(null);

      if (!selectedColor) {
        setSelectedChoiceId(null);
      }
      return;
    }

    if (isColorType) {
      setSelectedColor({
        id: value.id,
        valueIds: value.valueIds,
        name: value.value,
        typeName: type.name,
        colorCode: value.colorCode || getColorForValue(value.value),
      });
    } else {
      setSelectedSize({
        id: value.id,
        valueIds: value.valueIds,
        name: value.value,
        typeName: type.name,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 place-self-center">
      <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center overflow-hidden rounded-md shadow-lg">
        {renderImage()}

        <Heart className="absolute name-4 top-3 left-3 -translate-x-8 cursor-pointer text-white opacity-0 ease-in-out duration-300 hover:translate-x-0 hover:opacity-100 hover:text-rose-500 peer-hover:translate-x-0 peer-hover:opacity-100" />

        <div className="absolute hover:translate-y-0 -translate-y-6 opacity-0 peer-hover:opacity-100 ease-in-out duration-500 peer-hover:translate-y-0 hover:opacity-100 flex flex-col h-24 justify-center gap-4">
          <Dialog
            onOpenChange={(open) => {
              if (!open) {
                setQuantity(1);
              }
            }}
          >
            <DialogTrigger>
              <div className="w-32 hover:hover:bg-zinc-900 duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800 dark:hover:bg-zinc-900">
                <div className="h-16 w-full flex flex-col translate-y-px duration-300 ease-in-out hover:-translate-y-[30px]">
                  <div className="w-full h-1/2 flex justify-center items-center text-gray-900 dark:text-gray-200">
                    Quick view
                  </div>
                  <div className="w-full h-1/2 flex justify-center items-center text-white">
                    <Eye className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
              <div className="w-full absolute h-full flex">
                {loadingThumbnails ? (
                  <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : mainImageStates.error || !mainImageStates.currentImageId ? (
                  <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mb-2"
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
                      <p className="text-gray-600 font-medium">
                        Image not found
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-1/2 h-full bg-slate-100 p-4">
                    <Image
                      className="object-contain"
                      src={`http://localhost:8000/api/image/${qvImageStates.currentImageId}`}
                      alt={product.name}
                      fill
                      crossOrigin="anonymous"
                      onLoad={() =>
                        setQvImageStates((prev) => ({ ...prev, loaded: true }))
                      }
                      onError={() =>
                        setQvImageStates((prev) => ({ ...prev, error: true }))
                      }
                    />

                    {allImageIds.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            handleImageNavigation("qv", "previous")
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 z-10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleImageNavigation("qv", "next")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 z-10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {allImageIds.length > 1 && (
                      <div className="absolute bottom-6 left-0 right-0 px-4">
                        <div className="flex gap-2 overflow-auto scrollbar-thin pb-2 justify-center">
                          {allImageIds.map((imgId, idx) => (
                            <button
                              key={`thumb-qv-${imgId}`}
                              onClick={() =>
                                setQvImageStates((prev) => ({
                                  ...prev,
                                  currentImageId: imgId,
                                  loaded: false,
                                }))
                              }
                              className={`relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden shadow-sm border-2 transition-all 
                                ${
                                  qvImageStates.currentImageId === imgId
                                    ? "border-blue-500 scale-110"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                              <Image
                                src={`http://localhost:8000/api/image/${imgId}`}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                onLoad={() =>
                                  setQvImageStates((prev) => ({
                                    ...prev,
                                    loaded: true,
                                  }))
                                }
                                onError={() =>
                                  setQvImageStates((prev) => ({
                                    ...prev,
                                    error: true,
                                  }))
                                }
                                crossOrigin="anonymous"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-8 w-1/2 flex flex-col gap-2">
                  <div className="w-full justify-between flex flex-col gap-2">
                    <div>
                      {loadingChoices ? (
                        <Skeleton className="h-5 w-20" />
                      ) : activeQuantity > 10 ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          In Stock
                        </span>
                      ) : activeQuantity > 0 ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Low Stock ({activeQuantity} left)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="text-gray-900 transition-colors text-xl dark:text-gray-200">
                      {product.name}
                    </div>
                    <div className="w-full flex flex-col items-start gap-1">
                      {loadingChoices ? (
                        <Skeleton className="h-4 w-16" />
                      ) : (
                        <p className="text-base text-gray-600 transition-colors dark:text-gray-400">
                          ${activePrice}
                        </p>
                      )}
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-600 transition-colors mt-px dark:text-gray-300">
                          {product.rating}
                        </p>
                        <Rating rating={product.rating} size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm dark:text-gray-400">
                    {product.description}

                    {renderOptions()}
                    <div className="flex items-center gap-3 mt-4">
                      {renderCartButton()}
                    </div>
                  </div>
                  <div className="w-full flex justify-center h-full items-center">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex w-52 h-10 justify-center text-slate-900 transition-colors hover:text-cyan-500 cursor-pointer group items-center gap-[6px]"
                    >
                      <p className="font-bold text-[1.2rem]">
                        View full details
                      </p>
                      <ArrowRight className="w-6 transition-all ease-in-out group-hover:translate-x-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            onOpenChange={(open) => {
              if (!open) {
                setQuantity(1);
              } else if (open && allImageIds.length > 0) {
                setQsImageStates((prev) => ({
                  ...prev,
                  currentImageId: allImageIds[0],
                  loaded: false,
                }));
              }
            }}
          >
            <DialogTrigger>
              <div
                className="w-32 hover:bg-[#222] duration-500 overflow-hidden h-9 rounded-xl bg-white dark:bg-gray-800"
                href={`/products/${product.id}`}
              >
                <div className="h-16 w-full flex flex-col translate-y-px duration-300 ease-in-out hover:-translate-y-[30px]">
                  <div className="w-full h-1/2 flex justify-center items-center text-gray-900 dark:text-gray-200">
                    Quick shop
                  </div>
                  <div className="w-full h-1/2 flex justify-center items-center text-white">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="w-auto min-w-[400px] max-w-md h-auto max-h-[90vh] rounded-xl overflow-hidden">
              <DialogTitle className="sr-only">Quick Shop</DialogTitle>
              <div className="w-full flex flex-col justify-between gap-6 p-6 overflow-y-auto max-h-[90vh]">
                <div className="w-full items-start flex gap-6 justify-start">
                  <div className="relative w-[150px] h-[150px]">
                    {!mainImageStates.loaded || loadingThumbnails ? (
                      <Skeleton className="w-full h-full rounded-md" />
                    ) : mainImageStates.error ? (
                      <div className="w-full h-full flex items-center justify-center rounded-md bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
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
                    ) : (
                      <Image
                        className="rounded-md object-cover border border-gray-200"
                        src={`http://localhost:8000/api/image/${qsImageStates.currentImageId}`}
                        alt={product.name}
                        fill
                        crossOrigin="anonymous"
                        onLoad={() =>
                          setQsImageStates((prev) => ({
                            ...prev,
                            loaded: true,
                          }))
                        }
                        onError={() =>
                          setQsImageStates((prev) => ({ ...prev, error: true }))
                        }
                      />
                    )}
                  </div>
                  <div className="justify-between h-[3.25rem] flex flex-col">
                    <p className="text-gray-900 transition-colors font-extrabold dark:text-gray-200">
                      {product.name}
                    </p>
                    <p className="text-gray-600 transition-colors dark:text-gray-400">
                      ${activePrice}
                    </p>
                  </div>
                </div>

                {renderOptions()}

                <div className="w-full flex flex-col items-center gap-4">
                  {renderCartButton()}
                </div>

                <div className="w-full flex justify-center items-center">
                  <Link href={`/products/${product.id}`}>
                    <motion.div
                      whileTap={{
                        border: "1px solid rgb(6 182 212)",
                        borderRadius: "6px",
                      }}
                      transition={{
                        ease: "easeInOut",
                        duration: 0.3,
                      }}
                      className="w-fit flex justify-center hover:text-cyan-500 cursor-pointer group items-center gap-[6px]"
                    >
                      <p className="font-bold group-hover:text-cyan-500 transition-colors duration-300 ease-in-out text-slate-900 text-[1.1rem]">
                        View full details
                      </p>
                      <ArrowRight className="w-6 duration-300 ease-in-out group-hover:translate-x-2" />{" "}
                    </motion.div>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative w-full flex flex-col px-1">
        <Link
          className="w-fit text-gray-900 transition-colors font-semibold hover:underline dark:text-gray-200"
          href={`/products/${product.id}`}
        >
          {product.name}
        </Link>
        <div className="w-full flex justify-between items-start">
          <div className="flex flex-col gap-1">
            {loadingChoices ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <p className="text-gray-600 transition-colors dark:text-gray-400">
                ${activePrice}
              </p>
            )}
            {loadingChoices ? (
              <Skeleton className="h-5 w-20" />
            ) : activeQuantity > 10 ? (
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                In Stock
              </span>
            ) : activeQuantity > 0 ? (
              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                Low Stock ({activeQuantity} left)
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                Out of Stock
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-700 transition-colors mt-px dark:text-gray-300">
              {product.rating}
            </p>
            <Rating rating={product.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}
