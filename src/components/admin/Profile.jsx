"use client";
import { useSelector } from "react-redux";
import ProfileAvatar from "./ProfileAvatar";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { logoutUser } from "@/features/user/userSlice";

export default function Profile() {
  const [profileVisibility, setProfileVisibility] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const router = useRouter();
  const profileRef = useRef(false);
  console.log(user)
  async function logout() {
    const response = await fetch("http://localhost:8000/api/admin/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.getItem("token")
        }`,
      },
    });
    const data = await response.json();
    console.log(data);
    if (data.ok) {
      localStorage.removeItem("token");
      logoutUser()
      router.replace("/admin/login");
    }
  }
  useEffect(() => {
    async function getImage() {
      // if (localStorage.getItem("token")) {
      //   const userEmail = JSON.parse(localStorage.getItem("token")).userEmail;
      //   const res = await fetch(
      //     `http://localhost:8000/api/users/image/email/${userEmail}`
      //   );
      //   const blob = await res.blob();
      //   const objectURL = URL.createObjectURL(blob);
      //   setUserImage(objectURL);
      // }
    }
    getImage();
  }, []);
  return (
    <div className="flex justify-between items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        title="Notifications"
        className="[&_svg]:size-6"
      >
        <FaBell className="text-sky-500" size={24} />
      </Button>
      <div className="relative" ref={profileRef}>
        <ProfileAvatar
          profileVisibility={profileVisibility}
          setProfileVisibility={(value) => setProfileVisibility(value)}
        />
        <div
          className={`${
            profileVisibility ? "visible" : "hidden"
          } absolute right-0 bg-white border rounded-lg shadow-md`}
        >
          <div className="flex w-[230px] items-center px-3 py-2 space-x-2">
              {!user.image ? (
              <Skeleton className="size-16 rounded-full" />
              ) : (
                <Image
                  src={user.image}
                  width={40}
                  height={40}
                  alt="Avatar"
                  className=" rounded-full object-cover size-9 p-px ring-2"
                />
              )}
            <div className="w-[70%] flex flex-col items-start">
              <span className="text-md text-start text-slate-700 text-nowrap font-medium">
                {user.username}
              </span>
              <span className="text-gray-500 text-sm">{user.email}</span>
            </div>
          </div>
          <span className="block w-full h-px bg-slate-200" />
          <div className="w-full flex flex-col items-start text-slate-500 p-2 font-medium">
            <button className="w-full flex items-center gap-1 text-sm text-left px-2 py-1 hover:bg-slate-100 rounded-md transition-colors">
              <i className="fa-regular fa-user-gear"></i>
              My Account
            </button>
            <button className="w-full flex items-center gap-1 text-sm text-left px-2 py-1 hover:bg-slate-100 rounded-md transition-colors">
              <i className="fa-regular fa-headset"></i>
              Service
            </button>
            <button className="w-full flex items-center gap-1 text-sm text-left px-2 py-1 hover:bg-slate-100 rounded-md transition-colors">
              <i className="fa-regular fa-gear"></i>
              Settings
            </button>
          </div>
          <span className="block w-full h-px bg-slate-200" />
          <div className="w-full p-2 font-semibold">
            <button
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              className="w-full flex items-center gap-2 text-sm text-rose-500 text-left px-2 py-1 rounded-md transition-colors group hover:bg-rose-100 hover:text-rose-600"
            >
              <div className="flex justify-center items-center">
                <i className="fa-regular fa-bracket-square"></i>
                <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
              </div>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
