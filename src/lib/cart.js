// Cart service to handle cart operations
import { getAuthToken, isAuthenticated } from "./auth";
import { toast } from "sonner";
import { notifyCartUpdated } from "@/hooks/useCart";

// Save cart to localStorage
export const saveCartToLocalStorage = (cart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart_items", JSON.stringify(cart));

  // Notify components about cart update
  notifyCartUpdated();
};

// Get cart from localStorage
export const getCartFromLocalStorage = () => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart_items");
  return cart ? JSON.parse(cart) : [];
};

// Add item to cart
export const addToCart = async (
  product,
  quantity = 1,
  choiceValueId = null
) => {
  try {
    // Frontend validation
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

    // Validate that we have a choice value ID if the product requires it
    if (product.requiresChoice && !choiceValueId) {
      throw new Error("Please select all required options");
    }

    // If authenticated, add to server cart
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
          price: product.price || product.default_price,
          choice_value_id: choiceValueId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      // Notify all components about cart update
      notifyCartUpdated();

      return data.cart_item;
    } else {
      // If not authenticated, add to localStorage
      const cart = getCartFromLocalStorage();

      // Check if product with same choice already exists in cart
      const existingItemIndex = cart.findIndex(
        (item) =>
          item.product_id === (product.productId || product.id) &&
          ((choiceValueId === null && item.choice_value_id === null) ||
            (choiceValueId !== null && item.choice_value_id === choiceValueId))
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.push({
          id: Date.now().toString(), // Add unique ID for non-logged in users
          product_id: product.productId || product.id,
          product: product,
          quantity,
          price: product.price || product.default_price,
          image:
            product.image ||
            `http://localhost:8000/api/productImage/${
              product.productId || product.id
            }`,
          name: product.name,
          choice_value_id: choiceValueId,
          choiceDetails: product.choiceDetails || [],
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

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    // For authenticated users, remove from database
    if (isAuthenticated()) {
      const response = await fetch("http://localhost:8000/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          cart_item_id: cartItemId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status}`);
      }

      // Notify all components about cart update
      notifyCartUpdated();

      // Get the updated cart
      return await fetchCart();
    }
    // For unauthenticated users, remove from local storage
    else {
      const currentCart = getCartFromLocalStorage();
      const updatedCart = currentCart.filter((item) => item.id !== cartItemId);
      saveCartToLocalStorage(updatedCart);

      // Notify all components about cart update
      notifyCartUpdated();

      return updatedCart;
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

// Update item quantity in cart
export const updateCartItemQuantity = async (
  productId,
  choiceValueId = null,
  quantity
) => {
  try {
    // If authenticated, update on server
    if (isAuthenticated()) {
      const token = getAuthToken();
      const response = await fetch("http://localhost:8000/api/cart/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_item_id: productId, // For authenticated users, productId is actually the cart_item_id
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update cart");
      }

      // Notify all components about cart update
      notifyCartUpdated();

      toast.success("Cart updated");
      return data.cart_item;
    } else {
      // If not authenticated, update in localStorage
      const cart = getCartFromLocalStorage();

      // Find the correct item to update
      const updatedCart = cart.map((item) => {
        // Match by product_id and choice_value_id
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

// Fetch cart from server
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

// Merge localStorage cart with server cart
export const mergeCartsAfterLogin = async () => {
  try {
    const localCart = getCartFromLocalStorage();

    // If local cart is empty, no need to merge
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
          price: item.price,
          choice_value_id: item.choice_value_id,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to merge carts");
    }

    // Clear localStorage cart after successful merge
    localStorage.removeItem("cart_items");

    // Notify all components about cart update
    notifyCartUpdated();

    return data.cart_items;
  } catch (error) {
    console.error("Merge carts error:", error);
    toast.error("Failed to sync cart with your account");
    throw error;
  }
};

// Calculate total cart price
export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};
