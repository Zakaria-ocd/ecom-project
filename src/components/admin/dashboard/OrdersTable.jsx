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
import { Eye, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { MdOutlineLocalShipping, MdPendingActions } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getAuthToken();

  const total = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  }, [orders]);

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
    } else if (status === "delivered") {
      return (
        <div className={`${base} text-green-400`}>
          <PackageCheck size={16} />
          <span>{status}</span>
        </div>
      );
    }
  }

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8000/api/orders/8/limit",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="w-full">
      <Table className="w-full bg-white rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead className="text-slate-800">Id</TableHead>
            <TableHead className="text-slate-800">Total</TableHead>
            <TableHead className="text-slate-800">Status</TableHead>
            <TableHead className="text-slate-800">Payment Method</TableHead>
            <TableHead className="text-slate-800">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="py-2">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="py-2">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="py-2">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="py-2">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="w-1/2 py-2">
                  <Skeleton className="h-8 w-8 mx-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-slate-500">
                  {order.id}
                </TableCell>
                <TableCell className="text-slate-500">
                  ${order.total_price}
                </TableCell>
                <TableCell className="text-slate-500">
                  {getStatus(order.status)}
                </TableCell>
                <TableCell className="text-slate-500">
                  {order.payment_method}
                </TableCell>
                <TableCell className="w-14 text-center text-slate-500">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="icon">
                      <Eye />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {!loading && orders.length > 0 ? (
          <TableFooter className="bg-white">
            <TableRow>
              <TableCell className="py-4 font-semibold rounded-bl-md">
                Total
              </TableCell>
              <TableCell className="py-4 text-slate-500 font-medium">
                ${total}
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="py-4 rounded-br-md" />
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </div>
  );
}

export default OrdersTable;
