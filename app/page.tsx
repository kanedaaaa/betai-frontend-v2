"use client";
import SportSelector from "@/components/SportSelector";
import { ListFilterPlus, X, Ticket, Filter as FilterIcon } from "lucide-react";
import { useState } from "react";
import Filter from "@/components/Filter";
import Game from "@/components/Game";
import { Country, League, Game as GameType } from "@/types";
import UtilityWindow from "@/components/UtilityWindow";
import TicketCreator from "@/components/TicketCreator";
import OddFilterizer from "@/components/OddFilterizer";

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
  const [isOddFilterizerOpen, setIsOddFilterizerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [ticketGames, setTicketGames] = useState<GameType[]>([]);
  const [isTicketActive, setIsTicketActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [filteredGames, setFilteredGames] = useState<GameType[]>([]);
  const [isFilterizerActive, setIsFilterizerActive] = useState(false);

  const handleCreateTicket = async (minOdd: string, maxOdd: string) => {
    setIsTicketActive(true);
    try {
      const response = await fetch(
        `https://backend.betaisports.net/ticket-creator/?min_odd=${minOdd}&max_odd=${maxOdd}`
      );
      const data: TicketResponse = await response.json();

      // Fetch fixture details for each game
      const fixturePromises = data.ticket.map(async (game) => {
        const fixtureResponse = await fetch(
          `https://backend.betaisports.net/fixture/${game.fixture_id}/`
        );
        const fixtureData: Fixture = await fixtureResponse.json();

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
            [game.field]: {
              label: game.label,
              value: game.odd,
            },
          },
          ticket_info: {
            field: game.field,
            label: game.label,
            odd: game.odd,
          },
        } as GameType;
      });

      const games = await Promise.all(fixturePromises);
      setTicketGames(games);
      setIsTicketOpen(false);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);
    setSelectedLeague(null);
    setSelectedDate(null);
    if (country) {
      setIsFilterActive(true);
      setIsTicketActive(false);
    } else {
      setIsFilterActive(false);
      setSelectedDate(new Date());
      setIsFilterOpen(false);
    }
  };

  const handleLeagueSelect = (league: League | null) => {
    setSelectedLeague(league);
    setSelectedDate(null);
    if (league) {
      setIsFilterActive(true);
      setIsTicketActive(false);
    } else if (!selectedCountry) {
      setIsFilterActive(false);
      setSelectedDate(new Date());
    }
  };

  const handleFilteredGames = (games: GameType[]) => {
    setFilteredGames(games);
    setIsTicketActive(false);
    setIsFilterizerActive(true);
  };

  const handleClearFilterizer = () => {
    setFilteredGames([]);
    setIsFilterizerActive(false);
    setSelectedDate(new Date());
  };

  const handleClearTicket = () => {
    setTicketGames([]);
    setIsTicketActive(false);
    setSelectedDate(new Date());
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
            onClick={() =>
              isTicketActive ? handleClearTicket() : setIsTicketOpen(true)
            }
          >
            {isTicketActive ? (
              <X className="w-5 h-5" />
            ) : (
              <Ticket className="w-5 h-5" />
            )}
          </button>
          <button
            className={`text-white p-2 rounded ${
              isFilterActive ? "bg-red-500" : "bg-[#02a875]"
            }`}
            onClick={() => setIsFilterOpen(true)}
          >
            <FilterIcon className="w-5 h-5" />
          </button>
          <button
            className={`text-white p-2 rounded ${
              isFilterizerActive ? "bg-red-500" : "bg-[#02a875]"
            }`}
            onClick={() =>
              isFilterizerActive
                ? handleClearFilterizer()
                : setIsOddFilterizerOpen(true)
            }
          >
            {isFilterizerActive ? (
              <X className="w-5 h-5" />
            ) : (
              <ListFilterPlus className="w-5 h-5" />
            )}
          </button>
        </div>
        <div>
          {isTicketActive ? (
            <>
              {ticketGames.length > 0 && (
                <div className="bg-[#02a875]/20 py-2 px-4 text-center">
                  <span className="text-[#02a875] font-semibold">
                    Total Odd:{" "}
                    {ticketGames
                      .reduce(
                        (acc, game) => acc * (game.ticket_info?.odd || 1),
                        1
                      )
                      .toFixed(2)}
                  </span>
                </div>
              )}
              <Game
                leagueId={undefined}
                selectedGame={selectedGame}
                onGameSelect={setSelectedGame}
                games={ticketGames}
              />
            </>
          ) : isFilterizerActive ? (
            <div>
              {filteredGames.length > 0 ? (
                <>
                  <div className="bg-[#02a875]/20 py-2 px-4 text-center">
                    <span className="text-[#02a875] font-semibold">
                      Total Odd:{" "}
                      {filteredGames
                        .reduce(
                          (acc, game) => acc * (game.ticket_info?.odd || 1),
                          1
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <Game
                    leagueId={undefined}
                    selectedGame={selectedGame}
                    onGameSelect={setSelectedGame}
                    games={filteredGames}
                  />
                </>
              ) : (
                <div className="flex justify-center items-center h-[200px]">
                  <span className="text-white/50 text-sm">No games found</span>
                </div>
              )}
            </div>
          ) : (
            <Game
              leagueId={selectedLeague?.leagueID}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
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
            {/* Always show the default game list in desktop view, regardless of ticket status */}
            <Game
              leagueId={selectedLeague?.leagueID}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          <UtilityWindow
            game={selectedGame}
            onClose={() => {
              // If a game is selected, clear it for analysis view
              if (selectedGame) {
                setSelectedGame(null);
              }
              // If no game but tickets are active, clear the tickets
              else if (isTicketActive) {
                handleClearTicket();
              }
            }}
            onCreateTicket={handleCreateTicket}
            ticketGames={ticketGames}
            isTicketActive={isTicketActive}
          />
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

      {isOddFilterizerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setIsOddFilterizerOpen(false)}
              className="absolute -top-4 -right-4 bg-black rounded-full p-1 border border-[#4D4F5C] hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <OddFilterizer
              onClose={() => setIsOddFilterizerOpen(false)}
              onFilterGames={handleFilteredGames}
              onClear={handleClearFilterizer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
