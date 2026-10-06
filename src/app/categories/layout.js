import Navbar from "@/components/user/Navbar";

export const metadata = {
  title: "Categories",
  description: "Browse product categories at 3Z Shop.",
};

export default function CategoriesLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
