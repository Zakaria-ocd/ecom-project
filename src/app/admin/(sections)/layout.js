"use client";
import { Provider } from "react-redux";
import store from "@/store";
import Sidebar from "@/components/admin/SideBar";
import Navbar from "@/components/admin/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <Provider store={store}>
      <div className="flex bg-slate-50">
        <Sidebar />
        <div className="w-full h-screen flex flex-col">
          <Navbar />
          <div className="size-full overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </Provider>
  );
}
