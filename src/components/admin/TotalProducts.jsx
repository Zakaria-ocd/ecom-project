export default function TotalProducts({ totalProducts }) {
  return (
    <div className="bg-white p-4 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-violet-500 text-3xl font-bold">{totalProducts}</p>
        <p className="text-sm text-slate-600">Total Products</p>
      </div>
      <div className="bg-violet-50 p-3 rounded-md">
        <i className="fa-regular fa-boxes text-violet-600 text-[28px]" />
      </div>
    </div>
  );
}
