"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { PenLine, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserDetailPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function fetchUser() {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserOrders() {
    setOrdersLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("Failed to load user orders");
    } finally {
      setOrdersLoading(false);
    }
  }

  async function deleteUser() {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/users/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await response.json();
      if (data.success) {
        toast.success("User deleted successfully");
        router.push("/admin/users");
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const LoadingState = () => (
    <div className="container mx-auto p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Loading...</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-24 inline-block" />
            <Skeleton className="h-10 w-24 inline-block" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>

          <div className="md:w-2/3 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/3" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>User Not Found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            User Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The user you are looking for does not exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {user.username || `User #${user.id}`}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl font-semibold">User Profile</h1>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href={`/admin/users/edit/${user.id}`}>
                  <PenLine className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button variant="destructive" onClick={deleteUser}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="relative h-48 w-48 rounded-full overflow-hidden mb-6">
                      {user.image ? (
                        <Image
                          src={`http://localhost:8000/api/users/imageById/${user.id}`}
                          alt={user.username || `User #${user.id}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="h-48 w-48 flex items-center justify-center bg-blue-100 text-blue-600 text-6xl font-semibold uppercase">
                          {user.username?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold mb-5">
                      {user.username || "Anonymous User"}
                    </h2>

                    {user.image && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this profile image?"
                            )
                          ) {
                            // Call the API to delete the image
                            fetch(
                              `http://localhost:8000/api/users/image/${user.id}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                  )}`,
                                },
                              }
                            )
                              .then((response) => response.json())
                              .then((data) => {
                                if (data.success) {
                                  toast.success("Profile image deleted");
                                  // Refresh user data
                                  fetchUser();
                                } else {
                                  toast.error(
                                    data.message || "Failed to delete image"
                                  );
                                }
                              })
                              .catch((error) => {
                                console.error("Error:", error);
                                toast.error(
                                  "An error occurred while deleting the image"
                                );
                              });
                          }
                        }}
                      >
                        Remove Profile Image
                      </Button>
                    )}
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">ID</h3>
                      <p className="text-lg font-medium text-slate-900 mt-1">
                        {user.id}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Username
                      </h3>
                      <p className="text-lg font-medium text-slate-900 mt-1">
                        {user.username || "Not set"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Email
                      </h3>
                      <p className="text-lg font-medium text-slate-900 mt-1">
                        {user.email || "Not set"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Role
                      </h3>
                      <div className="text-lg font-medium text-slate-900 mt-1">
                        <Badge
                          variant="outline"
                          className={getRoleColor(user.role)}
                        >
                          {user.role || "User"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Created At
                      </h3>
                      <p className="text-lg font-medium text-slate-900 mt-1">
                        {formatDate(user.created_at)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Last Updated
                      </h3>
                      <p className="text-lg font-medium text-slate-900 mt-1">
                        {formatDate(user.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              {ordersLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <p>No orders found for this user</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-slate-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-slate-100 text-slate-800"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 text-sm"
                          >
                            <div className="relative h-12 w-12 rounded overflow-hidden">
                              {item.product.image ? (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                                  <span className="text-slate-400">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-slate-500">
                                Quantity: {item.quantity} × ${item.price}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <p className="text-sm text-slate-500">
                          Total Items:{" "}
                          {order.orderItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </p>
                        <p className="font-medium">
                          Total: $
                          {order.orderItems
                            .reduce(
                              (sum, item) => sum + item.quantity * item.price,
                              0
                            )
                            .toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
