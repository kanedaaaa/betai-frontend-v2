import { useState, useEffect } from "react";
import { Game as GameType } from "@/types";
import { LazyImage } from "@/components/LazyImage";
import Analysis from "./Analysis";

interface GameProps {
  leagueId?: number;
  selectedGame: GameType | null;
  onGameSelect: (game: GameType | null) => void;
}

const Game = ({ leagueId, selectedGame, onGameSelect }: GameProps) => {
  const [games, setGames] = useState<GameType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      if (!leagueId) {
        setGames([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://backend.betaisports.net/games/${leagueId}`
        );
        const data = await response.json();
        setGames(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching games:", error);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [leagueId]);

  if (!leagueId) {
    return (
      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[600px] bg-black rounded-[12px] border border-white/50 flex flex-col">
          <div className="flex justify-center items-center h-full text-white/50">
            Select a league to view games
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[600px] bg-black rounded-[12px] border border-white/50 flex flex-col">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="hidden xl:block">
        <div className="relative w-[570px] h-[600px] bg-black rounded-[12px] border border-white/50 flex flex-col">
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
        {games.map((game) => (
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
                <Analysis game={game} onClose={() => onGameSelect(null)} />
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
        <div className="relative w-[570px] h-[600px] bg-black rounded-[12px] border border-white/50 flex flex-col overflow-y-auto">
          {games.map((game) => (
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
