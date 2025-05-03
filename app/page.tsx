"use client";
import SportSelector from "@/components/SportSelector";
import { ListFilterPlus, X, Ticket, Filter as FilterIcon } from "lucide-react";
import { useState } from "react";
import Filter from "@/components/Filter";
import Game from "@/components/Game";
import { Country, League, Game as GameType } from "@/types";
import Analysis from "@/components/Analysis";

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

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
          <Game
            leagueId={selectedLeague?.leagueID}
            selectedGame={selectedGame}
            onGameSelect={setSelectedGame}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden xl:flex justify-center items-start mt-[90px]">
        <div className="flex">
          <div className="w-[300px] mr-[-20px]">
            <Filter
              selectedCountry={selectedCountry}
              selectedLeague={selectedLeague}
              onCountrySelect={setSelectedCountry}
              onLeagueSelect={setSelectedLeague}
            />
          </div>

          <div className="mr-[30px] relative">
            <div className="absolute -top-[0px] left-0 w-full">
              <SportSelector />
            </div>
            <Game
              leagueId={selectedLeague?.leagueID}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
            />
          </div>

          <Analysis game={selectedGame} onClose={() => setSelectedGame(null)} />
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
