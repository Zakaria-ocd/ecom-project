import { TbUserDollar } from "react-icons/tb";

const TotalSellers = () => {
  // const totalSellers = useSelector((state) => state.dashboard.totalSellers);

  return (
    <div className="bg-white p-4 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-orange-500 text-3xl font-bold">{120}</p>
        <p className="text-sm text-gray-600">Total Sellers</p>
      </div>
      <div className="bg-amber-50 p-3 rounded-md">
        <TbUserDollar className="text-amber-600" size={28} />
      </div>
    </div>
  );
}
export default TotalSellers;
