"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

export default function ProfileImage({
  imageUrl,
  previewUrl,
  username,
  onImageChange,
  canUpload = false,
  className = "w-9 h-9",
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Add timeout to prevent infinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  const getInitials = () => {
    if (!username) return "U";
    // Split the username by spaces and get the first character of each word
    if (username.includes(" ")) {
      const nameParts = username.split(" ");
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return username.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 group ${className}`}
    >
      {loading && !error && !previewUrl && (
        <Skeleton className={`rounded-full ${className}`} />
      )}

      {previewUrl && (
        <Image
          src={previewUrl}
          alt="preview"
          fill
          className="object-cover"
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      )}

      {!previewUrl && imageUrl && (
        <Image
          src={imageUrl}
          alt={username || "User"}
          fill
          className="object-cover"
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      )}

      {((!imageUrl && !previewUrl) || error) && !loading && (
        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 text-3xl">
          {getInitials()}
        </div>
      )}

      {canUpload && (
        <label
          htmlFor="profile-image-upload"
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
        >
          <span className="text-white bg-blue-600 rounded-full p-2 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
