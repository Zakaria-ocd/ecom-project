"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
import { FaCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function ExpandedOrdersTable({
  orders,
  expandedOrderId,
  setExpandedOrderId,
}) {
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    if (orders.length > 0 && expandedOrderId) {
      async function getUserImage(expandedOrderId) {
        const user_id = orders.find(
          (order) => order.order_id == expandedOrderId
        ).user_id;
        console.log(user_id);
        if (user_id) {
          const res = await fetch(
            `http://localhost:8000/api/users/image/${user_id}`
          );
          console.log(expandedOrderId);
          const blob = await res.blob();
          const objectURL = URL.createObjectURL(blob);
          setUserImage(objectURL);
          console.log(objectURL);
        }
      }
      getUserImage(expandedOrderId);
    }
  }, [expandedOrderId, orders]);

  function getStatusColor(status) {
    if (status == "pending") {
      return "text-sky-400/80";
    } else if (status == "shipped") {
      return "text-yellow-400/80";
    } else if (status == "delivered") {
      return "text-green-400/80";
    }
  }

  const total = orders.reduce(
    (sum, order) => sum + Number(order.total_price),
    0
  );

  console.log(expandedOrderId);

  return (
    <div className="w-full mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-slate-800"></TableHead>
            <TableHead className="text-slate-800">Order</TableHead>
            <TableHead className="text-slate-800">Total</TableHead>
            <TableHead className="text-slate-800">Username</TableHead>
            <TableHead className="text-slate-800 ">Status</TableHead>
            <TableHead className="text-center l-20 text-slate-800">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <Fragment key={order.order_id}>
              <TableRow
                onClick={() => {
                  setUserImage("");
                  setExpandedOrderId(
                    expandedOrderId == order.order_id ? null : order.order_id
                  );
                }}
                className="cursor-pointer h-16 hover:bg-slate-100 transition"
              >
                <TableCell className=" flex items-center pl-6 w-14  h-16 justify-start">
                  <i
                    className={`fa-solid ml-2 fa-angle-down transition-transform ${
                      expandedOrderId == order.order_id ? "rotate-180" : ""
                    }`}
                  />
                </TableCell>
                <TableCell className="text-black/70">
                  {order.order_id}
                </TableCell>
                <TableCell className="text-black/70">
                  ${order.total_price}
                </TableCell>
                <TableCell className="text-black/70">
                  {order.username}
                </TableCell>
                <TableCell className="text-black/55 ">
                  <div
                    className={`flex items-center gap-1.5 capitalize text-[13.5px] font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    <FaCircle size={7} />
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="text-center ">
                  <div className="flex justify-center items-center gap-5 text-lg">
                    <i className="fa-regular fa-pen-to-square text-teal-600"></i>
                    <i className="fa-solid fa-xmark-large text-red-600"></i>
                  </div>
                </TableCell>
              </TableRow>
              <AnimatePresence>
                {expandedOrderId == order.order_id && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.3, ease: "easeInOut" },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.3, ease: "easeInOut" },
                    }}
                  >
                    <TableCell colSpan={6} className="p-0 overflow-hidden">
                      <motion.div
                        initial={{ y: -20, height: 0 }}
                        animate={{
                          y: 0,
                          height: "auto",
                          transition: { delay: 0.1, duration: 0.4 },
                        }}
                        exit={{
                          y: -20,
                          height: 0,
                          transition: { duration: 0.3 },
                        }}
                        className="pl-14"
                      >
                        <h1 className="h-11 flex text-lg font-semibold items-center">
                          Order for
                        </h1>
                        <Table className="w-[980px]">
                          <TableHeader>
                            <TableRow className="bg-blue-500   hover:bg-blue-400">
                              <TableHead className="w-[130px]"></TableHead>
                              <TableHead className="text-slate-800 w-[100px]">
                                UserName
                              </TableHead>
                              <TableHead className="text-slate-800 pl-[104px]">
                                Email
                              </TableHead>
                              <TableHead className="text-slate-800">
                                Role
                              </TableHead>
                              <TableHead className="text-center text-slate-800">
                                Products total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="p-4 h-24 flex  bg-slate-50">
                                {!userImage ? (
                                  <Skeleton className="size-16 rounded-full" />
                                ) : (
                                  <Image
                                    alt="User profile"
                                    src={userImage}
                                    width={80}
                                    height={80}
                                    className="size-16   rounded-full object-cover"
                                  />
                                )}
                              </TableCell>
                              <TableCell className="text-black/70">
                                {order.username}
                              </TableCell>
                              <TableCell className="text-black/70 text-center">
                                {order.email}
                              </TableCell>
                              <TableCell className="text-black/70 capitalize">
                                {order.role}
                              </TableCell>
                              <TableCell className="text-black/70 text-center capitalize">
                                {order.products_total}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                )}
              </AnimatePresence>
            </Fragment>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell className="font-semibold text-black"></TableCell>
            <TableCell className="font-semibold text-black">Total</TableCell>
            <TableCell className="text-black/55 font-semibold">
              ${total.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
