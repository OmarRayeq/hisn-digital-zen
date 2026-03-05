// ============================================================
// عداد الإنجاز — إجمالي العبادات مدى الحياة (محلي)
// Lifetime local counter for all adhkar/tasbeeh
// ============================================================

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const COUNTER_KEY = "lifetime-counter";

interface LifetimeStats {
    totalAdhkar: number;
    totalTasbeeh: number;
}

function loadLifetime(): LifetimeStats {
    try {
        const data = JSON.parse(localStorage.getItem(COUNTER_KEY) || "null");
        return data || { totalAdhkar: 0, totalTasbeeh: 0 };
    } catch { return { totalAdhkar: 0, totalTasbeeh: 0 }; }
}

const CommunityCounter: React.FC = () => {
    const [stats, setStats] = useState<LifetimeStats>(loadLifetime);
    const [animatedTotal, setAnimatedTotal] = useState(0);

    const total = stats.totalAdhkar + stats.totalTasbeeh;

    // Animate count up on mount
    useEffect(() => {
        if (total === 0) { setAnimatedTotal(0); return; }
        const duration = 1200;
        const startTime = Date.now();
        const startVal = 0;

        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedTotal(Math.round(startVal + (total - startVal) * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [total]);

    // Listen for storage changes (from other hooks incrementing)
    useEffect(() => {
        const handler = () => setStats(loadLifetime());
        window.addEventListener("storage", handler);
        // Also poll periodically since same-tab storage events don't fire
        const interval = setInterval(() => setStats(loadLifetime()), 5000);
        return () => { window.removeEventListener("storage", handler); clearInterval(interval); };
    }, []);

    if (total === 0) return null;

    return (
        <div className="card-stagger glass-card-premium rounded-2xl border border-emerald-border p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-cream-dim/60 text-xs font-arabic">إجمالي عباداتك</span>
                <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <p className="text-gold text-2xl font-bold font-arabic counting-number">
                {animatedTotal.toLocaleString("ar-SA")}
            </p>
            <p className="text-cream-dim/30 text-[10px] font-arabic mt-1">
                ذكر وتسبيحة
            </p>
        </div>
    );
};

// Helper to increment the counter from other hooks
export function incrementLifetimeCounter(type: "adhkar" | "tasbeeh", count: number = 1) {
    const stats = loadLifetime();
    if (type === "adhkar") stats.totalAdhkar += count;
    else stats.totalTasbeeh += count;
    localStorage.setItem(COUNTER_KEY, JSON.stringify(stats));
}

export default CommunityCounter;
