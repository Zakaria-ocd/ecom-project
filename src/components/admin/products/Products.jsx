"use client";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ChevronRight,
  Eye,
  Grid,
  PenLine,
  Plus,
  Table,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table as UITable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

export function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productChoices, setProductChoices] = useState({});

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });
      const data = await response.json();
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      toast.success(data.message);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/products");
        const data = await response.json();
        const fetchedProducts = data.data;

        setProducts(fetchedProducts);

        const categoryIds = [
          ...new Set(
            fetchedProducts
              .map((product) => product.category_id)
              .filter(Boolean)
          ),
        ];

        const categoryMap = {};

        await Promise.all(
          categoryIds.map(async (id) => {
            const res = await fetch(
              `http://localhost:8000/api/categories/${id}`
            );
            const catData = await res.json();
            categoryMap[id] = catData.data.name;
          })
        );

        setCategories(categoryMap);

        const choicesMap = {};
        await Promise.all(
          fetchedProducts.map(async (product) => {
            try {
              const choicesRes = await fetch(
                `http://localhost:8000/api/products/${product.id}/choices`
              );
              if (!choicesRes.ok) throw new Error("Failed to fetch choices");
              const choicesData = await choicesRes.json();
              choicesMap[product.id] = choicesData.data || [];
            } catch (error) {
              console.error(
                `Error fetching choices for product ${product.id}:`,
                error
              );
              choicesMap[product.id] = [];
            }
          })
        );

        setProductChoices(choicesMap);
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getProductPrice = (productId) => {
    const choices = productChoices[productId] || [];
    if (choices.length === 0) return 0;

    const prices = choices
      .map((choice) => Number(choice.price))
      .filter((price) => !isNaN(price));
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getProductStock = (productId) => {
    const choices = productChoices[productId] || [];
    if (choices.length === 0) return 0;

    return choices.reduce(
      (total, choice) => total + (Number(choice.quantity) || 0),
      0
    );
  };

  const getStockStatus = (stock) => {
    if (stock > 10) {
      return {
        text: `In Stock (${stock})`,
        className: "bg-green-50 text-green-700",
      };
    } else if (stock > 0) {
      return {
        text: `Low Stock (${stock})`,
        className: "bg-amber-50 text-amber-700",
      };
    } else {
      return {
        text: "Out of Stock",
        className: "bg-red-50 text-red-700",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-2 pb-2">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Skeleton className="h-5 w-20" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-5 w-20" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <div className="flex gap-6">
            <div className="animate-pulse w-24 h-10 bg-slate-200 rounded-md"></div>
            <div className="animate-pulse w-32 h-10 bg-slate-200 rounded-md"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow animate-pulse"
            >
              <div className="w-full h-48 bg-slate-200 rounded-md mb-4"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-2 pb-2">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TooltipProvider>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <div className="flex gap-6">
            <div className="flex border rounded-md overflow-hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`${
                      viewMode === "grid"
                        ? "bg-blue-500 hover:bg-cyan-600"
                        : "bg-transparent hover:bg-slate-100"
                    } rounded-none`}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("table")}
                    className={`${
                      viewMode === "table"
                        ? "bg-blue-500 hover:bg-cyan-600"
                        : "bg-transparent hover:bg-slate-100"
                    } rounded-none`}
                  >
                    <Table className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Table View</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button asChild>
              <Link href="/admin/products/create">
                <Plus className="h-4 w-4" />
                Create Product
              </Link>
            </Button>
          </div>
        </div>
      </TooltipProvider>

      {viewMode === "grid" ? (
        <div className="flex flex-wrap justify-between gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleDeleteProduct={() => {
                setProductToDelete(product);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <UITable>
            <TableCaption>List of all products</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-10 text-gray-500"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => {
                  const stock = getProductStock(product.id);
                  const price = getProductPrice(product.id);
                  const stockStatus = getStockStatus(stock);

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.id}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        {product.category_id ? (
                          <Link
                            href={`/admin/categories/${product.category_id}`}
                            className="text-cyan-600 hover:underline"
                          >
                            {categories[product.category_id] || "Loading..."}
                          </Link>
                        ) : (
                          "Uncategorized"
                        )}
                      </TableCell>
                      <TableCell>{formatPrice(price)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={stockStatus.className}
                        >
                          {stockStatus.text}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(product.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="h-8 px-2"
                          >
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="h-8 px-2"
                          >
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <PenLine className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Dialog
                            open={
                              deleteDialogOpen &&
                              productToDelete?.id === product.id
                            }
                            onOpenChange={(isOpen) => {
                              setDeleteDialogOpen(isOpen);
                              if (!isOpen) setProductToDelete(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => {
                                  setProductToDelete(product);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md h-fit rounded-md">
                              <DialogHeader>
                                <DialogTitle>Delete Product</DialogTitle>
                              </DialogHeader>
                              <DialogDescription>
                                Are you sure you want to delete &ldquo;
                                {product.name}&rdquo;? This action cannot be
                                undone.
                              </DialogDescription>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </UITable>
        </div>
      )}

      <Dialog
        open={deleteDialogOpen && productToDelete && viewMode === "grid"}
        onOpenChange={(isOpen) => {
          setDeleteDialogOpen(isOpen);
          if (!isOpen) setProductToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{productToDelete?.name}
            &rdquo;? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                productToDelete && handleDeleteProduct(productToDelete.id)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
