const Game = () => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const img = e.target as HTMLImageElement;
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiM0RDRGNUMiLz48L3N2Zz4=";
  };

  return (
    <div className="mt-[10px] flex flex-col items-center justify-center">
      <div className="text-white text-sm">28 February, Saturday</div>
      <div className="mt-[10px] bg-black h-[100px] w-full flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-white text-sm ml-[10px]">03:00</div>
          <div className="flex items-start flex-col ml-[10px]">
            <div className="flex items-center">
              <img
                src="https://raw.githubusercontent.com/luukhopman/football-logos/refs/heads/master/logos/England%20-%20Premier%20League/Liverpool%20FC.png"
                alt="Liverpool FC"
                width={20}
                height={20}
                className="mr-2 rounded-full"
                onError={handleImageError}
              />
              <span>Liverpool FC</span>
            </div>
            <div className="flex items-center">
              <img
                src="https://raw.githubusercontent.com/luukhopman/football-logos/refs/heads/master/logos/England%20-%20Premier%20League/Southampton%20FC.png"
                alt="Southampton FC"
                width={20}
                height={20}
                className="mr-2 rounded-full"
                onError={handleImageError}
              />
              <span>Southampton FC</span>
            </div>
          </div>
        </div>
        <button className="mr-[10px] bg-emerald-500 text-white text-sm px-[10px] py-[5px] rounded-md">
          ANALYSE
        </button>
      </div>
    </div>
  );
};

export default Game;
