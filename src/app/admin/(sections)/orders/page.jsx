"use client";
import ExpandedOrdersTable from "@/components/admin/dashboard/ExpandedOrdersTable";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getAuthToken();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function fetchUserData(userId) {
      if (userData[userId]) return;

      try {
        const userResponse = await fetch(
          `http://localhost:8000/api/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!userResponse.ok) throw new Error("Failed to load user data");

        const userDetails = await userResponse.json();
        setUserData((prev) => ({
          ...prev,
          [userId]: userDetails,
        }));
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }

    async function fetchOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const ordersResponse = await fetch("http://localhost:8000/api/orders", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!ordersResponse.ok) {
          throw new Error(
            `Error ${ordersResponse.status}: ${ordersResponse.statusText}`
          );
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        ordersData.forEach((order) => {
          if (order.user_id) {
            fetchUserData(order.user_id);
          }
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message || "Failed to load orders");
        toast.error("Could not load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Orders</h1>
          <p className="text-slate-500">Manage and track customer orders</p>
        </div>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="flex items-center justify-center h-64 border rounded-lg bg-slate-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
            <p className="text-slate-500">Loading orders...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8 border border-red-200 rounded-lg bg-red-50 text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Could not load orders
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <ExpandedOrdersTable
          orders={orders}
          setOrders={setOrders}
          expandedOrderId={expandedOrderId}
          setExpandedOrderId={setExpandedOrderId}
          userData={userData}
        />
      )}
    </div>
  );
}
