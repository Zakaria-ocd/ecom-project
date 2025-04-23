"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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

function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetch("http://localhost:8000/api/orders");
      setOrders(await data.json());
    }
    getData();
  }, []);

  function getStatusColor(status) {
    if (status === "pending") return "bg-sky-500";
    if (status === "shipped") return "bg-yellow-500";
    if (status === "delivered") return "bg-green-500";
    return "bg-gray-400";
  }

  const total = orders.reduce(
    (sum, order) => sum + Number(order.total_price),
    0
  );

  return (
    <Accordion type="single" collapsible className="w-full mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="text-slate-800">Order</TableHead>
            <TableHead className="text-slate-800">Total</TableHead>
            <TableHead className="text-slate-800">Username</TableHead>
            <TableHead className="text-slate-800 text-center">Status</TableHead>
            <TableHead className="text-center l-20 text-slate-800">
              View
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.order_id}
              value={order.order_id}
              className="cursor-pointer hover:bg-slate-50 transition"
            >
              <TableCell>
                <i className="fa-solid ml-2 fa-angle-down" />
              </TableCell>
              <TableCell className="text-black/70">{order.order_id}</TableCell>
              <TableCell className="text-black/70">
                ${order.total_price}
              </TableCell>
              <TableCell className="text-black/70">{order.username}</TableCell>
              <TableCell className="text-left">
                <div
                  className={`w-24 mx-auto rounded-sm text-white h-7 flex items-center justify-center ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </TableCell>
              <TableCell className="text-center  pr-4">
                <i className="fa-light fa-eye hover:text-black hover:text-lg cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell  className="font-semibold text-black">
            </TableCell>
            <TableCell  className="font-semibold text-black">
              Total
            </TableCell>
            <TableCell  className="text-black/55 font-semibold">
              ${total.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Accordion>
  );
}

export default OrdersTable;
