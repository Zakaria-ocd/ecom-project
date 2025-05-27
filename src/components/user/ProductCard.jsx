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

  // Fetch product images
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
          `http://localhost:8000/api/productImages/${product.id}`
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

  // Fetch product choices/options
  useEffect(() => {
    if (!product?.id) return;

    const fetchProductChoices = async () => {
      setLoadingChoices(true);
      try {
        // Use the RESTful endpoint structure
        const response = await fetch(
          `http://localhost:8000/api/products/${product.id}/choices`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch choices: ${response.status}`);
        }

        const responseData = await response.json();

        // Load product choices response data

        // Check if the data is in the expected format
        const data = responseData.data || responseData;

        // Process the choices data based on the API response structure
        if (data && Array.isArray(data)) {
          // Create a direct mapping of choiceId to price and quantity for later lookup
          const choicePriceMap = {};
          data.forEach((choice) => {
            if (
              choice.id &&
              choice.price !== undefined &&
              choice.quantity !== undefined
            ) {
              choicePriceMap[choice.id] = {
                price: choice.price,
                quantity: choice.quantity,
              };
            }
          });

          // Store this mapping for later price/quantity lookups

          // Process types and options for display
          const typeMap = new Map(); // Use a Map to efficiently group by type

          // Group choices by type
          data.forEach((choice) => {
            // Extract type information from choice
            if (choice.typeValuePairs && Array.isArray(choice.typeValuePairs)) {
              choice.typeValuePairs.forEach((pair) => {
                const typeId = pair.typeId;
                const typeName = pair.typeName || `Type ${typeId}`;

                if (!typeMap.has(typeId)) {
                  typeMap.set(typeId, {
                    id: typeId,
                    name: typeName,
                    values: [],
                  });
                }

                // Add this value if it doesn't exist
                const type = typeMap.get(typeId);
                const existingValueIndex = type.values.findIndex(
                  (v) => v.id === pair.valueId
                );

                if (existingValueIndex === -1) {
                  // Add new value
                  type.values.push({
                    id: pair.valueId,
                    value: pair.value || `Option ${pair.valueId}`,
                    choiceId: choice.id,
                    colorCode: pair.colorCode,
                    price: choice.price,
                    quantity: choice.quantity,
                    available: choice.quantity > 0,
                    // Store the original choice for validation later
                    originalChoice: choice,
                  });
                } else if (type.values[existingValueIndex]) {
                  // Value exists but might be for a different choice
                  // Keep both so we maintain all possible combinations
                  type.values.push({
                    id: pair.valueId,
                    value: pair.value || `Option ${pair.valueId}`,
                    choiceId: choice.id,
                    colorCode: pair.colorCode,
                    price: choice.price,
                    quantity: choice.quantity,
                    available: choice.quantity > 0,
                    // Store the original choice for validation later
                    originalChoice: choice,
                  });
                }
              });
            }
          });

          // Convert the Map to an array
          const processed = Array.from(typeMap.values());

          setProductTypes(processed);

          // Default selections - select first available choice of each type
          const defaultSelections = {};
          const selectedTypes = {};

          processed.forEach((type) => {
            // Find first available choice (quantity > 0)
            const availableChoice = type.values.find(
              (value) => value.quantity > 0
            );

            if (availableChoice) {
              // Store by type name (color, size, etc.)
              const typeName = type.name.toLowerCase();

              if (typeName.includes("color")) {
                setSelectedColor({
                  id: availableChoice.choiceId,
                  name: availableChoice.value,
                  colorCode:
                    availableChoice.colorCode ||
                    getColorForValue(availableChoice.value),
                });
                selectedTypes.color = true;
              } else if (typeName.includes("size")) {
                setSelectedSize({
                  id: availableChoice.choiceId,
                  name: availableChoice.value,
                });
                selectedTypes.size = true;
              }

              // Track the selected choice ID (will use the last one if multiple types selected)
              defaultSelections.choiceId = availableChoice.choiceId;
              defaultSelections.price = availableChoice.price;
              defaultSelections.quantity = availableChoice.quantity;
            }
          });

          // Set selected choice ID if we found any defaults
          if (defaultSelections.choiceId) {
            setSelectedChoiceId(defaultSelections.choiceId);

            // Set price and quantity from the selected choice
            if (defaultSelections.price !== undefined) {
              setActivePrice(defaultSelections.price);
            }

            if (defaultSelections.quantity !== undefined) {
              setActiveQuantity(defaultSelections.quantity);
            }
          } else {
            // No available choices found, use product defaults
            setActivePrice(product.price || 0);
            setActiveQuantity(product.quantity || 0);

            // Clear selections
            setSelectedColor(null);
            setSelectedSize(null);
            setSelectedChoiceId(null);

            // Show toast notification that no choices are available
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

        // Show error toast
        toast.error("Could not load product options", {
          description: "Please try again later",
          duration: 3000,
        });

        // Fallback to product defaults
        setActivePrice(product.price || 0);
        setActiveQuantity(product.quantity || 0);
      } finally {
        setLoadingChoices(false);
      }
    };

    fetchProductChoices();
  }, [product.id, product.price, product.quantity]);

  // Helper function to validate if the current combination of choices is valid
  const validateChoiceCombination = useCallback(() => {
    // If no choices selected, return default product values
    if (!selectedColor && !selectedSize) {
      return {
        valid: true,
        price: product.price || 0,
        quantity: product.quantity || 0,
        choiceId: null,
        message: null,
      };
    }

    // Get all choices from API data
    const choices = [];
    productTypes.forEach((type) => {
      type.values.forEach((value) => {
        // Find the complete choice object
        const choiceData = value.originalChoice;
        if (choiceData && !choices.find((c) => c.id === choiceData.id)) {
          choices.push(choiceData);
        }
      });
    });

    // Find a variant where all type-value pairs match exactly
    const exactMatchingChoice = choices.find((choice) => {
      // Skip if no typeValuePairs
      if (!choice.typeValuePairs || !Array.isArray(choice.typeValuePairs)) {
        return false;
      }

      // Count how many types are in this variant
      const variantTypeCount = choice.typeValuePairs.length;

      // Count how many types the user has selected
      const selectedTypeCount =
        (selectedColor ? 1 : 0) + (selectedSize ? 1 : 0);

      // If the counts don't match, this can't be an exact match
      if (variantTypeCount !== selectedTypeCount) {
        return false;
      }

      // Check if all selected values match this variant's values exactly
      let allTypesMatch = true;

      // Check if color is required and matches
      const hasColorType = choice.typeValuePairs.some(
        (pair) => pair.typeName.toLowerCase() === "color"
      );

      if (hasColorType) {
        // If variant has color type, user must have selected color
        if (!selectedColor) {
          return false;
        }

        // Find the color pair in this variant
        const colorPair = choice.typeValuePairs.find(
          (pair) => pair.typeName.toLowerCase() === "color"
        );

        // Check if selected color matches variant's color
        if (
          !colorPair ||
          colorPair.value.toLowerCase() !== selectedColor.name.toLowerCase()
        ) {
          return false;
        }
      } else if (selectedColor) {
        // If variant doesn't have color but user selected color, not a match
        return false;
      }

      // Check if size is required and matches
      const hasSizeType = choice.typeValuePairs.some(
        (pair) => pair.typeName.toLowerCase() === "size"
      );

      if (hasSizeType) {
        // If variant has size type, user must have selected size
        if (!selectedSize) {
          return false;
        }

        // Find the size pair in this variant
        const sizePair = choice.typeValuePairs.find(
          (pair) => pair.typeName.toLowerCase() === "size"
        );

        // Check if selected size matches variant's size
        if (
          !sizePair ||
          sizePair.value.toLowerCase() !== selectedSize.name.toLowerCase()
        ) {
          return false;
        }
      } else if (selectedSize) {
        // If variant doesn't have size but user selected size, not a match
        return false;
      }

      return allTypesMatch;
    });

    // If we found an exact match, return it
    if (exactMatchingChoice) {
      return {
        valid: true,
        price: exactMatchingChoice.price || product.price || 0,
        quantity: exactMatchingChoice.quantity || 0,
        choiceId: exactMatchingChoice.id,
        message: null,
      };
    }

    // If no match found, return invalid with a message
    let message = "Please select all required options for this variant";

    // Find the closest variant to suggest better options
    if (selectedColor || selectedSize) {
      // Find any variants that contain the selected color
      if (selectedColor) {
        const variantsWithColor = choices.filter((choice) =>
          choice.typeValuePairs?.some(
            (pair) =>
              pair.typeName.toLowerCase() === "color" &&
              pair.value.toLowerCase() === selectedColor.name.toLowerCase()
          )
        );

        if (variantsWithColor.length > 0) {
          const suggestedSizes = variantsWithColor
            .map(
              (v) =>
                v.typeValuePairs?.find(
                  (pair) => pair.typeName.toLowerCase() === "size"
                )?.value
            )
            .filter(Boolean);

          if (suggestedSizes.length > 0) {
            message = `"${selectedColor.name}" color is available with size${
              suggestedSizes.length > 1 ? "s" : ""
            }: ${suggestedSizes.join(", ")}`;
          }
        } else {
          message = `"${selectedColor.name}" color is not available for this product`;
        }
      }

      // Find any variants that contain the selected size
      if (selectedSize && !message.includes("available with")) {
        const variantsWithSize = choices.filter((choice) =>
          choice.typeValuePairs?.some(
            (pair) =>
              pair.typeName.toLowerCase() === "size" &&
              pair.value.toLowerCase() === selectedSize.name.toLowerCase()
          )
        );

        if (variantsWithSize.length > 0) {
          const suggestedColors = variantsWithSize
            .map(
              (v) =>
                v.typeValuePairs?.find(
                  (pair) => pair.typeName.toLowerCase() === "color"
                )?.value
            )
            .filter(Boolean);

          if (suggestedColors.length > 0) {
            message = `"${selectedSize.name}" size is available with color${
              suggestedColors.length > 1 ? "s" : ""
            }: ${suggestedColors.join(", ")}`;
          }
        } else {
          message = `"${selectedSize.name}" size is not available for this product`;
        }
      }
    }

    return {
      valid: false,
      price: product.price || 0,
      quantity: 0, // Set quantity to 0 for unavailable combinations
      choiceId: null,
      message,
    };
  }, [selectedColor, selectedSize, product, productTypes]);

  // Effect to validate and update price/quantity when color or size selections change
  useEffect(() => {
    // Validate the current combination of selections
    const validation = validateChoiceCombination();

    // Update UI state based on validation result
    setActivePrice(validation.price);
    setActiveQuantity(validation.quantity);
    setSelectedChoiceId(validation.choiceId);

    // No toast notification for invalid combinations - UI will show availability state
  }, [
    selectedColor,
    selectedSize,
    product.price,
    product.quantity,
    validateChoiceCombination,
  ]);

  // Helper functions
  const generateCartItemId = (productId, selectedColor, selectedSize) => {
    return `${productId}-${selectedColor?.id || "no-color"}-${
      selectedSize?.id || "no-size"
    }`;
  };

  // Helper function to find a cart item based on current selections
  const findCartItem = () => {
    if (!cart || !Array.isArray(cart)) {
      return null;
    }

    return cart.find((item) => {
      // Check product ID first
      if (item.productId !== product.id && item.product_id !== product.id)
        return false;

      // For products with choice_value_id, compare directly
      if (selectedChoiceId && item.choice_value_id) {
        return selectedChoiceId === item.choice_value_id;
      }

      // Check if this is a product with no choices/variants
      const isSimpleProduct =
        (!item.choiceDetails || item.choiceDetails.length === 0) &&
        !selectedColor &&
        !selectedSize;

      if (isSimpleProduct) {
        return true; // Simple product match
      }

      // If we have color and size selections, check if both match
      if (selectedColor && selectedSize) {
        // Check choiceDetails for exact match
        const hasMatchingColor = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "color" &&
            detail.value === selectedColor.name
        );

        const hasMatchingSize = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "size" &&
            detail.value === selectedSize.name
        );

        return hasMatchingColor && hasMatchingSize;
      }

      // If only color is selected
      if (selectedColor && !selectedSize) {
        // Check if cart item only has color and matches selected color
        const hasMatchingColor = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "color" &&
            detail.value === selectedColor.name
        );

        // Cart item should only have color details (no size)
        const hasSizeDetail = item.choiceDetails?.some(
          (detail) => detail.type?.toLowerCase() === "size"
        );

        return hasMatchingColor && !hasSizeDetail;
      }

      // If only size is selected
      if (!selectedColor && selectedSize) {
        // Check if cart item only has size and matches selected size
        const hasMatchingSize = item.choiceDetails?.some(
          (detail) =>
            detail.type?.toLowerCase() === "size" &&
            detail.value === selectedSize.name
        );

        // Cart item should only have size details (no color)
        const hasColorDetail = item.choiceDetails?.some(
          (detail) => detail.type?.toLowerCase() === "color"
        );

        return hasMatchingSize && !hasColorDetail;
      }

      return false;
    });
  };

  // Check if item is in cart based on productId and combination of color/size
  const isProductInCart = () => {
    if (!cart || !Array.isArray(cart)) return false;

    // Get exact matches from cart
    return cart.some((item) => {
      // Check product ID first
      if (item.productId !== product.id && item.product_id !== product.id)
        return false;

      // For products with choice_value_id, compare directly
      if (selectedChoiceId && item.choice_value_id) {
        return selectedChoiceId === item.choice_value_id;
      }

      // Check if this is a product with no choices/variants
      const isSimpleProduct =
        (!item.choiceDetails || item.choiceDetails.length === 0) &&
        !selectedColor &&
        !selectedSize;

      if (isSimpleProduct) {
        return true; // Simple product match
      }

      // If user has made selections, require those selections to match
      if (selectedColor || selectedSize) {
        // For exact variant matching

        // If we have color and size selections, check if both match
        if (selectedColor && selectedSize) {
          // Check choiceDetails for exact match
          const hasMatchingColor = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "color" &&
              detail.value === selectedColor.name
          );

          const hasMatchingSize = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "size" &&
              detail.value === selectedSize.name
          );

          return hasMatchingColor && hasMatchingSize;
        }

        // If only color is selected
        if (selectedColor && !selectedSize) {
          // Check if cart item only has color and matches selected color
          const hasMatchingColor = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "color" &&
              detail.value === selectedColor.name
          );

          // Cart item should only have color details (no size)
          const hasSizeDetail = item.choiceDetails?.some(
            (detail) => detail.type?.toLowerCase() === "size"
          );

          return hasMatchingColor && !hasSizeDetail;
        }

        // If only size is selected
        if (!selectedColor && selectedSize) {
          // Check if cart item only has size and matches selected size
          const hasMatchingSize = item.choiceDetails?.some(
            (detail) =>
              detail.type?.toLowerCase() === "size" &&
              detail.value === selectedSize.name
          );

          // Cart item should only have size details (no color)
          const hasColorDetail = item.choiceDetails?.some(
            (detail) => detail.type?.toLowerCase() === "color"
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

    // Make sure we have at least one image to use
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
      price: activePrice, // Use the state variable
      rating: item.rating,
      image: imageId
        ? `http://localhost:8000/api/productImage/${item.id}`
        : `http://localhost:8000/api/productImage/${item.id}`,
      quantity: quantity,
      choice_value_id: selectedChoiceId,
      choiceDetails: [],
    };

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
      // addItem already shows success toast, no need for duplicate
      addItem(cartItem, quantity, selectedChoiceId);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Only show error toast if addItem didn't already handle it
      if (!error.handled) {
        toast.error(
          "Failed to add to cart: " + (error.message || "Unknown error")
        );
      }
    }
  };

  const handleQuantityChange = (productId, choiceValueId, newQuantity) => {
    setQuantity(newQuantity);

    // If product is already in cart, update its quantity
    if (isProductInCart()) {
      // Find the actual cart item based on color and size selections
      const cartItem = findCartItem();

      if (cartItem) {
        updateQuantity(cartItem.id, cartItem.choice_value_id, newQuantity);
      }
    }
  };

  // Refresh cart data at regular intervals
  useEffect(() => {
    if (isAuthenticated()) {
      refreshCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCart]);

  // Refresh component when cart changes
  useEffect(() => {
    // This effect runs whenever the cart changes
    // Force re-render by updating a state variable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, product.id, selectedChoiceId]);

  // Render functions
  const renderImage = () => {
    // Show skeleton only during initial load or thumbnail fetch
    if (loadingThumbnails) {
      return (
        <div className="absolute inset-0 w-full h-full">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      );
    }

    // Show error placeholder if no images or error loading images
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

        {/* Image thumbnails - shown on hover */}
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

  // Use the fetched types for rendering options
  const groupChoicesByAttribute = () => {
    return productTypes.reduce((acc, type) => {
      // Add null check for type.name
      if (!type || !type.name) {
        console.warn("Invalid type found in productTypes:", type);
        return acc;
      }

      const typeName = type.name.toLowerCase();
      acc[typeName] = type.values.map((value) => ({
        value: value.value,
        choiceId: value.choiceId,
        colorCode: value.colorCode,
      }));
      return acc;
    }, {});
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

    // Debug data

    if (!productTypes || productTypes.length === 0) return null;

    // Use try-catch to handle any unexpected errors in attribute processing
    try {
      // Render each type of attribute (regardless of name)
      return (
        <div className="space-y-3 mt-4">
          {productTypes.map((type) => (
            <div key={`type-${type.id}`} className="flex flex-col gap-1">
              <p className="text-slate-800 font-medium dark:text-slate-100 capitalize text-sm">
                {type.name}:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {type.values.map((value) => {
                  // Check if this could be a color (has colorCode property or name contains 'color')
                  const isColor =
                    value.colorCode ||
                    type.name.toLowerCase().includes("color");

                  if (isColor) {
                    return (
                      <TooltipProvider
                        key={`value-${value.id}-${value.choiceId}`}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={`w-7 h-7 rounded-full border ${
                                selectedColor?.id === value.choiceId
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
                              title={
                                value.quantity <= 0
                                  ? `${value.value} (Out of stock)`
                                  : value.value
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
                    // Render as standard button (for size, type, etc.)
                    return (
                      <button
                        key={`value-${value.id}-${value.choiceId}`}
                        className={`${
                          selectedSize?.id === value.choiceId
                            ? value.quantity <= 0
                              ? "bg-red-100 text-red-800 border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                              : "bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
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

  // Helper function for generating colors when colorCode is missing
  const getColorForValue = (value) => {
    // Simple hash function to get a consistent color for the same value
    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    };

    // Generate a pastel color based on the hash
    const hash = Math.abs(hashCode(String(value)));
    const h = hash % 360;
    return `hsl(${h}, 70%, 80%)`;
  };

  // Use useMemo to recalculate inCart whenever dependencies change
  const inCart = useMemo(() => {
    // Use our local check based on productId and choice_value_id
    const result = isProductInCart();

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, selectedChoiceId, cart, selectedColor, selectedSize]);

  // Render add/remove cart button
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
            <i className="fa-regular fa-circle-xmark"></i>
            <span className="text-sm font-medium">
              {activePrice <= 0 ? "Not Available" : "Out of Stock"}
            </span>
          </span>
        </button>
      );
    }

    // Show a loading state when removal is in progress
    if (removingFromCart) {
      return (
        <button
          disabled
          className="relative w-full rounded-lg bg-gray-500 px-6 py-2.5 text-white cursor-wait"
        >
          <span className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner animate-spin"></i>
            <span className="text-sm font-medium">Removing...</span>
          </span>
        </button>
      );
    }

    if (inCart) {
      return (
        <button
          onClick={async () => {
            // Find the cart item to remove based on color and size
            const cartItem = findCartItem();
            if (cartItem) {
              try {
                // Set removing state to true to show loading state
                setRemovingFromCart(true);

                // Call handleRemoveFromCart with the correct parameters

                await handleRemoveFromCart(
                  cartItem,
                  selectedColor,
                  selectedSize
                );
              } catch (error) {
                console.error("Error removing item:", error);
                toast.error("Failed to remove item from cart");
              } finally {
                // Always reset the removing state
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
            <i className="fa-regular fa-trash-can"></i>
            <span className="text-sm font-medium">Remove from Cart</span>
          </span>
          <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-red-700 text-white duration-300 group-hover:translate-y-0">
            <i className="fa-regular fa-trash-can"></i>
          </span>
        </button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <QuantityCalculator
          productId={product.id}
          choiceValueId={selectedChoiceId}
          itemQuantity={quantity}
          onQuantityChange={handleQuantityChange}
          max={activeQuantity}
        />
        <button
          onClick={() => handleAddToCart(product)}
          className="group relative overflow-hidden rounded-lg bg-blue-600 px-6 py-2.5 transition-all duration-300 ease-in-out hover:bg-blue-700"
        >
          <span className="relative flex items-center justify-center gap-2 text-white">
            <i className="fa-regular fa-cart-plus"></i>
            <span className="text-sm font-medium">Add to Cart</span>
          </span>
          <span className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-blue-800 text-white duration-300 group-hover:translate-y-0">
            <i className="fa-regular fa-cart-plus"></i>
          </span>
        </button>
      </div>
    );
  };

  // Recalculate cart status whenever selectedColor or selectedSize changes
  useEffect(() => {
    // Force re-evaluation of cart status when options change

    // Trigger a re-render to update UI
    setActiveQuantity((prev) => prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Function to handle selection of a choice value from any type
  const handleChoiceSelection = (typeId, value) => {
    // Get the type information
    const type = productTypes.find((t) => t.id === typeId);
    if (!type) return;

    const typeName = type.name.toLowerCase();
    const isColorType = typeName.includes("color");
    const isSizeType = typeName.includes("size");

    // Check if this is a deselection (clicking already selected item)
    if (isColorType && selectedColor?.id === value.choiceId) {
      setSelectedColor(null);
      // If this was the only selection, reset choiceId
      if (!selectedSize) {
        setSelectedChoiceId(null);
      }
      return;
    }

    if (isSizeType && selectedSize?.id === value.choiceId) {
      setSelectedSize(null);
      // If this was the only selection, reset choiceId
      if (!selectedColor) {
        setSelectedChoiceId(null);
      }
      return;
    }

    // Always update the selectedChoiceId when a choice is selected
    if (value.choiceId) {
      setSelectedChoiceId(value.choiceId);
    }

    // This is a new selection
    if (isColorType) {
      // If selecting a color
      setSelectedColor({
        id: value.choiceId,
        name: value.value,
        colorCode: value.colorCode || getColorForValue(value.value),
        available: value.quantity > 0,
      });
    } else if (isSizeType) {
      // If selecting a size
      setSelectedSize({
        id: value.choiceId,
        name: value.value,
        available: value.quantity > 0,
      });
    }

    // The useEffect will handle validation of the new combination
  };

  return (
    <div className="w-full flex flex-col gap-4 place-self-center">
      <div className="w-full relative h-[350px] sm:h-72 flex flex-col justify-center items-center overflow-hidden rounded-md shadow-lg">
        {/* Product image with thumbnails */}
        {renderImage()}

        {/* Heart icon */}
        <i className="fa-solid fa-heart text-white absolute name-4 top-3 left-3 opacity-0 cursor-pointer peer-hover:opacity-100 ease-in-out duration-300 peer-hover:translate-x-0 hover:translate-x-0 -translate-x-8 hover:opacity-100 hover:text-rose-500" />

        {/* Quick view and quick shop buttons */}
        <div className="absolute hover:translate-y-0 -translate-y-6 opacity-0 peer-hover:opacity-100 ease-in-out duration-500 peer-hover:translate-y-0 hover:opacity-100 flex flex-col h-24 justify-center gap-4">
          {/* Quick view dialog button */}
          <Dialog
            onOpenChange={(open) => {
              // Don't reset choices when dialog is closed to preserve user selections
              if (!open) {
                // Only reset quantity to 1 for a better UX when reopening
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
                    <i className="fa-light fa-eye"></i>
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
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button
                          onClick={() => handleImageNavigation("qv", "next")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 z-10"
                        >
                          <i className="fa-solid fa-chevron-right"></i>
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
                <div className="p-8 w-1/2 flex flex-col gap-[26px]">
                  <div className="w-full justify-between h-[3.25rem] flex flex-col gap-2">
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
                    <div className="text-gray-900 transition-colors font-extrabold dark:text-gray-200">
                      {product.name}
                    </div>
                    <div className="w-full flex justify-between items-center">
                      {loadingChoices ? (
                        <Skeleton className="h-4 w-16" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <p className="text-gray-600 transition-colors dark:text-gray-400">
                            ${activePrice}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-700 transition-colors mt-px dark:text-gray-300">
                          {product.rating}
                        </p>
                        <Rating rating={product.rating} starClass="text-xs" />
                      </div>
                    </div>
                  </div>
                  <div className="text-[#878787] text-[0.85rem] transition-colors dark:text-gray-500">
                    {product.description}
                    {/* Product options */}
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
                      <i className="fa-solid fa-arrow-right-long w-6 transition-all group-hover:translate-x-2 ease-in-out"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            onOpenChange={(open) => {
              // Don't reset choices when dialog is closed to preserve user selections
              if (!open) {
                // Only reset quantity to 1 for a better UX when reopening
                setQuantity(1);
              } else if (open && allImageIds.length > 0) {
                // Set the first image when opening quick shop
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
                    <i className="fa-light fa-cart-plus"></i>
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

                    {/* Thumbnails removed to show just one image */}
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

                {/* Product options using the same render function as in quick view */}
                {renderOptions()}

                {/* Add to cart section */}
                <div className="w-full flex flex-col items-center gap-4">
                  {renderCartButton()}
                </div>

                {/* View details link */}
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
                      <i className="fa-solid fa-arrow-right-long w-6 group-hover:translate-x-2 ease-in-out duration-300"></i>{" "}
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
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            {loadingChoices ? (
              <Skeleton className="h-4 w-16 mb-1" />
            ) : (
              <div className="flex items-center gap-1">
                <p className="text-gray-600 transition-colors dark:text-gray-400">
                  ${activePrice}
                </p>
              </div>
            )}
            <div className="mt-1">
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
          </div>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-700 transition-colors mt-px dark:text-gray-300">
              {product.rating}
            </p>
            <Rating rating={product.rating} starClass="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
