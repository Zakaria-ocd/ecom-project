"use client";
import Sidebar from "./SideBar";
import Profile from "./Profile";
import Search from "./Search";
import TotalSales from "./TotalSales";
import TotalProducts from "./TotalProducts";
import TotalSellers from "./TotalSellers";
import TotalOrders from "./TotalOrders";
import { Button } from "../ui/button";
import OrdersTable from "./dashboardComponents/OrdersTable";
import ShowUsers from "./dashboardComponents/ShowUsers";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="max-h-[300vh] w-full flex flex-col space-y-4">
        {/* Top bar */}
        <div className="w-full h-[63px] bg-white flex justify-between items-center border-b px-4 py-2 shadow-sm">
          <Search />
          <Profile />
        </div>

        {/* Dashboard cards */}
        <div className="flex flex-col gap-10 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TotalSales />
            <TotalProducts />
            <TotalSellers />
            <TotalOrders />
          </div>
          <div className="w-full  flex justify-between">
            <div className="w-[65%] pl-6 flex flex-col  ">
              <div className="flex pr-2 justify-between w-full">
                <p className="font-semibold text-[1.15rem] text-slate-800">
                  Recent orders
                </p>
                <Button className="  p-2 h-8 bg-sky-500  hover:bg-sky-600">
                  <Link href='/admin/orders'>View All</Link>
                </Button>
              </div>
              <OrdersTable></OrdersTable>
            </div>
            <div className="w-[33%]  h-full">
              <div className="flex pr-2 justify-between w-full">
                <p className="font-semibold text-[1.15rem] text-slate-800">
                  Recent orders
                </p>
                <Button className="  p-2 h-8 bg-sky-500  hover:bg-sky-600">
                  View All
                </Button>
              </div>
                <ShowUsers></ShowUsers>
            </div>
          </div>
        </div>

        {/* Recent messages */}
        {/* <div className="flex-1 px-4">
          <RecentSellerMessages />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
