import Navbar from "@/components/user/Navbar";

export const metadata = {
  title: "Categories | E-commerce",
  description: "Browse our product categories",
};

export default function CategoriesLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
