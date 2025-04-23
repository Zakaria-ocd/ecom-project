"use client";
import { Provider } from "react-redux";
import store from "@/store";
import Sidebar from "@/components/admin/SideBar";
import Profile from "@/components/admin/Profile";
import Search from "@/components/admin/Search";

export default function DashboardLayout({ children }) {
  return (
    <Provider store={store}>
      <div className="flex bg-slate-50">
        <Sidebar />
        <div className="w-full h-screen flex flex-col space-y-4">
          <div className="w-full h-[63px] bg-white flex justify-between items-center border-b px-4 py-2 shadow-sm">
            <Search />
            <Profile />
          </div>
          <div className="size-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </Provider>
  );
}
