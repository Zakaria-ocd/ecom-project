"use client";
import Navbar from "@/components/user/Navbar";

export default function UserLayout({ children }) {
  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full h-[calc(100vh-56px)] dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
}
