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
import { useState, useEffect } from "react";
import { FaCircle, FaEye } from "react-icons/fa";

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  let total = 0;

  function getStatusColor(status) {
    if (status == "pending") {
      return "text-sky-400/80";
    } else if (status == "shipped") {
      return "text-yellow-400/80";
    } else if (status == "delivered") {
      return "text-green-400/80";
    }
  }

  useEffect(() => {
    async function getData() {
      const data = await fetch("http://localhost:8000/api/orders/6");
      setOrders(await data.json());
    }
    getData();
  }, []);

  return (
    <Table className="-ml-2">
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
              <TableCell className="font-medium py-4 text-black/55">
                {order.username}
              </TableCell>
              <TableCell className="text-black/55">
                ${order.total_price}
              </TableCell>
              <TableCell className="text-black/55">
                <div
                  className={`flex items-center gap-1.5 capitalize text-[13.5px] font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  <FaCircle size={7} />
                  {order.status}
                </div>
              </TableCell>
              <TableCell className="cursor-pointer text-slate-500">
                <Button variant="ghost" size="icon">
                  <FaEye className="p-1 cursor-pointer" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className=" text-black/55">${total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default OrdersTable;
