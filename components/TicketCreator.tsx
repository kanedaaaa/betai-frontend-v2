import { X } from "lucide-react";
import { useState } from "react";
import Game from "./Game";

interface TicketCreatorProps {
  onClose: () => void;
  onCreateTicket: (minOdd: string, maxOdd: string) => Promise<void>;
}

interface TicketGame {
  fixture_id: number;
  field: string;
  label: string;
  odd: number;
}

interface TicketResponse {
  total_odd: number;
  ticket: TicketGame[];
}

interface Fixture {
  fixture_id: number;
  league: number;
  home_team: string;
  home_team_logo: string;
  home_team_id: number;
  away_team: string;
  away_team_logo: string;
  away_team_id: number;
  date: string;
}

export default function TicketCreator({
  onClose,
  onCreateTicket,
}: TicketCreatorProps) {
  const [minOdd, setMinOdd] = useState<string>("");
  const [maxOdd, setMaxOdd] = useState<string>("");
  const [ticketGames, setTicketGames] = useState<TicketGame[]>([]);
  const [fixtures, setFixtures] = useState<Record<number, Fixture>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!minOdd || !maxOdd) return;

    setIsLoading(true);
    try {
      await onCreateTicket(minOdd, maxOdd);
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute -top-4 -right-4 bg-black rounded-full p-1 border border-[#4D4F5C] hover:bg-gray-800 transition-colors"
      >
        <X className="w-4 h-4 text-white" />
      </button>
      <div className="bg-black p-4 rounded-lg w-[90vw] max-w-md">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Min Odd
              </label>
              <input
                type="number"
                value={minOdd}
                onChange={(e) => setMinOdd(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#4D4F5C] rounded px-3 py-2 text-white"
                placeholder="e.g. 5"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Odd
              </label>
              <input
                type="number"
                value={maxOdd}
                onChange={(e) => setMaxOdd(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#4D4F5C] rounded px-3 py-2 text-white"
                placeholder="e.g. 10"
              />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="w-full bg-[#02a875] text-white py-2 rounded hover:bg-[#029a6a] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Ticket"}
          </button>

          {ticketGames.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="text-center text-lg font-semibold text-white">
                Total Odd:{" "}
                {ticketGames
                  .reduce((acc, game) => acc * game.odd, 1)
                  .toFixed(2)}
              </div>
              {ticketGames.map((game) => (
                <div
                  key={game.fixture_id}
                  className="border border-red-500 rounded-lg p-2"
                >
                  {fixtures[game.fixture_id] && (
                    <Game
                      leagueId={fixtures[game.fixture_id].league}
                      selectedGame={null}
                      onGameSelect={() => {}}
                    />
                  )}
                  <div className="mt-2 text-center text-white">
                    {game.label} @ {game.odd.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
