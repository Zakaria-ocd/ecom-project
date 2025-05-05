"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRightFromSquare, PackageCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { MdOutlineLocalShipping, MdPendingActions } from "react-icons/md";

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  let total = 0;

  function getStatus(status) {
    if (status == "pending") {
      return (
        <div className="flex items-center gap-1 text-sky-400">
          <MdPendingActions size={16} />
          <span className="text-sky-400/80">{status}</span>
        </div>
      );
    } else if (status == "shipped") {
      return (
        <div className="flex items-center gap-1 text-yellow-400">
          <MdOutlineLocalShipping size={16} />
          <span className="text-yellow-400/80">{status}</span>
        </div>
      );
    } else if (status == "delivered") {
      return (
        <div className="flex items-center gap-1 text-green-400">
          <PackageCheck size={16} />
          <span className="text-green-400/80">{status}</span>
        </div>
      );
    }
  }

  useEffect(() => {
    async function fetchOrders() {
      const data = await fetch("http://localhost:8000/api/orders/6");
      setOrders(await data.json());
    }
    fetchOrders();
  }, []);

  return (
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
        {orders.map((order) => {
          total += Number(order.total_price);
          return (
            <TableRow key={order.order_id}>
              <TableCell className="font-medium py-4 text-slate-500">
                {order.username}
              </TableCell>
              <TableCell className="text-slate-500">
                ${order.total_price}
              </TableCell>
              <TableCell className="text-slate-500">
                <div className="flex items-center gap-1.5 capitalize text-[13.5px] font-medium">
                  {getStatus(order.status)}
                </div>
              </TableCell>
              <TableCell className="text-slate-500">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-slate-200/70"
                >
                  <ArrowUpRightFromSquare />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className=" text-slate-500">${total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default OrdersTable;
