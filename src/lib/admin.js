import { getAuthToken, isAuthenticated } from "./auth";
import { toast } from "sonner";

export const fetchDashboardStats = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in as admin");
    }

    const token = getAuthToken();

    const response = await fetch(
      "http://localhost:8000/api/admin/dashboard/stats",
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
      throw new Error(data.message || "Failed to fetch dashboard statistics");
    }

    return {
      totalSales: data.totalSales || 0,
      totalProducts: data.totalProducts || 0,
      totalSellers: data.totalSellers || 0,
      totalOrders: data.totalOrders || 0,
    };
  } catch (error) {
    console.error("Fetch dashboard stats error:", error);
    toast.error("Failed to load dashboard statistics");

    return {
      totalSales: 0,
      totalProducts: 0,
      totalSellers: 0,
      totalOrders: 0,
    };
  }
};

export const getRecentOrders = async (limit = 5) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in as admin");
    }

    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:8000/api/admin/orders/${limit}`,
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
      throw new Error(data.message || "Failed to fetch recent orders");
    }

    return data.orders || [];
  } catch (error) {
    console.error("Get recent orders error:", error);
    toast.error("Failed to load recent orders");
    return [];
  }
};

export const getRecentUsers = async (limit = 5) => {
  try {
    if (!isAuthenticated()) {
      throw new Error("You must be logged in as admin");
    }

    const token = getAuthToken();

    const response = await fetch(
      `http://localhost:8000/api/admin/users/${limit}`,
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
      throw new Error(data.message || "Failed to fetch recent users");
    }

    return Array.isArray(data) ? data : data.users || [];
  } catch (error) {
    console.error("Get recent users error:", error);
    toast.error("Failed to load recent users");
    return [];
  }
};
