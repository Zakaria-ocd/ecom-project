"use client";
import TotalOrders from "@/components/admin/TotalOrders";
import OrdersTable from "@/components/admin/dashboard/ExpandedOrdersTable";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function OrdersPage() {
  const params = useParams();
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState("");

  useEffect(() => {
    async function getData() {
      const data = await fetch("http://localhost:8000/api/orders");
      setOrders(await data.json());
      setExpandedOrderId(params?.orderId || "");
    }
    getData();
  }, [params?.orderId]);

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
