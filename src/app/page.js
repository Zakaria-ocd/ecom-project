import HeroSection from "@/components/user/HeroSection";
import Navbar from "@/components/user/Navbar";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <HeroSection />
    </div>
  );
}
