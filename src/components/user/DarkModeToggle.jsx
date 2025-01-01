"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleDarkMode() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  }

  return (
    <button
      className="relative bg-white flex items-center place-content-center rounded-full border border-slate-300 transition-colors dark:bg-slate-100"
      onClick={toggleDarkMode}
    >
      <i className="fa-regular fa-sun-bright text-white z-10 size-7 ml-px text-sm transition-colors before:size-full before:flex before:justify-center before:items-center dark:text-slate-800"></i>
      <i className="fa-solid fa-moon text-slate-700 z-10 size-7 ml-px text-sm transition-colors before:size-full before:flex before:justify-center before:items-center dark:text-white"></i>
      <div
        className={`absolute inset-0 z-0 flex ${
          darkMode ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{
            type: "keyframes",
            duration: 0.2,
          }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r transition-colors from-sky-400 to-blue-500 dark:from-indigo-400 dark:to-indigo-600"
        />
      </div>
    </button>
  );
}
