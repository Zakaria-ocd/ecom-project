import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getLocalCart = () => {
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

const saveLocalCart = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

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

export const addToCart = createAsyncThunk(
  "cart/addItem",
  async (item, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        const currentCart = getLocalCart();

        const existingItemIndex = currentCart.findIndex(
          (cartItem) =>
            cartItem.product_id === item.product_id &&
            cartItem.choice_id === item.choice_id
        );

        if (existingItemIndex > -1) {
          currentCart[existingItemIndex].quantity += item.quantity;
        } else {
          currentCart.push(item);
        }

        saveLocalCart(currentCart);
        return currentCart;
      }

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

      dispatch(fetchCartItems());
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { itemId, quantity, choiceId },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");

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

      dispatch(fetchCartItems());
      return { itemId, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        const currentCart = getLocalCart();
        const updatedCart = currentCart.filter((item) => item.id !== itemId);

        saveLocalCart(updatedCart);
        return updatedCart;
      }

      const response = await fetch(`http://localhost:8000/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      dispatch(fetchCartItems());
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncCartAfterLogin = createAsyncThunk(
  "cart/syncAfterLogin",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const localCart = getLocalCart();
      if (localCart.length === 0) {
        dispatch(fetchCartItems());
        return;
      }

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

      localStorage.removeItem("cart");

      dispatch(fetchCartItems());
      return;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

      .addCase(addToCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })

      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.checkoutStatus = "pending";
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state) => {
        state.loading = false;
        state.checkoutStatus = "success";
        state.items = [];
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
