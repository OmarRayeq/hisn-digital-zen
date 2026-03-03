// ============================================================
// صفحة المسبحة — Premium Tasbeeh Experience
// Ultra-clean minimal design with elegant animations
// ============================================================

import React, { useState, useCallback, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";

/* ── Types ── */
interface Preset {
    id: string;
    text: string;
    target: number;
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
    "hsl(40 70% 65%)",
    "hsl(40 52% 55%)",
    "hsl(38 80% 72%)",
    "hsl(45 60% 50%)",
    "hsl(35 65% 60%)",
    "hsl(150 40% 45%)",
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
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [showCompletion, setShowCompletion] = useState(false);
    const [textKey, setTextKey] = useState(0);
    const [countKey, setCountKey] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const activePreset = PRESETS.find((p) => p.id === state.activeId) || PRESETS[0];
    const remaining = Math.max(0, activePreset.target - state.count);
    const progress = activePreset.target > 0 ? (state.count / activePreset.target) * 100 : 0;

    // SVG ring
    const ringSize = 240;
    const ringRadius = 105;
    const ringStroke = 4;
    const fillStroke = 5;
    const circumference = 2 * Math.PI * ringRadius;
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
        setTimeout(() => setShowCompletion(false), 2000);
    }, []);

    // Handle tap
    const handleTap = useCallback(() => {
        if (remaining <= 0) return;

        // Progressive haptic
        const progressRatio = state.count / activePreset.target;
        const vibrationMs = Math.round(5 + progressRatio * 20);
        try { navigator.vibrate?.(vibrationMs); } catch { }

        // Trigger count bounce
        setCountKey((k) => k + 1);

        // Update count
        setState((prev) => {
            const newCount = prev.count + 1;
            const newRemaining = activePreset.target - newCount;

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
        setTextKey((k) => k + 1);
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

    const todayGoal = 100;
    const todayProgress = Math.min((state.totalToday / todayGoal) * 100, 100);

    return (
        <div className="tasbeeh-page" dir="rtl">
            {/* ── Background layers ── */}
            <div className="tasbeeh-bg">
                <div className="tasbeeh-bg-glow" />
            </div>

            {/* ── Header ── */}
            <header className="tasbeeh-header">
                <h1 className="tasbeeh-title">المسبحة</h1>
                <div className="tasbeeh-today">
                    <span className="tasbeeh-today-count">{state.totalToday}</span>
                    <span className="tasbeeh-today-label">اليوم</span>
                    <div className="tasbeeh-today-bar">
                        <div className="tasbeeh-today-fill" style={{ width: `${todayProgress}%` }} />
                    </div>
                </div>
            </header>

            {/* ── Main content ── */}
            <main className="tasbeeh-main">
                {/* Dhikr text */}
                <p key={textKey} className="tasbeeh-dhikr text-fade-in">
                    {activePreset.text}
                </p>

                {/* ── Counter ── */}
                <div className="tasbeeh-counter-wrap">
                    {/* SVG Progress Ring */}
                    <svg
                        className="tasbeeh-ring"
                        width={ringSize}
                        height={ringSize}
                        viewBox={`0 0 ${ringSize} ${ringSize}`}
                    >
                        {/* Track */}
                        <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={ringRadius}
                            fill="none"
                            stroke="hsl(150 25% 15%)"
                            strokeWidth={ringStroke}
                        />
                        {/* Progress fill */}
                        <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={ringRadius}
                            fill="none"
                            className="tasbeeh-ring-fill"
                            stroke="url(#goldGradient)"
                            strokeWidth={fillStroke}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                        <defs>
                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="hsl(40 70% 65%)" />
                                <stop offset="50%" stopColor="hsl(40 52% 55%)" />
                                <stop offset="100%" stopColor="hsl(38 60% 48%)" />
                            </linearGradient>
                        </defs>
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

                    {/* Main tap button */}
                    <button
                        ref={buttonRef}
                        onClick={handleTap}
                        disabled={remaining <= 0}
                        className={`tasbeeh-btn ${showCompletion ? "tasbeeh-btn-done" : ""}`}
                    >
                        {remaining <= 0 ? (
                            <div className="tasbeeh-complete check-bounce">
                                <span className="tasbeeh-complete-icon">✓</span>
                                <span className="tasbeeh-complete-text">ما شاء الله</span>
                            </div>
                        ) : (
                            <div className="tasbeeh-count-inner">
                                <span key={countKey} className="tasbeeh-count count-pop">
                                    {state.count}
                                </span>
                                <span className="tasbeeh-target">/ {activePreset.target}</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Remaining text */}
                {remaining > 0 && (
                    <p className="tasbeeh-remaining">
                        باقي {remaining} {remaining === 1 ? "مرة" : "مرات"}
                    </p>
                )}

                {/* Reset */}
                <button onClick={handleReset} className="tasbeeh-reset">
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة</span>
                </button>
            </main>

            {/* ── Presets ── */}
            <nav className="tasbeeh-presets">
                {PRESETS.map((preset) => {
                    const isActive = preset.id === state.activeId;
                    return (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetChange(preset.id)}
                            className={`tasbeeh-chip ${isActive ? "tasbeeh-chip-active" : ""}`}
                        >
                            {preset.text}
                            <span className="tasbeeh-chip-num">({preset.target})</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Tasbeeh;
