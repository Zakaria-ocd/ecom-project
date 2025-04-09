"use client";
import { Monitor } from "lucide-react";

export default function SystemModeButton() {
  function enableSystemMode() {
    localStorage.removeItem("theme");
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  }

  return (
    <button
      onClick={enableSystemMode}
      className="bg-gray-500 text-white p-2 rounded-md"
    >
      <Monitor className="size-4" />
    </button>
  );
}
