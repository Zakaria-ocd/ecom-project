"use client";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "../ui/button";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/features/user/userSlice";
import ProfileImage from "@/components/user/ProfileImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FaUserGear,
  FaGear,
  FaHeadset,
  FaRightFromBracket,
} from "react-icons/fa6";

export default function Profile() {
  const user = useSelector((state) => state.userReducer);
  const router = useRouter();

  async function logout() {
    const response = await fetch("http://localhost:8000/api/admin/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (data.ok) {
      localStorage.removeItem("token");
      logoutUser();
      router.replace("/admin/login");
    }
  }

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <ProfileImage
              imageUrl={
                user?.image
                  ? `http://localhost:8000/api/users/imageById/${user.id}`
                  : null
              }
              previewUrl={null}
              username={user?.username}
              onImageChange={() => {}}
              className="w-9 h-9"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 mr-4" align="end">
          <div className="flex items-center p-3 gap-3">
            <ProfileImage
              imageUrl={
                user?.image
                  ? `http://localhost:8000/api/users/imageById/${user.id}`
                  : null
              }
              previewUrl={null}
              username={user?.username}
              onImageChange={() => {}}
              className="w-10 h-10"
            />
            <div className="flex flex-col space-y-0.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user?.username}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                {user?.email}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <FaUserGear className="mr-2 h-4 w-4" />
              <span>My Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FaHeadset className="mr-2 h-4 w-4" />
              <span>Service</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <FaGear className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-rose-500 hover:text-rose-600 focus:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
            onClick={logout}
          >
            <FaRightFromBracket className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
