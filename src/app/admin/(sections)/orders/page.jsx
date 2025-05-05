"use client";
import TotalOrders from "@/components/admin/TotalOrders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState("");

  useEffect(() => {
    async function getData() {
      const data = await fetch("http://localhost:8000/api/orders");
      setOrders(await data.json());
    }
    getData();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <TotalOrders ordersCount={orders.length} />
        <OrdersTable
          orders={orders}
          expandedOrderId={expandedOrderId}
          setExpandedOrderId={setExpandedOrderId}
        />
      </div>
    </div>
  );
}
