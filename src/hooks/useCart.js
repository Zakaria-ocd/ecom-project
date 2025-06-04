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

const CART_UPDATED_EVENT = "cart_updated";

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

  useEffect(() => {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [cart]);

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

  useEffect(() => {
    const handleCartUpdated = () => {
      loadCart();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);

    loadCart();

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, [loadCart]);

  const addItem = async (product, quantity = 1, choiceValueId = null) => {
    try {
      if (product.types && product.types.length > 0 && !choiceValueId) {
        product.requiresChoice = true;
      }

      const tempItem = {
        product_id: product.productId || product.id,
        quantity,
        choice_value_id: choiceValueId,

        id: isAuthenticated() ? null : Date.now(),
      };

      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) =>
            item.product_id === (product.productId || product.id) &&
            ((choiceValueId === null && item.choice_value_id === null) ||
              (choiceValueId !== null &&
                item.choice_value_id === choiceValueId))
        );

        if (existingItemIndex !== -1) {
          return prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevCart, tempItem];
        }
      });

      const result = await addToCart(product, quantity, choiceValueId);

      await loadCart();

      toast.success(`${product.name} added to cart`);
      return result;
    } catch (error) {
      setError(error.message || "Failed to add item to cart");

      await loadCart();
    }
  };

  const removeItem = async (cartItemId, choiceValueId = null) => {
    try {
      if (!cart || cart.length === 0) {
        return;
      }

      console.log("Removing item:", { cartItemId, choiceValueId });

      const itemToRemove = cart.find((item) => {
        if (isAuthenticated()) {
          return item.id === cartItemId;
        } else {
          return (
            item.product_id === cartItemId &&
            ((choiceValueId === null && item.choice_value_id === null) ||
              (choiceValueId !== null &&
                item.choice_value_id === choiceValueId))
          );
        }
      });

      if (!itemToRemove) {
        console.warn(
          `Cart item not found: id=${cartItemId}, choice=${choiceValueId}`
        );
        return;
      }

      setCart((prevCart) => {
        if (isAuthenticated()) {
          return prevCart.filter((item) => item.id !== cartItemId);
        } else {
          return prevCart.filter(
            (item) =>
              !(
                item.product_id === cartItemId &&
                ((choiceValueId === null && item.choice_value_id === null) ||
                  (choiceValueId !== null &&
                    item.choice_value_id === choiceValueId))
              )
          );
        }
      });

      await removeFromCartAPI(cartItemId, choiceValueId);

      await loadCart();
    } catch (err) {
      console.error("Error removing from cart:", err);

      await loadCart();
    }
  };

  const updateQuantity = async (productId, choiceValueId = null, quantity) => {
    if (!quantity || quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

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

      await loadCart();
    } catch (error) {
      await loadCart();
      setError("Failed to update quantity");
    }
  };

  const clearCart = useCallback(async () => {
    setCart([]);
    saveCartToLocalStorage([]);
    toast.info("Cart cleared");

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
