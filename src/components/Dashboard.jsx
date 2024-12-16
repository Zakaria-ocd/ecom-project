'use client';

import Sidebar from './SideBar';
import Profile from './Profile';
import Search from './Search';
import TotalSales from './TotalSales';
import TotalProducts from './TotalProducts';
import TotalSellers from './TotalSellers';
import TotalOrders from './TotalOrders';
import RecentSellerMessages from './RecentSellerMessages';
import '../styles/styles-dashboard.css';

const Dashboard = () => {
  return (
    <div className="flex  h-screen ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 p-6 bg-indigo-200">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6 bg-indigo-400">
          <Search className="mr-4 " />
          <Profile />
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <TotalSales />
          <TotalProducts />
          <TotalSellers />
          <TotalOrders />
        </div>

        {/* Recent messages */}
        <div className="flex-1">
          <RecentSellerMessages />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
