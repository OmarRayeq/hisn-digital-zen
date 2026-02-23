// ============================================================
// الصفحة الرئيسية — تصميم فاخر مع Glassmorphism
// عرض أقسام الصباح/المساء + فئات حصن المسلم الذكية
// ============================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sun, Moon, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { ADHKAR_CATEGORIES, AdhkarCategoryInfo, MasterCategory } from "@/lib/adhkar-api";
import { useHisnCategories } from "@/hooks/useAdhkar";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { categories: hisnGroups, loading: hisnLoading } = useHisnCategories();

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: "var(--gradient-hero)", touchAction: "none" }}
      dir="rtl"
    >
      {/* ── الترويسة ── */}
      <header className="flex-none px-5 pt-10 pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <div className="w-2 h-2 rounded-full bg-gold/70" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-gold text-3xl font-arabic font-bold leading-snug">
            حصن المسلم
          </h1>
          <p className="text-cream-dim text-sm font-arabic mt-1 leading-relaxed">
            أذكار وأدعية من السنة النبوية الشريفة
          </p>
        </div>
      </header>

      {/* ── المحتوى القابل للتمرير ── */}
      <main
        className="flex-1 overflow-y-auto px-4 pb-8"
        style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        <div className="max-w-lg mx-auto space-y-3">
          {/* أقسام الصباح والمساء */}
          <div className="space-y-3">
            {ADHKAR_CATEGORIES.map((cat) => (
              <MainCategoryCard
                key={cat.id}
                category={cat}
                onNavigate={() => navigate(`/adhkar/${cat.id}`)}
              />
            ))}
          </div>

          {/* فاصل */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-emerald-border" />
            <span className="text-cream-dim text-xs font-arabic">حصن المسلم الشامل</span>
            <div className="flex-1 h-px bg-emerald-border" />
          </div>

          {/* فئات حصن المسلم المصنفة */}
          {hisnLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {hisnGroups.map((group) => (
                <HisnGroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── التذييل ── */}
      <footer className="flex-none px-4 py-3 text-center">
        <p className="text-cream-dim text-xs font-arabic opacity-40 leading-relaxed">
          ﴿ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ ﴾
        </p>
      </footer>
    </div>
  );
};

// ── بطاقة قسم رئيسي (صباح/مساء) ──
interface MainCategoryCardProps {
  category: AdhkarCategoryInfo;
  onNavigate: () => void;
}

const MainCategoryCard: React.FC<MainCategoryCardProps> = ({ category, onNavigate }) => {
  const IconComponent = category.id === "morning" ? Sun : Moon;

  return (
    <button
      onClick={onNavigate}
      className="glass-card group relative w-full rounded-2xl border border-emerald-border overflow-hidden transition-all duration-300 hover:border-gold/30 active:scale-[0.98]"
    >
      <div className="flex items-center gap-4 px-5 py-5">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
          <IconComponent className="w-7 h-7 text-gold" />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <h3 className="text-cream text-lg font-arabic font-bold leading-snug">
            {category.name}
          </h3>
          <p className="text-cream-dim/70 text-xs font-arabic mt-1">
            {category.description}
          </p>
        </div>
        <span className="text-2xl">{category.icon}</span>
      </div>
    </button>
  );
};

// ── بطاقة مجموعة حصن المسلم (قابلة للتوسيع) ──
interface HisnGroupCardProps {
  group: MasterCategory;
}

const HisnGroupCard: React.FC<HisnGroupCardProps> = ({ group }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl border border-emerald-border overflow-hidden transition-all duration-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-4 text-right"
      >
        <span className="text-2xl flex-shrink-0">{group.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-cream text-base font-arabic font-bold leading-snug">
            {group.name}
          </h3>
          <p className="text-cream-dim/60 text-xs font-arabic mt-0.5">
            {group.subcategories.length} باب
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-cream-dim flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cream-dim flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-emerald-border divide-y divide-emerald-border">
          {group.subcategories.map((sub) => (
            <button
              key={sub.ID}
              onClick={() => navigate(`/hisn/${sub.ID}`)}
              className="w-full text-right px-5 py-3 hover:bg-emerald-surface/50 transition-colors"
            >
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
