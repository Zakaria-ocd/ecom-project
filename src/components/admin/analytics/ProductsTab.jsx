"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";

const COLORS = [
  "#63B3ED",
  "#34D399",
  "#F6AD55",
  "#9F7AEA",
  "#FC8181",
  "#4FD1C5",
];

export default function ProductsTab({ data, period, loading }) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryDistribution = data?.categoryDistribution || [
    { name: "No Categories", value: 1 },
  ];

  const inventoryStatus = data?.inventoryStatus || [
    { name: "In Stock", value: 0 },
    { name: "Low Stock", value: 0 },
    { name: "Out of Stock", value: 0 },
  ];

  const topProductsByCategory = data?.topProductsByCategory || [
    {
      name: "No Products",
      category: "Uncategorized",
      price: 0,
      stock: 0,
      rating: 0,
    },
  ];

  const getPeriodText = () => {
    switch (period) {
      case "day":
        return "the last 24 hours";
      case "week":
        return "the last 7 days";
      case "month":
        return "the last 30 days";
      case "year":
        return "the last year";
      default:
        return "the selected period";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Distribution of products by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>
              Current inventory status by stock level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={inventoryStatus}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} products`, "Quantity"]}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Quantity">
                    {inventoryStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "In Stock"
                            ? "#34D399"
                            : entry.name === "Low Stock"
                            ? "#F6AD55"
                            : "#FC8181"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-center">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              In Stock
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              Low Stock
            </Badge>
            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">
              Out of Stock
            </Badge>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products by Category</CardTitle>
          <CardDescription>
            Comparing default prices (first choice) and stock levels for{" "}
            {getPeriodText()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProductsByCategory}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 80,
                  left: 20,
                }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    value.length > 20 ? `${value.substring(0, 20)}...` : value
                  }
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "price") return [`$${value}`, "Default Price"];
                    if (name === "stock") return [`${value} units`, "Stock"];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar dataKey="price" name="Default Price ($)" fill="#63B3ED" />
                <Bar dataKey="stock" name="Stock" fill="#34D399" />
                <ReferenceLine y={0} stroke="#000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
