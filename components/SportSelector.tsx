import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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

  // Mobile version
  const MobileVersion = () => (
    <div className="flex gap-4 xl:hidden">
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

  // Desktop version
  const DesktopVersion = () => (
    <div
      ref={containerRef}
      className="absolute -top-[70px] left-0 w-full h-[50px] bg-black/30 backdrop-blur-xl rounded-[100px] border border-white/50 flex justify-between items-center p-2 hidden xl:flex"
    >
      <motion.div
        initial={false}
        animate={{
          width: indicatorProps.width,
          x: indicatorProps.x,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className="absolute bg-[#02A875] rounded-[100px] h-8 z-0"
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
          onClick={() => setSelectedSport(sport.id)}
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
    </>
  );
};

export default SportSelector;
