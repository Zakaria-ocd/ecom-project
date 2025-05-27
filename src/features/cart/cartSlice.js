import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to get cart from localStorage
const getLocalCart = () => {
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

// Helper function to save cart to localStorage
const saveLocalCart = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

// Fetch cart items from the server for logged-in users
export const fetchCartItems = createAsyncThunk(
  "cart/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const response = await fetch("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add item to cart (server for logged-in users, localStorage for guests)
export const addToCart = createAsyncThunk(
  "cart/addItem",
  async (item, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // For guests, only update localStorage
      if (!token) {
        const currentCart = getLocalCart();

        // Check if item already exists
        const existingItemIndex = currentCart.findIndex(
          (cartItem) =>
            cartItem.product_id === item.product_id &&
            cartItem.choice_id === item.choice_id
        );

        if (existingItemIndex > -1) {
          // Increase quantity
          currentCart[existingItemIndex].quantity += item.quantity;
        } else {
          // Add new item
          currentCart.push(item);
        }

        saveLocalCart(currentCart);
        return currentCart;
      }

      // For logged in users, send to server
      const response = await fetch("http://localhost:8000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      // Refetch the cart to ensure consistent state
      dispatch(fetchCartItems());
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { itemId, quantity, choiceId },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

      // For guests, update localStorage
      if (!token) {
        const currentCart = getLocalCart();
        const updatedCart = currentCart.map((item) => {
          if (
            item.id === itemId ||
            (item.product_id === itemId && item.choice_id === choiceId)
          ) {
            return { ...item, quantity };
          }
          return item;
        });

        saveLocalCart(updatedCart);
        return updatedCart;
      }

      // For logged in users, update on server
      const response = await fetch(`http://localhost:8000/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }

      // Refetch the cart to ensure consistent state
      dispatch(fetchCartItems());
      return { itemId, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      // For guests, remove from localStorage
      if (!token) {
        const currentCart = getLocalCart();
        const updatedCart = currentCart.filter((item) => item.id !== itemId);

        saveLocalCart(updatedCart);
        return updatedCart;
      }

      // For logged in users, remove from server
      const response = await fetch(`http://localhost:8000/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Refetch the cart to ensure consistent state
      dispatch(fetchCartItems());
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sync local cart with server after login
export const syncCartAfterLogin = createAsyncThunk(
  "cart/syncAfterLogin",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const localCart = getLocalCart();
      if (localCart.length === 0) {
        // If local cart is empty, just fetch the server cart
        dispatch(fetchCartItems());
        return;
      }

      // Send local cart to server to merge with user's cart
      const response = await fetch("http://localhost:8000/api/cart/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: localCart }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync cart");
      }

      // Clear local cart after successful sync
      localStorage.removeItem("cart");

      // Fetch the updated cart from server
      dispatch(fetchCartItems());
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a checkout
export const createCheckout = createAsyncThunk(
  "cart/checkout",
  async (shippingInfo, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("User must be logged in to checkout");
      }

      const response = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...shippingInfo,
          payment_method: shippingInfo.payment_method || "cash_on_delivery",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Reset cart after successful checkout
      dispatch(fetchCartItems());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  checkoutStatus: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      saveLocalCart([]);
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Local cart operations (for guests)
      .addCase(addToCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          // For guest users, we get the entire cart back
          state.items = action.payload;
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          // For guest users, we get the entire cart back
          state.items = action.payload;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          // For guest users, we get the entire cart back
          state.items = action.payload;
        }
      })

      // Checkout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.checkoutStatus = "pending";
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state) => {
        state.loading = false;
        state.checkoutStatus = "success";
        state.items = []; // Clear cart after successful checkout
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.checkoutStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
