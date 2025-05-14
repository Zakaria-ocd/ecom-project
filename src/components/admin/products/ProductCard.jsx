"use client";
import { ArrowLeft, ArrowRight, Edit2, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ProductImages from "./ProductImages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FaStar } from "react-icons/fa6";
import Link from "next/link";

export default function ProductCard({ product, handleDeleteProduct }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [choices, setChoices] = useState([]);
  const [choicesLoading, setChoicesLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(true);

  const canBack =
    images.length <= 0 || currentImageIndex === 0 || imagesLoading;
  const canGoNext =
    images.length <= 0 ||
    currentImageIndex === images.length - 1 ||
    imagesLoading;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const renderChoicesList = () => {
    if (choicesLoading)
      return (
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-32" />
        </div>
      );

    if (!choices || choices.length === 0) {
      return (
        <div className="text-sm text-gray-500 mt-3 p-2 bg-gray-50 rounded-md">
          No variants available for this product
        </div>
      );
    }

    return (
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Variants ({choices.length})
        </h3>
        <div className="max-h-[160px] overflow-y-auto pr-1">
          {choices.map((choice, index) => {
            // Sort attributes by type: colors first, then sizes, then others
            const sortedAttributes = [...choice.typeValuePairs].sort((a, b) => {
              const aType = a.typeName.toLowerCase();
              const bType = b.typeName.toLowerCase();

              if (aType === "color" && bType !== "color") return -1;
              if (aType !== "color" && bType === "color") return 1;
              if (aType === "size" && bType !== "size" && bType !== "color")
                return -1;
              if (aType !== "size" && aType !== "color" && bType === "size")
                return 1;
              return 0;
            });

            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-md mb-2 border border-gray-200 bg-white hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5 items-center mb-2">
                    {sortedAttributes.map((pair, idx) => {
                      // Handle color attribute
                      if (pair.typeName.toLowerCase() === "color") {
                        return (
                          <Badge
                            key={`${pair.typeName}-${idx}`}
                            variant="outline"
                            className="flex items-center gap-1.5 bg-white border-gray-200 text-gray-800 font-normal"
                          >
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: pair.colorCode || "#ccc",
                              }}
                            />
                            <span className="capitalize">{pair.value}</span>
                          </Badge>
                        );
                      }

                      // Handle size attribute
                      if (pair.typeName.toLowerCase() === "size") {
                        return (
                          <Badge
                            key={`${pair.typeName}-${idx}`}
                            variant="outline"
                            className="w-7 h-7 p-0 flex items-center justify-center rounded-full border-slate-300 font-semibold text-slate-700 bg-white hover:bg-slate-50"
                          >
                            {pair.value.toUpperCase()}
                          </Badge>
                        );
                      }

                      // Handle other attributes with a new style
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
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${choice.price}</span>
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
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    async function fetchChoices() {
      setChoicesLoading(true);
      try {
        const choicesRes = await fetch(
          `http://localhost:8000/api/products/${product.id}/choices`
        );
        const choicesData = await choicesRes.json();

        if (!choicesData.data || !Array.isArray(choicesData.data)) {
          setChoices([]);
          setChoicesLoading(false);
          return;
        }

        setChoices(choicesData.data);
      } catch (error) {
        console.error("Error fetching choices data:", error);
        setChoices([]);
      } finally {
        setChoicesLoading(false);
      }
    }
    async function fetchImages() {
      setImagesLoading(true);
      try {
        const imagesRes = await fetch(
          `http://localhost:8000/api/productImages/${product.id}`
        );
        const imageIds = await imagesRes.json();

        const imagePromises = (imageIds || []).map(async (imageId) => {
          try {
            const imageResponse = await fetch(
              `http://localhost:8000/api/image/${imageId}`
            );
            const blob = await imageResponse.blob();
            return {
              id: imageId,
              url: URL.createObjectURL(blob),
            };
          } catch (error) {
            console.error("Error loading image:", error);
            return null;
          }
        });

        const loadedImages = (await Promise.all(imagePromises)).filter(Boolean);
        setImages(loadedImages);
      } catch (error) {
        console.error("Error fetching images data:", error);
        setImages([]);
      } finally {
        setImagesLoading(false);
      }
    }

    fetchChoices();
    fetchImages();
  }, [product.id]);

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [images]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="relative border rounded-2xl shadow-sm p-4 w-[300px] bg-white flex flex-col justify-between gap-2 group">
        <div className="flex flex-col gap-2">
          <div className="w-full h-60 relative flex items-center justify-center overflow-hidden rounded-xl bg-gray-100">
            <ProductImages
              images={images}
              currentImageIndex={currentImageIndex}
              imagesLoading={imagesLoading}
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              disabled={canBack}
              className="bg-white size-5 hover:bg-transparent"
            >
              <ArrowLeft />
            </Button>
            {imagesLoading ? (
              <Skeleton className="w-12 h-4" />
            ) : (
              <>
                {images.length > 0 ? currentImageIndex + 1 : 0} of{" "}
                {images.length}
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              disabled={canGoNext}
              className="bg-white size-5 hover:bg-transparent"
            >
              <ArrowRight />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-semibold text-lg">{product.name}</div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <FaStar className="text-amber-500" />
              {Number(product.rating || 0).toFixed(1)}
            </div>
          </div>

          {renderChoicesList()}
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/admin/products/${product.id}`}>
                <Button
                  variant="outline"
                  size="icon"
                  className="[&_svg]:size-5 w-14 transition-colors bg-white text-emerald-500 hover:text-emerald-700"
                >
                  <Eye />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="[&_svg]:size-5 w-14 transition-colors bg-white text-sky-500 hover:text-sky-700"
              >
                <Edit2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="[&_svg]:size-5 w-14 transition-colors bg-white text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete this product ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
