"use client";
import Sidebar from "./SideBar";
import Profile from "./Profile";
import Search from "./Search";
import TotalSales from "./TotalSales";
import TotalProducts from "./TotalProducts";
import TotalSellers from "./TotalSellers";
import TotalOrders from "./TotalOrders";
import RecentSellerMessages from "./RecentSellerMessages";

const Dashboard = () => {
  return (
    <div className="flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="h-[300vh] w-full flex flex-col space-y-4">
        {/* Top bar */}
        <div className="w-full h-[63px] bg-white flex justify-between items-center border-b px-4 py-2 shadow-sm">
          <Search />
          <Profile />
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          <TotalSales />
          <TotalProducts />
          <TotalSellers />
          <TotalOrders />
        </div>

        {/* Recent messages */}
        <div className="flex-1 px-4">
          <RecentSellerMessages />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
