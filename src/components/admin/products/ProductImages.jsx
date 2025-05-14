"use client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ProductImages({
  images,
  currentImageIndex,
  imagesLoading,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const currentImage = images[currentImageIndex]?.url;

  // Reset loading states when changing images
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentImageIndex]);

  // Check for invalid image
  useEffect(() => {
    if (!currentImage || images[currentImageIndex]?.error) {
      setImageError(true);
    }
  }, [currentImage, currentImageIndex, images]);

  return (
    <>
      {imagesLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      )}
      {!imagesLoading && images.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          No image available
        </div>
      ) : (
        <>
          {!imagesLoading && !imageLoaded && !imageError && currentImage && (
            <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
          )}

          {imageError && (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mb-2"
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
              <p className="text-gray-600 font-medium">Image not found</p>
            </div>
          )}

          {currentImage && !imageError && (
            <div className="absolute inset-0">
              <Image
                src={currentImage}
                alt={`Product Image ${currentImageIndex + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                priority={currentImageIndex === 0}
                unoptimized
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
