import { X, BarChart2, Ticket, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Game as GameType, Analysis as AnalysisType } from "@/types";
import { LazyImage } from "@/components/LazyImage";

type UtilityMode = "analysis" | "ticket" | "filterizer";

interface UtilityWindowProps {
  game: GameType | null;
  onClose: () => void;
  onCreateTicket: (minOdd: string, maxOdd: string) => Promise<void>;
  ticketGames?: GameType[];
  isTicketActive?: boolean;
}

const StatBar = ({
  label,
  value = 0,
  maxValue = 5,
  color = "bg-primary",
}: {
  label: string;
  value?: number;
  maxValue?: number;
  color?: string;
}) => {
  const safeValue = typeof value === "number" ? value : 0;
  const percentage = Math.min((safeValue / maxValue) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="text-white">{safeValue.toFixed(1)}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  stats,
  isCombined = false,
}: {
  title: string;
  stats: AnalysisType["home_team"];
  isCombined?: boolean;
}) => {
  return (
    <div className={`space-y-3 ${!isCombined ? "xl:h-[280px]" : ""}`}>
      <h3 className="text-sm xl:text-[1rem] font-semibold text-white/70">
        {title}
      </h3>
      <div className="space-y-2">
        <StatBar
          label="Goals"
          value={stats.avg_goals}
          maxValue={isCombined ? 4 : 2}
          color="bg-[#02a875]"
        />
        <StatBar
          label="Cards"
          value={stats.avg_cards}
          maxValue={isCombined ? 5 : 3}
          color="bg-[#FF6B6B]"
        />
        <StatBar
          label="Corners"
          value={stats.avg_corners}
          maxValue={isCombined ? 8 : 4}
          color="bg-[#4ECDC4]"
        />
        <StatBar
          label="Offsides"
          value={stats.avg_offsides}
          maxValue={isCombined ? 6 : 3}
          color="bg-[#FFD166]"
        />
        <StatBar
          label="Fouls"
          value={stats.avg_fouls}
          maxValue={isCombined ? 20 : 12}
          color="bg-[#9B5DE5]"
        />
      </div>
    </div>
  );
};

export default function UtilityWindow({
  game,
  onClose,
  onCreateTicket,
  ticketGames = [],
  isTicketActive = false,
}: UtilityWindowProps) {
  const [mode, setMode] = useState<UtilityMode>("analysis");
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [minOdd, setMinOdd] = useState<string>("");
  const [maxOdd, setMaxOdd] = useState<string>("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [showTickets, setShowTickets] = useState(false);

  // RULE: Content active? EXTEND. Content idle? DEFAULT HEIGHT.
  useEffect(() => {
    // Check if there is active content based on mode
    if (mode === "analysis" && analysis) {
      // Analysis mode with data - extend
      setIsExpanded(true);
    } else if (mode === "ticket" && isTicketActive && ticketGames.length > 0) {
      // Ticket mode with active tickets - extend
      setIsExpanded(true);
      // Add a slight delay before showing tickets to allow for expansion animation
      setTimeout(() => {
        setShowTickets(true);
      }, 300);
    } else if (mode === "analysis" && game) {
      // Selected game but loading analysis - extend
      setIsExpanded(true);
    } else {
      // Default state - collapse
      setIsExpanded(false);
      setShowTickets(false);
    }
  }, [mode, analysis, isTicketActive, ticketGames, game]);

  // Set initial mode to ticket if we have active tickets
  useEffect(() => {
    if (isTicketActive && ticketGames.length > 0) {
      setMode("ticket");
    }
  }, [isTicketActive, ticketGames]);

  const handleCreateTicket = async () => {
    if (!minOdd || !maxOdd) return;
    setIsCreatingTicket(true);
    setShowTickets(false);
    try {
      await onCreateTicket(minOdd, maxOdd);
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsCreatingTicket(false);
    }
  };

  useEffect(() => {
    if (!game) {
      setAnalysis(null);
      setIsLoading(false);
      setIsExpanded(false);
      return;
    }

    // When a game is selected, always switch to analysis mode and expand
    setMode("analysis");
    setIsExpanded(true);
    setIsLoading(true);

    const fetchAnalysis = async () => {
      try {
        const response = await fetch(
          `https://backend.betaisports.net/analyze/${game.fixture_id}`
        );
        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [game?.fixture_id]);

  const handleModeChange = (newMode: UtilityMode) => {
    setMode(newMode);
    if (newMode === "analysis" && game) {
      setIsLoading(true);
      const fetchAnalysis = async () => {
        try {
          const response = await fetch(
            `https://backend.betaisports.net/analyze/${game.fixture_id}`
          );
          const data = await response.json();
          setAnalysis(data);
        } catch (error) {
          console.error("Error fetching analysis:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalysis();
    }
  };

  return (
    <>
      <div className="xl:hidden animate-expand-down overflow-hidden">
        {game && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : analysis ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                      title={`${game.home_team}`}
                      stats={analysis.home_team}
                    />
                    <StatCard
                      title={`${game.away_team}`}
                      stats={analysis.away_team}
                    />
                  </div>
                  <StatCard
                    title="Combined Stats"
                    stats={analysis.combined}
                    isCombined
                  />
                </>
              ) : mode === "ticket" ? (
                <div className="bg-[#07070A] border border-[#4D4F5C] rounded-lg p-6">
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
                          className="w-full bg-[#1A1A1A] border border-[#4D4F5C] rounded px-3 py-2 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                          className="w-full bg-[#1A1A1A] border border-[#4D4F5C] rounded px-3 py-2 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="e.g. 10"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCreateTicket}
                      disabled={isCreatingTicket}
                      className="w-full bg-[#02a875] text-white py-2 rounded hover:bg-[#029a6a] transition-colors disabled:opacity-50"
                    >
                      {isCreatingTicket ? "Creating" : "Create Ticket"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/50">
                  Failed to load analysis
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div
        className={`hidden xl:block bg-black/50 backdrop-blur-md rounded-[12px] border border-white/50 self-end transition-all duration-500 ease-in-out relative ${
          isExpanded ? "h-[600px] w-[400px]" : "h-[200px] w-[400px]"
        }`}
      >
        {game ? (
          <div className="h-full">
            <div className="p-4 flex flex-row justify-between items-center border-b border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMode("analysis");
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    mode === "analysis"
                      ? "bg-[#02a875]"
                      : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                  }`}
                >
                  <BarChart2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => {
                    setMode("ticket");
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    mode === "ticket"
                      ? "bg-[#02a875]"
                      : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                  }`}
                >
                  <Ticket className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setMode("filterizer")}
                  className={`p-2 rounded-full transition-colors ${
                    mode === "filterizer"
                      ? "bg-[#02a875]"
                      : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                  }`}
                >
                  <Filter className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex justify-center items-center py-[1px] px-2 bg-[rgba(2,168,117,0.25)] rounded-[5px]">
                  <span className="text-[13px] text-[#02A976]">BetAI 0.1</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : mode === "analysis" && analysis ? (
              <div
                className={`p-4 space-y-0 ${
                  isExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard
                    title={`${game.home_team}`}
                    stats={analysis.home_team}
                  />
                  <StatCard
                    title={`${game.away_team}`}
                    stats={analysis.away_team}
                  />
                </div>
                <StatCard
                  title="Combined Stats"
                  stats={analysis.combined}
                  isCombined
                />
              </div>
            ) : mode === "ticket" ? (
              <div className="p-4 h-full overflow-y-auto pb-6">
                {isTicketActive && ticketGames.length > 0 ? (
                  isCreatingTicket || !showTickets ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Your Ticket</h3>
                      {ticketGames.map((game) => (
                        <div
                          key={game.fixture_id}
                          className="p-3 bg-black/30 border border-white/20 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <LazyImage
                                src={game.league_logo}
                                alt={game.league_name}
                                className="w-5 h-5"
                              />
                              <span className="text-xs text-white/70">
                                {game.league_name}
                              </span>
                            </div>
                            <div className="text-xs text-white/50">
                              {new Date(game.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-xs">
                              <LazyImage
                                src={game.home_team_logo}
                                alt={game.home_team}
                                className="w-4 h-4"
                              />
                              <span className="text-white truncate max-w-[80px]">
                                {game.home_team}
                              </span>
                            </div>
                            <span className="text-white/50 text-xs">vs</span>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-white truncate max-w-[80px]">
                                {game.away_team}
                              </span>
                              <LazyImage
                                src={game.away_team_logo}
                                alt={game.away_team}
                                className="w-4 h-4"
                              />
                            </div>
                          </div>
                          {game.ticket_info && (
                            <div className="mt-2 flex justify-between items-center pt-2 border-t border-white/10">
                              <span className="text-xs text-white/70">
                                {game.ticket_info.label}
                              </span>
                              <div className="bg-[#02a875] text-white text-xs px-2 py-1 rounded">
                                {game.ticket_info.odd.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-[80%] w-full">
                    <div className="bg-black/5 border border-white/50 backdrop-blur-sm rounded-[12px] w-[300px] h-[100px] flex justify-center items-center p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-sm">FROM</span>
                        <input
                          type="number"
                          value={minOdd}
                          onChange={(e) => setMinOdd(e.target.value)}
                          className="w-12 bg-[#1A1A1A] border border-[#4D4F5C] rounded px-2 py-1 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="5"
                        />
                        <span className="text-white/50 text-sm">TO</span>
                        <input
                          type="number"
                          value={maxOdd}
                          onChange={(e) => setMaxOdd(e.target.value)}
                          className="w-12 bg-[#1A1A1A] border border-[#4D4F5C] rounded px-2 py-1 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="10"
                        />
                        <button
                          onClick={handleCreateTicket}
                          disabled={isCreatingTicket}
                          className="bg-[#02a875] text-white px-4 py-1 rounded text-sm hover:bg-[#029a6a] transition-colors disabled:opacity-50 ml-2"
                        >
                          {isCreatingTicket ? "Creating" : "CREATE"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : mode === "filterizer" ? (
              <div className="p-4">
                <div className="text-gray-300">Coming soon...</div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full text-white/50">
                Failed to load analysis
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-4 flex flex-row justify-between items-center border-b border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMode("analysis");
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    mode === "analysis"
                      ? "bg-[#02a875]"
                      : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                  }`}
                >
                  <BarChart2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => {
                    setMode("ticket");
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    mode === "ticket"
                      ? "bg-[#02a875]"
                      : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                  }`}
                >
                  <Ticket className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setMode("filterizer")}
                  className={`p-2 rounded-full transition-colors ${
                    mode === "filterizer"
                      ? "bg-[#02a875]"
                      : "bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                  }`}
                >
                  <Filter className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex justify-center items-center py-[1px] px-2 bg-[rgba(2,168,117,0.25)] rounded-[5px]">
                  <span className="text-[13px] text-[#02A976]">BetAI 0.1</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center flex-1">
              {mode === "ticket" ? (
                isTicketActive && ticketGames.length > 0 ? (
                  isCreatingTicket || !showTickets ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="p-4 h-full w-full overflow-y-auto pb-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">
                          Your Ticket
                        </h3>
                        {ticketGames.map((game) => (
                          <div
                            key={game.fixture_id}
                            className="p-3 bg-black/30 border border-white/20 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <LazyImage
                                  src={game.league_logo}
                                  alt={game.league_name}
                                  className="w-5 h-5"
                                />
                                <span className="text-xs text-white/70">
                                  {game.league_name}
                                </span>
                              </div>
                              <div className="text-xs text-white/50">
                                {new Date(game.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 text-xs">
                                <LazyImage
                                  src={game.home_team_logo}
                                  alt={game.home_team}
                                  className="w-4 h-4"
                                />
                                <span className="text-white truncate max-w-[80px]">
                                  {game.home_team}
                                </span>
                              </div>
                              <span className="text-white/50 text-xs">vs</span>
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-white truncate max-w-[80px]">
                                  {game.away_team}
                                </span>
                                <LazyImage
                                  src={game.away_team_logo}
                                  alt={game.away_team}
                                  className="w-4 h-4"
                                />
                              </div>
                            </div>
                            {game.ticket_info && (
                              <div className="mt-2 flex justify-between items-center pt-2 border-t border-white/10">
                                <span className="text-xs text-white/70">
                                  {game.ticket_info.label}
                                </span>
                                <div className="bg-[#02a875] text-white text-xs px-2 py-1 rounded">
                                  {game.ticket_info.odd.toFixed(2)}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-[80%] w-full">
                    <div className="bg-black/5 border border-white/50 backdrop-blur-sm rounded-[12px] w-[300px] h-[100px] flex justify-center items-center p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-sm">FROM</span>
                        <input
                          type="number"
                          value={minOdd}
                          onChange={(e) => setMinOdd(e.target.value)}
                          className="w-12 bg-[#1A1A1A] border border-[#4D4F5C] rounded px-2 py-1 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="5"
                        />
                        <span className="text-white/50 text-sm">TO</span>
                        <input
                          type="number"
                          value={maxOdd}
                          onChange={(e) => setMaxOdd(e.target.value)}
                          className="w-12 bg-[#1A1A1A] border border-[#4D4F5C] rounded px-2 py-1 text-white text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="10"
                        />
                        <button
                          onClick={handleCreateTicket}
                          disabled={isCreatingTicket}
                          className="bg-[#02a875] text-white px-4 py-1 rounded text-sm hover:bg-[#029a6a] transition-colors disabled:opacity-50 ml-2"
                        >
                          {isCreatingTicket ? "Creating" : "CREATE"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-black/5 border border-white/50 backdrop-blur-sm rounded-[8px] w-[300px] h-[100px] flex justify-center items-center p-4">
                  <span className="flex justify-center items-center py-2 px-4 bg-gradient-to-r from-[#03E9A2] to-[#02835B] rounded-[8px] font-extrabold text-[14px] text-white">
                    Choose a game to analyse
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
