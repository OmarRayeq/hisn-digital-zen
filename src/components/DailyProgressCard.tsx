// ============================================================
// بطاقة التقدم اليومي — دائرة فاخمة
// ============================================================

import React from "react";
import { Flame } from "lucide-react";

interface DailyProgressCardProps {
    morningDone: boolean;
    eveningDone: boolean;
    streak: number;
}

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
    morningDone,
    eveningDone,
    streak,
}) => {
    const completedCount = (morningDone ? 1 : 0) + (eveningDone ? 1 : 0);
    const isFullyCompleted = morningDone && eveningDone;

    // SVG circle dimensions
    const size = 130;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Morning = right half (top to bottom), Evening = left half (bottom to top)
    const morningOffset = morningDone ? circumference * 0.5 : circumference;
    const eveningOffset = eveningDone ? circumference * 0.5 : circumference;

    return (
        <div className="card-stagger glass-card-premium rounded-3xl border border-emerald-border p-5">
            <div className="flex items-center gap-5">
                {/* Circle */}
                <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        className="-rotate-90"
                    >
                        {/* Track */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="hsl(150 28% 16%)"
                            strokeWidth={strokeWidth}
                        />
                        {/* Morning arc (right half — gold) */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="hsl(40 52% 55%)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={morningOffset}
                            className="transition-all duration-700 ease-out"
                            style={{
                                filter: morningDone
                                    ? "drop-shadow(0 0 6px hsl(40 52% 55% / 0.5))"
                                    : "none",
                            }}
                        />
                        {/* Evening arc (left half — blue) */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="hsl(220 60% 60%)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={eveningOffset}
                            transform={`rotate(180 ${size / 2} ${size / 2})`}
                            className="transition-all duration-700 ease-out"
                            style={{
                                filter: eveningDone
                                    ? "drop-shadow(0 0 6px hsl(220 60% 60% / 0.5))"
                                    : "none",
                            }}
                        />
                    </svg>

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {isFullyCompleted ? (
                            <div className="check-bounce">
                                <span className="text-gold text-3xl">✓</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-cream text-2xl font-bold font-arabic leading-none">
                                    {completedCount}
                                </span>
                                <span className="text-cream-dim/50 text-xs font-arabic">/2</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Right side: info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-cream text-base font-arabic font-bold mb-3 leading-snug">
                        وِرد اليوم
                    </h3>

                    {/* Morning badge */}
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${morningDone
                                    ? "bg-gold/15 text-gold"
                                    : "bg-emerald-surface text-cream-dim/30"
                                }`}
                        >
                            {morningDone ? "✓" : "○"}
                        </div>
                        <span
                            className={`text-sm font-arabic ${morningDone ? "text-cream" : "text-cream-dim/50"
                                }`}
                        >
                            ☀️ أذكار الصباح
                        </span>
                    </div>

                    {/* Evening badge */}
                    <div className="flex items-center gap-2 mb-3">
                        <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${eveningDone
                                    ? "bg-blue-500/15 text-blue-400"
                                    : "bg-emerald-surface text-cream-dim/30"
                                }`}
                        >
                            {eveningDone ? "✓" : "○"}
                        </div>
                        <span
                            className={`text-sm font-arabic ${eveningDone ? "text-cream" : "text-cream-dim/50"
                                }`}
                        >
                            🌙 أذكار المساء
                        </span>
                    </div>

                    {/* Streak */}
                    {streak > 0 ? (
                        <div className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-300 text-xs font-arabic font-bold">
                                {streak} {streak === 1 ? "يوم" : streak <= 10 ? "أيام" : "يوم"} متتالية
                            </span>
                        </div>
                    ) : (
                        <p className="text-cream-dim/30 text-xs font-arabic">
                            أكمل الصباح والمساء لبدء السلسلة 🔥
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyProgressCard;
