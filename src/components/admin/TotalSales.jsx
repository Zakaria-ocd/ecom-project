"use client";
import { useSelector } from "react-redux";

const TotalSales = () => {
  const totalSales = useSelector((state) => state.dashboard.totalSales);

  return (
    <div className="bg-emerald-100 p-3 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-emerald-500 text-3xl font-bold">{totalSales}</p>
        <p className="text-sm text-slate-600">Total Sales</p>
      </div>
      <i className="fa-regular fa-wallet text-green-700 text-3xl"></i>
    </div>
  );
};

export default TotalSales;
