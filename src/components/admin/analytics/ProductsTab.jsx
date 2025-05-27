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
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6B6B",
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

  // Use real data from API or fall back to empty arrays/mock data if not available
  const categoryDistribution = data?.categoryDistribution || [
    { name: "No Categories", value: 1 },
  ];

  const inventoryStatus = data?.inventoryStatus || [
    { name: "In Stock", value: 0 },
    { name: "Low Stock", value: 0 },
    { name: "Out of Stock", value: 0 },
  ];

  const productPerformance = data?.productPerformance || [
    { x: 0, y: 0, z: 100, name: "No Products" },
  ];

  // Get period text for display
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
                          index === 0
                            ? "#00C49F"
                            : index === 1
                            ? "#FFBB28"
                            : "#FF8042"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-center">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              In Stock
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              Low Stock
            </Badge>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
              Out of Stock
            </Badge>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Performance Analysis</CardTitle>
          <CardDescription>
            Comparing sales volume, revenue, and stock level for{" "}
            {getPeriodText()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Sales" unit=" units" />
                <YAxis type="number" dataKey="y" name="Revenue" unit="$" />
                <ZAxis
                  type="number"
                  dataKey="z"
                  range={[60, 400]}
                  name="Stock Level"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => {
                    if (name === "z") return [`${value} units`, "Stock Level"];
                    if (name === "x") return [`${value} units`, "Sales"];
                    if (name === "y") return [`$${value}`, "Revenue"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Scatter
                  name="Products"
                  data={productPerformance}
                  fill="#8884d8"
                >
                  {productPerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
