import { useState, useRef } from "react";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Country {
  name: string;
  code: string;
  flag: string;
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
  const countries: Country[] = [
    { name: "England", code: "ENG", flag: "https://via.placeholder.com/20" },
    { name: "Spain", code: "ESP", flag: "https://via.placeholder.com/20" },
    { name: "Germany", code: "GER", flag: "https://via.placeholder.com/20" },
    { name: "Italy", code: "ITA", flag: "https://via.placeholder.com/20" },
    { name: "France", code: "FRA", flag: "https://via.placeholder.com/20" },
    { name: "Portugal", code: "POR", flag: "https://via.placeholder.com/20" },
    {
      name: "Netherlands",
      code: "NED",
      flag: "https://via.placeholder.com/20",
    },
    { name: "Belgium", code: "BEL", flag: "https://via.placeholder.com/20" },
  ];

  const leagues: League[] = [
    {
      name: "Premier League",
      leagueID: 1,
      logo: "https://via.placeholder.com/20",
    },
    { name: "La Liga", leagueID: 2, logo: "https://via.placeholder.com/20" },
    { name: "Bundesliga", leagueID: 3, logo: "https://via.placeholder.com/20" },
    { name: "Serie A", leagueID: 4, logo: "https://via.placeholder.com/20" },
    { name: "Ligue 1", leagueID: 5, logo: "https://via.placeholder.com/20" },
    { name: "Eredivisie", leagueID: 6, logo: "https://via.placeholder.com/20" },
    {
      name: "Primeira Liga",
      leagueID: 7,
      logo: "https://via.placeholder.com/20",
    },
    {
      name: "Championship",
      leagueID: 8,
      logo: "https://via.placeholder.com/20",
    },
  ];

  const teams: Team[] = [
    {
      id: 1,
      name: "Manchester United",
      logo: "https://via.placeholder.com/20",
    },
    { id: 2, name: "Barcelona", logo: "https://via.placeholder.com/20" },
    { id: 3, name: "Bayern Munich", logo: "https://via.placeholder.com/20" },
    { id: 4, name: "Juventus", logo: "https://via.placeholder.com/20" },
    { id: 5, name: "PSG", logo: "https://via.placeholder.com/20" },
    { id: 6, name: "Ajax", logo: "https://via.placeholder.com/20" },
    { id: 7, name: "Porto", logo: "https://via.placeholder.com/20" },
    { id: 8, name: "Real Madrid", logo: "https://via.placeholder.com/20" },
  ];

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
          <h1 className="font-bold text-[20px]">Countries</h1>
          {countries.map((country) => (
            <div
              key={country.code}
              className="w-full min-h-[40px] py-2 border border-[#4D4F5C] rounded-[8px] flex px-3 items-center"
            >
              <LazyImage
                src={country.flag}
                alt={country.name}
                className="mr-2 w-[20px] h-[20px] flex-shrink-0"
                onError={handleImageError}
              />
              <span className="break-words text-sm">{country.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col mt-5 gap-3 w-full">
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
      </div>
    </div>
  );
};

export default Filter;
