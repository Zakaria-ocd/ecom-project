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
      <div className="flex flex-col gap-10 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TotalSales totalSales={123} />
          <TotalProducts totalProducts={265} />
          <TotalSellers totalSellers={27} />
          <TotalOrders totalOrders={152} />
        </div>
        <div className="w-full flex justify-between gap-6 px-2">
          <div className="w-9/12 flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <p className="font-semibold text-[1.15rem] text-slate-800">
                Recent orders
              </p>
              <Link href={"/admin/orders"}>
                <Button className="p-2 h-8 bg-sky-500  hover:bg-sky-600">
                  View All
                </Button>
              </Link>
            </div>
            <OrdersTable />
          </div>
          <div className="w-3/12 flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <p className="font-semibold text-[1.15rem] text-slate-800">
                Recent users
              </p>
              <Link href={"/admin/users"}>
                <Button className="p-2 h-8 bg-sky-500 hover:bg-sky-600">
                  View All
                </Button>
              </Link>
            </div>
            <ShowUsers />
          </div>
        </div>
      </div>
    </>
  );
}
