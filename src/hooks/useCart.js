import { useState, useEffect, useCallback } from "react";
import {
  addToCart,
  updateCartItemQuantity,
  fetchCart,
  saveCartToLocalStorage,
  removeFromCart as removeFromCartAPI,
} from "../lib/cart";
import { isAuthenticated, getAuthToken } from "../lib/auth";
import { toast } from "sonner";

// Create a custom event for cart updates
const CART_UPDATED_EVENT = "cart_updated";

// Function to notify all components about cart changes
export const notifyCartUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }
};

export default function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate totals whenever cart changes
  useEffect(() => {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [cart]);

  // Fetch cart on mount and when auth status changes
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const cartData = await fetchCart();
      setCart(cartData);
    } catch (error) {
      setError("Failed to load your cart");
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdated = () => {
      loadCart();
    };

    // Add event listener for cart updates
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);

    // Initial cart load
    loadCart();

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, [loadCart]);

  // Add item to cart
  const addItem = async (product, quantity = 1, choiceValueId = null) => {
    try {
      // Validate that we have a choice value ID if the product requires choices
      if (product.types && product.types.length > 0 && !choiceValueId) {
        product.requiresChoice = true;
      }

      // Optimistically update the UI for all users
      const tempItem = {
        product_id: product.productId || product.id,
        product: product,
        quantity,
        price: product.price || product.default_price,
        choice_value_id: choiceValueId,
        choiceDetails: product.choiceDetails || [],
        id: isAuthenticated() ? null : Date.now(), // Temporary ID for optimistic update
      };

      // Update cart optimistically (checking for duplicates)
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) =>
            item.product_id === (product.productId || product.id) &&
            ((choiceValueId === null && item.choice_value_id === null) ||
              (choiceValueId !== null &&
                item.choice_value_id === choiceValueId))
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          return prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          return [...prevCart, tempItem];
        }
      });

      // Make the actual API call without setting loading state
      const result = await addToCart(product, quantity, choiceValueId);

      // Always refresh cart after any operation to ensure consistency
      await loadCart();

      // Product-specific toast is more helpful than generic one in cart.js
      toast.success(`${product.name} added to cart`);
      return result;
    } catch (error) {
      setError(error.message || "Failed to add item to cart");
      // Toast handled in cart.js

      // On error, refresh cart to ensure correct state
      await loadCart();
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId) => {
    try {
      // If no cart exists, there's nothing to remove
      if (!cart || cart.length === 0) {
        return;
      }

      // Find the cart item to remove (for optimistic update)
      const itemToRemove = cart.find((item) => item.id === cartItemId);

      if (!itemToRemove) {
        console.warn(`Cart item with ID ${cartItemId} not found`);
        return;
      }

      // Optimistic update - remove locally first
      setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));

      // Call the API to remove the item
      await removeFromCartAPI(cartItemId);

      // Always refresh cart after operation to ensure consistency
      await loadCart();

      // Toast handled in cart.js
    } catch (err) {
      console.error("Error removing from cart:", err);
      // Toast handled in cart.js

      // Refresh cart to restore correct state
      await loadCart();
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, choiceValueId = null, quantity) => {
    // Validate quantity is a positive number
    if (!quantity || quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    // First update the UI optimistically
    if (!isAuthenticated()) {
      setCart((prevCart) =>
        prevCart.map((item) => {
          const matchesProduct = item.product_id === productId;
          const matchesChoice =
            (choiceValueId === null && item.choice_value_id === null) ||
            (choiceValueId !== null && item.choice_value_id === choiceValueId);

          if (matchesProduct && matchesChoice) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    } else {
      // For authenticated users, find by cart item ID in the UI and update optimistically
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (
            item.id === productId ||
            (item.product_id === productId &&
              ((choiceValueId === null && item.choice_value_id === null) ||
                (choiceValueId !== null &&
                  item.choice_value_id === choiceValueId)))
          ) {
            return { ...item, quantity };
          }
          return item;
        })
      );
    }

    try {
      await updateCartItemQuantity(productId, choiceValueId, quantity);

      // Always refresh cart after any operation to ensure consistency
      await loadCart();
    } catch (error) {
      // If the API call fails, reload the cart to get the correct state
      await loadCart();
      setError("Failed to update quantity");
      // Toast handled in cart.js
    }
  };

  // Clear entire cart
  const clearCart = useCallback(async () => {
    setCart([]);
    saveCartToLocalStorage([]);
    toast.info("Cart cleared");

    // Refresh cart after clearing
    await loadCart();
  }, [loadCart]);

  return {
    cart,
    loading,
    error,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart: loadCart,
  };
}
