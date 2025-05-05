"use client";

const TotalOrders = ({ordersCount}) => {
  console.log(ordersCount)
  return (
    <div className="bg-sky-100 p-3 border border-slate-200/40 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex flex-col items-start space-y-4">
        <p className="text-sky-500 text-3xl font-bold">{ordersCount}</p>
        <p className="text-sm text-gray-600">Total Orders</p>
      </div>
      <i className="fa-regular fa-shopping-cart text-blue-700 text-3xl"></i>
    </div>
  );
};

export default TotalOrders;
