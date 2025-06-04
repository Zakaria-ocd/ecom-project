"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  text = "Loading...",
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className="animate-spin h-8 w-8 text-blue-500 dark:text-blue-400" />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}
