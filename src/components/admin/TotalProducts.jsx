// Objective: create a component that shows the total number of products in the database.
"use client";
import { useSelector } from "react-redux";

const TotalProducts = () => {
  const totalProducts = useSelector((state) => state.dashboard.totalProducts);

  return (
    <div className="bg-violet-50 p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start">
        <p className="text-3xl font-bold">{totalProducts}</p>
        <p className="text-sm text-gray-500">Total Products</p>
      </div>
      <i className="fa-regular fa-box text-violet-500 text-3xl"></i>
    </div>
  );
};

export default TotalProducts;
