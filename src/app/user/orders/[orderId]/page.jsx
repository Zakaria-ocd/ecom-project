"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { getAuthToken, isAuthenticated } from "@/lib/auth";
import {
  Loader2,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  PackageCheck,
  CheckIcon,
  TruckIcon,
  PackageIcon,
  ClockIcon,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdOutlineLocalShipping, MdPendingActions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const timelineSteps = [
  {
    id: "created",
    name: "Order Placed",
    description: "Order was received and is being processed",
    icon: ClockIcon,
    iconBackground: "bg-blue-500",
  },
  {
    id: "processing",
    name: "Processing",
    description: "Order is being prepared for shipping",
    icon: PackageIcon,
    iconBackground: "bg-amber-500",
  },
  {
    id: "shipped",
    name: "Shipped",
    description: "Order has been shipped and is on its way",
    icon: TruckIcon,
    iconBackground: "bg-purple-500",
  },
  {
    id: "delivered",
    name: "Delivered",
    description: "Order has been delivered successfully",
    icon: CheckIcon,
    iconBackground: "bg-emerald-500",
  },
];

function OrderTimeline({ status, createdAt }) {
  const getCompletedSteps = () => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return ["created", "processing", "shipped", "delivered"];
      case "shipped":
        return ["created", "processing", "shipped"];
      case "processing":
      case "pending":
        return ["created", "processing"];
      default:
        return ["created"];
    }
  };

  const completedSteps = getCompletedSteps();
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timelineSteps.map((step, stepIdx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive =
            completedSteps[completedSteps.length - 1] === step.id;

          return (
            <li key={step.id}>
              <div className="relative pb-8">
                {stepIdx !== timelineSteps.length - 1 ? (
                  <span
                    className={`absolute left-4 top-4 -ml-px h-full w-0.5 ${
                      isCompleted
                        ? "bg-primary"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`${
                        isCompleted
                          ? step.iconBackground
                          : "bg-slate-200 dark:bg-slate-700"
                      } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-slate-900`}
                    >
                      <step.icon
                        className={`h-4 w-4 ${
                          isCompleted
                            ? "text-white"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-primary"
                            : isCompleted
                            ? "text-slate-900 dark:text-slate-100"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {step.name}
                      </p>
                      <p
                        className={`mt-0.5 text-xs ${
                          isCompleted
                            ? "text-slate-500 dark:text-slate-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-slate-500">
                      {isCompleted && (
                        <time dateTime={createdAt}>
                          {stepIdx === 0 ? formattedDate : ""}
                        </time>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/user/login?redirect=orders");
      return;
    }

    const fetchOrderDetails = async () => {
      if (!orderId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/orders/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

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

  function getStatus(status) {
    const base = "flex items-center gap-1 capitalize font-medium text-[13.5px]";

    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return (
          <div className={`${base} text-green-500 dark:text-green-400`}>
            <PackageCheck size={16} />
            <span>{status}</span>
          </div>
        );
      case "processing":
      case "shipped":
        return (
          <div className={`${base} text-yellow-500 dark:text-yellow-400`}>
            <MdOutlineLocalShipping size={16} />
            <span>{status}</span>
          </div>
        );
      case "pending":
        return (
          <div className={`${base} text-sky-500 dark:text-sky-400`}>
            <MdPendingActions size={16} />
            <span>{status}</span>
          </div>
        );
      case "cancelled":
        return (
          <div className={`${base} text-red-500 dark:text-red-400`}>
            <RxCross2 size={16} />
            <span>{status}</span>
          </div>
        );
      default:
        return (
          <div className={`${base} text-slate-500 dark:text-slate-400`}>
            <span>{status || "Unknown"}</span>
          </div>
        );
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "processing":
      case "shipped":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64 border rounded-lg bg-slate-50 dark:bg-gray-800">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
            <p className="text-slate-500 dark:text-slate-400">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center p-8 h-64 border rounded-lg bg-slate-50 dark:bg-gray-800">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Order Not Found
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We couldn&apos;t find the order you&apos;re looking for.
            </p>
            <Link href="/user/orders">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto dark:bg-slate-900">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>Order #{order.id}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-2">
            Order #{order.id}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-slate-500 dark:text-slate-400">
              {formatDate(order.created_at)}
            </p>
            <Badge
              variant="outline"
              className={getOrderStatusColor(order.status)}
            >
              {order.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/user/orders">
            <Button
              variant="outline"
              className="flex items-center gap-2 dark:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <Link href="/">
            <Button className="flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="items">Order Items</TabsTrigger>
              <TabsTrigger value="details">Order Details</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {!order.items || order.items.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        No items in this order.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        {order.items.map((item) => (
                          <Card
                            key={item.id}
                            className="overflow-hidden border"
                          >
                            <div className="flex flex-col md:flex-row">
                              <div className="w-full h-52 md:w-40 md:h-40 lg:w-48 lg:h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                {item.product_id && (
                                  <Image
                                    src={`http://localhost:8000/api/productImage/${item.product_id}`}
                                    alt={
                                      (item.product && item.product.name) ||
                                      "Product image"
                                    }
                                    fill
                                    sizes="(max-width: 768px) 100%, (max-width: 1200px) 40%, 192px"
                                    className="object-contain md:object-cover"
                                  />
                                )}
                              </div>

                              <div className="flex-1 p-4">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                  <div>
                                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                      {(item.product && item.product.name) ||
                                        item.product_name ||
                                        `Product #${item.product_id}`}
                                    </h4>

                                    <div className="mt-2 space-y-2">
                                      {item.choiceDetails &&
                                        item.choiceDetails.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {item.choiceDetails.map(
                                              (choice, idx) => (
                                                <div
                                                  key={idx}
                                                  className="flex items-center"
                                                >
                                                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 capitalize">
                                                    {choice.type}:
                                                  </span>
                                                  {choice.type?.toLowerCase() ===
                                                  "color" ? (
                                                    <div className="flex items-center">
                                                      <div
                                                        className="inline-block w-4 h-4 rounded-full mr-2 border border-slate-200 dark:border-slate-600"
                                                        style={{
                                                          backgroundColor:
                                                            choice.colorCode,
                                                        }}
                                                      />
                                                      <span className="text-sm">
                                                        {choice.value}
                                                      </span>
                                                    </div>
                                                  ) : choice.type?.toLowerCase() ===
                                                    "size" ? (
                                                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium">
                                                      {choice.value}
                                                    </div>
                                                  ) : (
                                                    <Badge
                                                      variant="outline"
                                                      className="px-2"
                                                    >
                                                      {choice.value}
                                                    </Badge>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}

                                      <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Product ID: {item.product_id}
                                      </p>
                                    </div>
                                  </div>

                                  <Link href={`/products/${item.product_id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-2"
                                    >
                                      <Package className="h-3.5 w-3.5" />
                                      View Product
                                    </Button>
                                  </Link>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                                  <div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                      Quantity
                                    </div>
                                    <div className="text-lg font-medium dark:text-slate-300">
                                      {item.quantity}
                                    </div>
                                  </div>

                                  <div className="space-y-1 text-right">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                      Price
                                    </div>
                                    <div className="font-medium dark:text-slate-300">
                                      ${parseFloat(item.price).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-500 dark:text-slate-400">
                            Subtotal
                          </span>
                          <span className="font-medium dark:text-slate-300">
                            ${parseFloat(order.total_price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-500 dark:text-slate-400">
                            Shipping
                          </span>
                          <span className="dark:text-slate-300">
                            $
                            {order.shipping_cost
                              ? parseFloat(order.shipping_cost).toFixed(2)
                              : "0.00"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-500 dark:text-slate-400">
                            Tax
                          </span>
                          <span className="dark:text-slate-300">
                            $
                            {order.tax
                              ? parseFloat(order.tax).toFixed(2)
                              : "0.00"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 text-lg font-bold">
                          <span className="dark:text-slate-200">Total</span>
                          <span className="dark:text-slate-200">
                            ${parseFloat(order.total_price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Order ID
                      </p>
                      <p className="font-medium dark:text-slate-300">
                        #{order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Created At
                      </p>
                      <p className="font-medium dark:text-slate-300">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Payment Method
                      </p>
                      <p className="font-medium capitalize dark:text-slate-300">
                        {order.payment_method === "cash_on_delivery"
                          ? "Cash on Delivery"
                          : order.payment_method || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Status
                      </p>
                      <Badge
                        variant="outline"
                        className={getOrderStatusColor(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </div>

                    <div className="col-span-2">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Shipping Address
                      </p>
                      <p className="font-medium dark:text-slate-300">
                        {order.address || "No address provided"}
                      </p>
                    </div>

                    {order.phone && (
                      <div className="col-span-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Phone Number
                        </p>
                        <p className="font-medium dark:text-slate-300">
                          {order.phone}
                        </p>
                      </div>
                    )}

                    <div className="col-span-2 mt-4">
                      <h4 className="font-medium mb-2 dark:text-slate-300">
                        Order Summary
                      </h4>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">
                          Subtotal
                        </span>
                        <span className="dark:text-slate-300">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">
                          Shipping
                        </span>
                        <span className="dark:text-slate-300">
                          $
                          {order.shipping_cost
                            ? parseFloat(order.shipping_cost).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">
                          Tax
                        </span>
                        <span className="dark:text-slate-300">
                          $
                          {order.tax
                            ? parseFloat(order.tax).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 font-semibold">
                        <span className="dark:text-slate-300">Total</span>
                        <span className="dark:text-slate-300">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:mt-[51px]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline
                status={order.status}
                createdAt={order.created_at}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
