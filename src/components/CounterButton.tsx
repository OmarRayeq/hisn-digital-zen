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

  // مانع الارتداد — لمنع النقر المزدوج العشوائي على الهواتف
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

  // معالجة أحداث اللمس فقط — لمنع تكرار onClick + onTouchStart
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      // منع السلوك الافتراضي (يمنع النقر المزدوج والتكبير)
      e.preventDefault();
      if (completed) return;

      // فحص مانع الارتداد
      const now = Date.now();
      if (now - lastTapTime.current < DEBOUNCE_MS) return;
      lastTapTime.current = now;

      // حساب موقع الموجة
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

  // معالجة النقر بالماوس (للأجهزة غير اللمسية)
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (completed) return;

      // فحص مانع الارتداد
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
    <div className="flex items-center justify-center gap-8 w-full">
      {/* زر إعادة التعيين */}
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

      {/* دائرة العداد الرئيسية */}
      <div className="relative flex items-center justify-center">
        {/* حلقة التقدم */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          width="160"
          height="160"
          viewBox="0 0 160 160"
        >
          <circle cx="80" cy="80" r="56" fill="none" stroke="hsl(150 25% 18%)" strokeWidth="4" />
          <circle
            cx="80" cy="80" r="56"
            fill="none"
            stroke="hsl(40 52% 55%)"
            strokeWidth="4"
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

        {/* الزر — يستخدم onTouchStart فقط على اللمس و onClick على الماوس */}
        <button
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          disabled={completed}
          className={`relative w-36 h-36 rounded-full overflow-hidden transition-all duration-150 select-none touch-manipulation
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

          {/* المحتوى */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0.5">
            {completed ? (
              <>
                <span className="text-4xl">✓</span>
                <span className="text-gold text-xs font-arabic">مكتمل</span>
              </>
            ) : (
              <>
                <span className="text-gold text-xs font-arabic leading-tight" dir="rtl">
                  الهدف: {targetCount}
                </span>
                <span className="text-cream text-4xl font-bold leading-none font-arabic">
                  {remaining}
                </span>
                <span className="text-cream-dim text-xs font-arabic">متبقي</span>
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

      {/* زر الإعدادات */}
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
