// ============================================================
// الصفحة الرئيسية — تصميم فاخر Google Play Quality
// بطاقات مميزة + رسوم متحركة + أقسام حصن المسلم
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ChevronDown, ChevronUp, Loader2, Search, X } from "lucide-react";
import { ADHKAR_CATEGORIES, AdhkarCategoryInfo, MasterCategory } from "@/lib/adhkar-api";
import { useHisnCategories } from "@/hooks/useAdhkar";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { categories: hisnGroups, loading: hisnLoading } = useHisnCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Filter categories by search
  const filteredGroups = hisnGroups.filter((group) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    if (group.name.toLowerCase().includes(q)) return true;
    return group.subcategories.some((sub) =>
      sub.TITLE.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "var(--gradient-hero)", touchAction: "none" }}
      dir="rtl"
    >
      {/* ── Ambient floating glow ── */}
      <div
        className="ambient-glow"
        style={{
          top: "-5%",
          right: "-10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, hsl(40 52% 55%), transparent 70%)",
        }}
      />
      <div
        className="ambient-glow"
        style={{
          bottom: "20%",
          left: "-15%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, hsl(150 50% 30%), transparent 70%)",
          animationDelay: "4s",
        }}
      />

      {/* ── الترويسة ── */}
      <header className="flex-none px-5 pt-10 pb-3 page-enter">
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1">
            <h1 className="text-gold text-3xl font-arabic font-bold leading-snug">
              حصن المسلم
            </h1>
            <p className="text-cream-dim text-sm font-arabic mt-0.5 leading-relaxed opacity-70">
              أذكار وأدعية من السنة النبوية الشريفة
            </p>
          </div>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-10 h-10 rounded-2xl glass-card-premium border border-emerald-border flex items-center justify-center text-cream-dim hover:text-gold transition-all"
          >
            {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* ── Search Bar ── */}
        {searchOpen && (
          <div className="mt-3 animate-fade-in-up">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-dim" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن دعاء أو ذكر..."
                className="w-full bg-emerald-mid/50 border border-emerald-border rounded-2xl py-3 px-12 text-cream text-sm font-arabic placeholder:text-cream-dim/40 focus:outline-none focus:border-gold/30 transition-colors"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-dim hover:text-cream"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── المحتوى القابل للتمرير ── */}
      <main
        className="flex-1 overflow-y-auto px-4 pb-8"
        style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        <div className="max-w-lg mx-auto space-y-4">
          {/* ── Featured: Morning & Evening ── */}
          <div className="space-y-3">
            {ADHKAR_CATEGORIES.map((cat, i) => (
              <FeaturedCard
                key={cat.id}
                category={cat}
                index={i}
                onNavigate={() => navigate(`/adhkar/${cat.id}`)}
              />
            ))}
          </div>

          {/* ── Islamic ornamental divider ── */}
          <div className="islamic-divider py-1">
            <span className="text-gold text-xs font-arabic px-3">حصن المسلم الشامل</span>
          </div>

          {/* ── Hisn Categories ── */}
          {hisnLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-cream-dim text-sm font-arabic opacity-60">
                لا توجد نتائج لـ "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredGroups.map((group, i) => (
                <HisnGroupCard
                  key={group.id}
                  group={group}
                  index={i}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── التذييل ── */}
      <footer className="flex-none px-4 py-3 text-center">
        <p className="text-cream-dim text-xs font-arabic opacity-30 leading-relaxed">
          ﴿ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ ﴾
        </p>
      </footer>
    </div>
  );
};

// ── بطاقة مميزة (صباح/مساء) — تصميم فاخم ──
interface FeaturedCardProps {
  category: AdhkarCategoryInfo;
  index: number;
  onNavigate: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ category, index, onNavigate }) => {
  const isMorning = category.id === "morning";

  return (
    <button
      onClick={onNavigate}
      className={`card-stagger shimmer-border group relative w-full rounded-3xl overflow-hidden transition-all duration-300 active:scale-[0.97] ${isMorning ? "featured-morning" : "featured-evening"
        }`}
      style={{
        border: "1px solid hsl(40 52% 55% / 0.15)",
        boxShadow: "0 8px 32px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(40 52% 55% / 0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-4 px-6 py-6">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: isMorning
              ? "linear-gradient(135deg, hsl(40 60% 20%), hsl(40 40% 14%))"
              : "linear-gradient(135deg, hsl(240 40% 20%), hsl(240 30% 14%))",
            boxShadow: isMorning
              ? "0 4px 20px hsl(40 52% 55% / 0.2)"
              : "0 4px 20px hsl(240 40% 50% / 0.15)",
          }}
        >
          {isMorning ? (
            <Sun className="w-8 h-8 text-gold" />
          ) : (
            <Moon className="w-8 h-8 text-blue-300" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-right">
          <h3 className="text-cream text-xl font-arabic font-bold leading-snug">
            {category.name}
          </h3>
          <p className="text-cream-dim/60 text-xs font-arabic mt-1.5 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Emoji accent */}
        <span className="text-3xl opacity-80 group-hover:opacity-100 transition-opacity">
          {category.icon}
        </span>
      </div>
    </button>
  );
};

// ── بطاقة مجموعة حصن المسلم (قابلة للتوسيع) — تصميم محسّن ──
interface HisnGroupCardProps {
  group: MasterCategory;
  index: number;
  searchQuery: string;
}

const HisnGroupCard: React.FC<HisnGroupCardProps> = ({ group, index, searchQuery }) => {
  const [expanded, setExpanded] = useState(!!searchQuery);
  const navigate = useNavigate();

  // Filter subcategories by search
  const filteredSubs = searchQuery.trim()
    ? group.subcategories.filter((sub) =>
      sub.TITLE.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    : group.subcategories;

  return (
    <div
      className="card-stagger glass-card-premium rounded-2xl border border-emerald-border overflow-hidden"
      style={{ animationDelay: `${0.1 + index * 0.06}s` }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-right"
      >
        <span className="text-2xl flex-shrink-0">{group.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-cream text-base font-arabic font-bold leading-snug">
            {group.name}
          </h3>
          <p className="text-cream-dim/50 text-xs font-arabic mt-0.5">
            {filteredSubs.length} باب
          </p>
        </div>
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 ${expanded
              ? "bg-gold/15 text-gold rotate-180"
              : "bg-emerald-surface text-cream-dim"
            }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-emerald-border/50 animate-fade-in-up">
          {filteredSubs.map((sub, subIdx) => (
            <button
              key={sub.ID}
              onClick={() => navigate(`/hisn/${sub.ID}`)}
              className="w-full text-right px-6 py-3.5 hover:bg-gold/5 transition-colors flex items-center gap-3 border-b border-emerald-border/20 last:border-b-0"
              style={{
                animation: `card-enter 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${subIdx * 0.03}s backwards`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold/40 flex-shrink-0" />
              <span className="text-cream text-sm font-arabic leading-snug">
                {sub.TITLE}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
