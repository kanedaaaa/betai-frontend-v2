import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Game as GameType } from "@/types";

interface OddFilterizerProps {
  onClose: () => void;
  onFilterGames: (games: GameType[]) => void;
  onClear: () => void;
  initialCategory?: "goals" | "corners" | "fouls";
  initialOdd?: number;
}

interface FilteredGame {
  fixture_id: number;
  odd: number;
  home_team: string;
  away_team: string;
  league_name: string;
  league_logo: string;
}

type Category = "goals" | "corners" | "fouls";

export default function OddFilterizer({
  onClose,
  onFilterGames,
  onClear,
  initialCategory = "goals",
  initialOdd = 0.5,
}: OddFilterizerProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>(initialCategory);
  const [selectedOdd, setSelectedOdd] = useState<number>(initialOdd);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedOdd(initialOdd);
  }, [initialCategory, initialOdd]);

  const handleFilter = async () => {
    setIsLoading(true);
    try {
      const oddId =
        selectedCategory === "goals"
          ? "5"
          : selectedCategory === "corners"
          ? "45"
          : "80";
      const oddName = `Over ${selectedOdd.toFixed(1)}`;
      const response = await fetch(
        `https://backend.betaisports.net/filter-odds/?odd_id=${oddId}&odd_name=${encodeURIComponent(
          oddName
        )}&min_odd=${selectedOdd}`
      );
      const data = await response.json();

      // Fetch fixture details for each game
      const fixturePromises = data.map(async (game: FilteredGame) => {
        const fixtureResponse = await fetch(
          `https://backend.betaisports.net/fixture/${game.fixture_id}/`
        );
        const fixtureData = await fixtureResponse.json();

        return {
          ...fixtureData,
          league_name: String(fixtureData.league),
          league_logo: fixtureData.league_logo,
          odds: {
            [selectedCategory]: {
              label: `Over ${selectedOdd.toFixed(1)}`,
              value: game.odd,
            },
          },
        } as GameType;
      });

      const games = await Promise.all(fixturePromises);
      onFilterGames(games);
      onClose();
    } catch (error) {
      console.error("Error filtering odds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOddSteps = () => {
    return [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5];
  };

  return (
    <div className="bg-[#07070A] border border-[#4D4F5C] rounded-lg p-6 w-[90vw] max-w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-bold">Odd Filterizer</h2>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory("goals")}
            className={`flex-1 py-2 px-4 rounded ${
              selectedCategory === "goals"
                ? "bg-[#02a875] text-white"
                : "bg-[#1A1A1A] text-gray-400 hover:text-white"
            }`}
          >
            Goals
          </button>
          <button
            onClick={() => setSelectedCategory("corners")}
            className={`flex-1 py-2 px-4 rounded ${
              selectedCategory === "corners"
                ? "bg-[#02a875] text-white"
                : "bg-[#1A1A1A] text-gray-400 hover:text-white"
            }`}
          >
            Corners
          </button>
          <button
            onClick={() => setSelectedCategory("fouls")}
            className={`flex-1 py-2 px-4 rounded ${
              selectedCategory === "fouls"
                ? "bg-[#02a875] text-white"
                : "bg-[#1A1A1A] text-gray-400 hover:text-white"
            }`}
          >
            Fouls
          </button>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm">
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}{" "}
              Over {selectedOdd.toFixed(1)}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {getOddSteps().map((odd) => (
              <button
                key={odd}
                onClick={() => setSelectedOdd(odd)}
                className={`px-3 py-1 rounded ${
                  selectedOdd === odd
                    ? "bg-[#02a875] text-white"
                    : "bg-[#1A1A1A] text-gray-400 hover:text-white"
                }`}
              >
                {odd.toFixed(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="flex-1 bg-[#1A1A1A] text-white py-2 rounded hover:bg-[#2A2A2A] transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleFilter}
            disabled={isLoading}
            className="flex-1 bg-[#02a875] text-white py-2 rounded hover:bg-[#029a6a] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Filtering..." : "Filter Odds"}
          </button>
        </div>
      </div>
    </div>
  );
}
