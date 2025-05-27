"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import {
  ArrowLeft,
  PlusCircle,
  X,
  Upload,
  ImagePlus,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductChoices from "@/components/admin/products/create/ProductChoices";

export default function EditProductPage() {
  const { id: productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [choices, setChoices] = useState([]);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
  });

  const [fetchingChoices, setFetchingChoices] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      setProduct(data.data);
      setFormData({
        name: data.data.name || "",
        description: data.data.description || "",
        category_id: data.data.category_id?.toString() || "",
      });

      // Fetch product choices and images
      fetchChoices();
      fetchImages();
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  }

  async function fetchChoices() {
    setFetchingChoices(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}/choices`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product choices");
      }

      const data = await response.json();
      setChoices(data.data || []);
    } catch (error) {
      console.error("Error fetching product choices:", error);
      toast.error("Failed to load product choices");
    } finally {
      setFetchingChoices(false);
    }
  }

  async function fetchImages() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/productImages/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product images");
      }

      const imageIds = await response.json();
      const loadedImages = imageIds.map((id) => ({
        id,
        url: `http://localhost:8000/api/image/${id}`,
      }));

      setImages(loadedImages);
    } catch (error) {
      console.error("Error fetching product images:", error);
      toast.error("Failed to load product images");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Filter for only image files
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        toast.error("Please drop only image files");
        return;
      }

      // Check file sizes
      const validFiles = imageFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setNewImages((prevImages) => [...prevImages, ...validFiles]);

        // Generate preview URLs
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviews]);
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check file sizes
      const validFiles = files.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      setNewImages((prevImages) => [...prevImages, ...validFiles]);

      // Generate preview URLs
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviews]);
    }
  };

  const removeNewImage = (index) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));

    // Revoke the URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const toggleDeleteImage = (imageId) => {
    setImagesToDelete((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleChoicesUpdate = (updatedChoices) => {
    setChoices(updatedChoices);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      // Update product details
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Handle product choices update
      if (choices.length > 0) {
        try {
          // First, delete existing choices
          const existingChoicesResponse = await fetch(
            `http://localhost:8000/api/products/${productId}/choices`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (existingChoicesResponse.ok) {
            const existingChoicesData = await existingChoicesResponse.json();
            const existingChoices = existingChoicesData.data || [];

            // Delete each existing choice
            for (const choice of existingChoices) {
              try {
                const deleteResponse = await fetch(
                  `http://localhost:8000/api/products/${productId}/choices/${choice.id}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );

                if (!deleteResponse.ok) {
                  console.warn(`Failed to delete choice ${choice.id}`);
                }
              } catch (deleteError) {
                console.error(
                  `Error deleting choice ${choice.id}:`,
                  deleteError
                );
              }
            }
          }

          // Then create new choices
          for (const choice of choices) {
            if (choice.typeValuePairs.length > 0) {
              try {
                const createResponse = await fetch(
                  `http://localhost:8000/api/products/${productId}/choices`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      typeValuePairs: choice.typeValuePairs,
                      price: choice.price,
                      quantity: choice.quantity,
                    }),
                  }
                );

                if (!createResponse.ok) {
                  const errorData = await createResponse.json();
                  console.error("Failed to create choice:", errorData);
                }
              } catch (createError) {
                console.error("Error creating choice:", createError);
              }
            }
          }
        } catch (choicesError) {
          console.error("Error updating product choices:", choicesError);
          toast.error("Failed to update product choices");
        }
      }

      // Handle new images upload if needed
      if (newImages.length > 0) {
        await uploadNewImages();
      }

      // Handle image deletion if needed
      if (imagesToDelete.length > 0) {
        await deleteImages();
      }

      toast.success("Product updated successfully");
      router.push(`/admin/products/${productId}`);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  async function uploadNewImages() {
    const formDataImages = new FormData();
    formDataImages.append("product_id", productId);

    newImages.forEach((image) => {
      formDataImages.append("images[]", image);
    });

    const imageResponse = await fetch(
      `http://localhost:8000/api/uploadImages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataImages,
      }
    );

    if (!imageResponse.ok) {
      const errorData = await imageResponse.json();
      throw new Error(errorData.message || "Failed to upload images");
    }

    // Clean up preview URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }

  async function deleteImages() {
    // This is a placeholder - the API doesn't appear to have an endpoint for deleting images
    // You would need to implement this endpoint on the backend
    toast.warning("Image deletion is not implemented in the API");
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Skeleton className="h-8 w-1/3 mb-8" />

          <Tabs defaultValue="basic">
            <TabsList className="mb-6">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32 ml-2" />
              <Skeleton className="h-10 w-32 ml-2" />
            </TabsList>

            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-28 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Product Not Found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Product Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The product you are trying to edit does not exist or has been
            deleted.
          </p>
          <Button asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Products
            </Link>
          </Button>
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/products/${productId}`}>
              {`Product ${product.id}`}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-semibold">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <Tabs defaultValue="basic">
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Images</h3>

                {images.length === 0 ? (
                  <p className="text-slate-500">
                    No images have been uploaded for this product.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className={`relative rounded-lg overflow-hidden border ${
                          imagesToDelete.includes(image.id)
                            ? "border-red-400 opacity-50"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={image.url}
                            alt="Product image"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleDeleteImage(image.id)}
                          className={`absolute top-2 right-2 p-1 rounded-full ${
                            imagesToDelete.includes(image.id)
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-white/80 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {imagesToDelete.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-md border border-red-200 mt-4">
                    <p className="text-red-600 text-sm">
                      {imagesToDelete.length} image(s) marked for deletion.
                      Changes will take effect when you save.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h3 className="text-lg font-medium">Add New Images</h3>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isDragging
                      ? "bg-blue-50 border-blue-300"
                      : "border-slate-300 bg-slate-50 hover:border-blue-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleImageClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="sr-only"
                  />

                  <div className="flex flex-col items-center justify-center cursor-pointer">
                    <ImagePlus className="h-10 w-10 text-slate-400 mb-3" />
                    <p className="text-sm font-medium text-slate-700">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Up to 5MB per image • JPG, PNG, WEBP
                    </p>
                  </div>
                </div>

                {previewUrls.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">
                      New Images Preview:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative rounded-lg overflow-hidden border border-slate-200"
                        >
                          <div className="aspect-square relative">
                            <Image
                              src={url}
                              alt={`New image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 text-slate-600 hover:bg-slate-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <div>
                {fetchingChoices ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
                    <p className="text-slate-500">Loading product Choices...</p>
                  </div>
                ) : (
                  <ProductChoices
                    onChoicesUpdate={handleChoicesUpdate}
                    initialChoices={choices}
                  />
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
