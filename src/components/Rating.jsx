import React from "react";

export default function Rating({ rating, starClass = "" }) {
  const fullStars = Math.floor(rating);
  const partialStarWidth = (rating - fullStars) * 100;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <i
          key={index}
          className={`fa-solid fa-star text-amber-500 ${starClass}`}
        />
      ))}

      {partialStarWidth > 0 && (
        <div className="relative flex place-content-center">
          <i className={`fa-light fa-star text-amber-500 ${starClass}`} />
          <i
            className={`fa-solid fa-star absolute left-0 overflow-x-hidden text-amber-500 ${starClass}`}
            style={{ width: `${partialStarWidth}%` }}
          />
        </div>
      )}

      {[...Array(5 - Math.ceil(rating))].map((_, index) => (
        <i
          key={index}
          className={`fa-light fa-star text-amber-500 ${starClass}`}
        />
      ))}
    </div>
  );
}
