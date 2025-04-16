"use client";
import SearchBar from "@/components/Search";
import SportSelector from "@/components/SportSelector";
import { ListFilterPlus, X } from "lucide-react";
import { useState } from "react";
import Filter from "@/components/Filter";

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div>
      <div className="mt-[20px] flex justify-center items-center h-[104px] bg-black border-b border-t border-[#4D4F5C] ">
        <SportSelector />
      </div>
      <div className="flex justify-center items-center h-[54px] bg-black border-b border-[#4D4F5C] gap-3 ">
        <SearchBar value="" onChange={() => {}} />
        <ListFilterPlus
          className="w-[16px] h-[16px] text-white cursor-pointer"
          onClick={() => setIsFilterOpen(true)}
        />
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute -top-4 -right-4 bg-black rounded-full p-1 border border-[#4D4F5C] hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <Filter />
          </div>
        </div>
      )}
    </div>
  );
}
