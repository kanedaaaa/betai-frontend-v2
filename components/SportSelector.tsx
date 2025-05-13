import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const SportSelector = () => {
  const sports = [
    { id: "football", name: "Football" },
    { id: "ufc", name: "UFC" },
    { id: "basketball", name: "Basketball" },
    { id: "tennis", name: "Tennis" },
    { id: "nfl", name: "NFL" },
  ];
  const [selectedSport, setSelectedSport] = useState(sports[0].id);
  const [indicatorProps, setIndicatorProps] = useState({ width: 0, x: 0 });
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSport, setPopupSport] = useState("");

  useEffect(() => {
    if (itemRefs.current[selectedSport] && containerRef.current) {
      const currentItem = itemRefs.current[selectedSport];
      const containerRect = containerRef.current.getBoundingClientRect();

      if (currentItem) {
        const itemRect = currentItem.getBoundingClientRect();
        setIndicatorProps({
          width: itemRect.width,
          x: itemRect.left - containerRect.left - 8,
        });
      }
    }
  }, [selectedSport]);

  const handleSportSelect = (sportId: string, sportName: string) => {
    if (sportId !== "football") {
      setPopupSport(sportName);
      setShowPopup(true);
      // Keep football selected
      return;
    }
    setSelectedSport(sportId);
  };

  // Mobile version
  const MobileVersion = () => (
    <div className="flex gap-4 xl:hidden overflow-x-auto scrollbar-hide">
      {sports.map((sport) => (
        <div
          key={sport.id}
          className="flex flex-col items-center cursor-pointer first:ml-[4px]"
          onClick={() => handleSportSelect(sport.id, sport.name)}
        >
          <div className="relative w-[57px] h-[52px]">
            <Image
              src={`/SportsSelectorIcons/${sport.id}.png`}
              alt={sport.id}
              width={57}
              height={52}
            />
          </div>
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

  // Desktop version
  const DesktopVersion = () => (
    <div
      ref={containerRef}
      className="absolute -top-[70px] left-0 w-full h-[50px] bg-black/30 backdrop-blur-xl rounded-[100px] border border-white/50 flex justify-between items-center p-2 hidden xl:flex"
    >
      <div
        style={{
          width: indicatorProps.width,
          transform: `translateX(${indicatorProps.x}px)`,
        }}
        className="absolute bg-[#02A875] rounded-[100px] h-8 z-0 transition-all duration-200"
      />

      {sports.map((sport) => (
        <div
          key={sport.id}
          ref={(el) => {
            itemRefs.current[sport.id] = el;
          }}
          className={`relative z-10 text-[16px] px-3 py-1 rounded-[100px] cursor-pointer flex items-center justify-center ${
            selectedSport === sport.id ? "text-black" : "text-white"
          }`}
          onClick={() => handleSportSelect(sport.id, sport.name)}
        >
          {sport.name}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <MobileVersion />
      <DesktopVersion />

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-[#4D4F5C] rounded-lg p-6 w-[90vw] max-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Coming Soon</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-white mb-6 text-center">
              {popupSport} is coming soon!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-[#02a875] text-white py-2 rounded hover:bg-[#029a6a] transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SportSelector;
