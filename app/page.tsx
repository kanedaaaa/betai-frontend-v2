"use client";
import SearchBar from "@/components/Search";
import SportSelector from "@/components/SportSelector";

export default function Home() {
  return (
    <div>
      <div className="mt-[20px] flex justify-center items-center h-[54px] bg-black border border-[#4D4F5C] ">
        <SearchBar value="" onChange={() => {}} />
      </div>
      <div className="flex justify-center items-center h-[104px] bg-black border border-[#4D4F5C] ">
        <SportSelector />
      </div>
    </div>
  );
}
