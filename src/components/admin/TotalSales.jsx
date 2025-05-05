import { Wallet2 } from "lucide-react";

const TotalSales = () => {
  // const totalSales = useSelector((state) => state.dashboard.totalSales);

  return (
    <div className="bg-white p-4 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-emerald-500 text-3xl font-bold">{200}</p>
        <p className="text-sm text-slate-600">Total Sales</p>
      </div>
      <div className="bg-emerald-100/50 p-3 rounded-md">
        <Wallet2 className="text-emerald-600" size={28} />
      </div>
    </div>
  );
}
export default TotalSales;
