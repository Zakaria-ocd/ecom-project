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
import { PackageCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { MdOutlineLocalShipping, MdPendingActions } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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
          "http://localhost:8000/api/orders/8/limit"
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-slate-800">Name</TableHead>
            <TableHead className="text-slate-800">Total</TableHead>
            <TableHead className="text-slate-800">Status</TableHead>
            <TableHead className="w-12 text-slate-800">View</TableHead>
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
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="py-2">
                  <Skeleton className="h-6 w-6 mx-auto rounded" />
                </TableCell>
              </TableRow>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell className="font-medium py-2 text-slate-500">
                  {order.username}
                </TableCell>
                <TableCell className="text-slate-500 py-2">
                  ${order.total_price}
                </TableCell>
                <TableCell className="text-slate-500 py-2">
                  {getStatus(order.status)}
                </TableCell>
                <TableCell className="w-14 text-center text-slate-500 py-2">
                  <Link
                    href={`/admin/orders/${order.order_id}`}
                    className="p-1 hover:size-[30px] hover:ease-out hover:duration-300 size-7"
                  >
                    <FaEye />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-slate-500 py-2"
              >
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {!loading && orders.length > 0 ? (
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold py-2">Total</TableCell>
              <TableCell className="text-slate-500 font-medium py-2">
                ${total}
              </TableCell>
              <TableCell className="py-2" />
              <TableCell className="py-2" />
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </div>
  );
}

export default OrdersTable;
