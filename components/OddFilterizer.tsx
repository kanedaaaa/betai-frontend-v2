import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  odd_value: number;
  home_team: string;
  away_team: string;
  league_name: string;
  league_logo: string;
}

type Category = "goals" | "corners" | "fouls";

// Simple desktop version that shows 3 buttons and a horizontal slider when a category is selected
export function OddFilterizerDesktop({
  onFilterGames,
}: {
  onFilterGames?: (games: GameType[]) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedOdd, setSelectedOdd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getOddSteps = () => {
    return [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5];
  };

  const toggleCategory = (category: Category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedOdd(null); // Reset selected odd when changing category
    } else {
      setSelectedCategory(category);
      setSelectedOdd(null); // Reset selected odd when changing category
    }
  };

  const handleSelectOdd = async (odd: number) => {
    if (!selectedCategory) return;

    setSelectedOdd(odd);

    console.log(`Selected category: ${selectedCategory}, odd: ${odd}`);

    try {
      // Determine the odd ID based on category
      const oddId =
        selectedCategory === "goals"
          ? "5"
          : selectedCategory === "corners"
          ? "45"
          : "80";

      const oddName = `Over ${odd.toFixed(1)}`;

      console.log(`Fetching odds with ID: ${oddId}, name: ${oddName}`);

      // Fetch filtered odds
      const response = await fetch(
        `https://backend.betaisports.net/filter-odds/?odd_id=${oddId}&odd_name=${encodeURIComponent(
          oddName
        )}&min_odd=${odd}`
      );
      const data = await response.json();

      console.log(`Filtered odds API response:`, data);

      // Fetch fixture details for each game
      const fixturePromises = data.map(async (game: FilteredGame) => {
        const fixtureResponse = await fetch(
          `https://backend.betaisports.net/fixture/${game.fixture_id}/`
        );
        const fixtureData = await fixtureResponse.json();

        console.log(`Fixture data for ${game.fixture_id}:`, fixtureData);

        // Create a game with ticket_info to match the TicketCreator format
        return {
          fixture_id: game.fixture_id,
          home_team: fixtureData.home_team,
          home_team_logo: fixtureData.home_team_logo,
          away_team: fixtureData.away_team,
          away_team_logo: fixtureData.away_team_logo,
          date: fixtureData.date,
          league_name: String(fixtureData.league),
          league_logo: fixtureData.league_logo,
          odds: {
            [selectedCategory]: {
              label: oddName,
              value: game.odd_value,
            },
          },
          ticket_info: {
            field: selectedCategory,
            label: oddName,
            odd: game.odd_value,
          },
        } as GameType;
      });

      const games = await Promise.all(fixturePromises);
      console.log(`Final games array with ${games.length} games:`, games);

      // Call the parent's callback to show the games
      if (onFilterGames) {
        console.log("Calling onFilterGames with games");

        if (games.length === 0) {
          // If no games were found, show a toast or alert
          alert(
            "No games found matching your criteria. Try different filters."
          );
          // Don't reset selection so user can try different values
          return;
        }

        onFilterGames(games);
        // Reset selection after successful filtering
        if (selectedCategory) {
          // This will reset the selection properly
          toggleCategory(selectedCategory);
        }
      } else {
        console.error("onFilterGames callback is not defined");
      }
    } catch (error) {
      console.error("Error filtering odds:", error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex justify-center items-center h-[80%] w-full px-4">
      <div className="bg-black/5 border border-white/50 backdrop-blur-sm rounded-[12px] w-full h-[100px] flex justify-center items-center p-4">
        <div className="w-full">
          {!selectedCategory ? (
            // No category selected - show 3 buttons
            <div className="flex gap-2 justify-between">
              <button
                onClick={() => toggleCategory("goals")}
                className="flex-1 py-2 px-4 rounded bg-[#1A1A1A] text-gray-400 hover:text-white"
              >
                Goals
              </button>
              <button
                onClick={() => toggleCategory("corners")}
                className="flex-1 py-2 px-4 rounded bg-[#1A1A1A] text-gray-400 hover:text-white"
              >
                Corners
              </button>
              <button
                onClick={() => toggleCategory("fouls")}
                className="flex-1 py-2 px-4 rounded bg-[#1A1A1A] text-gray-400 hover:text-white"
              >
                Fouls
              </button>
            </div>
          ) : (
            // Category selected - show selected button and horizontal slider of X values on same line
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleCategory(selectedCategory)}
                className="bg-[#02a875] text-white py-1 px-3 rounded hover:bg-[#027d58] whitespace-nowrap"
              >
                {selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}
              </button>
              <div
                className="flex-1 overflow-x-auto cursor-grab"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="flex gap-2 pb-1 min-w-max">
                  {getOddSteps().map((odd) => (
                    <button
                      key={odd}
                      onClick={() => handleSelectOdd(odd)}
                      className={`px-2 py-1 min-w-[30px] text-center rounded ${
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedOdd(initialOdd);
  }, [initialCategory, initialOdd]);

  const handleFilter = async () => {
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

        // Create a game with ticket_info to match the TicketCreator format
        return {
          fixture_id: game.fixture_id,
          home_team: fixtureData.home_team,
          home_team_logo: fixtureData.home_team_logo,
          away_team: fixtureData.away_team,
          away_team_logo: fixtureData.away_team_logo,
          date: fixtureData.date,
          league_name: String(fixtureData.league),
          league_logo: fixtureData.league_logo,
          odds: {
            [selectedCategory]: {
              label: oddName,
              value: game.odd_value,
            },
          },
          ticket_info: {
            field: selectedCategory,
            label: oddName,
            odd: game.odd_value,
          },
        } as GameType;
      });

      const games = await Promise.all(fixturePromises);
      console.log(`Final games array with ${games.length} games:`, games);

      // Call the parent's callback to show the games
      if (onFilterGames) {
        console.log("Calling onFilterGames with games");

        if (games.length === 0) {
          // If no games were found, show a toast or alert
          alert(
            "No games found matching your criteria. Try different filters."
          );
          // Don't reset selection so user can try different values
          return;
        }

        onFilterGames(games);
        onClose();
      } else {
        console.error("onFilterGames callback is not defined");
      }
    } catch (error) {
      console.error("Error filtering odds:", error);
    }
  };

  const getOddSteps = () => {
    return [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5];
  };

  return (
    <div className="bg-[#07070A] border border-[#4D4F5C] rounded-lg p-6 w-[90vw] max-w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-bold">Odd Filterizer</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <X size={20} />
        </button>
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

        <button
          onClick={handleFilter}
          className="w-full bg-[#02a875] text-white py-2 rounded hover:bg-[#029a6a] transition-colors"
        >
          Filter Odds
        </button>
      </div>
    </div>
  );
}
