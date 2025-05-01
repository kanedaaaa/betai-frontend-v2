"use client";
import SearchBar from "@/components/Search";
import SportSelector from "@/components/SportSelector";
import { ListFilterPlus, X, Ticket, Filter as FilterIcon } from "lucide-react";
import { useState } from "react";
import Filter from "@/components/Filter";
import Game from "@/components/Game";
import { Country, League } from "@/types";

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  return (
    <div>
      {/* Mobile Layout */}
      <div className="xl:hidden">
        <div className="mt-[20px] flex justify-center items-center h-[104px] bg-black border-b border-t border-[#4D4F5C] ">
          <SportSelector />
        </div>
        <div className="flex justify-center items-center h-[54px] bg-black border-b border-[#4D4F5C] gap-3 ">
          <button className="bg-[#02a875] text-white p-2 rounded">
            <Ticket className="w-5 h-5" />
          </button>
          <button className="bg-[#02a875] text-white p-2 rounded">
            <FilterIcon className="w-5 h-5" />
          </button>
          <button
            className="bg-[#02a875] text-white p-2 rounded"
            onClick={() => setIsFilterOpen(true)}
          >
            <ListFilterPlus className="w-5 h-5" />
          </button>
        </div>
        <div>
          <Game leagueId={selectedLeague?.leagueID} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden xl:flex justify-center items-start mt-[90px]">
        <div className="flex gap-[40px] max-w-[1800px] w-full px-4">
          <div className="w-[300px]">
            <Filter
              selectedCountry={selectedCountry}
              selectedLeague={selectedLeague}
              onCountrySelect={setSelectedCountry}
              onLeagueSelect={setSelectedLeague}
            />
          </div>

          <div className="flex-1 flex justify-center">
            <Game leagueId={selectedLeague?.leagueID} />
          </div>

          <div className="w-[300px] h-[600px] bg-black rounded-[12px] border border-white/50">
            {/* Dummy black component */}
          </div>
        </div>
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
            <Filter
              selectedCountry={selectedCountry}
              selectedLeague={selectedLeague}
              onCountrySelect={setSelectedCountry}
              onLeagueSelect={setSelectedLeague}
            />
          </div>
        </div>
      )}
    </div>
  );
}
