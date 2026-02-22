// ============================================================
// زر العداد الدائري — يظهر "تم" عند الاكتمال
// مع دعم اللمس ومنع النقر المزدوج
// ============================================================

import React, { useState, useCallback, useRef } from "react";
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

  // مانع الارتداد — لمنع النقر المزدوج العشوائي
  const lastTapTime = useRef(0);
  const DEBOUNCE_MS = 200;

  const progress = targetCount > 0 ? ((targetCount - remaining) / targetCount) * 100 : 0;
  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // إضافة تأثير الموجة عند النقر
  const addRipple = useCallback((x: number, y: number) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }, []);

  // معالجة أحداث اللمس
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (completed) return;

      const now = Date.now();
      if (now - lastTapTime.current < DEBOUNCE_MS) return;
      lastTapTime.current = now;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      addRipple(x, y);

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);

      onTap();
    },
    [completed, onTap, addRipple]
  );

  // معالجة النقر بالماوس
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (completed) return;

      const now = Date.now();
      if (now - lastTapTime.current < DEBOUNCE_MS) return;
      lastTapTime.current = now;

      const rect = e.currentTarget.getBoundingClientRect();
      addRipple(e.clientX - rect.left, e.clientY - rect.top);

      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);

      onTap();
    },
    [completed, onTap, addRipple]
  );

  return (
    <div className="flex items-center justify-center gap-6 w-full">
      {/* زر الإعدادات — على اليمين في RTL */}
      <button
        onClick={onSettings}
        className="flex flex-col items-center gap-1.5 group"
        title="الإعدادات"
      >
        <div className="w-11 h-11 rounded-2xl bg-emerald-surface border border-emerald-border flex items-center justify-center transition-all duration-200 group-hover:border-gold/50 group-hover:bg-emerald-mid group-active:scale-95">
          <Settings className="w-4.5 h-4.5 text-cream-dim group-hover:text-gold transition-colors" />
        </div>
        <span className="text-[10px] text-cream-dim group-hover:text-cream transition-colors font-arabic">خيارات</span>
      </button>

      {/* دائرة العداد الرئيسية */}
      <div className="relative flex items-center justify-center">
        {/* حلقة التقدم */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          width="140"
          height="140"
          viewBox="0 0 140 140"
        >
          <circle cx="70" cy="70" r="56" fill="none" stroke="hsl(150 25% 18%)" strokeWidth="3.5" />
          <circle
            cx="70" cy="70" r="56"
            fill="none"
            stroke="hsl(40 52% 55%)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
            style={{
              filter: completed
                ? "drop-shadow(0 0 8px hsl(40 52% 55% / 0.8))"
                : "drop-shadow(0 0 4px hsl(40 52% 55% / 0.4))",
            }}
          />
        </svg>

        {/* زر العداد */}
        <button
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          disabled={completed}
          className={`relative w-[130px] h-[130px] rounded-full overflow-hidden transition-all duration-150 select-none touch-manipulation
            ${isPressed ? "scale-95" : "scale-100"}
            ${completed ? "cursor-default" : "cursor-pointer active:scale-95"}
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
          {/* تأثيرات الموجة */}
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

          {/* المحتوى — "تم" عند الاكتمال */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0.5">
            {completed ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-gold text-3xl font-bold font-arabic">تم</span>
                <span className="text-gold/60 text-[10px] font-arabic">✓</span>
              </div>
            ) : (
              <>
                <span className="text-gold text-[10px] font-arabic leading-tight" dir="rtl">
                  الهدف: {targetCount}
                </span>
                <span className="text-cream text-3xl font-bold leading-none font-arabic">
                  {remaining}
                </span>
                <span className="text-cream-dim text-[10px] font-arabic">متبقي</span>
              </>
            )}
          </div>

          {/* طبقة اللمعان */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 35% 25%, hsl(150 50% 40% / 0.12), transparent 60%)",
            }}
          />
        </button>
      </div>

      {/* زر إعادة التعيين — على اليسار في RTL */}
      <button
        onClick={onReset}
        className="flex flex-col items-center gap-1.5 group"
        title="إعادة تعيين"
      >
        <div className="w-11 h-11 rounded-2xl bg-emerald-surface border border-emerald-border flex items-center justify-center transition-all duration-200 group-hover:border-gold/50 group-hover:bg-emerald-mid group-active:scale-95">
          <RotateCcw className="w-4.5 h-4.5 text-cream-dim group-hover:text-gold transition-colors" />
        </div>
        <span className="text-[10px] text-cream-dim group-hover:text-cream transition-colors font-arabic">إعادة</span>
      </button>
    </div>
  );
};

export default CounterButton;
