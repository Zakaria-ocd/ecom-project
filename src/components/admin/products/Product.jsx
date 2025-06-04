"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Ellipsis, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Rating from "@/components/Rating";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProfileImage from "@/components/user/ProfileImage";

export default function Product() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    rating: 0,
    category_id: 2,
    seller_id: 2,
    created_at: "",
    updated_at: "",
  });
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productLoading, setProductLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [currentImageLoading, setCurrentImageLoading] = useState(false);
  const [choices, setChoices] = useState([]);
  const [choicesLoading, setChoicesLoading] = useState(true);
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const nextImage = () => {
    setCurrentImageLoading(true);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageLoading(true);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const selectImage = (index) => {
    if (index !== currentImageIndex) {
      setCurrentImageLoading(true);
      setCurrentImageIndex(index);
    }
  };

  const handleThumbnailError = (imageId) => {
    setThumbnailErrors((prev) => ({
      ...prev,
      [imageId]: true,
    }));
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100";
      case "seller":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
      case "buyer":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100";
    }
  };

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      setProductLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${productId}`
        );
        const data = await response.json();
        setProduct(data.data);

        if (data.data && data.data.seller_id) {
          fetchUser(data.data.seller_id);
        }

        if (data.data && data.data.category_id) {
          fetchCategory(data.data.category_id);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setProductLoading(false);
      }
    }

    async function fetchUser(sellerId) {
      setUserLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/users/${sellerId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const userData = await response.json();

        setUser({
          id: sellerId,
          username: userData.username || "",
          email: userData.email || "",
          role: userData.role || "Seller",
          createdAt: userData.created_at || "",
          image: `http://localhost:8000/api/users/image/${sellerId}`,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({
          id: sellerId,
          role: "Seller",
          image: null,
        });
      } finally {
        setUserLoading(false);
      }
    }

    async function fetchCategory(categoryId) {
      setCategoryLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/categories/${categoryId}`
        );

        if (response.ok) {
          const categoryData = await response.json();
          setCategory(categoryData.data);
        } else {
          setCategory({ id: categoryId, name: `Category #${categoryId}` });
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        setCategory({ id: categoryId, name: `Category #${categoryId}` });
      } finally {
        setCategoryLoading(false);
      }
    }

    async function fetchChoices() {
      setChoicesLoading(true);
      try {
        const choicesRes = await fetch(
          `http://localhost:8000/api/products/${productId}/choices`
        );
        const choicesData = await choicesRes.json();
        setChoices(choicesData.data);
      } catch (error) {
        console.error("Error fetching choices data:", error);
      } finally {
        setChoicesLoading(false);
      }
    }

    async function fetchImages() {
      setImagesLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/productImages/${productId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch product images: ${response.status}`);
        }

        const imageIds = await response.json();

        if (!imageIds || imageIds.length === 0) {
          setImages([]);
          setImagesLoading(false);
          return;
        }

        const loadedImages = imageIds.map((imageId) => ({
          id: imageId,
          url: `http://localhost:8000/api/image/${imageId}`,
          error: false,
        }));

        setImages(loadedImages);
        setCurrentImageIndex(0);
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      } finally {
        setImagesLoading(false);
      }
    }

    fetchProduct();
    fetchChoices();
    fetchImages();
  }, [productId]);

  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 py-3 bg-white">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/categories">
                {category ? category.name : "Category"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {productLoading ? "Loading..." : "Product " + product.id}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <section className="h-full flex items-center py-8 bg-white antialiased">
        <div className="w-full mx-auto px-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="relative">
              {imagesLoading ? (
                <Skeleton className="w-full h-[500px] rounded-lg" />
              ) : images.length === 0 ? (
                <div className="w-full h-[500px] flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
                  No images available
                </div>
              ) : (
                <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                  <div className="relative w-full h-full">
                    {currentImageLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                        <Skeleton className="w-full h-full rounded-lg" />
                      </div>
                    )}
                    {images[currentImageIndex] && (
                      <Image
                        src={images[currentImageIndex].url}
                        alt={`Product image ${currentImageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain"
                        onError={() =>
                          handleThumbnailError(images[currentImageIndex].id)
                        }
                        onLoad={() => setCurrentImageLoading(false)}
                        unoptimized
                      />
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                      <Button
                        onClick={prevImage}
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white/80 hover:bg-white shadow-md"
                        disabled={images.length <= 1}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={nextImage}
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white/80 hover:bg-white shadow-md"
                        disabled={images.length <= 1}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                      {images.map((_, index) => (
                        <button
                          key={`indicator-${index}`}
                          onClick={() => selectImage(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            currentImageIndex === index
                              ? "bg-blue-500"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!imagesLoading && images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto px-1 py-2 scrollbar-hide">
                  {images.map((image, index) => (
                    <button
                      key={`thumb-${image.id}`}
                      onClick={() => selectImage(index)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-blue-500 scale-105"
                          : "border-transparent"
                      }`}
                    >
                      {image.error || thumbnailErrors[image.id] ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={image.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-contain rounded-xl"
                          onError={() => handleThumbnailError(image.id)}
                          unoptimized
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  User Information
                </h2>

                {userLoading ? (
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                ) : user ? (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <ProfileImage
                          imageUrl={`http://localhost:8000/api/users/imageById/${user.id}`}
                          username={user.username}
                          previewUrl={null}
                          onImageChange={() => {}}
                          className="w-16 h-16"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mt-1 space-y-1 text-sm">
                          <Badge
                            variant="outline"
                            className={`${getRoleColor(user.role)} mb-1`}
                          >
                            {user.role}
                          </Badge>
                          {user.username && (
                            <div className="text-slate-600">
                              <span className="font-medium text-slate-700">
                                Username:
                              </span>{" "}
                              {user.username}
                            </div>
                          )}
                          {user.email && (
                            <div className="text-slate-600">
                              <span className="font-medium text-slate-700">
                                Email:
                              </span>{" "}
                              {user.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              <Button
                                variant="outline"
                                className="[&_svg]:text-slate-500 [&_svg]:hover:text-slate-700 px-2.5 py-2"
                              >
                                <Eye />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View User</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-slate-500">
                    No user information available
                  </div>
                )}
              </div>
            </div>

            <div className="mt-0">
              {productLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-40 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h1>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Rating rating={product.rating} />
                      <p className="text-sm font-medium leading-none text-slate-500">
                        ({Number(product.rating || 0).toFixed(1)})
                      </p>
                    </div>
                  </div>

                  {choicesLoading ? (
                    <div className="space-y-3 mt-6">
                      <Skeleton className="h-6 w-24" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Variants ({choices.length})
                        </h3>
                        <div className="max-h-[400px] overflow-y-auto border rounded-md">
                          {choices
                            .sort((a, b) => {
                              const aColor =
                                a.typeValuePairs.find(
                                  (p) => p.typeName.toLowerCase() === "color"
                                )?.value || "";
                              const bColor =
                                b.typeValuePairs.find(
                                  (p) => p.typeName.toLowerCase() === "color"
                                )?.value || "";

                              if (aColor !== bColor)
                                return aColor.localeCompare(bColor);

                              const aSize =
                                a.typeValuePairs.find(
                                  (p) => p.typeName.toLowerCase() === "size"
                                )?.value || "";
                              const bSize =
                                b.typeValuePairs.find(
                                  (p) => p.typeName.toLowerCase() === "size"
                                )?.value || "";

                              if (aSize !== bSize)
                                return aSize.localeCompare(bSize);

                              return 0;
                            })
                            .map((choice, index) => {
                              const sortedAttributes = [
                                ...choice.typeValuePairs,
                              ].sort((a, b) => {
                                const aType = a.typeName.toLowerCase();
                                const bType = b.typeName.toLowerCase();

                                if (aType === "color" && bType !== "color")
                                  return -1;
                                if (aType !== "color" && bType === "color")
                                  return 1;
                                if (
                                  aType === "size" &&
                                  bType !== "size" &&
                                  bType !== "color"
                                )
                                  return -1;
                                if (
                                  aType !== "size" &&
                                  aType !== "color" &&
                                  bType === "size"
                                )
                                  return 1;
                                return 0;
                              });

                              return (
                                <div
                                  key={index}
                                  className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer relative"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex flex-wrap gap-2 items-center">
                                        {sortedAttributes.map((pair, idx) => {
                                          if (
                                            pair.typeName.toLowerCase() ===
                                            "color"
                                          ) {
                                            return (
                                              <Badge
                                                key={`${pair.typeName}-${idx}`}
                                                variant="outline"
                                                className="flex items-center gap-1.5 bg-white border-gray-200 text-gray-800 font-normal"
                                              >
                                                <span
                                                  className="w-3 h-3 rounded-full inline-block"
                                                  style={{
                                                    backgroundColor:
                                                      pair.colorCode || "#ccc",
                                                    border:
                                                      "1px solid rgba(0,0,0,0.1)",
                                                  }}
                                                ></span>
                                                <span className="capitalize">
                                                  {pair.value}
                                                </span>
                                              </Badge>
                                            );
                                          }

                                          if (
                                            pair.typeName.toLowerCase() ===
                                            "size"
                                          ) {
                                            return (
                                              <Badge
                                                key={`${pair.typeName}-${idx}`}
                                                variant="outline"
                                                className="w-8 h-8 p-0 flex items-center justify-center rounded-full border-slate-300 font-semibold text-slate-700 bg-white hover:bg-slate-50"
                                              >
                                                {pair.value.toUpperCase()}
                                              </Badge>
                                            );
                                          }

                                          return (
                                            <Badge
                                              key={`${pair.typeName}-${idx}`}
                                              variant="outline"
                                              className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                            >
                                              <span className="capitalize font-medium mr-1 text-slate-500">
                                                {pair.typeName}:
                                              </span>
                                              {pair.value}
                                            </Badge>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-slate-900 text-lg">
                                        ${choice.price}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <Badge
                                      variant={
                                        choice.quantity > 10
                                          ? "success"
                                          : choice.quantity > 0
                                          ? "warning"
                                          : "destructive"
                                      }
                                      className={
                                        choice.quantity > 10
                                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                          : choice.quantity > 0
                                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                          : "bg-rose-100 text-rose-800 hover:bg-rose-100"
                                      }
                                    >
                                      {choice.quantity > 10
                                        ? `In Stock (${choice.quantity})`
                                        : choice.quantity > 0
                                        ? `Low Stock (${choice.quantity})`
                                        : "Out of Stock"}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  )}

                  <hr className="my-6 md:my-8 border-slate-200" />

                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-semibold text-slate-900 mb-2">
                      Description:
                    </h2>
                    <p className="text-slate-500">
                      {product.description ||
                        "No description available for this product."}
                    </p>
                  </div>

                  <hr className="my-6 md:my-8 border-slate-200" />

                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="text-slate-500 font-medium">Category</div>
                    <div className="text-slate-800">
                      {categoryLoading ? (
                        <Skeleton className="h-4 w-24" />
                      ) : category ? (
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            <span className="flex items-center gap-1.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3 h-3"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M7 12h10"></path>
                                <path d="M10 18h4"></path>
                              </svg>
                              {category.name}
                            </span>
                          </Badge>
                        </div>
                      ) : (
                        product.category_id
                      )}
                    </div>

                    <div className="text-slate-500 font-medium">SKU</div>
                    <div className="text-slate-800">
                      {choices.length > 0
                        ? `${choices.length} variants`
                        : "N/A"}
                    </div>

                    <div className="text-slate-500 font-medium">Available</div>
                    <div className="text-slate-800">
                      {choices.reduce(
                        (total, choice) => total + (choice.quantity || 0),
                        0
                      )}{" "}
                      units
                    </div>

                    <div className="text-slate-500 font-medium">Created On</div>
                    <div className="text-slate-800">
                      {formattedDate(product.created_at)}
                    </div>

                    {product.updated_at && (
                      <>
                        <div className="text-slate-500 font-medium">
                          Last Updated
                        </div>
                        <div className="text-slate-800">
                          {formattedDate(product.updated_at)}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Link
                      href={`/admin/products/edit/${productId}`}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg text-sm flex-1 text-center"
                    >
                      Edit Product
                    </Link>
                    <Link
                      href="/admin/products"
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-sm flex-1 text-center"
                    >
                      Back to List
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
