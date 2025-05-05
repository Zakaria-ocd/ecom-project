"use client";
import { ArrowLeft, ArrowRight, Edit2, Eye, Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import ProductImages from "./ProductImages";
import { Button } from "@/components/ui/button";
import { FaCartPlus } from "react-icons/fa6";
import { IoMdMore } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Rating from "@/components/Rating";
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

export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  const canBack = currentImageIndex === 0;
  const canGoNext = currentImageIndex === images.length - 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    async function fetchImages() {
      const response = await fetch(
        `http://localhost:8000/api/productImages/${product.id}`
      );
      const data = await response.json();
      setImages(data);
    }
    fetchImages();
  }, [product.id]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="relative border rounded-2xl shadow-sm p-4 w-[300px] bg-white flex flex-col justify-between gap-2 group">
        <ProductImages images={images} currentImageIndex={currentImageIndex} />

        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                disabled={canBack}
                className="bg-white size-5 hover:bg-transparent"
              >
                <ArrowLeft />
              </Button>
              {currentImageIndex + 1} of {images.length}
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                disabled={canGoNext}
                className="bg-white size-5 hover:bg-transparent"
              >
                <ArrowRight />
              </Button>
            </>
          )}
        </div>

        <div className="font-semibold text-lg">{product.name}</div>

        {/* <div className="text-black/40 text-sm font-normal">
          {product.created_at.split(" ")[0].replace(/-/g, " ")}
        </div> */}

        <div className="text-xl font-bold text-slate-700">${product.price}</div>

        <div className="flex items-center justify-center gap-6 mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="[&_svg]:size-5 w-14 transition-colors bg-white text-emerald-500 hover:text-emerald-700"
              >
                <Eye />
              </Button>
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
                    <AlertDialogTitle>
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete this product ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-rose-500 hover:bg-rose-600">
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
