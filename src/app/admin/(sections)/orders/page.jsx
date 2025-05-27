"use client";
import ExpandedOrdersTable from "@/components/admin/dashboard/ExpandedOrdersTable";
import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState("");

  useEffect(() => {
    async function getData() {
      const data = await fetch("http://localhost:8000/api/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(await data.json());
    }
    getData();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <ExpandedOrdersTable
          orders={orders}
          expandedOrderId={expandedOrderId}
          setExpandedOrderId={setExpandedOrderId}
        />
      </div>
    </div>
  );
}
