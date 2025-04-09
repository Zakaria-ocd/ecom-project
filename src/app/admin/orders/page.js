import TotalOrders from "@/components/admin/TotalOrders";
import Sidebar from "@/components/admin/SideBar";

export default function OrdersPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <TotalOrders />
      </div>
    </div>
  );
}
