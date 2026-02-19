import React from "react";

interface ProgressDotsProps {
  total: number;
  current: number;
  onDotClick?: (index: number) => void;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current, onDotClick }) => {
  // Show max 12 dots; if more, show a condensed version
  const maxVisible = 12;
  const showCondensed = total > maxVisible;

  if (showCondensed) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {Array.from({ length: Math.min(total, maxVisible) }).map((_, i) => {
          const step = Math.floor(total / maxVisible);
          const mappedIndex = i * step;
          const isActive = current >= mappedIndex && current < mappedIndex + step;
          const isPast = current > mappedIndex + step;
          return (
            <button
              key={i}
              onClick={() => onDotClick?.(mappedIndex)}
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "w-5 h-2 bg-gold shadow-gold"
                  : isPast
                  ? "w-2 h-2 bg-gold/50"
                  : "w-2 h-2 bg-emerald-surface border border-emerald-border"
              }`}
            />
          );
        })}
        <span className="text-cream-dim text-xs mr-2" dir="ltr">
          {current + 1}/{total}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick?.(i)}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-5 h-2 bg-gold shadow-gold"
              : i < current
              ? "w-2 h-2 bg-gold/50"
              : "w-2 h-2 bg-emerald-surface border border-emerald-border"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;
