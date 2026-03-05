// ============================================================
// صفحة الإحصائيات — أسبوعي + شهري
// Weekly bars + Monthly heatmap + Totals
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, BookOpen, Target, Calendar } from "lucide-react";
import { useStats } from "@/hooks/useStats";

const WEEKDAYS = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

const Stats: React.FC = () => {
    const navigate = useNavigate();
    const {
        last7Days, last30Days,
        totalDaysActive, totalTasbeeh, totalAdhkar, totalCompletions, longestStreak,
    } = useStats();

    return (
        <div
            className="flex flex-col h-full overflow-hidden page-enter"
            style={{ background: "var(--gradient-hero)" }}
            dir="rtl"
        >
            {/* Header */}
            <header className="flex-none px-5 pt-8 pb-4 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-2xl glass-card-premium border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold transition-all"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
                <h1 className="text-gold text-2xl font-arabic font-bold">الإحصائيات</h1>
            </header>

            <main
                className="flex-1 overflow-y-auto px-4 pb-8"
                style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
            >
                <div className="max-w-lg mx-auto space-y-5">
                    {/* ── Summary Cards ── */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard icon={<Flame className="w-5 h-5 text-orange-400" />} label="أطول سلسلة" value={`${longestStreak} يوم`} />
                        <StatCard icon={<Target className="w-5 h-5 text-gold" />} label="إجمالي الختمات" value={String(totalCompletions)} />
                        <StatCard icon={<BookOpen className="w-5 h-5 text-emerald-400" />} label="أذكار قُرئت" value={String(totalAdhkar)} />
                        <StatCard icon={<Calendar className="w-5 h-5 text-blue-400" />} label="أيام نشطة" value={String(totalDaysActive)} />
                    </div>

                    {/* ── Tasbeeh Total ── */}
                    <div className="glass-card-premium rounded-2xl border border-emerald-border p-5 text-center">
                        <p className="text-cream-dim text-xs font-arabic mb-1">إجمالي التسبيح</p>
                        <p className="text-gold text-3xl font-bold font-arabic">{totalTasbeeh.toLocaleString("ar-SA")}</p>
                    </div>

                    {/* ── Weekly Bar Chart ── */}
                    <div className="glass-card-premium rounded-2xl border border-emerald-border p-5">
                        <h3 className="text-cream text-sm font-arabic font-bold mb-4">آخر ٧ أيام</h3>
                        <div className="flex items-end justify-between gap-1.5" style={{ height: 100 }}>
                            {last7Days.map((day) => {
                                const d = new Date(day.date);
                                const dayName = WEEKDAYS[d.getDay()];
                                const score = (day.morningDone ? 1 : 0) + (day.eveningDone ? 1 : 0);
                                const height = score === 0 ? 8 : score === 1 ? 50 : 100;
                                return (
                                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-500"
                                            style={{
                                                height: `${height}%`,
                                                background: score === 2
                                                    ? "linear-gradient(to top, hsl(40 52% 45%), hsl(40 70% 60%))"
                                                    : score === 1
                                                        ? "linear-gradient(to top, hsl(150 40% 25%), hsl(150 40% 35%))"
                                                        : "hsl(150 25% 15%)",
                                                boxShadow: score === 2 ? "0 0 12px hsl(40 52% 55% / 0.3)" : "none",
                                            }}
                                        />
                                        <span className="text-cream-dim/40 text-[9px] font-arabic">{dayName}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-4 mt-3 justify-center">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(40 52% 55%)" }} />
                                <span className="text-cream-dim/40 text-[10px] font-arabic">مكتمل</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(150 40% 30%)" }} />
                                <span className="text-cream-dim/40 text-[10px] font-arabic">جزئي</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Monthly Heatmap ── */}
                    <div className="glass-card-premium rounded-2xl border border-emerald-border p-5">
                        <h3 className="text-cream text-sm font-arabic font-bold mb-4">آخر ٣٠ يوم</h3>
                        <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
                            {last30Days.map((day) => {
                                const score = (day.morningDone ? 1 : 0) + (day.eveningDone ? 1 : 0);
                                const d = new Date(day.date);
                                return (
                                    <div
                                        key={day.date}
                                        className="aspect-square rounded-md transition-colors"
                                        style={{
                                            background: score === 2
                                                ? "hsl(40 52% 50%)"
                                                : score === 1
                                                    ? "hsl(150 35% 25%)"
                                                    : "hsl(150 20% 12%)",
                                            boxShadow: score === 2 ? "0 0 6px hsl(40 52% 55% / 0.3)" : "none",
                                        }}
                                        title={`${d.getDate()}/${d.getMonth() + 1} — ${score}/2`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Mini stat card
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="glass-card-premium rounded-2xl border border-emerald-border p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(150 30% 12%)" }}>
            {icon}
        </div>
        <div>
            <p className="text-cream-dim/50 text-[10px] font-arabic">{label}</p>
            <p className="text-cream text-lg font-arabic font-bold leading-tight">{value}</p>
        </div>
    </div>
);

export default Stats;
