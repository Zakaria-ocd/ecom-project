"use client";
import { useSelector } from "react-redux";

const TotalProducts = () => {
  const totalProducts = useSelector((state) => state.dashboard.totalProducts);

  return (
    <div className="bg-violet-100 p-4 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-violet-500 text-3xl font-bold">{totalProducts}</p>
        <p className="text-sm text-slate-600">Total Products</p>
      </div>
      <i className="fa-regular fa-boxes text-violet-700 text-3xl"></i>
    </div>
  );
};

export default TotalProducts;
