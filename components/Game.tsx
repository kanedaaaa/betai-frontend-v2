import { useState, useEffect } from "react";
import { Game as GameType } from "@/types";
import { LazyImage } from "@/components/LazyImage";
import UtilityWindow from "./UtilityWindow";
import DateSelector from "./DateSelector";

interface GameProps {
  leagueId?: number;
  selectedGame: GameType | null;
  onGameSelect: (game: GameType | null) => void;
  games?: GameType[];
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
}

const Game = ({
  leagueId,
  selectedGame,
  onGameSelect,
  games: providedGames,
  selectedDate,
  onDateSelect,
}: GameProps) => {
  const [games, setGames] = useState<GameType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      if (!leagueId && !selectedDate) {
        setGames([]);
        return;
      }

      setIsLoading(true);
      try {
        let response;
        if (leagueId) {
          response = await fetch(
            `https://backend.betaisports.net/games/${leagueId}`
          );
        } else if (selectedDate) {
          const formattedDate = selectedDate.toISOString().split("T")[0];
          response = await fetch(
            `https://backend.betaisports.net/top_leagues_games_by_date/${formattedDate}`
          );
        }

        if (response) {
          const data = await response.json();
          setGames(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!providedGames) {
      fetchGames();
    }
  }, [leagueId, selectedDate, providedGames]);

  const displayGames = providedGames || games;

  if (!leagueId && !selectedDate && !providedGames) {
    return (
      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[1000px] bg-black/30 backdrop-blur-xl rounded-[12px] border border-white/50 flex flex-col">
          {onDateSelect && (
            <DateSelector
              selectedDate={new Date()}
              onDateSelect={onDateSelect}
            />
          )}
          <div className="flex justify-center items-center h-full text-white/50">
            Select a league or date to view games
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !providedGames) {
    return (
      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[800px] bg-black/30 backdrop-blur-xl rounded-[12px] border border-white/50 flex flex-col">
          {!leagueId && onDateSelect && selectedDate && (
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          )}
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (displayGames.length === 0) {
    return (
      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[800px] bg-black/30 backdrop-blur-xl rounded-[12px] border border-white/50 flex flex-col">
          {!leagueId && onDateSelect && selectedDate && (
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          )}
          <div className="flex justify-center items-center h-full text-white/50">
            No games found
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="block xl:hidden p-4">
        {!leagueId && onDateSelect && selectedDate && (
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        )}
        {displayGames.map((game) => (
          <div
            key={game.fixture_id}
            className="mb-4 p-4 bg-black rounded-lg border border-[#4D4F5C]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LazyImage
                  src={game.league_logo}
                  alt={game.league_name}
                  className="w-6 h-6"
                />
                <span className="text-sm text-white/70">
                  {game.league_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {new Date(game.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-sm text-white/50">
                  {new Date(game.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <LazyImage
                  src={game.home_team_logo}
                  alt={game.home_team}
                  className="w-8 h-8 flex-shrink-0"
                />
                <span className="text-sm text-white break-words line-clamp-2">
                  {game.home_team}
                </span>
              </div>
              <div className="flex-shrink-0 px-2">
                <span className="text-sm text-white/50">vs</span>
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
                <span className="text-sm text-white break-words line-clamp-2 text-right">
                  {game.away_team}
                </span>
                <LazyImage
                  src={game.away_team_logo}
                  alt={game.away_team}
                  className="w-8 h-8 flex-shrink-0"
                />
              </div>
            </div>
            {selectedGame?.fixture_id === game.fixture_id ? (
              <div className="block xl:hidden mt-4 pt-4 border-t border-[#4D4F5C]">
                {/* @ts-ignore */}
                <UtilityWindow game={game} onClose={() => onGameSelect(null)} />
              </div>
            ) : (
              <div className="justify-between gap-2 mt-4 pt-4 border-t border-[#4D4F5C]">
                <button
                  onClick={() => onGameSelect(game)}
                  className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  Analyse
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[673px] bg-black/30 backdrop-blur-xl rounded-[12px] border border-white/50 flex flex-col overflow-y-auto">
          {!leagueId && onDateSelect && selectedDate && (
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          )}
          {displayGames.map((game) => (
            <div
              key={game.fixture_id}
              className="p-6 border-b border-[#4D4F5C]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <LazyImage
                        src={game.league_logo}
                        alt={game.league_name}
                        className="w-6 h-6"
                      />
                      <span className="text-sm text-white/70">
                        {game.league_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {new Date(game.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-sm text-white/50">
                        {new Date(game.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <LazyImage
                        src={game.home_team_logo}
                        alt={game.home_team}
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <span className="text-sm text-white break-words line-clamp-2">
                        {game.home_team}
                      </span>
                    </div>
                    <div className="flex-shrink-0 px-2">
                      <span className="text-sm text-white/50">vs</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
                      <span className="text-sm text-white break-words line-clamp-2 text-right">
                        {game.away_team}
                      </span>
                      <LazyImage
                        src={game.away_team_logo}
                        alt={game.away_team}
                        className="w-8 h-8 flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <button
                    onClick={() => onGameSelect(game)}
                    className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    Analyse
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Game;
