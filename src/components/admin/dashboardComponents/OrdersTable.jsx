"use client";
import { Table, TableCaption ,TableBody,TableCell,TableFooter,TableHead,TableHeader,TableRow} from "@/components/ui/table";
import { useState,useEffect} from "react";

function OrdersTable() {
  const [orders,setOrders]=useState([]);
  useEffect(()=>{
      async function getData(){
        const data =await fetch("http://localhost:8000/api/orders/7");
        setOrders(await data.json());
      }
      getData()
    },[])
  let total=0
  function getStatusColor(status){
    if(status=="pending"){
      return 'bg-sky-500'
    }
    else if (status == "shipped") {
      return "bg-yellow-500";
    } else if (status == "delivered") {
      return "bg-green-500";
    }
  }
  return (
    <Table className="-ml-2">
      <TableHeader>
        <TableRow className="">
          <TableHead className=" text-slate-800">Name</TableHead>
          <TableHead className="text-slate-800">Total</TableHead>
          <TableHead className="text-slate-800">Status</TableHead>
          <TableHead className="text-right text-slate-800">View</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          total += Number(order.total_price);
          return (
            <TableRow className="" key={order.order_id}>
              <TableCell className="font-medium py-4 text-black/55">
                {order.username}
              </TableCell>
              <TableCell className="text-black/55">
                {order.total_price}
              </TableCell>
              <TableCell className="text-black/55 text-center">
                <div
                  className={`w-24 flex items-center justify-center rounded-sm text-gray-200 h-7 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </TableCell>
              <TableCell className="text-right pr-4 cursor-pointer text-black/55">
                <i className="fa-light fa-eye cursor-pointer hover:text-black hover:text-lg"></i>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className=" text-black/55">{`$${total}`}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default OrdersTable;