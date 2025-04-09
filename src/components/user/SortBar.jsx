"use client";
import {
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import DropdownMenu from "./DropdownMenu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SortBar({ sortList }) {
  const [selectedSort, setSelectedSort] = useState({
    id: 1,
    name: "most popular",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  function handleSortChange(newSortId) {
    const newSort = sortList.find((item) => item.id === newSortId);
    if (newSort) {
      setSelectedSort(newSort);
    }
  }

  return (
    <div className="w-full min-h-10 flex justify-between items-stretch gap-2 text-sm font-medium px-3 py-1 border-y transition-colors bg-slate-50 dark:bg-gray-900 dark:border-slate-700">
      <DropdownMenu onOpenChange={(open) => setIsDropdownOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="text-slate-900 font-semibold gap-1 px-3 transition-colors dark:text-white"
          >
            Sort by:
            <span className="text-slate-800 font-medium capitalize transition-colors dark:text-slate-300">
              {selectedSort.name}
            </span>
            <ChevronDown
              className={`ml-2 transition-transform ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={selectedSort.id}
            onValueChange={handleSortChange}
          >
            {sortList.map((item) => (
              <DropdownMenuRadioItem
                key={item.id}
                value={item.id}
                className="pl-6 capitalize cursor-pointer"
              >
                {item.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
