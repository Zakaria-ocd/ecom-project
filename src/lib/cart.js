import { getAuthToken, isAuthenticated } from "./auth";
import { toast } from "sonner";
import { notifyCartUpdated } from "@/hooks/useCart";

export const saveCartToLocalStorage = (cart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart_items", JSON.stringify(cart));

  notifyCartUpdated();
};

export const getCartFromLocalStorage = () => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart_items");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = async (
  product,
  quantity = 1,
  choiceValueId = null
) => {
  try {
    if (!product) {
      throw new Error("Invalid product");
    }

    if (product.price <= 0) {
      throw new Error("This product is not available for purchase");
    }

    if (product.quantity <= 0) {
      throw new Error("This product is out of stock");
    }

    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    if (product.requiresChoice && !choiceValueId) {
      throw new Error("Please select all required options");
    }

    if (isAuthenticated()) {
      const token = getAuthToken();
      const response = await fetch("http://localhost:8000/api/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.productId || product.id,
          quantity,
          choice_value_id: choiceValueId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      notifyCartUpdated();

      return data.cart_item;
    } else {
      const cart = getCartFromLocalStorage();

      const existingItemIndex = cart.findIndex(
        (item) =>
          item.product_id === (product.productId || product.id) &&
          ((choiceValueId === null && item.choice_value_id === null) ||
            (choiceValueId !== null && item.choice_value_id === choiceValueId))
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push({
          id: Date.now().toString(),
          product_id: product.productId || product.id,
          quantity,
          choice_value_id: choiceValueId,
        });
      }

      saveCartToLocalStorage(cart);
      return cart;
    }
  } catch (error) {
    toast.error(error.message || "Failed to add to cart");
    throw error;
  }
};

export const removeFromCart = async (cartItemId, choiceValueId = null) => {
  try {
    if (isAuthenticated()) {
      const response = await fetch("http://localhost:8000/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          cart_item_id: cartItemId,
          choice_value_id: choiceValueId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status}`);
      }

      notifyCartUpdated();

      return await fetchCart();
    } else {
      const currentCart = getCartFromLocalStorage();

      const updatedCart = currentCart.filter((item) => {
        if (choiceValueId) {
          return !(
            item.id === cartItemId && item.choice_value_id === choiceValueId
          );
        }
        return item.id !== cartItemId;
      });

      saveCartToLocalStorage(updatedCart);

      notifyCartUpdated();

      return updatedCart;
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  productId,
  choiceValueId = null,
  quantity
) => {
  try {
    if (isAuthenticated()) {
      const token = getAuthToken();
      const response = await fetch("http://localhost:8000/api/cart/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_item_id: productId,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update cart");
      }

      notifyCartUpdated();

      toast.success("Cart updated");
      return data.cart_item;
    } else {
      const cart = getCartFromLocalStorage();

      const updatedCart = cart.map((item) => {
        const matchesProduct = item.product_id === productId;
        const matchesChoice =
          (choiceValueId === null && item.choice_value_id === null) ||
          (choiceValueId !== null && item.choice_value_id === choiceValueId);

        if (matchesProduct && matchesChoice) {
          return { ...item, quantity };
        }
        return item;
      });

      saveCartToLocalStorage(updatedCart);
      toast.success("Cart updated");
      return updatedCart;
    }
  } catch (error) {
    console.error("Update cart error:", error);
    toast.error("Failed to update quantity");
    throw error;
  }
};

export const fetchCart = async () => {
  try {
    if (!isAuthenticated()) {
      return getCartFromLocalStorage();
    }

    const token = getAuthToken();
    const response = await fetch("http://localhost:8000/api/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch cart");
    }

    return data.cart_items;
  } catch (error) {
    console.error("Fetch cart error:", error);
    return getCartFromLocalStorage();
  }
};

export const mergeCartsAfterLogin = async () => {
  try {
    const localCart = getCartFromLocalStorage();

    if (localCart.length === 0) return;

    const token = getAuthToken();
    const response = await fetch("http://localhost:8000/api/cart/merge", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: localCart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          choice_value_id: item.choice_value_id,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to merge carts");
    }

    localStorage.removeItem("cart_items");

    notifyCartUpdated();

    return data.cart_items;
  } catch (error) {
    console.error("Merge carts error:", error);
    toast.error("Failed to sync cart with your account");
    throw error;
  }
};

export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};
