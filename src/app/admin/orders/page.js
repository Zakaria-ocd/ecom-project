import TotalOrders from "@/components/admin/TotalOrders";
import Sidebar from "@/components/admin/SideBar";
import OrdersTable from "@/components/admin/orderComponents/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="flex">
      <Sidebar section="Orders" />
      <div className="flex-1 p-6">
        <TotalOrders />
        <OrdersTable></OrdersTable>
      </div>
    </div>
  );
}
