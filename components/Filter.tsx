import { useState, useRef, useEffect } from "react";

interface Country {
  name: string;
  code: string | null;
  flag: string | null;
}

interface League {
  name: string;
  leagueID: number;
  logo: string;
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

const Filter = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://backend.betaisports.net/countries/"
        );
        const data = await response.json();
        // Filter out Crimea from the countries list
        const filteredCountries = data.filter(
          (country: Country) => country.name !== "Crimea"
        );
        setCountries(filteredCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchLeagues = async () => {
      if (!selectedCountry) {
        setLeagues([]);
        return;
      }

      setIsLoadingLeagues(true);
      try {
        const response = await fetch(
          `https://backend.betaisports.net/leagues/${selectedCountry.name}`
        );
        const data = await response.json();
        setLeagues(data);
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        setIsLoadingLeagues(false);
      }
    };

    fetchLeagues();
  }, [selectedCountry]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiM0RDRGNUMiLz48L3N2Zz4=";
  };

  const handleCountryClick = (country: Country) => {
    if (selectedCountry?.name === country.name) {
      setSelectedCountry(null);
      setSelectedLeague(null);
    } else {
      setSelectedCountry(country);
      setSelectedLeague(null);
    }
  };

  const handleLeagueClick = (league: League) => {
    if (selectedLeague?.leagueID === league.leagueID) {
      setSelectedLeague(null);
    } else {
      setSelectedLeague(league);
    }
  };

  const displayCountries = selectedCountry ? [selectedCountry] : countries;
  const displayLeagues = selectedLeague ? [selectedLeague] : leagues;

  return (
    <div className="frost-effect w-[240px] h-[600px] bg-black rounded-[12px] border border-white/50 flex flex-col items-center shadow-lg">
      <div className="w-full flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3 w-full">
          <h1 className="font-bold text-[20px]">Countries</h1>
          {isLoadingCountries
            ? Array.from({ length: 10 }).map((_, index) => (
                <CountrySkeleton key={index} />
              ))
            : displayCountries.map((country) => (
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
                : displayLeagues.map((league) => (
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
