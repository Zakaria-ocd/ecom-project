"use client";
import { Provider, useDispatch } from "react-redux";
import store from "@/store";
import Sidebar from "@/components/admin/SideBar";
import Profile from "@/components/admin/Profile";
import Search from "@/components/admin/Search";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authUser, fetchUserImage } from "@/features/user/userSlice";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function checkAuuth() {
      if (!localStorage.getItem("token")) {
        return router.replace("/admin/login");
      }
      const response = await fetch(
        "http://localhost:8000/api/admin/checkAuth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.ok && data.user) {
        const user = data.user;
        setLoading(true);
        dispatch(authUser(user));
        dispatch(fetchUserImage(user.id));
      } else {
        router.replace("/admin/login");
      }
    }
    checkAuuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading ? (
        <Provider store={store}>
          <div className="flex bg-slate-50">
            <Sidebar />
            <div className="w-full h-screen flex flex-col">
              <div className="w-full h-[63px] bg-white flex justify-between items-center border-b px-4 py-2 shadow-sm">
                <Search />
                <Profile />
              </div>
              <div className="size-full overflow-y-auto">{children}</div>
            </div>
          </div>
        </Provider>
      ) : (
        <div className="w-screen h-screen flex items-center justify-center">
          <Loader2 className="size-16 animate-spin text-blue-600" />
        </div>
      )}
    </>
  );
}
