import TotalProducts from "@/components/TotalProducts";
import Sidebar from "@/components/SideBar";

const ProductsPage = () => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <TotalProducts />
        {/* Add more components or content as needed */}
      </div>
    </div>
  );
};

export default ProductsPage;
