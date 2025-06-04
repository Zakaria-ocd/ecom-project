"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAuthenticated } from "@/lib/auth";
import { getUserOrders } from "@/lib/order";
import { Loader2, ChevronRight, Eye, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MdOutlineLocalShipping, MdPendingActions } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/user/login?redirect=orders");
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getUserOrders();

      const sortedOrders = [...(data.orders || [])].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  function getStatus(status) {
    const base = "flex items-center gap-1 capitalize font-medium text-[13.5px]";

    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return (
          <div className={`${base} text-green-500 dark:text-green-400`}>
            <PackageCheck size={16} />
            <span>{status}</span>
          </div>
        );
      case "processing":
      case "shipped":
        return (
          <div className={`${base} text-yellow-500 dark:text-yellow-400`}>
            <MdOutlineLocalShipping size={16} />
            <span>{status}</span>
          </div>
        );
      case "pending":
        return (
          <div className={`${base} text-sky-500 dark:text-sky-400`}>
            <MdPendingActions size={16} />
            <span>{status}</span>
          </div>
        );
      case "cancelled":
        return (
          <div className={`${base} text-red-500 dark:text-red-400`}>
            <RxCross2 size={16} />
            <span>{status}</span>
          </div>
        );
      default:
        return (
          <div className={`${base} text-slate-500 dark:text-slate-400`}>
            <span>{status}</span>
          </div>
        );
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/user/orders">Orders</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-2">
            My Orders
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            View your past orders
          </p>
        </div>
      </div>

      <div className="w-full rounded-lg border shadow-sm overflow-hidden dark:border-slate-700">
        {loading ? (
          <div className="flex items-center justify-center h-64 border rounded-lg bg-slate-50 dark:bg-gray-800 dark:border-slate-700">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
              <p className="text-slate-500 dark:text-slate-400">
                Loading orders...
              </p>
            </div>
          </div>
        ) : orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-950 dark:border-slate-700">
                <TableHead className="font-semibold text-slate-800 dark:text-slate-200">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-slate-800 dark:text-slate-200">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-slate-800 dark:text-slate-200">
                  Total
                </TableHead>
                <TableHead className="font-semibold text-slate-800 dark:text-slate-200">
                  Status
                </TableHead>
                <TableHead className="w-20 font-semibold text-slate-800 dark:text-slate-200">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:bg-slate-950/50">
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <TableCell className="font-medium text-slate-900 dark:text-slate-200">
                    #{order.id}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {formatDate(order.created_at)}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatus(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Link href={`/user/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 px-2 dark:text-slate-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 px-4 bg-white dark:bg-gray-800">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
            >
              Browse Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
