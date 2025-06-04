"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PenLine, Trash2, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { getAuthToken } from "@/lib/auth";

export default function CategoryDetailPage() {
  const router = useRouter();
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const token = getAuthToken();

  useEffect(() => {
    fetchCategoryData();
  }, [categoryId]);

  async function fetchCategoryData() {
    setLoading(true);
    try {
      const categoryResponse = await fetch(
        `http://localhost:8000/api/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!categoryResponse.ok) {
        throw new Error("Failed to fetch category");
      }

      const categoryData = await categoryResponse.json();
      setCategory(categoryData.data);

      const productsResponse = await fetch(
        `http://localhost:8000/api/categories/${categoryId}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!productsResponse.ok) {
        throw new Error("Failed to fetch category products");
      }

      const productsData = await productsResponse.json();
      const products = productsData.products || [];
      setProducts(products);

      const productDetailsObj = {};

      await Promise.all(
        products.map(async (product) => {
          productDetailsObj[product.id] = {
            images: [],
            choices: [],
            defaultPrice: product.price || 0,
            defaultStock: product.stock || 0,
          };

          try {
            const choicesResponse = await fetch(
              `http://localhost:8000/api/products/${product.id}/choices`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (choicesResponse.ok) {
              const choicesData = await choicesResponse.json();
              if (choicesData.data && choicesData.data.length > 0) {
                productDetailsObj[product.id].choices = choicesData.data;

                if (choicesData.data[0]?.price) {
                  productDetailsObj[product.id].defaultPrice =
                    choicesData.data[0].price;
                }

                if (choicesData.data[0]?.quantity !== undefined) {
                  productDetailsObj[product.id].defaultStock =
                    choicesData.data[0].quantity;
                }
              }
            }
          } catch (error) {
            console.error(
              `Error fetching choices for product ${product.id}:`,
              error
            );
          }
        })
      );

      setProductData(productDetailsObj);
    } catch (error) {
      console.error("Error fetching category data:", error);
      toast.error("Failed to load category data");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory() {
    try {
      const response = await fetch(`http://localhost:8000/api/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: categoryId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast.success("Category deleted successfully");
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setDeleteDialogOpen(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  const getProductStock = (productId) => {
    const choices = productData[productId]?.choices || [];
    if (choices.length === 0) {
      return 0;
    }

    return choices.reduce((total, choice) => total + (choice.quantity || 0), 0);
  };

  const getProductPrice = (productId) => {
    return productData[productId]?.defaultPrice || 0;
  };

  if (loading) {
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
              <BreadcrumbLink href="/admin/categories">
                Categories
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>Loading...</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Category Details</h1>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
            <Skeleton className="h-5 w-32 mt-6" />
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Category Not Found</h2>
          <p className="text-gray-500 mb-4">
            The category you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
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
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/categories/${categoryId}`}>
              {category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Category Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/categories/edit/${categoryId}`}>
              <PenLine className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Category ID
            </h3>
            <p className="text-base">{category.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Created At
            </h3>
            <p className="text-base">{formatDate(category.created_at)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Last Updated
            </h3>
            <p className="text-base">{formatDate(category.updated_at)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Number of Products
            </h3>
            <Badge
              variant="outline"
              className="bg-blue-50 text-cyan-700 px-2 py-0.5"
            >
              {products.length}
            </Badge>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Description
          </h3>
          <div className="bg-slate-50 p-4 rounded-md">
            <p className="text-sm">
              {category.description || "No description available."}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">
            Products in this Category
          </h3>
          {products.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-md">
              <p className="text-gray-500">No products in this category yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const productStock = getProductStock(product.id);
                    const productPrice = getProductPrice(product.id);

                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.id}
                        </TableCell>
                        <TableCell>
                          {product ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                              <Image
                                src={`http://localhost:8000/api/productImage/${product.id}`}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.target.src = "/assets/not-found.png";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 bg-slate-200 rounded-md flex items-center justify-center text-slate-500 text-xs">
                              No image
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>${formatPrice(productPrice)}</TableCell>
                        <TableCell>{productStock}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              productStock > 0
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }
                          >
                            {productStock > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8 px-2"
                          >
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete the category &quot;{category.name}&quot;.
              This action cannot be undone and will affect {products.length}{" "}
              product{products.length !== 1 ? "s" : ""}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
