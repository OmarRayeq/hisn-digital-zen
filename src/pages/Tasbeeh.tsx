// ============================================================
// صفحة المسبحة — عداد تسبيح مستقل
// ============================================================

import React, { useState, useCallback, useEffect } from "react";
import { RotateCcw } from "lucide-react";

interface Preset {
    id: string;
    text: string;
    target: number;
}

const PRESETS: Preset[] = [
    { id: "subhanallah", text: "سبحان الله", target: 33 },
    { id: "alhamdulillah", text: "الحمد لله", target: 33 },
    { id: "allahuakbar", text: "الله أكبر", target: 34 },
    { id: "lailaha", text: "لا إله إلا الله", target: 100 },
    { id: "hawqala", text: "لا حول ولا قوة إلا بالله", target: 100 },
    { id: "istighfar", text: "أستغفر الله", target: 100 },
    { id: "salawat", text: "اللهم صلِّ على محمد", target: 100 },
];

const STORAGE_KEY = "tasbeeh-state";

function loadState() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        return {
            activeId: data.activeId || "subhanallah",
            count: data.count || 0,
            totalToday: data.totalToday || 0,
            lastDate: data.lastDate || "",
        };
    } catch {
        return { activeId: "subhanallah", count: 0, totalToday: 0, lastDate: "" };
    }
}

function saveState(state: { activeId: string; count: number; totalToday: number; lastDate: string }) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const Tasbeeh: React.FC = () => {
    const [state, setState] = useState(loadState);
    const activePreset = PRESETS.find((p) => p.id === state.activeId) || PRESETS[0];
    const remaining = Math.max(0, activePreset.target - state.count);
    const progress = activePreset.target > 0 ? (state.count / activePreset.target) * 100 : 0;
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

    const today = new Date().toISOString().slice(0, 10);

    // Reset today counter if day changed
    useEffect(() => {
        if (state.lastDate !== today) {
            setState((prev) => ({ ...prev, totalToday: 0, lastDate: today }));
        }
    }, [today, state.lastDate]);

    // Save state on change
    useEffect(() => {
        saveState(state);
    }, [state]);

    const handleTap = useCallback(() => {
        if (remaining <= 0) return;
        try { navigator.vibrate?.(8); } catch { }
        setState((prev) => ({
            ...prev,
            count: prev.count + 1,
            totalToday: prev.totalToday + 1,
            lastDate: today,
        }));
    }, [remaining, today]);

    const handleReset = useCallback(() => {
        setState((prev) => ({ ...prev, count: 0 }));
    }, []);

    const handlePresetChange = useCallback((id: string) => {
        setState((prev) => ({ ...prev, activeId: id, count: 0 }));
    }, []);

    // Volume button support
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "VolumeDown" || e.key === "AudioVolumeDown") {
                e.preventDefault();
                handleTap();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [handleTap]);

    return (
        <div
            className="flex flex-col h-full overflow-hidden page-enter"
            style={{ background: "var(--gradient-hero)" }}
            dir="rtl"
        >
            {/* Header */}
            <header className="flex-none px-5 pt-8 pb-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-gold text-2xl font-arabic font-bold">المسبحة</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-cream-dim text-xs font-arabic">
                            اليوم: {state.totalToday} تسبيحة
                        </span>
                    </div>
                </div>
            </header>

            {/* Counter Area */}
            <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
                {/* Dhikr text */}
                <p className="text-cream text-2xl font-arabic font-bold text-center leading-relaxed">
                    {activePreset.text}
                </p>

                {/* Circular counter */}
                <div className="relative flex items-center justify-center">
                    {/* SVG Ring */}
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                    >
                        <circle
                            cx="100" cy="100" r="70"
                            className="progress-ring-track"
                            strokeWidth="5"
                        />
                        <circle
                            cx="100" cy="100" r="70"
                            className="progress-ring-fill"
                            stroke="hsl(40 52% 55%)"
                            strokeWidth="5"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            style={{
                                filter: remaining === 0
                                    ? "drop-shadow(0 0 8px hsl(40 52% 55% / 0.6))"
                                    : "drop-shadow(0 0 3px hsl(40 52% 55% / 0.3))",
                            }}
                        />
                    </svg>

                    {/* Button */}
                    <button
                        onClick={handleTap}
                        disabled={remaining <= 0}
                        className="relative w-44 h-44 rounded-full flex items-center justify-center select-none touch-manipulation transition-transform duration-100 active:scale-95"
                        style={{
                            background: remaining <= 0
                                ? "radial-gradient(circle at 40% 35%, hsl(40 50% 18%), hsl(150 40% 8%))"
                                : "radial-gradient(circle at 40% 35%, hsl(150 38% 14%), hsl(150 50% 6%))",
                            boxShadow: remaining <= 0
                                ? "0 0 30px hsl(40 52% 55% / 0.4), inset 0 1px 0 hsl(40 52% 70% / 0.15)"
                                : "0 0 20px hsl(40 52% 55% / 0.15), inset 0 1px 0 hsl(150 40% 30% / 0.15), 0 6px 20px hsl(0 0% 0% / 0.4)",
                        }}
                    >
                        {remaining <= 0 ? (
                            <div className="flex flex-col items-center gap-1 check-bounce">
                                <span className="text-gold text-4xl">✓</span>
                                <span className="text-gold text-sm font-arabic">تم</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-cream text-5xl font-bold font-arabic leading-none">
                                    {state.count}
                                </span>
                                <span className="text-cream-dim text-xs font-arabic">/ {activePreset.target}</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Reset button */}
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-card border border-emerald-border text-cream-dim hover:text-gold transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm font-arabic">إعادة</span>
                </button>
            </main>

            {/* Preset selector */}
            <div className="flex-none px-4 pb-4">
                <div
                    className="overflow-x-auto flex gap-2 pb-2"
                    style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" } as React.CSSProperties}
                >
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetChange(preset.id)}
                            className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200 ${preset.id === state.activeId
                                ? "bg-gold/15 border-gold/40 text-gold"
                                : "glass-card border-emerald-border text-cream-dim"
                                }`}
                        >
                            {preset.text}
                            <span className="text-[10px] opacity-60 mr-1">({preset.target})</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasbeeh;
