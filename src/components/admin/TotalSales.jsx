// Objective: create a component that shows the total sales of the store.
"use client";
import { useSelector } from "react-redux";

const TotalSales = () => {
  const totalSales = useSelector((state) => state.dashboard.totalSales);

  return (
    <div className="bg-orange-50 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start">
        <p className="text-3xl font-bold">{totalSales}</p>
        <p className="text-sm text-gray-500">Total Sales</p>
      </div>
      <i className="fa-regular fa-wallet text-orange-500 text-3xl"></i>
    </div>
  );
};

export default TotalSales;
