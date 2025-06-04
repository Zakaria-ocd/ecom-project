"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenLine, Trash2, FolderPlus, Eye, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getAuthToken();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = async (category) => {
    const response = await fetch(`http://localhost:8000/api/categories`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: category.id }),
    });

    setCategories((prev) => prev.filter((c) => c.id !== category.id));

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }

    toast.success("Category deleted successfully");
  };

  async function fetchCategories() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      const categoriesData = data.data || [];

      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          try {
            const productsResponse = await fetch(
              `http://localhost:8000/api/categories/${category.id}/products`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (productsResponse.ok) {
              const productsData = await productsResponse.json();
              return {
                ...category,
                products_count: productsData.products?.length || 0,
              };
            }
            return category;
          } catch (error) {
            console.error(
              `Error fetching products for category ${category.id}:`,
              error
            );
            return category;
          }
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Categories Management</h1>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <Skeleton className="h-8 w-full max-w-md mb-6" />
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="w-full flex items-center justify-between"
                  >
                    <Skeleton className="h-5 w-1/6" />
                    <Skeleton className="h-5 w-1/6" />
                    <Skeleton className="h-5 w-10" />
                    <Skeleton className="h-5 w-1/6" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="size-8" />
                      <Skeleton className="size-8" />
                      <Skeleton className="size-8" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories Management</h1>
        <Button asChild>
          <Link href="/admin/categories/create">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add New Category
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableCaption>List of all product categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {category.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-cyan-700"
                    >
                      {category.products_count || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(category.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-8 px-2"
                      >
                        <Link href={`/admin/categories/${category.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-8 px-2"
                      >
                        <Link href={`/admin/categories/edit/${category.id}`}>
                          <PenLine className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Category</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Are you sure you want to delete this category?
                          </DialogDescription>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => handleDeleteClick(category)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
