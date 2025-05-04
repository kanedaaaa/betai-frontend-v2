import { useState } from "react";

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
  const [dates] = useState(() => {
    return [...Array(5)].map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date;
    });
  });

  return (
    <div className="flex items-center justify-between w-full px-4 py-2 mb-4">
      {dates.map((date, index) => {
        const dayName =
          index === 0
            ? "TODAY"
            : date.toLocaleDateString("en-US", { weekday: "short" });
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const isSelected = selectedDate?.toDateString() === date.toDateString();

        return (
          <button
            key={index}
            onClick={() => onDateSelect(date)}
            className={`flex flex-col items-center px-2 py-1 rounded-md transition-all ${
              isSelected
                ? index === 0
                  ? "bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  : "bg-green-500/20 text-green-500 border border-green-500"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="text-sm font-medium">{dayName}</span>
            <span className="text-xs">{dateStr}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DateSelector;
