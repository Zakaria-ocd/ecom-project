"use client";
import ProfileImage from "@/components/user/ProfileImage";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await fetch("http://localhost:8000/api/users/8/limit");
        setUsers(await data.json());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="flex mt-3 ml-2 flex-col gap-1.5">
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div
            className="w-full h-12 flex items-center gap-2 px-2 py-1 rounded-md bg-slate-100/50 animate-pulse"
            key={index}
          >
            <Skeleton className="size-9 rounded-full" />
            <div className="flex flex-1 h-full flex-col justify-between gap-1">
              <Skeleton className="h-[0.9rem] w-3/4 rounded" />
              <Skeleton className="h-[0.8rem] w-1/2 rounded" />
            </div>
          </div>
        ))
      ) : users.length > 0 ? (
        users.map((item) => (
          <Link
            href={`/admin/users/${item.id}`}
            className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
            key={item.id}
          >
            <ProfileImage
              imageUrl={`http://localhost:8000/api/users/image/${item.image}`}
              username={item.username}
              previewUrl={null}
              onImageChange={() => {}}
            />
            <div className="flex w-[60%] h-full flex-col justify-between">
              <p className="font-semibold text-[0.9rem]">{item.username}</p>
              <p className="text-[0.8rem] text-black/55">{item.email}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-center text-slate-500">No users found</p>
      )}
    </div>
  );
}
