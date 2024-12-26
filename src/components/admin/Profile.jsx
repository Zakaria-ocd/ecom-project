"use client";
import { useSelector } from "react-redux";
import ProfileAvatar from "./ProfileAvatar";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Profile() {
  const [profileVisibility, setProfileVisibility] = useState(false);

  const adminUsername = useSelector((state) => state.dashboard.adminUsername);
  const adminEmail = useSelector((state) => state.dashboard.adminEmail);

  const profileRef = useRef(false);

  useEffect(() => {
    // Toggle profile visibility
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileVisibility(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
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
        <div className="flex items-center px-3 py-2 space-x-2">
          <button>
            <Image
              src={"/assets/avatar.jpg"}
              width={40}
              height={40}
              alt="Avatar"
              className="w-full h-full rounded-full p-px ring-2"
            />
          </button>
          <div className="w-48 max-w-56 flex flex-col items-start">
            <span className="text-md text-start text-slate-700 text-nowrap font-medium">
              {adminUsername}
            </span>
            <span className="text-gray-500 text-sm">{adminEmail}</span>
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
          <button className="w-full flex items-center gap-2 text-sm text-rose-500 text-left px-2 py-1 rounded-md transition-colors group hover:bg-rose-100 hover:text-rose-600">
            <div className="flex justify-center items-center">
              <i className="fa-regular fa-bracket-square"></i>
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </div>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
