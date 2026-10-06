import { getAuthToken, isAuthenticated } from "./auth";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const createOrder = async (orderData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to create an order");
    }

    const token = getAuthToken();
    const orderPayload = {
      recipient_name: orderData.recipient_name,
      email: orderData.email,
      address: orderData.address,
      city: orderData.city,
      state: orderData.state,
      postal_code: orderData.postal_code,
      notes: orderData.notes,
      phone: orderData.phone,
      payment_method: orderData.payment_method || "cash_on_delivery",
    };

    const response = await fetch(`${API_URL}/api/orders`, {
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
      const validationError = Object.values(data.errors || {})
        .flat()
        .join(" ");
      throw new Error(
        validationError || data.message || "Failed to create order"
      );
    }

    toast.success("Order created successfully");
    return data.order;
  } catch (error) {
    console.error("Create order error:", error);
    toast.error(error.message || "Failed to create order");
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in to view orders");
    }

    const token = getAuthToken();

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
