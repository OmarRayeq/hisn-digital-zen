import React, { useState, useCallback } from "react";
import { RotateCcw, Settings } from "lucide-react";

interface CounterButtonProps {
  targetCount: number;
  remaining: number;
  onTap: () => void;
  onReset: () => void;
  onSettings?: () => void;
  completed: boolean;
}

const CounterButton: React.FC<CounterButtonProps> = ({
  targetCount,
  remaining,
  onTap,
  onReset,
  onSettings,
  completed,
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  const progress = targetCount > 0 ? ((targetCount - remaining) / targetCount) * 100 : 0;
  const circumference = 2 * Math.PI * 56; // radius = 56
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      if (completed) return;

      // Ripple effect
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let x: number, y: number;
      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = (e as React.MouseEvent).clientX - rect.left;
        y = (e as React.MouseEvent).clientY - rect.top;
      }

      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);

      onTap();
    },
    [completed, onTap]
  );

  return (
    <div className="flex items-center justify-center gap-8 w-full">
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="flex flex-col items-center gap-1.5 group"
        title="إعادة تعيين"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-surface border border-emerald-border flex items-center justify-center transition-all duration-200 group-hover:border-gold/50 group-hover:bg-emerald-mid group-active:scale-95">
          <RotateCcw className="w-5 h-5 text-cream-dim group-hover:text-gold transition-colors" />
        </div>
        <span className="text-xs text-cream-dim group-hover:text-cream transition-colors">إعادة</span>
      </button>

      {/* Main Counter Circle */}
      <div className="relative flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          width="160"
          height="160"
          viewBox="0 0 160 160"
        >
          {/* Track */}
          <circle
            cx="80"
            cy="80"
            r="56"
            fill="none"
            stroke="hsl(150 25% 18%)"
            strokeWidth="4"
          />
          {/* Progress */}
          <circle
            cx="80"
            cy="80"
            r="56"
            fill="none"
            stroke={completed ? "hsl(40 52% 55%)" : "hsl(40 52% 55%)"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: completed ? "drop-shadow(0 0 8px hsl(40 52% 55% / 0.8))" : "drop-shadow(0 0 4px hsl(40 52% 55% / 0.4))",
            }}
          />
        </svg>

        {/* Button */}
        <button
          onClick={handleTap}
          onTouchStart={handleTap}
          disabled={completed}
          className={`relative w-36 h-36 rounded-full overflow-hidden transition-all duration-150 select-none
            ${isPressed ? "scale-95" : "scale-100"}
            ${completed
              ? "cursor-default"
              : "cursor-pointer active:scale-95"
            }
          `}
          style={{
            background: completed
              ? "radial-gradient(circle at 40% 35%, hsl(40 50% 22%), hsl(150 40% 10%))"
              : "radial-gradient(circle at 40% 35%, hsl(150 38% 16%), hsl(150 50% 7%))",
            boxShadow: completed
              ? "0 0 40px hsl(40 52% 55% / 0.5), inset 0 1px 0 hsl(40 52% 70% / 0.2)"
              : "0 0 30px hsl(40 52% 55% / 0.25), inset 0 1px 0 hsl(150 40% 30% / 0.2), 0 8px 24px hsl(0 0% 0% / 0.5)",
          }}
        >
          {/* Ripples */}
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute rounded-full bg-gold/20 pointer-events-none animate-ping"
              style={{
                left: r.x - 20,
                top: r.y - 20,
                width: 40,
                height: 40,
                animationDuration: "0.6s",
                animationIterationCount: 1,
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0.5">
            {completed ? (
              <>
                <span className="text-4xl">✓</span>
                <span className="text-gold text-xs font-arabic">مكتمل</span>
              </>
            ) : (
              <>
                <span
                  className="text-gold text-xs font-arabic leading-tight"
                  dir="rtl"
                >
                  الهدف: {targetCount}
                </span>
                <span className="text-cream text-4xl font-bold leading-none font-arabic">
                  {remaining}
                </span>
                <span className="text-cream-dim text-xs font-arabic">متبقي</span>
              </>
            )}
          </div>

          {/* Shine overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 35% 25%, hsl(150 50% 40% / 0.12), transparent 60%)",
            }}
          />
        </button>
      </div>

      {/* Settings Button */}
      <button
        onClick={onSettings}
        className="flex flex-col items-center gap-1.5 group"
        title="الإعدادات"
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-surface border border-emerald-border flex items-center justify-center transition-all duration-200 group-hover:border-gold/50 group-hover:bg-emerald-mid group-active:scale-95">
          <Settings className="w-5 h-5 text-cream-dim group-hover:text-gold transition-colors" />
        </div>
        <span className="text-xs text-cream-dim group-hover:text-cream transition-colors">خيارات</span>
      </button>
    </div>
  );
};

export default CounterButton;
