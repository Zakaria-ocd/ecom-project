"use client";
import { Sun } from "lucide-react";

export default function LightModeButton() {
  function enableLightMode() {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
  }

  return (
    <button
      onClick={enableLightMode}
      className="bg-yellow-400 text-white p-2 rounded-md"
    >
      <Sun className="size-4" />
    </button>
  );
}
