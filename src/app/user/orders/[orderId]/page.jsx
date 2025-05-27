"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { isAuthenticated } from "@/lib/auth";
import { getOrderById } from "@/lib/order";

export default function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/user/login?redirect=orders");
      return;
    }

    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, router]);

  // Load order details
  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Link
            href="/user/orders"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Order #{order.id}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <Link
          href="/user/orders"
          className="mt-4 sm:mt-0 flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">
            Order Status
          </h2>
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "completed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : order.status === "processing"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">
            Delivery Information
          </h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Address:</span> {order.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Phone:</span> {order.phone}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Payment Method:</span>{" "}
              {order.payment_method === "cash_on_delivery"
                ? "Cash on Delivery"
                : order.payment_method}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">
            Order Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subtotal
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ${parseFloat(order.total_amount).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Shipping
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                $
                {order.shipping_cost
                  ? parseFloat(order.shipping_cost).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Tax</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ${order.tax ? parseFloat(order.tax).toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <p className="text-base font-medium text-gray-900 dark:text-white">
                Total
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                ${parseFloat(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">
          Order Items
        </h2>

        {order.items && order.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Product
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {item.product || item.product_image ? (
                          <div className="relative h-16 w-16 flex-shrink-0 mr-4">
                            <Image
                              src={`http://localhost:8000/api/productImage/${
                                item.product_id ||
                                (item.product && item.product.id)
                              }`}
                              alt={
                                (item.product && item.product.name) ||
                                item.product_name ||
                                "Product"
                              }
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 flex-shrink-0 mr-4 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">
                              No image
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {(item.product && item.product.name) ||
                              item.product_name ||
                              `Product #${item.product_id}`}
                          </p>
                          {item.choiceDetails &&
                          item.choiceDetails.length > 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.choiceDetails
                                .map(
                                  (detail) => `${detail.type}: ${detail.value}`
                                )
                                .join(", ")}
                            </p>
                          ) : item.choice_details ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {Object.entries(item.choice_details)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-200">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-200">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-200">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No items in this order.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <Link
          href="/user/orders"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Back to Orders
        </Link>

        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
