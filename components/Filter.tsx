import { useState, useRef, useEffect } from "react";
import { Country, League } from "@/types";
import Button from "./Button";

interface FilterProps {
  selectedCountry: Country | null;
  selectedLeague: League | null;
  onCountrySelect: (country: Country | null) => void;
  onLeagueSelect: (league: League | null) => void;
  responsiveDesign?: boolean;
}

const LazyImage = ({
  src,
  alt,
  className,
  onError,
}: {
  src: string;
  alt: string;
  className: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      onError={onError}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

const CountrySkeleton = () => (
  <div className="w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center">
    <div className="w-[20px] h-[20px] rounded-full bg-[#4D4F5C] mr-2 animate-pulse" />
    <div className="h-4 w-24 bg-[#4D4F5C] rounded animate-pulse" />
  </div>
);

const LeagueSkeleton = () => (
  <div className="w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center">
    <div className="w-[20px] h-[20px] rounded-full bg-[#4D4F5C] mr-2 animate-pulse" />
    <div className="h-4 w-32 bg-[#4D4F5C] rounded animate-pulse" />
  </div>
);

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  size = "default",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}) => {
  const sizeClasses = {
    default: "w-[190px] h-[40px] text-[12px]",
    large: "w-[300px] h-[50px] text-[16px]",
  };

  return (
    <div
      className={`flex items-center px-3 py-1 gap-3 bg-[#07070A] border border-[#4D4F5C] rounded-full ${sizeClasses[size]} ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`bg-transparent text-[#434343] font-bold leading-[25px] px-2 outline-none w-full ${
          size === "large" ? "text-[16px]" : "text-[12px]"
        }`}
      />
      <Button
        variant="curved"
        size={size === "large" ? "md" : "sm"}
        className={`px-4 !m-[-4px] ${
          size === "large" ? "py-2 text-[14px]" : "py-1 text-[12px]"
        }`}
      >
        Search
      </Button>
    </div>
  );
};

const Filter = ({
  selectedCountry,
  selectedLeague,
  onCountrySelect,
  onLeagueSelect,
  responsiveDesign = false,
}: FilterProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(
    !selectedCountry
  );
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [filteredLeagues, setFilteredLeagues] = useState<League[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      if (selectedCountry) {
        setCountries([selectedCountry]);
        setFilteredCountries([selectedCountry]);
        setIsLoadingCountries(false);
        return;
      }

      try {
        const response = await fetch(
          "https://backend.betaisports.net/countries/"
        );
        const data = await response.json();
        const filteredCountries = data.filter(
          (country: Country) => country.name !== "Crimea"
        );
        setCountries(filteredCountries);
        setFilteredCountries(filteredCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchLeagues = async () => {
      if (!selectedCountry) {
        setLeagues([]);
        setFilteredLeagues([]);
        return;
      }

      if (selectedLeague) {
        setLeagues([selectedLeague]);
        setFilteredLeagues([selectedLeague]);
        return;
      }

      setIsLoadingLeagues(true);
      try {
        const response = await fetch(
          `https://backend.betaisports.net/leagues/${selectedCountry.name}`
        );
        const data = await response.json();
        setLeagues(data);
        setFilteredLeagues(data);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        setIsLoadingLeagues(false);
      }
    };

    fetchLeagues();
  }, [selectedCountry, selectedLeague]);

  useEffect(() => {
    const searchTerm = searchQuery.toLowerCase().trim();

    if (!searchTerm) {
      if (selectedCountry) {
        setFilteredLeagues(leagues);
      } else {
        setFilteredCountries(countries);
      }
      return;
    }

    if (!selectedCountry) {
      setFilteredCountries(
        countries.filter((country) =>
          country.name.toLowerCase().includes(searchTerm)
        )
      );
    } else {
      setFilteredLeagues(
        leagues.filter((league) =>
          league.name.toLowerCase().includes(searchTerm)
        )
      );
    }
  }, [searchQuery, countries, leagues, selectedCountry]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiM0RDRGNUMiLz48L3N2Zz4=";
  };

  const handleCountryClick = (country: Country) => {
    if (selectedCountry?.name === country.name) {
      onCountrySelect(null);
      onLeagueSelect(null);
    } else {
      onCountrySelect(country);
      onLeagueSelect(null);
    }
  };

  const handleLeagueClick = (league: League) => {
    if (selectedLeague?.leagueID === league.leagueID) {
      onLeagueSelect(null);
    } else {
      onLeagueSelect(league);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Mobile version
  if (responsiveDesign) {
    return (
      <div className="frost-effect w-full flex flex-col bg-black border-b border-white/10">
        <div className="w-full flex justify-center items-center h-[70px] px-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            size="large"
            placeholder="Search"
          />
        </div>
        <div className="w-full overflow-hidden">
          {!selectedCountry && (
            <div className="w-full p-4">
              <div className="overflow-x-auto flex gap-4 pb-4 scrollbar-hide">
                {isLoadingCountries
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center min-w-[60px] p-2"
                      >
                        <div className="w-[28px] h-[28px] rounded-full bg-[#1A1A1A] animate-pulse" />
                      </div>
                    ))
                  : filteredCountries.map((country) => (
                      <div
                        key={country.code || country.name}
                        onClick={() => handleCountryClick(country)}
                        className={`flex flex-col items-center min-w-[60px] p-2 cursor-pointer ${
                          /* @ts-ignore */
                          selectedCountry?.name === country.name
                            ? "bg-white/10 rounded-full p-1"
                            : ""
                        }`}
                      >
                        <div className="w-[28px] h-[28px] flex items-center justify-center">
                          <LazyImage
                            /* @ts-ignore */
                            src={country.flag}
                            alt={country.name}
                            className="w-full h-full rounded-full object-contain"
                            onError={handleImageError}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}
          {selectedCountry && (
            <div className="w-full p-4">
              <div className="overflow-x-auto flex gap-4 pb-4 scrollbar-hide">
                {isLoadingLeagues
                  ? Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center min-w-[60px] p-2"
                      >
                        <div className="w-[28px] h-[28px] rounded-full bg-[#1A1A1A] animate-pulse" />
                      </div>
                    ))
                  : filteredLeagues.map((league) => (
                      <div
                        key={league.leagueID}
                        onClick={() => handleLeagueClick(league)}
                        className={`flex flex-col items-center min-w-[60px] p-2 cursor-pointer ${
                          selectedLeague?.leagueID === league.leagueID
                            ? "bg-white/10 rounded-full p-1"
                            : ""
                        }`}
                      >
                        <div className="w-[28px] h-[28px] flex items-center justify-center">
                          <LazyImage
                            src={league.logo}
                            alt={league.name}
                            className="w-full h-full rounded-full object-contain"
                            onError={handleImageError}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="frost-effect w-[240px] h-[600px] bg-black rounded-[12px] border border-white/50 flex flex-col items-center shadow-lg">
      <div className="w-full flex justify-center items-center mt-2">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
        />
      </div>
      <div className="w-full flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3 w-full">
          <h1 className="font-bold text-[20px]">Countries</h1>
          {isLoadingCountries
            ? Array.from({ length: 10 }).map((_, index) => (
                <CountrySkeleton key={index} />
              ))
            : filteredCountries.map((country) => (
                <div
                  key={country.code || country.name}
                  className={`w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center cursor-pointer hover:bg-white/10 ${
                    selectedCountry?.name === country.name ? "bg-white/10" : ""
                  }`}
                  onClick={() => handleCountryClick(country)}
                >
                  {country.flag && (
                    <LazyImage
                      src={country.flag}
                      alt={country.name}
                      className="mr-2 w-[20px] h-[20px] flex-shrink-0"
                      onError={handleImageError}
                    />
                  )}
                  <span className="break-words text-sm">{country.name}</span>
                </div>
              ))}

          {selectedCountry && (
            <>
              <h1 className="font-bold text-[20px] mt-4">Leagues</h1>
              {isLoadingLeagues
                ? Array.from({ length: 10 }).map((_, index) => (
                    <LeagueSkeleton key={index} />
                  ))
                : filteredLeagues.map((league) => (
                    <div
                      key={league.leagueID}
                      className={`w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center cursor-pointer hover:bg-white/10 ${
                        selectedLeague?.leagueID === league.leagueID
                          ? "bg-white/10"
                          : ""
                      }`}
                      onClick={() => handleLeagueClick(league)}
                    >
                      <LazyImage
                        src={league.logo}
                        alt={league.name}
                        className="mr-2 w-[20px] h-[20px] flex-shrink-0"
                        onError={handleImageError}
                      />
                      <span className="break-words text-sm">{league.name}</span>
                    </div>
                  ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
