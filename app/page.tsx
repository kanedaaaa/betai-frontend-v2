"use client";
import SportSelector from "@/components/SportSelector";
import { ListFilterPlus, X, Ticket, Filter as FilterIcon } from "lucide-react";
import { useState } from "react";
import Filter from "@/components/Filter";
import Game from "@/components/Game";
import { Country, League, Game as GameType } from "@/types";
import Analysis from "@/components/Analysis";
import TicketCreator from "@/components/TicketCreator";

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
  league_name: string;
  league_logo: string;
}

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [ticketGames, setTicketGames] = useState<GameType[]>([]);
  const [isTicketActive, setIsTicketActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleCreateTicket = async (minOdd: string, maxOdd: string) => {
    try {
      const response = await fetch(
        `https://backend.betaisports.net/ticket-creator/?min_odd=${minOdd}&max_odd=${maxOdd}`
      );
      const data: TicketResponse = await response.json();

      console.log(data);
      // Fetch fixture details for each game
      const fixturePromises = data.ticket.map(async (game) => {
        const fixtureResponse = await fetch(
          `https://backend.betaisports.net/fixture/${game.fixture_id}/`
        );
        const fixtureData: Fixture = await fixtureResponse.json();

        return {
          ...fixtureData,
          league_name: "Ticket Game",
          league_logo: "https://media.api-sports.io/football/leagues/39.png",
          odds: {
            [game.field]: {
              label: game.label,
              value: game.odd,
            },
          },
        } as GameType;
      });

      const games = await Promise.all(fixturePromises);
      setTicketGames(games);
      setIsTicketActive(true);
      setIsFilterActive(false);
      setIsTicketOpen(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);
    if (country) {
      setIsFilterActive(true);
      setIsTicketActive(false);
    } else {
      setIsFilterActive(false);
    }
  };

  const handleLeagueSelect = (league: League | null) => {
    setSelectedLeague(league);
    if (league) {
      setIsFilterActive(true);
      setIsTicketActive(false);
    } else if (!selectedCountry) {
      setIsFilterActive(false);
    }
  };

  return (
    <div>
      {/* Mobile Layout */}
      <div className="xl:hidden">
        <div className="mt-[20px] flex justify-center items-center h-[104px] bg-black border-b border-t border-[#4D4F5C] ">
          <SportSelector />
        </div>
        <div className="flex justify-center items-center h-[54px] bg-black border-b border-[#4D4F5C] gap-3 ">
          <button
            className={`text-white p-2 rounded ${
              isTicketActive ? "bg-red-500" : "bg-[#02a875]"
            }`}
            onClick={() => setIsTicketOpen(true)}
          >
            <Ticket className="w-5 h-5" />
          </button>
          <button
            className="bg-[#02a875] text-white p-2 rounded"
            onClick={() => setIsFilterOpen(true)}
          >
            <FilterIcon className="w-5 h-5" />
          </button>
          <button
            className={`text-white p-2 rounded ${
              isFilterActive ? "bg-red-500" : "bg-[#02a875]"
            }`}
            onClick={() => setIsFilterOpen(true)}
          >
            <ListFilterPlus className="w-5 h-5" />
          </button>
        </div>
        <div>
          {isTicketActive ? (
            <Game
              leagueId={undefined}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              games={ticketGames}
            />
          ) : (
            <Game
              leagueId={selectedLeague?.leagueID}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
            />
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden xl:flex justify-center items-start mt-[90px]">
        <div className="flex">
          <div className="w-[300px] mr-[-20px]">
            <Filter
              selectedCountry={selectedCountry}
              selectedLeague={selectedLeague}
              onCountrySelect={handleCountrySelect}
              onLeagueSelect={handleLeagueSelect}
            />
          </div>

          <div className="mr-[30px] relative">
            <div className="absolute -top-[0px] left-0 w-full">
              <SportSelector />
            </div>
            {isTicketActive ? (
              <Game
                leagueId={undefined}
                selectedGame={selectedGame}
                onGameSelect={setSelectedGame}
                games={ticketGames}
              />
            ) : (
              <Game
                leagueId={selectedLeague?.leagueID}
                selectedGame={selectedGame}
                onGameSelect={setSelectedGame}
              />
            )}
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
              onCountrySelect={handleCountrySelect}
              onLeagueSelect={handleLeagueSelect}
            />
          </div>
        </div>
      )}

      {isTicketOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setIsTicketOpen(false)}
              className="absolute -top-4 -right-4 bg-black rounded-full p-1 border border-[#4D4F5C] hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <TicketCreator
              onClose={() => setIsTicketOpen(false)}
              onCreateTicket={handleCreateTicket}
            />
          </div>
        </div>
      )}
    </div>
  );
}
