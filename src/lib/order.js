// Order service for handling order operations
import { getAuthToken, isAuthenticated } from "./auth";
import { calculateCartTotal, fetchCart } from "./cart";
import { toast } from "sonner";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to create an order");
    }

    const token = getAuthToken();
    const cartItems = await fetchCart();

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Your cart is empty");
    }

    // Calculate total from cart items
    const totalPrice = calculateCartTotal(cartItems);

    // Prepare simplified order data - only include fields that are in the database
    const orderPayload = {
      address: orderData.address,
      phone: orderData.phone,
      status: "pending",
      payment_method: orderData.payment_method || "cash_on_delivery",
      total_price: totalPrice,
    };

    console.log("Sending order payload:", orderPayload);

    const response = await fetch("http://localhost:8000/api/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Order creation failed:", data);
      throw new Error(data.message || "Failed to create order");
    }

    toast.success("Order created successfully");
    return data.order;
  } catch (error) {
    console.error("Create order error:", error);
    toast.error(error.message || "Failed to create order");
    throw error;
  }
};

// Get list of user's orders
export const getUserOrders = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to view orders");
    }

    const token = getAuthToken();

    // Using the correct endpoint for user orders
    const response = await fetch("http://localhost:8000/api/orders/100/limit", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    // Format the response to match what the frontend expects
    return {
      orders: data.map((order) => ({
        id: order.id,
        created_at: order.created_at,
        updated_at: order.updated_at,
        status: order.status,
        total_amount: order.total_price || 0,
        payment_method: order.payment_method,
        address: order.address,
        phone: order.phone,
        items: order.items || [],
      })),
    };
  } catch (error) {
    console.error("Get orders error:", error);
    toast.error("Failed to load orders");
    throw error;
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to view order details");
    }

    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:8000/api/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch order details");
    }

    return data.order;
  } catch (error) {
    console.error("Get order details error:", error);
    toast.error("Failed to load order details");
    throw error;
  }
};
