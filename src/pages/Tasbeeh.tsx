// ============================================================
// صفحة المسبحة — Premium Tasbeeh Experience
// Ambient glow + ripple + confetti + progressive haptics
// ============================================================

import React, { useState, useCallback, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

/* ── Types ── */
interface Preset {
    id: string;
    text: string;
    target: number;
}

interface RippleItem {
    id: number;
    x: number;
    y: number;
}

interface ConfettiPiece {
    id: number;
    color: string;
    tx: number;
    ty: number;
    rot: number;
}

/* ── Data ── */
const PRESETS: Preset[] = [
    { id: "subhanallah", text: "سبحان الله", target: 33 },
    { id: "alhamdulillah", text: "الحمد لله", target: 33 },
    { id: "allahuakbar", text: "الله أكبر", target: 34 },
    { id: "lailaha", text: "لا إله إلا الله", target: 100 },
    { id: "hawqala", text: "لا حول ولا قوة إلا بالله", target: 100 },
    { id: "istighfar", text: "أستغفر الله", target: 100 },
    { id: "salawat", text: "اللهم صلِّ على محمد", target: 100 },
];

const CONFETTI_COLORS = [
    "hsl(40 70% 65%)", // gold
    "hsl(40 52% 55%)", // warm gold
    "hsl(38 80% 72%)", // light gold
    "hsl(45 60% 50%)", // amber
    "hsl(35 65% 60%)", // honey
    "hsl(150 40% 45%)", // emerald accent
];

const CONFETTI_COUNT = 28;
const STORAGE_KEY = "tasbeeh-state";

/* ── State persistence ── */
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

/* ── Component ── */
const Tasbeeh: React.FC = () => {
    const [state, setState] = useState(loadState);
    const [ripples, setRipples] = useState<RippleItem[]>([]);
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [showCompletion, setShowCompletion] = useState(false);
    const [textKey, setTextKey] = useState(0);
    const [countKey, setCountKey] = useState(0); // for count bounce animation
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleIdRef = useRef(0);

    const activePreset = PRESETS.find((p) => p.id === state.activeId) || PRESETS[0];
    const remaining = Math.max(0, activePreset.target - state.count);
    const progress = activePreset.target > 0 ? (state.count / activePreset.target) * 100 : 0;

    // SVG ring dimensions — larger for premium feel
    const ringRadius = 90;
    const ringSize = 260;
    const circumference = 2 * Math.PI * ringRadius;
    const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;
    const progressPercent = Math.round(Math.min(progress, 100));

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

    // Spawn confetti on completion
    const spawnConfetti = useCallback(() => {
        const pieces: ConfettiPiece[] = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
            const angle = (i / CONFETTI_COUNT) * 360;
            const dist = 60 + Math.random() * 100;
            return {
                id: i,
                color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                tx: Math.cos((angle * Math.PI) / 180) * dist,
                ty: Math.sin((angle * Math.PI) / 180) * dist - 40,
                rot: Math.random() * 720 - 360,
            };
        });
        setConfetti(pieces);
        setShowCompletion(true);
        setTimeout(() => setConfetti([]), 1200);
        setTimeout(() => setShowCompletion(false), 1500);
    }, []);

    // Handle tap with ripple + haptics
    const handleTap = useCallback(() => {
        if (remaining <= 0) return;

        // Progressive haptic: stronger as you approach target
        const progressRatio = state.count / activePreset.target;
        const vibrationMs = Math.round(5 + progressRatio * 20);
        try { navigator.vibrate?.(vibrationMs); } catch { }

        // Spawn golden ripple
        const id = ++rippleIdRef.current;
        setRipples((prev) => [...prev, { id, x: 50, y: 50 }]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 650);

        // Trigger count bounce
        setCountKey((k) => k + 1);

        // Update count
        setState((prev) => {
            const newCount = prev.count + 1;
            const newRemaining = activePreset.target - newCount;

            // Fire confetti on completion
            if (newRemaining === 0) {
                setTimeout(() => spawnConfetti(), 50);
                try { navigator.vibrate?.([30, 50, 30, 50, 60]); } catch { }
            }

            return {
                ...prev,
                count: newCount,
                totalToday: prev.totalToday + 1,
                lastDate: today,
            };
        });
    }, [remaining, state.count, activePreset.target, today, spawnConfetti]);

    const handleReset = useCallback(() => {
        setState((prev) => ({ ...prev, count: 0 }));
        setShowCompletion(false);
    }, []);

    const handlePresetChange = useCallback((id: string) => {
        setState((prev) => ({ ...prev, activeId: id, count: 0 }));
        setTextKey((k) => k + 1); // trigger text fade animation
        setShowCompletion(false);
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

    // Today target (rough goal)
    const todayGoal = 100;
    const todayProgress = Math.min((state.totalToday / todayGoal) * 100, 100);

    return (
        <div
            className="flex flex-col h-full overflow-hidden page-enter"
            style={{ background: "var(--gradient-hero)" }}
            dir="rtl"
        >
            {/* ── Ambient Glow — soft radial light behind counter ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="tasbeeh-ambient-glow" />
                <div className="tasbeeh-ambient-glow-secondary" />
            </div>

            {/* ── Header ── */}
            <header className="flex-none px-5 pt-8 pb-3 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-gold text-2xl font-arabic font-bold" style={{
                            textShadow: "0 0 20px hsl(40 52% 55% / 0.3)",
                        }}>المسبحة</h1>
                        <p className="text-cream-dim/40 text-[10px] font-arabic mt-0.5">سبّح واذكر الله</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-cream-dim text-xs font-arabic">
                            🕐 اليوم: <span className="text-gold font-bold">{state.totalToday}</span> تسبيحة
                        </span>
                        <div className="today-stats-bar w-24">
                            <div
                                className="today-stats-fill"
                                style={{ width: `${todayProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
                {/* Golden separator line */}
                <div className="mt-3 h-px w-full" style={{
                    background: "linear-gradient(to left, transparent, hsl(40 52% 55% / 0.2) 30%, hsl(40 52% 55% / 0.3) 50%, hsl(40 52% 55% / 0.2) 70%, transparent)"
                }} />
            </header>

            {/* ── Counter Area ── */}
            <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 relative z-10">
                {/* Dhikr text with fade animation */}
                <p
                    key={textKey}
                    className="text-cream text-2xl font-arabic font-bold text-center leading-relaxed text-fade-in"
                    style={{ textShadow: "0 2px 16px hsl(40 52% 55% / 0.15), 0 1px 4px hsl(0 0% 0% / 0.3)" }}
                >
                    {activePreset.text}
                </p>

                {/* Circular counter with decorative bezel + glow ring */}
                <div className={`relative flex items-center justify-center ${showCompletion ? "completion-flash" : ""}`}>
                    {/* Decorative outer bezel */}
                    <div className="tasbeeh-bezel" />

                    {/* SVG Ring */}
                    <svg
                        className={`absolute -rotate-90 ${remaining > 0 ? "ring-glow-active" : ""}`}
                        width={ringSize}
                        height={ringSize}
                        viewBox={`0 0 ${ringSize} ${ringSize}`}
                    >
                        {/* Subtle tick marks */}
                        {Array.from({ length: 60 }, (_, i) => {
                            const angle = (i / 60) * 360;
                            const rad = (angle * Math.PI) / 180;
                            const outerR = ringRadius + 18;
                            const innerR = i % 5 === 0 ? ringRadius + 12 : ringRadius + 15;
                            const cx = ringSize / 2;
                            const cy = ringSize / 2;
                            return (
                                <line
                                    key={i}
                                    x1={cx + Math.cos(rad) * innerR}
                                    y1={cy + Math.sin(rad) * innerR}
                                    x2={cx + Math.cos(rad) * outerR}
                                    y2={cy + Math.sin(rad) * outerR}
                                    stroke={i % 5 === 0 ? "hsl(40 52% 55% / 0.25)" : "hsl(150 28% 22% / 0.3)"}
                                    strokeWidth={i % 5 === 0 ? 1.5 : 0.5}
                                    strokeLinecap="round"
                                />
                            );
                        })}
                        {/* Track */}
                        <circle
                            cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
                            className="progress-ring-track"
                            strokeWidth="5"
                        />
                        {/* Fill */}
                        <circle
                            cx={ringSize / 2} cy={ringSize / 2} r={ringRadius}
                            className="progress-ring-fill"
                            stroke={remaining <= 0 ? "hsl(40 70% 65%)" : "hsl(40 52% 55%)"}
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            style={{
                                filter: remaining === 0
                                    ? "drop-shadow(0 0 14px hsl(40 52% 55% / 0.8))"
                                    : "drop-shadow(0 0 6px hsl(40 52% 55% / 0.4))",
                            }}
                        />
                        {/* Glowing dot at progress head */}
                        {remaining > 0 && progress > 0 && (() => {
                            const angle = ((progress / 100) * 360 - 90) * (Math.PI / 180);
                            const dotX = ringSize / 2 + Math.cos(angle) * ringRadius;
                            const dotY = ringSize / 2 + Math.sin(angle) * ringRadius;
                            return (
                                <circle
                                    cx={dotX} cy={dotY} r="4"
                                    fill="hsl(40 70% 65%)"
                                    style={{ filter: "drop-shadow(0 0 6px hsl(40 52% 55% / 0.8))" }}
                                />
                            );
                        })()}
                    </svg>

                    {/* Confetti pieces */}
                    {confetti.map((piece) => (
                        <div
                            key={piece.id}
                            className="confetti-piece"
                            style={{
                                "--tx": `${piece.tx}px`,
                                "--ty": `${piece.ty}px`,
                                "--rot": `${piece.rot}deg`,
                                background: piece.color,
                                boxShadow: `0 0 6px ${piece.color}`,
                            } as React.CSSProperties}
                        />
                    ))}

                    {/* Ripple effects */}
                    {ripples.map((ripple) => (
                        <div
                            key={ripple.id}
                            className="golden-ripple"
                            style={{
                                left: `${ripple.x}%`,
                                top: `${ripple.y}%`,
                            }}
                        />
                    ))}

                    {/* Main tap button */}
                    <button
                        ref={buttonRef}
                        onClick={handleTap}
                        disabled={remaining <= 0}
                        className="tasbeeh-button relative rounded-full flex items-center justify-center select-none touch-manipulation"
                        style={{
                            width: "200px",
                            height: "200px",
                            background: remaining <= 0
                                ? "radial-gradient(circle at 40% 35%, hsl(40 45% 20%), hsl(40 30% 12%), hsl(150 40% 8%))"
                                : "radial-gradient(circle at 40% 35%, hsl(150 35% 16%), hsl(150 40% 10%), hsl(150 50% 6%))",
                            boxShadow: remaining <= 0
                                ? "0 0 50px hsl(40 52% 55% / 0.4), inset 0 2px 0 hsl(40 52% 70% / 0.15), inset 0 -2px 4px hsl(0 0% 0% / 0.3), 0 0 100px hsl(40 52% 55% / 0.1)"
                                : "0 0 30px hsl(40 52% 55% / 0.1), inset 0 2px 0 hsl(150 40% 30% / 0.2), inset 0 -2px 4px hsl(0 0% 0% / 0.3), 0 10px 30px hsl(0 0% 0% / 0.5)",
                            border: remaining <= 0
                                ? "1px solid hsl(40 52% 55% / 0.2)"
                                : "1px solid hsl(150 30% 22% / 0.5)",
                        }}
                    >
                        {remaining <= 0 ? (
                            <div className="flex flex-col items-center gap-1 check-bounce">
                                <span className="text-gold text-5xl" style={{
                                    textShadow: "0 0 25px hsl(40 52% 55% / 0.6)",
                                }}>✓</span>
                                <span className="text-gold text-base font-arabic font-bold" style={{
                                    textShadow: "0 0 10px hsl(40 52% 55% / 0.3)",
                                }}>ما شاء الله</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-0.5">
                                <span
                                    key={countKey}
                                    className="text-cream font-bold font-arabic leading-none count-pop"
                                    style={{
                                        fontSize: "3.5rem",
                                        textShadow: "0 0 20px hsl(40 52% 55% / 0.2), 0 2px 8px hsl(0 0% 0% / 0.4)",
                                    }}
                                >
                                    {state.count}
                                </span>
                                <span className="text-cream-dim/60 text-xs font-arabic">/ {activePreset.target}</span>
                                {progressPercent > 0 && (
                                    <span className="text-gold/50 text-[10px] mt-1 font-bold">{progressPercent}%</span>
                                )}
                            </div>
                        )}
                    </button>
                </div>

                {/* Remaining indicator */}
                {remaining > 0 && (
                    <p className="text-cream-dim/40 text-xs font-arabic">
                        باقي {remaining} {remaining === 1 ? "مرة" : "مرات"}
                    </p>
                )}

                {/* Reset button */}
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                        background: "hsl(150 38% 11% / 0.7)",
                        borderColor: "hsl(150 28% 22% / 0.5)",
                        color: "hsl(var(--cream-dim))",
                    }}
                >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm font-arabic">إعادة</span>
                </button>
            </main>

            {/* ── Preset selector ── */}
            <div className="flex-none px-4 pb-4 relative z-10">
                <div
                    className="overflow-x-auto flex gap-2 pb-2"
                    style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" } as React.CSSProperties}
                >
                    {PRESETS.map((preset) => {
                        const isActive = preset.id === state.activeId;
                        return (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetChange(preset.id)}
                                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-arabic border transition-all duration-200 ${isActive
                                    ? "preset-chip-active"
                                    : "glass-card border-emerald-border text-cream-dim hover:border-gold/20"
                                    }`}
                            >
                                {preset.text}
                                <span className="text-[10px] opacity-60 mr-1">({preset.target})</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Tasbeeh;
