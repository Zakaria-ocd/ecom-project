import { TbUserDollar } from "react-icons/tb";

export default function TotalSellers({ totalSellers }) {
  return (
    <div className="bg-white p-4 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-amber-500 text-3xl font-bold">{totalSellers}</p>
        <p className="text-sm text-gray-600">Total Sellers</p>
      </div>
      <div className="bg-amber-50 p-3 rounded-md">
        <TbUserDollar className="text-amber-600" size={28} />
      </div>
    </div>
  );
}
