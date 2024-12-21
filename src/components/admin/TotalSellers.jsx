"use client";
import { TbUserDollar } from "react-icons/tb";
import { useSelector } from "react-redux";

const TotalSellers = () => {
  const totalSellers = useSelector((state) => state.dashboard.totalSellers);

  return (
    <div className="bg-orange-100 p-3 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-orange-500 text-3xl font-bold">{totalSellers}</p>
        <p className="text-sm text-gray-600">Total Sellers</p>
      </div>
      <TbUserDollar className="text-amber-700 text-3xl" />
    </div>
  );
};

export default TotalSellers;
