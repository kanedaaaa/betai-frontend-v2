"use client";

import { Search } from "lucide-react";
interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Find any game...",
  className = "",
  size = "default",
}: SearchBarProps) => {
  return (
    <div
      className={`text-[13px] flex items-center px-3 py-1 gap-3 bg-[#07070A] border border-[#4D4F5C] rounded-full h-[37px] w-[274px] ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`bg-transparent text-[#434343] font-bold leading-[25px] px-2 outline-none w-full`}
      />
      <button className="cursor-pointer text-[13px] rounded-full bg-emerald-600 text-white h-[24px] w-[96px] px-8 py-3 flex justify-center items-center">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
