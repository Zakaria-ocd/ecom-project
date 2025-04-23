import TotalSales from "../TotalSales";
import TotalProducts from "../TotalProducts";
import TotalSellers from "../TotalSellers";
import TotalOrders from "../TotalOrders";
import { Button } from "../../ui/button";
import OrdersTable from "./OrdersTable";
import ShowUsers from "./ShowUsers";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
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
              <Link href={"/admin/orders"}><Button className="  p-2 h-8 bg-sky-500  hover:bg-sky-600">
                View All
              </Button></Link>
            </div>
            <OrdersTable />
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
            <ShowUsers />
          </div>
        </div>
      </div>
    </>
  );
}
