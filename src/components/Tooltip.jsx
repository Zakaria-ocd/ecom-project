"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Tooltip({ content, title = "", side = "top" }) {
  const [titleVisibility, setTitleVisibility] = useState(false);

  return (
    <div
      className={`relative flex items-center ${
        side === "top" || side === "bottom" ? "flex-col" : "flex-row"
      }`}
    >
      <div
        onMouseEnter={() => setTitleVisibility(true)}
        onMouseLeave={() => setTitleVisibility(false)}
        className="w-fit h-fit"
      >
        {content}
      </div>
      {titleVisibility && (
        <motion.div
          initial={
            (side === "top" && { translateY: 5, opacity: 0 }) ||
            (side === "bottom" && { translateY: -5, opacity: 0 }) ||
            (side === "right" && { translateX: -5, opacity: 0 }) ||
            (side === "left" && { translateX: 5, opacity: 0 })
          }
          animate={{ translateY: 0, translateX: 0, opacity: 100 }}
          transition={{ duration: 0.1, delay: 0.5 }}
          className={`z-50 absolute pointer-events-none flex items-center ${
            (side === "top" && "bottom-full flex-col mb-0.5") ||
            (side === "bottom" && "top-full flex-col-reverse mt-0.5") ||
            (side === "right" && "left-full flex-row-reverse ml-0.5") ||
            (side === "left" && "right-full flex-row mr-0.5")
          }`}
        >
          <div className="px-2 py-1.5 text-nowrap text-sm rounded-md border shadow-md transition-colors bg-black/85 backdrop-blur-sm text-white border-slate-700">
            {title}
          </div>
          <div
            className={`size-2 ${
              (side === "top" && "top-full -mt-1 rotate-45") ||
              (side === "right" && "right-full -mr-1 rotate-[135deg]") ||
              (side === "bottom" && "bottom-full -mb-1 -rotate-[135deg]") ||
              (side === "left" && "left-full -ml-1 -rotate-45")
            } border-b border-r rounded-br-sm transition-colors bg-black/80 dark:border-slate-700`}
          />
        </motion.div>
      )}
    </div>
  );
}
