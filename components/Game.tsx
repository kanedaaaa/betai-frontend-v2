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

const GameSkeleton = () => (
  <div className="p-6 border-b border-[#4D4F5C] animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4D4F5C]" />
            <div className="h-4 w-24 bg-[#4D4F5C] rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-[#4D4F5C] rounded" />
            <div className="h-4 w-24 bg-[#4D4F5C] rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#4D4F5C]" />
            <div className="h-4 w-32 bg-[#4D4F5C] rounded" />
          </div>
          <div className="flex-shrink-0 px-2">
            <div className="h-4 w-4 bg-[#4D4F5C] rounded" />
          </div>
          <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
            <div className="h-4 w-32 bg-[#4D4F5C] rounded" />
            <div className="w-8 h-8 rounded-full bg-[#4D4F5C]" />
          </div>
        </div>
      </div>
      <div className="ml-6">
        <div className="h-9 w-24 bg-[#4D4F5C] rounded-lg" />
      </div>
    </div>
  </div>
);

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
        <div className="relative w-[570px] h-[673px] bg-black/30 backdrop-blur-xl rounded-[12px] border border-white/50 flex flex-col">
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
        <div className="relative w-[570px] h-[673px] bg-black/30 backdrop-blur-xl rounded-[12px] border border-white/50 flex flex-col">
          {!leagueId && onDateSelect && selectedDate && (
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          )}
          <div className="flex-1 overflow-y-auto">
            {Array.from({ length: 5 }).map((_, index) => (
              <GameSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (displayGames.length === 0) {
    return (
      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[673px] bg-black/30 backdrop-blur-xl rounded-[12px] border border-white/50 flex flex-col">
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
              <div className="flex justify-center mt-4 pt-4 border-t border-[#4D4F5C]">
                <button
                  onClick={() => onGameSelect(game)}
                  className="w-32 py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
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
