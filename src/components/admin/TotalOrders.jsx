"use client";

const TotalOrders = ({ordersCount}) => {
  console.log(ordersCount)
  return (
    <div className="bg-white p-4 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-sky-500 text-3xl font-bold">{ordersCount}</p>
        <p className="text-sm text-gray-600">Total Orders</p>
      </div>
      <div className="bg-sky-50 p-3 rounded-md">
        <i className="fa-regular fa-shopping-cart text-sky-600 text-[28px]" />
      </div>
    </div>
  );
}
