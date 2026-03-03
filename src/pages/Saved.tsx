// ============================================================
// صفحة المحفوظات — مفضلات + Streak + سجل
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Flame, Clock, Trash2 } from "lucide-react";
import { useFavorites, useStreak, useHistory } from "@/hooks/useFavorites";

const Saved: React.FC = () => {
    const navigate = useNavigate();
    const { favorites, removeFavorite } = useFavorites();
    const { streak, totalCompletions } = useStreak();
    const { history } = useHistory();

    return (
        <div
            className="flex flex-col h-full overflow-hidden page-enter"
            style={{ background: "var(--gradient-hero)" }}
            dir="rtl"
        >
            {/* Header */}
            <header className="flex-none px-5 pt-8 pb-4">
                <h1 className="text-gold text-2xl font-arabic font-bold">المحفوظات</h1>
            </header>

            {/* Content */}
            <main
                className="flex-1 overflow-y-auto px-4 pb-4"
                style={{ touchAction: "pan-y" } as React.CSSProperties}
            >
                <div className="max-w-lg mx-auto space-y-5">
                    {/* Streak Card */}
                    <div
                        className="glass-card rounded-2xl border border-emerald-border p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-orange-900/30 flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-cream text-lg font-arabic font-bold leading-tight">
                                        {streak > 0 ? `${streak} ${streak === 1 ? "يوم" : "أيام"} متتالية` : "ابدأ سلسلتك!"}
                                    </p>
                                    <p className="text-cream-dim/50 text-xs font-arabic mt-0.5">
                                        {totalCompletions > 0
                                            ? `${totalCompletions} ختمة إجمالية`
                                            : "اختم أي قسم أذكار لبدء العد"}
                                    </p>
                                </div>
                            </div>
                            {streak > 0 && (
                                <span className="text-3xl">🔥</span>
                            )}
                        </div>
                    </div>

                    {/* Favorites Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-gold" />
                            <h2 className="text-cream text-base font-arabic font-bold">
                                الأدعية المفضلة
                            </h2>
                            <span className="text-cream-dim/40 text-xs font-arabic">
                                ({favorites.length})
                            </span>
                        </div>

                        {favorites.length === 0 ? (
                            <div className="glass-card rounded-2xl border border-emerald-border p-6 text-center">
                                <Star className="w-8 h-8 text-cream-dim/20 mx-auto mb-3" />
                                <p className="text-cream-dim/50 text-sm font-arabic leading-relaxed">
                                    لم تضف أي دعاء للمفضلة بعد
                                </p>
                                <p className="text-cream-dim/30 text-xs font-arabic mt-1">
                                    اضغط ⭐ على أي ذكر أثناء القراءة لحفظه هنا
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {favorites.map((fav) => (
                                    <div
                                        key={fav.id}
                                        className="glass-card rounded-2xl border border-emerald-border p-4 flex items-start gap-3"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-cream text-sm font-arabic leading-loose line-clamp-2">
                                                {fav.text}
                                            </p>
                                            <p className="text-cream-dim/40 text-xs font-arabic mt-1">
                                                {fav.category}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeFavorite(fav.id)}
                                            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-cream-dim/30 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent History */}
                    {history.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-cream-dim/50" />
                                <h2 className="text-cream text-base font-arabic font-bold">
                                    آخر ما قرأت
                                </h2>
                            </div>
                            <div className="space-y-1.5">
                                {history.slice(0, 5).map((item, i) => (
                                    <button
                                        key={item.path + i}
                                        onClick={() => navigate(item.path)}
                                        className="w-full text-right glass-card rounded-xl border border-emerald-border/50 px-4 py-3 flex items-center gap-3 hover:border-gold/20 transition-colors"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold/30 flex-shrink-0" />
                                        <span className="text-cream text-sm font-arabic">{item.name}</span>
                                        <span className="text-cream-dim/30 text-xs font-arabic mr-auto">
                                            {new Date(item.date).toLocaleDateString("ar-SA", { month: "short", day: "numeric" })}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Saved;
