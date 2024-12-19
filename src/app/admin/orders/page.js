import TotalOrders from "@/components/admin/TotalOrders";
import Sidebar from "@/components/admin/SideBar";

const OrdersPage = () => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <TotalOrders />
        {/* Add more components or content as needed */}
      </div>
    </div>
  );
};

export default OrdersPage;
