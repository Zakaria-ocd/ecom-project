"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function SalesTab({ data, period, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Use real data from API or fall back to empty arrays/mock data if not available
  const weeklySalesData = data?.weeklySalesData || [
    { day: "Mon", revenue: 0, orders: 0 },
    { day: "Tue", revenue: 0, orders: 0 },
    { day: "Wed", revenue: 0, orders: 0 },
    { day: "Thu", revenue: 0, orders: 0 },
    { day: "Fri", revenue: 0, orders: 0 },
    { day: "Sat", revenue: 0, orders: 0 },
    { day: "Sun", revenue: 0, orders: 0 },
  ];

  const monthlySalesData = data?.monthlySalesData || [
    { name: "Jan", revenue: 0, previousYear: 0 },
    { name: "Feb", revenue: 0, previousYear: 0 },
    { name: "Mar", revenue: 0, previousYear: 0 },
    { name: "Apr", revenue: 0, previousYear: 0 },
    { name: "May", revenue: 0, previousYear: 0 },
    { name: "Jun", revenue: 0, previousYear: 0 },
    { name: "Jul", revenue: 0, previousYear: 0 },
    { name: "Aug", revenue: 0, previousYear: 0 },
    { name: "Sep", revenue: 0, previousYear: 0 },
    { name: "Oct", revenue: 0, previousYear: 0 },
    { name: "Nov", revenue: 0, previousYear: 0 },
    { name: "Dec", revenue: 0, previousYear: 0 },
  ];

  const topSellingProducts = data?.topSellingProducts || [
    { name: "No Products", sales: 0 },
  ];

  // Get period text for display
  const getPeriodText = () => {
    switch (period) {
      case "day": return "the last 24 hours";
      case "week": return "the last 7 days";
      case "month": return "the last 30 days";
      case "year": return "the last year";
      default: return "the selected period";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Revenue</CardTitle>
          <CardDescription>Monthly revenue vs. last year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlySalesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name="This Year"
                />
                <Line
                  type="monotone"
                  dataKey="previousYear"
                  stroke="#82ca9d"
                  strokeDasharray="5 5"
                  name="Last Year"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>
              Orders and revenue for {getPeriodText()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklySalesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" />
                  <YAxis 
                    yAxisId="left"
                    label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    label={{ value: 'Orders', angle: 90, position: 'insideRight' }} 
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value, name) => {
                    if (name === "revenue") return [`$${value}`, "Revenue"];
                    return [value, name];
                  }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#ff7300"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Products with the highest sales volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSellingProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value} units`, 'Sales']} />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
