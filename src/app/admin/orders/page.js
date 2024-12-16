import TotalOrders from "@/components/TotalOrders";
import Sidebar from "@/components/SideBar";

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
