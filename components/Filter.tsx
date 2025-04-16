import { useState, useRef, useEffect } from "react";

interface Team {
  id: number;
  name: string;
  logo: string;
}

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

const Filter = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  // Top 10 leagues data
  const leagues: League[] = [
    {
      name: "Championship",
      leagueID: 40,
      logo: "https://media.api-sports.io/football/leagues/40.png",
    },
    {
      name: "League One",
      leagueID: 41,
      logo: "https://media.api-sports.io/football/leagues/41.png",
    },
    {
      name: "League Two",
      leagueID: 42,
      logo: "https://media.api-sports.io/football/leagues/42.png",
    },
    {
      name: "National League",
      leagueID: 43,
      logo: "https://media.api-sports.io/football/leagues/43.png",
    },
    {
      name: "FA WSL",
      leagueID: 44,
      logo: "https://media.api-sports.io/football/leagues/44.png",
    },
    {
      name: "FA Cup",
      leagueID: 45,
      logo: "https://media.api-sports.io/football/leagues/45.png",
    },
    {
      name: "EFL Trophy",
      leagueID: 46,
      logo: "https://media.api-sports.io/football/leagues/46.png",
    },
    {
      name: "FA Trophy",
      leagueID: 47,
      logo: "https://media.api-sports.io/football/leagues/47.png",
    },
    {
      name: "League Cup",
      leagueID: 48,
      logo: "https://media.api-sports.io/football/leagues/48.png",
    },
  ];

  // Top 10 teams from Premier League
  const teams: Team[] = [
    {
      id: 1,
      name: "Arsenal",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Arsenal.png",
    },
    {
      id: 2,
      name: "Aston Villa",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Aston%20Villa.png",
    },
    {
      id: 3,
      name: "Brighton",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Brighton.png",
    },
    {
      id: 4,
      name: "Burnley",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Burnley.png",
    },
    {
      id: 5,
      name: "Chelsea",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Chelsea.png",
    },
    {
      id: 6,
      name: "Crystal Palace",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Crystal%20Palace.png",
    },
    {
      id: 7,
      name: "Everton",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Everton.png",
    },
    {
      id: 8,
      name: "Leeds",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Leeds.png",
    },
    {
      id: 9,
      name: "Leicester",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Leicester.png",
    },
    {
      id: 10,
      name: "Liverpool",
      logo: "https://raw.githubusercontent.com/luukhopman/football-logos/master/logos/England%20-%20Premier%20League/Liverpool.png",
    },
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://backend.betaisports.net/countries/"
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiM0RDRGNUMiLz48L3N2Zz4=";
  };

  return (
    <div className="frost-effect w-[240px] h-[600px] bg-black rounded-[12px] border border-white/50 flex flex-col items-center shadow-lg">
      <div className="w-full flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3 w-full">
          <h1 className="font-bold text-[20px]">Top Leagues</h1>
          {leagues.map((league) => (
            <div
              key={league.leagueID}
              className="w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center"
            >
              <LazyImage
                src={league.logo}
                alt={league.name}
                className="mr-2 w-[20px] h-[20px] rounded-full flex-shrink-0"
                onError={handleImageError}
              />
              <span className="break-words text-sm">{league.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col mt-5 gap-3 w-full">
          <h1 className="font-bold text-[20px]">Top Teams</h1>
          {teams.map((team) => (
            <div
              key={team.id}
              className="w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center"
            >
              <LazyImage
                src={team.logo}
                alt={team.name}
                className="mr-2 w-[20px] h-[20px] rounded-full flex-shrink-0"
                onError={handleImageError}
              />
              <span className="break-words text-sm">{team.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col mt-5 gap-3 w-full">
          <h1 className="font-bold text-[20px]">Countries</h1>
          {countries.map((country) => (
            <div
              key={country.code || country.name}
              className="w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center"
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
        </div>
      </div>
    </div>
  );
};

export default Filter;
