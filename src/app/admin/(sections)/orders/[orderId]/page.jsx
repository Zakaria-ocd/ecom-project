"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import {
  Loader2,
  ChevronRight,
  UserRound,
  Package,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderTimeline from "@/components/admin/OrderTimeline";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import ProfileImage from "@/components/user/ProfileImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { getUserImageUrl } from "@/lib/userImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderStatusIcon from "@/components/orders/OrderStatusIcon";

export default function OrderPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const token = getAuthToken();

  useEffect(() => {
    async function fetchOrderData() {
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8000/api/orders/${orderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Could not load order details");
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  useEffect(() => {
    async function fetchUserData() {
      if (!order?.user_id) return;
      setIsLoadingUser(true);

      try {
        const response = await fetch(
          `http://localhost:8000/api/users/${order.user_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Could not load customer details");
      } finally {
        setIsLoadingUser(false);
      }
    }

    if (order) {
      fetchUserData();
    }
  }, [order, token]);

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "shipped":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const updateOrderStatus = async (status) => {
    setIsUpdatingStatus(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      setOrder((currentOrder) => ({
        ...currentOrder,
        ...data.order,
      }));
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      toast.success("Order deleted successfully");
      router.push("/admin/orders");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100";
      case "seller":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
      case "buyer":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          <p className="text-slate-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card className="p-8 text-center mx-auto max-w-4xl mt-10">
        <h3 className="text-lg font-medium text-slate-800 mb-2">
          Order not found
        </h3>
        <p className="text-slate-600">
          The order you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
      </Card>
    );
  }

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
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/orders/${orderId}`}>
              Order #{order.id}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Order #{order.id}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-slate-500">
              {new Date(order.created_at).toLocaleString()}
            </p>
            <Badge
              variant="outline"
              className={`${getOrderStatusColor(order.status)} inline-flex items-center gap-1`}
            >
              <OrderStatusIcon status={order.status} />
              {order.status}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="items">Order Items</TabsTrigger>
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-0">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>

                {!order.items || order.items.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <p className="text-slate-500">
                      No products found in this order
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {order.items.map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden h-[196px] border"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-[196px] relative overflow-hidden bg-slate-100">
                              {item.product?.id && (
                                <Image
                                  src={`http://localhost:8000/api/productImage/${item.product_id}`}
                                  alt={item.product?.name || "Product image"}
                                  width={192}
                                  height={192}
                                  className="object-cover w-full h-full"
                                  unoptimized
                                />
                              )}
                            </div>

                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-slate-900">
                                    {item.product?.name || "Unknown product"}
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
                                                <span className="text-xs text-slate-500 mr-1 capitalize">
                                                  {choice.type}:
                                                </span>
                                                {choice.type?.toLowerCase() ===
                                                "color" ? (
                                                  <div className="flex items-center">
                                                    <div
                                                      className="inline-block w-4 h-4 rounded-full mr-2 border border-slate-200"
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
                                                  <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium">
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

                                    <p className="text-sm text-slate-500">
                                      Product ID: {item.product_id}
                                    </p>
                                  </div>
                                </div>

                                <Link
                                  href={`/admin/products/${item.product_id}`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                  >
                                    <Package className="h-3.5 w-3.5" />
                                    View Product
                                  </Button>
                                </Link>
                              </div>

                              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-end">
                                <div>
                                  <div className="text-sm text-slate-500">
                                    Quantity
                                  </div>
                                  <div className="text-lg font-medium">
                                    {item.quantity}
                                  </div>
                                </div>

                                <div className="space-y-1 text-right">
                                  <div className="text-sm text-slate-500">
                                    Price
                                  </div>
                                  <div className="font-medium">
                                    ${parseFloat(item.price).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-500">Shipping</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-500">Tax</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between items-center py-2 text-lg font-bold">
                        <span>Total</span>
                        <span>${parseFloat(order.total_price).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Order Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Order ID</p>
                    <p className="font-medium">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Created At</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Payment Method</p>
                    <p className="font-medium capitalize">
                      {order.payment_method || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <Badge
                      variant="outline"
                      className={`${getOrderStatusColor(order.status)} inline-flex items-center gap-1`}
                    >
                      <OrderStatusIcon status={order.status} />
                      {order.status}
                    </Badge>
                    <Select
                      value={order.status}
                      onValueChange={updateOrderStatus}
                      disabled={isUpdatingStatus}
                    >
                      <SelectTrigger
                        aria-label={`Update order ${order.id} status`}
                        className="mt-2"
                      >
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "pending",
                          "processing",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-slate-500">Shipping Address</p>
                    <p className="font-medium">
                      {order.address || "No address provided"}
                    </p>
                  </div>

                  {order.phone && (
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500">Phone Number</p>
                      <p className="font-medium">{order.phone}</p>
                    </div>
                  )}

                  <div className="col-span-2 mt-4">
                    <h4 className="font-medium mb-2">Order Summary</h4>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Subtotal</span>
                      <span>${parseFloat(order.total_price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between py-2 font-semibold">
                      <span>Total</span>
                      <span>${parseFloat(order.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="customer" className="mt-0">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Customer Information
                </h3>

                {isLoadingUser ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
                    <span className="ml-2 text-slate-500">
                      Loading customer data...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-slate-200">
                        <ProfileImage
                          imageUrl={getUserImageUrl(userData)}
                          previewUrl={null}
                          username={userData?.username}
                          onImageChange={() => {}}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className={getRoleColor(userData?.role)}
                        >
                          {userData?.role || "User"}
                        </Badge>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-lg font-semibold">
                            {userData?.username ||
                              order.username ||
                              "User " + order.user_id}
                          </h4>
                          <p className="text-slate-600">
                            {userData?.email ||
                              order.email ||
                              "No email available"}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/admin/users/${order.user_id}`}
                        className="ml-auto"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-auto flex items-center gap-1"
                        >
                          <UserRound className="h-3.5 w-3.5" />
                          View Customer
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Customer ID</p>
                        <p className="font-medium">
                          #{userData?.id || order.user_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Joined</p>
                        <p className="font-medium">
                          {userData?.created_at
                            ? new Date(userData.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <p className="font-medium">
                          {order.phone ||
                            userData?.phone ||
                            "No phone available"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Orders Count</p>
                        <p className="font-medium">
                          {userData?.orders_count || "1"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-slate-500">Address</p>
                        <p className="font-medium">
                          {order.address ||
                            userData?.address ||
                            "No address available"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:mt-[51px]">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>
            <OrderTimeline status={order.status} createdAt={order.created_at} />
          </Card>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-fit h-fit rounded-lg">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteOrder();
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
