import { useState, useEffect } from "react";
import { Game as GameType, Analysis as AnalysisType } from "@/types";
import { X } from "lucide-react";

interface AnalysisProps {
  game: GameType | null;
  onClose: () => void;
}

const StatBar = ({
  label,
  value,
  maxValue = 5,
  color = "bg-primary",
}: {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="text-white">{value.toFixed(1)}</span>
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
    <div className={`space-y-5 ${!isCombined ? "xl:h-[280px]" : ""}`}>
      <h3 className="text-sm xl:text-[1rem] font-semibold text-white/70">
        {title}
      </h3>
      <div className="space-y-4">
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

const Analysis = ({ game, onClose }: AnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!game) {
      setAnalysis(null);
      setIsLoading(false);
      setIsExpanded(false);
      return;
    }

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
          isExpanded ? "h-[600px] w-[400px]" : "h-[150px] w-[400px]"
        }`}
      >
        {game ? (
          <div className="h-full">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : analysis ? (
              <div
                className={`p-4 space-y-6 transition-opacity duration-300 ${
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
            ) : (
              <div className="flex justify-center items-center h-full text-white/50">
                Failed to load analysis
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-4 flex flex-row justify-between items-center border-b border-white/10">
              <h2 className="font-semibold text-[20px] text-white">
                AI Analysis
              </h2>
              <div className="flex justify-center items-center py-[1px] px-2 bg-[rgba(2,168,117,0.25)] rounded-[5px]">
                <span className="text-[13px] text-[#02A976]">BetAI 0.1</span>
              </div>
            </div>
            <div className="flex justify-center items-center flex-1">
              <div className="bg-black/5 border border-white/50 backdrop-blur-sm rounded-[12px] w-[300px] flex justify-center items-center p-4">
                <span className="flex justify-center items-center py-2 px-4 bg-gradient-to-r from-[#03E9A2] to-[#02835B] rounded-[8px] font-extrabold text-[14px] text-white">
                  Choose a game to analyse
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Analysis;
