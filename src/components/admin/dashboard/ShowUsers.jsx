"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShowUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await fetch("http://localhost:8000/api/users/8");
      setUsers(await data.json());
    }
    fetchUsers();
  }, []);

  return (
    <div className="flex mt-3 ml-2 flex-col gap-4">
      {users.map((item) => (
        <div className="w-full h-9 flex items-center gap-2" key={item.id}>
          <Image
            alt={item.username}
            src={`/assets/users/${item.image}`}
            height={"300"}
            width={"500"}
            className="size-9 object-cover rounded-full"
          ></Image>
          <div className="flex w-[60%] h-full flex-col justify-between">
            <p className="font-semibold text-[0.9rem]">{item.username}</p>
            <p className="text-[0.8rem] text-black/55">{item.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
