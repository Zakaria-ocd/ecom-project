"use client";
import Navbar from "@/components/user/Navbar";

export default function UserPage({ children }) {
  return (
    <div className="w-full">
      <Navbar />
      {children}
    </div>
  );
}
