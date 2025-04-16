import Image from "next/image";
import { useState } from "react";

const SportSelector = () => {
  const sports = [
    { id: "football", name: "Football" },
    { id: "ufc", name: "UFC" },
    { id: "basketball", name: "Basketball" },
    { id: "tennis", name: "Tennis" },
    { id: "nfl", name: "NFL" },
  ];
  const [selectedSport, setSelectedSport] = useState(sports[0].id);

  return (
    <div className="flex gap-4">
      {sports.map((sport) => (
        <div
          key={sport.id}
          className="flex flex-col items-center cursor-pointer first:ml-[4px]"
          onClick={() => setSelectedSport(sport.id)}
        >
          <Image
            src={`/SportsSelectorIcons/${sport.id}.png`}
            alt={sport.id}
            width={57}
            height={52}
          />
          <span
            className={`mt-1 text-xs px-2 py-0.5 rounded-full ${
              selectedSport === sport.id
                ? "bg-[#02a875] text-white"
                : "text-white"
            }`}
          >
            {sport.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SportSelector;
