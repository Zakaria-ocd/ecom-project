// Objective: create a component that shows the total orders in the dashboard.
"use client";
import { useSelector } from "react-redux";

const TotalOrders = () => {
  const totalOrders = useSelector((state) => state.dashboard.totalOrders);

  return (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start">
        <p className="text-3xl font-bold">{totalOrders}</p>
        <p className="text-sm text-gray-500">Total Orders</p>
      </div>
      <i className="fa-regular fa-shopping-cart text-blue-500 text-3xl"></i>
    </div>
  );
};

export default TotalOrders;
