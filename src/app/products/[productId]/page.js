import Navbar from "@/components/user/Navbar";
import Product from "@/components/user/Product";

export default function ProductPage() {
  return (
    <div className="w-full min-h-screen bg-white transition-colors dark:bg-gray-900">
      <Navbar />
      <Product />
    </div>
  );
}
