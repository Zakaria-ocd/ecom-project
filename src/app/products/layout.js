import Navbar from "@/components/user/Navbar";

export default function ProductsPage({ children }) {
  return (
    <div className="w-full min-h-screen bg-gray-100 transition-colors dark:bg-gray-900">
      <Navbar />
      {children}
    </div>
  );
}
