"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ProfileImage from "@/components/user/ProfileImage";
import { getUserImageUrl } from "@/lib/userImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, PackageCheck, Trash2, CogIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";
import { MdOutlineLocalShipping, MdPendingActions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExpandedOrdersTable({
  orders,
  setOrders,
  expandedOrderId,
  setExpandedOrderId,
  userData,
}) {
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const token = getAuthToken();

  const total = orders.reduce(
    (sum, order) => sum + Number(order.total_price),
    0
  );

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

  const handleDeleteClick = async (orderId) => {
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

      setOrders(orders.filter((o) => o.id !== orderId));
      console.log("Order deleted successfully");
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);

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

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...data.order,
                status: data.order.status,
                delivery_status: data.order.delivery_status,
              }
            : order
        )
      );
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  function getStatus(status) {
    const base = "flex items-center gap-1 capitalize font-medium text-[13.5px]";
    if (status === "pending") {
      return (
        <div className={`${base} text-sky-400`}>
          <MdPendingActions size={16} />
          <span>{status}</span>
        </div>
      );
    } else if (status === "shipped") {
      return (
        <div className={`${base} text-yellow-400`}>
          <MdOutlineLocalShipping size={16} />
          <span>{status}</span>
        </div>
      );
    } else if (status === "processing") {
      return (
        <div className={`${base} text-orange-400`}>
          <CogIcon size={16} />
          <span>{status}</span>
        </div>
      );
    } else if (status === "delivered") {
      return (
        <div className={`${base} text-green-400`}>
          <PackageCheck size={16} />
          <span>{status}</span>
        </div>
      );
    } else if (status === "cancelled") {
      return (
        <div className={`${base} text-red-400`}>
          <RxCross2 size={16} />
          <span>{status}</span>
        </div>
      );
    }

    return <span className={`${base} text-slate-500`}>{status}</span>;
  }

  function getColorBox(colorCode) {
    return (
      <div
        className="inline-block w-4 h-4 rounded-full mr-2 border border-slate-200"
        style={{ backgroundColor: colorCode }}
      />
    );
  }

  function getSizeBox(sizeValue) {
    return (
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium mr-1">
        {sizeValue}
      </div>
    );
  }

  function renderChoiceValue(choice) {
    if (choice.type?.toLowerCase() === "color") {
      return (
        <Badge variant="outline" className="ml-1 flex items-center px-2">
          {choice.colorCode && getColorBox(choice.colorCode)}
          {choice.value}
        </Badge>
      );
    } else if (choice.type?.toLowerCase() === "size") {
      return getSizeBox(choice.value);
    } else {
      return (
        <Badge variant="outline" className="ml-1 px-2">
          {choice.value}
        </Badge>
      );
    }
  }

  return (
    <div className="w-full rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead className="font-semibold text-slate-800">
              Order
            </TableHead>
            <TableHead className="font-semibold text-slate-800">
              Total
            </TableHead>
            <TableHead className="font-semibold text-slate-800">
              Username
            </TableHead>
            <TableHead className="font-semibold text-slate-800">
              Status
            </TableHead>
            <TableHead className="w-20 font-semibold text-slate-800">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-slate-500"
              >
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <Fragment key={order.id}>
                <TableRow
                  onClick={() => {
                    setExpandedOrderId(
                      expandedOrderId === order.id ? null : order.id
                    );
                  }}
                  className="cursor-pointer transition hover:bg-slate-50 group"
                >
                  <TableCell className="w-12">
                    <div className="flex items-center justify-center">
                      <ChevronDown
                        className={`transition-transform duration-200 text-slate-400 group-hover:text-slate-600 ${
                          expandedOrderId === order.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    #{order.id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {userData[order.user_id]?.username ||
                      "User " + order.user_id}
                  </TableCell>
                  <TableCell>{getStatus(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-8 px-2"
                      >
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setOpen(true);
                        }}
                        className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <motion.tr
                      key={`expanded-${order.id}`}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.2 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <TableCell
                        colSpan={6}
                        className="p-0 bg-slate-50 border-t border-b"
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: "auto",
                            transition: { duration: 0.3 },
                          }}
                          exit={{
                            height: 0,
                            transition: { duration: 0.3 },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800">
                              Customer Details
                            </h3>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                              <div className="relative w-16 h-16 overflow-hidden rounded-full flex-shrink-0 border-2 border-slate-200">
                                <ProfileImage
                                  imageUrl={getUserImageUrl(
                                    userData[order.user_id]
                                  )}
                                  previewUrl={null}
                                  username={userData[order.user_id]?.username}
                                  onImageChange={() => {}}
                                  className="w-full h-full"
                                />
                              </div>
                              <div className="space-y-1">
                                <Badge
                                  variant="outline"
                                  className={getRoleColor(
                                    userData[order.user_id]?.role
                                  )}
                                >
                                  {userData[order.user_id]?.role}
                                </Badge>
                                <p className="font-medium text-slate-900">
                                  {userData[order.user_id]?.username ||
                                    order.username ||
                                    "User " + order.user_id}
                                </p>
                                <p className="text-slate-600">
                                  {userData[order.user_id]?.email ||
                                    order.email ||
                                    "No email available"}
                                </p>
                              </div>
                              <div className="ml-auto text-right">
                                <p className="text-sm text-slate-500">
                                  Total Price
                                </p>
                                <p className="font-medium text-slate-900">
                                  ${parseFloat(order.total_price).toFixed(2)}
                                </p>
                                <div className="mt-2">
                                  {getStatus(order.status)}
                                </div>
                                <div className="mt-3 w-48">
                                  <label
                                    htmlFor={`order-status-${order.id}`}
                                    className="mb-1 block text-left text-xs font-medium text-slate-600"
                                  >
                                    Update status
                                  </label>
                                  <Select
                                    value={order.status}
                                    onValueChange={(status) =>
                                      updateOrderStatus(order.id, status)
                                    }
                                    disabled={updatingOrderId === order.id}
                                  >
                                    <SelectTrigger
                                      id={`order-status-${order.id}`}
                                      aria-label={`Update order ${order.id} status`}
                                      className="bg-white"
                                    >
                                      <SelectValue placeholder="Select status" />
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
                              </div>
                            </div>

                            <div className="mt-6">
                              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                Order Products
                              </h3>

                              {!order.items || order.items.length === 0 ? (
                                <Card className="p-4 text-center text-slate-500">
                                  No products found for this order
                                </Card>
                              ) : (
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-slate-100">
                                        <TableHead className="w-12 text-slate-700">
                                          ID
                                        </TableHead>
                                        <TableHead className="w-16 text-slate-700">
                                          Image
                                        </TableHead>
                                        <TableHead className="w-24 text-slate-700">
                                          Name
                                        </TableHead>
                                        <TableHead className="text-slate-700">
                                          Details
                                        </TableHead>
                                        <TableHead className="text-slate-700">
                                          Price
                                        </TableHead>
                                        <TableHead className="text-slate-700">
                                          Quantity
                                        </TableHead>
                                        <TableHead className="w-28 text-slate-700">
                                          Subtotal
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {order.items.map((item) => (
                                        <TableRow
                                          key={item.id}
                                          className="border-b"
                                        >
                                          <TableCell className="font-medium">
                                            {item.product?.id ||
                                              "Unknown product"}
                                          </TableCell>
                                          <TableCell className="font-medium">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                              <Image
                                                src={`http://localhost:8000/api/productImage/${item.product_id}`}
                                                alt={item.product?.name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                              />
                                            </div>
                                          </TableCell>
                                          <TableCell className="font-medium">
                                            {item.product?.name ||
                                              "Unknown product"}
                                          </TableCell>
                                          <TableCell>
                                            <div className="space-y-1">
                                              {item.choiceDetails &&
                                                item.choiceDetails.length >
                                                  0 && (
                                                  <div className="flex flex-wrap gap-2">
                                                    {item.choiceDetails.map(
                                                      (choice, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="flex items-center gap-1 flex-wrap"
                                                        >
                                                          {renderChoiceValue(
                                                            choice
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            ${parseFloat(item.price).toFixed(2)}
                                          </TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell className="font-medium">
                                            $
                                            {(
                                              parseFloat(item.price) *
                                              item.quantity
                                            ).toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                    <TableFooter>
                                      <TableRow>
                                        <TableCell className="font-semibold py-3">
                                          Total
                                        </TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                        <TableCell />
                                        <TableCell className="font-bold">
                                          $
                                          {parseFloat(
                                            order.total_price
                                          ).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    </TableFooter>
                                  </Table>
                                </div>
                              )}
                            </div>

                            <div className="mt-4">
                              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                Order Information
                              </h3>
                              <Card className="p-4 grid grid-cols-2 gap-4 bg-white">
                                <div>
                                  <p className="text-sm text-slate-500">
                                    Order ID
                                  </p>
                                  <p className="font-medium">#{order.id}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-500">
                                    Created At
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      order.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-500">
                                    Payment Method
                                  </p>
                                  <p className="font-medium capitalize">
                                    {order.payment_method || "Not specified"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-500">
                                    Status
                                  </p>
                                  <div className="font-medium capitalize">
                                    {getStatus(order.status || "Not specified")}
                                  </div>
                                </div>
                                {order.phone && (
                                  <div className="col-span-2">
                                    <p className="text-sm text-slate-500">
                                      Phone Number
                                    </p>
                                    <p className="font-medium">{order.phone}</p>
                                  </div>
                                )}
                                {order.address && (
                                  <div className="col-span-2">
                                    <p className="text-sm text-slate-500">
                                      Shipping Address
                                    </p>
                                    <p className="font-medium">
                                      {order.address}
                                    </p>
                                  </div>
                                )}
                              </Card>
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            ))
          )}
        </TableBody>

        <TableFooter>
          <TableRow className="bg-slate-50">
            <TableCell colSpan={2} className="font-semibold text-slate-800">
              Total Revenue
            </TableCell>
            <TableCell className="font-semibold text-slate-800">
              ${total.toFixed(2)}
            </TableCell>
            <TableCell colSpan={3}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-fit h-fit rounded-lg">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this order?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteClick(selectedOrderId);
                setOpen(false);
              }}
            >
              Delete
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
