"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ images, currentImageIndex }) {
  const [loaded, setLoaded] = useState(false);

  const currentImage = images[currentImageIndex];

  return (
    <div className="w-full h-60 relative flex items-center justify-center overflow-hidden rounded-xl bg-gray-100">
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      )}

      {currentImage && (
        <Image
          key={currentImage}
          src={`http://localhost:8000/api/image/${currentImage}`}
          alt={`Product Image ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
          className={`object-contain transition-opacity duration-500 rounded-xl ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          priority
        />
      )}
    </div>
  );
}
