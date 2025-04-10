import TotalProducts from "@/components/admin/TotalProducts";
import Sidebar from "@/components/admin/SideBar";

export default function ProductsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <TotalProducts />
      </div>
    </div>
  );
}
