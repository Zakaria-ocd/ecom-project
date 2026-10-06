import React from "react";
import { Star } from "lucide-react";

export default function Rating({ rating, size = 14 }) {
  const numericRating = Number(rating);
  const normalizedRating = Number.isFinite(numericRating)
    ? Math.min(5, Math.max(0, numericRating))
    : 0;

  return (
    <div
      className="flex items-center"
      role="img"
      aria-label={`Rating: ${normalizedRating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, normalizedRating - index));
        const starKey = `star-${index}`;

        return (
          <span key={starKey} className="relative inline-flex shrink-0">
            <Star
              size={size}
              aria-hidden="true"
              className="text-amber-500"
            />
            {fill > 0 && (
              <Star
                size={size}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 fill-amber-500 text-amber-500"
                style={{
                  clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)`,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
