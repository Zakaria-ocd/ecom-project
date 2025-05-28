"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Loader2 className="animate-spin text-blue-500 h-20 w-20" />
    </div>
  );
}
