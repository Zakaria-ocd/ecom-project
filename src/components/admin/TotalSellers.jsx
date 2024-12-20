// Objective: create a component that shows the total number of sellers in the system.
"use client";
import { useSelector } from "react-redux";

const TotalSellers = () => {
  const totalSellers = useSelector((state) => state.dashboard.totalSellers);

  return (
    <div className="bg-green-50 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start">
        <p className="text-3xl font-bold">{totalSellers}</p>
        <p className="text-sm text-gray-500">Total Sellers</p>
      </div>
      <i className="fa-regular fa-user text-green-500 text-3xl"></i>
    </div>
  );
};

export default TotalSellers;
