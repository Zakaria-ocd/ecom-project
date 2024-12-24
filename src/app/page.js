import HeroSection from "@/components/user/HeroSection";
import Navbar from "@/components/user/Navbar";
import Products from "@/components/user/Products";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <HeroSection />
      <Products></Products>
    </div>
  );
}
